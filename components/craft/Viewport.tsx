import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';

interface ViewportProps {
  className?: string;
}

export const Viewport: React.FC<ViewportProps> = ({ className }) => {
  const { enabled } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  const [scale, setScale] = useState(1);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const deviceSizes = {
    desktop: { width: '100%', height: '100%' },
    tablet: { width: '768px', height: '1024px' },
    mobile: { width: '375px', height: '667px' },
  };

  const currentSize = deviceSizes[deviceMode];

  return (
    <div className={`viewport-container ${className || ''}`}>
      {/* Viewport Controls */}
      <div className="viewport-controls flex items-center justify-between p-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-3">
          {/* Device Mode Selector */}
          <div className="flex items-center gap-1 border border-gray-300 rounded-md p-1">
            {[
              { mode: 'desktop', icon: 'M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2' },
              { mode: 'tablet', icon: 'M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z' },
              { mode: 'mobile', icon: 'M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z' },
            ].map(({ mode, icon }) => (
              <button
                key={mode}
                onClick={() => setDeviceMode(mode as any)}
                className={`p-2 rounded transition-colors ${
                  deviceMode === mode
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={mode === 'desktop' ? '데스크톱' : mode === 'tablet' ? '태블릿' : '모바일'}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
                </svg>
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScale(Math.max(0.25, scale - 0.25))}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              title="축소"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            
            <select
              value={scale}
              onChange={(e) => setScale(parseFloat(e.target.value))}
              className="px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0.25}>25%</option>
              <option value={0.5}>50%</option>
              <option value={0.75}>75%</option>
              <option value={1}>100%</option>
              <option value={1.25}>125%</option>
              <option value={1.5}>150%</option>
              <option value={2}>200%</option>
            </select>
            
            <button
              onClick={() => setScale(Math.min(2, scale + 0.25))}
              className="p-1 text-gray-600 hover:bg-gray-100 rounded"
              title="확대"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
            
            <button
              onClick={() => setScale(1)}
              className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              title="원래 크기로"
            >
              100%
            </button>
          </div>
        </div>

        {/* Current Size Display */}
        <div className="text-xs text-gray-500">
          {deviceMode === 'desktop' ? '반응형' : `${currentSize.width} × ${currentSize.height}`}
        </div>
      </div>

      {/* Viewport Canvas */}
      <div className="viewport-canvas flex-1 bg-gray-100 p-6 overflow-auto">
        <div
          className="viewport-frame mx-auto bg-white rounded-lg shadow-sm overflow-hidden"
          style={{
            width: currentSize.width,
            height: deviceMode === 'desktop' ? 'auto' : currentSize.height,
            transform: `scale(${scale})`,
            transformOrigin: 'top center',
            minHeight: deviceMode === 'desktop' ? '600px' : currentSize.height,
            maxWidth: deviceMode === 'desktop' ? '1200px' : currentSize.width,
          }}
        >
          {/* This will contain the actual editor content */}
          <div className="viewport-content h-full">
            {/* Editor content will be rendered here */}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      {enabled && (
        <div className="viewport-status bg-blue-50 border-t border-blue-200 px-3 py-2">
          <div className="flex items-center justify-between text-xs text-blue-800">
            <span>편집 모드</span>
            <span>확대/축소: {Math.round(scale * 100)}%</span>
          </div>
        </div>
      )}
    </div>
  );
};