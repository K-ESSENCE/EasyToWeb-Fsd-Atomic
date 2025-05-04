"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import SectionList from "../../components/SideMenu/SectionList";
import SideMenu from "../../components/SideMenu/SideMenu";
import SettingDialog from "../../components/settingDialog";
import { SectionData } from "../../components/types/common/layoutStyle";
import { addSection, setLayoutData } from "../../store/slices/layouts";
import { useDispatch, useSelector } from "react-redux";
import MainContent from "../../components/organisms/MainContent";
import { RootState } from "../../store/configureStore";
import * as Y from "yjs";
import {
  cleanupYjsProvider,
  createYjsDocument,
  updateUserSelection,
} from "../../utils/yjs";
import ActiveUsers from "../../components/ActiveUsers";
import { Awareness } from "y-protocols/awareness";

// import { useSelector } from 'react-redux';
// import { useCallback, useState, useEffect, useRef } from 'react';
// import { useDispatch } from 'react-redux';
// import SideMenu from '../../components/SideMenu/SideMenu';
// import SectionList from '../../components/SideMenu/SectionList';
// import { SectionData } from '../../components/types/common/layoutStyle';
// import { changeNowSectionKey } from '../../store/slices/keys';
// import { addSection, setLayoutData } from '../../store/slices/layouts';
// import MainContent from '../../components/organisms/MainContent';
// import { loadEditorState } from '../../utils/localStorage';
// import { cleanupYjsProvider, createYjsDocument, updateUserSelection } from '../../utils/yjs';

// export default function Home() {
//   const dispatch = useDispatch();
//   const layoutDatas = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
//   const nowSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
//   const selectedItemKey = useSelector((state: RootState) => state.keys.nowItemKey);
//   // const activeBgColor = 'bg-white';

//   // const [responsiveStyle, setResponsiveStyle] = useState<ResponsiveState>({
//   //   width: '100%',
//   //   isReponsive: false,
//   //   state: 'desktop',
//   // });

//   const onAddSection = useCallback(() => {
//     const newSection: SectionData = {
//       sectionKey: generateUUID(),
//       layoutValues: [],
//     };
//     dispatch(addSection({ newSection }));
//     dispatch(changeNowSectionKey(newSection.sectionKey));
//   }, [dispatch, generateUUID]);

//   const addFirstSection = useCallback(() => {
//     onAddSection();
//     setSettingsSidebar(true);
//     setSectionsSidebar(true);
//   }, [onAddSection]);

//   useEffect(() => {
//     // 저장된 에디터 상태 불러오기
//     const savedState = loadEditorState();
//     if (savedState) {
//       dispatch(setLayoutData(savedState));
//     }
//   }, [dispatch]);

//   const [yjsDoc, setYjsDoc] = useState<Y.Doc | null>(null);
//   const [provider, setProvider] = useState<any>(null);
//   const [awareness, setAwareness] = useState<any>(null);

//   // YJS 동기화 관련 변수
//   const isLocalUpdateRef = useRef(false);
//   const lastReceivedHashRef = useRef('');

//   useEffect(() => {
//     const roomName = 'layout-modal-room';
//     const { doc, provider, awareness } = createYjsDocument(roomName);

//     setYjsDoc(doc);
//     setProvider(provider);
//     setAwareness(awareness);

//     // layoutDatas를 위한 공유 맵 생성
//     const sharedLayoutMap = doc.getMap('layoutDatas');

//     // 초기 상태 설정
//     if (sharedLayoutMap.size === 0 && layoutDatas.length > 0) {
//       sharedLayoutMap.set('sections', layoutDatas);
//     }

//     // 원격 변경사항 감지 및 적용
//     sharedLayoutMap.observe(() => {
//       if (isLocalUpdateRef.current) {
//         return; // 로컬 업데이트 중이면 무시
//       }

//       const remoteLayoutDatas = sharedLayoutMap.get('sections') as SectionData[];
//       if (!remoteLayoutDatas) return;

//       // 해시 비교를 통한 중복 업데이트 방지
//       const currentHash = JSON.stringify(remoteLayoutDatas);
//       if (currentHash === lastReceivedHashRef.current) {
//         return; // 동일한 데이터면 무시
//       }

//       // 진짜 데이터 비교 (구조와 값이 정확히 같은지)
//       if (JSON.stringify(remoteLayoutDatas) !== JSON.stringify(layoutDatas)) {
//         console.log('Remote change detected:', remoteLayoutDatas);
//         lastReceivedHashRef.current = currentHash;

