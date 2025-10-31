'use client';

import React from 'react';
import type { ImageFormat } from '@/types';

interface DownloadButtonProps {
  imageUrl: string | null;
  fileName?: string;
  disabled?: boolean;
  format?: ImageFormat;
  className?: string;
}

export default function DownloadButton({
  imageUrl,
  fileName = 'imagen-editada',
  disabled = false,
  format = 'png',
  className = '',
}: DownloadButtonProps) {
  const handleDownload = () => {
    if (!imageUrl) return;

    // Verificar si el fileName ya tiene la extensión correcta
    const hasCorrectExtension = fileName.endsWith(`.${format}`);
    const finalFileName = hasCorrectExtension
      ? fileName
      : `${fileName}.${format}`;

    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = finalFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !imageUrl}
      className={`
        w-full px-6 py-3 rounded-xl font-semibold text-white
        transition-all duration-200 flex items-center justify-center gap-2
        ${
          disabled || !imageUrl
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
        }
        ${className}
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
        />
      </svg>
      {disabled || !imageUrl ? 'No hay imagen para descargar' : 'Descargar imagen'}
    </button>
  );
}