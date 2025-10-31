import type { ImageDimensions, ImageFormat } from '@/types';

// ===== CARGAR IMAGEN DESDE FILE =====

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
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
}

// ===== CARGAR IMAGEN DESDE URL =====

export function loadImageFromUrl(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Error al cargar la imagen desde URL'));

    img.src = url;
  });
}

// ===== OBTENER DIMENSIONES DE IMAGEN =====

export async function getImageDimensions(file: File): Promise<ImageDimensions> {
  const img = await loadImageFromFile(file);
  return {
    width: img.naturalWidth,
    height: img.naturalHeight,
  };
}

// ===== CREAR CANVAS DESDE IMAGEN =====

export function createCanvasFromImage(
  img: HTMLImageElement,
  width?: number,
  height?: number
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D del canvas');
  }

  canvas.width = width || img.width;
  canvas.height = height || img.height;

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
}

// ===== REDIMENSIONAR MANTENIENDO ASPECTO =====

export function calculateAspectRatioDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number
): ImageDimensions {
  const aspectRatio = originalWidth / originalHeight;

  if (targetWidth && !targetHeight) {
    return {
      width: targetWidth,
      height: Math.round(targetWidth / aspectRatio),
    };
  }

  if (targetHeight && !targetWidth) {
    return {
      width: Math.round(targetHeight * aspectRatio),
      height: targetHeight,
    };
  }

  if (targetWidth && targetHeight) {
    return {
      width: targetWidth,
      height: targetHeight,
    };
  }

  return {
    width: originalWidth,
    height: originalHeight,
  };
}

// ===== CONVERTIR FILE A DATA URL =====

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Error al convertir archivo a Data URL'));
      }
    };

    reader.onerror = () => reject(new Error('Error al leer el archivo'));

    reader.readAsDataURL(file);
  });
}

// ===== CONVERTIR CANVAS A BLOB =====

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: ImageFormat = 'png',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('No se pudo crear el blob'));
        }
      },
      mimeType,
      quality
    );
  });
}

// ===== CONVERTIR CANVAS A DATA URL =====

export function canvasToDataUrl(
  canvas: HTMLCanvasElement,
  format: ImageFormat = 'png',
  quality: number = 0.92
): string {
  const mimeType = `image/${format === 'jpg' ? 'jpeg' : format}`;
  return canvas.toDataURL(mimeType, quality);
}

// ===== CREAR CANVAS VACÍO =====

export function createCanvas(width: number, height: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

// ===== OBTENER CONTEXTO 2D =====

export function getCanvasContext(canvas: HTMLCanvasElement): CanvasRenderingContext2D {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo obtener el contexto 2D');
  }
  return ctx;
}

// ===== LIMPIAR CANVAS =====

export function clearCanvas(canvas: HTMLCanvasElement): void {
  const ctx = getCanvasContext(canvas);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===== CLONAR CANVAS =====

export function cloneCanvas(original: HTMLCanvasElement): HTMLCanvasElement {
  const clone = createCanvas(original.width, original.height);
  const ctx = getCanvasContext(clone);
  ctx.drawImage(original, 0, 0);
  return clone;
}

// ===== GIRAR CANVAS =====

export function rotateCanvas(
  canvas: HTMLCanvasElement,
  angle: number
): HTMLCanvasElement {
  const radians = (angle * Math.PI) / 180;
  const cos = Math.abs(Math.cos(radians));
  const sin = Math.abs(Math.sin(radians));

  const newWidth = canvas.width * cos + canvas.height * sin;
  const newHeight = canvas.width * sin + canvas.height * cos;

  const newCanvas = createCanvas(Math.round(newWidth), Math.round(newHeight));
  const ctx = getCanvasContext(newCanvas);

  ctx.translate(newCanvas.width / 2, newCanvas.height / 2);
  ctx.rotate(radians);
  ctx.drawImage(canvas, -canvas.width / 2, -canvas.height / 2);

  return newCanvas;
}

// ===== VOLTEAR CANVAS (FLIP) =====

export function flipCanvas(
  canvas: HTMLCanvasElement,
  horizontal: boolean = true
): HTMLCanvasElement {
  const newCanvas = createCanvas(canvas.width, canvas.height);
  const ctx = getCanvasContext(newCanvas);

  if (horizontal) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  } else {
    ctx.translate(0, canvas.height);
    ctx.scale(1, -1);
  }

  ctx.drawImage(canvas, 0, 0);

  return newCanvas;
}

