"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Editor, Frame } from "@craftjs/core";
import { Text } from "./Text";
import { Image } from "./Image";
import { Container } from "./Container";
import PublishStyles from "./PublishStyles";
import PublishEnhancements from "./PublishEnhancements";

interface PublishViewerProps {
  content: string;
  className?: string;
}

interface ViewportSize {
  width: number;
  height: number;
}

// Loading component for smooth transitions
const PublishViewerLoading: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-lg">콘텐츠를 불러오는 중...</p>
    </div>
  </div>
);

// Error component for failed loads
const PublishViewerError: React.FC<{ error: string; onRetry?: () => void }> = ({
  error,
  onRetry,
}) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-red-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        콘텐츠를 불러올 수 없습니다
      </h2>
      <p className="text-gray-600 mb-4">{error}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          다시 시도
        </button>
      )}
    </div>
  </div>
);

// Empty state component
const PublishViewerEmpty: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-slate-50 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg
          className="w-8 h-8 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-gray-900 mb-2">빈 페이지</h2>
      <p className="text-gray-600">표시할 콘텐츠가 없습니다.</p>
    </div>
  </div>
);

// Performance monitoring component
const usePerformanceMetrics = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    renderTime: 0,
    isPerformanceSupported: false,
  });

  useEffect(() => {
    if (typeof window !== "undefined" && "performance" in window) {
      setMetrics((prev) => ({ ...prev, isPerformanceSupported: true }));

      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === "navigation") {
            const navigationEntry = entry as PerformanceNavigationTiming;
            setMetrics((prev) => ({
              ...prev,
              loadTime:
                navigationEntry.loadEventEnd - navigationEntry.loadEventStart,
            }));
          }
        }
      });

      try {
        observer.observe({ entryTypes: ["navigation"] });
      } catch (e) {
        console.warn("PerformanceObserver not supported");
      }

      return () => observer.disconnect();
    }
  }, []);

  return metrics;
};

// Responsive utilities for published content
const useResponsiveLayout = () => {
  const [viewport, setViewport] = useState<ViewportSize>({
    width: 1200,
    height: 800,
  });
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setViewport({ width, height });
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
    };

    if (typeof window !== "undefined") {
      updateViewport();
      window.addEventListener("resize", updateViewport);
      return () => window.removeEventListener("resize", updateViewport);
    }
  }, []);

  return { viewport, isMobile, isTablet };
};

// SEO and metadata component
const PublishViewerHead: React.FC<{ title?: string; description?: string }> = ({
  title,
  description,
}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    if (description) {
      const metaDescription = document.querySelector(
        'meta[name="description"]'
      );
      if (metaDescription) {
        metaDescription.setAttribute("content", description);
      } else {
        const meta = document.createElement("meta");
        meta.name = "description";
        meta.content = description;
        document.head.appendChild(meta);
      }
    }

    // Add Open Graph meta tags
    const addOGMeta = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    if (title) addOGMeta("og:title", title);
    if (description) addOGMeta("og:description", description);
    addOGMeta("og:type", "website");
  }, [title, description]);

  return null;
};

// Content analyzer for extracting metadata
const analyzeContent = (
  contentData: string
): {
  title?: string;
  description?: string;
  hasImages: boolean;
  elementCount: number;
} => {
  try {
    const data = JSON.parse(contentData);
    let title: string | undefined;
    let description: string | undefined;
    let hasImages = false;
    let elementCount = 0;

    const traverse = (nodes: any) => {
      if (!nodes) return;

      Object.values(nodes).forEach((node: any) => {
        elementCount++;

        if (node.type?.resolvedName === "Text" && node.props?.text) {
          const text = node.props.text as string;
          if (!title && text.length > 10 && text.length < 100) {
            title = text;
          } else if (!description && text.length > 20 && text.length < 200) {
            description = text;
          }
        }

        if (node.type?.resolvedName === "Image") {
          hasImages = true;
        }
      });
    };

    traverse(data);

    return {
      title: title?.substring(0, 60),
      description: description?.substring(0, 160),
      hasImages,
      elementCount,
    };
  } catch (e) {
    return { hasImages: false, elementCount: 0 };
  }
};

