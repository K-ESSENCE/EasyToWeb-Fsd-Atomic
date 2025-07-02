import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configureStore";
import {deleteLayoutItem, deleteSection} from "../../store/slices/editor";
import ImageMenu from "./ImageMenu";
import TextMenu from "./TextMenu";
import CommonMenu from "./CommonMenu";
import {changeNowItemKey, changeNowSectionKey} from "../../store/slices/keys";
import SectionMenu from "./SectionMenu";

const SideMenu = ({isFullscreen}: { isFullscreen: boolean }) => {
	const dispatch = useDispatch();

	const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
	const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);


	const selectedSection = useSelector((state: RootState) =>
			state.layouts.layouts[0].sections.find(
					(section) => section.sectionKey === nowSectionKey
			)
	);

	const selectedItem = selectedSection?.items.find(
			(item) => item.id === selectedItemKey
	);

	const handleDeleteItem = () => {
		if (nowSectionKey && selectedItemKey) {
			dispatch(
					deleteLayoutItem({sectionId: nowSectionKey, itemId: selectedItemKey})
			);
			dispatch(changeNowItemKey(""));
		}
	};

	const handleDeleteSection = () => {
		if (nowSectionKey) {
			dispatch(deleteSection({id: nowSectionKey}));
		}
		dispatch(changeNowSectionKey(""));
		dispatch(changeNowItemKey(""));
	};

	const handleCancelSelect = () => {
		dispatch(changeNowSectionKey(""));
		dispatch(changeNowItemKey(""));
	}

	return (
			<aside
					className={`w-72 bg-white border-l border-gray-200 overflow-y-auto transition-all duration-300 ${isFullscreen ? "hidden" : ""}`}
			>
				{nowSectionKey && (
						<div className="p-4 border-b border-gray-100">
							<div className="flex items-center gap-2">
								<button
										onClick={handleCancelSelect}
										className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
								>
									선택 취소
								</button>
								<button
										onClick={handleDeleteSection}
										className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-xs"
								>
									섹션 삭제
								</button>
								{
										selectedItemKey && (
												<button
														onClick={handleDeleteItem}
														className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
												>
													아이템 삭제
												</button>
										)
								}
							</div>
						</div>
				)}

				{
					selectedItem ? (
							<div className="p-4 text-black space-y-6">
								{selectedItem.type === "img" && <ImageMenu item={selectedItem}/>}
								{selectedItem.type === "text" && <TextMenu item={selectedItem}/>}
								<CommonMenu item={selectedItem}/>
							</div>
					) : selectedSection ? (
							<div className="p-4 text-black space-y-6">
								<SectionMenu section={selectedSection}/>
							</div>
					) : (
							<div className="h-full flex items-center justify-center p-6">
								<div className="text-center">
									<div className="text-gray-400 mb-3">
										<i className="fas fa-hand-pointer text-5xl"></i>
									</div>
									<p className="text-gray-500 text-lg font-medium">요소를 선택하세요</p>
									<p className="text-gray-400 text-sm mt-2">
										편집할 요소를 선택하면 여기에 속성이 표시됩니다
									</p>
								</div>
							</div>
					)
				}
			</aside>
	);
};

export default SideMenu;
