// src/lib/tools/meme.ts

import type { 
  ImageFile, 
  ProcessedImage, 
  MemeOptions,
  ImageFormat 
} from '@/types';

/**
 * Carga una imagen desde un File y retorna un HTMLImageElement
 */
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Error al cargar la imagen'));
    };

    img.src = url;
  });
};

/**
 * Dibuja texto de meme con estilo característico
 */
const drawMemeText = (
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  options: MemeOptions
): void => {
  const {
    fontSize = 48,
    fontColor = '#FFFFFF',
    fontFamily = 'Impact',
    strokeColor = '#000000',
    strokeWidth = 3,
  } = options;

  // Configurar fuente
  ctx.font = `bold ${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontColor;
  ctx.strokeStyle = strokeColor;
  ctx.lineWidth = strokeWidth;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Partir el texto en líneas si es muy largo
  const words = text.toUpperCase().split(' ');
  const lines: string[] = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const testLine = currentLine + ' ' + words[i];
    const metrics = ctx.measureText(testLine);
    
    if (metrics.width > maxWidth) {
      lines.push(currentLine);
      currentLine = words[i];
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);

  // Dibujar cada línea
  const lineHeight = fontSize * 1.2;
  lines.forEach((line, index) => {
    const lineY = y + (index * lineHeight);
    
    // Dibujar borde (stroke)
    ctx.strokeText(line, x, lineY);
    
    // Dibujar texto
    ctx.fillText(line, x, lineY);
  });
};

/**
 * Calcula el tamaño de fuente óptimo basado en el tamaño de la imagen
 */
const calculateOptimalFontSize = (
  canvasWidth: number,
  canvasHeight: number,
  baseFontSize: number = 48
): number => {
  // Escalar el tamaño de fuente basado en el ancho de la imagen
  const scaleFactor = canvasWidth / 800; // 800px es el ancho de referencia
  return Math.max(24, Math.min(100, baseFontSize * scaleFactor));
};

/**
 * Convierte el canvas a Blob
 */
const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: string = 'image/jpeg',
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
 * Crea un meme con texto superior e inferior
 * @param imageFile - Archivo de imagen
 * @param options - Opciones del meme
 * @returns Imagen procesada con el meme
 */
export const createMeme = async (
  imageFile: ImageFile,
  options: MemeOptions
): Promise<ProcessedImage> => {
  try {
    const { topText, bottomText } = options;

    // Validar que al menos haya un texto
    if (!topText.trim() && !bottomText.trim()) {
      throw new Error('Debes proporcionar al menos un texto (superior o inferior)');
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

    // Calcular tamaño de fuente óptimo si no se especifica
    const fontSize = options.fontSize || calculateOptimalFontSize(canvas.width, canvas.height);
    const optionsWithFontSize = { ...options, fontSize };

    // Padding desde los bordes
    const padding = 20;
    const maxTextWidth = canvas.width - (padding * 2);

    // Dibujar texto superior
    if (topText.trim()) {
      const topY = padding;
      drawMemeText(
        ctx,
        topText,
        canvas.width / 2,
        topY,
        maxTextWidth,
        optionsWithFontSize
      );
    }

    // Dibujar texto inferior
    if (bottomText.trim()) {
      // Calcular altura del texto para posicionarlo desde abajo
      ctx.font = `bold ${fontSize}px ${options.fontFamily || 'Impact'}`;
      const words = bottomText.toUpperCase().split(' ');
      let lines = 1;
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const testLine = currentLine + ' ' + words[i];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth) {
          lines++;
          currentLine = words[i];
        } else {
          currentLine = testLine;
        }
      }

      const lineHeight = fontSize * 1.2;
      const totalTextHeight = lines * lineHeight;
      const bottomY = canvas.height - totalTextHeight - padding;

      drawMemeText(
        ctx,
        bottomText,
        canvas.width / 2,
        bottomY,
        maxTextWidth,
        optionsWithFontSize
      );
    }

    // Determinar formato de salida (JPEG para memes por defecto)
    const outputFormat = 'image/jpeg';
    const quality = 0.92;

    // Convertir a blob
    const blob = await canvasToBlob(canvas, outputFormat, quality);

    // Crear URL para preview
    const url = URL.createObjectURL(blob);

    // Generar nombre de archivo
    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_meme.jpg`;

    return {
      blob,
      url,
      fileName,
      format: 'jpg' as ImageFormat,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
    };
  } catch (error) {
    throw new Error(
      `Error al crear el meme: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
};

/**
 * Crea un meme con texto superior
 */
export const createTopTextMeme = async (
  imageFile: ImageFile,
  topText: string
): Promise<ProcessedImage> => {
  return createMeme(imageFile, {
    topText,
    bottomText: '',
    fontFamily: 'Impact',
    fontColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
  });
};

/**
 * Crea un meme con texto inferior
 */
export const createBottomTextMeme = async (
  imageFile: ImageFile,
  bottomText: string
): Promise<ProcessedImage> => {
  return createMeme(imageFile, {
    topText: '',
    bottomText,
    fontFamily: 'Impact',
    fontColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
  });
};

/**
 * Crea un meme clásico con texto arriba y abajo
 */
export const createClassicMeme = async (
  imageFile: ImageFile,
  topText: string,
  bottomText: string
): Promise<ProcessedImage> => {
  return createMeme(imageFile, {
    topText,
    bottomText,
    fontFamily: 'Impact',
    fontColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
  });
};

/**
 * Crea un meme con estilo personalizado
 */
export const createCustomMeme = async (
  imageFile: ImageFile,
  topText: string,
  bottomText: string,
  fontSize: number,
  fontColor: string,
  strokeColor: string,
  strokeWidth: number,
  fontFamily: string = 'Impact'
): Promise<ProcessedImage> => {
  return createMeme(imageFile, {
    topText,
    bottomText,
    fontSize,
    fontColor,
    fontFamily,
    strokeColor,
    strokeWidth,
  });
};

/**
 * Plantillas predefinidas de memes populares
 */
export const memeTemplates = {
  classic: {
    fontFamily: 'Impact',
    fontSize: 48,
    fontColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 3,
  },
  modern: {
    fontFamily: 'Arial Black',
    fontSize: 40,
    fontColor: '#FFFFFF',
    strokeColor: '#000000',
    strokeWidth: 2,
  },
  minimal: {
    fontFamily: 'Helvetica',
    fontSize: 36,
    fontColor: '#FFFFFF',
    strokeColor: '#333333',
    strokeWidth: 2,
  },
  bold: {
    fontFamily: 'Impact',
    fontSize: 56,
    fontColor: '#FFFF00',
    strokeColor: '#000000',
    strokeWidth: 4,
  },
} as const;

/**
 * Crea un meme usando una plantilla predefinida
 */
export const createMemeFromTemplate = async (
  imageFile: ImageFile,
  topText: string,
  bottomText: string,
  template: keyof typeof memeTemplates
): Promise<ProcessedImage> => {
  const templateOptions = memeTemplates[template];
  
  return createMeme(imageFile, {
    topText,
    bottomText,
    ...templateOptions,
  });
};