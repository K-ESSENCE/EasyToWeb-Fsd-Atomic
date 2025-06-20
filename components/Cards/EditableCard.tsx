import React, { useState, useEffect } from "react";
import { CardStyleI } from "./../../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/configureStore";
import { updateImageUrl, updateTextContent } from "../../store/slices/layouts";
import { changeNowItemKey } from "../../store/slices/keys";
import EditableText from "./EditableText";
import EditableImage from "./EditableImage";

interface DefaultProps {
  shapeStyleValues: CardStyleI;
  itemKey: string;
  imageUrlsMap?: any; // Y.Map<any> 타입
}

const EditableCard = ({
  shapeStyleValues,
  itemKey,
  imageUrlsMap,
}: DefaultProps) => {
  const TEXT_PLACEHOLDER = "여기에 텍스트를 입력하세요.";

  const [selectedImageData, setSelectedImageData] = useState<string | null>(
    null
  );
  const [textContent, setTextContent] = useState<string>(TEXT_PLACEHOLDER);
  const nowSectionKey = useSelector(
    (state: RootState) => state.keys.nowSectionKey
  );
  const sections = useSelector(
    (state: RootState) => state.layouts.layoutDatas.sectionValues
  );

  // Find the item across all sections
  const currentItem = sections
    .flatMap((section) => section.layoutValues)
    .find((item) => item.id === itemKey);

  const dispatch = useDispatch();

  useEffect(() => {
    if (currentItem?.textValue || currentItem?.textValue === "") {
      setTextContent(currentItem.textValue!);
    } else {
      setTextContent(TEXT_PLACEHOLDER);
    }
  }, [currentItem?.textValue]);

  const handleTextChange = (newText: string) => {
    setTextContent(newText);
    dispatch(
      updateTextContent({
        sectionKey: nowSectionKey,
        itemId: itemKey,
        textContent: newText,
      })
    );
  };

  const handleImageChange = (file: File, imageUrl: string) => {
    setSelectedImageData(imageUrl);
    dispatch(changeNowItemKey(itemKey));
    dispatch(
      updateImageUrl({
        sectionKey: nowSectionKey,
        itemId: itemKey,
        imageUrl: imageUrl,
      })
    );
  };

  const imageUrl = selectedImageData || currentItem?.imgValue;

  if (currentItem?.layoutName === "text") {
    return (
      <EditableText textContent={textContent} onTextChange={handleTextChange} />
    );
  } else {
    return (
      <EditableImage
        imageUrl={imageUrl}
        onImageChange={handleImageChange}
        shapeStyleValues={shapeStyleValues}
        itemKey={itemKey}
        imageUrlsMap={imageUrlsMap}
      />
    );
  }
};

export default EditableCard;
