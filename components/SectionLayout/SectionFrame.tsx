import SelectableFrame from "../SelectableFrame";
import EditableSection from "./EditableSection";
import {useDispatch, useSelector} from "react-redux";
import {changeNowItemKey, changeNowSectionKey} from "../../store/slices/keys";
import {Section} from "../types/common/layout";
import {RootState} from "../../store/configureStore";


interface SectionFrameProps {
	section: Section;
}

const SectionFrame = ({
	                      section
                      }: SectionFrameProps) => {
	const dispatch = useDispatch();
	const selectedSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);

	const onChangeKey = (key: string) => {
		dispatch(changeNowSectionKey(key));
		dispatch(changeNowItemKey(""));
	};

	return (
			<SelectableFrame
					thisKey={section.sectionKey}
					selectedKey={selectedSectionKey}
					changeKey={onChangeKey}
			>
				{
						(section.items.length <= 0) && (
								<>
									<p className="text-gray-400 text-lg font-medium">
										이 컨테이너를 선택후 요소를 추가하세요
									</p>
									<p className="text-gray-400 text-sm mt-2">
										왼쪽 패널에서 원하는 요소를 선택하여 드래그하세요
									</p>
								</>
						)
				}
				{
					(section.items.length > 0) && (
								<EditableSection section={section}/>
						)
				}

			</SelectableFrame>
	);
};

export default SectionFrame;
