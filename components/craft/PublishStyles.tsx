'use client';

import React from 'react';

interface PublishStylesProps {
  isPreview?: boolean;
}

export const PublishStyles: React.FC<PublishStylesProps> = ({ isPreview = false }) => {
  return (
    <style jsx global>{`
      /* Published content base styles */
      .craft-publish-viewer {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans KR', sans-serif;
        line-height: 1.6;
        color: #1f2937;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Craft.js component styles inheritance */
      .craft-publish-viewer .craft-text {
        word-wrap: break-word;
        overflow-wrap: break-word;
        hyphens: auto;
      }

      .craft-publish-viewer .craft-image {
        max-width: 100%;
        height: auto;
        display: block;
      }

      .craft-publish-viewer .craft-container {
        position: relative;
        width: 100%;
      }

      /* Responsive typography */
      @media (max-width: 640px) {
        .craft-publish-viewer {
          font-size: 14px;
          line-height: 1.5;
        }
        
        .craft-publish-viewer h1 {
          font-size: 1.875rem;
          line-height: 1.2;
        }
        
        .craft-publish-viewer h2 {
          font-size: 1.5rem;
          line-height: 1.3;
        }
        
        .craft-publish-viewer h3 {
          font-size: 1.25rem;
          line-height: 1.4;
        }
        
        .craft-publish-viewer p {
          margin-bottom: 1rem;
        }
      }

      @media (min-width: 641px) and (max-width: 1024px) {
        .craft-publish-viewer {
          font-size: 15px;
          line-height: 1.6;
        }
        
        .craft-publish-viewer h1 {
          font-size: 2.25rem;
          line-height: 1.2;
        }
        
        .craft-publish-viewer h2 {
          font-size: 1.875rem;
          line-height: 1.3;
        }
        
        .craft-publish-viewer h3 {
          font-size: 1.5rem;
          line-height: 1.4;
        }
      }

      @media (min-width: 1025px) {
        .craft-publish-viewer {
          font-size: 16px;
          line-height: 1.7;
        }
        
        .craft-publish-viewer h1 {
          font-size: 2.5rem;
          line-height: 1.2;
        }
        
        .craft-publish-viewer h2 {
          font-size: 2rem;
          line-height: 1.3;
        }
        
        .craft-publish-viewer h3 {
          font-size: 1.75rem;
          line-height: 1.4;
        }
      }

      /* Enhanced interactive elements */
      .craft-publish-viewer a {
        color: #3b82f6;
        text-decoration: underline;
        text-underline-offset: 2px;
        transition: color 0.2s ease-in-out;
      }

      .craft-publish-viewer a:hover {
        color: #1d4ed8;
        text-decoration-thickness: 2px;
      }

      .craft-publish-viewer button {
        cursor: pointer;
        transition: all 0.2s ease-in-out;
        border: none;
        outline: none;
        border-radius: 8px;
        font-weight: 500;
      }

      .craft-publish-viewer button:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
      }

      .craft-publish-viewer button:active {
        transform: translateY(0);
      }

      /* Form elements styling */
      .craft-publish-viewer input,
      .craft-publish-viewer textarea,
      .craft-publish-viewer select {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: inherit;
        font-family: inherit;
        transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        background: white;
      }

      .craft-publish-viewer input:focus,
      .craft-publish-viewer textarea:focus,
      .craft-publish-viewer select:focus {
        outline: none;
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }

      /* Enhanced card/container styles */
      .craft-publish-viewer [class*="card"],
      .craft-publish-viewer [class*="container"] {
        background: white;
        border-radius: 12px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        transition: box-shadow 0.3s ease-in-out, transform 0.2s ease-in-out;
      }

      .craft-publish-viewer [class*="card"]:hover,
      .craft-publish-viewer [class*="container"]:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      /* Image optimization and effects */
      .craft-publish-viewer img {
        border-radius: 8px;
        transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
        width: 100%;
        height: auto;
      }

      .craft-publish-viewer img:hover {
        transform: scale(1.02);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
      }

      /* Loading states */
      .craft-publish-viewer .loading {
        opacity: 0.6;
        pointer-events: none;
      }

      .craft-publish-viewer .loading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 20px;
        height: 20px;
        margin: -10px 0 0 -10px;
        border: 2px solid #3b82f6;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Error states */
      .craft-publish-viewer .error {
        border: 2px solid #ef4444;
        background: #fef2f2;
        color: #dc2626;
        border-radius: 8px;
        padding: 16px;
      }

      /* Success states */
      .craft-publish-viewer .success {
        border: 2px solid #10b981;
        background: #f0fdf4;
        color: #059669;
        border-radius: 8px;
        padding: 16px;
      }

      /* Accessibility improvements */
      .craft-publish-viewer :focus-visible {
        outline: 2px solid #3b82f6;
        outline-offset: 2px;
      }

      .craft-publish-viewer [role="button"] {
        cursor: pointer;
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        .craft-publish-viewer {
          filter: contrast(1.2);
        }
        
        .craft-publish-viewer a {
          text-decoration-thickness: 2px;
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        .craft-publish-viewer {
          color: #f9fafb;
          background: #111827;
        }
        
        .craft-publish-viewer a {
          color: #60a5fa;
        }
        
        .craft-publish-viewer input,
        .craft-publish-viewer textarea,
        .craft-publish-viewer select {
          background: #1f2937;
          border-color: #374151;
          color: #f9fafb;
        }
        
        .craft-publish-viewer [class*="card"],
        .craft-publish-viewer [class*="container"] {
          background: #1f2937;
          border: 1px solid #374151;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        .craft-publish-viewer * {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }

      /* Print styles */
      @media print {
        .craft-publish-viewer {
          background: white !important;
          color: black !important;
        }
        
        .craft-publish-viewer a {
          color: black !important;
          text-decoration: underline !important;
        }
        
        .craft-publish-viewer [class*="shadow"] {
          box-shadow: none !important;
        }
        
        .craft-publish-viewer .no-print {
          display: none !important;
        }
        
        .craft-publish-viewer .print-break {
          page-break-after: always;
        }
      }

      /* Custom scroll bar */
      .craft-publish-viewer::-webkit-scrollbar {
        width: 8px;
      }

      .craft-publish-viewer::-webkit-scrollbar-track {
        background: #f1f5f9;
      }

      .craft-publish-viewer::-webkit-scrollbar-thumb {
        background: #cbd5e1;
        border-radius: 4px;
      }

      .craft-publish-viewer::-webkit-scrollbar-thumb:hover {
        background: #94a3b8;
      }

      /* Performance optimizations */
      .craft-publish-viewer {
        contain: layout style paint;
        content-visibility: auto;
      }

      .craft-publish-viewer img {
        content-visibility: auto;
        contain-intrinsic-size: 0 200px;
      }

      /* Preview mode styles */
      ${isPreview ? `
        .craft-publish-viewer {
          border: 2px dashed #cbd5e1;
          background: #f8fafc;
          position: relative;
        }
        
        .craft-publish-viewer::before {
          content: '미리보기 모드';
          position: absolute;
          top: 10px;
          right: 10px;
          background: #3b82f6;
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          z-index: 1000;
        }
      ` : ''}

      /* Animation classes for smooth loading */
      .fade-in {
        animation: fadeIn 0.5s ease-in-out;
      }

      .slide-up {
        animation: slideUp 0.6s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideUp {
        from {
          opacity: 0;
          transform: translateY(30px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Utility classes for published content */
      .craft-publish-viewer .text-center {
        text-align: center;
      }

      .craft-publish-viewer .text-left {
        text-align: left;
      }

      .craft-publish-viewer .text-right {
        text-align: right;
      }

      .craft-publish-viewer .font-bold {
        font-weight: 700;
      }

      .craft-publish-viewer .font-semibold {
        font-weight: 600;
      }

      .craft-publish-viewer .font-medium {
        font-weight: 500;
      }

      .craft-publish-viewer .italic {
        font-style: italic;
      }

      .craft-publish-viewer .underline {
        text-decoration: underline;
        text-underline-offset: 2px;
      }
    `}</style>
  );
};

export default PublishStyles;