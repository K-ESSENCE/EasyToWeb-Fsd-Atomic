'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs } from './YjsProvider';

interface CraftYjsSyncProps {
  onContentChange?: (content: string) => void;
}

// Removed CraftChangeListener - now using Editor's onNodesChange event

export const CraftYjsSync: React.FC<CraftYjsSyncProps> = ({ onContentChange }) => {
  const { doc, isConnected, sharedNodesMap, sharedMetaMap } = useYjs();
  const { actions, query } = useEditor();
  const isApplyingRemoteChange = useRef(false);
  const lastLocalChange = useRef<string>('');

  // Use Y.Map instances from context
  const sharedNodes = sharedNodesMap;
  const sharedMeta = sharedMetaMap;

  console.log('CraftYjsSync: Initializing with connection:', isConnected);

  // Apply remote changes to Craft.js
  const applyRemoteChanges = useCallback(() => {
    if (!sharedNodes || !doc || isApplyingRemoteChange.current) return;

    try {
      isApplyingRemoteChange.current = true;

      // Build new state from Yjs
      const newNodes: Record<string, unknown> = {};
      
      // Convert Y.Map to regular object
      sharedNodes.forEach((value, key) => {
        newNodes[key] = value;
      });

      // Only update if there are actual changes and we have nodes
      if (Object.keys(newNodes).length > 0) {
        console.log('Applying remote changes:', newNodes);
        
        // Create a serialized state for Craft.js
        const serializedState = JSON.stringify(newNodes);
        
        // Only apply if different from our last local change
        if (serializedState !== lastLocalChange.current) {
          actions.deserialize(serializedState);
          
          // Notify parent component of content change
          if (onContentChange) {
            onContentChange(serializedState);
          }
        }
      }
    } catch (error) {
      console.error('Failed to apply remote changes:', error);
    } finally {
      isApplyingRemoteChange.current = false;
    }
  }, [sharedNodes, doc, query, actions, onContentChange]);

  // Send local changes to Yjs
  const sendLocalChanges = useCallback(() => {
    if (!sharedNodes || !doc || isApplyingRemoteChange.current) return;

    try {
      // Use Craft.js serialize method to get clean JSON
      const currentJson = query.serialize();
      
      // Only sync if content has actually changed
      if (currentJson !== lastLocalChange.current) {
        console.log('Sending local changes to Yjs');
        lastLocalChange.current = currentJson;

        // Parse the serialized JSON to get nodes
        const parsedState = JSON.parse(currentJson);
        const serializedNodes = parsedState;

        // Clear existing nodes
        sharedNodes.clear();
        
        // Add all current nodes to shared map
        Object.entries(serializedNodes).forEach(([nodeId, nodeData]) => {
          sharedNodes.set(nodeId, nodeData);
        });

        // Update metadata
        if (sharedMeta) {
          sharedMeta.set('lastModified', Date.now());
          sharedMeta.set('lastModifiedBy', 'current-user'); // Should be actual user ID
        }

        // Notify parent component
        if (onContentChange) {
          onContentChange(currentJson);
        }
      }
    } catch (error) {
      console.error('Failed to send local changes:', error);
    }
  }, [sharedNodes, sharedMeta, doc, query, onContentChange]);

  // Listen for Craft.js state changes via custom event
  useEffect(() => {
    if (!isConnected || !sharedNodes) return;

    console.log('CraftYjsSync: Setting up Craft.js state change listener');

    // Handle nodes changed event from Editor
    const handleNodesChanged = (event: CustomEvent) => {
      console.log('CraftYjsSync: Received craft-nodes-changed event');
      if (!isApplyingRemoteChange.current) {
        sendLocalChanges();
      }
    };

    // Handle JSON import event - force sync to Yjs
    const handleDataImported = (event: CustomEvent) => {
      console.log('CraftYjsSync: JSON data imported, forcing sync to Yjs');
      try {
        const currentState = query.serialize();
        const parsedState = JSON.parse(currentState);
        
        // Clear and update Yjs with imported data
        sharedNodes.clear();
        Object.entries(parsedState).forEach(([nodeId, nodeData]) => {
          sharedNodes.set(nodeId, nodeData);
        });
        
        if (sharedMeta) {
          sharedMeta.set('lastModified', Date.now());
          sharedMeta.set('lastModifiedBy', 'current-user');
          sharedMeta.set('action', 'data_imported');
        }
        
        lastLocalChange.current = currentState;
        console.log('CraftYjsSync: Imported data synced to Yjs');
      } catch (error) {
        console.error('CraftYjsSync: Failed to sync imported data:', error);
      }
    };

    // Get initial state and sync to Yjs
    const initialSync = () => {
      try {
        const currentState = query.serialize();
        if (currentState !== lastLocalChange.current) {
          console.log('CraftYjsSync: Initial sync to Yjs');
          lastLocalChange.current = currentState;
          
          // Parse and store in Yjs
          const parsedState = JSON.parse(currentState);
          sharedNodes.clear();
          Object.entries(parsedState).forEach(([nodeId, nodeData]) => {
            sharedNodes.set(nodeId, nodeData);
          });
          
          if (sharedMeta) {
            sharedMeta.set('lastModified', Date.now());
            sharedMeta.set('lastModifiedBy', 'current-user');
          }
        }
      } catch (error) {
        console.error('CraftYjsSync: Initial sync failed:', error);
      }
    };

    // Perform initial sync
    initialSync();

    // Listen for real-time changes and data imports
    document.addEventListener('craft-nodes-changed', handleNodesChanged as EventListener);
    document.addEventListener('craft-data-imported', handleDataImported as EventListener);

    return () => {
      document.removeEventListener('craft-nodes-changed', handleNodesChanged as EventListener);
      document.removeEventListener('craft-data-imported', handleDataImported as EventListener);
    };
  }, [isConnected, sharedNodes, sharedMeta, query, sendLocalChanges]);

  // Listen for Yjs changes
  useEffect(() => {
    if (!sharedNodes || !isConnected) return;

    const handleYjsChanges = () => {
      // Debounce to avoid too many updates
      const timeoutId = setTimeout(applyRemoteChanges, 100);
      return () => clearTimeout(timeoutId);
    };

    sharedNodes.observe(handleYjsChanges);

    return () => {
      sharedNodes.unobserve(handleYjsChanges);
    };
  }, [sharedNodes, isConnected, applyRemoteChanges]);

  // Initial sync when connection is established
  useEffect(() => {
    if (isConnected && sharedNodes) {
      // If there's existing content in Yjs, apply it
      if (sharedNodes.size > 0) {
        applyRemoteChanges();
      } else {
        // If no content exists, send current Craft.js state
        sendLocalChanges();
      }
    }
  }, [isConnected, sharedNodes, applyRemoteChanges, sendLocalChanges]);

  return null; // This component only handles synchronization in the background
};

// Hook for awareness (cursor/selection sharing)
export const useCraftAwareness = () => {
  const { provider } = useYjs();
  const { selectedNodeIds } = useEditor((state) => ({
    selectedNodeIds: Array.from(state.events.selected),
  }));

  useEffect(() => {
    if (!provider?.awareness) return;

    const awareness = provider.awareness;

    // Update local selection state
    awareness.setLocalStateField('selection', {
      nodeIds: selectedNodeIds,
      timestamp: Date.now(),
    });
  }, [provider, selectedNodeIds]);

  return provider?.awareness;
};