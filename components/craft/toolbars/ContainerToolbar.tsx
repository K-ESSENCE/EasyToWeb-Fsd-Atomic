import React from 'react';
import { useNode } from '@craftjs/core';
import { ContainerProps } from '../Container';

export const ContainerToolbar: React.FC = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as ContainerProps,
  }));

  return (
    <div className="container-toolbar space-y-4">
      {/* Background */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          배경
        </label>
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="color"
              value={props.background?.startsWith('#') ? props.background : '#ffffff'}
              onChange={(e) =>
                setProp((props: ContainerProps) => {
                  props.background = e.target.value;
                })
              }
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <input
              type="text"
              value={props.background}
              onChange={(e) =>
                setProp((props: ContainerProps) => {
                  props.background = e.target.value;
                })
              }
              className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="transparent, #ffffff, 또는 gradient"
            />
          </div>
          <div className="flex flex-wrap gap-1">
            {[
              'transparent',
              '#ffffff',
              '#f3f4f6',
              '#e5e7eb',
              '#3b82f6',
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
            ].map((bg) => (
              <button
                key={bg}
                onClick={() =>
                  setProp((props: ContainerProps) => {
                    props.background = bg;
                  })
                }
                className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                style={{
                  background: bg.startsWith('linear-gradient') ? bg : bg === 'transparent' ? 'rgba(0,0,0,0.1)' : bg,
                  color: bg === '#ffffff' || bg === 'transparent' ? '#000' : '#fff'
                }}
              >
                {bg === 'transparent' ? '투명' : bg.startsWith('#') ? bg : '그라데이션'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Layout Direction */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          레이아웃 방향
        </label>
        <div className="flex space-x-1">
          <button
            onClick={() =>
              setProp((props: ContainerProps) => {
                props.flexDirection = 'column';
              })
            }
            className={`flex-1 p-2 border rounded-md transition-colors ${
              props.flexDirection === 'column'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
            <span className="text-xs mt-1 block">세로</span>
          </button>
          <button
            onClick={() =>
              setProp((props: ContainerProps) => {
                props.flexDirection = 'row';
              })
            }
            className={`flex-1 p-2 border rounded-md transition-colors ${
              props.flexDirection === 'row'
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="text-xs mt-1 block">가로</span>
          </button>
        </div>
      </div>

      {/* Justify Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          주축 정렬
        </label>
        <select
          value={props.justifyContent}
          onChange={(e) =>
            setProp((props: ContainerProps) => {
              props.justifyContent = e.target.value as ContainerProps['justifyContent'];
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="flex-start">시작</option>
          <option value="center">중앙</option>
          <option value="flex-end">끝</option>
          <option value="space-between">양끝 정렬</option>
          <option value="space-around">균등 분배</option>
          <option value="space-evenly">균등 간격</option>
        </select>
      </div>

      {/* Align Items */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          교차축 정렬
        </label>
        <select
          value={props.alignItems}
          onChange={(e) =>
            setProp((props: ContainerProps) => {
              props.alignItems = e.target.value as ContainerProps['alignItems'];
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="flex-start">시작</option>
          <option value="center">중앙</option>
          <option value="flex-end">끝</option>
          <option value="stretch">늘이기</option>
        </select>
      </div>

      {/* Gap */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          간격: {props.gap}px
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={props.gap}
          onChange={(e) =>
            setProp((props: ContainerProps) => {
              props.gap = parseInt(e.target.value);
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0px</span>
          <span>100px</span>
        </div>
      </div>

      {/* Min Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          최소 높이: {props.minHeight}px
        </label>
        <input
          type="range"
          min={50}
          max={800}
          step={10}
          value={props.minHeight}
          onChange={(e) =>
            setProp((props: ContainerProps) => {
              props.minHeight = parseInt(e.target.value);
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>50px</span>
          <span>800px</span>
        </div>
      </div>

      {/* Padding */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          내부 여백 (Padding)
        </label>
        <input
          type="text"
          value={props.padding}
          onChange={(e) =>
            setProp((props: ContainerProps) => {
              props.padding = e.target.value;
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="16px 또는 16px 24px"
        />
      </div>

      {/* Margin */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          외부 여백 (Margin)
        </label>
        <input
          type="text"
          value={props.margin}
          onChange={(e) =>
            setProp((props: ContainerProps) => {
              props.margin = e.target.value;
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="0 또는 16px 0"
        />
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
            setProp((props: ContainerProps) => {
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
                setProp((props: ContainerProps) => {
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
                setProp((props: ContainerProps) => {
                  props.borderColor = e.target.value;
                })
              }
              className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
            />
            <select
              value={props.borderStyle}
              onChange={(e) =>
                setProp((props: ContainerProps) => {
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
            setProp((props: ContainerProps) => {
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
    </div>
  );
};