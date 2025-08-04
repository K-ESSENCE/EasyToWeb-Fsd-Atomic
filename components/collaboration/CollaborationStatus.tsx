'use client';

import React from 'react';
import { useYjs } from '../../shared/collaboration/YjsProvider';

export const CollaborationStatus: React.FC = () => {
  const { isConnected, collaborators, provider } = useYjs();
  
  const otherUsers = collaborators.size;
  
  if (!isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded-md">
        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
        <span>연결 중...</span>
      </div>
    );
  }

  if (otherUsers === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md">
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
        <span>혼자 편집 중</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md">
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
      <span>{otherUsers}명과 함께 편집 중</span>
      <div className="flex -space-x-1 ml-2">
        {Array.from(collaborators.values()).slice(0, 3).map((collaborator) => (
          <div
            key={collaborator.id}
            className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-xs font-semibold text-white"
            style={{ backgroundColor: collaborator.color }}
            title={collaborator.name}
          >
            {collaborator.name.charAt(0).toUpperCase()}
          </div>
        ))}
        {otherUsers > 3 && (
          <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-500 flex items-center justify-center text-xs font-semibold text-white">
            +{otherUsers - 3}
          </div>
        )}
      </div>
    </div>
  );
};