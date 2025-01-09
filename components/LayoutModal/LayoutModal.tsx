'use client';

import ModalBackground from '../ModalBackground';
import Icon from '../icons/Icon';
import LayoutModalMenus from './LayoutModalMenus';
import LayoutItemContainer from './LayoutItemContainer';
import { useState } from 'react';
import { Shapes } from '../types/common/layoutStyle';

export interface BlockDesingI {
  blockDesignType: Shapes;
  value?: number;
  title?: { text: string; color?: string; bold?: boolean };
  describe?: string;
}

const LAYOUT_MENUS_INFO: { [key: string]: BlockDesingI[] } = {
  이미지: [{ blockDesignType: 'rectNormal', value: 1 }],
  구분선: [{ blockDesignType: 'rectNormal', value: 1 }],
  목록: [
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
  ],
  텍스트: [],
  표: [{ blockDesignType: 'rectNormal' }],
  레이아웃: [{ blockDesignType: 'rectNormal' }],
};

const LAYOUT_MENUS = Object.keys(LAYOUT_MENUS_INFO);

const LayoutModal = ({
  isOpen,
  onClose,
  addLayout,
}: {
  addLayout: Function;
  isOpen: boolean;
  onClose: Function;
}) => {
  const [selecttedMenu, setSelectedMenu] = useState(LAYOUT_MENUS[0]);

  const handleMenu = (menu: string) => {
    setSelectedMenu(menu);
  };

  return (
    <ModalBackground isOpen={isOpen}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1220px] h-[673px]">
        <div className="box-border px-[63px] flex justify-between w-full h-20 items-center rounded-t-[20px] bg-primary-100">
          <h1 className="font-bold text-2xl leading-[28.64px] tracking-[0.48px] text-white">
            블록 디자인 추가
          </h1>
          <div onClick={() => onClose(false)}>
            <Icon color="#FFFFFF" width={26} height={26} icon="close"></Icon>
          </div>
        </div>

        <div className="box-border pt-[50px] pl-[63px] flex h-[593px] rounded-b-[20px] shadow-[4px_4px_21px_0px_rgba(0,0,0,0.3)] bg-grayscale-5">
          <div className="mr-[82px]">
            <LayoutModalMenus
              onClickMenu={handleMenu}
              menus={LAYOUT_MENUS}
              selectedMenu={selecttedMenu}
            ></LayoutModalMenus>
          </div>
          <div className="grid grid-cols-2 grid-rows-[152px_152px_auto] gap-5">
            {LAYOUT_MENUS_INFO[selecttedMenu].map((layoutItem, idx) => {
              return (
                <LayoutItemContainer
                  onClick={addLayout}
                  layoutItem={layoutItem}
                  key={idx}
                ></LayoutItemContainer>
              );
            })}
          </div>
        </div>
      </div>
    </ModalBackground>
  );
};

export default LayoutModal;
