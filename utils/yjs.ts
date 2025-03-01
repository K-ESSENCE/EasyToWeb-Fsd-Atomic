import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";

export function createYjsDocument(roomName: string) {
  const doc = new Y.Doc();

  // WebRTC 프로바이더 설정
  const provider = new WebrtcProvider(roomName, doc, {
    signaling: ["wss://signaling.yjs.dev"], // 기본 시그널링 서버
  });

  return { doc, provider };
}

export function cleanupYjsProvider(provider: WebrtcProvider) {
  provider.disconnect();
  provider.destroy();
}
