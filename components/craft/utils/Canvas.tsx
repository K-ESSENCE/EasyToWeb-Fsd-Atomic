import React from "react";
import { useEditor } from "@craftjs/core";

export const CanvasController: React.FC = () => {
  const { actions, enabled, query } = useEditor((state, query) => ({
    enabled: state.options.enabled,
  }));

  const clearCanvas = () => {
    if (
      confirm("캔버스를 완전히 지우시겠습니까? 이 작업은 되돌릴 수 없습니다.")
    ) {
      // Clear all selected events first
      actions.clearEvents();

      // Get current state and find all non-ROOT nodes
      const currentState = query.getState();
      const allNodeIds = Object.keys(currentState.nodes);

      // Delete all nodes except ROOT
      allNodeIds.forEach((nodeId) => {
        if (nodeId !== "ROOT") {
          try {
            actions.delete(nodeId);
          } catch (error) {
            console.warn(`Failed to delete node ${nodeId}:`, error);
          }
        }
      });
    }
  };

  return (
    <div className="canvas-controller flex items-center gap-2">
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
      canvasCount: nodes.filter((node) => node.data.isCanvas).length,
    };
  });

  return (
    <div className="canvas-stats flex items-center gap-4 text-sm text-gray-600">
      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <span>{nodeCount}개 컴포넌트</span>
      </div>

      {selectedCount > 0 && (
        <div className="flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122"
            />
          </svg>
          <span>{selectedCount}개 선택</span>
        </div>
      )}

      <div className="flex items-center gap-1">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <span>{canvasCount}개 캔버스</span>
      </div>
    </div>
  );
};
