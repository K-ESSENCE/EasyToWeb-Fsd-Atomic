"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { BASE_SOCKET_PROTOCOL, BASE_API_URL } from "../api/axios";
import {
  getAccessTokenFromLocal,
  getAccountInfoFromLocal,
} from "../../utils/session";
import { captureAndDownload, messageCapture } from "../../utils/yjs";

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
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const YjsProvider: React.FC<YjsProviderProps> = ({
  children,
  projectId,
}) => {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [collaborators, setCollaborators] = useState<
    Map<string, CollaboratorInfo>
  >(new Map());

  // Y.Map instances
  const [sharedNodesMap, setSharedNodesMap] = useState<Y.Map<any> | null>(null);
  const [sharedMetaMap, setSharedMetaMap] = useState<Y.Map<any> | null>(null);
  const [uploadStatusMap, setUploadStatusMap] = useState<Y.Map<any> | null>(
    null
  );
  const [textEditStatusMap, setTextEditStatusMap] = useState<Y.Map<any> | null>(
    null
  );
  const [editLockMap, setEditLockMap] = useState<Y.Map<any> | null>(null);

  useEffect(() => {
    if (!projectId) return;

    // Create Yjs document
    const yjsDoc = new Y.Doc();

    // Initialize Y.Map instances (matching existing yjs.ts keys)
    const nodesMap = yjsDoc.getMap("layoutData");
    const metaMap = yjsDoc.getMap("meta");
    const uploadMap = yjsDoc.getMap("uploadStatus");
    const textEditMap = yjsDoc.getMap("textEditStatus");
    const lockMap = yjsDoc.getMap("editLocks");

    setSharedNodesMap(nodesMap);
    setSharedMetaMap(metaMap);
    setUploadStatusMap(uploadMap);
    setTextEditStatusMap(textEditMap);
    setEditLockMap(lockMap);

    // WebSocket connection using existing pattern
    const token = getAccessTokenFromLocal();

    // Validate token before creating connection
    if (!token) {
      console.error("YjsProvider: No access token available");
      setIsLoading(false);
      setIsConnected(false);
      return;
    }

    // Create WebSocket provider matching the API specification
    // The WebsocketProvider expects base URL without room path
    // It will internally append the room name to create the final URL
    const wsUrl = `${BASE_SOCKET_PROTOCOL}${BASE_API_URL}`;

    console.log("YjsProvider: Attempting WebSocket connection to:", wsUrl);
    console.log("YjsProvider: Room name:", projectId);
    console.log("YjsProvider: Token available:", !!token);

    const wsProvider = new WebsocketProvider(
      wsUrl,
      "layout-modal-room", // This should be the room endpoint name
      yjsDoc,
      {
        params: {
          roomName: projectId, // Actual project ID passed as parameter
        },
        protocols: [`Authorization_${token}`],
        // Control reconnection behavior
        resyncInterval: -1, // Disable automatic resync
        maxBackoffTime: 30000, // Max 30 seconds backoff
      }
    );

    setDoc(yjsDoc);
    setProvider(wsProvider);

    // Add message handlers like in existing yjs.ts
    wsProvider.messageHandlers[messageCapture] = () => {
      captureAndDownload(projectId);
    };

    // Handle connection events
    wsProvider.on("status", (event: { status: string }) => {
      console.log("WebSocket status changed:", event.status);
      const connected = event.status === "connected";
      setIsConnected(connected);

      // Keep loading until initial sync is complete
      if (connected) {
        console.log("WebSocket connected successfully");
        // Give some time for initial data sync
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      } else if (event.status === "connecting") {
        console.log("WebSocket connecting...");
        setIsLoading(true);
      } else if (event.status === "disconnected") {
        console.log("WebSocket disconnected");
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });

    wsProvider.on("connection-close", (event) => {
      if (!event) {
        console.log("WebSocket connection closed (no event data)");
        setIsConnected(false);
        return;
      }

      console.error("WebSocket connection close:", event);

      // Handle specific error codes like in the existing implementation
      const error = event as unknown as {
        code: number;
        reason: string;
      };

      switch (error.code) {
        case 1002:
          console.error(
            "RESOURCE_NOT_FOUND: 해당하는 요청이 존재하지 않습니다."
          );
          break;
        case 1003:
          console.error(
            "INPUT_VALUE_INVALID:",
            error.reason || "Invalid input"
          );
          break;
        case 1008:
          // Check specific error messages for 1008
          if (error.reason?.includes("PROJECT_NOT_FOUND")) {
            console.error("PROJECT_NOT_FOUND: 프로젝트가 존재하지 않습니다.");
          } else if (error.reason?.includes("USER_NOT_LOGIN")) {
            console.error("USER_NOT_LOGIN: 로그인이 필요합니다.");
          } else if (error.reason?.includes("ACCESS_DENIED")) {
            console.error("ACCESS_DENIED: 권한이 없습니다.");
          } else {
            console.error(
              "PROJECT_ACCESS_DENIED: 프로젝트를 찾을 수 없거나 권한이 없습니다."
            );
          }
          break;
        case 1011:
          console.error(
            "UNEXPECTED_INTERNAL_SERVER_ERROR: 죄송합니다. 잠시후 시도해주세요."
          );
          break;
        case 4401:
          console.error("ACCESS_TOKEN_EXPIRED: 엑세스 토큰이 만료되었습니다.");
          break;
        case 1006:
          console.error("Network connection close");
          break;
        default:
          console.error("Unknown WebSocket error:", error);
      }

      setIsConnected(false);

      // Stop provider if critical errors occur to prevent infinite reconnection
      if (error.code === 4401 || error.code === 1008) {
        console.warn("Critical error detected, stopping WebSocket provider");
        wsProvider.disconnect();
      }
    });

    wsProvider.on("connection-error", (event: Event) => {
      console.error("WebSocket connection error:", event);

      // Handle specific error codes like in the existing implementation
      const error = event as unknown as {
        code: number;
        message: string;
        errorFieldName?: string;
      };

      // Don't log if error object is empty (prevents infinite empty logs)
      if (
        !error ||
        (typeof error === "object" && Object.keys(error).length === 0)
      ) {
        console.error(
          "WebSocket connection error: Empty error object - likely network issue"
        );
        setIsConnected(false);
        setIsLoading(false);
        return;
      }

      switch (error.code) {
        case 1002:
          console.error(
            "RESOURCE_NOT_FOUND: 해당하는 요청이 존재하지 않습니다."
          );
          break;
        case 1003:
          console.error(
            "INPUT_VALUE_INVALID:",
            error.errorFieldName || "Unknown field"
          );
          break;
        case 1008:
          if (error.message === "PROJECT_NOT_FOUND") {
            console.error("PROJECT_NOT_FOUND: 프로젝트가 존재하지 않습니다.");
          } else if (error.message === "USER_NOT_LOGIN") {
            console.error("USER_NOT_LOGIN: 로그인이 필요합니다.");
          } else if (error.message === "ACCESS_DENIED") {
            console.error("ACCESS_DENIED: 권한이 없습니다.");
          } else {
            console.error(
              "PROJECT_ACCESS_DENIED: 프로젝트를 찾을 수 없거나 권한이 없습니다."
            );
          }
          break;
        case 1011:
          console.error(
            "UNEXPECTED_INTERNAL_SERVER_ERROR: 죄송합니다. 잠시후 시도해주세요."
          );
          break;
        case 4401:
          console.error("ACCESS_TOKEN_EXPIRED: 엑세스 토큰이 만료되었습니다.");
          break;
        default:
          console.error("Unknown WebSocket connection error:", error);
      }

      setIsConnected(false);
      setIsLoading(false);

      // Stop provider if critical errors occur to prevent infinite reconnection
      if (error.code === 4401 || error.code === 1008) {
        console.warn("Critical error detected, stopping WebSocket provider");
        wsProvider.disconnect();
      }
    });

    // Handle awareness (user presence)
    const awareness = wsProvider.awareness;

    // Set local user info
    const updateLocalUser = () => {
      const token = getAccessTokenFromLocal();
      if (token) {
        try {
          // Parse JWT token to get user info
          const payload = JSON.parse(atob(token.split(".")[1]));

          // Get account info from localStorage - check both 'account' and 'accountInfo' keys
          let accountInfo = getAccountInfoFromLocal();
          if (!accountInfo) {
            try {
              const accountStr = localStorage.getItem("account");
              accountInfo = accountStr ? JSON.parse(accountStr) : undefined;
            } catch {
              accountInfo = undefined;
            }
          }

          // Create unique session ID to handle multiple sessions from same user
          const baseUserId =
            payload.sub ||
            payload.userId ||
            accountInfo?.id ||
            `user-${Date.now()}`;
          const sessionId = `${baseUserId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;

          const baseName =
            accountInfo?.nickname ||
            accountInfo?.email?.split("@")[0] ||
            payload.name ||
            payload.email?.split("@")[0] ||
            "사용자";

          const userInfo = {
            id: sessionId, // Unique session-based ID
            baseUserId: baseUserId, // Original user ID for grouping
            name: baseName,
            email: accountInfo?.email || payload.email || "user@example.com",
            color: generateColor(),
            timestamp: Date.now(),
          };

          // Setting user info for collaboration
          awareness.setLocalStateField("user", userInfo);
        } catch (error) {
          console.error("Failed to parse token or set user info:", error);

          // Try to get info from localStorage as fallback
          try {
            let accountInfo = getAccountInfoFromLocal();
            if (!accountInfo) {
              try {
                const accountStr = localStorage.getItem("account");
                accountInfo = accountStr ? JSON.parse(accountStr) : undefined;
              } catch {
                accountInfo = undefined;
              }
            }

            const baseUserId = accountInfo?.id || `user-${Date.now()}`;
            const sessionId = `${baseUserId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
            const baseName =
              accountInfo?.nickname ||
              accountInfo?.email?.split("@")[0] ||
              "Anonymous";

            const fallbackUserInfo = {
              id: sessionId,
              baseUserId: baseUserId,
              name: baseName,
              email: accountInfo?.email || "anonymous@example.com",
              color: generateColor(),
              timestamp: Date.now(),
            };

            // Using fallback user info
            awareness.setLocalStateField("user", fallbackUserInfo);
          } catch (fallbackError) {
            console.error("Fallback user info also failed:", fallbackError);
            const timestamp = Date.now();
            const ultimateFallback = {
              id: `anonymous-${timestamp}-${Math.random().toString(36).substr(2, 5)}`,
              baseUserId: `anonymous-${timestamp}`,
              name: "Anonymous",
              email: "anonymous@example.com",
              color: generateColor(),
              timestamp: timestamp,
            };
            awareness.setLocalStateField("user", ultimateFallback);
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

    awareness.on("change", handleAwarenessChange);

    setDoc(yjsDoc);
    setProvider(wsProvider);

    // Cleanup
    return () => {
      if (awarenessTimeout) {
        clearTimeout(awarenessTimeout);
      }
      awareness?.off("change", handleAwarenessChange);

      // Clean disconnect
      try {
        wsProvider.disconnect();
        wsProvider.destroy();
      } catch (error) {
        console.warn("Error during WebSocket cleanup:", error);
      }

      try {
        yjsDoc.destroy();
      } catch (error) {
        console.warn("Error during Y.Doc cleanup:", error);
      }
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
      },
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
      if (
        clientId !== provider.awareness.clientID &&
        state.editLock?.nodeId === nodeId
      ) {
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
      if (
        clientId !== provider.awareness.clientID &&
        state.editLock?.nodeId === nodeId &&
        state.user
      ) {
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
    editLockMap.set("editorEnabled", enabled);
  };

  const getEditorEnabled = (): boolean => {
    if (!editLockMap) return true;
    return editLockMap.get("editorEnabled") ?? true;
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

  return <YjsContext.Provider value={value}>{children}</YjsContext.Provider>;
};

export const useYjs = () => {
  const context = useContext(YjsContext);
  if (!context) {
    console.error("useYjs must be used within YjsProvider");
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
export const updateUserSelection = (awareness: any, nodeIds: string[]) => {
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
