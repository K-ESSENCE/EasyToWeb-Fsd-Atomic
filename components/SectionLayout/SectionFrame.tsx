import SelectableFrame from '../SelectableFrame';
import EditableSection from './EditableSection';
import { useDispatch, useSelector } from 'react-redux';
import { SectionData, Shapes } from '../types/common/layoutStyle';
import { deleteSection } from '../../store/slices/layouts';
import { changeNowSectionKey, changeNowItemKey } from '../../store/slices/keys';
import { getShapeStyleValues } from '../../utils/utils';
import { RootState } from '../../store/configureStore';

interface DefaultProps {
  shapeType: Shapes;
  sectionKey: string;
  selectedSectionkey: string | null;
  isSideOpen: boolean;
  // isResponsive: boolean;
  selectedItemKey: string | null;
  sectionData: SectionData;
}

const SectionFrame = ({
  shapeType,
  sectionKey,
  selectedSectionkey,
  isSideOpen,
  // isResponsive,
  selectedItemKey,
  sectionData,
}: DefaultProps) => {
  const shapeStyleValues = getShapeStyleValues(shapeType, 'dynamic');
  const dispatch = useDispatch();

  const onDeleteSection = () => {
    dispatch(deleteSection({ id: sectionKey }));
    dispatch(changeNowSectionKey(''));
    dispatch(changeNowItemKey(''));
  };

  const onChangeKey = (key: string) => {
    dispatch(changeNowSectionKey(key));
    dispatch(changeNowItemKey(''));
  };

  return (
    <SelectableFrame
      changeKey={onChangeKey}
      selectedKey={selectedSectionkey}
      shapeStyleValues={shapeStyleValues}
      thisKey={sectionKey}
      onHandleRemove={onDeleteSection}
    >
      <EditableSection
        sectionData={sectionData}
        selctedItemkey={selectedItemKey}
        isSideOpen={isSideOpen}
        // isResponsive={isResponsive}
      ></EditableSection>
    </SelectableFrame>
  );
};

export default SectionFrame;
