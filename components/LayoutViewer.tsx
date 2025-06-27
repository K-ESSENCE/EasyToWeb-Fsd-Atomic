import {SectionData} from "./types/common/layoutStyle";
import {ImageStyleMap} from "../store/slices/layouts";
import {FULL_API_URL} from "../shared/api/axios";

export interface LayoutViewerProps {
	sectionValues: SectionData[],
	imageStyles: ImageStyleMap;
}

const LayoutViewer = (
		{
			sectionValues,
			imageStyles
		}: LayoutViewerProps) => {

	console.log(imageStyles);

	return (
			<div className="flex flex-col gap-4 p-8  text-black">
				{sectionValues.map((section) => (
						<div
								className="w-full h-[200px] justify-center items-center p-8 border border-gray-200 flex gap-4"
								key={section.sectionKey}
						>
							{section.layoutValues.map((item) => {
								if (item.layoutName === "text") {
									return (
											<div className="text-xl" key={item.id}>
												{item.textValue}
											</div>
									);
								}

								if (item.layoutName === "img") {
									return (
											<div className="w-48 h-full" key={item.id}>
												<img
														className="w-full h-full object-cover"
														alt={`image-${item.id}`}
														src={`${FULL_API_URL}${item.imgValue}?format=WEBP`}
												/>
											</div>
									);
								}

								return null;
							})}
						</div>
				))}
			</div>
	);
};


export default LayoutViewer;