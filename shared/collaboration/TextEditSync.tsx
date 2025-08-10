'use client';

import { useEffect, useRef, useState, useCallback, FocusEvent } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs } from './YjsProvider';
import * as Y from 'yjs';

interface TextEditSyncProps {
  nodeId: string;
  isEditing: boolean;
  onEditingChange: (editing: boolean) => void;
}

export const TextEditSync: React.FC<TextEditSyncProps> = ({ 
  nodeId, 
  isEditing, 
  onEditingChange 
}) => {
  const { doc, provider } = useYjs();
  const { actions } = useEditor();
  const lastTextUpdate = useRef<number>(0);
  
  // Y.Map for text editing status
  const textEditMap = doc?.getMap('text-editing') as Y.Map<any>;
  
  // Check if there are other collaborators
  const totalConnectedUsers = provider?.awareness?.getStates()?.size || 0;
  const hasOtherCollaborators = totalConnectedUsers > 1;

  // Sync editing state when user starts/stops editing
  useEffect(() => {
    if (!textEditMap || !hasOtherCollaborators || !provider?.awareness) {
      return;
    }

    const clientId = provider.awareness.clientID;
    const now = Date.now();

    try {
      if (isEditing) {
        // Mark this node as being edited
        textEditMap.set(nodeId, {
          clientId,
          isEditing: true,
          timestamp: now,
        });
        
        // Started editing node
      } else {
        // Remove editing status
        textEditMap.delete(nodeId);
        
        // Stopped editing node
      }
    } catch (error) {
      console.error('TextEditSync: Failed to sync editing state:', error);
    }
  }, [textEditMap, nodeId, isEditing, hasOtherCollaborators, provider]);

  // Listen for other users editing the same node
  useEffect(() => {
    if (!textEditMap || !hasOtherCollaborators || !provider?.awareness) {
      return;
    }

    const clientId = provider.awareness.clientID;
    let checkTimeout: NodeJS.Timeout;

    const handleTextEditChange = (event: Y.YMapEvent<any>) => {
      // Skip our own changes
      if (event.transaction.local) {
        return;
      }

      // Remote text edit change detected

      // Debounce checks to prevent excessive processing
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }

      checkTimeout = setTimeout(() => {
        try {
          const editingInfo = textEditMap.get(nodeId);
          
          if (editingInfo && editingInfo.clientId !== clientId) {
            // Another user is editing this node
            const editAge = Date.now() - editingInfo.timestamp;
            
            if (editAge < 30000) { // Valid for 30 seconds
              // Another user is editing this node, disabling
              
              // Check if current user is actually editing this node
              const currentElement = document.querySelector(`[data-node-id="${nodeId}"]`);
              const isCurrentlyFocused = document.activeElement === currentElement;
              
              // Only disable if we're not currently actively editing
              if (!isCurrentlyFocused || !isEditing) {
                onEditingChange(false);
              } else {
                // If we're actively editing, extend our edit lock
                // Extending edit lock for active editing
                if (textEditMap) {
                  textEditMap.set(nodeId, {
                    clientId,
                    isEditing: true,
                    timestamp: Date.now(),
                  });
                }
              }
            }
          } else if (!editingInfo && isEditing) {
            // If no one is editing and we should be, reclaim the lock
            onEditingChange(true);
          }
        } catch (error) {
          console.error('TextEditSync: Failed to handle edit change:', error);
        }
      }, 100);
    };

    textEditMap.observe(handleTextEditChange);

    return () => {
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      textEditMap.unobserve(handleTextEditChange);
    };
  }, [textEditMap, nodeId, hasOtherCollaborators, provider, onEditingChange, isEditing]);

  // Clean up editing state when component unmounts
  useEffect(() => {
    return () => {
      if (textEditMap && isEditing) {
        try {
          textEditMap.delete(nodeId);
        } catch (error) {
          console.error('TextEditSync: Failed to cleanup editing state:', error);
        }
      }
    };
  }, [textEditMap, nodeId, isEditing]);

  return null;
};

// Hook for managing text editing state
export const useTextEditSync = (nodeId: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const editTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleFocus = useCallback(() => {
    if (isDisabled) return;
    
    setIsEditing(true);
    
    // Clear any existing timeout
    if (editTimeoutRef.current) {
      clearTimeout(editTimeoutRef.current);
    }
  }, [isDisabled]);

  const handleBlur = useCallback((event?: FocusEvent) => {
    // Check if we're losing focus to something outside the text element
    const relatedTarget = event?.relatedTarget as HTMLElement;
    const currentTarget = event?.currentTarget as HTMLElement;
    
    // If focus is moving within the same text element or to a child, don't blur
    if (relatedTarget && currentTarget && 
        (currentTarget.contains(relatedTarget) || relatedTarget === currentTarget)) {
      return;
    }
    
    // Delay setting editing to false to allow for brief focus changes
    editTimeoutRef.current = setTimeout(() => {
      // Double-check if we're still not focused before setting to false
      const nodeElement = document.querySelector(`[data-node-id="${nodeId}"]`);
      if (nodeElement && document.activeElement !== nodeElement) {
        setIsEditing(false);
      }
    }, 150); // Increased delay to prevent premature blur
  }, [nodeId]);

  const handleEditingChange = useCallback((editing: boolean) => {
    setIsDisabled(!editing);
  }, []);

  useEffect(() => {
    return () => {
      if (editTimeoutRef.current) {
        clearTimeout(editTimeoutRef.current);
      }
    };
  }, []);

  return {
    isEditing,
    isDisabled,
    handleFocus,
    handleBlur,
    handleEditingChange,
  };
};