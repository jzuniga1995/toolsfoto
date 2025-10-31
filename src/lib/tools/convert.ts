import type {
  ProcessedImage,
  ImageDimensions,
  ImageFormat,
} from '@/types';

/**
 * Opciones para la conversión de formato
 */
export interface ConvertOptions {
  format: ImageFormat;
  quality?: number; // 0-1, solo para jpg y webp
  backgroundColor?: string; // Para cuando se convierte de PNG con transparencia a JPG
}

/**
 * Normaliza el formato de imagen (convierte 'jpeg' a 'jpg')
 */
function normalizeFormat(format: string): ImageFormat {
  const normalized = format.toLowerCase();
  return (normalized === 'jpeg' ? 'jpg' : normalized) as ImageFormat;
}

/**
 * Convierte una imagen a otro formato
 */
export async function convertImage(
  imageUrl: string,
  options: ConvertOptions
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Si se convierte a JPG y hay un color de fondo, dibujarlo primero
        if ((options.format === 'jpg' || options.format === 'jpeg') && options.backgroundColor) {
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Dibujar la imagen
        ctx.drawImage(img, 0, 0);

        // Determinar tipo MIME y calidad
        const mimeType = getMimeType(options.format);
        const quality = options.quality !== undefined ? options.quality : getDefaultQuality(options.format);

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            const url = URL.createObjectURL(blob);
            const dimensions: ImageDimensions = {
              width: img.width,
              height: img.height,
            };

            const result: ProcessedImage = {
              blob,
              url,
              fileName: `imagen-convertida.${options.format}`,
              format: options.format,
              size: blob.size,
              dimensions,
            };

            resolve(result);
          },
          mimeType,
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
 * Convierte múltiples imágenes al mismo formato
 */
export async function convertMultipleImages(
  imageUrls: string[],
  options: ConvertOptions
): Promise<ProcessedImage[]> {
  const promises = imageUrls.map((url) => convertImage(url, options));
  return Promise.all(promises);
}

/**
 * Detecta el formato actual de una imagen desde su URL o Data URL
 */
export function detectImageFormat(imageUrl: string): ImageFormat | null {
  if (imageUrl.startsWith('data:')) {
    // Data URL
    const match = imageUrl.match(/^data:image\/(\w+);/);
    if (match) {
      const format = normalizeFormat(match[1]);
      if (isValidImageFormat(format)) {
        return format;
      }
    }
  }
  
  // Detectar por extensión
  const extension = imageUrl.split('.').pop()?.toLowerCase();
  if (extension) {
    const normalizedExtension = normalizeFormat(extension);
    if (isValidImageFormat(normalizedExtension)) {
      return normalizedExtension;
    }
  }

  return null;
}

/**
 * Verifica si un formato de imagen es válido
 */
function isValidImageFormat(format: string): boolean {
  const validFormats: ImageFormat[] = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg'];
  return validFormats.includes(format as ImageFormat);
}

/**
 * Obtiene el tipo MIME para un formato de imagen
 */
function getMimeType(format: ImageFormat): string {
  const mimeTypes: Record<ImageFormat, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
  };

  return mimeTypes[format] || 'image/png';
}

/**
 * Obtiene la calidad por defecto según el formato
 */
function getDefaultQuality(format: ImageFormat): number {
  const defaultQualities: Record<ImageFormat, number> = {
    png: 1.0,
    jpg: 0.92,
    jpeg: 0.92,
    webp: 0.90,
    gif: 1.0,
    bmp: 1.0,
    svg: 1.0,
  };

  return defaultQualities[format] || 0.92;
}

/**
 * Estima el tamaño aproximado del archivo resultante
 * (Esta es una estimación aproximada, el tamaño real puede variar)
 */
export function estimateConvertedSize(
  originalSize: number,
  originalFormat: ImageFormat,
  targetFormat: ImageFormat,
  quality: number = 0.9
): number {
  // Factores de compresión aproximados
  const compressionFactors: Record<ImageFormat, number> = {
    png: 1.0,
    jpg: 0.3,
    jpeg: 0.3,
    webp: 0.25,
    gif: 0.4,
    bmp: 3.0,
    svg: 0.5,
  };

  const originalFactor = compressionFactors[originalFormat] || 1.0;
  const targetFactor = compressionFactors[targetFormat] || 1.0;

  // Calcular tamaño estimado
  let estimatedSize = originalSize * (targetFactor / originalFactor);

  // Aplicar factor de calidad para formatos con pérdida
  if (targetFormat === 'jpg' || targetFormat === 'jpeg' || targetFormat === 'webp') {
    estimatedSize *= quality;
  }

  return Math.round(estimatedSize);
}

/**
 * Información sobre formatos de imagen soportados
 */
