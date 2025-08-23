'use client';

import React from 'react';
import { FULL_API_URL } from '../../shared/api/axios';

export interface ReadOnlyImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  borderRadius?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  opacity?: number;
  margin?: string;
  padding?: string;
  backgroundColor?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  boxShadow?: string;
}

/**
 * 완전히 읽기 전용인 이미지 컴포넌트 (발행된 페이지용)
 * 업로드 기능 없고 편집 불가능
 */
export const ReadOnlyImage: React.FC<ReadOnlyImageProps> = ({
  src,
  alt = 'Image',
  width = '200px',
  height = '160px',
  borderRadius = 8,
  objectFit = 'cover',
  opacity = 1,
  margin = '0',
  padding = '0',
  backgroundColor = '#f3f4f6',
  borderWidth = 0,
  borderColor = '#e5e7eb',
  borderStyle = 'solid',
  boxShadow = 'none'
}) => {
  const imageContainerStyle: React.CSSProperties = {
    width,
    height,
    margin,
    padding,
    backgroundColor,
    borderRadius: `${borderRadius}px`,
    borderWidth: `${borderWidth}px`,
    borderColor,
    borderStyle,
    boxShadow,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    // 편집 관련 스타일 제거
    cursor: 'default',
    outline: 'none',
    // 호버 효과 제거
    transform: 'none',
    transition: 'none',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity,
    borderRadius: `${borderRadius}px`,
    // 이미지 드래그 방지 (선택적)
    userSelect: 'none',
    WebkitUserDrag: 'none',
  };

  const placeholderStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    color: '#6b7280',
    fontSize: '14px',
    fontWeight: '500',
  };

  return (
    <div
      style={imageContainerStyle}
      className="craft-readonly-image-component"
      role="img"
      aria-label={alt}
    >
      {src ? (
        <img
          src={src.startsWith('http') ? src : `${FULL_API_URL}${src}`}
          alt={alt}
          style={imageStyle}
          // 완전히 읽기 전용 - 클릭 이벤트 없음
        />
      ) : (
        <div style={placeholderStyle}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21,15 16,10 5,21" />
          </svg>
          <span>이미지 없음</span>
          {/* 파일 업로드 인풋 완전히 제거 */}
        </div>
      )}
    </div>
  );
};

// Craft.js 호환성을 위한 craft 속성
(ReadOnlyImage as React.ComponentType & { craft: unknown }).craft = {
  displayName: 'ReadOnlyImage',
  props: {
    src: '',
    alt: 'Image',
    width: '200px',
    height: '160px',
    borderRadius: 8,
    objectFit: 'cover',
    opacity: 1,
    margin: '0',
    padding: '0',
    backgroundColor: '#f3f4f6',
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