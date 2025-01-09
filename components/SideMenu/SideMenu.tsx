import Icon from '../icons/Icon';
import LayoutItemContainer from './../LayoutModal/LayoutItemContainer';
import { addLayoutItem, deleteLayoutItem, deleteSection } from '../../store/slices/layouts';
import { useDispatch, useSelector } from 'react-redux';
import { BlockDesingI } from './../LayoutModal/LayoutModal';
import { RootState } from '../../store/configureStore';
import { changeNowItemKey, changeNowSectionKey } from '../../store/slices/keys';
import { LayoutItemValues, Shapes } from '../types/common/layoutStyle';

const LAYOUT_MENUS_INFO: BlockDesingI[] = [
  {
    blockDesignType: 'round',
    title: {
      text: '초단기한글',
    },
  },
  {
    blockDesignType: 'rectNormal',
    title: {
      text: '[클래스]',
      bold: true,
    },
    describe:
      '친구들과 함께 모여 교과과정에 필요한 핵심 과목을 집중적으로 관리 받습니다.전문 선생님의 학습 관리로 자기주도 학습을 성장시킬 수 있습니다.',
  },
  {
    blockDesignType: 'rectSmall',
    title: {
      text: '1:1방문',
      bold: true,
      color: '#EE7D00',
    },
    describe: '주1회/과목당10 학습관리 및 상담',
  },
  {
    blockDesignType: 'rectBig',
    title: {
      text: '티칭 및 학습',
      bold: true,
    },
    describe:
      '북패드 디지털 콘텐츠를 활용하여 학생들의 지면 학습을 더욱 심도 깊고 쉽게 이해하여 기본 개념을 탄탄하게 합니다.',
  },
];

const SideMenu = ({
  isOpen,
  onClose,
  addSection,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
  addSection: () => void;
}) => {
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const nowItemKey = useSelector((state: RootState) => state.keys.nowItemKey);

  const isItemSelected = useSelector((state: RootState) => state.keys.isItemSelected);
  const onlySelectedLayout = useSelector((state: RootState) => state.keys.onlySelectedLayout);
  const nonSelected = useSelector((state: RootState) => state.keys.nonSelected);

  const dispatch = useDispatch();

  const onAddLayoutItem = (layoutitem: Shapes) => {
    const newLayoutItemValue: LayoutItemValues = {
      id: crypto.randomUUID(),
      layoutName: layoutitem,
    };

    dispatch(addLayoutItem({ id: nowSectionKey, newLayoutItemValue }));
  };

  const onDeleteLayoutItem = () => {
    dispatch(deleteLayoutItem({ sectionId: nowSectionKey, itemId: nowItemKey }));
    dispatch(changeNowItemKey(''));
  };

  if (isOpen)
    return (
      <div className="fixed top-[63px] right-0 flex flex-col w-[333px] min-w-[333px] h-screen bg-[#f7f7f7]">
        <div className="w-full h-[76px] flex justify-around items-center">
          <button 
            className="border-none bg-none font-inherit cursor-pointer" 
            onClick={() => addSection()}
          >
            섹션 추가하기
          </button>
          {nowSectionKey && (
            <button
              className="border-none bg-none font-inherit cursor-pointer"
              onClick={() => {
                dispatch(deleteSection({ id: nowSectionKey }));
                dispatch(changeNowSectionKey(''));
              }}
            >
              섹션 삭제하기
            </button>
          )}

          <span onClick={() => onClose(false)}>
            <Icon color="#000000" width={26} height={26} icon="close"></Icon>
          </span>
        </div>
        <div className="flex flex-col justify-center items-center">
          {isItemSelected && (
            <div>
              아이템 핸들메뉴
              <p onClick={onDeleteLayoutItem}>삭제</p>
              <p></p>
            </div>
          )}
          {onlySelectedLayout && (
            <p className="text-xs text-[#007bff]">
              아이템은 총 6개까지 추가 할 수 있습니다.
            </p>
          )}
          {onlySelectedLayout &&
            LAYOUT_MENUS_INFO.map((layoutItem, idx) => {
              return (
                <LayoutItemContainer
                  onClick={() => onAddLayoutItem(layoutItem.blockDesignType)}
                  layoutItem={layoutItem}
                  key={idx}
                ></LayoutItemContainer>
              );
            })}
          {nonSelected && '섹션을 추가하거나 선택해주세요'}
        </div>
      </div>
    );
};

export default SideMenu;
