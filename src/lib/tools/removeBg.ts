// src/lib/tools/removeBg.ts

import type { 
  ImageFile, 
  ProcessedImage, 
  ImageFormat 
} from '@/types';

export interface RemoveBgOptions {
  format?: ImageFormat;
  quality?: number;
  backgroundColor?: string;
  edgeBlur?: number;
  progress?: (progress: number) => void;
}

export interface RemoveBgResult extends ProcessedImage {
  hasTransparency: boolean;
  processingTime: number;
}

/**
 * Elimina el fondo usando @imgly/background-removal
 */
export const removeBackground = async (
  imageFile: ImageFile,
  options: RemoveBgOptions = {}
): Promise<RemoveBgResult> => {
  const startTime = performance.now();

  try {
    if (options.progress) options.progress(10);
    
    // Importar librería
    const { removeBackground: removeBgLib } = await import('@imgly/background-removal');
    
    if (options.progress) options.progress(20);

    // Configuración con modelo correcto: 'isnet_fp16' es el balanceado
    const config = {
      model: 'isnet_fp16' as const, // Opciones: 'isnet', 'isnet_fp16', 'isnet_quint8'
      output: {
        format: 'image/png' as const,
        quality: (options.quality || 95) / 100,
        type: 'blob' as const,
      },
      progress: (key: string, current: number, total: number) => {
        const progress = 20 + Math.round((current / total) * 60);
        if (options.progress) options.progress(progress);
      },
    };

    // Procesar imagen
    const blob = await removeBgLib(imageFile.file, config);
    
    if (options.progress) options.progress(85);

    // Si necesita procesamiento adicional
    let finalBlob = blob;
    if (options.backgroundColor || (options.edgeBlur && options.edgeBlur > 0)) {
      finalBlob = await applyPostProcessing(blob, options);
    }

    const url = URL.createObjectURL(finalBlob);
    const processingTime = performance.now() - startTime;
    const format = options.format || 'png';

    if (options.progress) options.progress(100);

    const result: RemoveBgResult = {
      blob: finalBlob,
      url,
      fileName: generateFileName(imageFile.name, format),
      format,
      size: finalBlob.size,
      dimensions: {
        width: imageFile.width || 0,
        height: imageFile.height || 0,
      },
      hasTransparency: !options.backgroundColor,
      processingTime,
    };

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al eliminar el fondo'
    );
  }
};

/**
 * Aplica procesamiento adicional (color de fondo, blur)
 */
const applyPostProcessing = async (
  blob: Blob,
  options: RemoveBgOptions
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        reject(new Error('No se pudo crear canvas'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Aplicar color de fondo si se especifica
      if (options.backgroundColor) {
        ctx.fillStyle = options.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Dibujar imagen
      ctx.drawImage(img, 0, 0);

      // Aplicar blur en bordes si se especifica
      if (options.edgeBlur && options.edgeBlur > 0 && !options.backgroundColor) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        applyEdgeBlur(imageData, options.edgeBlur);
        ctx.putImageData(imageData, 0, 0);
      }

      URL.revokeObjectURL(url);

      const format = options.format || 'png';
      const quality = (options.quality || 95) / 100;
      const mimeType = getMimeType(format);

      canvas.toBlob(
        (resultBlob) => {
          if (!resultBlob) {
            reject(new Error('No se pudo crear blob'));
            return;
          }
          resolve(resultBlob);
        },
        mimeType,
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar imagen'));
    };

    img.src = url;
  });
};

/**
 * Aplica suavizado en los bordes
 */
const applyEdgeBlur = (imageData: ImageData, blurAmount: number): void => {
  const { data, width, height } = imageData;
  const tempData = new Uint8ClampedArray(data);
  const radius = Math.round(blurAmount);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const alpha = data[i + 3];

      if (alpha > 0 && alpha < 255) {
        let sumR = 0, sumG = 0, sumB = 0, sumA = 0, count = 0;

        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const nx = x + dx;
            const ny = y + dy;

            if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
              const ni = (ny * width + nx) * 4;
              sumR += tempData[ni];
              sumG += tempData[ni + 1];
              sumB += tempData[ni + 2];
              sumA += tempData[ni + 3];
              count++;
            }
          }
        }

        data[i] = sumR / count;
        data[i + 1] = sumG / count;
        data[i + 2] = sumB / count;
        data[i + 3] = sumA / count;
      }
    }
  }
};

/**
 * Método alternativo usando el mismo sistema
 */
export const removeBackgroundDeepLab = async (
  imageFile: ImageFile,
  options: RemoveBgOptions = {}
): Promise<RemoveBgResult> => {
  return removeBackground(imageFile, options);
};

// Helpers

interface RGB {
  r: number;
  g: number;
  b: number;
}

const getMimeType = (format: ImageFormat): string => {
  const map: Record<ImageFormat, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
  };
  return map[format] || 'image/png';
};

const generateFileName = (originalName: string, format: ImageFormat): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}_no-bg.${format}`;
};

const hexToRgb = (hex: string): RGB | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};