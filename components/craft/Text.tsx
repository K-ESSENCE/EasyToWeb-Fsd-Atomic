import React, { useRef, useCallback } from 'react';
import { useNode } from '@craftjs/core';
import { TextToolbar } from './toolbars/TextToolbar';
import { TextEditSync, useTextEditSync } from '../../shared/collaboration/TextEditSync';

export interface TextProps {
  text?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  color?: string;
  textAlign?: 'left' | 'center' | 'right';
  fontFamily?: string;
  lineHeight?: number;
  letterSpacing?: number;
  margin?: string;
  padding?: string;
}

export const Text: React.FC<TextProps> = ({ 
  text = '텍스트',
  fontSize = 16,
  fontWeight = 'normal',
  color = '#333333',
  textAlign = 'left',
  fontFamily = 'inherit',
  lineHeight = 1.5,
  letterSpacing = 0,
  margin = '0',
  padding = '8px'
}) => {
  const {
    connectors: { connect, drag },
    selected,
    hovered,
    actions: { setProp },
    id
  } = useNode((state) => ({
    selected: state.events.selected,
    hovered: state.events.hovered,
    dragged: state.events.dragged,
  }));

  const textRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  
  // Use text editing sync hook
  const {
    isEditing,
    isDisabled,
    handleFocus,
    handleBlur,
    handleEditingChange,
  } = useTextEditSync(id);

  // Real-time text update with debouncing and focus protection
  const handleTextChange = useCallback(() => {
    if (!textRef.current || isDisabled) return;

    // Clear existing timeout
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }

    // Debounce text updates to prevent excessive sync
    updateTimeoutRef.current = setTimeout(() => {
      const newText = textRef.current?.innerText || '';
      if (newText !== text) {
        // Store focus state before prop update
        const wasFocused = document.activeElement === textRef.current;
        const cursorPosition = wasFocused ? window.getSelection()?.focusOffset : null;
        
        setProp((props: TextProps) => {
          props.text = newText;
        });
        
        // Restore focus after prop update if it was focused
        if (wasFocused && textRef.current) {
          setTimeout(() => {
            if (textRef.current && !textRef.current.matches(':focus')) {
              textRef.current.focus();
              
              // Restore cursor position
              if (cursorPosition !== null && window.getSelection) {
                const selection = window.getSelection();
                const range = document.createRange();
                const textNode = textRef.current.firstChild;
                
                if (textNode && textNode.nodeType === Node.TEXT_NODE) {
                  const offset = Math.min(cursorPosition || 0, textNode.textContent?.length || 0);
                  range.setStart(textNode, offset);
                  range.setEnd(textNode, offset);
                  selection?.removeAllRanges();
                  selection?.addRange(range);
                }
              }
            }
          }, 5);
        }
        
        // Dispatch custom event for collaboration sync
        setTimeout(() => {
          const event = new CustomEvent('craft-text-changed', {
            detail: { nodeId: id, text: newText }
          });
          document.dispatchEvent(event);
        }, 50);
      }
    }, 300); // 300ms debounce for text changes
  }, [text, setProp, id, isDisabled]);

  const textStyle: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight,
    color,
    textAlign,
    fontFamily,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    margin,
    padding,
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    outline: selected ? '2px solid #2563eb' : 'none',
    outlineOffset: '2px',
    borderRadius: '4px',
    minHeight: '1.5em',
    minWidth: '50px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    // Remove transition to prevent hover flickering
    opacity: isDisabled ? 0.6 : 1,
    // Only apply hover effect when not editing and not hovered by others
    backgroundColor: hovered && !isEditing && !selected ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
  };

  return (
    <>
      {/* Text Edit Sync Component */}
      <TextEditSync 
        nodeId={id} 
        isEditing={isEditing} 
        onEditingChange={handleEditingChange} 
      />
      
      <div
        ref={(ref: HTMLDivElement | null) => {
          if (ref) {
            connect(drag(ref));
            textRef.current = ref;
          }
        }}
        style={textStyle}
        onClick={(e) => {
          e.stopPropagation();
          if (!isDisabled) {
            handleFocus();
          }
        }}
        contentEditable={!isDisabled}
        suppressContentEditableWarning
        onFocus={handleFocus}
        onBlur={(e) => {
          handleBlur(e);
          // Keep the blur handler for backup
          setProp((props: TextProps) => {
            props.text = e.currentTarget.innerText;
          });
        }}
        onInput={handleTextChange}
        onKeyUp={handleTextChange}
        className="craft-text-component"
        data-node-id={id}
        title={isDisabled ? '다른 사용자가 편집 중입니다' : '클릭하여 편집'}
      >
        {text}
      </div>
    </>
  );
};

(Text as React.ComponentType & { craft: unknown }).craft = {
  displayName: 'Text',
  props: {
    text: '텍스트',
    fontSize: 16,
    fontWeight: 'normal',
    color: '#333333',
    textAlign: 'left',
    fontFamily: 'inherit',
    lineHeight: 1.5,
    letterSpacing: 0,
    margin: '0',
    padding: '8px'
  },
  related: {
    toolbar: TextToolbar,
  },
};