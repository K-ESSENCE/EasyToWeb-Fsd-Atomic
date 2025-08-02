import React from 'react';
import { useEditor } from '@craftjs/core';

export const History: React.FC = () => {
  const { actions, canUndo, canRedo } = useEditor((state, query) => ({
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
  }));

  return (
    <div className="history-controls flex items-center gap-1">
      <button
        onClick={() => actions.history.undo()}
        disabled={!canUndo}
        className={`p-2 rounded-md transition-colors ${
          canUndo
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="실행 취소 (Ctrl+Z)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
        </svg>
      </button>
      
      <button
        onClick={() => actions.history.redo()}
        disabled={!canRedo}
        className={`p-2 rounded-md transition-colors ${
          canRedo
            ? 'text-gray-700 hover:bg-gray-100'
            : 'text-gray-300 cursor-not-allowed'
        }`}
        title="다시 실행 (Ctrl+Y)"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10h-10a8 8 0 00-8 8v2m18-10l-6-6m6 6l-6 6" />
        </svg>
      </button>
    </div>
  );
};