import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {RootState} from "../store/configureStore";
import {PageLayoutStyle, updatePageLayoutStyle} from "../store/slices/editor";
import BaseModal from "./BaseModal";
import {UseModalReturnType} from "../hooks/useModal";

interface PageLayoutModalProps {
	modal: UseModalReturnType
}

const PageLayoutModal = ({ modal }: PageLayoutModalProps) => {
	const dispatch = useDispatch();
	const currentStyle = useSelector(
			(state: RootState) => state.layouts.layouts[0].layoutStyle
	);

	const [style, setStyle] = useState<PageLayoutStyle>(currentStyle || {});

	const handleChange = (field: keyof PageLayoutStyle, value?: string) => {
		setStyle((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSave = () => {
		dispatch(updatePageLayoutStyle(style));
		modal.close();
	};

	return (
			<BaseModal modal={modal} widthClass="w-[500px]">
				<div className="p-5 text-black space-y-6">
					<h2 className="text-lg font-semibold">페이지 레이아웃 설정</h2>

					{/* 최대 너비 */}
					<div className="flex items-center justify-between gap-2">
						<label className="text-sm w-32 text-gray-700">최대 너비</label>
						<input
								type="text"
								placeholder="예: 1200px"
								value={style.maxWidth || ""}
								onChange={(e) => handleChange("maxWidth", e.target.value)}
								className="flex-1 border rounded px-3 py-1 text-sm"
						/>
						<button
								onClick={() => handleChange("maxWidth", undefined)}
								className="text-xs text-gray-400 hover:text-red-500"
								title="초기화"
						>
							<i className="fas fa-undo"></i>
						</button>
					</div>

					{/* 패딩 */}
					<div className="flex items-center justify-between gap-2">
						<label className="text-sm w-32 text-gray-700">양쪽 패딩</label>
						<input
								type="text"
								placeholder="예: 0 20px"
								value={style.padding || ""}
								onChange={(e) => handleChange("padding", e.target.value)}
								className="flex-1 border rounded px-3 py-1 text-sm"
						/>
						<button
								onClick={() => handleChange("padding", undefined)}
								className="text-xs text-gray-400 hover:text-red-500"
								title="초기화"
						>
							<i className="fas fa-undo"></i>
						</button>
					</div>

					{/* 섹션 간 간격 */}
					<div className="flex items-center justify-between gap-2">
						<label className="text-sm w-32 text-gray-700">섹션 간격</label>
						<input
								type="text"
								placeholder="예: 40px"
								value={style.gapBetweenSections || ""}
								onChange={(e) => handleChange("gapBetweenSections", e.target.value)}
								className="flex-1 border rounded px-3 py-1 text-sm"
						/>
						<button
								onClick={() => handleChange("gapBetweenSections", undefined)}
								className="text-xs text-gray-400 hover:text-red-500"
								title="초기화"
						>
							<i className="fas fa-undo"></i>
						</button>
					</div>

					{/* 배경색 */}
					<div className="flex items-center justify-between gap-4">
						<label className="text-sm w-32 text-gray-700">배경색</label>
						<div className="flex items-center gap-2">
							<input
									type="color"
									value={style.backgroundColor || "#ffffff"}
									onChange={(e) => handleChange("backgroundColor", e.target.value)}
									className="w-10 h-8 p-0 border border-gray-300 rounded"
							/>
							<button
									onClick={() => handleChange("backgroundColor", undefined)}
									className="text-xs text-gray-400 hover:text-red-500"
									title="초기화"
							>
								<i className="fas fa-undo"></i>
							</button>
						</div>
					</div>

					{/* 버튼 */}
					<div className="flex justify-end gap-3 pt-6 border-t">
						<button
								onClick={modal.close}
								className="px-4 py-1.5 rounded border text-sm text-gray-600 hover:bg-gray-100"
						>
							닫기
						</button>
						<button
								onClick={handleSave}
								className="px-4 py-1.5 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
						>
							저장
						</button>
					</div>
				</div>
			</BaseModal>
	);
};

export default PageLayoutModal;