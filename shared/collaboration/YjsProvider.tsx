'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { BASE_SOCKET_PROTOCOL, BASE_API_URL } from '../api/axios';
import { getAccessTokenFromLocal, getAccountInfoFromLocal } from '../../utils/session';

interface YjsContextType {
  doc: Y.Doc | null;
  provider: WebsocketProvider | null;
  isConnected: boolean;
  isLoading: boolean;
  collaborators: Map<string, CollaboratorInfo>;
  // Y.Map instances for different data types
  sharedNodesMap: Y.Map<any> | null;
  sharedMetaMap: Y.Map<any> | null;
  uploadStatusMap: Y.Map<any> | null;
  textEditStatusMap: Y.Map<any> | null;
  editLockMap: Y.Map<any> | null;
  // Edit lock functions
  lockNode: (nodeId: string) => void;
  unlockNode: (nodeId: string) => void;
  isNodeLocked: (nodeId: string) => boolean;
  getNodeLocker: (nodeId: string) => CollaboratorInfo | null;
  // Editor state functions
  setEditorEnabled: (enabled: boolean) => void;
  getEditorEnabled: () => boolean;
}

interface CollaboratorInfo {
  id: string;
  baseUserId?: string; // Original user ID for grouping duplicate sessions
  name: string;
  email: string;
  profileUrl?: string;
  cursor?: {
    nodeId: string;
    position: { x: number; y: number };
  };
  selection?: {
    nodeIds: string[];
  };
  editLock?: {
    nodeId: string;
    timestamp: number;
  };
  color: string;
}

const YjsContext = createContext<YjsContextType>({
  doc: null,
  provider: null,
  isConnected: false,
  isLoading: true,
  collaborators: new Map(),
  sharedNodesMap: null,
  sharedMetaMap: null,
  uploadStatusMap: null,
  textEditStatusMap: null,
  editLockMap: null,
  lockNode: () => {},
  unlockNode: () => {},
  isNodeLocked: () => false,
  getNodeLocker: () => null,
  setEditorEnabled: () => {},
  getEditorEnabled: () => true,
});

interface YjsProviderProps {
  children: ReactNode;
  projectId: string;
}

