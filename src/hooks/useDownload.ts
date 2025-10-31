'use client';

import { useState, useCallback } from 'react';
import type { ImageFormat, ProcessedImage } from '@/types';

interface UseDownloadReturn {
  isDownloading: boolean;
  downloadImage: (imageUrl: string, fileName: string, format: ImageFormat) => Promise<void>;
  downloadProcessedImage: (processedImage: ProcessedImage) => Promise<void>;
  error: string | null;
}

export function useDownload(): UseDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const downloadImage = useCallback(async (
    imageUrl: string,
    fileName: string = 'imagen-editada',
    format: ImageFormat = 'png'
  ): Promise<void> => {
    try {
      setIsDownloading(true);
      setError(null);

      // Asegurar que el fileName tenga la extensión correcta UNA SOLA VEZ
      const finalFileName = fileName.endsWith(`.${format}`)
        ? fileName
        : `${fileName}.${format}`;

      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = finalFileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al descargar la imagen';
      setError(errorMessage);
      console.error('Error downloading image:', err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  const downloadProcessedImage = useCallback(async (processedImage: ProcessedImage): Promise<void> => {
    try {
      setIsDownloading(true);
      setError(null);

      // Verificar si el fileName ya tiene la extensión correcta
      const hasCorrectExtension = processedImage.fileName.endsWith(`.${processedImage.format}`);
      const finalFileName = hasCorrectExtension
        ? processedImage.fileName
        : `${processedImage.fileName}.${processedImage.format}`;

      const link = document.createElement('a');
      link.href = processedImage.url;
      link.download = finalFileName;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al descargar la imagen';
      setError(errorMessage);
      console.error('Error downloading processed image:', err);
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return {
    isDownloading,
    downloadImage,
    downloadProcessedImage,
    error,
  };
}

// Función auxiliar para convertir blob a base64
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Función auxiliar para descargar desde canvas
export const downloadFromCanvas = (
  canvas: HTMLCanvasElement,
  fileName: string = 'imagen',
  format: 'png' | 'jpeg' | 'webp' = 'png',
  quality: number = 1.0
): void => {
  const mimeType = `image/${format}`;
  canvas.toBlob(
    (blob) => {
      if (!blob) {
        console.error('Error al crear blob desde canvas');
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Asegurar extensión única
      const finalFileName = fileName.endsWith(`.${format}`)
        ? fileName
        : `${fileName}.${format}`;
      
      link.download = finalFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
    },
    mimeType,
    quality
  );
};

// Función para descargar múltiples imágenes
export const downloadMultipleImages = async (
  images: { url: string; fileName: string }[]
): Promise<void> => {
  for (const image of images) {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
};

// Función para descargar desde Blob directamente
export const downloadFromBlob = (
  blob: Blob,
  fileName: string,
  format: ImageFormat = 'png'
): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  
  // Asegurar extensión única
  const finalFileName = fileName.endsWith(`.${format}`)
    ? fileName
    : `${fileName}.${format}`;
  
  link.download = finalFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  setTimeout(() => URL.revokeObjectURL(url), 100);
};

// Función para crear un archivo descargable desde base64
export const downloadFromBase64 = (
  base64: string,
  fileName: string,
  format: ImageFormat = 'png'
): void => {
  const link = document.createElement('a');
  link.href = base64;
  
  // Asegurar extensión única
  const finalFileName = fileName.endsWith(`.${format}`)
    ? fileName
    : `${fileName}.${format}`;
  
  link.download = finalFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};