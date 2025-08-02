import React from 'react';
import { useEditor } from '@craftjs/core';

export const SelectionBox: React.FC = () => {
  const { selectedNodeIds, nodes } = useEditor((state) => ({
    selectedNodeIds: Array.from(state.events.selected),
    nodes: state.nodes,
  }));

  if (selectedNodeIds.length === 0) return null;

  return (
    <div className="selection-box fixed inset-0 pointer-events-none z-40">
      {selectedNodeIds.map(nodeId => {
        const node = nodes[nodeId];
        if (!node) return null;

        // In a real implementation, you'd calculate the actual DOM position
        // This is a simplified version
        return (
          <div
            key={nodeId}
            className="absolute border-2 border-blue-500 bg-blue-500 bg-opacity-10"
            style={{
              // Position would be calculated from actual DOM element
              top: 0,
              left: 0,
              width: 100,
              height: 50,
            }}
          >
            <div className="absolute -top-6 left-0 bg-blue-500 text-white px-2 py-1 text-xs rounded">
              {node.data.displayName || (typeof node.data.type === 'string' ? node.data.type : 'Component')}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const HoverHighlight: React.FC = () => {
  const { hoveredNodeIds, nodes } = useEditor((state) => ({
    hoveredNodeIds: Array.from(state.events.hovered),
    nodes: state.nodes,
  }));

  if (hoveredNodeIds.length === 0) return null;

  return (
    <div className="hover-highlight fixed inset-0 pointer-events-none z-30">
      {hoveredNodeIds.map(nodeId => {
        const node = nodes[nodeId];
        if (!node) return null;

        return (
          <div
            key={nodeId}
            className="absolute border-2 border-gray-400 border-dashed bg-gray-400 bg-opacity-5"
            style={{
              // Position would be calculated from actual DOM element
              top: 0,
              left: 0,
              width: 100,
              height: 50,
            }}
          />
        );
      })}
    </div>
  );
};

export const SnapGuides: React.FC<{
  enabled?: boolean;
}> = ({ enabled = true }) => {
  const { isDragging } = useEditor((state) => ({
    isDragging: state.events.dragged.size > 0,
  }));

  if (!enabled || !isDragging) return null;

  return (
    <div className="snap-guides fixed inset-0 pointer-events-none z-35">
      {/* Vertical snap line */}
      <div className="absolute top-0 bottom-0 w-px bg-red-500" style={{ left: '50%' }} />
      
      {/* Horizontal snap line */}
      <div className="absolute left-0 right-0 h-px bg-red-500" style={{ top: '50%' }} />
      
      {/* Corner indicators */}
      <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ top: '25%', left: '25%' }} />
      <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ top: '25%', right: '25%' }} />
      <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ bottom: '25%', left: '25%' }} />
      <div className="absolute w-2 h-2 bg-red-500 rounded-full" style={{ bottom: '25%', right: '25%' }} />
    </div>
  );
};

export const StatusBar: React.FC = () => {
  const { selectedCount, nodeCount, canUndo, canRedo, enabled } = useEditor((state, query) => ({
    selectedCount: state.events.selected.size,
    nodeCount: Object.keys(state.nodes).length - 1, // Exclude ROOT
    canUndo: query.history.canUndo(),
    canRedo: query.history.canRedo(),
    enabled: state.options.enabled,
  }));

  return (
    <div className="status-bar bg-gray-50 border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
      <div className="flex items-center gap-4">
        <span>
          {nodeCount}개 컴포넌트
          {selectedCount > 0 && `, ${selectedCount}개 선택됨`}
        </span>
        
        <div className="flex items-center gap-2">
          <span className={enabled ? 'text-green-600' : 'text-red-600'}>
            {enabled ? '편집 모드' : '미리보기 모드'}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className={canUndo ? 'text-blue-600' : 'text-gray-400'}>
            실행취소 {canUndo ? '가능' : '불가'}
          </span>
          <span className={canRedo ? 'text-blue-600' : 'text-gray-400'}>
            다시실행 {canRedo ? '가능' : '불가'}
          </span>
        </div>
        
        <div className="text-gray-500">
          Craft.js Editor v0.2.12
        </div>
      </div>
    </div>
  );
};