import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../store/configureStore';
import { addSection, deleteSection } from '../../store/slices/layouts';
import { changeNowSectionKey, changeNowItemKey } from '../../store/slices/keys';

const SectionList = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) => {
  const dispatch = useDispatch();
  const sections = useSelector((state: RootState) => state.layouts.layoutDatas.sectionValues);
  const selectedSectionId = useSelector((state: RootState) => state.keys.nowSectionKey);

  const handleAddSection = () => {
    const newSectionKey = crypto.randomUUID();
    dispatch(addSection({ 
      newSection: {
        sectionKey: newSectionKey,
        layoutValues: [],
        title: ''
      }
    }));
    dispatch(changeNowSectionKey(newSectionKey));
  };

  const handleDeleteSection = () => {
    if (selectedSectionId) {
      dispatch(deleteSection({ id: selectedSectionId }));
      dispatch(changeNowSectionKey(''));
      dispatch(changeNowItemKey(''));
    }
  };

  const handleSelectSection = (sectionKey: string) => {
    dispatch(changeNowSectionKey(sectionKey));
    dispatch(changeNowItemKey(''));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === ']') {
        event.preventDefault();
        onClose(!isOpen);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  if (!sections || sections.length === 0) {
    return (
      <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed left-0 top-0">
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
        <div className="overflow-y-auto flex-1 p-2 pb-24">
          <div className="space-y-2">
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
        <div className="p-4 border-t border-gray-200 absolute bottom-16 w-full bg-gray-50">
          <button 
            onClick={handleAddSection}
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
    <div className="w-[280px] h-screen bg-gray-50 shadow-md flex flex-col fixed left-0 top-0">
      <div className="mt-[64px] px-4 py-5 border-b border-gray-200 flex justify-between items-center bg-white">
        <h2 className="text-xl font-bold text-gray-900">섹션 목록</h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDeleteSection}
            className="text-gray-500 hover:text-gray-700 transition-colors relative group"
            title="섹션 삭제"
            disabled={!selectedSectionId}
          >
            <i className="fas fa-trash"></i>
          </button>
          <button 
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors relative group"
            title="닫기"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 pb-24">
        <div className="space-y-2">
          {sections.map((section, index) => (
            <div 
              key={section.sectionKey}
              className={`p-4 rounded-xl border cursor-pointer transition-colors
                ${selectedSectionId === section.sectionKey 
                  ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' 
                  : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              onClick={() => handleSelectSection(section.sectionKey)}
            >
              <div className="flex items-center justify-between">
                <span className={`font-medium ${
                  selectedSectionId === section.sectionKey ? 'text-blue-700' : 'text-gray-900'
                }`}>
                  {section.title || `섹션 ${index + 1}`}
                </span>
                {selectedSectionId === section.sectionKey && (
                  <span className="text-blue-600 text-sm">선택됨</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 absolute bottom-16 w-full bg-gray-50">
        <button 
          onClick={handleAddSection}
          className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-sm font-medium flex items-center justify-center gap-2 shadow-md"
        >
          <i className="fas fa-plus"></i>
          새 섹션 만들기
        </button>
      </div>
    </div>
  );
};

export default SectionList;
