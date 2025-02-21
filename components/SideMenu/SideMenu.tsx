import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { updateSectionTitle, addImageToSection, addLayoutItem } from '../../store/slices/layouts';
import { MenuHeader } from './components/MenuHeader';
import { SectionItem } from './components/SectionItem';
import { FONTS, BACKGROUND_COLORS, ELEMENTS } from './constants';
import { MenuType, SideMenuProps } from './types';
import { LayoutItemValues } from '../types/common/layoutStyle';

const useKeyboardShortcut = (isOpen: boolean, onClose: (value: boolean) => void) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === '[') {
        event.preventDefault();
        onClose(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);
};

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const sections = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const selectedSection = sections.find(section => section.sectionKey === selectedSectionKey);
  
  const [sectionsState, setSections] = useState<string[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [menuType] = useState<MenuType>('settings');
  const [title, setTitle] = useState<string>(selectedSection?.title || '');

  useKeyboardShortcut(isOpen, onClose);

  useEffect(() => {
    setTitle(selectedSection?.title || '');
  }, [selectedSection]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (selectedSectionKey) {
      dispatch(updateSectionTitle({ sectionKey: selectedSectionKey, title: newTitle }));
    }
  };

  const addSection = () => {
    const newSectionId = crypto.randomUUID();
    setSections([...sectionsState, newSectionId]);
    setSelectedSectionId(newSectionId);
  };

  const handleElementClick = (label: string) => {
    if (!selectedSectionKey) return;

    if (label === '이미지') {
      dispatch(addImageToSection({ sectionKey: selectedSectionKey }));
    } else if (label === '텍스트') {
      const newTextItem: LayoutItemValues = {
        id: crypto.randomUUID(),
        layoutName: 'text',
      };
      dispatch(addLayoutItem({
        id: selectedSectionKey,
        newLayoutItemValue: newTextItem
      }));
    }
  };

  if (!isOpen) return null;

  const renderSettingsContent = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">섹션 설정</h3>
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm text-gray-600">섹션 제목</span>
            <input 
              type="text" 
              value={title}
              onChange={handleTitleChange}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              placeholder="섹션 제목을 입력하세요"
            />
          </label>
          {/* <label className="block">
            <span className="text-sm text-gray-600">배경색</span>
            <div className="mt-1 flex gap-2">
              {BACKGROUND_COLORS.map(({ color, class: bgClass }) => (
                <button 
                  key={color}
                  className={`w-6 h-6 rounded-full ${bgClass} border border-gray-300 focus:ring-2 focus:ring-blue-500`}
                />
              ))}
            </div>
          </label> */}
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">요소 추가</h3>
        <div className="grid grid-cols-3 gap-2">
          {ELEMENTS.map((element) => (
            <button
              key={element.label}
              onClick={() => handleElementClick(element.label)}
              className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center"
            >
              <i className={`fas ${element.icon} text-lg mb-1`}></i>
              <span className="text-xs">{element.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* <div className="bg-white p-4 rounded-xl border border-gray-200">
        <h3 className="text-sm font-medium text-gray-700 mb-3">스타일 설정</h3>
        <div className="space-y-2">
          <label className="block">
            <span className="text-sm text-gray-600">글꼴</span>
            <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
              {FONTS.map(font => (
                <option key={font}>{font}</option>
              ))}
            </select>
          </label>
        </div>
      </div> */}
    </div>
  );

  const renderSectionsList = () => (
    <>
      <div className="overflow-y-auto flex-1 p-2">
        <div className="space-y-2">
          {sectionsState.map((sectionId, index) => (
            <SectionItem
              key={sectionId}
              sectionId={sectionId}
              isSelected={selectedSectionId === sectionId}
              index={index}
              onSelect={setSelectedSectionId}
            />
          ))}
        </div>
      </div>
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={addSection}
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-md"
        >
          <i className="fas fa-plus"></i>
          새 섹션 만들기
        </button>
      </div>
    </>
  );

  return (
    <div className={`w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed ${isOpen ? 'right-0' : '-right-[280px]'} top-0 transition-all duration-300`}>
      <MenuHeader title="편집" onClose={()=>onClose(false)} />
      <div className="overflow-y-auto flex-1 p-4">
        {menuType === 'settings' ? renderSettingsContent() : renderSectionsList()}
      </div>
    </div>
  );
};

export default SideMenu;