import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {updateImageStyle} from "../../store/slices/editor";
import {ImageStyle, Item} from "../types/common/layout";
import {RootState} from "../../store/configureStore";

interface ImageMenuProps {
	item: Item
}

const ImageMenu = ({
	                   item
                   }: ImageMenuProps) => {
	const dispatch = useDispatch();

	const imageStyle = item.type === "img" ? item.componentProps.imageStyle || {} : {};
	const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);

	const handleChange = (style: Partial<typeof imageStyle>) => {
		dispatch(
				updateImageStyle({
					sectionKey: nowSectionKey,
					itemId: item.id,
					style,
				})
		);
	};

	return (
			<div className="space-y-6">
				<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
					이미지 스타일
				</h3>

				{/* 테두리 색 */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<label className="text-sm text-gray-700 w-24">테두리 색</label>
						<input
								type="color"
								value={imageStyle.borderColor || "#000000"}
								onChange={(e) => handleChange({borderColor: e.target.value})}
								className="w-8 h-8 p-0 border rounded"
						/>
					</div>
				</div>

				{/* 테두리 스타일 / 두께 */}
				<div className="flex flex-col gap-3">
					<div className="flex items-center justify-between">
						<label className="text-sm text-gray-700 w-24">테두리 스타일</label>
						<select
								value={imageStyle.borderStyle || "solid"}
								onChange={(e) => handleChange({borderStyle: e.target.value})}
								className="flex-1 border rounded px-2 py-1"
						>
							<option value="solid">실선</option>
							<option value="dashed">점선</option>
							<option value="dotted">점점선</option>
							<option value="double">이중선</option>
							<option value="none">없음</option>
						</select>
					</div>
					<div className="flex items-center justify-between">
						<label className="text-sm text-gray-700 w-24">두께</label>
						<input
								type="number"
								min={0}
								max={20}
								value={imageStyle.borderWidth || 0}
								onChange={(e) => handleChange({borderWidth: Number(e.target.value)})}
								className="w-24 border rounded px-2 py-1"
						/>
					</div>
				</div>

				{/* 모서리 반경 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">모서리 반경</label>
					<input
							type="range"
							min={0}
							max={50}
							value={imageStyle.borderRadius || 0}
							onChange={(e) => handleChange({borderRadius: Number(e.target.value)})}
							className="w-full"
					/>
					<div className="flex justify-between text-xs text-gray-500 mt-1">
						<span>0px</span>
						<span>25px</span>
						<span>50px</span>
					</div>
				</div>

				{/* 투명도 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">투명도</label>
					<input
							type="range"
							min={0}
							max={100}
							value={Math.round((imageStyle.opacity ?? 1) * 100)}
							onChange={(e) => handleChange({opacity: Number(e.target.value) / 100})}
							className="w-full"
					/>
					<div className="flex justify-between text-xs text-gray-500 mt-1">
						<span>0%</span>
						<span>50%</span>
						<span>100%</span>
					</div>
				</div>

				{/* 객체 맞춤 (objectFit) */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">이미지 맞춤</label>
					<select
							value={imageStyle.objectFit || "cover"}
							onChange={(e) => handleChange({objectFit: e.target.value as ImageStyle["objectFit"]})}
							className="w-full border rounded px-2 py-1"
					>
						<option value="cover">cover</option>
						<option value="contain">contain</option>
						<option value="fill">fill</option>
						<option value="none">none</option>
						<option value="scale-down">scale-down</option>
					</select>
				</div>

				{/* 그림자 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">그림자 (boxShadow)</label>
					<input
							type="text"
							value={imageStyle.boxShadow || ""}
							onChange={(e) => handleChange({boxShadow: e.target.value})}
							className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
							placeholder="예: 0px 4px 10px rgba(0,0,0,0.1)"
					/>
				</div>
			</div>
	);
};

export default ImageMenu;