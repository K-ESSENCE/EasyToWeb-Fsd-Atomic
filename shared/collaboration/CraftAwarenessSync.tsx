'use client';

import React, { useEffect } from 'react';
import { useEditor, useNode } from '@craftjs/core';
import { useYjs, updateUserSelection } from './YjsProvider';

// Component to sync Craft.js selection with Yjs awareness
export const CraftAwarenessSync: React.FC = () => {
  const { provider } = useYjs();
  const { selectedNodeIds } = useEditor((state) => ({
    selectedNodeIds: Array.from(state.events.selected),
  }));

  // Check if there are other collaborators
  const totalConnectedUsers = provider?.awareness?.getStates()?.size || 0;
  const hasOtherCollaborators = totalConnectedUsers > 1;

  useEffect(() => {
    if (!provider?.awareness || !hasOtherCollaborators) {
      return;
    }

    // 즉시 업데이트 - 디바운싱 제거  
    try {
      updateUserSelection(provider.awareness, selectedNodeIds);
      
      // Dispatch custom event to notify CollaboratorOverlay
      const event = new CustomEvent('craft-awareness-change', {
        detail: { selectedNodeIds, timestamp: Date.now() }
      });
      document.dispatchEvent(event);
    } catch (error) {
      console.error('Failed to update awareness:', error);
    }

    // 더 이상 timeout 필요 없음
  }, [provider, selectedNodeIds, hasOtherCollaborators]);

  return null;
};

// Hook to update awareness when a specific component is selected
export const useCraftAwareness = () => {
  const { provider } = useYjs();
  const { id, selected } = useNode((state) => ({
    selected: state.events.selected,
  }));

  useEffect(() => {
    if (!provider?.awareness || !id) return;

    if (selected) {
      // Update awareness when this component is selected
      updateUserSelection(provider.awareness, [id]);
    }
  }, [provider, id, selected]);

  return { id, selected };
};