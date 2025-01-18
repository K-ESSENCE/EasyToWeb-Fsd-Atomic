import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { updateSectionTitle } from '../../store/slices/layouts';

const SideMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const selectedSectionKey = useSelector((state: RootState) => state.keys.nowSectionKey);
  const sections = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const selectedSection = sections.find(section => section.sectionKey === selectedSectionKey);
  
  const [sectionsState, setSections] = useState<string[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [menuType, setMenuType] = useState<'settings' | 'sections'>('settings');
  const [title, setTitle] = useState<string>(selectedSection?.title || '');

  React.useEffect(() => {
    setTitle(selectedSection?.title || '');
  }, [selectedSection]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (selectedSectionKey) {
      dispatch(updateSectionTitle({ 
        sectionKey: selectedSectionKey, 
        title: newTitle 
      }));
    }
  };

  const addSection = () => {
    const newSectionId = crypto.randomUUID();
    setSections([...sectionsState, newSectionId]);
    setSelectedSectionId(newSectionId);
  };

  const deleteSection = () => {
    setSections(sectionsState.filter(id => id !== selectedSectionId));
    setSelectedSectionId('');
  };

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

  if (!isOpen) return null;

  if (menuType === 'settings') {
    return (
      <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed right-0 top-0">
        <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-900">설정</h2>
          <button 
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors relative group"
            title="닫기"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4">
          <div className="space-y-4">
            {/* 섹션 설정 */}
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
                <label className="block">
                  <span className="text-sm text-gray-600">배경색</span>
                  <div className="mt-1 flex gap-2">
                    <button className="w-6 h-6 rounded-full bg-white border border-gray-300 focus:ring-2 focus:ring-blue-500"></button>
                    <button className="w-6 h-6 rounded-full bg-gray-100 border border-gray-300 focus:ring-2 focus:ring-blue-500"></button>
                    <button className="w-6 h-6 rounded-full bg-blue-50 border border-gray-300 focus:ring-2 focus:ring-blue-500"></button>
                  </div>
                </label>
              </div>
            </div>

            {/* 요소 추가 */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">요소 추가</h3>
              <div className="grid grid-cols-2 gap-2">
                <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center">
                  <i className="fas fa-heading text-lg mb-1"></i>
                  <span className="text-xs">제목</span>
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center">
                  <i className="fas fa-align-left text-lg mb-1"></i>
                  <span className="text-xs">텍스트</span>
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center">
                  <i className="fas fa-image text-lg mb-1"></i>
                  <span className="text-xs">이미지</span>
                </button>
                <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex flex-col items-center justify-center">
                  <i className="fas fa-play-circle text-lg mb-1"></i>
                  <span className="text-xs">비디오</span>
                </button>
              </div>
            </div>

            {/* 스타일 설정 */}
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3">스타일 설정</h3>
              <div className="space-y-2">
                <label className="block">
                  <span className="text-sm text-gray-600">글꼴</span>
                  <select className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500">
                    <option>Noto Sans KR</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm text-gray-600">정렬</span>
                  <div className="mt-1 flex gap-2">
                    <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex-1 flex items-center justify-center">
                      <i className="fas fa-align-left"></i>
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex-1 flex items-center justify-center">
                      <i className="fas fa-align-center"></i>
                    </button>
                    <button className="p-2 border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-500 transition-colors flex-1 flex items-center justify-center">
                      <i className="fas fa-align-right"></i>
                    </button>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Sections menu (menuType === 'sections')
  if (sectionsState.length === 0) {
    return (
      <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed right-0 top-0">
        <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="text-xl font-bold text-gray-900">섹션 목록</h2>
          <button 
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors relative group"
            title="닫기"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2">
          <div className="space-y-2">
            {/* Empty state message */}
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="text-gray-500 mb-4">
                <i className="fas fa-folder-plus text-4xl"></i>
              </div>
              <p className="text-gray-600 mb-4">
                아직 생성된 섹션이 없습니다.<br/>
                새로운 섹션을 추가해보세요.
              </p>
            </div>
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
      </div>
    );
  }

  return (
    <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed right-0 top-0">
      <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-gray-900">섹션 목록</h2>
        <button 
          onClick={() => onClose(false)}
          className="text-gray-500 hover:text-gray-700 transition-colors relative group"
          title="닫기"
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2">
        <div className="space-y-2">
          {sectionsState.map((sectionId) => (
            <div 
              key={sectionId}
              className={`p-4 rounded-xl border cursor-pointer transition-colors
                ${selectedSectionId === sectionId 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              onClick={() => setSelectedSectionId(sectionId)}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  selectedSectionId === sectionId ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  섹션 {sectionsState.indexOf(sectionId) + 1}
                </span>
                {selectedSectionId === sectionId && (
                  <span className="text-blue-600 text-sm">선택됨</span>
                )}
              </div>
            </div>
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
    </div>
  );
};

export default SideMenu;