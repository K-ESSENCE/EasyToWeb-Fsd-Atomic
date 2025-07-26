"use client";

import React, {useEffect, useState} from "react";
import apiHandler from "../../../shared/api/axios";
import LayoutViewer from "../../../components/LayoutViewer";
import CenteredStatus from "../../../components/CenteredStatus";
import {LayoutState} from "../../../store/slices/editor";
import { PublishViewer } from "../../../components/craft/PublishViewer";

function isAxiosErrorWithResponse(err: unknown): err is {
  response: { data?: { errors?: { errorDescription?: string } } };
  message?: string;
} {
  return typeof err === "object" && err !== null && "response" in err;
}

export default function ProjectPage({
  params,
}: {
  params: Promise<{ url: string }>;
}) {
  const { url } = React.use(params);
  const [content, setContent] = useState<LayoutState | null>(null);
  const [craftContent, setCraftContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [useCraftViewer, setUseCraftViewer] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setContent(null);
    apiHandler
      .getPublishedProject(url)
      .then((res) => {
        if (res.data?.content) {
          console.log(res.data.content);
          const contentData = res.data.content;
          
          // Check if content is Craft.js format (JSON string containing nodes)
          try {
            const parsedContent = JSON.parse(contentData);
            if (parsedContent.ROOT && parsedContent.ROOT.type) {
              // This is Craft.js format
              setCraftContent(contentData);
              setUseCraftViewer(true);
            } else {
              // This is legacy format
              setContent(parsedContent);
              setUseCraftViewer(false);
            }
          } catch (e) {
            // If it's not valid JSON, treat as legacy
            setContent(JSON.parse(contentData));
            setUseCraftViewer(false);
          }
        }
        if (res?.data?.content === null) {
          setError("게시된 내용을 찾을 수 없습니다.");
        }
      })
      .catch((err) => {
        let msg = "게시된 프로젝트를 불러오지 못했습니다.";
        if (isAxiosErrorWithResponse(err)) {
          const responseData = err.response?.data;
          const errorDesc =
            responseData &&
            responseData.errors &&
            responseData.errors.errorDescription;
          if (errorDesc) msg = errorDesc;
          else if ("message" in err && typeof err.message === "string")
            msg = err.message;
        } else if (err instanceof Error) {
          msg = err.message;
        }
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, [url]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 relative overflow-hidden">
        {/* Animated Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
        </div>
        <CenteredStatus type="loading" message="로딩 중입니다..." />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50 relative overflow-hidden">
        {/* Error State Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse"></div>
          <div className="absolute bottom-1/4 left-1/4 w-60 h-60 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-25 animate-pulse animation-delay-2000"></div>
        </div>
        <CenteredStatus type="error" message={error} />
      </div>
    );
  }
  
  if (!content && !craftContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden">
        {/* Empty State Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-slate-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-3000"></div>
        </div>
        <CenteredStatus type="empty" message="없는 페이지입니다." />
      </div>
    );
  }

  // Use Craft.js viewer if available, otherwise fall back to legacy viewer
  if (useCraftViewer && craftContent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 relative">
        {/* Modern Header for Craft.js content */}
        <header 
          className={`
            fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
            ${isScrolled 
              ? 'bg-white/90 backdrop-blur-xl shadow-xl border-b border-gray-200/50' 
              : 'bg-transparent'
            }
          `}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg font-bold">E</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EasyToWeb
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                  Craft.js로 제작됨
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Craft.js Content */}
        <main className="pt-16">
          <PublishViewer content={craftContent} className="min-h-screen" />
        </main>

        {/* Floating Action Button */}
        {isScrolled && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
            aria-label="맨 위로 이동"
          >
            <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Legacy viewer for backward compatibility
  if (!content) return null;
  
  const hasBackgroundColor = content.layoutStyle?.backgroundColor;
  const defaultGradient = "from-indigo-50 via-white to-purple-50";

  return (
    <div className="min-h-screen relative">
      {/* Dynamic Background */}
      <div 
        className={`
          fixed inset-0 transition-all duration-700 ease-in-out
          ${hasBackgroundColor 
            ? '' 
            : `bg-gradient-to-br ${defaultGradient}`
          }
        `}
        style={{
          backgroundColor: hasBackgroundColor ? content.layoutStyle?.backgroundColor : undefined,
        }}
      />
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-4000" />
      </div>

      {/* Floating Header */}
      <header 
        className={`
          fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out
          ${isScrolled 
            ? 'bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
            : 'bg-transparent'
          }
        `}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">E</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">EasyToWeb</span>
            </div>
            <div className="text-sm text-gray-500">
              발행된 프로젝트
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        <div className="max-w-7xl mx-auto">
          {/* Content Container with Glass Effect */}
          <div className="mx-4 sm:mx-6 lg:mx-8 my-8">
            <div 
              className={`
                relative overflow-hidden transition-all duration-500 ease-in-out
                ${hasBackgroundColor 
                  ? 'bg-transparent' 
                  : 'bg-white/60 backdrop-blur-sm border border-white/20 shadow-xl'
                }
                rounded-2xl
              `}
            >
              {/* Subtle Inner Glow */}
              {!hasBackgroundColor && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-white/20 pointer-events-none" />
              )}
              
              {/* Layout Viewer Container */}
              <div className="relative">
                <LayoutViewer layouts={[content]} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Button for Scroll to Top */}
      {isScrolled && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-blue-300/50"
          aria-label="맨 위로 이동"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </div>
  );
}
