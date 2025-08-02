import React from 'react';
import { useNode } from '@craftjs/core';

export interface ImageProps {
  src?: string;
  alt?: string;
  width?: string;
  height?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down' | 'none';
  borderRadius?: number;
  margin?: string;
  padding?: string;
  borderWidth?: number;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  boxShadow?: string;
}

export const ImageToolbar: React.FC = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as ImageProps,
  }));

  return (
    <div className="image-toolbar space-y-4">
      {/* Image Source */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 URL
        </label>
        <input
          type="text"
          value={props.src}
          onChange={(e) =>
            setProp((props: ImageProps) => {
              props.src = e.target.value;
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/image.jpg"
        />
      </div>

      {/* Alt Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          대체 텍스트 (Alt)
        </label>
        <input
          type="text"
          value={props.alt}
          onChange={(e) =>
            setProp((props: ImageProps) => {
              props.alt = e.target.value;
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="이미지 설명"
        />
      </div>

      {/* Dimensions */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            너비
          </label>
          <input
            type="text"
            value={props.width}
            onChange={(e) =>
              setProp((props: ImageProps) => {
                props.width = e.target.value;
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="auto, 100%, 300px"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            높이
          </label>
          <input
            type="text"
            value={props.height}
            onChange={(e) =>
              setProp((props: ImageProps) => {
                props.height = e.target.value;
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="auto, 200px"
          />
        </div>
      </div>

      {/* Object Fit */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          이미지 크기 조정
        </label>
        <select
          value={props.objectFit}
          onChange={(e) =>
            setProp((props: ImageProps) => {
              props.objectFit = e.target.value as ImageProps['objectFit'];
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="cover">덮기 (Cover)</option>
          <option value="contain">포함 (Contain)</option>
          <option value="fill">채우기 (Fill)</option>
          <option value="scale-down">축소 (Scale Down)</option>
          <option value="none">원본 (None)</option>
        </select>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          모서리 둥글기: {props.borderRadius}px
        </label>
        <input
          type="range"
          min={0}
          max={50}
          value={props.borderRadius}
          onChange={(e) =>
            setProp((props: ImageProps) => {
              props.borderRadius = parseInt(e.target.value);
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0px</span>
          <span>50px</span>
        </div>
      </div>

      {/* Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            외부 여백 (Margin)
          </label>
          <input
            type="text"
            value={props.margin}
            onChange={(e) =>
              setProp((props: ImageProps) => {
                props.margin = e.target.value;
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            내부 여백 (Padding)
          </label>
          <input
            type="text"
            value={props.padding}
            onChange={(e) =>
              setProp((props: ImageProps) => {
                props.padding = e.target.value;
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0"
          />
        </div>
      </div>

      {/* Border */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          테두리
        </label>
        <div className="space-y-2">
          <div>
            <label className="text-xs text-gray-600">두께: {props.borderWidth}px</label>
            <input
              type="range"
              min={0}
              max={10}
              value={props.borderWidth}
              onChange={(e) =>
                setProp((props: ImageProps) => {
                  props.borderWidth = parseInt(e.target.value);
                })
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          <div className="flex gap-2">
            <input
              type="color"
              value={props.borderColor}
              onChange={(e) =>
                setProp((props: ImageProps) => {
                  props.borderColor = e.target.value;
                })
              }
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <select
              value={props.borderStyle}
              onChange={(e) =>
                setProp((props: ImageProps) => {
                  props.borderStyle = e.target.value as 'solid' | 'dashed' | 'dotted';
                })
              }
              className="flex-1 px-2 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="solid">실선</option>
              <option value="dashed">점선</option>
              <option value="dotted">점</option>
            </select>
          </div>
        </div>
      </div>

      {/* Box Shadow */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          그림자
        </label>
        <select
          value={props.boxShadow}
          onChange={(e) =>
            setProp((props: ImageProps) => {
              props.boxShadow = e.target.value;
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="none">없음</option>
          <option value="0 1px 3px rgba(0,0,0,0.1)">작은 그림자</option>
          <option value="0 2px 4px rgba(0,0,0,0.1)">보통 그림자</option>
          <option value="0 4px 8px rgba(0,0,0,0.1)">큰 그림자</option>
          <option value="0 8px 16px rgba(0,0,0,0.15)">매우 큰 그림자</option>
        </select>
      </div>

      {/* Quick Image Sources */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          샘플 이미지
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: '풍경', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800' },
            { label: '도시', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800' },
            { label: '자연', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800' },
            { label: '추상', url: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800' },
          ].map(({ label, url }) => (
            <button
              key={label}
              onClick={() =>
                setProp((props: ImageProps) => {
                  props.src = url;
                  props.alt = label;
                })
              }
              className="px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50"
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};