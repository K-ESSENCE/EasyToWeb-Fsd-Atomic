import React from "react";
import SectionFrame from "../SectionLayout/SectionFrame";
import {Section} from "../types/common/layout";
import {useSelector} from "react-redux";
import {RootState} from "../../store/configureStore";

interface MainContentProps {
	sections: Section[];
}

const MainContent = ({
	                     sections
                     }: MainContentProps) => {
	const currentStyle = useSelector(
			(state: RootState) => state.layouts.layouts[0].layoutStyle
	);

	const style: React.CSSProperties = {
		maxWidth: currentStyle?.maxWidth || "100%",
		padding: currentStyle?.padding || "2rem 1.5rem",
		backgroundColor: currentStyle?.backgroundColor,
		gap: currentStyle?.gapBetweenSections || "1.5rem",
	};


	return (
			<div
					className="flex flex-col transition-all duration-200 min-h-screen overflow-y-auto mb-[80px]"
					style={style}
			>
				{
					sections.map((section, key) => (
							<div key={key}>
								<SectionFrame section={section}/>
							</div>

					))
				}
			</div>
	);
};


export default MainContent;
