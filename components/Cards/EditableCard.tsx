import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configureStore";
import {updateImageUrl, updateTextContent} from "../../store/slices/editor";
import {changeNowItemKey} from "../../store/slices/keys";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";
import {HelpPopover} from "../HelpPopover";
import {Item} from "../types/common/layout";

interface EditableCardProps {
	item: Item;
}

const EditableCard = ({item}: EditableCardProps) => {
	const dispatch = useDispatch();

	const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
	const selectedSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);

	const isSelected = item.id === selectedItemKey;

	const handleTextChange = (newText: string) => {
		dispatch(
				updateTextContent({
					sectionKey: selectedSectionKey,
					itemId: item.id,
					textContent: newText,
				})
		);
	};

	const handleImageChange = (file: File, imageUrl: string) => {
		dispatch(changeNowItemKey(item.id));
		dispatch(
				updateImageUrl({
					sectionKey: selectedSectionKey,
					itemId: item.id,
					imageUrl,
				})
		);
	};

	return (
			<div className="relative w-full">
				{isSelected && <HelpPopover/>}

				<div className="w-full">
					{item.type === "text" ? (
							<EditableText item={item} onTextChange={handleTextChange}/>
					) : item.type === "img" ? (
							<EditableImage item={item} onImageChange={handleImageChange}/>
					) : (
							<div className="text-sm text-gray-400">
								지원되지 않는 타입입니다: {item.type}
							</div>
					)}
				</div>
			</div>
	);
};

export default EditableCard;