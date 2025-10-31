'use client';

import { useState, useCallback } from 'react';
import type {
  ImageFormat,
  ProcessedImage,
  ImageProcessingState,
  ImageDimensions,
  ResizeOptions,
  ConversionOptions,
  CompressionOptions,
} from '@/types';

interface UseImageProcessReturn extends ImageProcessingState {
  processImage: (
    imageUrl: string,
    options: Partial<ResizeOptions & ConversionOptions>
  ) => Promise<ProcessedImage | null>;
  resetProcess: () => void;
}

export function useImageProcess(): UseImageProcessReturn {
  const [processingState, setProcessingState] = useState<ImageProcessingState>({
    isProcessing: false,
    progress: 0,
    error: null,
    result: null,
  });

  const processImage = useCallback(
    async (
      imageUrl: string,
      options: Partial<ResizeOptions & ConversionOptions>
    ): Promise<ProcessedImage | null> => {
      try {
        setProcessingState({ isProcessing: true, progress: 0, error: null, result: null });

        // Crear imagen
        const img = new Image();
        img.crossOrigin = 'anonymous';

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = () => reject(new Error('Error al cargar la imagen'));
          img.src = imageUrl;
        });

        setProcessingState(prev => ({ ...prev, progress: 30 }));

        // Calcular dimensiones
        let targetWidth = options.width || img.width;
        let targetHeight = options.height || img.height;

        if (options.maintainAspectRatio !== false && options.width && !options.height) {
          const aspectRatio = img.height / img.width;
          targetHeight = Math.round(targetWidth * aspectRatio);
        } else if (options.maintainAspectRatio !== false && options.height && !options.width) {
          const aspectRatio = img.width / img.height;
          targetWidth = Math.round(targetHeight * aspectRatio);
        }

        setProcessingState(prev => ({ ...prev, progress: 50 }));

        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }

        // Aplicar backgroundColor si existe y el formato no soporta transparencia
        if (options.backgroundColor && options.format && ['jpg', 'jpeg'].includes(options.format)) {
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(0, 0, targetWidth, targetHeight);
        }

        // Dibujar imagen
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        setProcessingState(prev => ({ ...prev, progress: 80 }));

        // Convertir a formato deseado
        const format: ImageFormat = (options.format as ImageFormat) || 'png';
        const quality = options.quality !== undefined ? options.quality / 100 : 0.9;
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;

        const blob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob(
            (b) => {
              if (b) resolve(b);
              else reject(new Error('Error al crear blob'));
            },
            mimeType,
            quality
          );
        });

        const url = URL.createObjectURL(blob);
        const fileName = `imagen-procesada.${format}`;

        const dimensions: ImageDimensions = {
          width: targetWidth,
          height: targetHeight,
        };

        const result: ProcessedImage = {
          blob,
          url,
          fileName,
          format,
          size: blob.size,
          dimensions,
        };

        setProcessingState({
          isProcessing: false,
          progress: 100,
          error: null,
          result,
        });

        return result;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al procesar la imagen';
        setProcessingState({
          isProcessing: false,
          progress: 0,
          error: errorMessage,
          result: null,
        });
        console.error('Error processing image:', err);
        return null;
      }
    },
    []
  );

  const resetProcess = useCallback(() => {
    if (processingState.result?.url) {
      URL.revokeObjectURL(processingState.result.url);
    }
    setProcessingState({ isProcessing: false, progress: 0, error: null, result: null });
  }, [processingState.result?.url]);

  return {
    ...processingState,
    processImage,
    resetProcess,
  };
}

// Hook especializado para comprimir
export function useImageCompress() {
  const { isProcessing, progress, error, result, processImage, resetProcess } = useImageProcess();

  const compressImage = useCallback(
    async (imageUrl: string, options: CompressionOptions) => {
      const resizeOptions: Partial<ResizeOptions & ConversionOptions> = {
        quality: options.quality ? options.quality * 100 : 80,
        format: 'jpeg',
        maintainAspectRatio: true,
      };

      if (options.maxWidthOrHeight) {
        // Determinar si la imagen es horizontal o vertical
        const img = new Image();
        img.src = imageUrl;
        await new Promise(resolve => img.onload = resolve);
        
        if (img.width > img.height) {
          resizeOptions.width = options.maxWidthOrHeight;
        } else {
          resizeOptions.height = options.maxWidthOrHeight;
        }
      }

      return await processImage(imageUrl, resizeOptions);
    },
    [processImage]
  );

  return {
    isCompressing: isProcessing,
    progress,
    compressedImage: result,
    compressImage,
    resetCompress: resetProcess,
    error,
  };
}

// Hook especializado para redimensionar
export function useImageResize() {
  const { isProcessing, progress, error, result, processImage, resetProcess } = useImageProcess();

  const resizeImage = useCallback(
    async (imageUrl: string, options: ResizeOptions) => {
      return await processImage(imageUrl, options);
    },
    [processImage]
  );

  return {
    isResizing: isProcessing,
    progress,
    resizedImage: result,
    resizeImage,
    resetResize: resetProcess,
    error,
  };
}

// Hook especializado para convertir formato
export function useImageConvert() {
  const { isProcessing, progress, error, result, processImage, resetProcess } = useImageProcess();

  const convertImage = useCallback(
    async (imageUrl: string, options: ConversionOptions) => {
      return await processImage(imageUrl, options);
    },
    [processImage]
  );

  return {
    isConverting: isProcessing,
    progress,
    convertedImage: result,
    convertImage,
    resetConvert: resetProcess,
    error,
  };
}

// Función auxiliar para obtener información de la imagen
export const getImageInfo = (imageUrl: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
    };
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = imageUrl;
  });
};