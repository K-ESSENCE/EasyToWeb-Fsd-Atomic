import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { FULL_API_URL } from '../../shared/api/axios';
import { ImageToolbar } from './toolbars/ImageToolbar';

export interface ImageProps {
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

export const Image: React.FC<ImageProps> = ({
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
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp }
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [isHovered, setIsHovered] = useState(false);

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
    cursor: 'pointer',
    outline: selected ? '2px solid #2563eb' : 'none',
    outlineOffset: '2px',
    transition: 'all 0.2s ease',
    transform: isHovered ? 'scale(1.02)' : 'scale(1)',
  };

  const imageStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    opacity,
    borderRadius: `${borderRadius}px`,
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProp((props: ImageProps) => {
          props.src = e.target?.result as string;
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connect(drag(ref));
        }
      }}
      style={imageContainerStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="craft-image-component"
    >
      {src ? (
        <img
          src={src.startsWith('http') ? src : `${FULL_API_URL}${src}`}
          alt={alt}
          style={imageStyle}
          onClick={(e) => e.stopPropagation()}
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
          <span>클릭해서 이미지 추가</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: 'pointer',
            }}
          />
        </div>
      )}
      
      {/* Hover overlay for editing */}
      {selected && (
        <div
          style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'rgba(37, 99, 235, 0.9)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '12px',
            fontWeight: '500',
          }}
        >
          이미지
        </div>
      )}
    </div>
  );
};

(Image as React.ComponentType & { craft: unknown }).craft = {
  displayName: 'Image',
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
  related: {
    toolbar: ImageToolbar,
  },
};