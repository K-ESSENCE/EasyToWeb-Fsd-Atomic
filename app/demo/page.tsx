'use client';

import React from 'react';
import { CraftEditor } from '../../components/craft/Editor';

export default function DemoPage() {
  const handleContentChange = (content: string) => {
    console.log('Demo content changed:', content);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900">
            Craft.js 데모 - 모던 드래그 앤 드롭 편집기
          </h1>
          <p className="text-gray-600 mt-2">
            직관적이고 아름다운 드래그 앤 드롭 웹 페이지 편집기를 체험해보세요.
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <CraftEditor
            onContentChange={handleContentChange}
            className="min-h-[800px]"
          />
        </div>
      </div>
    </div>
  );
}