"use client";

import React, { useState } from "react";
import { Editor, Frame, Element } from "@craftjs/core";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Craft components
import { Text } from "./Text";
import { Image } from "./Image";
import { Container } from "./Container";

// Toolbox and Toolbar
import { Toolbox } from "./Toolbox";
import { Toolbar } from "./Toolbar";
import { Layers } from "./Layers";

// Advanced Features
import { History } from "./History";
import { Serialization } from "./Serialization";
import { EventLogger, EventHandlers } from "./Events";
import { NodeValidator } from "./NodeManager";
// import { Viewport } from './Viewport';

// Utilities
import { CanvasController, CanvasStats } from "./utils/Canvas";
import { DragIndicator, GridLines } from "./utils/DragIndicator";
import {
  SnapGuides,
  StatusBar,
} from "./utils/EditorHelpers";

interface CraftEditorProps {
  onContentChange?: (content: string) => void;
  className?: string;
}

export const CraftEditor: React.FC<CraftEditorProps> = ({
  onContentChange,
  className = "",
}) => {
  const [enabled, setEnabled] = useState(true);
  const [showLayers, setShowLayers] = useState(false);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={`craft-editor-container ${className}`}>
        <Editor
          resolver={{
            Text,
            Image,
            Container,
          }}
          enabled={enabled}
          onNodesChange={(query) => {
            if (onContentChange) {
              const json = query.serialize();
              onContentChange(json);
            }
          }}
        >
          {/* Event Handlers */}
          <EventHandlers />

          {/* Header Controls */}
          <div className="craft-editor-header bg-white border-b border-gray-200 p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold text-gray-900">
                페이지 편집기
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEnabled(!enabled)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    enabled
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "bg-gray-100 text-gray-700 border border-gray-200"
                  }`}
                >
                  {enabled ? "편집 모드" : "미리보기 모드"}
                </button>
                <button
                  onClick={() => setShowLayers(!showLayers)}
                  className="px-3 py-1.5 text-sm font-medium rounded-md bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                >
                  레이어
                </button>

                {/* History Controls */}
                <History />

                {/* Serialization */}
                <Serialization />

                {/* Event Logger */}
                <EventLogger />

                {/* Node Validator */}
                <NodeValidator />
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Canvas Controls */}
              <CanvasController />

              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                임시저장
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors">
                발행하기
              </button>
            </div>
          </div>

          <div className="craft-editor-workspace flex h-[calc(100vh-80px)]">
            {/* Toolbox */}
            <div className="craft-toolbox w-64 bg-gray-50 border-r border-gray-200 overflow-y-auto">
              <Toolbox />
            </div>

            {/* Main Editor Area */}
            <div className="craft-canvas flex-1 relative bg-gray-100 overflow-hidden">
              {/* Grid Lines */}
              <GridLines enabled={enabled} spacing={20} />

              {/* Drag Indicator */}
              <DragIndicator />

              {/* Selection Box - 비활성화됨 (임시 위치 때문) */}
              {/* <SelectionBox /> */}

              {/* Hover Highlight - 비활성화됨 (임시 위치 때문) */}
              {/* <HoverHighlight /> */}

              {/* Snap Guides */}
              <SnapGuides enabled={enabled} />

              <div className="absolute inset-0 overflow-auto">
                <div className="min-h-full p-8">
                  <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm min-h-[800px] relative">
                    <Frame>
                      <Element
                        is={Container}
                        padding="40px"
                        minHeight={600}
                        background="white"
                        canvas
                      >
                        {/* Default content */}
                        <Element
                          is={Container}
                          padding="20px"
                          background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                          borderRadius={12}
                          canvas
                        >
                          <Element
                            is={Text}
                            text="새로운 웹사이트에 오신 것을 환영합니다"
                            fontSize={32}
                            fontWeight="bold"
                            color="white"
                            textAlign="center"
                            padding="20px"
                          />
                          <Element
                            is={Text}
                            text="드래그 앤 드롭 편집기로 아름다운 레이아웃을 만들어보세요"
                            fontSize={18}
                            color="rgba(255,255,255,0.9)"
                            textAlign="center"
                            padding="0 20px 20px"
                          />
                        </Element>

                        <Element
                          is={Container}
                          flexDirection="row"
                          gap={24}
                          padding="40px 20px"
                          canvas
                        >
                          <Element
                            is={Container}
                            background="white"
                            padding="24px"
                            borderRadius={8}
                            boxShadow="0 2px 4px rgba(0,0,0,0.1)"
                            canvas
                          >
                            <Element
                              is={Text}
                              text="기능 1"
                              fontSize={20}
                              fontWeight="bold"
                              color="#1f2937"
                              padding="0 0 12px 0"
                            />
                            <Element
                              is={Text}
                              text="여기에 기능 설명을 추가하세요"
                              fontSize={14}
                              color="#6b7280"
                            />
                          </Element>

                          <Element
                            is={Container}
                            background="white"
                            padding="24px"
                            borderRadius={8}
                            boxShadow="0 2px 4px rgba(0,0,0,0.1)"
                            canvas
                          >
                            <Element
                              is={Text}
                              text="기능 2"
                              fontSize={20}
                              fontWeight="bold"
                              color="#1f2937"
                              padding="0 0 12px 0"
                            />
                            <Element
                              is={Text}
                              text="여기에 기능 설명을 추가하세요"
                              fontSize={14}
                              color="#6b7280"
                            />
                          </Element>
                        </Element>
                      </Element>
                    </Frame>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="craft-properties w-80 bg-white border-l border-gray-200 overflow-y-auto">
              <Toolbar />
            </div>

            {/* Layers Panel (Overlay) */}
            {showLayers && (
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-xl w-96 max-h-[80vh] overflow-hidden">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="text-lg font-semibold">레이어</h3>
                    <button
                      onClick={() => setShowLayers(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="p-4 max-h-96 overflow-y-auto">
                    <Layers />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Canvas Stats */}
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <CanvasStats />
          </div>

          {/* Status Bar */}
          <StatusBar />
        </Editor>
      </div>
    </DndProvider>
  );
};
