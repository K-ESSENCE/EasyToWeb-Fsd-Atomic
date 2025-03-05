'use client';

import { useSelector } from 'react-redux';
import { useCallback, useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import SideMenu from '../../components/SideMenu/SideMenu';
import SectionList from '../../components/SideMenu/SectionList';
import { SectionData } from '../../components/types/common/layoutStyle';
import { changeNowSectionKey } from '../../store/slices/keys';
import { addSection, setLayoutData } from '../../store/slices/layouts';
import { RootState } from '../../store/configureStore';
import MainContent from '../../components/organisms/MainContent';
import { loadEditorState } from '../../utils/localStorage';
import { cleanupYjsProvider, createYjsDocument, updateUserSelection } from '../../utils/yjs';
import * as Y from 'yjs';
import ActiveUsers from '../../components/ActiveUsers';

export default function Home() {
  const dispatch = useDispatch();
  const layoutDatas = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
  // const activeBgColor = 'bg-white';

  const [settingsSidebar, setSettingsSidebar] = useState(false);
  const [sectionsSidebar, setSectionsSidebar] = useState(false);
  // const [responsiveStyle, setResponsiveStyle] = useState<ResponsiveState>({
  //   width: '100%',
  //   isReponsive: false,
  //   state: 'desktop',
  // });

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
    setSectionsSidebar(true);
  }, [onAddSection]);

  useEffect(() => {
    // 저장된 에디터 상태 불러오기
    const savedState = loadEditorState();
    if (savedState) {
      dispatch(setLayoutData(savedState));
    }
  }, [dispatch]);

  const [yjsDoc, setYjsDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<any>(null);
  const [awareness, setAwareness] = useState<any>(null);

  // YJS 동기화 관련 변수
  const isLocalUpdateRef = useRef(false);
  const lastReceivedHashRef = useRef('');

  useEffect(() => {
    const roomName = 'layout-modal-room';
    const { doc, provider, awareness } = createYjsDocument(roomName);

    setYjsDoc(doc);
    setProvider(provider);
    setAwareness(awareness);

    // layoutDatas를 위한 공유 맵 생성
    const sharedLayoutMap = doc.getMap('layoutDatas');

    // 초기 상태 설정
    if (sharedLayoutMap.size === 0 && layoutDatas.length > 0) {
      sharedLayoutMap.set('sections', layoutDatas);
    }

    // 원격 변경사항 감지 및 적용
    sharedLayoutMap.observe(() => {
      if (isLocalUpdateRef.current) {
        return; // 로컬 업데이트 중이면 무시
      }

      const remoteLayoutDatas = sharedLayoutMap.get('sections') as SectionData[];
      if (!remoteLayoutDatas) return;

      // 해시 비교를 통한 중복 업데이트 방지
      const currentHash = JSON.stringify(remoteLayoutDatas);
      if (currentHash === lastReceivedHashRef.current) {
        return; // 동일한 데이터면 무시
      }

      // 진짜 데이터 비교 (구조와 값이 정확히 같은지)
      if (JSON.stringify(remoteLayoutDatas) !== JSON.stringify(layoutDatas)) {
        console.log('Remote change detected:', remoteLayoutDatas);
        lastReceivedHashRef.current = currentHash;

        // Redux 업데이트
        dispatch(
          setLayoutData({
            layoutId: 'default',
            sectionValues: remoteLayoutDatas,
          }),
        );
      }
    });

    return () => {
      if (provider) {
        cleanupYjsProvider(provider);
      }
    };
  }, []);

  useEffect(() => {
    if (yjsDoc) {
      // 로컬 변경을 YJS에 반영
      const sharedLayoutMap = yjsDoc.getMap('layoutDatas');

      // 현재 값과 비교해서 실제로 변경이 있는 경우만 업데이트
      const currentSections = sharedLayoutMap.get('sections') as SectionData[] | undefined;

      if (!currentSections || JSON.stringify(currentSections) !== JSON.stringify(layoutDatas)) {
        console.log('Local change synced:', layoutDatas);

        // 로컬 업데이트 플래그 설정 (원격 변경 감지 중지)
        isLocalUpdateRef.current = true;

        // YJS 데이터 업데이트
        sharedLayoutMap.set('sections', layoutDatas);

        // 플래그 초기화 (지연시켜 비동기 처리 완료 보장)
        setTimeout(() => {
          isLocalUpdateRef.current = false;
        }, 50);
      }
    }
  }, [layoutDatas, yjsDoc]);

  // nowSectionKey나 selectedItemKey가 변경될 때 awareness 상태 업데이트
  useEffect(() => {
    if (awareness) {
      updateUserSelection(awareness, nowSectionKey, selectedItemKey);
    }
  }, [awareness, nowSectionKey, selectedItemKey]);

  // 추후 사용 반응형 코드

  // const handleResponsiveView = useCallback((condition: ResponsiveCondition) => {
  //   switch (condition) {
  //     case 'desktop':
  //       setResponsiveStyle({
  //         width: RESPONSIVE_VALUES.DESKTOP,
  //         isReponsive: false,
  //         state: 'desktop',
  //       });
  //       break;
  //     case 'mobile':
  //       setResponsiveStyle({ width: RESPONSIVE_VALUES.MOBILE, isReponsive: true, state: 'mobile' });
  //       break;
  //     case 'tablet':
  //       setResponsiveStyle({ width: RESPONSIVE_VALUES.TABLET, isReponsive: true, state: 'tablet' });
  //       break;
  //   }
  // }, []);

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
        {/* ActiveUsers 컴포넌트 추가 */}
        {awareness && (
          <div className="fixed top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
            <ActiveUsers awareness={awareness} layoutDatas={layoutDatas} />
          </div>
        )}

        <MainContent
          layoutDatas={layoutDatas}
          selectedItemKey={selectedItemKey}
          nowSectionKey={nowSectionKey}
          settingsSidebar={settingsSidebar}
          sectionsSidebar={sectionsSidebar}
          // responsiveStyle={responsiveStyle}
          onAddFirstSection={addFirstSection}
        />
        <SideMenu addSection={onAddSection} onClose={setSettingsSidebar} isOpen={settingsSidebar} />
        <SectionList onClose={setSectionsSidebar} isOpen={sectionsSidebar} />
      </section>
    </>
  );
}
