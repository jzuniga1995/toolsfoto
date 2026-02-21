import type {
  CompressionOptions,
  ProcessedImage,
  ImageFormat,
  ImageDimensions,
} from '@/types';

// Mapa de formato → MIME type
const FORMAT_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
};

/**
 * Dibuja la imagen en un canvas con las dimensiones calculadas y devuelve el canvas + ctx.
 */
function buildCanvas(
  img: HTMLImageElement,
  maxWidthOrHeight?: number
): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; width: number; height: number } {
  let { width, height } = img;

  if (maxWidthOrHeight && (width > maxWidthOrHeight || height > maxWidthOrHeight)) {
    if (width > height) {
      height = Math.round((height * maxWidthOrHeight) / width);
      width = maxWidthOrHeight;
    } else {
      width = Math.round((width * maxWidthOrHeight) / height);
      height = maxWidthOrHeight;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) throw new Error('No se pudo obtener el contexto del canvas');

  ctx.drawImage(img, 0, 0, width, height);
  return { canvas, ctx, width, height };
}

/**
 * Convierte un canvas a Blob con el MIME y calidad dados.
 */
function canvasToBlob(
  canvas: HTMLCanvasElement,
  mime: string,
  quality: number
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('Error al crear blob'))),
      mime,
      quality
    );
  });
}

/**
 * Comprime una imagen reduciendo su calidad y/o dimensiones.
 * En lugar de recursión que recarga la URL, itera sobre el canvas ya renderizado.
 */
export async function compressImage(
  imageUrl: string,
  options: CompressionOptions
): Promise<ProcessedImage> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Error al cargar la imagen'));
    el.src = imageUrl;
  });

  const { canvas, width, height } = buildCanvas(img, options.maxWidthOrHeight);

  // Formato de salida: respeta lo que venga en options, fallback a jpg
  type CompressionOptionsWithFormat = CompressionOptions & { format?: string };
  const outputFormat: string = (options as CompressionOptionsWithFormat).format ?? 'jpg';
  const mime = FORMAT_MIME[outputFormat] ?? 'image/jpeg';
  const fileExt = outputFormat === 'jpeg' ? 'jpg' : outputFormat;

  let quality = options.quality !== undefined ? options.quality : 0.8;
  let blob: Blob;

  // Loop iterativo en lugar de recursión — más eficiente y predecible
  while (true) {
    blob = await canvasToBlob(canvas, mime, quality);
    const sizeMB = blob.size / (1024 * 1024);

    if (sizeMB <= options.maxSizeMB || quality <= 0.1) break;

    quality = Math.max(0.1, Math.round((quality - 0.1) * 10) / 10);
  }

  const url = URL.createObjectURL(blob!);
  const dimensions: ImageDimensions = { width, height };

  const result: ProcessedImage = {
    blob: blob!,
    url,
    fileName: `imagen-comprimida.${fileExt}`,
    format: fileExt as ImageFormat,
    size: blob!.size,
    dimensions,
  };

  return result;
}

/**
 * Calcula el porcentaje de compresión logrado.
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.round(reduction * 100) / 100;
}

/**
 * Estima el tamaño final basado en la calidad seleccionada.
 * Usa una curva más realista para JPEG (no lineal).
 */
export function estimateCompressedSize(
  originalSize: number,
  quality: number
): number {
  // JPEG comprime de forma logarítmica; esta curva es más fiel que quality * size
  const factor = 0.1 + 0.9 * Math.pow(quality, 1.5);
  return Math.round(originalSize * factor);
}

/**
 * Valida las opciones de compresión.
 */
export function validateCompressionOptions(
  options: CompressionOptions
): string | null {
  if (options.maxSizeMB <= 0) {
    return 'El tamaño máximo debe ser mayor a 0';
  }
  if (options.quality !== undefined && (options.quality < 0 || options.quality > 1)) {
    return 'La calidad debe estar entre 0 y 1';
  }
  if (options.maxWidthOrHeight !== undefined && options.maxWidthOrHeight < 1) {
    return 'Las dimensiones máximas deben ser mayores a 0';
  }
  return null;
}

/**
 * Obtiene recomendaciones de compresión basadas en el tamaño original.
 */
export function getCompressionRecommendations(
  originalSizeMB: number
): {
  quality: number;
  maxWidthOrHeight?: number;
  description: string;
}[] {
  const recommendations = [];

  if (originalSizeMB > 10) {
    recommendations.push({
      quality: 0.6,
      maxWidthOrHeight: 1920,
      description: 'Alta compresión - Reduce significativamente el tamaño',
    });
  }

  if (originalSizeMB > 5) {
    recommendations.push({
      quality: 0.7,
      maxWidthOrHeight: 2560,
      description: 'Compresión media - Balance entre calidad y tamaño',
    });
  }

  recommendations.push({
    quality: 0.8,
    description: 'Compresión ligera - Mantiene buena calidad',
  });

  return recommendations;
}

