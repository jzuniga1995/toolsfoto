// src/lib/tools/watermark.ts

import type { 
  ImageFile, 
  ProcessedImage, 
  WatermarkOptions,
  ImageFormat 
} from '@/types';

/**
 * Carga una imagen desde un File y retorna un HTMLImageElement
 */
const loadImage = (file: File | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (typeof file === 'string') {
      // Es una URL
      img.crossOrigin = 'anonymous';
      img.src = file;
    } else {
      // Es un File
      const url = URL.createObjectURL(file);
      img.onload = () => URL.revokeObjectURL(url);
      img.src = url;
    }

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Error al cargar la imagen'));
  });
};

/**
 * Calcula la posición de la marca de agua según la opción seleccionada
 */
const calculateWatermarkPosition = (
  canvasWidth: number,
  canvasHeight: number,
  watermarkWidth: number,
  watermarkHeight: number,
  position: WatermarkOptions['position'],
  padding: number = 20
): { x: number; y: number } => {
  switch (position) {
    case 'top-left':
      return { x: padding, y: padding };
    
    case 'top-right':
      return { 
        x: canvasWidth - watermarkWidth - padding, 
        y: padding 
      };
    
    case 'bottom-left':
      return { 
        x: padding, 
        y: canvasHeight - watermarkHeight - padding 
      };
    
    case 'bottom-right':
      return { 
        x: canvasWidth - watermarkWidth - padding, 
        y: canvasHeight - watermarkHeight - padding 
      };
    
    case 'center':
      return { 
        x: (canvasWidth - watermarkWidth) / 2, 
        y: (canvasHeight - watermarkHeight) / 2 
      };
    
    default:
      return { x: padding, y: padding };
  }
};

/**
 * Aplica marca de agua de texto a una imagen
 */
const applyTextWatermark = (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: WatermarkOptions
): void => {
  const {
    text = '',
    position = 'bottom-right',
    opacity = 0.5,
    fontSize = 24,
    fontColor = '#FFFFFF',
    fontFamily = 'Arial',
  } = options;

  // Configurar estilo del texto
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;
  ctx.globalAlpha = opacity;

  // Medir el texto
  const textMetrics = ctx.measureText(text);
  const textWidth = textMetrics.width;
  const textHeight = fontSize; // Aproximación de altura

  // Calcular posición
  const { x, y } = calculateWatermarkPosition(
    canvas.width,
    canvas.height,
    textWidth,
    textHeight,
    position
  );

  // Agregar sombra para mejor legibilidad
  ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;

  // Dibujar texto
  ctx.fillText(text, x, y + fontSize);

  // Resetear configuración
  ctx.globalAlpha = 1;
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
};

/**
 * Aplica marca de agua de imagen a una imagen
 */
const applyImageWatermark = async (
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  options: WatermarkOptions
): Promise<void> => {
  const {
    imageUrl = '',
    position = 'bottom-right',
    opacity = 0.5,
  } = options;

  if (!imageUrl) {
    throw new Error('URL de imagen de marca de agua no proporcionada');
  }

  // Cargar imagen de marca de agua
  const watermarkImg = await loadImage(imageUrl);

  // Calcular tamaño de la marca de agua (máximo 20% del tamaño de la imagen)
  const maxWatermarkWidth = canvas.width * 0.2;
  const maxWatermarkHeight = canvas.height * 0.2;

  let watermarkWidth = watermarkImg.width;
  let watermarkHeight = watermarkImg.height;

  // Escalar si es necesario
  if (watermarkWidth > maxWatermarkWidth || watermarkHeight > maxWatermarkHeight) {
    const scale = Math.min(
      maxWatermarkWidth / watermarkWidth,
      maxWatermarkHeight / watermarkHeight
    );
    watermarkWidth *= scale;
    watermarkHeight *= scale;
  }

  // Calcular posición
  const { x, y } = calculateWatermarkPosition(
    canvas.width,
    canvas.height,
    watermarkWidth,
    watermarkHeight,
    position
  );

  // Aplicar opacidad y dibujar
  ctx.globalAlpha = opacity;
  ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
  ctx.globalAlpha = 1;
};

