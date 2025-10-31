import type {
  CropArea,
  PixelCrop,
  ProcessedImage,
  ImageDimensions,
  ImageFormat,
} from '@/types';

/**
 * Recorta una imagen según el área especificada
 */
export async function cropImage(
  imageUrl: string,
  cropArea: PixelCrop,
  format: ImageFormat = 'png',
  quality: number = 1.0
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        // Validar que el área de recorte esté dentro de los límites
        const validatedCrop = validateCropArea(
          cropArea,
          { width: img.width, height: img.height }
        );

        // Crear canvas con las dimensiones del recorte
        const canvas = document.createElement('canvas');
        canvas.width = validatedCrop.width;
        canvas.height = validatedCrop.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Dibujar la porción recortada de la imagen
        ctx.drawImage(
          img,
          validatedCrop.x,
          validatedCrop.y,
          validatedCrop.width,
          validatedCrop.height,
          0,
          0,
          validatedCrop.width,
          validatedCrop.height
        );

        // Determinar tipo MIME
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`;

        // Convertir a blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            const url = URL.createObjectURL(blob);
            const dimensions: ImageDimensions = {
              width: validatedCrop.width,
              height: validatedCrop.height,
            };

            const result: ProcessedImage = {
              blob,
              url,
              fileName: `imagen-recortada.${format}`,
              format,
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
 * Valida y ajusta el área de recorte para que esté dentro de los límites de la imagen
 */
export function validateCropArea(
  cropArea: PixelCrop,
  imageDimensions: ImageDimensions
): PixelCrop {
  const validated: PixelCrop = { ...cropArea };

  // Asegurar que x e y no sean negativos
  validated.x = Math.max(0, validated.x);
  validated.y = Math.max(0, validated.y);

  // Asegurar que el ancho y alto no excedan los límites
  validated.width = Math.min(validated.width, imageDimensions.width - validated.x);
  validated.height = Math.min(validated.height, imageDimensions.height - validated.y);

  // Asegurar que ancho y alto sean al menos 1
  validated.width = Math.max(1, validated.width);
  validated.height = Math.max(1, validated.height);

  return validated;
}

/**
 * Convierte un área de recorte en porcentaje a píxeles
 */
export function cropAreaToPixelCrop(
  cropArea: CropArea,
  imageDimensions: ImageDimensions
): PixelCrop {
  return {
    x: Math.round((cropArea.x / 100) * imageDimensions.width),
    y: Math.round((cropArea.y / 100) * imageDimensions.height),
    width: Math.round((cropArea.width / 100) * imageDimensions.width),
    height: Math.round((cropArea.height / 100) * imageDimensions.height),
  };
}

/**
 * Convierte un área de recorte en píxeles a porcentaje
 */
export function pixelCropToCropArea(
  pixelCrop: PixelCrop,
  imageDimensions: ImageDimensions
): CropArea {
  return {
    x: (pixelCrop.x / imageDimensions.width) * 100,
    y: (pixelCrop.y / imageDimensions.height) * 100,
    width: (pixelCrop.width / imageDimensions.width) * 100,
    height: (pixelCrop.height / imageDimensions.height) * 100,
  };
}

/**
 * Crea un área de recorte centrada con un aspect ratio específico
 */
export function createCenteredCropArea(
  imageDimensions: ImageDimensions,
  aspectRatio: number
): PixelCrop {
  const imageAspectRatio = imageDimensions.width / imageDimensions.height;

  let width: number;
  let height: number;

  if (imageAspectRatio > aspectRatio) {
    // La imagen es más ancha que el aspect ratio deseado
    height = imageDimensions.height;
    width = height * aspectRatio;
  } else {
    // La imagen es más alta que el aspect ratio deseado
    width = imageDimensions.width;
    height = width / aspectRatio;
  }

  const x = (imageDimensions.width - width) / 2;
  const y = (imageDimensions.height - height) / 2;

  return {
    x: Math.round(x),
    y: Math.round(y),
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Ajusta el área de recorte para mantener un aspect ratio específico
 */
export function adjustCropToAspectRatio(
  cropArea: PixelCrop,
  aspectRatio: number,
  imageDimensions: ImageDimensions
): PixelCrop {
  const currentAspectRatio = cropArea.width / cropArea.height;
  const adjustedCrop = { ...cropArea }; // ✅ Cambiado a const

  if (Math.abs(currentAspectRatio - aspectRatio) < 0.01) {
    // Ya tiene el aspect ratio correcto
    return adjustedCrop;
  }

  if (currentAspectRatio > aspectRatio) {
    // Demasiado ancho, ajustar el ancho
    adjustedCrop.width = Math.round(cropArea.height * aspectRatio);
  } else {
    // Demasiado alto, ajustar el alto
    adjustedCrop.height = Math.round(cropArea.width / aspectRatio);
  }

  // Asegurar que siga dentro de los límites de la imagen
  if (adjustedCrop.x + adjustedCrop.width > imageDimensions.width) {
    adjustedCrop.x = imageDimensions.width - adjustedCrop.width;
  }

  if (adjustedCrop.y + adjustedCrop.height > imageDimensions.height) {
    adjustedCrop.y = imageDimensions.height - adjustedCrop.height;
  }

  return adjustedCrop;
}

/**
 * Presets de aspect ratios comunes
 */
export const CROP_ASPECT_RATIOS = {
  'Libre': null,
  'Cuadrado 1:1': 1,
  'Vertical 4:5': 4 / 5,
  'Vertical 9:16': 9 / 16,
  'Horizontal 16:9': 16 / 9,
  'Horizontal 4:3': 4 / 3,
  'Horizontal 3:2': 3 / 2,
  'Instagram Post': 1,
  'Instagram Story': 9 / 16,
  'Facebook Cover': 2.7,
  'Twitter Header': 3,
  'YouTube Thumbnail': 16 / 9,
} as const;

/**
 * Presets de tamaños de recorte específicos
 */
export const CROP_SIZE_PRESETS = {
  'Instagram Post': { width: 1080, height: 1080 },
  'Instagram Story': { width: 1080, height: 1920 },
  'Facebook Post': { width: 1200, height: 630 },
  'Twitter Post': { width: 1200, height: 675 },
  'YouTube Thumbnail': { width: 1280, height: 720 },
  'Profile Picture': { width: 400, height: 400 },
  'Banner': { width: 1920, height: 500 },
} as const;

/**
 * Calcula el área de recorte para un preset específico
 */
export function getCropAreaForPreset(
  presetName: keyof typeof CROP_SIZE_PRESETS,
  imageDimensions: ImageDimensions
): PixelCrop {
  const preset = CROP_SIZE_PRESETS[presetName];
  const aspectRatio = preset.width / preset.height;

  return createCenteredCropArea(imageDimensions, aspectRatio);
}

/**
 * Recorta una imagen a un círculo
 */
export async function cropToCircle(
  imageUrl: string,
  diameter: number
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = diameter;
        canvas.height = diameter;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Crear máscara circular
        ctx.beginPath();
        ctx.arc(diameter / 2, diameter / 2, diameter / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        // Calcular dimensiones para centrar la imagen
        const scale = Math.max(diameter / img.width, diameter / img.height);
        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (diameter - scaledWidth) / 2;
        const y = (diameter - scaledHeight) / 2;

        // Dibujar imagen
        ctx.drawImage(img, x, y, scaledWidth, scaledHeight);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            const url = URL.createObjectURL(blob);
            const result: ProcessedImage = {
              blob,
              url,
              fileName: 'imagen-circular.png',
              format: 'png',
              size: blob.size,
              dimensions: { width: diameter, height: diameter },
            };

            resolve(result);
          },
          'image/png',
          1.0
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
 * Recorta una imagen con bordes redondeados
 */
export async function cropWithRoundedCorners(
  imageUrl: string,
  cropArea: PixelCrop,
  borderRadius: number
): Promise<ProcessedImage> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = cropArea.width;
        canvas.height = cropArea.height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          reject(new Error('No se pudo obtener el contexto del canvas'));
          return;
        }

        // Crear forma con bordes redondeados
        ctx.beginPath();
        ctx.moveTo(borderRadius, 0);
        ctx.lineTo(cropArea.width - borderRadius, 0);
        ctx.quadraticCurveTo(cropArea.width, 0, cropArea.width, borderRadius);
        ctx.lineTo(cropArea.width, cropArea.height - borderRadius);
        ctx.quadraticCurveTo(
          cropArea.width,
          cropArea.height,
          cropArea.width - borderRadius,
          cropArea.height
        );
        ctx.lineTo(borderRadius, cropArea.height);
        ctx.quadraticCurveTo(0, cropArea.height, 0, cropArea.height - borderRadius);
        ctx.lineTo(0, borderRadius);
        ctx.quadraticCurveTo(0, 0, borderRadius, 0);
        ctx.closePath();
        ctx.clip();

        // Dibujar imagen recortada
        ctx.drawImage(
          img,
          cropArea.x,
          cropArea.y,
          cropArea.width,
          cropArea.height,
          0,
          0,
          cropArea.width,
          cropArea.height
        );

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Error al crear blob'));
              return;
            }

            const url = URL.createObjectURL(blob);
            const result: ProcessedImage = {
              blob,
              url,
              fileName: 'imagen-redondeada.png',
              format: 'png',
              size: blob.size,
              dimensions: { width: cropArea.width, height: cropArea.height },
            };

            resolve(result);
          },
          'image/png',
          1.0
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
 * Valida si un área de recorte es válida
 */
export function isValidCropArea(
  cropArea: PixelCrop,
  imageDimensions: ImageDimensions
): boolean {
  return (
    cropArea.x >= 0 &&
    cropArea.y >= 0 &&
    cropArea.width > 0 &&
    cropArea.height > 0 &&
    cropArea.x + cropArea.width <= imageDimensions.width &&
    cropArea.y + cropArea.height <= imageDimensions.height
  );
}