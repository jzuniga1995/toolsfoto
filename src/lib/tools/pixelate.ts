// src/lib/tools/pixelate.ts

import type { ImageFile, ProcessedImage, ImageFormat } from '@/types';

export interface PixelateOptions {
  pixelSize?: number; // Tamaño del píxel (1-50)
  format?: ImageFormat;
  quality?: number; // 0-100
  preserveAspectRatio?: boolean;
}

export interface PixelateResult extends ProcessedImage {
  pixelSize: number;
  originalDimensions: {
    width: number;
    height: number;
  };
}

/**
 * Pixela una imagen aplicando efecto de mosaico
 */
export const pixelateImage = async (
  imageFile: ImageFile,
  options: PixelateOptions = {}
): Promise<PixelateResult> => {
  const startTime = performance.now();

  try {
    const pixelSize = Math.max(1, Math.min(50, options.pixelSize || 10));
    
    // Cargar imagen
    const img = await loadImage(imageFile.preview);

    // Crear canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    // Dibujar imagen original
    ctx.drawImage(img, 0, 0);

    // Aplicar efecto de pixelado
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixelateImageData(imageData, pixelSize);
    ctx.putImageData(imageData, 0, 0);

    // Convertir a blob
    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const processingTime = performance.now() - startTime;

    const result: PixelateResult = {
      blob,
      url,
      fileName: generateFileName(imageFile.name, format, 'pixelated'),
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
      processingTime,
      pixelSize,
      originalDimensions: {
        width: img.width,
        height: img.height,
      },
    };

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al pixelar la imagen'
    );
  }
};

/**
 * Pixela solo una región específica de la imagen
 */