export const IMAGE_FORMAT_INFO: Record<ImageFormat, {
  name: string;
  description: string;
  supportsTransparency: boolean;
  supportsAnimation: boolean;
  compression: string;
  bestFor: string;
}> = {
  png: {
    name: 'PNG',
    description: 'Formato sin pérdida, soporta transparencia',
    supportsTransparency: true,
    supportsAnimation: false,
    compression: 'lossless',
    bestFor: 'Gráficos, logos, imágenes con transparencia',
  },
  jpg: {
    name: 'JPG/JPEG',
    description: 'Formato con pérdida, ideal para fotografías',
    supportsTransparency: false,
    supportsAnimation: false,
    compression: 'lossy',
    bestFor: 'Fotografías, imágenes complejas',
  },
  jpeg: {
    name: 'JPG/JPEG',
    description: 'Formato con pérdida, ideal para fotografías',
    supportsTransparency: false,
    supportsAnimation: false,
    compression: 'lossy',
    bestFor: 'Fotografías, imágenes complejas',
  },
  webp: {
    name: 'WebP',
    description: 'Formato moderno con mejor compresión',
    supportsTransparency: true,
    supportsAnimation: true,
    compression: 'both',
    bestFor: 'Web, mejor compresión que JPG y PNG',
  },
  gif: {
    name: 'GIF',
    description: 'Formato para animaciones simples',
    supportsTransparency: true,
    supportsAnimation: true,
    compression: 'lossless',
    bestFor: 'Animaciones simples, gráficos con pocos colores',
  },
  bmp: {
    name: 'BMP',
    description: 'Formato sin comprimir, tamaño grande',
    supportsTransparency: false,
    supportsAnimation: false,
    compression: 'none',
    bestFor: 'Cuando se necesita formato sin comprimir',
  },
  svg: {
    name: 'SVG',
    description: 'Formato vectorial escalable',
    supportsTransparency: true,
    supportsAnimation: true,
    compression: 'none',
    bestFor: 'Gráficos vectoriales, iconos, logos',
  },
};

/**
 * Formatos de imagen comunes para conversión
 */
export const COMMON_FORMATS: ImageFormat[] = ['png', 'jpg', 'webp'];

/**
 * Formatos que soportan transparencia
 */
export const TRANSPARENCY_FORMATS: ImageFormat[] = ['png', 'webp', 'gif', 'svg'];

/**
 * Formatos que soportan animación
 */
export const ANIMATION_FORMATS: ImageFormat[] = ['gif', 'webp'];

/**
 * Verifica si el formato de destino soporta las características de la imagen original
 */
export function checkFormatCompatibility(
  targetFormat: ImageFormat,
  hasTransparency: boolean,
  isAnimated: boolean
): {
  compatible: boolean;
  warnings: string[];
} {
  const warnings: string[] = [];

  // Verificar transparencia
  if (hasTransparency && !TRANSPARENCY_FORMATS.includes(targetFormat)) {
    warnings.push(
      `El formato ${IMAGE_FORMAT_INFO[targetFormat].name} no soporta transparencia. Las áreas transparentes se convertirán a un color sólido.`
    );
  }

  // Verificar animación
  if (isAnimated && !ANIMATION_FORMATS.includes(targetFormat)) {
    warnings.push(
      `El formato ${IMAGE_FORMAT_INFO[targetFormat].name} no soporta animación. Solo se convertirá el primer frame.`
    );
  }

  return {
    compatible: warnings.length === 0,
    warnings,
  };
}

/**
 * Obtiene recomendaciones de formato basadas en las características de la imagen
 */
export function getFormatRecommendations(
  imageSize: number,
  hasTransparency: boolean,
  isPhoto: boolean
): {
  recommended: ImageFormat[];
  reasons: Partial<Record<ImageFormat, string>>;
} {
  const recommendations: ImageFormat[] = [];
  const reasons: Partial<Record<ImageFormat, string>> = {};

  if (isPhoto) {
    // Para fotos, recomendar JPG o WebP
    recommendations.push('jpg');
    reasons.jpg = 'Mejor compresión para fotografías';
    
    recommendations.push('webp');
    reasons.webp = 'Compresión moderna, 30% más pequeño que JPG';
  }

  if (hasTransparency) {
    // Para imágenes con transparencia
    recommendations.push('png');
    reasons.png = 'Soporta transparencia sin pérdida';
    
    recommendations.push('webp');
    reasons.webp = 'Soporta transparencia con mejor compresión';
  }

  if (!hasTransparency && !isPhoto) {
    // Para gráficos sin transparencia
    recommendations.push('png');
    reasons.png = 'Sin pérdida de calidad para gráficos';
    
    recommendations.push('webp');
    reasons.webp = 'Mejor compresión que PNG';
  }

  return {
    recommended: recommendations,
    reasons,
  };
}

/**
 * Convierte una imagen con ajuste automático de color de fondo para JPG
 */
export async function convertWithBackgroundColor(
  imageUrl: string,
  targetFormat: ImageFormat,
  backgroundColor: string = '#FFFFFF',
  quality: number = 0.92
): Promise<ProcessedImage> {
  return convertImage(imageUrl, {
    format: targetFormat,
    quality,
    backgroundColor: targetFormat === 'jpg' ? backgroundColor : undefined,
  });
}

/**
 * Colores de fondo predefinidos para conversión a JPG
 */
export const BACKGROUND_COLORS = {
  'Blanco': '#FFFFFF',
  'Negro': '#000000',
  'Gris claro': '#F5F5F5',
  'Gris': '#808080',
  'Azul claro': '#E3F2FD',
  'Verde claro': '#E8F5E9',
  'Amarillo claro': '#FFFDE7',
  'Rosa claro': '#FCE4EC',
} as const;

/**
 * Valida si un color hexadecimal es válido
 */
export function isValidHexColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