//         // Redux 업데이트
//         dispatch(
//           setLayoutData({
//             layoutId: 'default',
//             sectionValues: remoteLayoutDatas,
//           }),
//         );
//       }
//     });

//     return () => {
//       if (provider) {
//         cleanupYjsProvider(provider);
//       }
//     };
//   }, []);

//   // nowSectionKey나 selectedItemKey가 변경될 때 awareness 상태 업데이트
//   useEffect(() => {
//     if (awareness) {
//       updateUserSelection(awareness, nowSectionKey, selectedItemKey);
//     }
//   }, [awareness, nowSectionKey, selectedItemKey]);

//   // 추후 사용 반응형 코드

//   // const handleResponsiveView = useCallback((condition: ResponsiveCondition) => {
//   //   switch (condition) {
//   //     case 'desktop':
//   //       setResponsiveStyle({
//   //         width: RESPONSIVE_VALUES.DESKTOP,
//   //         isReponsive: false,
//   //         state: 'desktop',
//   //       });
//   //       break;
//   //     case 'mobile':
//   //       setResponsiveStyle({ width: RESPONSIVE_VALUES.MOBILE, isReponsive: true, state: 'mobile' });
//   //       break;
//   //     case 'tablet':
//   //       setResponsiveStyle({ width: RESPONSIVE_VALUES.TABLET, isReponsive: true, state: 'tablet' });
//   //       break;
//   //   }
//   // }, []);

//   return (
//     <>
//       {/* 기존 반응형 헤더 */}
//       {/* <div className="flex justify-center items-center gap-[15px] h-[63px] w-full bg-[#535353] text-grayscale-100 text-lg fixed top-0 z-[2]">
//         <div
//           className={`p-[5px] rounded-[10px] ${
//             responsiveStyle.state === 'desktop' ? activeBgColor : ''
//           }`}
//           onClick={() => handleResponsiveView('desktop')}
//         >
//           <Icon width={42} height={42} icon="desktop"></Icon>
//         </div>
//         <div
//           className={`p-[5px] rounded-[10px] ${
//             responsiveStyle.state === 'tablet' ? activeBgColor : ''
//           }`}
//           onClick={() => handleResponsiveView('tablet')}
//         >
//           <Icon width={42} height={42} icon="tablet"></Icon>
//         </div>
//         <div
//           className={`p-[5px] rounded-[10px] ${
//             responsiveStyle.state === 'mobile' ? activeBgColor : ''
//           }`}
//           onClick={() => handleResponsiveView('mobile')}
//         >
//           <Icon width={42} height={42} icon="mobile"></Icon>
//         </div>
//       </div> */}

//       {/* 사이드바 */}
//       {/* {settingsSidebar === false && (
//         <button
//           className="fixed top-1/2 right-2 -translate-y-1/2 z-[1] px-2 py-3 bg-white rounded shadow"
//           onClick={() => setSettingsSidebar(true)}
//         >
//           {'<<'}
//         </button>
//       )} */}

//       <section className={'flex w-screen justify-center transition-all duration-200 bg-[#d8d5d5]'}>
//         {/* ActiveUsers 컴포넌트 추가 */}
//         {awareness && (
//           <div className="fixed top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
//             <ActiveUsers awareness={awareness} layoutDatas={layoutDatas} />
//           </div>
//         )}

