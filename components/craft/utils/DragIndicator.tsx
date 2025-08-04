import React from 'react';
import { useEditor } from '@craftjs/core';

export const DragIndicator: React.FC = () => {
  const { isDragging, draggedNode } = useEditor((state) => ({
    isDragging: state.events.dragged.size > 0,
    draggedNode: state.events.dragged.size > 0 ? 
      Array.from(state.events.dragged)[0] : null,
  }));

  if (!isDragging || !draggedNode) {
    return null;
  }

  return (
    <div className="drag-indicator fixed inset-0 pointer-events-none z-50">
      {/* Drag overlay */}
      <div className="absolute inset-0 bg-blue-500 bg-opacity-10" />
      
      {/* Drag helper */}
      <div className="absolute top-4 left-4 bg-blue-600 text-white px-3 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        <span className="text-sm font-medium">드래그 중...</span>
      </div>
    </div>
  );
};

export const DropZone: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  const { isOver } = useEditor(() => ({
    isOver: false, // This would need to be implemented with proper drop detection
  }));

  return (
    <div
      className={`drop-zone ${className} ${
        isOver ? 'bg-blue-50 border-2 border-blue-300 border-dashed' : ''
      }`}
    >
      {children}
      
      {isOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-90">
          <div className="text-blue-600 font-medium flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            여기에 드롭하세요
          </div>
        </div>
      )}
    </div>
  );
};

export const GridLines: React.FC<{
  enabled?: boolean;
  spacing?: number;
}> = ({ enabled = false, spacing = 20 }) => {
  if (!enabled) return null;

  const gridStyle: React.CSSProperties = {
    backgroundImage: `
      linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
    `,
    backgroundSize: `${spacing}px ${spacing}px`,
    backgroundPosition: '0 0, 0 0',
  };

  return (
    <div
      className="grid-lines absolute inset-0 pointer-events-none"
      style={gridStyle}
    />
  );
};