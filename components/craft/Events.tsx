import React, { useEffect, useState } from 'react';
import { useEditor } from '@craftjs/core';

export const EventLogger: React.FC = () => {
  const [events, setEvents] = useState<Array<{ type: string; timestamp: Date; data?: unknown }>>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  const { selectedNodeIds, draggedNodeIds, nodeCount } = useEditor((state) => ({
    selectedNodeIds: Array.from(state.events.selected),
    draggedNodeIds: Array.from(state.events.dragged),
    nodeCount: Object.keys(state.nodes).length,
  }));

  // Track changes with useEffect
  useEffect(() => {
    if (selectedNodeIds.length > 0) {
      setEvents(prev => [...prev.slice(-50), {
        type: 'selection_changed',
        timestamp: new Date(),
        data: { selected: selectedNodeIds }
      }]);
    }
  }, [selectedNodeIds]);


  useEffect(() => {
    if (draggedNodeIds.length > 0) {
      setEvents(prev => [...prev.slice(-50), {
        type: 'drag_changed',
        timestamp: new Date(),
        data: { dragged: draggedNodeIds }
      }]);
    }
  }, [draggedNodeIds]);

  useEffect(() => {
    setEvents(prev => [...prev.slice(-50), {
      type: 'nodes_changed',
      timestamp: new Date(),
      data: { nodeCount }
    }]);
  }, [nodeCount]);

  const clearEvents = () => {
    setEvents([]);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'selection_changed': return 'text-blue-600';
      case 'hover_changed': return 'text-green-600';
      case 'drag_changed': return 'text-purple-600';
      case 'nodes_changed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'selection_changed':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.122 2.122" />;
      case 'hover_changed':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />;
      case 'drag_changed':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />;
      case 'nodes_changed':
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />;
      default:
        return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />;
    }
  };

  return (
    <>
      {/* Event Logger Toggle */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="px-3 py-1.5 text-sm font-medium text-indigo-700 bg-indigo-50 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors"
        title="이벤트 로그 보기"
      >
        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 002 2h2a2 2 0 012-2V7a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 00-2 2h-2a2 2 0 00-2 2v6a2 2 0 01-2 2H9z" />
        </svg>
        이벤트 ({events.length})
      </button>

      {/* Event Logger Modal */}
      {isVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">이벤트 로그</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={clearEvents}
                  className="px-3 py-1 text-sm text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                >
                  지우기
                </button>
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Events List */}
            <div className="p-4 max-h-96 overflow-y-auto">
              {events.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  이벤트가 없습니다
                </div>
              ) : (
                <div className="space-y-2">
                  {events.map((event, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-md"
                    >
                      <div className={`p-1 rounded ${getEventColor(event.type)}`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {getEventIcon(event.type)}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-sm font-medium ${getEventColor(event.type)}`}>
                            {event.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="text-xs text-gray-500">
                            {event.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        {event.data ? (
                          <div className="text-xs text-gray-600 mt-1 font-mono">
                            {JSON.stringify(event.data as Record<string, unknown>, null, 2)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const EventHandlers: React.FC = () => {
  const { actions, query } = useEditor();

  useEffect(() => {
    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'z':
            e.preventDefault();
            if (e.shiftKey) {
              actions.history.redo();
            } else {
              actions.history.undo();
            }
            break;
          case 'y':
            e.preventDefault();
            actions.history.redo();
            break;
        }
      }

      // Delete key - only when not editing text
      if (e.key === 'Delete' || e.key === 'Backspace') {
        // Check if user is editing text in a contentEditable element
        const target = e.target as HTMLElement;
        const isEditingText = target.contentEditable === 'true' || 
                             target.tagName === 'INPUT' || 
                             target.tagName === 'TEXTAREA';
        
        // Only delete elements when not editing text
        if (!isEditingText) {
          e.preventDefault();
          try {
            const state = query.getState();
            const selectedNodes = Array.from(state.events.selected);
            if (selectedNodes.length > 0) {
              const selectedNodeId = selectedNodes[0];
              if (selectedNodeId && selectedNodeId !== 'ROOT') {
                actions.delete(selectedNodeId);
              }
            }
          } catch (error) {
            console.warn('Failed to delete selected node:', error);
          }
        }
      }

      // Escape key - deselect
      if (e.key === 'Escape') {
        actions.clearEvents();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [actions, query]);

  // Auto-save functionality
  useEffect(() => {
    const saveToLocalStorage = () => {
      try {
        const serializedState = query.serialize();
        localStorage.setItem('craft-autosave', serializedState);
        localStorage.setItem('craft-autosave-timestamp', Date.now().toString());
      } catch (error) {
        console.warn('Failed to auto-save:', error);
      }
    };

    const autoSaveInterval = setInterval(saveToLocalStorage, 30000);
    return () => clearInterval(autoSaveInterval);
  }, [query]);

  return null; // This component only handles events
};