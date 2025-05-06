import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { Awareness } from "y-protocols/awareness";

interface YjsConfig {
  roomName: string;
  accessToken: string;
  user: {
    id: string;
    name: string;
    color: string;
  };
}

export const createYjsDocument = ({
  roomName,
  accessToken,
  user,
}: YjsConfig) => {
  const doc = new Y.Doc();

  const provider = new WebsocketProvider(
    "wss://dev-api.easytoweb.store",
    "layout-modal-room",
    doc,
    {
      params: {
        roomName: roomName,
      },
      protocols: [`Authorization_${accessToken}`],
    }
  );

  // Handle WebSocket errors
  provider.on("connection-error", (event: Event) => {
    console.error("WebSocket connection error:", event);
    // Handle specific error codes
    const error = event as unknown as {
      code: number;
      message: string;
      errorFieldName?: string;
    };

    switch (error.code) {
      case 1002:
        console.error("Resource not found");
        break;
      case 1003:
        console.error("Invalid input value:", error.errorFieldName);
        break;
      case 1008:
        if (error.message === "PROJECT_NOT_FOUND") {
          console.error("Project not found");
        } else if (error.message === "USER_NOT_LOGIN") {
          console.error("User not logged in");
        } else if (error.message === "ACCESS_DENIED") {
          console.error("Access denied");
        }
        break;
      case 1011:
        console.error("Internal server error");
        break;
      case 4401:
        console.error("Access token expired");
        break;
      default:
        console.error("Unknown error:", error);
    }
  });

  // Set up awareness for user presence
  const awareness = provider.awareness;
  awareness.setLocalState({
    user: {
      id: user.id,
      name: user.name,
      color: user.color,
    },
    selection: {
      sectionKey: null,
      itemKey: null,
    },
  });

  return { doc, provider, awareness };
};

export const updateUserSelection = (
  awareness: Awareness,
  sectionKey: string | null,
  itemKey: string | null
) => {
  const currentState = awareness.getLocalState();
  if (currentState) {
    awareness.setLocalState({
      ...currentState,
      selection: {
        sectionKey,
        itemKey,
      },
    });
  }
};

export const cleanupYjsProvider = (provider: WebsocketProvider) => {
  provider.awareness.setLocalState(null);
  provider.destroy();
};
