'use client';

import { useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import Icon from './../../components/icons/Icon';
import { useDispatch } from 'react-redux';
import SectionFrame from '../../components/SectionLayout/SectionFrame';
import SideMenu from '../../components/SideMenu/SideMenu';
import { ResponsiveCondition, ResponsiveState, SectionData } from '../../components/types/common/layoutStyle';
import { changeNowSectionKey } from '../../store/slices/keys';
import { addSection } from '../../store/slices/layouts';
import { RESPONSIVE_VALUES } from '../../utils/constants';
import { RootState } from '../../store/configureStore';
import EmptyFrame from '../../components/EmptyFrame';

export default function Home() {
  const layoutDatas = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
  const dispatch = useDispatch();
  const activeBgColor='bg-white'

  const [sidebar, setSidebar] = useState(false);
  const [responsiveStyle, setResponsiveStyle] = useState<ResponsiveState>({
    width: '100%',
    isReponsive: false,
    state: 'desktop',
  });

  const generateUUID = useCallback(() => {
    if (typeof window !== 'undefined') {
      return crypto.randomUUID();
    }
    return 'temp-id';
  }, []);

  const onAddSection = useCallback(() => {
    const newSection: SectionData = {
      sectionKey: generateUUID(),
      layoutValues: [],
    };
    dispatch(addSection({ newSection }));
    dispatch(changeNowSectionKey(newSection.sectionKey));
  }, [dispatch, generateUUID]);

  const addFirstSection = useCallback(() => {
    onAddSection();
    setSidebar(true);
  }, [onAddSection]);

  const handleResponsiveView = useCallback((condition: ResponsiveCondition) => {
    switch (condition) {
      case 'desktop':
        setResponsiveStyle({
          width: RESPONSIVE_VALUES.DESKTOP,
          isReponsive: false,
          state: 'desktop',
        });
        break;
      case 'mobile':
        setResponsiveStyle({ width: RESPONSIVE_VALUES.MOBILE, isReponsive: true, state: 'mobile' });
        break;
      case 'tablet':
        setResponsiveStyle({ width: RESPONSIVE_VALUES.TABLET, isReponsive: true, state: 'tablet' });
        break;
    }
  }, []);

  return (
    <>
      <div className="flex justify-center items-center gap-[15px] h-[63px] w-full bg-[#535353] text-grayscale-100 text-lg fixed top-0 z-[2]">
        <div
          className={`p-[5px] rounded-[10px] ${
            responsiveStyle.state === 'desktop' ? activeBgColor : ''
          }`}
          onClick={() => handleResponsiveView('desktop')}
        >
          <Icon width={42} height={42} icon="desktop"></Icon>
        </div>
        <div
          className={`p-[5px] rounded-[10px] ${
            responsiveStyle.state === 'tablet' ? activeBgColor : ''
          }`}
          onClick={() => handleResponsiveView('tablet')}
        >
          <Icon width={42} height={42} icon="tablet"></Icon>
        </div>
        <div
          className={`p-[5px] rounded-[10px] ${
            responsiveStyle.state === 'mobile' ? activeBgColor : ''
          }`}
          onClick={() => handleResponsiveView('mobile')}
        >
          <Icon width={42} height={42} icon="mobile"></Icon>
        </div>
      </div>

      {sidebar === false && (
        <button 
          className="fixed top-1/2 right-2 -translate-y-1/2 z-[1] px-2 py-3 bg-white rounded shadow"
          onClick={() => setSidebar(true)}
        >
          {'<<'}
        </button>
      )}

      <section className={` flex w-screen justify-center transition-all duration-200 ${responsiveStyle.isReponsive ? 'bg-[#d8d5d5]' : ''}`}>
        <div 
          className="flex flex-col gap-5 transition-all duration-200"
          style={{ width: responsiveStyle.width }}
        >
          {layoutDatas.length === 0 && (
            <div
              className={`flex items-center justify-center min-w-[383px] h-[160px] bg-grayscale-30 text-white px-5 py-[10px] rounded cursor-pointer
                ${sidebar ? 'w-[calc(100%-413px)]' : 'w-full'}
                ${responsiveStyle.isReponsive ? 'w-full' : ''}
              `}
              onClick={() => addFirstSection()}
            >
              섹션 추가 하기
            </div>
          )}

          {layoutDatas.map((section, key) => (
            <EmptyFrame key={key} isEmpty={section.layoutValues.length === 0}>
              <SectionFrame
                selectedItemKey={selectedItemKey}
                selectedSectionkey={nowSectionKey}
                shapeType="defaultSection"
                sectionKey={section.sectionKey}
                isSideOpen={sidebar}
                isResponsive={responsiveStyle.isReponsive}
                sectionData={section}
              ></SectionFrame>
            </EmptyFrame>
          ))}
        </div>
        <SideMenu addSection={onAddSection} onClose={setSidebar} isOpen={sidebar}></SideMenu>
      </section>
    </>
  );
}
