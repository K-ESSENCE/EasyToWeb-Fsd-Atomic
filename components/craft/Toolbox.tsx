import React from 'react';
import { Element, useEditor } from '@craftjs/core';
import { Text } from './Text';
import { Image } from './Image';
import { Container } from './Container';

const ComponentButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  component: React.ComponentType<any>;
  props?: any;
}> = ({ icon, label, description, component, props = {} }) => {
  const { connectors } = useEditor();

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connectors.create(ref, React.createElement(component, props));
        }
      }}
      className="toolbox-item group cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 group-hover:text-blue-900">
            {label}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

const ContainerButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  props?: any;
}> = ({ icon, label, description, props = {} }) => {
  const { connectors } = useEditor();

  return (
    <div
      ref={(ref: HTMLDivElement | null) => {
        if (ref) {
          connectors.create(ref, <Element is={Container} {...props} canvas />);
        }
      }}
      className="toolbox-item group cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200"
    >
      <div className="flex items-start gap-3">
        <div className="text-gray-600 group-hover:text-green-600 transition-colors">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 group-hover:text-green-900">
            {label}
          </h4>
          <p className="text-xs text-gray-500 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export const Toolbox: React.FC = () => {
  return (
    <div className="toolbox p-4 space-y-6">
      {/* Basic Components */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          기본 컴포넌트
        </h3>
        <div className="space-y-2">
          <ComponentButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            }
            label="텍스트"
            description="텍스트 내용 추가"
            component={Text}
            props={{ text: '클릭해서 텍스트 편집' }}
          />
          
          <ComponentButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="이미지"
            description="이미지 추가"
            component={Image}
          />
        </div>
      </div>

      {/* Layout Components */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          레이아웃
        </h3>
        <div className="space-y-2">
          <ContainerButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            }
            label="컨테이너"
            description="다른 컴포넌트들을 그룹화"
            props={{
              padding: '20px',
              minHeight: 100,
              background: 'rgba(249, 250, 251, 0.5)',
              borderRadius: 8
            }}
          />
          
          <ContainerButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="섹션"
            description="전체 너비 섹션"
            props={{
              padding: '40px 20px',
              minHeight: 200,
              width: '100%',
              background: 'white',
              borderRadius: 0
            }}
          />
          
          <ContainerButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            }
            label="2단 컬럼"
            description="나란히 배치된 레이아웃"
            props={{
              flexDirection: 'row',
              gap: 20,
              padding: '20px',
              minHeight: 200,
              alignItems: 'stretch'
            }}
          />
        </div>
      </div>

      {/* Pre-built Sections */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          템플릿
        </h3>
        <div className="space-y-2">
          <div className="toolbox-template cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
            <div className="text-sm font-medium text-gray-900">히어로 섹션</div>
            <div className="text-xs text-gray-500 mt-1">곧 출시됩니다...</div>
          </div>
          
          <div className="toolbox-template cursor-pointer p-3 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
            <div className="text-sm font-medium text-gray-900">기능 그리드</div>
            <div className="text-xs text-gray-500 mt-1">곧 출시됩니다...</div>
          </div>
        </div>
      </div>
    </div>
  );
};