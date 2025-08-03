'use client';

import React, { useEffect, useState } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs, CollaboratorInfo } from '../../shared/collaboration/YjsProvider';

interface CollaboratorSelection {
  collaborator: CollaboratorInfo;
  nodeIds: string[];
  elements: HTMLElement[];
}

export const CollaboratorOverlay: React.FC = () => {
  const { collaborators } = useYjs();
  const { query } = useEditor();
  const [selections, setSelections] = useState<CollaboratorSelection[]>([]);

  useEffect(() => {
    const updateSelections = () => {
      const newSelections: CollaboratorSelection[] = [];

      collaborators.forEach((collaborator, clientId) => {
        if ((collaborator.selection?.nodeIds?.length ?? 0) > 0) {
          const elements: HTMLElement[] = [];
          
          collaborator.selection?.nodeIds?.forEach((nodeId: string) => {
            // Find DOM element for this node
            const element = document.querySelector(`[data-node-id="${nodeId}"]`) as HTMLElement;
            if (element) {
              elements.push(element);
            }
          });

          if (elements.length > 0) {
            newSelections.push({
              collaborator: { ...collaborator, id: clientId }, // Use clientId as unique identifier
              nodeIds: collaborator.selection?.nodeIds ?? [],
              elements,
            });
          }
        }
      });

      setSelections(newSelections);
    };

    // Update immediately
    updateSelections();

    // Update when window resizes
    const handleResize = () => updateSelections();
    window.addEventListener('resize', handleResize);

    // Update periodically to catch DOM changes
    const interval = setInterval(updateSelections, 500);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(interval);
    };
  }, [collaborators, query]);

  return (
    <div className="collaborator-overlay fixed inset-0 pointer-events-none z-30">
      {selections.map((selection, index) => (
        <CollaboratorSelectionOutline
          key={`${selection.collaborator.id}-${index}`}
          selection={selection}
        />
      ))}
    </div>
  );
};

interface CollaboratorSelectionOutlineProps {
  selection: CollaboratorSelection;
}

const CollaboratorSelectionOutline: React.FC<CollaboratorSelectionOutlineProps> = ({ selection }) => {
  const [bounds, setBounds] = useState<DOMRect[]>([]);

  useEffect(() => {
    const updateBounds = () => {
      const newBounds = selection.elements.map(element => element.getBoundingClientRect());
      setBounds(newBounds);
    };

    updateBounds();
    
    // Update on scroll
    const handleScroll = () => updateBounds();
    document.addEventListener('scroll', handleScroll, true);

    return () => {
      document.removeEventListener('scroll', handleScroll, true);
    };
  }, [selection.elements]);

  return (
    <>
      {bounds.map((rect, index) => (
        <div key={index}>
          {/* Selection outline */}
          <div
            className="absolute border-2 rounded-sm transition-all duration-200"
            style={{
              left: rect.left,
              top: rect.top,
              width: rect.width,
              height: rect.height,
              borderColor: selection.collaborator.color,
              backgroundColor: `${selection.collaborator.color}10`, // 10% opacity
            }}
          />
          
          {/* Collaborator label */}
          {index === 0 && (
            <div
              className="absolute px-2 py-1 text-xs font-medium text-white rounded shadow-lg whitespace-nowrap"
              style={{
                left: rect.left,
                top: rect.top - 28,
                backgroundColor: selection.collaborator.color,
                zIndex: 1000,
              }}
            >
              {selection.collaborator.name === "사용자" || selection.collaborator.name === "Anonymous"
                ? selection.collaborator.email
                : selection.collaborator.name}
            </div>
          )}
        </div>
      ))}
    </>
  );
};