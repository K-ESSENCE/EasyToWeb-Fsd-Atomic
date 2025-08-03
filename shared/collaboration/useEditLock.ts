'use client';

import { useEffect, useCallback } from 'react';
import { useYjs } from './YjsProvider';

export const useEditLock = (nodeId?: string) => {
  const { lockNode, unlockNode, isNodeLocked, getNodeLocker } = useYjs();

  // Lock the node when starting to edit
  const lockForEdit = useCallback(() => {
    if (nodeId) {
      lockNode(nodeId);
    }
  }, [nodeId, lockNode]);

  // Unlock the node when finishing edit
  const unlockAfterEdit = useCallback(() => {
    if (nodeId) {
      unlockNode(nodeId);
    }
  }, [nodeId, unlockNode]);

  // Check if current node is locked by another user
  const isLocked = nodeId ? isNodeLocked(nodeId) : false;
  
  // Get who is locking the node
  const locker = nodeId ? getNodeLocker(nodeId) : null;

  // Auto-unlock on unmount
  useEffect(() => {
    return () => {
      if (nodeId) {
        unlockNode(nodeId);
      }
    };
  }, [nodeId, unlockNode]);

  return {
    lockForEdit,
    unlockAfterEdit,
    isLocked,
    locker,
  };
};