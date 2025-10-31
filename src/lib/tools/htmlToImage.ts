// src/lib/tools/htmlToImage.ts

import type { ImageFormat } from '@/types';

export interface HtmlToImageOptions {
  format?: ImageFormat;
  quality?: number; // 0-100
  width?: number;
  height?: number;
  backgroundColor?: string;
  scale?: number; // 1-3 para mejor resolución
}

export interface HtmlToImageResult {
  blob: Blob;
  url: string;
  fileName: string;
  format: ImageFormat;
  size: number;
  dimensions: {
    width: number;
    height: number;
  };
}

/**
 * Convierte HTML/CSS a imagen usando html2canvas
 */
export const htmlToImage = async (
  htmlContent: string,
  options: HtmlToImageOptions = {}
): Promise<HtmlToImageResult> => {
  try {
    // Importar html2canvas dinámicamente
    const html2canvas = (await import('html2canvas')).default;

    // Crear un contenedor temporal
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    
    if (options.width) {
      container.style.width = `${options.width}px`;
    }
    if (options.height) {
      container.style.height = `${options.height}px`;
    }
    if (options.backgroundColor) {
      container.style.backgroundColor = options.backgroundColor;
    }

    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    // Esperar a que se carguen imágenes y fuentes
    await waitForResources(container);

    // Capturar con html2canvas
    const canvas = await html2canvas(container, {
      backgroundColor: options.backgroundColor || null,
      scale: options.scale || 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
      width: options.width,
      height: options.height,
    });

    // Limpiar
    document.body.removeChild(container);

    // Convertir canvas a blob
    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const fileName = generateFileName(format);

    const result: HtmlToImageResult = {
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

    return result;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al convertir HTML a imagen'
    );
  }
};

/**
 * Convierte HTML desde una URL
 */
export const urlToImage = async (
  url: string,
  options: HtmlToImageOptions = {}
): Promise<HtmlToImageResult> => {
  try {
    const html2canvas = (await import('html2canvas')).default;

    // Crear iframe para cargar la URL
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '-9999px';
    iframe.style.width = options.width ? `${options.width}px` : '1200px';
    iframe.style.height = options.height ? `${options.height}px` : '800px';
    iframe.src = url;

    document.body.appendChild(iframe);

    // Esperar a que cargue el iframe
    await new Promise((resolve) => {
      iframe.onload = resolve;
    });

    if (!iframe.contentDocument) {
      throw new Error('No se pudo acceder al contenido del iframe');
    }

    // Capturar el contenido del iframe
    const canvas = await html2canvas(iframe.contentDocument.body, {
      backgroundColor: options.backgroundColor || null,
      scale: options.scale || 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
    });

    document.body.removeChild(iframe);

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const blobUrl = URL.createObjectURL(blob);
    const fileName = generateFileName(format);

    return {
      blob,
      url: blobUrl,
      fileName,
      format,
      size: blob.size,
      dimensions: {
        width: canvas.width,
        height: canvas.height,
      },
    };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : 'Error al capturar la URL'
    );
  }
};

/**
 * Convierte un elemento DOM existente a imagen
 */
export const elementToImage = async (
  element: HTMLElement,
  options: HtmlToImageOptions = {}
): Promise<HtmlToImageResult> => {
  try {
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(element, {
      backgroundColor: options.backgroundColor || null,
      scale: options.scale || 2,
      logging: false,
      useCORS: true,
      allowTaint: false,
      width: options.width,
      height: options.height,
    });

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const fileName = generateFileName(format);

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
    throw new Error(
      error instanceof Error ? error.message : 'Error al convertir elemento a imagen'
    );
  }
};

/**
 * Convierte código HTML con estilos CSS inline
 */
export const htmlWithStylesToImage = async (
  html: string,
  css: string,
  options: HtmlToImageOptions = {}
): Promise<HtmlToImageResult> => {
  const styledHtml = `
    <style>${css}</style>
    ${html}
  `;

  return htmlToImage(styledHtml, options);
};

/**
 * Genera una captura de pantalla de toda la página actual
 */
