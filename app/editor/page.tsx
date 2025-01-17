'use client';

import { useSelector } from 'react-redux';
import { useCallback, useState } from 'react';
import Icon from '../../components/icons/Icon';
import { useDispatch } from 'react-redux';
import SideMenu from '../../components/SideMenu/SideMenu';
import SectionList from '../../components/SideMenu/SectionList';
import { ResponsiveCondition, ResponsiveState, SectionData } from '../../components/types/common/layoutStyle';
import { changeNowSectionKey } from '../../store/slices/keys';
import { addSection } from '../../store/slices/layouts';
import { RESPONSIVE_VALUES } from '../../utils/constants';
import { RootState } from '../../store/configureStore';
import MainContent from '../../components/organisms/MainContent';

export default function Home() {
  const dispatch = useDispatch();
  const layoutDatas = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
  // const activeBgColor = 'bg-white';

  const [settingsSidebar, setSettingsSidebar] = useState(false);
  const [sectionsSidebar, setSectionsSidebar] = useState(false);
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
    setSettingsSidebar(true);
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
      {/* 기존 반응형 헤더 */}
      {/* <div className="flex justify-center items-center gap-[15px] h-[63px] w-full bg-[#535353] text-grayscale-100 text-lg fixed top-0 z-[2]">
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
      </div> */}

      {/* 사이드바 */}
      {/* {settingsSidebar === false && (
        <button 
          className="fixed top-1/2 right-2 -translate-y-1/2 z-[1] px-2 py-3 bg-white rounded shadow"
          onClick={() => setSettingsSidebar(true)}
        >
          {'<<'}
        </button>
      )} */}

      <section className={'flex w-screen justify-center transition-all duration-200 bg-[#d8d5d5]'}>
        <MainContent 
          layoutDatas={layoutDatas}
          selectedItemKey={selectedItemKey}
          nowSectionKey={nowSectionKey}
          settingsSidebar={settingsSidebar}
          sectionsSidebar={sectionsSidebar}
          responsiveStyle={responsiveStyle}
          onAddFirstSection={addFirstSection}
        />
        <SideMenu addSection={onAddSection} onClose={setSettingsSidebar} isOpen={settingsSidebar} />
        <SectionList onClose={setSectionsSidebar} isOpen={sectionsSidebar} />
      </section>
    </>
  );
}
