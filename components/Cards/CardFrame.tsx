import EditableCard from "./EditableCard";
import SelectableFrame from "../SelectableFrame";
import {useDispatch, useSelector} from "react-redux";
import {changeNowItemKey, changeNowSectionKey} from "../../store/slices/keys";
import {RootState} from "../../store/configureStore";
import {Item} from "../types/common/layout";

interface CardFrameProps {
	item: Item
}

const CardFrame = ({
	                   item
                   }: CardFrameProps) => {
	const dispatch = useDispatch();

	const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
	const sections = useSelector((state: RootState) => state.layouts.layouts[0].sections);



	const onChangeKey = (itemKey: string) => {
		const sectionKey = findItemSection(itemKey);
		if (sectionKey) {
			dispatch(changeNowSectionKey(sectionKey));
			dispatch(changeNowItemKey(itemKey));
		}
	};

	const findItemSection = (itemKey: string) => {
		const foundSection = sections.find((section) =>
				section.items.some((item) => item.id === itemKey)
		);
		return foundSection ? foundSection.sectionKey : null;
	};

	return (
			<SelectableFrame
					isItem={true}
					thisKey={item.id}
					changeKey={onChangeKey}
					selectedKey={selectedItemKey}
			>
				<EditableCard item={item}/>
			</SelectableFrame>
	);
};

export default CardFrame;

