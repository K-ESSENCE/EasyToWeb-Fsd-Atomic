'use client';

import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';
import { useYjs, CollaboratorInfo } from '../../shared/collaboration/YjsProvider';

interface ActiveUsersPanelProps {
  className?: string;
}

export const ActiveUsersPanel: React.FC<ActiveUsersPanelProps> = ({ className = '' }) => {
  const { collaborators, isConnected, uploadStatusMap, textEditStatusMap } = useYjs();
  const { query } = useEditor();
  const [isExpanded, setIsExpanded] = useState(false);
  
  const collaboratorCount = collaborators.size;

  const getNodeInfo = (nodeId: string) => {
    try {
      const node = query.node(nodeId);
      const nodeData = node.get() as any;
      // Craft.js stores component info in different places
      const componentName = nodeData.type?.resolvedName || 
                           nodeData.displayName || 
                           nodeData.data?.craft?.displayName || 
                           'Unknown';
      return {
        displayName: componentName === 'Text' ? '텍스트' : 
                    componentName === 'Container' ? '컨테이너' : 
                    componentName === 'Image' ? '이미지' : componentName,
        type: componentName
      };
    } catch {
      return { displayName: '알 수 없음', type: 'Unknown' };
    }
  };

  const getUploadStatus = (nodeId: string) => {
    return uploadStatusMap?.get(nodeId);
  };

  const getTextEditStatus = (nodeId: string) => {
    return textEditStatusMap?.get(nodeId);
  };

  const getSelectionInfo = (selection: { nodeIds: string[] }) => {
    if (!selection.nodeIds || selection.nodeIds.length === 0) return null;
    
    const firstNodeId = selection.nodeIds[0];
    const nodeInfo = getNodeInfo(firstNodeId);
    
    return selection.nodeIds.length === 1
      ? `${nodeInfo.displayName} 편집 중`
      : `${selection.nodeIds.length}개 요소 선택 중`;
  };

  if (!isConnected) {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center text-gray-500 text-sm">
          <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
          연결 끊김
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <h3 className="text-sm font-semibold text-gray-900">
              현재 접속자 ({collaboratorCount}명)
            </h3>
          </div>
          
          {collaboratorCount > 0 && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {isExpanded ? '간단히' : '자세히'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {collaboratorCount === 0 ? (
          <div className="text-center text-gray-500 text-sm py-4">
            현재 접속한 사용자가 없습니다
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from(collaborators.entries()).map(([clientId, collaborator]) => (
              <ActiveUserItem
                key={clientId}
                collaborator={collaborator}
                isExpanded={isExpanded}
                getNodeInfo={getNodeInfo}
                getUploadStatus={getUploadStatus}
                getTextEditStatus={getTextEditStatus}
                getSelectionInfo={getSelectionInfo}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface ActiveUserItemProps {
  collaborator: CollaboratorInfo;
  isExpanded: boolean;
  getNodeInfo: (nodeId: string) => { displayName: string; type: string };
  getUploadStatus: (nodeId: string) => any;
  getTextEditStatus: (nodeId: string) => any;
  getSelectionInfo: (selection: { nodeIds: string[] }) => string | null;
}

const ActiveUserItem: React.FC<ActiveUserItemProps> = ({
  collaborator,
  isExpanded,
  getNodeInfo,
  getUploadStatus,
  getTextEditStatus,
  getSelectionInfo
}) => {
  const hasSelection = (collaborator.selection?.nodeIds?.length ?? 0) > 0;
  const selectedNodes = collaborator.selection?.nodeIds || [];
  const selectionInfo = hasSelection ? getSelectionInfo({ nodeIds: selectedNodes }) : null;
  
  // Check for upload or text editing status
  const isUploading = selectedNodes.some(nodeId => {
    const uploadStatus = getUploadStatus(nodeId);
    return uploadStatus?.uploading;
  });
  
  const isTextEditing = selectedNodes.some(nodeId => {
    const textEditStatus = getTextEditStatus(nodeId);
    return textEditStatus?.editing;
  });

  // Use nickname from collaborator.name, fallback to email for initials
  const displayName = collaborator.name === "사용자" || collaborator.name === "Anonymous"
    ? collaborator.email
    : collaborator.name;
    
  const initials = displayName
    .split(/[@\s]/)
    .filter(part => part.length > 0)
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-start space-x-3">
      {/* Avatar */}
      <div className="flex-shrink-0">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-medium shadow-sm"
          style={{ backgroundColor: collaborator.color }}
        >
          {collaborator.profileUrl ? (
            <img
              src={collaborator.profileUrl}
              alt={collaborator.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </div>
        
        {/* Activity indicator */}
        {hasSelection && (
          <div
            className="w-3 h-3 rounded-full border-2 border-white animate-pulse mt-1 ml-1"
            style={{ backgroundColor: collaborator.color }}
          />
        )}
      </div>

      {/* User info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-gray-900 truncate">
            {displayName}
          </p>
          
          {isUploading && (
            <span className="text-xs text-blue-500 animate-pulse">
              업로드 중
            </span>
          )}
          
          {isTextEditing && (
            <span className="text-xs text-green-500">
              텍스트 편집 중
            </span>
          )}
        </div>
        
        <p className="text-xs text-gray-500 truncate">
          {collaborator.email}
        </p>
        
        {/* Selection info */}
        {hasSelection && selectionInfo && (
          <div className="mt-1">
            <p className="text-xs text-gray-600">
              {selectionInfo}
            </p>
            
            {/* Detailed selection info when expanded */}
            {isExpanded && selectedNodes.length > 0 && (
              <div className="mt-2 space-y-1">
                {selectedNodes.slice(0, 3).map((nodeId) => {
                  const nodeInfo = getNodeInfo(nodeId);
                  const uploadStatus = getUploadStatus(nodeId);
                  const textEditStatus = getTextEditStatus(nodeId);
                  
                  return (
                    <div key={nodeId} className="flex items-center space-x-2 text-xs">
                      <div
                        className="w-1 h-1 rounded-full"
                        style={{ backgroundColor: collaborator.color }}
                      />
                      <span className="text-gray-600">
                        {nodeInfo.displayName} ({nodeInfo.type})
                      </span>
                      
                      {uploadStatus?.uploading && (
                        <span className="text-blue-500">
                          {uploadStatus.progress}% 업로드
                        </span>
                      )}
                      
                      {textEditStatus?.editing && (
                        <span className="text-green-500">편집 중</span>
                      )}
                    </div>
                  );
                })}
                
                {selectedNodes.length > 3 && (
                  <p className="text-xs text-gray-400 ml-3">
                    +{selectedNodes.length - 3}개 더
                  </p>
                )}
              </div>
            )}
          </div>
        )}
        
        {!hasSelection && (
          <p className="text-xs text-gray-400 mt-1">대기 중</p>
        )}
      </div>
    </div>
  );
};