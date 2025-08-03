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
      console.log('SaveManager: Attempting temp save...');
      const serializedState = query.serialize();
      console.log('SaveManager: Serialized state:', serializedState);
      onSave(serializedState);
      onTempSaveTriggered?.();
    } catch (error) {
      console.error('SaveManager: Failed to serialize state for temp save:', error);
    }
  }, [query, onSave, onTempSaveTriggered]);

  const handlePublish = useCallback(() => {
    try {
      console.log('SaveManager: Attempting publish...');
      const serializedState = query.serialize();
      console.log('SaveManager: Serialized state for publish:', serializedState);
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

    console.log('SaveManager: Event listeners attached for project:', projectId);

    return () => {
      document.removeEventListener('craft-temp-save', handleTempSave);
      document.removeEventListener('craft-publish', handlePublish);
      console.log('SaveManager: Event listeners removed');
    };
  }, [handleTempSave, handlePublish, projectId]);

  return null;
};