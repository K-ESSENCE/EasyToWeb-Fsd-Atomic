'use client';

import React from 'react';
import { useYjs } from '../../shared/collaboration/YjsProvider';

interface CollaborationLoadingOverlayProps {
  show?: boolean;
}

export const CollaborationLoadingOverlay: React.FC<CollaborationLoadingOverlayProps> = ({ show }) => {
  const { isLoading, isConnected } = useYjs();
  
  // Show loading if explicitly requested or if YjsProvider is loading
  const shouldShowLoading = show || isLoading;
  
  if (!shouldShowLoading) {
    return null;
  }

  // Determine loading message based on connection state
  const getLoadingMessage = () => {
    if (!isConnected) {
      return {
        title: "서버에 연결 중...",
        description: "협업 서버와 연결을 설정하고 있습니다"
      };
    } else {
      return {
        title: "콘텐츠 불러오는 중...",
        description: "저장된 내용을 동기화하고 있습니다"
      };
    }
  };

  const { title, description } = getLoadingMessage();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {title}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {description}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};