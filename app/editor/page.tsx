"use client";

import { useSelector } from "react-redux";
import { useCallback, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import SideMenu from "../../components/SideMenu/SideMenu";
import SectionList from "../../components/SideMenu/SectionList";
import { SectionData } from "../../components/types/common/layoutStyle";
import { changeNowSectionKey } from "../../store/slices/keys";
import { addSection, setLayoutData } from "../../store/slices/layouts";
import { RootState } from "../../store/configureStore";
import MainContent from "../../components/organisms/MainContent";
import { loadEditorState } from "../../utils/localStorage";
import { cleanupYjsProvider, createYjsDocument } from "../../utils/yjs";
import * as Y from "yjs";

export default function Home() {
  const dispatch = useDispatch();
  const layoutDatas = useSelector(
    (state: RootState) => state.layouts.layoutDatas.sectionValues
  );
  const nowSectionKey = useSelector(
    (state: RootState) => state.keys.nowSectionKey
  );
  const selectedItemKey = useSelector(
    (state: RootState) => state.keys.nowItemKey
  );
  // const activeBgColor = 'bg-white';

  const [settingsSidebar, setSettingsSidebar] = useState(false);
  const [sectionsSidebar, setSectionsSidebar] = useState(false);
  // const [responsiveStyle, setResponsiveStyle] = useState<ResponsiveState>({
  //   width: '100%',
  //   isReponsive: false,
  //   state: 'desktop',
  // });

  const generateUUID = useCallback(() => {
    if (typeof window !== "undefined") {
      return crypto.randomUUID();
    }
    return "temp-id";
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

  useEffect(() => {
    const roomName = "layout-modal-room";
    const { doc, provider } = createYjsDocument(roomName);

    setYjsDoc(doc);
    setProvider(provider);

    // layoutDatas를 위한 공유 맵 생성
    const sharedLayoutMap = doc.getMap("layoutDatas");

    // 초기 상태 설정
    if (sharedLayoutMap.size === 0 && layoutDatas.length > 0) {
      sharedLayoutMap.set("sections", layoutDatas);
    }

    // 원격 변경사항 감지 및 적용
    sharedLayoutMap.observe(() => {
      const remoteLayoutDatas = sharedLayoutMap.get(
        "sections"
      ) as SectionData[];
      if (
        remoteLayoutDatas &&
        JSON.stringify(remoteLayoutDatas) !== JSON.stringify(layoutDatas)
      ) {
        console.log("Remote change detected:", remoteLayoutDatas);
        dispatch(
          setLayoutData({
            layoutId: "default",
            sectionValues: remoteLayoutDatas,
          })
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
      console.log("Local change synced:", layoutDatas);
      const sharedLayoutMap = yjsDoc.getMap("layoutDatas");
      sharedLayoutMap.set("sections", layoutDatas);
    }
  }, [layoutDatas, yjsDoc]);

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

      <section
        className={
          "flex w-screen justify-center transition-all duration-200 bg-[#d8d5d5]"
        }
      >
        <MainContent
          layoutDatas={layoutDatas}
          selectedItemKey={selectedItemKey}
          nowSectionKey={nowSectionKey}
          settingsSidebar={settingsSidebar}
          sectionsSidebar={sectionsSidebar}
          // responsiveStyle={responsiveStyle}
          onAddFirstSection={addFirstSection}
        />
        <SideMenu
          addSection={onAddSection}
          onClose={setSettingsSidebar}
          isOpen={settingsSidebar}
        />
        <SectionList onClose={setSectionsSidebar} isOpen={sectionsSidebar} />
      </section>
    </>
  );
}
