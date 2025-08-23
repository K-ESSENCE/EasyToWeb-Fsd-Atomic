'use client';

import React from 'react';

export interface ReadOnlyTextProps {
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

/**
 * 완전히 읽기 전용인 텍스트 컴포넌트 (발행된 페이지용)
 * 편집 불가능하고 상호작용도 없음
 */
export const ReadOnlyText: React.FC<ReadOnlyTextProps> = ({ 
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
    minHeight: '1.5em',
    minWidth: '50px',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    userSelect: 'text', // 텍스트 선택은 가능하지만 편집은 불가
    cursor: 'default', // 기본 커서
    // 편집 관련 스타일 완전 제거
    outline: 'none',
    border: 'none',
    background: 'transparent',
    pointerEvents: 'auto', // 텍스트 선택을 위해 이벤트는 허용
  };

  return (
    <div
      style={textStyle}
      className="craft-readonly-text-component"
      // 완전히 읽기 전용 - contentEditable 없음
      suppressContentEditableWarning={false}
      role="text"
      aria-readonly="true"
    >
      {text}
    </div>
  );
};

// Craft.js 호환성을 위한 craft 속성
(ReadOnlyText as React.ComponentType & { craft: unknown }).craft = {
  displayName: 'ReadOnlyText',
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