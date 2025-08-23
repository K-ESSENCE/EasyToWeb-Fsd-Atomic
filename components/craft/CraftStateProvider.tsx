'use client';

import React, { useEffect } from 'react';
import { useEditor } from '@craftjs/core';

/**
 * Craft.js 상태를 외부 컴포넌트(PublishModal 등)에서 접근할 수 있도록 하는 Provider
 */
export const CraftStateProvider: React.FC = () => {
  const { query } = useEditor();

  useEffect(() => {
    const handleGetState = () => {
      console.log('CraftStateProvider: 상태 요청 받음');
      try {
        const currentState = query.serialize();
        console.log('CraftStateProvider: 상태 직렬화 완료:', currentState.substring(0, 100) + '...');
        
        // Craft.js 형식 검증
        const parsed = JSON.parse(currentState);
        if (parsed.ROOT && parsed.ROOT.type) {
          console.log('CraftStateProvider: 올바른 Craft.js 형식 확인됨');
          const responseEvent = new CustomEvent('craft-state-response', {
            detail: currentState
          });
          document.dispatchEvent(responseEvent);
        } else {
          console.error('CraftStateProvider: 올바르지 않은 Craft.js 형식:', parsed);
          const responseEvent = new CustomEvent('craft-state-response', {
            detail: null
          });
          document.dispatchEvent(responseEvent);
        }
      } catch (error) {
        console.error('CraftStateProvider: Craft.js 상태 가져오기 실패:', error);
        // 빈 상태 전송
        const responseEvent = new CustomEvent('craft-state-response', {
          detail: null
        });
        document.dispatchEvent(responseEvent);
      }
    };

    // 텍스트/이미지 변경 이벤트 로깅 (협업 동기화용)
    const handleTextChanged = (event: CustomEvent) => {
      console.log('CraftStateProvider: 텍스트 변경 감지:', {
        nodeId: event.detail?.nodeId,
        text: event.detail?.text?.substring(0, 50) + '...',
        timestamp: event.detail?.timestamp
      });
    };

    const handleImageChanged = (event: CustomEvent) => {
      console.log('CraftStateProvider: 이미지 변경 감지:', {
        nodeId: event.detail?.nodeId,
        src: event.detail?.src,
        fileId: event.detail?.fileId,
        timestamp: event.detail?.timestamp
      });
    };

    console.log('CraftStateProvider: 이벤트 리스너 등록됨');
    // 상태 요청 이벤트 리스너 등록
    document.addEventListener('craft-get-state', handleGetState);
    document.addEventListener('craft-text-changed', handleTextChanged as EventListener);
    document.addEventListener('craft-image-changed', handleImageChanged as EventListener);

    return () => {
      console.log('CraftStateProvider: 이벤트 리스너 제거됨');
      document.removeEventListener('craft-get-state', handleGetState);
      document.removeEventListener('craft-text-changed', handleTextChanged as EventListener);
      document.removeEventListener('craft-image-changed', handleImageChanged as EventListener);
    };
  }, [query]);

  // 이 컴포넌트는 UI를 렌더링하지 않음 (헬퍼 컴포넌트)
  return null;
};

export default CraftStateProvider;