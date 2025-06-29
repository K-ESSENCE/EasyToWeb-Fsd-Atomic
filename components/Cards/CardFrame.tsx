import EditableCard from "./EditableCard";
import SelectableFrame from "../SelectableFrame";
import { useDispatch, useSelector } from "react-redux";
import { Shapes, TextStyleI } from "../types/common/layoutStyle";
import { getShapeStyleValues } from "../../utils/utils";
import { changeNowItemKey, changeNowSectionKey } from "../../store/slices/keys";
import { RootState } from "../../store/configureStore";

interface DefaultProps {
  shapeType: Shapes;
  itemKey: string;
  selctedItemkey: string | null;

  titleStyle?: TextStyleI;
  describe?: TextStyleI;
  imageUrlsMap?: any; // Y.Map<any> 타입
}

const CardFrame = ({
  shapeType,
  // titleStyle,
  // describe,
  itemKey,
  selctedItemkey,
  imageUrlsMap,
}: DefaultProps) => {
  const nowSectionKey = useSelector(
    (state: RootState) => state.keys.nowSectionKey
  );
  // const nowItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
  const sections = useSelector(
    (state: RootState) => state.layouts.layoutDatas.sectionValues
  );
  const currentSection = sections.find(
    (section) => section.sectionKey === nowSectionKey
  );
  const currentItem = currentSection?.layoutValues.find(
    (item) => item.id === itemKey
  );

  const dispatch = useDispatch();

  const actualShapeType = currentItem?.layoutName || shapeType;
  const shapeStyleValues = getShapeStyleValues(actualShapeType, "dynamic");

  const onChangeKey = (itemKey: string) => {
    const sectionKey = findItemSection(itemKey);
    if (sectionKey) {
      dispatch(changeNowSectionKey(sectionKey));
      dispatch(changeNowItemKey(itemKey));
    }
  };

  const findItemSection = (itemKey: string) => {
    const foundSection = sections.find((section) =>
      section.layoutValues.some((item) => item.id === itemKey)
    );

    return foundSection ? foundSection.sectionKey : null;
  };

  return (
    <SelectableFrame
      isItem={true}
      thisKey={itemKey}
      changeKey={onChangeKey}
      selectedKey={selctedItemkey}
    >
      <EditableCard
        shapeStyleValues={shapeStyleValues}
        itemKey={itemKey}
        imageUrlsMap={imageUrlsMap}
        selectedKey={selctedItemkey}
        // titleStyle={titleStyle}
        // describe={describe}
      />
    </SelectableFrame>
  );
};

export default CardFrame;