//         <MainContent
//           layoutDatas={layoutDatas}
//           selectedItemKey={selectedItemKey}
//           nowSectionKey={nowSectionKey}
//           settingsSidebar={settingsSidebar}
//           sectionsSidebar={sectionsSidebar}
//           // responsiveStyle={responsiveStyle}
//           onAddFirstSection={addFirstSection}
//         />
//         <SideMenu addSection={onAddSection} onClose={setSettingsSidebar} isOpen={settingsSidebar} />
//         <SectionList onClose={setSectionsSidebar} isOpen={sectionsSidebar} />
//       </section>
//     </>
//   );
// }
// The exported code uses Tailwind CSS. Install Tailwind CSS in your dev environment to ensure all styles work.
interface ComponentItem {
  id: string;
  type: string;
  position: { x: number; y: number };
}
const App: React.FC = () => {
  // const [selectedComponent, setSelectedComponent] = useState<string | null>(
  // null
  // );
  // const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">(
  //   "desktop"
  // );

  const dispatch = useDispatch();

  const [yjsDoc, setYjsDoc] = useState<Y.Doc | null>(null);
  const [awareness, setAwareness] = useState<Awareness | null>(null);

  const generateUUID = useCallback(() => {
    if (typeof window !== "undefined") {
      return crypto.randomUUID();
    }
    return "temp-id";
  }, []);

  const layoutDatas = useSelector(
    (state: RootState) => state.layouts.layoutDatas.sectionValues
  );
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  interface HistoryState {
    droppedComponents: ComponentItem[];
  }
  const [droppedComponents, setDroppedComponents] = useState<ComponentItem[]>(
    []
  );
  const nowSectionKey = useSelector(
    (state: RootState) => state.keys.nowSectionKey
  );
  const selectedItemKey = useSelector(
    (state: RootState) => state.keys.nowItemKey
  );
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLDivElement>(null);
  const [showToast, setShowToast] = useState(false);
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [projectName, setProjectName] = useState("새 프로젝트");
  const [showProjectNameInput, setShowProjectNameInput] = useState(false);

  const addToHistory = (components: ComponentItem[]) => {
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push({ droppedComponents: [...components] });
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      const previousState = history[currentHistoryIndex - 1];
      setDroppedComponents(previousState.droppedComponents);
      setCurrentHistoryIndex(currentHistoryIndex - 1);
    }
  };
  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      const nextState = history[currentHistoryIndex + 1];
      setDroppedComponents(nextState.droppedComponents);
      setCurrentHistoryIndex(currentHistoryIndex + 1);
    }
  };
  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };
  const handleProjectNameChange = (newName: string) => {
    setProjectName(newName);
    setShowProjectNameInput(false);
  };
  // const handleComponentSelect = (component: string) => {
  //   setSelectedComponent(component);
  // };
  // const handleViewModeChange = (mode: "desktop" | "tablet" | "mobile") => {
  //   setViewMode(mode);
  // };

  // YJS 동기화 관련 변수
  // const isLocalUpdateRef = useRef(false);
  const lastReceivedHashRef = useRef("");

  useEffect(() => {
    const roomName = "layout-modal-room";
    const accessToken = "eyJhbGciOiJIUzI1NiJ9..."; // Replace with actual access token from your auth system

    const { doc, provider, awareness } = createYjsDocument({
      roomName,
      accessToken,
    });

    setYjsDoc(doc);
    setAwareness(awareness);

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
      if (!remoteLayoutDatas) return;

      // 해시 비교를 통한 중복 업데이트 방지
      const currentHash = JSON.stringify(remoteLayoutDatas);
      if (currentHash === lastReceivedHashRef.current) {
        return; // 동일한 데이터면 무시
      }

      // 진짜 데이터 비교 (구조와 값이 정확히 같은지)
      if (JSON.stringify(remoteLayoutDatas) !== JSON.stringify(layoutDatas)) {
        console.log("Remote change detected:", remoteLayoutDatas);
        lastReceivedHashRef.current = currentHash;

        // Redux 업데이트
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

  // nowSectionKey나 selectedItemKey가 변경될 때 awareness 상태 업데이트
  useEffect(() => {
    if (awareness) {
      updateUserSelection(awareness, nowSectionKey, selectedItemKey);
    }
  }, [awareness, nowSectionKey, selectedItemKey]);

  useEffect(() => {
    if (yjsDoc) {
      // 로컬 변경을 YJS에 반영
      const sharedLayoutMap = yjsDoc.getMap("layoutDatas");

      // 현재 값과 비교해서 실제로 변경이 있는 경우만 업데이트
      const currentSections = sharedLayoutMap.get("sections") as
        | SectionData[]
        | undefined;

      if (
        !currentSections ||
        JSON.stringify(currentSections) !== JSON.stringify(layoutDatas)
      ) {
        console.log("Local change synced:", layoutDatas);

        // 로컬 업데이트 플래그 설정 (원격 변경 감지 중지)

        // YJS 데이터 업데이트
        sharedLayoutMap.set("sections", layoutDatas);

        // 플래그 초기화 (지연시켜 비동기 처리 완료 보장)
      }
    }
  }, [layoutDatas, yjsDoc]);
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* 상단 헤더 영역 */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            {showProjectNameInput ? (
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                onBlur={() => handleProjectNameChange(projectName)}
                onKeyPress={(e) =>
                  e.key === "Enter" && handleProjectNameChange(projectName)
                }
                className="text-xl font-semibold text-gray-800 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                autoFocus
              />
            ) : (
              <h1
                className="text-xl font-semibold text-gray-800 hover:text-blue-600 cursor-pointer flex items-center"
                onClick={() => setShowProjectNameInput(true)}
              >
                {projectName}
                <i className="fas fa-pencil-alt text-sm ml-2 text-gray-400"></i>
              </h1>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={`${
              isSaving
                ? "bg-gray-200 text-gray-500"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            } px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap flex items-center`}
          >
            {isSaving ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                저장 중...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                저장
              </>
            )}
          </button>
          <button className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap">
            <i className="fas fa-eye mr-2"></i>미리보기
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-button text-sm font-medium cursor-pointer whitespace-nowrap">
            <i className="fas fa-rocket mr-2"></i>배포
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="p-2 text-gray-500 hover:text-gray-700 cursor-pointer whitespace-nowrap"
          >
            <i className="fas fa-cog text-lg"></i>
          </button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        {/* 좌측 사이드바 (컴포넌트 패널) */}
        <SectionList
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          setIsDragging={setIsDragging}
          isFullscreen={isFullscreen}
        />
        {/* 중앙 메인 작업 영역 */}
        <main className="flex-1 w-screen bg-gray-100 overflow-hidden flex flex-col">
          <div className="bg-white border-b border-gray-200 p-2 flex items-center justify-between">
            {/* <div className="flex items-center space-x-2">
              <button
                className={`p-2 rounded-button cursor-pointer whitespace-nowrap ${viewMode === "desktop" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleViewModeChange("desktop")}
              >
                <i className="fas fa-desktop"></i>
              </button>
              <button
                className={`p-2 rounded-button cursor-pointer whitespace-nowrap ${viewMode === "tablet" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleViewModeChange("tablet")}
              >
                <i className="fas fa-tablet-alt"></i>
              </button>
              <button
                className={`p-2 rounded-button cursor-pointer whitespace-nowrap ${viewMode === "mobile" ? "bg-blue-50 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
                onClick={() => handleViewModeChange("mobile")}
              >
                <i className="fas fa-mobile-alt"></i>
              </button>
            </div> */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleUndo}
                disabled={currentHistoryIndex <= 0}
                className={`p-2 rounded-button whitespace-nowrap ${
                  currentHistoryIndex <= 0
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <i className="fas fa-undo"></i>
              </button>
              <button
                onClick={handleRedo}
                disabled={currentHistoryIndex >= history.length - 1}
                className={`p-2 rounded-button whitespace-nowrap ${
                  currentHistoryIndex >= history.length - 1
                    ? "text-gray-300 cursor-not-allowed"
                    : "text-gray-500 hover:bg-gray-100 cursor-pointer"
                }`}
              >
                <i className="fas fa-redo"></i>
              </button>
              <button
                id="fullscreen-toggle"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 text-gray-500 hover:bg-gray-100 rounded-button cursor-pointer whitespace-nowrap"
              >
                <i
                  className={`fas ${isFullscreen ? "fa-compress" : "fa-expand"}`}
                ></i>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-8 flex justify-center">
            <div
              className={`bg-white shadow-lg rounded-lg border border-gray-200 min-h-[calc(100vh-12rem)] w-full max-w-6xl`}

              // ${
              //   viewMode === "desktop"
              //     ? "w-full max-w-6xl"
              //     : viewMode === "tablet"
              //       ? "w-[768px]"
              //       : "w-[375px]"
              // }
            >
              <div
                ref={canvasRef}
                className={`min-h-screen p-6 relative border-2 ${isDragging ? "border-blue-400 bg-blue-50" : "bg-white border-dashed border-gray-300"} rounded-lg transition-colors duration-200`}
                onDragOver={(e) => {
                  e.preventDefault();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  const componentType = e.dataTransfer.getData("text/plain");

                  const canvasRect = canvasRef.current?.getBoundingClientRect();
                  if (canvasRect) {
                    const x = e.clientX - canvasRect.left;
                    const y = e.clientY - canvasRect.top;
                    const newComponent: ComponentItem = {
                      id: `${componentType}-${Date.now()}`,
                      type: componentType,
                      position: { x, y },
                    };
                    const updatedComponents = [
                      ...droppedComponents,
                      newComponent,
                    ];
                    //   const onAddSection = useCallback(() => {
                    //     const newSection: SectionData = {
                    //       sectionKey: generateUUID(),
                    //       layoutValues: [],
                    //     };
                    //     dispatch(addSection({ newSection }));
                    //     dispatch(changeNowSectionKey(newSection.sectionKey));
                    //   }, [dispatch, generateUUID]);

                    const newSection: SectionData = {
                      sectionKey: generateUUID(),
                      layoutValues: [],
                    };
                    if (componentType === "컨테이너") {
                      dispatch(addSection({ newSection }));
                      return;
                    }
                    // setDroppedComponents(updatedComponents);
                    addToHistory(updatedComponents);
                  }
                }}
              >
                {awareness && (
                  <div className="fixed top-4 right-4 z-10 bg-white p-4 rounded-lg shadow-lg">
                    <ActiveUsers
                      awareness={awareness}
                      layoutDatas={layoutDatas}
                    />
                  </div>
                )}
                <MainContent
                  layoutDatas={layoutDatas}
                  selectedItemKey={selectedItemKey}
                  nowSectionKey={nowSectionKey}
                />
                {/* {droppedComponents.map((component) => (
                  <div
                    key={component.id}
                    id={`dropped-${component.id}`}
                    className={`absolute bg-white shadow-lg rounded-lg cursor-move p-4 ${selectedComponent === component.type ? "ring-2 ring-blue-500" : ""}`}
                    style={{
                      left: `${component.position.x}px`,
                      top: `${component.position.y}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleComponentSelect(component.type);
                    }}
                    // onDragOver={(e) => {
                    //   if (component.type === "컨테이너") {
                    //     e.preventDefault();
                    //     e.currentTarget.classList.add("bg-blue-50");
                    //   }
                    // }}
                    // onDragLeave={(e) => {
                    //   if (component.type === "컨테이너") {
                    //     e.currentTarget.classList.remove("bg-blue-50");
                    //   }
                    // }}
                    // onDrop={(e) => {
                    //   // if (component.type === "컨테이너") {
                    //   e.preventDefault();
                    //   e.currentTarget.classList.remove("bg-blue-50");
                    //   const componentType =
                    //     e.dataTransfer.getData("text/plain");
                    //   const rect = e.currentTarget.getBoundingClientRect();
                    //   const x = e.clientX - rect.left;
                    //   const y = e.clientY - rect.top;
                    //   const newComponent: ComponentItem = {
                    //     id: `${componentType}-${Date.now()}`,
                    //     type: componentType,
                    //     position: { x, y },
                    //   };
                    //   const updatedComponents = [
                    //     ...droppedComponents,
                    //     newComponent,
                    //   ];
                    //   setDroppedComponents(updatedComponents);
                    //   addToHistory(updatedComponents);

                    //   // 컨테이너에 드롭된 경우 addSection 호출
                    //   if (componentType === "컨테이너") {
                    //     const newSection: SectionData = {
                    //       sectionKey: generateUUID(),
                    //       layoutValues: [],
                    //     };
                    //     dispatch(addSection({ newSection }));
                    //   }
                    //   // }
                    // }}
                  >
                    <div className="flex items-center space-x-2 p-2">
                      <i
                        className={`fas fa-${
                          component.type === "텍스트"
                            ? "font"
                            : component.type === "버튼"
                              ? "square"
                              : component.type === "이미지"
                                ? "image"
                                : component.type === "아이콘"
                                  ? "icons"
                                  : "minus"
                        } text-gray-500`}
                      ></i>
                      <span>{component.type}</span>
                    </div>
                  </div>
                ))} */}
                {layoutDatas.length === 0 && (
                  <div className="text-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="text-gray-400 mb-3">
                      <i className="fas fa-plus-circle text-5xl"></i>
                    </div>
                    <p className="text-gray-500 text-lg font-medium">
                      여기에 컨테이너를 드래그하여 추가하세요
                    </p>
                    <p className="text-gray-400 text-sm mt-2">
                      왼쪽 패널에서 원하는 요소를 선택하여 드래그하세요
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        {/* 우측 사이드바 (속성 패널) */}
        <SideMenu
          // isOpen={isSideMenuOpen}
          // onClose={() => setIsSideMenuOpen(false)}
          addSection={() => {}}
          isFullscreen={isFullscreen}
        />

        {/* Setting Dialog */}

        {showSettings && (
          <SettingDialog setShowSettings={setShowSettings}></SettingDialog>
        )}

        {/* Toast Notification */}
        <div
          className={`fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg transform transition-transform duration-300 flex items-center ${
            showToast ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <i className="fas fa-check-circle mr-2"></i>
          프로젝트가 성공적으로 저장되었습니다
        </div>
      </div>
    </div>
  );
};
export default App;