// ===== APLICAR ESCALA DE GRISES =====

export function applyGrayscale(canvas: HTMLCanvasElement): HTMLCanvasElement {
  const newCanvas = cloneCanvas(canvas);
  const ctx = getCanvasContext(newCanvas);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
    data[i] = gray;
    data[i + 1] = gray;
    data[i + 2] = gray;
  }

  ctx.putImageData(imageData, 0, 0);
  return newCanvas;
}

// ===== AJUSTAR BRILLO =====

export function adjustBrightness(
  canvas: HTMLCanvasElement,
  brightness: number
): HTMLCanvasElement {
  const newCanvas = cloneCanvas(canvas);
  const ctx = getCanvasContext(newCanvas);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] += brightness;
    data[i + 1] += brightness;
    data[i + 2] += brightness;
  }

  ctx.putImageData(imageData, 0, 0);
  return newCanvas;
}

// ===== AJUSTAR CONTRASTE =====

export function adjustContrast(
  canvas: HTMLCanvasElement,
  contrast: number
): HTMLCanvasElement {
  const newCanvas = cloneCanvas(canvas);
  const ctx = getCanvasContext(newCanvas);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (let i = 0; i < data.length; i += 4) {
    data[i] = factor * (data[i] - 128) + 128;
    data[i + 1] = factor * (data[i + 1] - 128) + 128;
    data[i + 2] = factor * (data[i + 2] - 128) + 128;
  }

  ctx.putImageData(imageData, 0, 0);
  return newCanvas;
}

// ===== RECORTAR CANVAS =====

export function cropCanvas(
  canvas: HTMLCanvasElement,
  x: number,
  y: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const newCanvas = createCanvas(width, height);
  const ctx = getCanvasContext(newCanvas);

  ctx.drawImage(
    canvas,
    x,
    y,
    width,
    height,
    0,
    0,
    width,
    height
  );

  return newCanvas;
}

// ===== REDIMENSIONAR CANVAS =====

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  smooth: boolean = true
): HTMLCanvasElement {
  const newCanvas = createCanvas(width, height);
  const ctx = getCanvasContext(newCanvas);

  if (smooth) {
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  } else {
    ctx.imageSmoothingEnabled = false;
  }

  ctx.drawImage(canvas, 0, 0, width, height);

  return newCanvas;
}

// ===== AÑADIR TEXTO A CANVAS =====

export interface TextOptions {
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  fontFamily?: string;
  color?: string;
  strokeColor?: string;
  strokeWidth?: number;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
}

export function addTextToCanvas(
  canvas: HTMLCanvasElement,
  options: TextOptions
): HTMLCanvasElement {
  const newCanvas = cloneCanvas(canvas);
  const ctx = getCanvasContext(newCanvas);

  ctx.font = `${options.fontSize || 48}px ${options.fontFamily || 'Arial'}`;
  ctx.fillStyle = options.color || '#ffffff';
  ctx.textAlign = options.align || 'center';
  ctx.textBaseline = options.baseline || 'middle';

  if (options.strokeColor && options.strokeWidth) {
    ctx.strokeStyle = options.strokeColor;
    ctx.lineWidth = options.strokeWidth;
    ctx.strokeText(options.text, options.x, options.y);
  }

  ctx.fillText(options.text, options.x, options.y);

  return newCanvas;
}

// ===== CREAR PREVIEW THUMBNAIL =====

export function createThumbnail(
  canvas: HTMLCanvasElement,
  maxSize: number = 200
): HTMLCanvasElement {
  const scale = Math.min(maxSize / canvas.width, maxSize / canvas.height);
  const width = Math.round(canvas.width * scale);
  const height = Math.round(canvas.height * scale);

  return resizeCanvas(canvas, width, height);
}

// ===== CONVERTIR BLOB A FILE =====

export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

// ===== COMPRIMIR IMAGEN BÁSICA =====

export async function compressImage(
  file: File,
  quality: number = 0.8
): Promise<Blob> {
  const img = await loadImageFromFile(file);
  const canvas = createCanvasFromImage(img);
  return canvasToBlob(canvas, 'jpeg', quality);
}