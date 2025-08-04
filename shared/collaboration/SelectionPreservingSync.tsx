'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs } from './YjsProvider';
import * as Y from 'yjs';

interface SelectionPreservingSyncProps {
  onContentChange?: (content: string) => void;
}

export const SelectionPreservingSync: React.FC<SelectionPreservingSyncProps> = ({ onContentChange }) => {
  const { doc, isConnected, provider } = useYjs();
  const { actions, query } = useEditor();
  
  // State management refs
  const isApplyingRemoteChange = useRef(false);
  const lastLocalState = useRef<string>('');
  const lastRemoteState = useRef<string>('');
  const preservedSelection = useRef<{
    nodeIds: string[];
    focusedNodeId?: string;
    cursorPosition?: number;
    isEditing: boolean;
  }>({ nodeIds: [], isEditing: false });
  
  // Y.Map for storing craft nodes (using same keys as YjsProvider)
  const nodesMap = doc?.getMap('nodes') as Y.Map<Record<string, unknown>>;
  const metaMap = doc?.getMap('meta') as Y.Map<unknown>;
  
  // Check collaborators
  const totalConnectedUsers = provider?.awareness?.getStates()?.size || 0;
  const hasOtherCollaborators = totalConnectedUsers > 1;

  // Enhanced selection preservation
  const preserveCurrentSelection = useCallback(() => {
    try {
      const editorState = query.getState();
      const selectedNodeIds = Array.from(editorState.events.selected);
      
      // Get focused element info
      const activeElement = document.activeElement as HTMLElement;
      const focusedNodeId = activeElement?.getAttribute?.('data-node-id') || undefined;
      const isContentEditable = activeElement?.contentEditable === 'true' || 
                               activeElement?.tagName === 'INPUT' || 
                               activeElement?.tagName === 'TEXTAREA';
      const cursorPosition = isContentEditable && window.getSelection ? 
                           window.getSelection()?.focusOffset : undefined;
      
      preservedSelection.current = {
        nodeIds: selectedNodeIds,
        focusedNodeId,
        cursorPosition,
        isEditing: isContentEditable && focusedNodeId !== undefined
      };
      
      return preservedSelection.current;
    } catch (error) {
      console.error('SelectionPreservingSync: Failed to preserve selection:', error);
      return { nodeIds: [], isEditing: false };
    }
  }, [query]);

  // Enhanced selection restoration
  const restoreSelection = useCallback((selectionInfo: typeof preservedSelection.current) => {
    try {
      if (!selectionInfo.nodeIds.length && !selectionInfo.focusedNodeId) return;

      // Use RAF to ensure DOM is updated
      requestAnimationFrame(() => {
        try {
          // Restore Craft.js node selection
          if (selectionInfo.nodeIds.length > 0) {
            actions.clearEvents();
            selectionInfo.nodeIds.forEach(nodeId => {
              try {
                const nodeInfo = query.node(nodeId);
                if (nodeInfo && nodeInfo.get()) {
                  actions.selectNode(nodeId);
                }
              } catch (error) {
                // Node might not exist anymore, skip silently
              }
            });
          }

          // Restore focus and cursor position
          if (selectionInfo.focusedNodeId) {
            const focusedElement = document.querySelector(
              `[data-node-id="${selectionInfo.focusedNodeId}"]`
            ) as HTMLElement;
            
            if (focusedElement && selectionInfo.isEditing) {
              focusedElement.focus();
              
              // Restore cursor position for text elements
              if (selectionInfo.cursorPosition !== undefined && window.getSelection) {
                // 즉시 커서 위치 복원
                const selection = window.getSelection();
                const textNode = focusedElement.firstChild;
                
                if (textNode && textNode.nodeType === Node.TEXT_NODE && selection) {
                  const range = document.createRange();
                  const offset = Math.min(
                    selectionInfo.cursorPosition || 0, 
                    textNode.textContent?.length || 0
                  );
                  range.setStart(textNode, offset);
                  range.setEnd(textNode, offset);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              }
            }
          }
        } catch (error) {
          console.error('SelectionPreservingSync: Failed to restore selection:', error);
        }
      });
    } catch (error) {
      console.error('SelectionPreservingSync: Selection restoration failed:', error);
    }
  }, [actions, query]);

  // Smart diff-based update with safe merging
  const applyRemoteChanges = useCallback(() => {
    if (!nodesMap || !doc || isApplyingRemoteChange.current || !hasOtherCollaborators) {
      return false;
    }

    try {
      isApplyingRemoteChange.current = true;
      
      // Get current local state first
      const currentLocalState = query.serialize();
      const localNodes = JSON.parse(currentLocalState);
      
      // Get remote state
      const remoteNodes: Record<string, unknown> = {};
      nodesMap.forEach((value, key) => {
        remoteNodes[key] = value;
      });
      
      // 원격 상태가 비어있으면 절대 적용하지 않음
      if (Object.keys(remoteNodes).length === 0) {
        return false;
      }

      const remoteState = JSON.stringify(remoteNodes);
      
      // Skip if no actual changes
      if (remoteState === lastRemoteState.current) {
        return false;
      }
      
      lastRemoteState.current = remoteState;
      
      // Preserve current selection before applying changes
      const selectionInfo = preserveCurrentSelection();
      
      // Check if currently editing node was modified
      if (selectionInfo.isEditing && selectionInfo.focusedNodeId) {
        const currentNodeData = remoteNodes[selectionInfo.focusedNodeId];
        const localNodeData = localNodes[selectionInfo.focusedNodeId];
        
        // Skip update if currently edited node has local changes
        if (currentNodeData && localNodeData && 
            JSON.stringify(currentNodeData) !== JSON.stringify(localNodeData)) {
          return false;
        }
      }
      
      // Safe merge: only update if remote state is structurally valid
      try {
        // Validate remote state structure
        const hasValidRoot = remoteNodes['ROOT'] && typeof remoteNodes['ROOT'] === 'object';
        if (!hasValidRoot) {
          return false;
        }
        
        // Apply changes without triggering selection events
        actions.deserialize(remoteState);
        
        // Restore selection immediately after DOM update
        requestAnimationFrame(() => {
          restoreSelection(selectionInfo);
        });
        
        // Notify parent
        if (onContentChange) {
          onContentChange(remoteState);
        }
        
        return true;
      } catch (deserializeError) {
        console.error('SelectionPreservingSync: Failed to deserialize remote state:', deserializeError);
        // Restore local state if deserialization fails
        try {
          actions.deserialize(currentLocalState);
        } catch (restoreError) {
          console.error('SelectionPreservingSync: Failed to restore local state:', restoreError);
        }
        return false;
      }
      
    } catch (error) {
      console.error('SelectionPreservingSync: Failed to apply remote changes:', error);
      return false;
    } finally {
      // Reset flag after a delay to prevent rapid updates
      setTimeout(() => {
        isApplyingRemoteChange.current = false;
      }, 100);
    }
  }, [nodesMap, doc, hasOtherCollaborators, preserveCurrentSelection, restoreSelection, actions, query, onContentChange]);

  // Optimized local changes sync with validation
  const sendLocalChanges = useCallback(() => {
    if (!nodesMap || !doc || isApplyingRemoteChange.current || !hasOtherCollaborators) {
      return;
    }

    try {
      const currentState = query.serialize();
      
      // Skip if no changes
      if (currentState === lastLocalState.current) {
        return;
      }
      
      // Validate local state before sending
      let currentNodes: Record<string, unknown>;
      try {
        currentNodes = JSON.parse(currentState);
      } catch (parseError) {
        console.error('SelectionPreservingSync: Invalid local state, skipping sync:', parseError);
        return;
      }
      
      // Ensure ROOT node exists (basic validation)
      if (!currentNodes['ROOT']) {
        console.error('SelectionPreservingSync: Missing ROOT node, skipping sync');
        return;
      }
      
      lastLocalState.current = currentState;
      
      // Batch update in transaction with error handling
      try {
        doc.transact(() => {
          // Only update changed nodes instead of clearing all
          const existingKeys = new Set(nodesMap.keys());
          const currentKeys = new Set(Object.keys(currentNodes));
          
          // Add or update nodes
          Object.entries(currentNodes).forEach(([nodeId, nodeData]) => {
            try {
              const existingData = nodesMap.get(nodeId);
              if (!existingData || JSON.stringify(existingData) !== JSON.stringify(nodeData)) {
                nodesMap.set(nodeId, nodeData as Record<string, unknown>);
              }
            } catch (nodeError) {
              console.error(`SelectionPreservingSync: Failed to update node ${nodeId}:`, nodeError);
            }
          });
          
          // Remove deleted nodes (but preserve existing nodes if something goes wrong)
          existingKeys.forEach(nodeId => {
            if (!currentKeys.has(nodeId)) {
              try {
                nodesMap.delete(nodeId);
              } catch (deleteError) {
                console.error(`SelectionPreservingSync: Failed to delete node ${nodeId}:`, deleteError);
              }
            }
          });
          
          // Update metadata
          if (metaMap) {
            try {
              metaMap.set('lastModified', Date.now());
              metaMap.set('modifiedBy', provider?.awareness?.clientID || 'unknown');
            } catch (metaError) {
              console.error('SelectionPreservingSync: Failed to update metadata:', metaError);
            }
          }
        });
      } catch (transactionError) {
        console.error('SelectionPreservingSync: Transaction failed:', transactionError);
        // Reset the lastLocalState to allow retry
        lastLocalState.current = '';
      }
      
    } catch (error) {
      console.error('SelectionPreservingSync: Failed to send local changes:', error);
    }
  }, [nodesMap, metaMap, doc, query, hasOtherCollaborators, provider]);

  // Listen for Y.Map changes with debouncing
  useEffect(() => {
    if (!nodesMap || !isConnected || !hasOtherCollaborators) {
      return;
    }
    
    const handleYMapChange = (event: Y.YMapEvent<any>) => {
      // Skip our own changes
      if (event.transaction.local) {
        return;
      }
      
      
      // 즉시 실행을 위해 debounce 제거
      
      // 즉시 적용 - 디바운싱 제거
      if (!isApplyingRemoteChange.current) {
        applyRemoteChanges();
      }
    };
    
    nodesMap.observe(handleYMapChange);
    
    return () => {
      nodesMap.unobserve(handleYMapChange);
    };
  }, [nodesMap, isConnected, hasOtherCollaborators, applyRemoteChanges]);

  // Listen for Craft.js changes
  useEffect(() => {
    if (!isConnected || !nodesMap || !hasOtherCollaborators) {
      return;
    }
    
    const handleCraftChange = () => {
      if (isApplyingRemoteChange.current) {
        return;
      }
      
      
      // 즉시 처리 - 디바운싱 제거
      if (!isApplyingRemoteChange.current) {
        sendLocalChanges();
      }
    };

    const handleTextChange = (event: Event) => {
      if (isApplyingRemoteChange.current) return;
      
      
      // 즉시 처리 - 디바운싱 제거
      if (!isApplyingRemoteChange.current) {
        sendLocalChanges();
      }
    };
    
    const handleManualSync = () => {
      sendLocalChanges();
    };
    
    // Event listeners
    document.addEventListener('craft-nodes-changed', handleCraftChange);
    document.addEventListener('craft-text-changed', handleTextChange);
    document.addEventListener('craft-manual-sync', handleManualSync);
    
    return () => {
      document.removeEventListener('craft-nodes-changed', handleCraftChange);
      document.removeEventListener('craft-text-changed', handleTextChange);
      document.removeEventListener('craft-manual-sync', handleManualSync);
    };
  }, [isConnected, nodesMap, hasOtherCollaborators, sendLocalChanges]);

  // Initial sync with safe content preservation
  useEffect(() => {
    if (isConnected && nodesMap && hasOtherCollaborators) {
      
      // 안전한 초기 동기화 - 컨텐츠 보존 우선
      const syncTimeout = setTimeout(() => {
        try {
          const currentState = query.serialize();
          let currentNodes: Record<string, unknown>;
          
          try {
            currentNodes = JSON.parse(currentState);
          } catch (parseError) {
            console.error('SelectionPreservingSync: Invalid local state during initial sync:', parseError);
            return;
          }
          
          const hasLocalContent = Object.keys(currentNodes).length > 1; // More than just ROOT
          const hasValidLocalRoot = currentNodes['ROOT'] && typeof currentNodes['ROOT'] === 'object';
          
          // Check remote content
          const remoteHasContent = nodesMap.size > 0;
          let hasValidRemoteContent = false;
          
          if (remoteHasContent) {
            const remoteRoot = nodesMap.get('ROOT');
            hasValidRemoteContent = Boolean(remoteRoot && typeof remoteRoot === 'object');
          }
          
          
          if (hasValidRemoteContent && (!hasLocalContent || !hasValidLocalRoot)) {
            // 로컬에 유효한 내용이 없고 리모트에 유효한 내용이 있으면 리모트 적용
            applyRemoteChanges();
          } else if (hasLocalContent && hasValidLocalRoot && !hasValidRemoteContent) {
            // 로컬에 유효한 내용이 있고 리모트가 비어있거나 무효하면 로컬 전송
            sendLocalChanges();
          } else if (hasLocalContent && hasValidLocalRoot && hasValidRemoteContent) {
            // 둘 다 유효한 내용이 있으면 타임스탬프 확인
            const remoteTimestamp = (metaMap?.get('lastModified') as number) || 0;
            const localTimestamp = Date.now() - 5000; // 5초 전을 기준으로 비교
            
            if (remoteTimestamp > localTimestamp) {
              applyRemoteChanges();
            } else {
              sendLocalChanges();
            }
          }
          // 둘 다 비어있거나 무효하면 아무것도 하지 않음
        } catch (error) {
          console.error('SelectionPreservingSync: Initial sync failed:', error);
        }
      }, 1000); // 1초 지연으로 안정성 확보
      
      return () => {
        clearTimeout(syncTimeout);
      };
    }
  }, [isConnected, nodesMap, hasOtherCollaborators, applyRemoteChanges, sendLocalChanges, query, metaMap]);

  return null;
};