export const PublishViewer: React.FC<PublishViewerProps> = ({
  content,
  className = "",
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [contentAnalysis, setContentAnalysis] = useState<ReturnType<
    typeof analyzeContent
  > | null>(null);

  const { viewport, isMobile, isTablet } = useResponsiveLayout();
  const performanceMetrics = usePerformanceMetrics();

  // Validate and process content
  const validateContent = useCallback((contentData: string): boolean => {
    if (!contentData || contentData.trim() === "") {
      setError("콘텐츠가 비어있습니다.");
      return false;
    }

    try {
      const parsed = JSON.parse(contentData);
      if (!parsed || typeof parsed !== "object") {
        setError("잘못된 콘텐츠 형식입니다.");
        return false;
      }
      return true;
    } catch (e) {
      setError("콘텐츠를 파싱할 수 없습니다.");
      return false;
    }
  }, []);

  // Initialize content analysis and validation
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      if (validateContent(content)) {
        const analysis = analyzeContent(content);
        setContentAnalysis(analysis);
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    }, 300); // Small delay for smooth UX

    return () => clearTimeout(timer);
  }, [content, validateContent, retryCount]);

  // Retry mechanism
  const handleRetry = useCallback(() => {
    setRetryCount((prev) => prev + 1);
  }, []);

  // Performance monitoring
  useEffect(() => {
    if (!isLoading && performanceMetrics.isPerformanceSupported) {
      console.log("PublishViewer Performance:", {
        loadTime: performanceMetrics.loadTime,
        viewport,
        contentAnalysis,
        elementCount: contentAnalysis?.elementCount || 0,
      });
    }
  }, [isLoading, performanceMetrics, viewport, contentAnalysis]);

  if (isLoading) {
    return <PublishViewerLoading />;
  }

  if (error) {
    return <PublishViewerError error={error} onRetry={handleRetry} />;
  }

  if (!content || content.trim() === "") {
    return <PublishViewerEmpty />;
  }

  const containerClasses = `
    craft-publish-viewer 
    ${className} 
    ${isMobile ? "mobile-layout" : ""} 
    ${isTablet ? "tablet-layout" : ""}
    transition-all duration-300 ease-in-out
  `;

  return (
    <>
      <PublishViewerHead
        title={contentAnalysis?.title}
        description={contentAnalysis?.description}
      />
      <PublishStyles />

      <div className={containerClasses}>
        <Editor
          resolver={{
            Text,
            Image,
            Container,
          }}
          enabled={false} // Always disabled for published view
        >
          <Frame data={content}>
            <div
              className={`
                min-h-screen 
                ${isMobile ? "px-2" : isTablet ? "px-4" : "px-0"}
                transition-all duration-300 ease-in-out
              `}
            >
              {/* Content will be rendered here from the serialized Craft.js data */}
            </div>
          </Frame>
        </Editor>

        {/* Performance info for development */}
        {process.env.NODE_ENV === "development" && contentAnalysis && (
          <div className="fixed bottom-4 left-4 bg-black/80 text-white text-xs p-2 rounded z-50">
            <div>Elements: {contentAnalysis.elementCount}</div>
            <div>
              Viewport: {viewport.width}×{viewport.height}
            </div>
            <div>
              Device: {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}
            </div>
            {contentAnalysis.hasImages && <div>Images: Yes</div>}
          </div>
        )}

        {/* <PublishEnhancements
          url={typeof window !== "undefined" ? window.location.href : ""}
        /> */}

        {/* Print styles */}
        <style jsx>{`
          @media print {
            .craft-publish-viewer {
              background: white !important;
            }

            .fixed,
            .sticky {
              position: static !important;
            }
          }

          .mobile-layout .craft-publish-viewer {
            font-size: 14px;
            line-height: 1.5;
          }

          .tablet-layout .craft-publish-viewer {
            font-size: 15px;
            line-height: 1.6;
          }

          @media (max-width: 767px) {
            .craft-publish-viewer {
              min-width: 100vw;
            }
          }

          @media (min-width: 768px) and (max-width: 1023px) {
            .craft-publish-viewer {
              max-width: 100%;
            }
          }

          /* Smooth scrolling for published content */
          .craft-publish-viewer {
            scroll-behavior: smooth;
          }

          /* High contrast mode support */
          @media (prefers-contrast: high) {
            .craft-publish-viewer {
              filter: contrast(1.2);
            }
          }

          /* Reduced motion support */
          @media (prefers-reduced-motion: reduce) {
            .craft-publish-viewer,
            .craft-publish-viewer * {
              animation-duration: 0.01ms !important;
              animation-iteration-count: 1 !important;
              transition-duration: 0.01ms !important;
            }
          }
        `}</style>
      </div>
    </>
  );
};
