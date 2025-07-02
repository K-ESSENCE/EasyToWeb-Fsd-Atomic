import {useDispatch} from "react-redux";
import {BackgroundStyle, LayoutConfig, Section} from "../types/common/layout";
import {
	updateLayoutConfig,
	updateSectionBackground,
	updateSectionStyle
} from "../../store/slices/editor";

interface SectionMenuProps {
	section: Section;
}

const SectionMenu = ({ section }: SectionMenuProps) => {
	const dispatch = useDispatch();

	const layout = section.layout || {};
	const style = section.style || {};
	const bg = section.backgroundStyle || {};
	const sectionKey = section.sectionKey;

	const handleLayoutChange = (change: Partial<typeof layout>) => {
		dispatch(updateLayoutConfig({ sectionKey, layout: { ...layout, ...change } }));
	};

	const handleStyleChange = (change: Partial<typeof style>) => {
		dispatch(updateSectionStyle({ sectionKey, style: { ...style, ...change } }));
	};

	const handleBgChange = (change: Partial<typeof bg>) => {
		dispatch(updateSectionBackground({ sectionKey, background: { ...bg, ...change } }));
	};

	return (
			<div className="space-y-6">
				<h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">섹션 스타일</h3>

				{/* 레이아웃 타입 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">레이아웃 타입</label>
					<select
							value={layout.type}
							onChange={(e) => handleLayoutChange({type: e.target.value as LayoutConfig["type"]})}
							className="w-full border rounded px-2 py-1"
					>
						<option value="grid">Grid</option>
						<option value="flex">Flex</option>
						{/*<option value="absolute">Absolute</option>*/}
					</select>
				</div>

				{/* 컬럼 수 */}
				{layout.type === "grid" && (
						<div className="flex items-center justify-between gap-4">
							<label className="text-sm text-gray-700 w-24">컬럼 수</label>
							<input
									type="number"
									min={1}
									max={12}
									value={layout.columns || 1}
									onChange={(e) => handleLayoutChange({columns: Number(e.target.value)})}
									className="flex-1 border rounded px-3 py-1 text-sm"
							/>
						</div>
				)}

				{/* 높이 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">높이</label>
					<input
							type="text"
							value={layout.height || ""}
							onChange={(e) => handleLayoutChange({height: e.target.value})}
							placeholder="예: auto, 600px"
							className="flex-1 border rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 정렬 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">정렬</label>
					<div className="flex gap-2">
						{["left", "center", "right"].map((align) => (
								<button
										key={align}
										onClick={() => handleLayoutChange({align: align as LayoutConfig["align"]})}
										className={`flex-1 text-sm py-1 rounded border ${
												layout.align === align ? "bg-blue-500 text-white" : "bg-white text-gray-600"
										}`}
								>
									{align === "left" ? "왼쪽" : align === "center" ? "가운데" : "오른쪽"}
								</button>
						))}
					</div>
				</div>

				{/* 위아래 정렬 */}
				<div className="flex flex-col gap-2">
					<label className="text-sm font-medium text-gray-700">위아래 정렬</label>
					<select
							value={section.layout.alignItems || "center"}
							onChange={(e) => handleLayoutChange({ alignItems: e.target.value as LayoutConfig["alignItems"] })}
							className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
					>
						<option value="flex-start">위쪽 정렬</option>
						<option value="center">중앙 정렬</option>
						<option value="flex-end">아래 정렬</option>
						<option value="stretch">전체 늘리기</option>
						<option value="baseline">기준선 정렬</option>
					</select>
				</div>

				{/* 간격 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">간격</label>
					<input
							type="number"
							min={0}
							max={100}
							value={layout.gap || 0}
							onChange={(e) => handleLayoutChange({gap: Number(e.target.value)})}
							className="flex-1 border rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 섹션 패딩 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">패딩</label>
					<input
							type="text"
							value={style.padding || ""}
							onChange={(e) => handleStyleChange({padding: e.target.value})}
							placeholder="예: 20px"
							className="flex-1 border rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 섹션 마진 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">마진</label>
					<input
							type="text"
							value={style.margin || ""}
							onChange={(e) => handleStyleChange({margin: e.target.value})}
							className="flex-1 border rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 모서리 반경 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">모서리 반경</label>
					<input
							type="text"
							value={style.borderRadius || ""}
							onChange={(e) => handleStyleChange({borderRadius: e.target.value})}
							className="flex-1 border rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 배경색 */}
				<div className="flex items-center justify-between gap-4">
					<label className="text-sm text-gray-700 w-24">배경색</label>
					<div className="flex items-center gap-2">
						<input
								type="color"
								value={bg.backgroundColor || "#ffffff"}
								onChange={(e) => handleBgChange({backgroundColor: e.target.value})}
								className="w-10 h-8 p-0 border border-gray-300 rounded"
						/>
						{bg.backgroundColor && (
								<button
										onClick={() => handleBgChange({backgroundColor: undefined})}
										className="text-xs text-gray-500 hover:text-red-500 border px-2 py-1 rounded"
								>
									초기화
								</button>
						)}
					</div>
				</div>

				{/* 배경 이미지 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">배경 이미지</label>
					<input
							type="text"
							value={bg.backgroundImage || ""}
							onChange={(e) => handleBgChange({backgroundImage: e.target.value})}
							placeholder="URL 또는 base64"
							className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>

				{/* 배경 크기 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">배경 크기</label>
					<select
							value={bg.backgroundSize || "cover"}
							onChange={(e) => handleBgChange({backgroundSize: e.target.value as BackgroundStyle["backgroundSize"]})}
							className="w-full border rounded px-2 py-1"
					>
						<option value="cover">cover</option>
						<option value="contain">contain</option>
					</select>
				</div>

				{/* 배경 반복 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">배경 반복</label>
					<select
							value={bg.backgroundRepeat || "no-repeat"}
							onChange={(e) => handleBgChange({backgroundRepeat: e.target.value as BackgroundStyle["backgroundRepeat"]})}
							className="w-full border rounded px-2 py-1"
					>
						<option value="no-repeat">no-repeat</option>
						<option value="repeat">repeat</option>
						<option value="repeat-x">repeat-x</option>
						<option value="repeat-y">repeat-y</option>
					</select>
				</div>

				{/* 배경 위치 */}
				<div>
					<label className="block text-sm text-gray-700 mb-1">배경 위치</label>
					<input
							type="text"
							value={bg.backgroundPosition || "center"}
							onChange={(e) => handleBgChange({backgroundPosition: e.target.value})}
							placeholder="예: center, top left"
							className="w-full border border-gray-300 rounded px-3 py-1 text-sm"
					/>
				</div>
			</div>
	);
};

export default SectionMenu;