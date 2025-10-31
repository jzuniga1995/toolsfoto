// src/lib/tools/rotate.ts

import type { 
  ImageFile, 
  ProcessedImage, 
  RotateOptions,
  ImageDimensions,
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
 * Calcula las nuevas dimensiones después de rotar
 */
const calculateRotatedDimensions = (
  width: number,
  height: number,
  angle: number
): ImageDimensions => {
  // Normalizar el ángulo a 0-360
  const normalizedAngle = ((angle % 360) + 360) % 360;
  
  // Para ángulos de 90° y 270°, invertir dimensiones
  if (normalizedAngle === 90 || normalizedAngle === 270) {
    return { width: height, height: width };
  }
  
  // Para otros ángulos, calcular el bounding box
  const radians = (normalizedAngle * Math.PI) / 180;
  const sin = Math.abs(Math.sin(radians));
  const cos = Math.abs(Math.cos(radians));
  
  const newWidth = Math.ceil(width * cos + height * sin);
  const newHeight = Math.ceil(width * sin + height * cos);
  
  return { width: newWidth, height: newHeight };
};

/**
 * Rota una imagen en el canvas
 */
const rotateImageOnCanvas = (
  img: HTMLImageElement,
  options: RotateOptions
): { canvas: HTMLCanvasElement; dimensions: ImageDimensions } => {
  const { angle, backgroundColor = '#FFFFFF' } = options;
  
  // Calcular nuevas dimensiones
  const newDimensions = calculateRotatedDimensions(
    img.width,
    img.height,
    angle
  );
  
  // Crear canvas con las nuevas dimensiones
  const canvas = document.createElement('canvas');
  canvas.width = newDimensions.width;
  canvas.height = newDimensions.height;
  
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto del canvas');
  }
  
  // Aplicar fondo si el formato no soporta transparencia
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  
  // Mover el origen al centro del canvas
  ctx.translate(canvas.width / 2, canvas.height / 2);
  
  // Rotar
  const radians = (angle * Math.PI) / 180;
  ctx.rotate(radians);
  
  // Dibujar la imagen centrada
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  
  return { canvas, dimensions: newDimensions };
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
 * Rota una imagen según el ángulo especificado
 * @param imageFile - Archivo de imagen a rotar
 * @param options - Opciones de rotación
 * @returns Imagen procesada
 */
export const rotateImage = async (
  imageFile: ImageFile,
  options: RotateOptions
): Promise<ProcessedImage> => {
  try {
    // Validar ángulo
    if (options.angle === 0) {
      throw new Error('El ángulo debe ser diferente de 0');
    }

    // Cargar la imagen
    const img = await loadImage(imageFile.file);

    // Rotar en canvas
    const { canvas, dimensions } = rotateImageOnCanvas(img, options);

    // Determinar formato de salida
    const outputFormat = imageFile.type;
    const quality = options.angle % 90 === 0 ? 1 : 0.92; // Máxima calidad para rotaciones exactas

    // Convertir a blob
    const blob = await canvasToBlob(canvas, outputFormat, quality);

    // Crear URL para preview
    const url = URL.createObjectURL(blob);

    // Generar nombre de archivo
    const fileExtension = imageFile.name.split('.').pop() || 'png';
    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_rotated_${options.angle}deg.${fileExtension}`;

    return {
      blob,
      url,
      fileName,
      format: fileExtension as ImageFormat,
      size: blob.size,
      dimensions,
    };
  } catch (error) {
    throw new Error(
      `Error al rotar la imagen: ${error instanceof Error ? error.message : 'Error desconocido'}`
    );
  }
};

/**
 * Rota una imagen 90° a la derecha
 */
export const rotateRight = async (
  imageFile: ImageFile
): Promise<ProcessedImage> => {
  return rotateImage(imageFile, { angle: 90 });
};

/**
 * Rota una imagen 90° a la izquierda
 */
export const rotateLeft = async (
  imageFile: ImageFile
): Promise<ProcessedImage> => {
  return rotateImage(imageFile, { angle: -90 });
};

/**
 * Voltea una imagen 180°
 */
export const flip180 = async (
  imageFile: ImageFile
): Promise<ProcessedImage> => {
  return rotateImage(imageFile, { angle: 180 });
};

/**
 * Rota una imagen a un ángulo personalizado
 */
export const rotateCustom = async (
  imageFile: ImageFile,
  angle: number,
  backgroundColor?: string
): Promise<ProcessedImage> => {
  return rotateImage(imageFile, { angle, backgroundColor });
};

/**
 * Voltea horizontalmente (espejo)
 */
export const flipHorizontal = async (
  imageFile: ImageFile
): Promise<ProcessedImage> => {
  try {
    const img = await loadImage(imageFile.file);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Error con canvas');
    
    // Voltear horizontalmente
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(img, 0, 0);
    
    const blob = await canvasToBlob(canvas, imageFile.type);
    const url = URL.createObjectURL(blob);
    
    const fileExtension = imageFile.name.split('.').pop() || 'png';
    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_flipped_h.${fileExtension}`;
    
    return {
      blob,
      url,
      fileName,
      format: fileExtension as ImageFormat,
      size: blob.size,
      dimensions: { width: img.width, height: img.height },
    };
  } catch (error) {
    throw new Error(`Error al voltear horizontalmente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};

/**
 * Voltea verticalmente
 */
export const flipVertical = async (
  imageFile: ImageFile
): Promise<ProcessedImage> => {
  try {
    const img = await loadImage(imageFile.file);
    
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Error con canvas');
    
    // Voltear verticalmente
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
    ctx.drawImage(img, 0, 0);
    
    const blob = await canvasToBlob(canvas, imageFile.type);
    const url = URL.createObjectURL(blob);
    
    const fileExtension = imageFile.name.split('.').pop() || 'png';
    const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
    const fileName = `${baseName}_flipped_v.${fileExtension}`;
    
    return {
      blob,
      url,
      fileName,
      format: fileExtension as ImageFormat,
      size: blob.size,
      dimensions: { width: img.width, height: img.height },
    };
  } catch (error) {
    throw new Error(`Error al voltear verticalmente: ${error instanceof Error ? error.message : 'Error desconocido'}`);
  }
};