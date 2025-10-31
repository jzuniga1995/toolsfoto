'use client';

import React from 'react';
import Image from 'next/image';
import type { ImageDimensions } from '@/types';

interface ImagePreviewProps {
  imageUrl: string | null;
  title?: string;
  showInfo?: boolean;
  dimensions?: ImageDimensions;
  fileSize?: number;
  className?: string;
}

export default function ImagePreview({
  imageUrl,
  title = 'Vista previa',
  showInfo = true,
  dimensions,
  fileSize,
  className = '',
}: ImagePreviewProps) {
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  if (!imageUrl) {
    return (
      <div className={`bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 ${className}`}>
        <div className="flex flex-col items-center justify-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-16 h-16 mb-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
          <p className="text-sm font-medium">No hay vista previa</p>
          <p className="text-xs mt-1">Sube una imagen para ver la vista previa</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl border-2 border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      {showInfo && (
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          {(dimensions || fileSize) && (
            <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-600">
              {dimensions && (
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                  <span>
                    {dimensions.width} × {dimensions.height} px
                  </span>
                </div>
              )}
              {fileSize && (
                <div className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span>{formatFileSize(fileSize)}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Image */}
      <div className="relative min-h-[300px] max-h-[500px] bg-gray-100 flex items-center justify-center p-4">
        <div className="relative max-w-full max-h-full">
          <Image
            src={imageUrl}
            alt="Vista previa"
            width={dimensions?.width || 800}
            height={dimensions?.height || 600}
            className="object-contain max-w-full h-auto rounded-lg"
            unoptimized
          />
        </div>
      </div>
    </div>
  );
}