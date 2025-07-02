import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configureStore";
import {Item} from "../types/common/layout";
import {updateCommonStyle} from "../../store/slices/editor";

const CommonMenu = ({ item }: { item: Item }) => {
	const dispatch = useDispatch();
	const commonStyle = item.commonStyle || {};

	const nowSectionKey = useSelector(
			(state: RootState) => state.keys.nowSectionKey
	);

	const handleChange = (style: Partial<typeof commonStyle>) => {
		dispatch(
				updateCommonStyle({
					sectionKey: nowSectionKey,
					itemId: item.id,
					style,
				})
		);
	};

	return (
			<div className="space-y-6">
				<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
					공통 스타일
				</h3>

				{/* 배경색 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">배경색</label>
					<div className="flex items-center gap-2">
						<input
								type="color"
								value={commonStyle.backgroundColor || "#ffffff"}
								onChange={(e) => handleChange({ backgroundColor: e.target.value })}
								className="w-10 h-8 p-0 border border-gray-300 rounded"
						/>
						{commonStyle.backgroundColor && (
								<button
										onClick={() => handleChange({ backgroundColor: undefined })}
										className="text-xs text-gray-500 hover:text-red-500 border px-2 py-1 rounded"
								>
									초기화
								</button>
						)}
					</div>
				</div>

				{/* 너비 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">너비</label>
					<input
							type="text"
							value={commonStyle.width || ""}
							onChange={(e) => handleChange({ width: e.target.value })}
							placeholder="예: 100%, 200px"
							className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 높이 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">높이</label>
					<input
							type="text"
							value={commonStyle.height || ""}
							onChange={(e) => handleChange({ height: e.target.value })}
							placeholder="예: auto, 150px"
							className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 마진 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">마진</label>
					<input
							type="text"
							value={commonStyle.margin || ""}
							onChange={(e) => handleChange({ margin: e.target.value })}
							className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 패딩 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">패딩</label>
					<input
							type="text"
							value={commonStyle.padding || ""}
							onChange={(e) => handleChange({ padding: e.target.value })}
							className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>


				{/* 모서리 반경 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">모서리 반경</label>
					<input
							type="text"
							value={commonStyle.borderRadius || ""}
							onChange={(e) => handleChange({ borderRadius: e.target.value })}
							placeholder="예: 8px, 1rem"
							className="flex-1 border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>
			</div>
	);
};

export default CommonMenu;