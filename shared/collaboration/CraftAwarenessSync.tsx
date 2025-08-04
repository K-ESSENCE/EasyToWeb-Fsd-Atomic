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

    // Debounce selection updates to prevent excessive awareness events
    const timeoutId = setTimeout(() => {
      try {
        console.log('CraftAwarenessSync: Updating selection:', selectedNodeIds);
        updateUserSelection(provider.awareness, selectedNodeIds);
      } catch (error) {
        console.error('Failed to update awareness:', error);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
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