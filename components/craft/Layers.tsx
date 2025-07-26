import React from 'react';
import { useEditor } from '@craftjs/core';

const LayerItem: React.FC<{
  id: string;
  depth: number;
}> = ({ id, depth }) => {
  const { actions, query, isSelected } = useEditor((state) => ({
    isSelected: state.events.selected.has(id),
  }));

  const {
    data: { type, props, nodes, linkedNodes },
    rules: { canDrag, canDrop, canMoveOut, canMoveIn },
  } = useEditor((state) => state.nodes[id]);

  const { isHover, isDragging } = useEditor((state) => ({
    isHover: state.events.hovered.has(id),
    isDragging: state.events.dragged.has(id),
  }));

  const getKoreanName = (componentName: string) => {
    const nameMap: { [key: string]: string } = {
      'Container': '컨테이너',
      'Text': '텍스트', 
      'Image': '이미지',
      'Component': '컴포넌트'
    };
    return nameMap[componentName] || componentName;
  };

  const componentName = typeof type === 'string' 
    ? type === 'div' 
      ? 'Container' 
      : type 
    : (type as any)?.displayName || (type as any)?.name || 'Component';
    
  const name = getKoreanName(componentName);

  return (
    <div className="layer-item">
      <div
        className={`
          layer-item-content flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-sm
          transition-colors duration-150
          ${isSelected 
            ? 'bg-blue-100 text-blue-900 border border-blue-200' 
            : isHover 
              ? 'bg-gray-100 text-gray-900' 
              : 'text-gray-700 hover:bg-gray-50'
          }
          ${isDragging ? 'opacity-50' : ''}
        `}
        style={{ marginLeft: `${depth * 16}px` }}
        onClick={(e) => {
          e.stopPropagation();
          actions.selectNode(id);
        }}
      >
        {/* Expand/Collapse Icon */}
        {nodes && nodes.length > 0 && (
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        
        {/* Component Icon */}
        <div className="text-gray-500">
          {name === '텍스트' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
          )}
          {name === '이미지' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          )}
          {name === '컨테이너' && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          )}
        </div>

        {/* Component Name */}
        <span className="flex-1 truncate font-medium">
          {name}
        </span>

        {/* Visibility Toggle */}
        <button
          className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-white hover:bg-opacity-50 rounded"
          onClick={(e) => {
            e.stopPropagation();
            // Toggle visibility logic here
          }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </button>
      </div>

      {/* Render children */}
      {nodes && nodes.map((childId: string) => (
        <LayerItem key={childId} id={childId} depth={depth + 1} />
      ))}
    </div>
  );
};

export const Layers: React.FC = () => {
  const { rootNodeId } = useEditor((state) => ({
    rootNodeId: state.nodes.ROOT?.data?.nodes?.[0],
  }));

  if (!rootNodeId) {
    return (
      <div className="layers-empty p-4 text-center">
        <div className="text-gray-400 mb-2">
          <svg className="w-8 h-8 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        </div>
        <p className="text-sm text-gray-500">컴포넌트가 없습니다</p>
      </div>
    );
  }

  return (
    <div className="layers">
      <div className="layers-header p-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900">페이지 구조</h4>
      </div>
      <div className="layers-content p-2 space-y-1">
        <LayerItem id={rootNodeId} depth={0} />
      </div>
    </div>
  );
};