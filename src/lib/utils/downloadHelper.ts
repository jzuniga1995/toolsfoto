import type { ProcessedImage, ImageFormat } from '@/types';
import { sanitizeFileName } from '@/lib/utils/fileValidator';

// ===== DESCARGAR BLOB COMO ARCHIVO =====

export function downloadBlob(blob: Blob, fileName: string): void {
  try {
    // Crear URL temporal del blob
    const url = URL.createObjectURL(blob);
    
    // Crear elemento <a> temporal
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    
    // Añadir al DOM, hacer click y remover
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Liberar URL después de un tiempo
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error al descargar archivo:', error);
    throw new Error('No se pudo descargar el archivo');
  }
}

// ===== DESCARGAR IMAGEN PROCESADA =====

export function downloadProcessedImage(image: ProcessedImage): void {
  downloadBlob(image.blob, image.fileName);
}

// ===== DESCARGAR DESDE URL =====

export async function downloadFromUrl(url: string, fileName: string): Promise<void> {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    downloadBlob(blob, fileName);
  } catch (error) {
    console.error('Error al descargar desde URL:', error);
    throw new Error('No se pudo descargar la imagen desde la URL');
  }
}

// ===== DESCARGAR CANVAS COMO IMAGEN =====

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  fileName: string,
  format: ImageFormat = 'png',
  quality: number = 0.92
): void {
  try {
    const mimeType = `image/${format}`;
    
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          throw new Error('No se pudo crear el blob desde el canvas');
        }
        downloadBlob(blob, fileName);
      },
      mimeType,
      quality
    );
  } catch (error) {
    console.error('Error al descargar canvas:', error);
    throw new Error('No se pudo descargar la imagen del canvas');
  }
}

// ===== CONVERTIR DATA URL A BLOB =====

export function dataUrlToBlob(dataUrl: string): Blob {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  
  return new Blob([u8arr], { type: mime });
}

// ===== DESCARGAR DATA URL =====

export function downloadDataUrl(dataUrl: string, fileName: string): void {
  const blob = dataUrlToBlob(dataUrl);
  downloadBlob(blob, fileName);
}

// ===== GENERAR NOMBRE DE ARCHIVO PARA DESCARGA =====

export function generateDownloadFileName(
  originalFileName: string,
  suffix: string,
  format?: ImageFormat
): string {
  const nameWithoutExt = originalFileName.split('.').slice(0, -1).join('.');
  const cleanName = sanitizeFileName(nameWithoutExt);
  
  const extension = format || originalFileName.split('.').pop() || 'png';
  
  return `${cleanName}_${suffix}.${extension}`;
}

// ===== CREAR BLOB DESDE CANVAS =====

export function createBlobFromCanvas(
  canvas: HTMLCanvasElement,
  format: ImageFormat = 'png',
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const mimeType = `image/${format}`;
    
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('No se pudo crear blob desde canvas'));
        }
      },
      mimeType,
      quality
    );
  });
}

// ===== CREAR URL DESDE BLOB =====

export function createObjectUrl(blob: Blob): string {
  return URL.createObjectURL(blob);
}

// ===== REVOCAR URL DE OBJETO =====

export function revokeObjectUrl(url: string): void {
  URL.revokeObjectURL(url);
}

// ===== PREPARAR IMAGEN PARA DESCARGA =====

export async function prepareImageForDownload(
  canvas: HTMLCanvasElement,
  originalFileName: string,
  format: ImageFormat = 'png',
  quality: number = 0.92
): Promise<ProcessedImage> {
  try {
    const blob = await createBlobFromCanvas(canvas, format, quality);
    const url = createObjectUrl(blob);
    const fileName = generateDownloadFileName(originalFileName, 'processed', format);
    
    return {
      blob,
      url,
      fileName,
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
    };
  } catch (error) {
    console.error('Error al preparar imagen:', error);
    throw new Error('No se pudo preparar la imagen para descarga');
  }
}

// ===== DESCARGAR MÚLTIPLES IMÁGENES (ZIP en futuro) =====

export function downloadMultipleImages(images: ProcessedImage[]): void {
  // Por ahora descarga una por una
  // En el futuro se puede implementar ZIP
  images.forEach((image, index) => {
    setTimeout(() => {
      downloadProcessedImage(image);
    }, index * 500); // Delay de 500ms entre descargas
  });
}

// ===== COPIAR IMAGEN AL PORTAPAPELES =====

export async function copyImageToClipboard(blob: Blob): Promise<void> {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      throw new Error('Clipboard API no disponible');
    }
    
    const item = new ClipboardItem({ [blob.type]: blob });
    await navigator.clipboard.write([item]);
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error);
    throw new Error('No se pudo copiar la imagen al portapapeles');
  }
}

// ===== COMPARTIR IMAGEN (Web Share API) =====

export async function shareImage(
  blob: Blob,
  fileName: string,
  title: string = 'Compartir imagen'
): Promise<void> {
  try {
    if (!navigator.share) {
      throw new Error('Web Share API no disponible');
    }
    
    const file = new File([blob], fileName, { type: blob.type });
    
    await navigator.share({
      title,
      files: [file],
    });
  } catch (error) {
    console.error('Error al compartir:', error);
    throw new Error('No se pudo compartir la imagen');
  }
}

// ===== VERIFICAR SOPORTE DE WEB SHARE =====

export function canShare(): boolean {
  return 'share' in navigator && 'canShare' in navigator;
}

// ===== VERIFICAR SOPORTE DE CLIPBOARD =====

export function canCopyToClipboard(): boolean {
  return 'clipboard' in navigator && 'ClipboardItem' in window;
}