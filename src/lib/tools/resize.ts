import type { 
  ResizeOptions, 
  ProcessedImage, 
  ImageDimensions,
  ImageFormat 
} from '@/types';

/**
 * Redimensiona una imagen según las opciones proporcionadas
 */
export async function resizeImage(
  imageUrl: string,
  options: ResizeOptions
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        let targetWidth = options.width || img.width;
        let targetHeight = options.height || img.height;

        // Mantener aspect ratio si está habilitado
        if (options.maintainAspectRatio) {
          if (options.width && !options.height) {
            // Solo se especificó el ancho
            const aspectRatio = img.height / img.width;
            targetHeight = Math.round(targetWidth * aspectRatio);
          } else if (options.height && !options.width) {
            // Solo se especificó el alto
            const aspectRatio = img.width / img.height;
            targetWidth = Math.round(targetHeight * aspectRatio);
          }
        }

        // Crear canvas
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Mejorar la calidad del redimensionamiento
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

        // Determinar formato y calidad
        const format: ImageFormat = 'png';
        const quality = options.quality !== undefined ? options.quality / 100 : 1.0;

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            const url = URL.createObjectURL(blob);
            const dimensions: ImageDimensions = {
              width: targetWidth,
              height: targetHeight,
            };

            const result: ProcessedImage = {
              blob,
              url,
              fileName: 'imagen-redimensionada.png',
              format,
              size: blob.size,
              dimensions,
            };

            resolve(result);
          },
          'image/png',
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
 * Calcula las nuevas dimensiones manteniendo el aspect ratio
 */
export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): ImageDimensions {
  if (targetWidth && !targetHeight) {
    const aspectRatio = originalHeight / originalWidth;
    return {
      width: targetWidth,
      height: Math.round(targetWidth * aspectRatio),
    };
  }

  if (targetHeight && !targetWidth) {
    const aspectRatio = originalWidth / originalHeight;
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  if (targetWidth && targetHeight) {
    return { width: targetWidth, height: targetHeight };
  }

  return { width: originalWidth, height: originalHeight };
}

/**
 * Redimensiona por porcentaje
 */
export function resizeByPercentage(
  originalWidth: number,
  originalHeight: number,
  percentage: number
): ImageDimensions {
  const factor = percentage / 100;
  return {
    width: Math.round(originalWidth * factor),
    height: Math.round(originalHeight * factor),
  };
}

/**
 * Ajusta la imagen para que quepa dentro de un contenedor manteniendo aspect ratio
 */
export function fitToContainer(
  originalWidth: number,
  originalHeight: number,
  containerWidth: number,
  containerHeight: number
): ImageDimensions {
  const widthRatio = containerWidth / originalWidth;
  const heightRatio = containerHeight / originalHeight;
  const ratio = Math.min(widthRatio, heightRatio);

  return {
    width: Math.round(originalWidth * ratio),
    height: Math.round(originalHeight * ratio),
  };
}

/**
 * Valida las opciones de redimensionamiento
 */
export function validateResizeOptions(options: ResizeOptions): string | null {
  if (!options.width && !options.height) {
    return 'Debes especificar al menos ancho o alto';
  }

  if (options.width && options.width < 1) {
    return 'El ancho debe ser mayor a 0';
  }

  if (options.height && options.height < 1) {
    return 'El alto debe ser mayor a 0';
  }

  if (options.quality !== undefined && (options.quality < 0 || options.quality > 100)) {
    return 'La calidad debe estar entre 0 y 100';
  }

  return null;
}

/**
 * Obtiene presets comunes de redimensionamiento
 */
export const RESIZE_PRESETS = {
  'Instagram Post': { width: 1080, height: 1080 },
  'Instagram Story': { width: 1080, height: 1920 },
  'Facebook Post': { width: 1200, height: 630 },
  'Twitter Post': { width: 1200, height: 675 },
  'YouTube Thumbnail': { width: 1280, height: 720 },
  'Full HD': { width: 1920, height: 1080 },
  '4K': { width: 3840, height: 2160 },
  'Profile Picture': { width: 400, height: 400 },
};