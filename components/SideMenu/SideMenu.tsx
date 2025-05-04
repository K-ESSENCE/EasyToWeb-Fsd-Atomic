// import { useState, useEffect } from "react";

import { useSelector } from "react-redux";
import { SideMenuProps } from "./types";
import { RootState } from "../../store/configureStore";
// import {
//   updateSectionTitle,
//   addImageToSection,
//   addLayoutItem,
// } from "../../store/slices/layouts";
// import { MenuHeader } from "./components/MenuHeader";
// import { SectionItem } from "./components/SectionItem";
// import { FONTS, BACKGROUND_COLORS, ELEMENTS } from "./constants";
// import { MenuType, SideMenuProps } from "./types";
// import { LayoutItemValues } from "../types/common/layoutStyle";

// const useKeyboardShortcut = (
//   isOpen: boolean,
//   onClose: (value: boolean) => void
// ) => {
//   useEffect(() => {
//     const handleKeyDown = (event: KeyboardEvent) => {
//       if (event.ctrlKey && event.key === "[") {
//         event.preventDefault();
//         onClose(!isOpen);
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [isOpen, onClose]);
// };

const SideMenu = ({ isFullscreen }: SideMenuProps) => {
  // const dispatch = useDispatch();

  const nowSectionKey = useSelector(
    (state: RootState) => state.keys.nowSectionKey
  );

  const selectedItemKey = useSelector(
    (state: RootState) => state.keys.nowItemKey
  );

  const nowSection = useSelector((state: RootState) =>
    state.layouts.layoutDatas.sectionValues.find(
      (section) => section.sectionKey === nowSectionKey
    )
  );

  const nowItem = nowSection?.layoutValues.find(
    (item) => item.id === selectedItemKey
  );

  console.log(nowItem);

  // const sections = useSelector(
  //   (state: RootState) => state.layouts.layoutDatas.sectionValues
  // );
  // const selectedSection = sections.find(
  //   (section) => section.sectionKey === selectedSectionKey
  // );

  // const [sectionsState, setSections] = useState<string[]>([]);
  // const [selectedSectionId, setSelectedSectionId] = useState<string>("");
  // const [menuType] = useState<MenuType>("settings");
  // const [title, setTitle] = useState<string>(selectedSection?.title || "");

  // useKeyboardShortcut(isOpen, onClose);

  // useEffect(() => {
  //   setTitle(selectedSection?.title || "");
  // }, [selectedSection]);

  // const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const newTitle = e.target.value;
  //   setTitle(newTitle);
  //   if (selectedSectionKey) {
  //     dispatch(
  //       updateSectionTitle({ sectionKey: selectedSectionKey, title: newTitle })
  //     );
  //   }
  // };

  // const addSection = () => {
  //   const newSectionId = crypto.randomUUID();
  //   setSections([...sectionsState, newSectionId]);
  //   setSelectedSectionId(newSectionId);
  // };

  // const handleElementClick = (label: string) => {
  //   if (!selectedSectionKey) return;

  //   if (label === "이미지") {
  //     dispatch(addImageToSection({ sectionKey: selectedSectionKey }));
  //   } else if (label === "텍스트") {
  //     const newTextItem: LayoutItemValues = {
  //       id: crypto.randomUUID(),
  //       layoutName: "text",
  //     };
  //     dispatch(
  //       addLayoutItem({
  //         id: selectedSectionKey,
  //         newLayoutItemValue: newTextItem,
  //       })
  //     );
  //   }
  // };

  // if (!isOpen) return null;

  // const renderSettingsContent = () => (
  //   <div className="space-y-4">
  //     <div className="bg-white p-4 rounded-xl border border-gray-200">
  //       <h3 className="text-sm font-medium text-gray-700 mb-3">섹션 설정</h3>
  //       <div className="space-y-2">
  //         <label className="block">
  //           <span className="text-sm text-gray-600">섹션 제목</span>
  //           <input
  //             type="text"
  //             value={title}
  //             onChange={handleTitleChange}
  //             className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
  //             placeholder="섹션 제목을 입력하세요"
  //           />
  //         </label>
  //         {/* <label className="block">
  //           <span className="text-sm text-gray-600">배경색</span>
  //           <div className="mt-1 flex gap-2">
  //             {BACKGROUND_COLORS.map(({ color, class: bgClass }) => (
  //               <button
  //                 key={color}
  //                 className={`w-6 h-6 rounded-full ${bgClass} border border-gray-300 focus:ring-2 focus:ring-blue-500`}
  //               />
  //             ))}
  //           </div>
  //         </label> */}
  //       </div>
  //     </div>

  //     <div className="bg-white p-4 rounded-xl border border-gray-200">
  //       <h3 className="text-sm font-medium text-gray-700 mb-3">요소 추가</h3>
  //       <div className="grid grid-cols-3 gap-2">
  //         {ELEMENTS.map((element) => (
  //           <button
  //             key={element.label}
  //             onClick={() => handleElementClick(element.label)}
  //             className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center"
  //           >
  //             <i className={`fas ${element.icon} text-lg mb-1`}></i>
  //             <span className="text-xs">{element.label}</span>
  //           </button>
  //         ))}
  //       </div>
  //     </div>

  //     {/* <div className="bg-white p-4 rounded-xl border border-gray-200">
  //       <h3 className="text-sm font-medium text-gray-700 mb-3">스타일 설정</h3>
  //       <div className="space-y-2">
  //         <label className="block">
  //           <span className="text-sm text-gray-600">글꼴</span>
  //           <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
  //             {FONTS.map(font => (
  //               <option key={font}>{font}</option>
  //             ))}
  //           </select>
  //         </label>
  //       </div>
  //     </div> */}
  //   </div>
  // );

  // const renderSectionsList = () => (
  //   <>
  //     <div className="overflow-y-auto flex-1 p-2">
  //       <div className="space-y-2">
  //         {sectionsState.map((sectionId, index) => (
  //           <SectionItem
  //             key={sectionId}
  //             sectionId={sectionId}
  //             isSelected={selectedSectionId === sectionId}
  //             index={index}
  //             onSelect={setSelectedSectionId}
  //           />
  //         ))}
  //       </div>
  //     </div>
  //     <div className="p-4 border-t border-gray-200">
  //       <button
  //         onClick={addSection}
  //         className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-md"
  //       >
  //         <i className="fas fa-plus"></i>새 섹션 만들기
  //       </button>
  //     </div>
  //   </>
  // );

  return (
    // <div className={`w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed ${isOpen ? 'right-0' : '-right-[280px]'} top-0 transition-all duration-300`}>
    //   <MenuHeader title="편집" onClose={()=>onClose(false)} />
    //   <div className="overflow-y-auto flex-1 p-4">
    //     {menuType === 'settings' ? renderSettingsContent() : renderSectionsList()}
    //   </div>
    // </div>
    <aside
      className={`w-72 bg-white border-l border-gray-200 overflow-y-auto transition-all duration-300 ${isFullscreen ? "hidden" : ""}`}
    >
      {selectedItemKey ? (
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-800">
              {nowItem?.layoutName} 속성
            </h3>
            <button className="text-gray-400 hover:text-gray-600 cursor-pointer whitespace-nowrap">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="space-y-5">
            <div>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    너비
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="100%"
                    />
                    <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-3 py-2 text-sm text-gray-500">
                      px
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    높이
                  </label>
                  <div className="flex items-center">
                    <input
                      type="text"
                      className="w-full border border-gray-300 rounded-l-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="자동"
                    />
                    <div className="bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg px-3 py-2 text-sm text-gray-500">
                      px
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    여백
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">상단</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">우측</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">하단</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs text-gray-500 mb-1">좌측</span>
                      <input
                        type="text"
                        className="w-full border border-gray-300 rounded-lg px-2 py-1 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                스타일
              </h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    배경색
                  </label>
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-l-lg border border-gray-300 bg-white"></div>
                    <input
                      type="text"
                      className="w-full border border-gray-300 border-l-0 rounded-r-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    테두리
                  </label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                        <option>없음</option>
                        <option>실선</option>
                        <option>점선</option>
                        <option>대시</option>
                      </select>
                    </div>
                    <input
                      type="text"
                      className="w-16 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="1"
                    />
                    <div className="w-8 h-8 rounded-lg border border-gray-300 bg-black"></div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    모서리 반경
                  </label>
                  <input
                    type="range"
                    className="w-full"
                    min="0"
                    max="20"
                    step="1"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0px</span>
                    <span>10px</span>
                    <span>20px</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                인터랙션
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700">
                    클릭 가능
                  </label>
                  <div className="relative inline-block w-10 mr-2 align-middle select-none">
                    <input
                      type="checkbox"
                      name="toggle"
                      id="toggle"
                      className="checked:bg-blue-500 outline-none focus:outline-none right-4 checked:right-0 duration-200 ease-in absolute block w-6 h-6 rounded-full bg-white border-4 border-gray-300 cursor-pointer"
                    />
                    <label
                      htmlFor="toggle"
                      className="block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"
                    ></label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    클릭 액션
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>없음</option>
                    <option>링크 열기</option>
                    <option>팝업 표시</option>
                    <option>스크롤 이동</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    호버 효과
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>없음</option>
                    <option>색상 변경</option>
                    <option>크기 확대</option>
                    <option>그림자 추가</option>
                  </select>
                </div>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                고급 설정
              </h4>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CSS 커스터마이징
                </label>
                <textarea
                  className="w-full h-24 border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder=".element {
/* 여기에 CSS 작성 */
}"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full flex items-center justify-center p-6">
          <div className="text-center">
            <div className="text-gray-400 mb-3">
              <i className="fas fa-hand-pointer text-5xl"></i>
            </div>
            <p className="text-gray-500 text-lg font-medium">
              요소를 선택하세요
            </p>
            <p className="text-gray-400 text-sm mt-2">
              편집할 요소를 선택하면 여기에 속성이 표시됩니다
            </p>
          </div>
        </div>
      )}
    </aside>
  );
};

export default SideMenu;
