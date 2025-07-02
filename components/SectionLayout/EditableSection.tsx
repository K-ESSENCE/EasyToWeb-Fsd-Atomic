import CardFrame from "../Cards/CardFrame";
import {Section} from "../types/common/layout";
import React from "react";

interface EditableSectionProps {
	section: Section;
}

const EditableSection = ({
	                         section
                         }: EditableSectionProps) => {

	const layout = section.layout || {};
	const style = section.style || {};
	const bg = section.backgroundStyle || {};

	const sectionStyle: React.CSSProperties = {
		display: layout.type === "flex" ? "flex" : layout.type === "grid" ? "grid" : undefined,
		gridTemplateColumns: layout.type === "grid" && layout.columns ? `repeat(${layout.columns}, 1fr)` : undefined,
		flexDirection: layout.type === "flex" ? "row" : undefined,
		justifyContent: layout.justifyContent || (layout.align === "center" ? "center" : layout.align === "right" ? "flex-end" : "flex-start"),
		alignItems: layout.alignItems || "center",
		gap: layout.gap ? `${layout.gap}px` : undefined,
		height: layout.height,
		padding: style.padding,
		margin: style.margin,
		borderRadius: style.borderRadius,
		backgroundColor: bg.backgroundColor,
		backgroundImage: bg.backgroundImage ? `url(${bg.backgroundImage})` : undefined,
		backgroundSize: bg.backgroundSize,
		backgroundPosition: bg.backgroundPosition,
		backgroundRepeat: bg.backgroundRepeat,
		transition: "all 0.3s ease",
	};


	return (
			<section
					className={`transition-all duration-400 w-full`}
					style={sectionStyle}
			>
				{
						(section.items) && section.items.map((item) => {
							return (
									<CardFrame
											key={item.id}
											item={item}
									/>
							);
						})
				}
			</section>
	);
};

export default EditableSection;
