import SelectableFrame from "../SelectableFrame";
import EditableSection from "./EditableSection";
import { useDispatch } from "react-redux";
import { SectionData, Shapes } from "../types/common/layoutStyle";
// import { deleteSection } from "../../store/slices/layouts";
import { changeNowSectionKey, changeNowItemKey } from "../../store/slices/keys";
// import { getShapeStyleValues } from "../../utils/utils";

interface DefaultProps {
  shapeType: Shapes;
  sectionKey: string;
  selectedSectionkey: string | null;
  // isResponsive: boolean;
  selctedItemkey: string | null;
  sectionData: SectionData;
  isEmpty: boolean;
  imageUrlsMap?: any; // Y.Map<any> 타입
}

const SectionFrame = ({
  // shapeType,
  sectionKey,
  selectedSectionkey,
  // isResponsive,
  isEmpty,
  selctedItemkey,
  sectionData,
  imageUrlsMap,
}: DefaultProps) => {
  // const shapeStyleValues = getShapeStyleValues(shapeType, "dynamic");
  const dispatch = useDispatch();

  // const onDeleteSection = () => {
  //   dispatch(deleteSection({ id: sectionKey }));
  //   dispatch(changeNowSectionKey(""));
  //   dispatch(changeNowItemKey(""));
  // };

  const onChangeKey = (key: string) => {
    dispatch(changeNowSectionKey(key));
    dispatch(changeNowItemKey(""));
  };

  return (
    <SelectableFrame
      changeKey={onChangeKey}
      selectedKey={selectedSectionkey}
      // shapeStyleValues={shapeStyleValues}
      thisKey={sectionKey}
      // onHandleRemove={onDeleteSection}
    >
      {isEmpty && (
        <>
          <p className="text-gray-400 text-lg font-medium">
            이 컨테이너를 선택후 요소를 추가하세요
          </p>
          <p className="text-gray-400 text-sm mt-2">
            왼쪽 패널에서 원하는 요소를 선택하여 드래그하세요
          </p>
        </>
      )}
      <EditableSection
        sectionData={sectionData}
        selctedItemkey={selctedItemkey}
        imageUrlsMap={imageUrlsMap}
      ></EditableSection>
    </SelectableFrame>
  );
};

export default SectionFrame;
