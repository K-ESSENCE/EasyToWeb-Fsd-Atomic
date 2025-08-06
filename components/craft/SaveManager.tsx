'use client';

import React, { useEffect, useCallback } from 'react';
import { useEditor } from '@craftjs/core';

interface SaveManagerProps {
  projectId: string;
  onSave: (data: string) => void;
  onPublish: (data: string) => void;
  onTempSaveTriggered?: () => void;
  onPublishTriggered?: () => void;
}

export const SaveManager: React.FC<SaveManagerProps> = ({ 
  projectId, 
  onSave, 
  onPublish,
  onTempSaveTriggered,
  onPublishTriggered 
}) => {
  const { query } = useEditor();

  const handleTempSave = useCallback(() => {
    try {
      const serializedState = query.serialize();
      onSave(serializedState);
      onTempSaveTriggered?.();
    } catch (error) {
      console.error('SaveManager: Failed to serialize state for temp save:', error);
    }
  }, [query, onSave, onTempSaveTriggered]);

  const handlePublish = useCallback(() => {
    try {
      const serializedState = query.serialize();
      onPublish(serializedState);
      onPublishTriggered?.();
    } catch (error) {
      console.error('SaveManager: Failed to serialize state for publish:', error);
    }
  }, [query, onPublish, onPublishTriggered]);

  useEffect(() => {
    // Listen for save/publish events
    document.addEventListener('craft-temp-save', handleTempSave);
    document.addEventListener('craft-publish', handlePublish);

    // Event listeners attached for project save/publish

    return () => {
      document.removeEventListener('craft-temp-save', handleTempSave);
      document.removeEventListener('craft-publish', handlePublish);
      // Event listeners removed
    };
  }, [handleTempSave, handlePublish, projectId]);

  return null;
};