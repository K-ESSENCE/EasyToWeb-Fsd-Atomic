'use client';

import React from 'react';

export interface ReadOnlyContainerProps {
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

/**
 * 완전히 읽기 전용인 컨테이너 컴포넌트 (발행된 페이지용)
 * 편집 불가능하고 드래그 앤 드롭도 없음
 */
export const ReadOnlyContainer: React.FC<ReadOnlyContainerProps> = ({
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
    // 편집 관련 스타일 완전 제거
    outline: 'none',
    cursor: 'default',
    // 호버 효과 제거
    transition: 'none',
  };

  return (
    <div
      style={containerStyle}
      className="craft-readonly-container-component"
      role="region"
    >
      {children}
      
      {/* 빈 상태 메시지도 제거 - 발행 페이지에서는 불필요 */}
    </div>
  );
};

// Craft.js 호환성을 위한 craft 속성
(ReadOnlyContainer as React.ComponentType & { craft: unknown }).craft = {
  displayName: 'ReadOnlyContainer',
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
  // 발행 페이지에서는 규칙이 필요 없음
  rules: {
    canDrag: () => false,
    canDrop: () => false,
    canMoveIn: () => false,
    canMoveOut: () => false,
  },
  // 툴바도 없음
  related: {},
};