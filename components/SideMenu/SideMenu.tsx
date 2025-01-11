import React, { useState } from 'react';

const SideMenu = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: (value: boolean) => void;
}) => {
  const [sections, setSections] = useState<string[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');

  const addSection = () => {
    const newSectionId = crypto.randomUUID();
    setSections([...sections, newSectionId]);
    setSelectedSectionId(newSectionId);
  };

  const deleteSection = () => {
    setSections(sections.filter(id => id !== selectedSectionId));
    setSelectedSectionId('');
  };

  if (!isOpen) return null;

  // Empty state UI
  if (sections.length === 0) {
    return (
      <div className="fixed top-0 right-0 w-[320px] h-screen bg-gray-100 shadow-lg flex flex-col">
        <div className="flex flex-col items-center justify-center h-screen p-4 text-center">
          <div className="text-gray-500 mb-4">
            <i className="fas fa-folder-plus text-4xl"></i>
          </div>
          <p className="text-gray-600 mb-4">
            아직 생성된 섹션이 없습니다.<br/>
            새로운 섹션을 추가해보세요.
          </p>
          <button 
            onClick={addSection}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            섹션 추가하기
          </button>
        </div>
      </div>
    );
  }

  // Normal UI with sections
  return (
    <div className="mt-[63px] fixed top-0 right-0 w-[320px] h-screen bg-gray-100 shadow-lg flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <button 
          className="text-sm font-medium text-gray-700 !rounded-button"
          onClick={addSection}
        >
          섹션 추가하기
        </button>
        <button 
          className="text-sm font-medium text-gray-700 !rounded-button"
          onClick={deleteSection}
        >
          섹션 삭제하기
        </button>
        <button 
          className="text-gray-500 hover:text-gray-700"
          onClick={() => onClose(false)}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="px-4 py-3 bg-blue-50 text-sm text-blue-600">
        <i className="fas fa-info-circle mr-2"></i>
        아이템은 총 6개까지 추가할 수 있습니다.
      </div>

      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-lg m-2 hover:shadow-lg transition-shadow">
        <div className="flex items-center">
          <div className="w-16 h-16 rounded-lg bg-gray-200 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1720048171527-208cb3e93192?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw0MXx8fGVufDB8fHx8fA%3D%3D"
              alt="프로필 이미지"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-4">
            <h3 className="font-semibold text-gray-900 mb-1">김민수</h3>
            <p className="text-sm text-gray-500">웹 디자이너</p>
            <p className="text-sm text-gray-500">서울, 대한민국</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-lg m-2 hover:shadow-lg transition-shadow">
        <p className="text-sm text-gray-600 leading-relaxed">
          안녕하세요! 저는 사용자 중심의 디자인을 추구하는 웹 디자이너입니다.
          5년간의 경력을 바탕으로 창의적이고 직관적인 디자인 솔루션을 제공합니다.
        </p>
      </div>

      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-lg m-2 hover:shadow-lg transition-shadow">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center hover:bg-gray-300 cursor-pointer transition-colors">
            <i className="fas fa-plus text-gray-600"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;