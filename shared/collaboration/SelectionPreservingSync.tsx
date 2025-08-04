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
  
  // Y.Map for storing craft nodes
  const nodesMap = doc?.getMap('craft-nodes') as Y.Map<any>;
  const metaMap = doc?.getMap('craft-meta') as Y.Map<any>;
  
  // Check collaborators
  const totalConnectedUsers = provider?.awareness?.getStates()?.size || 0;
  const hasOtherCollaborators = totalConnectedUsers > 1;
  
  console.log('SelectionPreservingSync: Connected users:', totalConnectedUsers);

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
      
      console.log('SelectionPreservingSync: Preserved selection:', preservedSelection.current);
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
          
          console.log('SelectionPreservingSync: Restored selection successfully');
        } catch (error) {
          console.error('SelectionPreservingSync: Failed to restore selection:', error);
        }
      });
    } catch (error) {
      console.error('SelectionPreservingSync: Selection restoration failed:', error);
    }
  }, [actions, query]);

  // Smart diff-based update
  const applyRemoteChanges = useCallback(() => {
    if (!nodesMap || !doc || isApplyingRemoteChange.current || !hasOtherCollaborators) {
      return false;
    }

    try {
      isApplyingRemoteChange.current = true;
      console.log('SelectionPreservingSync: Applying remote changes with selection preservation');
      
      // Get remote state
      const remoteNodes: Record<string, any> = {};
      nodesMap.forEach((value, key) => {
        remoteNodes[key] = value;
      });
      
      if (Object.keys(remoteNodes).length === 0) {
        return false;
      }

      const remoteState = JSON.stringify(remoteNodes);
      
      // Skip if no actual changes
      if (remoteState === lastRemoteState.current) {
        console.log('SelectionPreservingSync: No remote changes detected');
        return false;
      }
      
      lastRemoteState.current = remoteState;
      
      // Preserve current selection before applying changes
      const selectionInfo = preserveCurrentSelection();
      
      // Check if currently editing node was modified
      if (selectionInfo.isEditing && selectionInfo.focusedNodeId) {
        const currentNodeData = remoteNodes[selectionInfo.focusedNodeId];
        const localState = query.serialize();
        const localNodes = JSON.parse(localState);
        const localNodeData = localNodes[selectionInfo.focusedNodeId];
        
        // Skip update if currently edited node has local changes
        if (currentNodeData && localNodeData && 
            JSON.stringify(currentNodeData) !== JSON.stringify(localNodeData)) {
          console.log('SelectionPreservingSync: Skipping update - node currently being edited');
          return false;
        }
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

  // Optimized local changes sync
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
      
      lastLocalState.current = currentState;
      console.log('SelectionPreservingSync: Sending local changes');
      
      const currentNodes = JSON.parse(currentState);
      
      // Batch update in transaction
      doc.transact(() => {
        // Only update changed nodes instead of clearing all
        const existingKeys = new Set(nodesMap.keys());
        const currentKeys = new Set(Object.keys(currentNodes));
        
        // Add or update nodes
        Object.entries(currentNodes).forEach(([nodeId, nodeData]) => {
          const existingData = nodesMap.get(nodeId);
          if (!existingData || JSON.stringify(existingData) !== JSON.stringify(nodeData)) {
            nodesMap.set(nodeId, nodeData);
          }
        });
        
        // Remove deleted nodes
        existingKeys.forEach(nodeId => {
          if (!currentKeys.has(nodeId)) {
            nodesMap.delete(nodeId);
          }
        });
        
        // Update metadata
        if (metaMap) {
          metaMap.set('lastModified', Date.now());
          metaMap.set('modifiedBy', provider?.awareness?.clientID || 'unknown');
        }
      });
      
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
      
      console.log('SelectionPreservingSync: Remote Y.Map change detected');
      
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
        console.log('SelectionPreservingSync: Skipping local change - remote update in progress');
        return;
      }
      
      console.log('SelectionPreservingSync: Local change detected');
      
      // 즉시 처리 - 디바운싱 제거
      if (!isApplyingRemoteChange.current) {
        sendLocalChanges();
      }
    };

    const handleTextChange = (event: Event) => {
      if (isApplyingRemoteChange.current) return;
      
      console.log('SelectionPreservingSync: Text change detected');
      
      // 즉시 처리 - 디바운싱 제거
      if (!isApplyingRemoteChange.current) {
        sendLocalChanges();
      }
    };
    
    const handleManualSync = () => {
      console.log('SelectionPreservingSync: Manual sync requested');
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

  // Initial sync
  useEffect(() => {
    if (isConnected && nodesMap && hasOtherCollaborators) {
      console.log('SelectionPreservingSync: Performing initial sync');
      
      // 즉시 초기 동기화
      if (nodesMap.size > 0) {
        // Apply remote state if exists
        applyRemoteChanges();
      } else {
        // Send current state if Y.Map is empty
        sendLocalChanges();
      }
    }
  }, [isConnected, nodesMap, hasOtherCollaborators, applyRemoteChanges, sendLocalChanges]);

  return null;
};