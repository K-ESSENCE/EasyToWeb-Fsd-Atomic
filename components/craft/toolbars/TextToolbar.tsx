import React from 'react';
import { useNode } from '@craftjs/core';
import { TextProps } from '../Text';

export const TextToolbar: React.FC = () => {
  const {
    actions: { setProp },
    props,
  } = useNode((node) => ({
    props: node.data.props as TextProps,
  }));

  return (
    <div className="text-toolbar space-y-4">
      {/* Text Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          텍스트 내용
        </label>
        <textarea
          value={props.text}
          onChange={(e) =>
            setProp((props: TextProps) => {
              props.text = e.target.value;
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="텍스트를 입력하세요"
        />
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          글자 크기: {props.fontSize}px
        </label>
        <input
          type="range"
          min={8}
          max={72}
          value={props.fontSize}
          onChange={(e) =>
            setProp((props: TextProps) => {
              props.fontSize = parseInt(e.target.value);
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>8px</span>
          <span>72px</span>
        </div>
      </div>

      {/* Font Weight */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          글자 굵기
        </label>
        <select
          value={props.fontWeight}
          onChange={(e) =>
            setProp((props: TextProps) => {
              props.fontWeight = e.target.value as 'normal' | 'bold';
            })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="normal">일반</option>
          <option value="bold">굵게</option>
        </select>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          글자 색상
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={props.color}
            onChange={(e) =>
              setProp((props: TextProps) => {
                props.color = e.target.value;
              })
            }
            className="w-12 h-8 border border-gray-300 rounded cursor-pointer"
          />
          <input
            type="text"
            value={props.color}
            onChange={(e) =>
              setProp((props: TextProps) => {
                props.color = e.target.value;
              })
            }
            className="flex-1 px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="#000000"
          />
        </div>
      </div>

      {/* Text Alignment */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          텍스트 정렬
        </label>
        <div className="flex space-x-1">
          {[
            { value: 'left', icon: 'M3 4h18M3 8h12M3 12h18M3 16h12' },
            { value: 'center', icon: 'M5 4h14M7 8h10M5 12h14M7 16h10' },
            { value: 'right', icon: 'M3 4h18M9 8h12M3 12h18M9 16h12' },
          ].map(({ value, icon }) => (
            <button
              key={value}
              onClick={() =>
                setProp((props: TextProps) => {
                  props.textAlign = value as 'left' | 'center' | 'right';
                })
              }
              className={`flex-1 p-2 border rounded-md transition-colors ${
                props.textAlign === value
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
              </svg>
            </button>
          ))}
        </div>
      </div>

      {/* Line Height */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          줄 간격: {props.lineHeight}
        </label>
        <input
          type="range"
          min={1}
          max={3}
          step={0.1}
          value={props.lineHeight}
          onChange={(e) =>
            setProp((props: TextProps) => {
              props.lineHeight = parseFloat(e.target.value);
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>1.0</span>
          <span>3.0</span>
        </div>
      </div>

      {/* Letter Spacing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          글자 간격: {props.letterSpacing}px
        </label>
        <input
          type="range"
          min={-2}
          max={10}
          step={0.5}
          value={props.letterSpacing}
          onChange={(e) =>
            setProp((props: TextProps) => {
              props.letterSpacing = parseFloat(e.target.value);
            })
          }
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>-2px</span>
          <span>10px</span>
        </div>
      </div>

      {/* Spacing */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            여백 (Margin)
          </label>
          <input
            type="text"
            value={props.margin}
            onChange={(e) =>
              setProp((props: TextProps) => {
                props.margin = e.target.value;
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="0px"
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
              setProp((props: TextProps) => {
                props.padding = e.target.value;
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="8px"
          />
        </div>
      </div>
    </div>
  );
};