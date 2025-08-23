'use client';

import React, { useState, useEffect } from 'react';

interface PublishEnhancementsProps {
  onShare?: () => void;
  onPrint?: () => void;
  url?: string;
}

// Share functionality component
export const ShareButtons: React.FC<{ url: string }> = ({ url }) => {
  const [copied, setCopied] = useState(false);
  const [shareData, setShareData] = useState({
    title: '',
    text: '',
    url: ''
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined' && typeof document !== 'undefined') {
      setShareData({
        title: document.title || 'EasyToWeb으로 만든 페이지',
        text: document.querySelector('meta[name="description"]')?.getAttribute('content') || '멋진 웹페이지를 확인해보세요!',
        url: window.location.href
      });
    }
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleNativeShare = async () => {
    if (isClient && typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Share failed:', err);
      }
    }
  };

  const socialShareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`,
    kakaotalk: `https://story.kakao.com/share?url=${encodeURIComponent(shareData.url)}`
  };

  return (
    <div className="flex flex-wrap gap-2">
      {/* Native Share (if supported) */}
      {isClient && typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
          </svg>
          공유
        </button>
      )}

      {/* Copy Link */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
          copied 
            ? 'bg-green-100 border-green-300 text-green-700' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={copied ? "M5 13l4 4L19 7" : "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"} />
        </svg>
        {copied ? '복사됨!' : '링크 복사'}
      </button>

      {/* Social Share Buttons */}
      <div className="flex gap-2">
        <a
          href={socialShareLinks.twitter}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
          title="Twitter에 공유"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
          </svg>
        </a>

        <a
          href={socialShareLinks.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          title="Facebook에 공유"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <a
          href={socialShareLinks.kakaotalk}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 bg-yellow-400 text-yellow-900 rounded-lg hover:bg-yellow-500 transition-colors"
          title="카카오톡에 공유"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 .134.333l2.335 2.26a.472.472 0 0 0 .656-.678l-1.067-1.033z"/>
          </svg>
        </a>
      </div>
    </div>
  );
};

// Print functionality
export const PrintButton: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      인쇄
    </button>
  );
};

// Full screen toggle
export const FullscreenButton: React.FC = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (typeof document !== 'undefined') {
        setIsFullscreen(!!document.fullscreenElement);
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('fullscreenchange', handleFullscreenChange);
      return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (typeof document !== 'undefined') {
        if (!document.fullscreenElement) {
          await document.documentElement.requestFullscreen();
        } else {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
      title={isFullscreen ? '전체화면 종료' : '전체화면'}
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
          isFullscreen 
            ? "M9 9V4a1 1 0 00-1-1H4a1 1 0 00-1 1v4a1 1 0 001 1h4zm6 0h4a1 1 0 001-1V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4a1 1 0 001 1zm-6 6v4a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1H9a1 1 0 00-1 1zm6 0a1 1 0 001 1h4a1 1 0 001-1v-4a1 1 0 00-1-1h-4a1 1 0 00-1 1v4z"
            : "M3 7a1 1 0 011-1h2a1 1 0 010 2H5v1a1 1 0 01-2 0V7zM21 7a1 1 0 00-1-1h-2a1 1 0 100 2h1v1a1 1 0 102 0V7zM3 17a1 1 0 001 1v1h1a1 1 0 100 2H4a1 1 0 01-1-1v-2a1 1 0 00-1-1zM21 17a1 1 0 00-1 1v1h-1a1 1 0 100 2h2a1 1 0 001-1v-2a1 1 0 00-1-1z"
        } />
      </svg>
      {isFullscreen ? '종료' : '전체화면'}
    </button>
  );
};

// Font size controls
export const FontSizeControls: React.FC = () => {
  const [fontSize, setFontSize] = useState(16);

  const adjustFontSize = (delta: number) => {
    const newSize = Math.max(12, Math.min(24, fontSize + delta));
    setFontSize(newSize);
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  const resetFontSize = () => {
    setFontSize(16);
    if (typeof document !== 'undefined') {
      document.documentElement.style.fontSize = '';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg">
      <button
        onClick={() => adjustFontSize(-2)}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
        title="글자 크기 줄이기"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </button>
      
      <span className="text-sm font-medium min-w-[3rem] text-center">
        {fontSize}px
      </span>
      
      <button
        onClick={() => adjustFontSize(2)}
        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded"
        title="글자 크기 키우기"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
      
      <button
        onClick={resetFontSize}
        className="text-xs px-2 py-1 hover:bg-gray-100 rounded"
        title="기본 크기로 재설정"
      >
        초기화
      </button>
    </div>
  );
};

// Main enhancements component
export const PublishEnhancements: React.FC<PublishEnhancementsProps> = ({ 
  onShare, 
  onPrint, 
  url = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  return (
    <>
      {/* Floating Action Menu */}
      <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${isScrolled ? 'opacity-100' : 'opacity-75'}`}>
        {/* Enhancement Panel */}
        <div className={`
          mb-4 bg-white rounded-xl shadow-xl border border-gray-200 transition-all duration-300 transform origin-bottom-right
          ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}
        `}>
          <div className="p-4 space-y-4">
            <div className="text-sm font-semibold text-gray-700 border-b border-gray-200 pb-2">
              페이지 도구
            </div>
            
            {/* Share Section */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500">공유</div>
              <ShareButtons url={url} />
            </div>

            {/* Tools Section */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500">도구</div>
              <div className="flex flex-wrap gap-2">
                <PrintButton />
                <FullscreenButton />
              </div>
            </div>

            {/* Accessibility Section */}
            <div className="space-y-2">
              <div className="text-xs font-medium text-gray-500">접근성</div>
              <FontSizeControls />
            </div>
          </div>
        </div>

        {/* Toggle Button */}
        <button
          onClick={toggleVisibility}
          className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center"
          title="페이지 도구"
        >
          <svg 
            className={`w-6 h-6 transition-transform duration-300 ${isVisible ? 'rotate-45' : ''}`}
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </button>
      </div>

      {/* Keyboard Shortcuts Help */}
      <div className="fixed bottom-6 left-6 z-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/80 text-white text-xs p-3 rounded-lg backdrop-blur-sm">
          <div className="font-semibold mb-2">키보드 단축키</div>
          <div className="space-y-1 text-xs">
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+P</kbd> 인쇄</div>
            <div><kbd className="bg-gray-700 px-1 rounded">F11</kbd> 전체화면</div>
            <div><kbd className="bg-gray-700 px-1 rounded">Ctrl+0</kbd> 확대/축소 초기화</div>
          </div>
        </div>
      </div>

      {/* Overlay for closing panel */}
      {isVisible && (
        <div
          className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm"
          onClick={() => setIsVisible(false)}
        />
      )}
    </>
  );
};

export default PublishEnhancements;