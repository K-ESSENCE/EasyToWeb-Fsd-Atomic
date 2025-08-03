'use client';

import React, { useEffect } from 'react';
import { useEditor, useNode } from '@craftjs/core';
import { useYjs, updateUserSelection } from './YjsProvider';

// Component to sync Craft.js selection with Yjs awareness
export const CraftAwarenessSync: React.FC = () => {
  const { provider } = useYjs();
  const { query } = useEditor();

  useEffect(() => {
    if (!provider?.awareness) return;

    // Listen for selection changes in Craft.js
    const handleSelectionChange = () => {
      try {
        const state = query.getState();
        const selectedNodeIds = state.events.selected;
        
        // Convert Set to array if it exists
        const nodeIds = selectedNodeIds ? Array.from(selectedNodeIds) : [];
        
        // Update awareness with current selection
        updateUserSelection(provider.awareness, nodeIds);
      } catch (error) {
        console.error('Failed to update awareness:', error);
      }
    };

    // Initial update
    handleSelectionChange();

    // Set up interval to check for selection changes
    // (Craft.js doesn't provide direct selection change events)
    const interval = setInterval(handleSelectionChange, 500);

    return () => clearInterval(interval);
  }, [provider, query]);

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