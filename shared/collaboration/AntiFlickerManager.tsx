'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { useEditor } from '@craftjs/core';

interface AntiFlickerManagerProps {
  enabled?: boolean;
}

export const AntiFlickerManager: React.FC<AntiFlickerManagerProps> = ({ enabled = true }) => {
  const { query } = useEditor();
  const rafRef = useRef<number | undefined>(undefined);
  const lastUpdateRef = useRef<number>(0);
  const stabilityTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Reduce unnecessary DOM queries and updates
  const optimizeRendering = useCallback(() => {
    if (!enabled) return;
    
    const now = performance.now();
    
    // Skip if too frequent (limit to 60fps max)
    if (now - lastUpdateRef.current < 16) {
      return;
    }
    
    lastUpdateRef.current = now;
    
    try {
      // Batch DOM operations
      const elements = document.querySelectorAll('[data-node-id]');
      
      // Use document fragment for batch updates if needed
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        
        // Prevent unnecessary style recalculations
        if (htmlElement.style.willChange !== 'transform') {
          htmlElement.style.willChange = 'transform';
        }
        
        // Ensure proper z-index stacking
        if (!htmlElement.style.position || htmlElement.style.position === 'static') {
          htmlElement.style.position = 'relative';
        }
      });
      
    } catch (error) {
      console.warn('AntiFlickerManager: Optimization error:', error);
    }
  }, [enabled, query]);
  
  // Debounced stabilization
  const stabilizeRendering = useCallback(() => {
    if (stabilityTimeoutRef.current) {
      clearTimeout(stabilityTimeoutRef.current);
    }
    
    stabilityTimeoutRef.current = setTimeout(() => {
      // Remove will-change after animations settle
      const elements = document.querySelectorAll('[data-node-id]');
      elements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (htmlElement.style.willChange === 'transform') {
          htmlElement.style.willChange = 'auto';
        }
      });
    }, 1000);
  }, []);
  
  useEffect(() => {
    if (!enabled) return;
    
    const handleOptimization = () => {
      // 즉시 최적화 실행
      optimizeRendering();
      stabilizeRendering();
    };
    
    // Listen for events that might cause flickering
    const events = [
      'craft-nodes-changed',
      'craft-selection-changed', 
      'craft-awareness-change'
    ];
    
    events.forEach(event => {
      document.addEventListener(event, handleOptimization);
    });
    
    // Initial optimization
    handleOptimization();
    
    return () => {
      if (stabilityTimeoutRef.current) {
        clearTimeout(stabilityTimeoutRef.current);
      }
      
      events.forEach(event => {
        document.removeEventListener(event, handleOptimization);
      });
    };
  }, [enabled, optimizeRendering, stabilizeRendering]);
  
  return null;
};