import EditableCard from './EditableCard';
import SelectableFrame from '../SelectableFrame';
import { useDispatch, useSelector } from 'react-redux';
import { Shapes, TextStyleI } from '../types/common/layoutStyle';
import { getShapeStyleValues } from '../../utils/utils';
import { changeNowItemKey } from '../../store/slices/keys';
import { deleteLayoutItem } from '../../store/slices/layouts';
import { RootState } from '../../store/configureStore';

interface DefaultProps {
  shapeType: Shapes;
  itemKey: string;
  selctedItemkey: string | null;

  titleStyle?: TextStyleI;
  describe?: TextStyleI;
}


const CardFrame = ({ shapeType, titleStyle, describe, itemKey, selctedItemkey }: DefaultProps) => {
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);  

  const nowItemKey = useSelector((state: RootState) => state.keys.nowItemKey);


  const dispatch = useDispatch();

  const shapeStyleValues = getShapeStyleValues(shapeType, 'dynamic');

  const onChangeKey = (key: string) => {
    dispatch(changeNowItemKey(key));
  };

  const onDeleteLayout = () => {
    dispatch(deleteLayoutItem({ sectionId: nowSectionKey, itemId: nowItemKey }));
    dispatch(changeNowItemKey(''));
  };


  return (
    <SelectableFrame
    isItem={true}
      shapeStyleValues={shapeStyleValues}
      thisKey={itemKey}
      changeKey={onChangeKey}
      selectedKey={selctedItemkey}
      onHandleRemove={onDeleteLayout}
    >
      <EditableCard
        shapeStyleValues={shapeStyleValues}
        itemKey={itemKey}
        titleStyle={titleStyle}
        describe={describe}
      ></EditableCard>
    </SelectableFrame>
  );
};

export default CardFrame;