/**
 * Convierte el canvas a Blob
 */
const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: string = 'image/png',
  quality: number = 0.92
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Error al convertir canvas a blob'));
        }
      },
      format,
      quality
    );
  });
};

/**
 * Agrega marca de agua a una imagen
 * @param imageFile - Archivo de imagen
 * @param options - Opciones de marca de agua
 * @returns Imagen procesada con marca de agua
 */
export const addWatermark = async (
  imageFile: ImageFile,
  options: WatermarkOptions
): Promise<ProcessedImage> => {
  try {
    // Validar que se proporcione texto o imagen
    if (!options.text && !options.imageUrl) {
      throw new Error('Debes proporcionar texto o una imagen para la marca de agua');
    }

    // Cargar imagen original
    const img = await loadImage(imageFile.file);

    // Crear canvas con las dimensiones de la imagen
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('No se pudo obtener el contexto del canvas');
    }

    // Dibujar imagen original
    ctx.drawImage(img, 0, 0);

    // Aplicar marca de agua (texto o imagen)
    if (options.text) {
      applyTextWatermark(ctx, canvas, options);
    } else if (options.imageUrl) {
      await applyImageWatermark(ctx, canvas, options);
    }

    // Determinar formato de salida
    const outputFormat = imageFile.type;
    const quality = 0.95; // Alta calidad para marca de agua

    // Convertir a blob
    const blob = await canvasToBlob(canvas, outputFormat, quality);

    // Crear URL para preview
    const url = URL.createObjectURL(blob);

    // Generar nombre de archivo
    const fileExtension = imageFile.name.split('.').pop() || 'png';
    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_watermarked.${fileExtension}`;

    return {
      blob,
      url,
      fileName,
      format: fileExtension as ImageFormat,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
    };
  } catch (error) {
    throw new Error(
      `Error al agregar marca de agua: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
};

/**
 * Agrega marca de agua de texto en la esquina inferior derecha
 */
export const addTextWatermark = async (
  imageFile: ImageFile,
  text: string,
  opacity: number = 0.5
): Promise<ProcessedImage> => {
  return addWatermark(imageFile, {
    text,
    position: 'bottom-right',
    opacity,
    fontSize: 24,
    fontColor: '#FFFFFF',
    fontFamily: 'Arial',
  });
};

/**
 * Agrega marca de agua de imagen en la esquina inferior derecha
 */
export const addImageWatermark = async (
  imageFile: ImageFile,
  watermarkImageUrl: string,
  opacity: number = 0.5
): Promise<ProcessedImage> => {
  return addWatermark(imageFile, {
    imageUrl: watermarkImageUrl,
    position: 'bottom-right',
    opacity,
  });
};

/**
 * Agrega marca de agua de texto centrada
 */
export const addCenteredTextWatermark = async (
  imageFile: ImageFile,
  text: string,
  fontSize: number = 48,
  opacity: number = 0.3
): Promise<ProcessedImage> => {
  return addWatermark(imageFile, {
    text,
    position: 'center',
    opacity,
    fontSize,
    fontColor: '#FFFFFF',
    fontFamily: 'Arial',
  });
};

/**
 * Agrega marca de agua de texto personalizada
 */
export const addCustomTextWatermark = async (
  imageFile: ImageFile,
  text: string,
  position: WatermarkOptions['position'],
  fontSize: number,
  fontColor: string,
  opacity: number,
  fontFamily: string = 'Arial'
): Promise<ProcessedImage> => {
  return addWatermark(imageFile, {
    text,
    position,
    opacity,
    fontSize,
    fontColor,
    fontFamily,
  });
};

/**
 * Agrega marca de agua de imagen personalizada
 */
export const addCustomImageWatermark = async (
  imageFile: ImageFile,
  watermarkImageUrl: string,
  position: WatermarkOptions['position'],
  opacity: number
): Promise<ProcessedImage> => {
  return addWatermark(imageFile, {
    imageUrl: watermarkImageUrl,
    position,
    opacity,
  });
};