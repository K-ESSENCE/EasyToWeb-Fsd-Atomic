import React from 'react';
import { useNode } from '@craftjs/core';

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
    actions: { setProp }
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

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
    cursor: 'pointer',
    outline: selected ? '2px solid #2563eb' : 'none',
    outlineOffset: '2px',
    borderRadius: '4px',
    minHeight: '1.5em',
    minWidth: '50px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    transition: 'all 0.2s ease',
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={textStyle}
      onClick={(e) => {
        e.stopPropagation();
      }}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => {
        setProp((props: TextProps) => {
          props.text = e.currentTarget.innerText;
        });
      }}
      className="craft-text-component hover:bg-blue-50 transition-colors duration-200"
    >
      {text}
    </div>
  );
};

(Text as any).craft = {
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
    // toolbar: () => import('./toolbars/TextToolbar').then(comp => comp.TextToolbar),
  },
};