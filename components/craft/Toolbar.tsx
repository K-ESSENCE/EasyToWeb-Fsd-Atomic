import React from 'react';
import { useEditor } from '@craftjs/core';

const SelectedComponentToolbar = () => {
  const { selected } = useEditor((state) => {
    const [currentNodeId] = state.events.selected;
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related?.toolbar,
        isDeletable: state.nodes[currentNodeId].data.parent !== 'ROOT',
      };
    }

    return {
      selected,
    };
  });

  const { actions } = useEditor();

  if (!selected) {
    return (
      <div className="toolbar-empty p-4 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
          </svg>
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">선택된 컴포넌트가 없습니다</h3>
        <p className="text-xs text-gray-500">
          컴포넌트를 클릭하여 속성을 확인하세요
        </p>
      </div>
    );
  }

  const ToolbarComponent = selected.settings;

  return (
    <div className="toolbar-content">
      {/* Header */}
      <div className="toolbar-header p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 capitalize">
              {selected.name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              컴포넌트 속성
            </p>
          </div>
          {selected.isDeletable && (
            <button
              onClick={() => {
                actions.delete(selected.id);
              }}
              className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
              title="컴포넌트 삭제"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Component-specific toolbar */}
      <div className="toolbar-settings p-4">
        {ToolbarComponent ? (
          <ToolbarComponent />
        ) : (
          <div className="text-sm text-gray-500">
            이 컴포넌트에 사용 가능한 설정이 없습니다
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="toolbar-actions p-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => {
            // TODO: Implement duplication functionality
            console.log('Duplicate functionality to be implemented');
          }}
          className="w-full px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
        >
          복제하기
        </button>
        
        {selected.isDeletable && (
          <button
            onClick={() => {
              actions.delete(selected.id);
            }}
            className="w-full px-3 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
          >
            컴포넌트 삭제
          </button>
        )}
      </div>
    </div>
  );
};

export const Toolbar: React.FC = () => {
  return (
    <div className="toolbar h-full bg-white overflow-y-auto">
      <SelectedComponentToolbar />
    </div>
  );
};