import React from 'react';
import { useEditor } from '@craftjs/core';

export const CanvasController: React.FC = () => {
  const { actions, enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const clearCanvas = () => {
    if (confirm('캔버스를 완전히 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      actions.clearEvents();
      // Clear all nodes except ROOT
      const rootNode = {
        type: 'div',
        isCanvas: true,
        props: {},
        displayName: 'Root',
        custom: {},
        hidden: false,
        nodes: [],
        linkedNodes: {},
      };
      actions.deserialize(JSON.stringify({ ROOT: { data: rootNode } }));
    }
  };

  const resetCanvas = () => {
    if (confirm('캔버스를 초기 상태로 되돌리시겠습니까?')) {
      // Simply clear all nodes and let the Frame create the default structure
      const rootOnlyState = {
        ROOT: {
          data: {
            type: 'div',
            isCanvas: true,
            props: {},
            displayName: 'Root',
            custom: {},
            hidden: false,
            nodes: [],
            linkedNodes: {},
          }
        }
      };
      actions.deserialize(JSON.stringify(rootOnlyState));
    }
  };

  const toggleEnabled = () => {
    actions.setOptions(options => {
      options.enabled = !enabled;
    });
  };

  return (
    <div className="canvas-controller flex items-center gap-2">
      <button
        onClick={toggleEnabled}
        className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
          enabled
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}
      >
        {enabled ? '편집 가능' : '편집 잠금'}
      </button>
      
      <button
        onClick={resetCanvas}
        className="px-3 py-1.5 text-sm font-medium text-orange-700 bg-orange-50 border border-orange-200 rounded-md hover:bg-orange-100 transition-colors"
      >
        초기화
      </button>
      
      <button
        onClick={clearCanvas}
        className="px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 transition-colors"
      >
        모두 지우기
      </button>
    </div>
  );
};

export const CanvasStats: React.FC = () => {
  const { nodeCount, selectedCount, canvasCount } = useEditor((state) => {
    const nodes = Object.values(state.nodes);
    return {
      nodeCount: nodes.length - 1, // Exclude ROOT
      selectedCount: state.events.selected.size,
      canvasCount: nodes.filter(node => node.data.isCanvas).length,
    };
  });

  return (
    <div className="canvas-stats flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span>{nodeCount}개 컴포넌트</span>
      </div>
      
      {selectedCount > 0 && (
        <div className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />
          </svg>
          <span>{selectedCount}개 선택</span>
        </div>
      )}
      
      <div className="flex items-center gap-1">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        <span>{canvasCount}개 캔버스</span>
      </div>
    </div>
  );
};