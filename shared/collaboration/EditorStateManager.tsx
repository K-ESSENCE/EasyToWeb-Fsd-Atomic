'use client';

import React, { useEffect, useRef } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs } from './YjsProvider';

interface EditorStateManagerProps {
  enabled: boolean;
  onEnabledChange?: (enabled: boolean) => void;
}

export const EditorStateManager: React.FC<EditorStateManagerProps> = ({ 
  enabled, 
  onEnabledChange 
}) => {
  const { provider, isConnected } = useYjs();
  const { actions } = useEditor();
  const lastStateChange = useRef<number>(0);
  
  // Check if there are other collaborators
  const totalConnectedUsers = provider?.awareness?.getStates()?.size || 0;
  const hasOtherCollaborators = totalConnectedUsers > 1;

  // Sync editor enabled state with other users
  useEffect(() => {
    if (!provider?.awareness || !hasOtherCollaborators) {
      return;
    }

    const now = Date.now();
    if (now - lastStateChange.current < 300) {
      return;
    }

    lastStateChange.current = now;

    try {
      const awareness = provider.awareness;
      const currentState = awareness.getLocalState() || {};
      
      // Update local state with editor enabled status
      awareness.setLocalState({
        ...currentState,
        editorEnabled: enabled,
        lastStateUpdate: now,
      });
      
      console.log('EditorStateManager: Updated editor state:', enabled);
    } catch (error) {
      console.error('EditorStateManager: Failed to sync editor state:', error);
    }
  }, [provider, enabled, hasOtherCollaborators]);

  // Listen for editor state changes from other users
  useEffect(() => {
    if (!provider?.awareness || !hasOtherCollaborators) {
      return;
    }

    let stateTimeout: NodeJS.Timeout;

    const handleAwarenessChange = () => {
      if (stateTimeout) {
        clearTimeout(stateTimeout);
      }

      stateTimeout = setTimeout(() => {
        try {
          const states = provider.awareness.getStates();
          let shouldDisableEditor = false;
          
          // Check if any other user is actively editing
          states.forEach((state, clientId) => {
            if (clientId !== provider.awareness.clientID && state.editLock) {
              const lockAge = Date.now() - state.editLock.timestamp;
              if (lockAge < 30000) { // Lock is valid for 30 seconds
                shouldDisableEditor = true;
              }
            }
          });

          // If editor should be disabled due to other user editing, disable it temporarily
          if (shouldDisableEditor && enabled && onEnabledChange) {
            console.log('EditorStateManager: Temporarily disabling editor due to other user editing');
            onEnabledChange(false);
            
            // Re-enable after a short delay
            setTimeout(() => {
              if (onEnabledChange) {
                onEnabledChange(true);
              }
            }, 1000);
          }
        } catch (error) {
          console.error('EditorStateManager: Failed to handle awareness change:', error);
        }
      }, 100);
    };

    provider.awareness.on('change', handleAwarenessChange);

    return () => {
      if (stateTimeout) {
        clearTimeout(stateTimeout);
      }
      provider.awareness.off('change', handleAwarenessChange);
    };
  }, [provider, enabled, hasOtherCollaborators, onEnabledChange]);

  return null;
};