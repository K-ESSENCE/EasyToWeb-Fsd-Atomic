'use client';

import React from 'react';
import { Editor, Frame } from '@craftjs/core';
import { Text } from './Text';
import { Image } from './Image';
import { Container } from './Container';

interface PublishViewerProps {
  content: string;
  className?: string;
}

export const PublishViewer: React.FC<PublishViewerProps> = ({
  content,
  className = ''
}) => {
  return (
    <div className={`craft-publish-viewer ${className}`}>
      <Editor
        resolver={{
          Text,
          Image,
          Container
        }}
        enabled={false} // Disable editing for published view
      >
        <Frame data={content}>
          <div className="min-h-screen bg-white">
            {/* Content will be rendered here from the serialized data */}
          </div>
        </Frame>
      </Editor>
    </div>
  );
};