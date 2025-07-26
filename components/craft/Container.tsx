import React from 'react';
import { useNode } from '@craftjs/core';

export interface ContainerProps {
  background?: string;
  padding?: string;
  margin?: string;
  borderRadius?: number;
  flexDirection?: 'row' | 'column';
  justifyContent?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  alignItems?: 'flex-start' | 'center' | 'flex-end' | 'stretch';
  gap?: number;
  minHeight?: number;
  width?: string;
  height?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  boxShadow?: string;
  children?: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({
  background = 'transparent',
  padding = '16px',
  margin = '0',
  borderRadius = 8,
  flexDirection = 'column',
  justifyContent = 'flex-start',
  alignItems = 'stretch',
  gap = 12,
  minHeight = 100,
  width = '100%',
  height = 'auto',
  borderWidth = 0,
  borderColor = '#e5e7eb',
  borderStyle = 'solid',
  boxShadow = 'none',
  children
}) => {
  const {
    connectors: { connect, drag },
    selected,
    isHover,
  } = useNode((state) => ({
    selected: state.events.selected,
    isHover: state.events.hovered,
  }));

  const containerStyle: React.CSSProperties = {
    background,
    padding,
    margin,
    borderRadius: `${borderRadius}px`,
    display: 'flex',
    flexDirection,
    justifyContent,
    alignItems,
    gap: `${gap}px`,
    minHeight: `${minHeight}px`,
    width,
    height,
    borderWidth: `${borderWidth}px`,
    borderColor,
    borderStyle,
    boxShadow,
    position: 'relative',
    transition: 'all 0.2s ease',
    outline: selected ? '2px solid #2563eb' : isHover ? '2px dashed #94a3b8' : 'none',
    outlineOffset: '2px',
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={containerStyle}
      className="craft-container-component"
    >
      {/* Selected indicator */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '8px',
            background: '#2563eb',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            zIndex: 10,
          }}
        >
          컨테이너
        </div>
      )}
      
      {/* Hover indicator */}
      {isHover && !selected && (
        <div
          style={{
            position: 'absolute',
            top: '-8px',
            left: '8px',
            background: '#64748b',
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
            zIndex: 10,
          }}
        >
          컨테이너
        </div>
      )}
      
      {children}
      
      {/* Empty state */}
      {!children && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#9ca3af',
            fontSize: '14px',
            fontStyle: 'italic',
            minHeight: '60px',
          }}
        >
          여기에 컴포넌트를 드래그하세요
        </div>
      )}
    </div>
  );
};

(Container as any).craft = {
  displayName: 'Container',
  props: {
    background: 'transparent',
    padding: '16px',
    margin: '0',
    borderRadius: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    gap: 12,
    minHeight: 100,
    width: '100%',
    height: 'auto',
    borderWidth: 0,
    borderColor: '#e5e7eb',
    borderStyle: 'solid',
    boxShadow: 'none'
  },
  rules: {
    canDrag: () => true,
    canDrop: () => true,
    canMoveIn: () => true,
    canMoveOut: () => true,
  },
  related: {
    // toolbar: () => import('./toolbars/ContainerToolbar').then(comp => comp.ContainerToolbar),
  },
};