import React, { useState } from 'react';
import { useNode } from '@craftjs/core';
import { FULL_API_URL } from '../../shared/api/axios';
import { ImageToolbar } from './toolbars/ImageToolbar';
import { useChunkedImageUpload } from '../../hooks/useChunkedImageUpload';
import toast from 'react-hot-toast';

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
    actions: { setProp },
    id
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [isHovered, setIsHovered] = useState(false);
  const { uploadImage, status } = useChunkedImageUpload();

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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Image 컴포넌트: 이미지 업로드 시작:', file.name);
      
      // 파일 타입 검사
      if (!file.type.startsWith('image/')) {
        toast.error('이미지 파일만 업로드 가능합니다.');
        return;
      }
      
      // 파일 크기 검사 (10MB 제한)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('파일 크기는 10MB 이하만 가능합니다.');
        return;
      }
      
      try {
        toast.loading('이미지 업로드 중...', { id: 'image-upload' });
        
        const result = await uploadImage(file, (status) => {
          console.log('Image 컴포넌트: 업로드 진행률:', status.progress + '%');
        });
        
        if (result.error) {
          console.error('Image 컴포넌트: 업로드 실패:', result.error);
          toast.error(result.error, { id: 'image-upload' });
          return;
        }
        
        if (result.fileUrl) {
          console.log('Image 컴포넌트: 업로드 성공:', result.fileUrl);
          setProp((props: ImageProps) => {
            props.src = result.fileUrl;
          });
          
          // Craft.js 상태 변경 이벤트 발송 (동기화용)
          const imageEvent = new CustomEvent("craft-image-changed", {
            detail: { 
              nodeId: id, 
              src: result.fileUrl,
              fileId: result.fileId,
              timestamp: Date.now()
            },
          });
          document.dispatchEvent(imageEvent);
          
          toast.success('이미지 업로드 완료!', { id: 'image-upload' });
        } else {
          console.error('Image 컴포넌트: 파일 URL이 없음:', result);
          toast.error('업로드된 이미지 URL을 받지 못했습니다.', { id: 'image-upload' });
        }
      } catch (error) {
        console.error('Image 컴포넌트: 업로드 중 에러:', error);
        toast.error('이미지 업로드 중 오류가 발생했습니다.', { id: 'image-upload' });
      }
    }
    
    // 파일 인풋 리셋
    event.target.value = '';
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
      data-node-id={id}
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
          {status.uploading ? (
            <span>업로드 중... {status.progress}%</span>
          ) : (
            <span>클릭해서 이미지 추가</span>
          )}
          {status.uploading && (
            <div
              style={{
                width: '80%',
                height: '4px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                marginTop: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${status.progress}%`,
                  height: '100%',
                  backgroundColor: '#2563eb',
                  borderRadius: '2px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={status.uploading}
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 0,
              cursor: status.uploading ? 'wait' : 'pointer',
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