export const pixelateRegion = async (
  imageFile: ImageFile,
  region: { x: number; y: number; width: number; height: number },
  options: PixelateOptions = {}
): Promise<PixelateResult> => {
  const startTime = performance.now();

  try {
    const pixelSize = Math.max(1, Math.min(50, options.pixelSize || 10));
    
    const img = await loadImage(imageFile.preview);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    // Dibujar imagen original
    ctx.drawImage(img, 0, 0);

    // Obtener solo la región especificada
    const imageData = ctx.getImageData(region.x, region.y, region.width, region.height);
    
    // Pixelar solo esa región
    pixelateImageData(imageData, pixelSize);
    
    // Poner la región pixelada de vuelta
    ctx.putImageData(imageData, region.x, region.y);

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const processingTime = performance.now() - startTime;

    return {
      blob,
      url,
      fileName: generateFileName(imageFile.name, format, 'pixelated-region'),
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
      processingTime,
      pixelSize,
      originalDimensions: {
        width: img.width,
        height: img.height,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al pixelar la región'
    );
  }
};

/**
 * Crea efecto de censura/blur pixelado (común para ocultar rostros, datos sensibles)
 */
export const censorWithPixels = async (
  imageFile: ImageFile,
  regions: Array<{ x: number; y: number; width: number; height: number }>,
  options: PixelateOptions = {}
): Promise<PixelateResult> => {
  const startTime = performance.now();

  try {
    const pixelSize = Math.max(5, Math.min(50, options.pixelSize || 20));
    
    const img = await loadImage(imageFile.preview);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    // Pixelar cada región
    for (const region of regions) {
      const imageData = ctx.getImageData(region.x, region.y, region.width, region.height);
      pixelateImageData(imageData, pixelSize);
      ctx.putImageData(imageData, region.x, region.y);
    }

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const processingTime = performance.now() - startTime;

    return {
      blob,
      url,
      fileName: generateFileName(imageFile.name, format, 'censored'),
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
      processingTime,
      pixelSize,
      originalDimensions: {
        width: img.width,
        height: img.height,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al censurar la imagen'
    );
  }
};

/**
 * Crea efecto de pixel art estilo retro
 */
export const createPixelArt = async (
  imageFile: ImageFile,
  options: PixelateOptions & { colorDepth?: number } = {}
): Promise<PixelateResult> => {
  const startTime = performance.now();

  try {
    const pixelSize = Math.max(2, Math.min(50, options.pixelSize || 8));
    const colorDepth = options.colorDepth || 32; // Reducción de colores
    
    const img = await loadImage(imageFile.preview);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    
    // Aplicar pixelado
    pixelateImageData(imageData, pixelSize);
    
    // Reducir colores para efecto retro
    reduceColors(imageData, colorDepth);
    
    ctx.putImageData(imageData, 0, 0);

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const processingTime = performance.now() - startTime;

    return {
      blob,
      url,
      fileName: generateFileName(imageFile.name, format, 'pixel-art'),
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
      processingTime,
      pixelSize,
      originalDimensions: {
        width: img.width,
        height: img.height,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al crear pixel art'
    );
  }
};

/**
 * Crea efecto de mosaico con bordes definidos
 */
export const createMosaic = async (
  imageFile: ImageFile,
  options: PixelateOptions & { showGrid?: boolean; gridColor?: string } = {}
): Promise<PixelateResult> => {
  const startTime = performance.now();

  try {
    const pixelSize = Math.max(5, Math.min(50, options.pixelSize || 15));
    
    const img = await loadImage(imageFile.preview);

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (!ctx) {
      throw new Error('No se pudo crear el contexto del canvas');
    }

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    pixelateImageData(imageData, pixelSize);
    ctx.putImageData(imageData, 0, 0);

    // Dibujar grid si está habilitado
    if (options.showGrid) {
      const gridColor = options.gridColor || '#00000033';
      ctx.strokeStyle = gridColor;
      ctx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += pixelSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const processingTime = performance.now() - startTime;

    return {
      blob,
      url,
      fileName: generateFileName(imageFile.name, format, 'mosaic'),
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
      processingTime,
      pixelSize,
      originalDimensions: {
        width: img.width,
        height: img.height,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al crear mosaico'
    );
  }
};

// Helpers

/**
 * Algoritmo principal de pixelado
 */
const pixelateImageData = (imageData: ImageData, pixelSize: number): void => {
  const { data, width, height } = imageData;

  for (let y = 0; y < height; y += pixelSize) {
    for (let x = 0; x < width; x += pixelSize) {
      // Calcular color promedio del bloque
      let r = 0, g = 0, b = 0, a = 0, count = 0;

      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          a += data[i + 3];
          count++;
        }
      }

      // Calcular promedio
      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);
      a = Math.round(a / count);

      // Aplicar color promedio a todo el bloque
      for (let dy = 0; dy < pixelSize && y + dy < height; dy++) {
        for (let dx = 0; dx < pixelSize && x + dx < width; dx++) {
          const i = ((y + dy) * width + (x + dx)) * 4;
          data[i] = r;
          data[i + 1] = g;
          data[i + 2] = b;
          data[i + 3] = a;
        }
      }
    }
  }
};

/**
 * Reduce la profundidad de color para efecto retro
 */
const reduceColors = (imageData: ImageData, levels: number): void => {
  const { data } = imageData;
  const step = 255 / (levels - 1);

  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.round(data[i] / step) * step;         // R
    data[i + 1] = Math.round(data[i + 1] / step) * step; // G
    data[i + 2] = Math.round(data[i + 2] / step) * step; // B
  }
};

const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
    img.src = src;
  });
};

const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const mimeType = getMimeType(format);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo crear el blob'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
};

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

const generateFileName = (
  originalName: string,
  format: ImageFormat,
  suffix: string
): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}_${suffix}.${format}`;
};

/**
 * Detecta automáticamente rostros para censurar (requiere face-api.js - opcional)
 */
export const detectAndPixelateFaces = async (
  imageFile: ImageFile,
  options: PixelateOptions = {}
): Promise<PixelateResult> => {
  // Esta función requeriría face-api.js
  // Por ahora, lanzamos un error indicando que no está implementado
  throw new Error(
    'Detección automática de rostros no implementada. Usa censorWithPixels() para censurar regiones manualmente.'
  );
};