// Generate random color for collaborators
const generateColor = (): string => {
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const YjsProvider: React.FC<YjsProviderProps> = ({ children, projectId }) => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collaborators, setCollaborators] = useState<Map<string, CollaboratorInfo>>(new Map());
  
  // Y.Map instances
  const [sharedNodesMap, setSharedNodesMap] = useState<Y.Map<any> | null>(null);
  const [sharedMetaMap, setSharedMetaMap] = useState<Y.Map<any> | null>(null);
  const [uploadStatusMap, setUploadStatusMap] = useState<Y.Map<any> | null>(null);
  const [textEditStatusMap, setTextEditStatusMap] = useState<Y.Map<any> | null>(null);
  const [editLockMap, setEditLockMap] = useState<Y.Map<any> | null>(null);

  useEffect(() => {
    if (!projectId) return;

    // Create Yjs document
    const yjsDoc = new Y.Doc();

    // Initialize Y.Map instances (matching existing yjs.ts keys)
    const nodesMap = yjsDoc.getMap('layoutData');
    const metaMap = yjsDoc.getMap('meta');
    const uploadMap = yjsDoc.getMap('uploadStatus');
    const textEditMap = yjsDoc.getMap('textEditStatus');
    const lockMap = yjsDoc.getMap('editLocks');
    
    setSharedNodesMap(nodesMap);
    setSharedMetaMap(metaMap);
    setUploadStatusMap(uploadMap);
    setTextEditStatusMap(textEditMap);
    setEditLockMap(lockMap);
    
    // WebSocket connection using existing pattern
    const token = getAccessTokenFromLocal();
    
    // Create WebSocket provider like in existing yjs.ts
    const wsProvider = new WebsocketProvider(
      BASE_SOCKET_PROTOCOL + BASE_API_URL,
      'layout-modal-room',
      yjsDoc,
      {
        params: {
          roomName: projectId,
        },
        protocols: [`Authorization_${token}`],
      }
    );

    setDoc(yjsDoc);
    setProvider(wsProvider);

    // Add message handlers like in existing yjs.ts
    // wsProvider.messageHandlers[messageCapture] = () => {
    //   captureAndDownload(projectId);
    // };

    // Handle connection events
    wsProvider.on('status', (event: { status: string }) => {
      // WebSocket connection status changed
      const connected = event.status === 'connected';
      setIsConnected(connected);
      
      // Keep loading until initial sync is complete
      if (connected) {
        // Give some time for initial data sync
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } else {
        setIsLoading(event.status === 'connecting');
      }
    });

    wsProvider.on('connection-close', (event) => {
      if (!event) {
        return;
      }

      console.error('WebSocket connection close:', event);
      
      // Handle specific error codes like in the existing implementation
      const error = event as unknown as {
        code: number;
        reason: string;
      };

      switch (error.code) {
        case 1002:
          console.error('Resource not found');
          break;
        case 1003:
          console.error('Invalid input value:', error.reason);
          break;
        case 1008:
          // Project not found or access denied
          break;
        case 1011:
          console.error('Internal server error');
          break;
        case 4401:
          console.error('Access token expired');
          break;
        case 1006:
          console.error('network connecting close');
          break;
        default:
          console.error('Unknown error:', error);
      }

      setIsConnected(false);
    });

    wsProvider.on('connection-error', (event: Event) => {
      console.error('WebSocket connection error:', event);
      
      // Handle specific error codes like in the existing implementation
      const error = event as unknown as {
        code: number;
        message: string;
        errorFieldName?: string;
      };

      switch (error.code) {
        case 1002:
          console.error('Resource not found');
          break;
        case 1003:
          console.error('Invalid input value:', error.errorFieldName);
          break;
        case 1008:
          if (error.message === 'PROJECT_NOT_FOUND') {
            console.error('Project not found');
          } else if (error.message === 'USER_NOT_LOGIN') {
            console.error('User not logged in');
          } else if (error.message === 'ACCESS_DENIED') {
            console.error('Access denied');
          }
          break;
        case 1011:
          console.error('Internal server error');
          break;
        case 4401:
          console.error('Access token expired');
          break;
        default:
          console.error('Unknown error:', error);
      }
      
      setIsConnected(false);
      setIsLoading(false);
    });

    // Handle awareness (user presence)
    const awareness = wsProvider.awareness;
    
    // Set local user info
    const updateLocalUser = () => {
      const token = getAccessTokenFromLocal();
      if (token) {
        try {
          // Parse JWT token to get user info
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // Get account info from localStorage - check both 'account' and 'accountInfo' keys
          let accountInfo = getAccountInfoFromLocal();
          if (!accountInfo) {
            try {
              const accountStr = localStorage.getItem('account');
              accountInfo = accountStr ? JSON.parse(accountStr) : undefined;
            } catch {
              accountInfo = undefined;
            }
          }
          
          // Create unique session ID to handle multiple sessions from same user
          const baseUserId = payload.sub || payload.userId || accountInfo?.id || `user-${Date.now()}`;
          const sessionId = `${baseUserId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
          
          const baseName = accountInfo?.nickname || accountInfo?.email?.split('@')[0] || payload.name || payload.email?.split('@')[0] || '사용자';
          
          const userInfo = {
            id: sessionId, // Unique session-based ID
            baseUserId: baseUserId, // Original user ID for grouping
            name: baseName,
            email: accountInfo?.email || payload.email || 'user@example.com',
            color: generateColor(),
            timestamp: Date.now(),
          };
          
          // Setting user info for collaboration
          awareness.setLocalStateField('user', userInfo);
        } catch (error) {
          console.error('Failed to parse token or set user info:', error);
          
          // Try to get info from localStorage as fallback
          try {
            let accountInfo = getAccountInfoFromLocal();
            if (!accountInfo) {
              try {
                const accountStr = localStorage.getItem('account');
                accountInfo = accountStr ? JSON.parse(accountStr) : undefined;
              } catch {
                accountInfo = undefined;
              }
            }
            
            const baseUserId = accountInfo?.id || `user-${Date.now()}`;
            const sessionId = `${baseUserId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            const baseName = accountInfo?.nickname || accountInfo?.email?.split('@')[0] || 'Anonymous';
            
            const fallbackUserInfo = {
              id: sessionId,
              baseUserId: baseUserId,
              name: baseName,
              email: accountInfo?.email || 'anonymous@example.com',
              color: generateColor(),
              timestamp: Date.now(),
            };
            
            // Using fallback user info
            awareness.setLocalStateField('user', fallbackUserInfo);
          } catch (fallbackError) {
            console.error('Fallback user info also failed:', fallbackError);
            const timestamp = Date.now();
            const ultimateFallback = {
              id: `anonymous-${timestamp}-${Math.random().toString(36).substr(2, 5)}`,
              baseUserId: `anonymous-${timestamp}`,
              name: 'Anonymous',
              email: 'anonymous@example.com',
              color: generateColor(),
              timestamp: timestamp,
            };
            awareness.setLocalStateField('user', ultimateFallback);
          }
        }
      }
    };

    updateLocalUser();

    // Listen for awareness changes (other users) with debouncing
    let awarenessTimeout: NodeJS.Timeout;
    
    const handleAwarenessChange = () => {
      // Debounce awareness changes to prevent excessive updates
      if (awarenessTimeout) {
        clearTimeout(awarenessTimeout);
      }
      
      awarenessTimeout = setTimeout(() => {
        const states = awareness.getStates();
        const newCollaborators = new Map<string, CollaboratorInfo>();
        const userNameCounts = new Map<string, number>();

        // First pass: collect all users and count duplicates
        const allUsers: Array<{ clientId: string; state: any }> = [];
        states.forEach((state, clientId) => {
          if (clientId !== awareness.clientID && state.user) {
            allUsers.push({ clientId: clientId.toString(), state });
            
            const baseEmail = state.user.email;
            const currentCount = userNameCounts.get(baseEmail) || 0;
            userNameCounts.set(baseEmail, currentCount + 1);
          }
        });

        // Second pass: assign unique display names
        const emailCounters = new Map<string, number>();
        allUsers.forEach(({ clientId, state }) => {
          const baseEmail = state.user.email;
          const baseName = state.user.name;
          
          let displayName = baseName;
          
          // If there are multiple users with same email, add numbers
          if (userNameCounts.get(baseEmail)! > 1) {
            const currentNumber = (emailCounters.get(baseEmail) || 0) + 1;
            emailCounters.set(baseEmail, currentNumber);
            displayName = `${baseName} (${currentNumber})`;
          }

          newCollaborators.set(clientId, {
            id: state.user.id,
            baseUserId: state.user.baseUserId,
            name: displayName, // This now includes the number suffix if needed
            email: state.user.email,
            profileUrl: state.user.profileUrl,
            cursor: state.cursor,
            selection: state.selection,
            editLock: state.editLock,
            color: state.user.color,
          });
        });

        setCollaborators(newCollaborators);
      }, 150); // Debounce awareness changes
    };

    awareness.on('change', handleAwarenessChange);

    setDoc(yjsDoc);
    setProvider(wsProvider);

    // Cleanup
    return () => {
      if (awarenessTimeout) {
        clearTimeout(awarenessTimeout);
      }
      awareness.off('change', handleAwarenessChange);
      wsProvider.destroy();
      yjsDoc.destroy();
    };
  }, [projectId]);

  // Edit lock functions
  const lockNode = (nodeId: string) => {
    if (!provider?.awareness) return;
    
    const awareness = provider.awareness;
    const currentState = awareness.getLocalState() || {};
    
    // Update only the editLock field, preserving all other state
    awareness.setLocalState({
      ...currentState,
      editLock: {
        nodeId,
        timestamp: Date.now(),
      }
    });
  };

  const unlockNode = (nodeId: string) => {
    if (!provider?.awareness) return;
    
    const awareness = provider.awareness;
    const currentState = awareness.getLocalState() || {};
    
    if (currentState.editLock?.nodeId === nodeId) {
      const { editLock, ...stateWithoutLock } = currentState;
      awareness.setLocalState(stateWithoutLock);
    }
  };

  const isNodeLocked = (nodeId: string): boolean => {
    if (!provider?.awareness) return false;
    
    const states = provider.awareness.getStates();
    for (const [clientId, state] of states) {
      if (clientId !== provider.awareness.clientID && 
          state.editLock?.nodeId === nodeId) {
        // Check if lock is still valid (within 30 seconds)
        const lockAge = Date.now() - state.editLock.timestamp;
        if (lockAge < 30000) {
          return true;
        }
      }
    }
    return false;
  };

  const getNodeLocker = (nodeId: string): CollaboratorInfo | null => {
    if (!provider?.awareness) return null;
    
    const states = provider.awareness.getStates();
    for (const [clientId, state] of states) {
      if (clientId !== provider.awareness.clientID && 
          state.editLock?.nodeId === nodeId &&
          state.user) {
        // Check if lock is still valid
        const lockAge = Date.now() - state.editLock.timestamp;
        if (lockAge < 30000) {
          return {
            id: state.user.id,
            baseUserId: state.user.baseUserId,
            name: state.user.name,
            email: state.user.email,
            profileUrl: state.user.profileUrl,
            cursor: state.cursor,
            selection: state.selection,
            editLock: state.editLock,
            color: state.user.color,
          };
        }
      }
    }
    return null;
  };

  // Editor state functions
  const setEditorEnabled = (enabled: boolean) => {
    if (!editLockMap) return;
    editLockMap.set('editorEnabled', enabled);
  };

  const getEditorEnabled = (): boolean => {
    if (!editLockMap) return true;
    return editLockMap.get('editorEnabled') ?? true;
  };

  const value: YjsContextType = {
    doc,
    provider,
    isConnected,
    isLoading,
    collaborators,
    sharedNodesMap,
    sharedMetaMap,
    uploadStatusMap,
    textEditStatusMap,
    editLockMap,
    lockNode,
    unlockNode,
    isNodeLocked,
    getNodeLocker,
    setEditorEnabled,
    getEditorEnabled,
  };

  return (
    <YjsContext.Provider value={value}>
      {children}
    </YjsContext.Provider>
  );
};

export const useYjs = () => {
  const context = useContext(YjsContext);
  if (!context) {
    console.error('useYjs must be used within YjsProvider');
    // Return default values instead of throwing
    return {
      doc: null,
      provider: null,
      isConnected: false,
      isLoading: false,
      collaborators: new Map(),
      sharedNodesMap: null,
      sharedMetaMap: null,
      uploadStatusMap: null,
      textEditStatusMap: null,
      editLockMap: null,
      lockNode: () => {},
      unlockNode: () => {},
      isNodeLocked: () => false,
      getNodeLocker: () => null,
      setEditorEnabled: () => {},
      getEditorEnabled: () => true,
    };
  }
  return context;
};

// Helper functions like in existing yjs.ts
export const updateUserSelection = (
  awareness: any,
  nodeIds: string[]
) => {
  const currentState = awareness.getLocalState() || {};
  // Update only the selection field, preserving all other state
  awareness.setLocalState({
    ...currentState,
    selection: {
      nodeIds,
      timestamp: Date.now(),
    },
  });
};

export const cleanupYjsProvider = (provider: any) => {
  if (provider) {
    provider.awareness.setLocalState(null);
    provider.destroy();
  }
};

export type { CollaboratorInfo };