import type { 
  CompressionOptions, 
  ProcessedImage, 
  ImageFormat,
  ImageDimensions 
} from '@/types';

/**
 * Comprime una imagen reduciendo su calidad y/o dimensiones
 */
export async function compressImage(
  imageUrl: string,
  options: CompressionOptions
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = async () => {
      try {
        let { width, height } = img;

        // Redimensionar si se especifica maxWidthOrHeight
        if (options.maxWidthOrHeight) {
          const maxDimension = options.maxWidthOrHeight;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }
        }

        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Dibujar imagen
        ctx.drawImage(img, 0, 0, width, height);

        // Determinar calidad (0-1)
        const quality = options.quality !== undefined ? options.quality : 0.8;

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            // Verificar si cumple con el tamaño máximo
            const sizeMB = blob.size / (1024 * 1024);
            if (sizeMB > options.maxSizeMB) {
              // Si aún es muy grande, intentar con menor calidad
              const newQuality = Math.max(0.1, quality - 0.1);
              const newOptions: CompressionOptions = {
                ...options,
                quality: newQuality,
              };
              
              // Recursión con menor calidad
              compressImage(imageUrl, newOptions)
                .then(resolve)
                .catch(reject);
              return;
            }

            const url = URL.createObjectURL(blob);
            const dimensions: ImageDimensions = { width, height };

            const result: ProcessedImage = {
              blob,
              url,
              fileName: 'imagen-comprimida.jpg',
              format: 'jpg',
              size: blob.size,
              dimensions,
            };

            resolve(result);
          },
          'image/jpeg',
          quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => {
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = imageUrl;
  });
}

/**
 * Calcula el porcentaje de compresión logrado
 */
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  const reduction = ((originalSize - compressedSize) / originalSize) * 100;
  return Math.round(reduction * 100) / 100;
}

/**
 * Estima el tamaño final basado en la calidad seleccionada
 */
export function estimateCompressedSize(
  originalSize: number,
  quality: number
): number {
  // Estimación aproximada (no exacta)
  return Math.round(originalSize * quality);
}

/**
 * Valida las opciones de compresión
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

  if (
    options.maxWidthOrHeight !== undefined &&
    options.maxWidthOrHeight < 1
  ) {
    return 'Las dimensiones máximas deben ser mayores a 0';
  }

  return null;
}

/**
 * Obtiene recomendaciones de compresión basadas en el tamaño original
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