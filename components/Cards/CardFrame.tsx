import EditableCard from "./EditableCard";
import SelectableFrame from "../SelectableFrame";
import { useDispatch, useSelector } from "react-redux";
import { Shapes, TextStyleI } from "../types/common/layoutStyle";
import { getShapeStyleValues } from "../../utils/utils";
import { changeNowItemKey } from "../../store/slices/keys";
import { RootState } from "../../store/configureStore";

interface DefaultProps {
  shapeType: Shapes;
  itemKey: string;
  selctedItemkey: string | null;

  titleStyle?: TextStyleI;
  describe?: TextStyleI;
}

const CardFrame = ({
  shapeType,
  titleStyle,
  describe,
  itemKey,
  selctedItemkey,
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

  const onChangeKey = (key: string) => {
    dispatch(changeNowItemKey(key));
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
        titleStyle={titleStyle}
        describe={describe}
      />
    </SelectableFrame>
  );
};

export default CardFrame;
