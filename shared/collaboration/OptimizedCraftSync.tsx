'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs } from './YjsProvider';
import * as Y from 'yjs';

interface OptimizedCraftSyncProps {
  onContentChange?: (content: string) => void;
}

export const OptimizedCraftSync: React.FC<OptimizedCraftSyncProps> = ({ onContentChange }) => {
  const { doc, isConnected, provider } = useYjs();
  const { actions, query } = useEditor();
  
  // Prevent infinite loops
  const isApplyingRemoteChange = useRef(false);
  const lastLocalChangeTime = useRef<number>(0);
  const lastRemoteChangeTime = useRef<number>(0);
  const pendingUpdateRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Y.Map for storing craft nodes
  const nodesMap = doc?.getMap('craft-nodes') as Y.Map<any>;
  const metaMap = doc?.getMap('craft-meta') as Y.Map<any>;
  
  // Check if there are other collaborators
  const totalConnectedUsers = provider?.awareness?.getStates()?.size || 0;
  const hasOtherCollaborators = totalConnectedUsers > 1;
  
  console.log('OptimizedCraftSync: Connected users:', totalConnectedUsers);

  // Debounced apply remote changes with focus preservation
  const applyRemoteChanges = useCallback(() => {
    if (!nodesMap || !doc || isApplyingRemoteChange.current || !hasOtherCollaborators) {
      return;
    }

    // Prevent too frequent updates
    const now = Date.now();
    if (now - lastRemoteChangeTime.current < 200) {
      return;
    }

    try {
      isApplyingRemoteChange.current = true;
      lastRemoteChangeTime.current = now;
      
      console.log('OptimizedCraftSync: Applying remote changes');
      
      // Store current focus information before applying changes
      const activeElement = document.activeElement as HTMLElement;
      const isContentEditable = activeElement?.contentEditable === 'true';
      const nodeId = activeElement?.getAttribute('data-node-id');
      const selectionStart = isContentEditable ? window.getSelection()?.focusOffset : null;
      const currentText = isContentEditable ? activeElement?.innerText : null;
      
      // Get all nodes from Y.Map
      const nodes: Record<string, any> = {};
      nodesMap.forEach((value, key) => {
        nodes[key] = value;
      });
      
      if (Object.keys(nodes).length > 0) {
        const serializedState = JSON.stringify(nodes);
        
        // Check if we're currently editing a text node
        if (isContentEditable && nodeId && currentText) {
          // If the remote change affects the currently edited node, skip update
          const currentNodeData = nodes[nodeId];
          if (currentNodeData && currentNodeData.props && 
              currentNodeData.props.text !== currentText) {
            console.log('OptimizedCraftSync: Skipping update for currently edited node:', nodeId);
            return;
          }
        }
        
        // Apply changes without triggering events
        actions.deserialize(serializedState);
        
        // Restore focus after DOM update
        if (isContentEditable && nodeId && activeElement) {
          setTimeout(() => {
            const restoredElement = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
            if (restoredElement) {
              restoredElement.focus();
              
              // Restore cursor position
              if (selectionStart !== null && window.getSelection) {
                const selection = window.getSelection();
                const range = document.createRange();
                const textNode = restoredElement.firstChild;
                
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                  const offset = Math.min(selectionStart || 0, textNode.textContent?.length || 0);
                  range.setStart(textNode, offset);
                  range.setEnd(textNode, offset);
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                }
              }
            }
          }, 10);
        }
        
        // Notify parent component
        if (onContentChange) {
          onContentChange(serializedState);
        }
      }
    } catch (error) {
      console.error('OptimizedCraftSync: Failed to apply remote changes:', error);
    } finally {
      // Add delay before allowing next update
      setTimeout(() => {
        isApplyingRemoteChange.current = false;
      }, 100);
    }
  }, [nodesMap, doc, actions, onContentChange, hasOtherCollaborators]);

  // Send local changes to Y.Map
  const sendLocalChanges = useCallback(() => {
    if (!nodesMap || !doc || isApplyingRemoteChange.current || !hasOtherCollaborators) {
      return;
    }

    const now = Date.now();
    // Prevent too frequent local updates
    if (now - lastLocalChangeTime.current < 300) {
      return;
    }

    try {
      lastLocalChangeTime.current = now;
      
      console.log('OptimizedCraftSync: Sending local changes');
      
      // Get current Craft.js state
      const currentJson = query.serialize();
      const currentNodes = JSON.parse(currentJson);
      
      // Update Y.Map in a transaction
      doc.transact(() => {
        // Clear and update all nodes
        nodesMap.clear();
        Object.entries(currentNodes).forEach(([nodeId, nodeData]) => {
          nodesMap.set(nodeId, nodeData);
        });
        
        // Update metadata
        if (metaMap) {
          metaMap.set('lastModified', now);
          metaMap.set('modifiedBy', provider?.awareness?.clientID || 'unknown');
        }
      });
      
    } catch (error) {
      console.error('OptimizedCraftSync: Failed to send local changes:', error);
    }
  }, [nodesMap, metaMap, doc, query, hasOtherCollaborators, provider]);

  // Listen for Y.Map changes
  useEffect(() => {
    if (!nodesMap || !isConnected || !hasOtherCollaborators) {
      return;
    }
    
    const handleYMapChange = (event: Y.YMapEvent<any>) => {
      // Skip our own changes
      if (event.transaction.local) {
        return;
      }
      
      console.log('OptimizedCraftSync: Remote Y.Map change detected');
      
      // Debounce remote changes
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
      
      pendingUpdateRef.current = setTimeout(() => {
        if (!isApplyingRemoteChange.current) {
          applyRemoteChanges();
        }
      }, 150);
    };
    
    nodesMap.observe(handleYMapChange);
    
    return () => {
      if (pendingUpdateRef.current) {
        clearTimeout(pendingUpdateRef.current);
      }
      nodesMap.unobserve(handleYMapChange);
    };
  }, [nodesMap, isConnected, hasOtherCollaborators, applyRemoteChanges]);

  // Listen for Craft.js changes via custom events
  useEffect(() => {
    if (!isConnected || !nodesMap || !hasOtherCollaborators) {
      return;
    }
    
    const handleCraftChange = () => {
      if (isApplyingRemoteChange.current) {
        return;
      }
      
      console.log('OptimizedCraftSync: Local Craft.js change detected');
      
      // Debounce local changes
      setTimeout(() => {
        if (!isApplyingRemoteChange.current) {
          sendLocalChanges();
        }
      }, 100);
    };

    const handleTextChange = (event: Event) => {
      if (isApplyingRemoteChange.current) {
        return;
      }

      const customEvent = event as CustomEvent;
      console.log('OptimizedCraftSync: Text change detected for node:', customEvent.detail?.nodeId);
      
      // Debounce text changes with shorter delay for better UX
      setTimeout(() => {
        if (!isApplyingRemoteChange.current) {
          sendLocalChanges();
        }
      }, 150);
    };
    
    // Listen for manual sync events
    const handleManualSync = () => {
      console.log('OptimizedCraftSync: Manual sync requested');
      sendLocalChanges();
    };
    
    document.addEventListener('craft-nodes-changed', handleCraftChange);
    document.addEventListener('craft-text-changed', handleTextChange);
    document.addEventListener('craft-manual-sync', handleManualSync);
    
    return () => {
      document.removeEventListener('craft-nodes-changed', handleCraftChange);
      document.removeEventListener('craft-text-changed', handleTextChange);
      document.removeEventListener('craft-manual-sync', handleManualSync);
    };
  }, [isConnected, nodesMap, hasOtherCollaborators, sendLocalChanges]);

  // Initial sync when connection is established
  useEffect(() => {
    if (isConnected && nodesMap && hasOtherCollaborators) {
      console.log('OptimizedCraftSync: Performing initial sync');
      
      // Delay initial sync to avoid conflicts
      setTimeout(() => {
        if (nodesMap.size > 0) {
          // Apply remote state if Y.Map has content
          applyRemoteChanges();
        } else {
          // Send current state if Y.Map is empty
          sendLocalChanges();
        }
      }, 500);
    }
  }, [isConnected, nodesMap, hasOtherCollaborators, applyRemoteChanges, sendLocalChanges]);

  return null;
};