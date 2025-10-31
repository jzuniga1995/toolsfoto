'use client';

import React, { useRef, useState } from 'react';
import type { ImageMimeType } from '@/types';

interface ImageUploaderProps {
  onImageSelect: (file: File, imageUrl: string) => void;
  acceptedFormats?: ImageMimeType[];
  maxSizeMB?: number;
  className?: string;
}

export default function ImageUploader({
  onImageSelect,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  maxSizeMB = 10,
  className = '',
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // Validar tipo de archivo
    if (!acceptedFormats.includes(file.type as ImageMimeType)) {
      return `Formato no válido. Formatos aceptados: ${acceptedFormats
        .map((format) => format.split('/')[1].toUpperCase())
        .join(', ')}`;
    }

    // Validar tamaño
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      return `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      onImageSelect(file, imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={className}>
      <div
        onClick={handleClick}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-8 
          transition-all duration-200 cursor-pointer
          ${
            isDragging
              ? 'border-blue-500 bg-blue-50 scale-105'
              : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50/50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center text-center">
          {/* Icon */}
          <div
            className={`
            w-16 h-16 mb-4 rounded-full flex items-center justify-center
            transition-colors duration-200
            ${isDragging ? 'bg-blue-100' : 'bg-gray-200'}
            ${error ? 'bg-red-100' : ''}
          `}
          >
            {error ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-8 h-8 text-red-500"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-8 h-8 ${isDragging ? 'text-blue-600' : 'text-gray-400'}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            )}
          </div>

          {/* Text */}
          <div className="space-y-2">
            {error ? (
              <div>
                <p className="text-red-600 font-semibold">Error al cargar imagen</p>
                <p className="text-sm text-red-500 mt-1">{error}</p>
              </div>
            ) : (
              <>
                <p className="text-gray-700 font-semibold">
                  {isDragging ? '¡Suelta la imagen aquí!' : 'Arrastra y suelta tu imagen'}
                </p>
                <p className="text-sm text-gray-500">
                  o{' '}
                  <span className="text-blue-600 font-medium hover:underline">
                    haz click para seleccionar
                  </span>
                </p>
              </>
            )}
          </div>

          {/* Info */}
          {!error && (
            <div className="mt-4 text-xs text-gray-400">
              <p>
                Formatos: {acceptedFormats.map((f) => f.split('/')[1].toUpperCase()).join(', ')}
              </p>
              <p className="mt-1">Tamaño máximo: {maxSizeMB}MB</p>
            </div>
          )}

          {/* Retry button */}
          {error && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setError(null);
              }}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}