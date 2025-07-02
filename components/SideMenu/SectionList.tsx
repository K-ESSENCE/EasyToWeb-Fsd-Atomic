import React from "react";
import {addLayoutItem} from "../../store/slices/editor";
import {addImageToSection} from "../../store/slices/editor";
import {ELEMENTS} from "./constants";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configureStore";
import {Item} from "../types/common/layout";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../../store/configureStore";
// import { addSection, deleteSection } from "../../store/slices/layouts";
// import { changeNowSectionKey, changeNowItemKey } from "../../store/slices/keys";

const SectionList = ({
	                     searchTerm,
	                     setSearchTerm,
	                     setIsDragging,
	                     isFullscreen,
                     }: {
	searchTerm: string;
	setSearchTerm: (value: string) => void;
	setIsDragging: (value: boolean) => void;
	isFullscreen: boolean;
}) => {
	const dispatch = useDispatch();
	// const sections = useSelector(
	//   (state: RootState) => state.layouts.layoutDatas.sectionValues
	// );
	const selectedSectionKey = useSelector(
			(state: RootState) => state.keys.nowSectionKey
	);

	// const handleAddSection = () => {
	//   const newSectionKey = crypto.randomUUID();
	//   dispatch(
	//     addSection({
	//       newSection: {
	//         sectionKey: newSectionKey,
	//         layoutValues: [],
	//         title: "",
	//       },
	//     })
	//   );
	//   dispatch(changeNowSectionKey(newSectionKey));
	// };

	// const handleDeleteSection = () => {
	//   if (selectedSectionId) {
	//     dispatch(deleteSection({ id: selectedSectionId }));
	//     dispatch(changeNowSectionKey(""));
	//     dispatch(changeNowItemKey(""));
	//   }
	// };

	// const handleSelectSection = (sectionKey: string) => {
	//   dispatch(changeNowSectionKey(sectionKey));
	//   dispatch(changeNowItemKey(""));
	// };

	// useEffect(() => {
	//   const handleKeyDown = (event: KeyboardEvent) => {
	//     if (event.ctrlKey && event.key === "]") {
	//       event.preventDefault();
	//       onClose(!isOpen);
	//     }
	//   };

	//   window.addEventListener("keydown", handleKeyDown);
	//   return () => window.removeEventListener("keydown", handleKeyDown);
	// }, [isOpen, onClose]);

	// if (!isOpen) return null;

	// if (!sections || sections.length === 0) {
	//   return (
	//     <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed left-0 top-0">
	//       <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
	//         <h2 className="text-xl font-bold text-gray-900">섹션 목록</h2>
	//         <button
	//           onClick={() => onClose(false)}
	//           className="text-gray-500 hover:text-gray-700 transition-colors relative group"
	//           title="닫기"
	//         >
	//           <i className="fas fa-times"></i>
	//         </button>
	//       </div>
	//       <div className="overflow-y-auto flex-1 p-2 pb-24">
	//         <div className="space-y-2">
	//           <div className="flex flex-col items-center justify-center h-full p-4 text-center">
	//             <div className="text-gray-500 mb-4">
	//               <i className="fas fa-folder-plus text-4xl"></i>
	//             </div>
	//             <p className="text-gray-600 mb-4">
	//               아직 생성된 섹션이 없습니다.
	//               <br />
	//               새로운 섹션을 추가해보세요.
	//             </p>
	//           </div>
	//         </div>
	//       </div>
	//       <div className="p-4 border-t border-gray-200 absolute bottom-16 w-full bg-gray-50">
	//         <button
	//           onClick={handleAddSection}
	//           className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-md"
	//         >
	//           <i className="fas fa-plus"></i>새 섹션 만들기
	//         </button>
	//       </div>
	//     </div>
	//   );
	// }

	// return (
	//   <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed left-0 top-0">
	//     <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
	//       <h2 className="text-xl font-bold text-gray-900">섹션 목록</h2>
	//       <div className="flex items-center space-x-2">
	//         <button
	//           onClick={handleDeleteSection}
	//           className="text-gray-500 hover:text-gray-700 transition-colors relative group"
	//           title="섹션 삭제"
	//           disabled={!selectedSectionId}
	//         >
	//           <i className="fas fa-trash"></i>
	//         </button>
	//         <button
	//           onClick={() => onClose(false)}
	//           className="text-gray-500 hover:text-gray-700 transition-colors relative group"
	//           title="닫기"
	//         >
	//           <i className="fas fa-times"></i>
	//         </button>
	//       </div>
	//     </div>

	//     <div className="overflow-y-auto flex-1 p-2 pb-24">
	//       <div className="space-y-2">
	//         {sections.map((section, index) => (
	//           <div
	//             key={section.sectionKey}
	//             className={`p-4 rounded-xl border cursor-pointer transition-colors
	//               ${
	//                 selectedSectionId === section.sectionKey
	//                   ? "bg-blue-50 border-blue-200 hover:bg-blue-100"
	//                   : "bg-white border-gray-200 hover:bg-gray-50"
	//               }`}
	//             onClick={() => handleSelectSection(section.sectionKey)}
	//           >
	//             <div className="flex items-center justify-between">
	//               <span
	//                 className={`font-medium ${
	//                   selectedSectionId === section.sectionKey
	//                     ? "text-blue-700"
	//                     : "text-gray-900"
	//                 }`}
	//               >
	//                 {section.title || `섹션 ${index + 1}`}
	//               </span>
	//               {selectedSectionId === section.sectionKey && (
	//                 <span className="text-blue-600 text-sm">선택됨</span>
	//               )}
	//             </div>
	//           </div>
	//         ))}
	//       </div>
	//     </div>

	//     <div className="p-4 border-t border-gray-200 absolute bottom-16 w-full bg-gray-50">
	//       <button
	//         onClick={handleAddSection}
	//         className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-md"
	//       >
	//         <i className="fas fa-plus"></i>새 섹션 만들기
	//       </button>
	//     </div>
	//   </div>
	// );

	const handleElementClick = (label: string) => {
		if (!selectedSectionKey) return;

		if (label === "이미지") {
			dispatch(
					addImageToSection(
							{sectionKey: selectedSectionKey}
					)
			);

		} else if (label === "텍스트") {
			const newTextItem: Item = {
				id: crypto.randomUUID(),
				type: 'text',
				componentProps: {
					text: '텍스트를 입력하세요'
				}
			};

			dispatch(
					addLayoutItem({
						id: selectedSectionKey,
						newItem: newTextItem,
					})
			);
		}
	};

	return (
			<aside
					className={`w-64 bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isFullscreen ? "hidden" : ""}`}
			>
				<div className="p-4 border-b border-gray-200">
					<div className="relative">
						<input
								type="text"
								placeholder="컴포넌트 검색"
								className="text-black w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<i className="fas fa-search absolute left-3 top-2.5 text-gray-400 text-sm"></i>
					</div>
				</div>
				<div className="flex-1 overflow-y-auto">
					<div className="p-4">
						<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
							기본 요소
						</h3>
						<div className="space-y-2">
							{ELEMENTS.map((item) => (
									<div
											key={item.label}
											className="p-3 rounded-lg border border-gray-200 cursor-pointer flex items-center hover:bg-gray-50"
											// draggable="true"
											// onDragStart={(e) => {
											// e.dataTransfer.setData("text/plain", item);
											// setIsDragging(true);
											// }}
											// onDragEnd={() => setIsDragging(false)}

											onClick={() => handleElementClick(item.label)}
									>
										<i
												className={`fas fa-${
														item.label === "텍스트"
																? "font"
																: item.label === "버튼"
																		? "square"
																		: item.label === "이미지"
																				? "image"
																				: item.label === "아이콘"
																						? "icons"
																						: "minus"
												} text-gray-500 mr-3`}
										></i>
										<span className="text-sm text-gray-700">{item.label}</span>
									</div>
							))}
						</div>
					</div>
					<div className="p-4">
						<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
							레이아웃 요소
						</h3>
						<div className="space-y-2">
							{[
								"컨테이너",
								// "그리드", "플렉스 박스", "카드"
							].map((item) => (
									<div
											key={item}
											id={`component-${item}`}
											className="p-3 rounded-lg border border-gray-200 cursor-move flex items-center hover:bg-gray-50"
											draggable="true"
											onDragStart={(e) => {
												e.dataTransfer.setData("text/plain", item);
												setIsDragging(true);
											}}
											onDragEnd={() => setIsDragging(false)}
									>
										<i
												className={`fas fa-${
														item === "컨테이너"
																? "square-full"
																: item === "그리드"
																		? "th-large"
																		: item === "플렉스 박스"
																				? "boxes-stacked"
																				: "credit-card"
												} text-gray-500 mr-3`}
										></i>
										<span className="text-sm text-gray-700">{item}</span>
									</div>
							))}
						</div>
					</div>
					{/* <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        입력 폼 요소
      </h3>
      <div className="space-y-2">
        {[
          "입력 필드",
          "체크박스",
          "라디오 버튼",
          "드롭다운",
          "텍스트 영역",
        ].map((item) => (
          <div
            key={item}
            className="p-3 rounded-lg border border-gray-200 cursor-move flex items-center hover:bg-gray-50"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", item);
              setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
          >
            <i
              className={`fas fa-${
                item === "입력 필드"
                  ? "keyboard"
                  : item === "체크박스"
                    ? "check-square"
                    : item === "라디오 버튼"
                      ? "circle-dot"
                      : item === "드롭다운"
                        ? "caret-down"
                        : "align-left"
              } text-gray-500 mr-3`}
            ></i>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div> */}
					{/* <div className="p-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        네비게이션 요소
      </h3>
      <div className="space-y-2">
        {["메뉴바", "사이드바", "탭", "페이지네이션"].map((item) => (
          <div
            key={item}
            className="p-3 rounded-lg border border-gray-200 cursor-move flex items-center hover:bg-gray-50"
            draggable="true"
            onDragStart={(e) => {
              e.dataTransfer.setData("text/plain", item);
              setIsDragging(true);
            }}
            onDragEnd={() => setIsDragging(false)}
          >
            <i
              className={`fas fa-${
                item === "메뉴바"
                  ? "bars"
                  : item === "사이드바"
                    ? "columns"
                    : item === "탭"
                      ? "folder"
                      : "ellipsis-h"
              } text-gray-500 mr-3`}
            ></i>
            <span className="text-sm text-gray-700">{item}</span>
          </div>
        ))}
      </div>
    </div> */}
				</div>
			</aside>
	);
};

export default SectionList;