export const fullPageScreenshot = async (
  options: HtmlToImageOptions = {}
): Promise<HtmlToImageResult> => {
  try {
    const html2canvas = (await import('html2canvas')).default;

    const canvas = await html2canvas(document.body, {
      backgroundColor: options.backgroundColor || '#ffffff',
      scale: options.scale || 1,
      logging: false,
      useCORS: true,
      allowTaint: false,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const format = options.format || 'png';
    const quality = (options.quality || 95) / 100;
    const blob = await canvasToBlob(canvas, format, quality);

    const url = URL.createObjectURL(blob);
    const fileName = generateFileName(format, 'screenshot');

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
    throw new Error(
      error instanceof Error ? error.message : 'Error al capturar la página'
    );
  }
};

// Helpers

/**
 * Espera a que se carguen todos los recursos (imágenes, fuentes, etc.)
 */
const waitForResources = async (container: HTMLElement): Promise<void> => {
  // Esperar imágenes
  const images = container.querySelectorAll('img');
  const imagePromises = Array.from(images).map((img) => {
    if (img.complete) return Promise.resolve();
    return new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  });

  // Esperar fuentes
  if (document.fonts) {
    await document.fonts.ready;
  }

  // Esperar todas las imágenes
  await Promise.all(imagePromises);

  // Dar un poco más de tiempo para que todo se renderice
  await new Promise((resolve) => setTimeout(resolve, 100));
};

/**
 * Convierte canvas a blob
 */
const canvasToBlob = (
  canvas: HTMLCanvasElement,
  format: ImageFormat,
  quality: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const mimeType = getMimeType(format);
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('No se pudo crear el blob'));
          return;
        }
        resolve(blob);
      },
      mimeType,
      quality
    );
  });
};

/**
 * Obtiene el MIME type según el formato
 */
const getMimeType = (format: ImageFormat): string => {
  const map: Record<ImageFormat, string> = {
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
    gif: 'image/gif',
    bmp: 'image/bmp',
    svg: 'image/svg+xml',
  };
  return map[format] || 'image/png';
};

/**
 * Genera nombre de archivo
 */
const generateFileName = (format: ImageFormat, prefix: string = 'html'): string => {
  const timestamp = new Date().getTime();
  return `${prefix}-${timestamp}.${format}`;
};

/**
 * Valida código HTML
 */
export const validateHtml = (html: string): { isValid: boolean; error?: string } => {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const parserError = doc.querySelector('parsererror');
    
    if (parserError) {
      return {
        isValid: false,
        error: 'HTML inválido: ' + parserError.textContent,
      };
    }

    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Error al validar HTML',
    };
  }
};

/**
 * Plantillas predefinidas de HTML
 */
export const htmlTemplates = {
  simple: `
    <div style="padding: 40px; font-family: Arial, sans-serif;">
      <h1 style="color: #333; margin-bottom: 20px;">Título</h1>
      <p style="color: #666; line-height: 1.6;">
        Este es un ejemplo de texto que puedes personalizar.
      </p>
    </div>
  `,
  
  card: `
    <div style="
      max-width: 400px;
      padding: 30px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      font-family: 'Arial', sans-serif;
    ">
      <h2 style="color: white; margin: 0 0 15px 0;">Tarjeta de Presentación</h2>
      <p style="color: rgba(255,255,255,0.9); margin: 0; line-height: 1.6;">
        Contenido de la tarjeta
      </p>
    </div>
  `,
  
  quote: `
    <div style="
      max-width: 600px;
      padding: 50px;
      background: #f8f9fa;
      border-left: 5px solid #007bff;
      font-family: Georgia, serif;
    ">
      <blockquote style="margin: 0; font-size: 24px; color: #333; font-style: italic;">
        "El único modo de hacer un gran trabajo es amar lo que haces."
      </blockquote>
      <p style="margin: 20px 0 0 0; color: #666; font-size: 16px;">
        — Steve Jobs
      </p>
    </div>
  `,
  
  social: `
    <div style="
      width: 1200px;
      height: 630px;
      background: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: 'Arial', sans-serif;
      position: relative;
    ">
      <div style="text-align: center; color: white;">
        <h1 style="font-size: 72px; margin: 0 0 20px 0; font-weight: bold;">
          Imagen para Redes Sociales
        </h1>
        <p style="font-size: 32px; margin: 0; opacity: 0.9;">
          1200 x 630px - Perfecta para Facebook, Twitter, LinkedIn
        </p>
      </div>
    </div>
  `,
};

