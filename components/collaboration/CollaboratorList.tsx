"use client";

import React from "react";
import {
  useYjs,
  CollaboratorInfo,
} from "../../shared/collaboration/YjsProvider";

interface CollaboratorListProps {
  className?: string;
}

export const CollaboratorList: React.FC<CollaboratorListProps> = ({
  className = "",
}) => {
  try {
    const yjsData = useYjs();
    
    // Safe destructuring with fallbacks
    const collaborators = yjsData?.collaborators || new Map();
    const isConnected = yjsData?.isConnected || false;

    if (!isConnected || collaborators.size === 0) {
      return (
        <div className={`collaborator-list ${className}`}>
          <div className="flex items-center gap-2 text-sm text-gray-800">
            <div
              className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`}
            />
            <span>{isConnected ? "온라인" : "오프라인"}</span>
          </div>
        </div>
      );
    }

    return (
      <div className={`collaborator-list ${className}`}>
        <div className="flex items-center gap-3">
          {/* Connection status */}
          <div className="flex items-center gap-2 text-sm text-gray-800">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>실시간</span>
          </div>

          {/* Collaborator avatars */}
          <div className="flex items-center -space-x-2">
            {Array.from(collaborators.entries()).map(([clientId, collaborator], index) => (
              <CollaboratorAvatar
                key={clientId}
                collaborator={collaborator}
                index={index}
              />
            ))}
          </div>

          {/* Collaborator count */}
          {collaborators.size > 0 && (
            <span className="text-sm text-gray-800">
              {collaborators.size}명 함께 편집 중
            </span>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error('CollaboratorList error:', error);
    return (
      <div className={`collaborator-list ${className}`}>
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span>연결 오류</span>
        </div>
      </div>
    );
  }
};

interface CollaboratorAvatarProps {
  collaborator: CollaboratorInfo;
  index: number;
}

const CollaboratorAvatar: React.FC<CollaboratorAvatarProps> = ({
  collaborator,
  index,
}) => {
  // Enhanced safety checks for collaborator data
  try {
    if (!collaborator || typeof collaborator !== 'object') {
      console.warn('CollaboratorAvatar: Invalid collaborator object', collaborator);
      return null;
    }
    
    if (!collaborator.email || typeof collaborator.email !== 'string') {
      console.warn('CollaboratorAvatar: Invalid collaborator email', collaborator);
      return null;
    }
  } catch (error) {
    console.error('CollaboratorAvatar: Error checking collaborator data', error);
    return null;
  }
  
  // Use nickname from collaborator.name (which contains nickname from localStorage)
  // If name is generic, fallback to email
  const displayName =
    collaborator.name === "사용자" || collaborator.name === "Anonymous"
      ? collaborator.email
      : collaborator.name; // This should now contain the nickname

  const initials = displayName
    .split(/[@\s]/)
    .filter((part) => part.length > 0)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Get editing status info with safe checks
  const getEditingStatus = () => {
    try {
      if (collaborator.editLock) {
        return "편집 잠금 중";
      }
      if (collaborator.selection?.nodeIds?.length) {
        return "편집 중";
      }
      return null;
    } catch (error) {
      console.error('Error getting editing status:', error);
      return null;
    }
  };

  const editingStatus = getEditingStatus();

  return (
    <div className="relative group" style={{ zIndex: 10 - index }}>
      <div
        className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-white text-xs font-medium cursor-pointer hover:scale-110 transition-transform"
        style={{ backgroundColor: collaborator.color }}
        title={`${displayName} (${collaborator.email})`}
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

      {/* Tooltip */}
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50 shadow-lg">
        <div className="font-medium">{displayName}</div>
        {editingStatus && (
          <div
            className={`mt-1 ${collaborator.editLock ? "text-red-300" : "text-gray-300"}`}
          >
            {editingStatus}
          </div>
        )}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>

      {/* Activity indicator */}
      {(() => {
        try {
          const hasSelection = (collaborator.selection?.nodeIds?.length ?? 0) > 0;
          const hasEditLock = Boolean(collaborator.editLock);
          
          if (hasSelection || hasEditLock) {
            return (
              <div
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-white ${
                  hasEditLock ? "animate-pulse bg-red-500" : "animate-pulse"
                }`}
                style={{
                  backgroundColor: hasEditLock
                    ? "#ef4444"
                    : collaborator.color || "#6b7280",
                }}
              />
            );
          }
          return null;
        } catch (error) {
          console.error('Error rendering activity indicator:', error);
          return null;
        }
      })()}
    </div>
  );
};
