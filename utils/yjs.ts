import * as Y from 'yjs';
import { WebrtcProvider } from 'y-webrtc';

export const createYjsDocument = (roomName: string) => {
  const doc = new Y.Doc();
  const provider = new WebrtcProvider(roomName, doc);

  // 현재 사용자의 상태 설정
  const awareness = provider.awareness;
  awareness.setLocalState({
    user: {
      name: `사용자${Math.floor(Math.random() * 1000)}`,
      color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      id: Math.random().toString(36).substr(2, 9),
    },
    selection: {
      sectionKey: null,
      itemKey: null,
    },
  });

  return { doc, provider, awareness };
};

export const updateUserSelection = (awareness: any, sectionKey: string | null, itemKey: string | null) => {
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

export const cleanupYjsProvider = (provider: WebrtcProvider) => {
  provider.destroy();
};
