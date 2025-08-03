import React, { useState } from 'react';
import { useEditor } from '@craftjs/core';

export const Serialization: React.FC = () => {
  const { actions, query } = useEditor();
  const [jsonData, setJsonData] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<'export' | 'import'>('export');

  const handleExport = () => {
    const json = query.serialize();
    setJsonData(JSON.stringify(JSON.parse(json), null, 2));
    setMode('export');
    setShowModal(true);
  };

  const handleImport = () => {
    setJsonData('');
    setMode('import');
    setShowModal(true);
  };

  const handleSave = () => {
    if (mode === 'import' && jsonData) {
      try {
        const parsedData = JSON.parse(jsonData);
        actions.deserialize(JSON.stringify(parsedData));
        
        // Trigger Yjs sync after import
        const event = new CustomEvent('craft-data-imported', { 
          detail: { data: parsedData } 
        });
        document.dispatchEvent(event);
        
        setShowModal(false);
        setJsonData('');
        
        console.log('JSON 불러오기 완료 및 Yjs 동기화 트리거됨');
        alert('JSON 데이터를 성공적으로 불러왔습니다!');
      } catch (error) {
        console.error('JSON 파싱 오류:', error);
        alert('잘못된 JSON 형식입니다. 데이터를 확인해주세요.');
      }
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `craft-export-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setJsonData(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <>
      {/* Serialization Controls */}
      <div className="serialization-controls flex items-center gap-2">
        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
          title="현재 상태를 JSON으로 내보내기"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          내보내기
        </button>
        
        <button
          onClick={handleImport}
          className="px-3 py-1.5 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-md hover:bg-green-100 transition-colors"
          title="JSON에서 상태 불러오기"
        >
          <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
          </svg>
          불러오기
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {mode === 'export' ? 'JSON 내보내기' : 'JSON 불러오기'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 flex-1 overflow-hidden">
              {mode === 'export' ? (
                <div className="space-y-4">
                  <p className="text-sm text-gray-800">
                    현재 편집기 상태가 JSON 형식으로 내보내졌습니다. 복사하거나 다운로드하여 저장할 수 있습니다.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => navigator.clipboard.writeText(jsonData)}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-800 rounded hover:bg-gray-200"
                    >
                      클립보드에 복사
                    </button>
                    <button
                      onClick={handleDownload}
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      파일로 다운로드
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-800">
                    JSON 데이터를 입력하거나 파일을 업로드하여 편집기 상태를 복원할 수 있습니다.
                  </p>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      파일 업로드
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-800 mb-2">
                      또는 JSON 직접 입력
                    </label>
                  </div>
                </div>
              )}

              {/* JSON Editor */}
              <div className="mt-4">
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  readOnly={mode === 'export'}
                  className={`w-full h-96 p-3 border border-gray-300 rounded-md font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    mode === 'export' ? 'bg-gray-50' : 'bg-white'
                  }`}
                  placeholder={mode === 'import' ? '여기에 JSON 데이터를 붙여넣으세요...' : ''}
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              {mode === 'import' && (
                <button
                  onClick={handleSave}
                  disabled={!jsonData}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  적용하기
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};