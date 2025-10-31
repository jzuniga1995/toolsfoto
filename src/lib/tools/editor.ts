// src/lib/tools/editor.ts

import type { 
  ImageFile, 
  ProcessedImage, 
  ImageFormat,
  ImageDimensions 
} from '@/types';

export interface EditorSettings {
  brightness: number;      // -100 a 100
  contrast: number;        // -100 a 100
  saturation: number;      // -100 a 100
  blur: number;           // 0 a 20
  grayscale: number;      // 0 a 100
  sepia: number;          // 0 a 100
  hueRotate: number;      // 0 a 360
  invert: number;         // 0 a 100
  opacity: number;        // 0 a 100
  sharpen: number;        // 0 a 100
  temperature: number;    // -100 a 100 (tono cálido/frío)
  tint: number;          // -100 a 100 (tono verde/magenta)
  vignette: number;      // 0 a 100
  noise: number;         // 0 a 100
}

export interface EditorOptions {
  format?: ImageFormat;
  quality?: number;        // 0-100
  maintainOriginalSize?: boolean;
}

export const defaultSettings: EditorSettings = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
  opacity: 100,
  sharpen: 0,
  temperature: 0,
  tint: 0,
  vignette: 0,
  noise: 0,
};

/**
 * Convierte los settings del editor a un string CSS filter
 */
export const settingsToFilterString = (settings: EditorSettings): string => {
  const filters: string[] = [];

  if (settings.brightness !== 0) {
    filters.push(`brightness(${1 + settings.brightness / 100})`);
  }
  
  if (settings.contrast !== 0) {
    filters.push(`contrast(${1 + settings.contrast / 100})`);
  }
  
  if (settings.saturation !== 0) {
    filters.push(`saturate(${1 + settings.saturation / 100})`);
  }
  
  if (settings.blur > 0) {
    filters.push(`blur(${settings.blur}px)`);
  }
  
  if (settings.grayscale > 0) {
    filters.push(`grayscale(${settings.grayscale}%)`);
  }
  
  if (settings.sepia > 0) {
    filters.push(`sepia(${settings.sepia}%)`);
  }
  
  if (settings.hueRotate !== 0) {
    filters.push(`hue-rotate(${settings.hueRotate}deg)`);
  }
  
  if (settings.invert > 0) {
    filters.push(`invert(${settings.invert}%)`);
  }
  
  if (settings.opacity !== 100) {
    filters.push(`opacity(${settings.opacity}%)`);
  }

  return filters.join(' ');
};

/**
 * Aplica filtros a una imagen usando Canvas
 */
export const applyEditorFilters = async (
  imageFile: ImageFile,
  settings: EditorSettings,
  options: EditorOptions = {}
): Promise<ProcessedImage> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('No se pudo obtener el contexto del canvas');
        }

        // Configurar tamaño del canvas
        canvas.width = imageFile.width || img.width;
        canvas.height = imageFile.height || img.height;

        // Aplicar filtros CSS
        ctx.filter = settingsToFilterString(settings);

        // Aplicar temperatura (warm/cool)
        if (settings.temperature !== 0) {
          applyTemperature(ctx, canvas.width, canvas.height, settings.temperature);
        }

        // Aplicar tint (green/magenta)
        if (settings.tint !== 0) {
          applyTint(ctx, canvas.width, canvas.height, settings.tint);
        }

        // Dibujar imagen con filtros
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Aplicar sharpen si es necesario
        if (settings.sharpen > 0) {
          applySharpen(ctx, canvas.width, canvas.height, settings.sharpen);
        }

        // Aplicar vignette si es necesario
        if (settings.vignette > 0) {
          applyVignette(ctx, canvas.width, canvas.height, settings.vignette);
        }

        // Aplicar noise/grain si es necesario
        if (settings.noise > 0) {
          applyNoise(ctx, canvas.width, canvas.height, settings.noise);
        }

        // Convertir canvas a blob
        const format = options.format || getFormatFromMimeType(imageFile.type);
        const quality = (options.quality || 95) / 100;
        const mimeType = getMimeType(format);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('No se pudo crear el blob de la imagen'));
              return;
            }

            const url = URL.createObjectURL(blob);
            const fileName = generateFileName(imageFile.name, format);

            const result: ProcessedImage = {
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

    img.src = imageFile.preview;
  });
};

/**
 * Aplica efecto de temperatura (cálido/frío)
 */
const applyTemperature = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  temperature: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = temperature / 100;

  for (let i = 0; i < data.length; i += 4) {
    if (factor > 0) {
      // Warm (aumentar rojo, disminuir azul)
      data[i] += factor * 30;     // R
      data[i + 2] -= factor * 30; // B
    } else {
      // Cool (disminuir rojo, aumentar azul)
      data[i] += factor * 30;     // R
      data[i + 2] -= factor * 30; // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Aplica efecto de tint (verde/magenta)
 */
const applyTint = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  tint: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = tint / 100;

  for (let i = 0; i < data.length; i += 4) {
    if (factor > 0) {
      // Magenta (aumentar rojo y azul, disminuir verde)
      data[i] += factor * 30;     // R
      data[i + 1] -= factor * 30; // G
      data[i + 2] += factor * 30; // B
    } else {
      // Green (aumentar verde, disminuir rojo y azul)
      data[i] += factor * 30;     // R
      data[i + 1] -= factor * 30; // G
      data[i + 2] += factor * 30; // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Aplica efecto sharpen (nitidez)
 */
const applySharpen = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = amount / 50; // Normalizar el amount

  // Kernel de sharpen
  const kernel = [
    0, -factor, 0,
    -factor, 1 + 4 * factor, -factor,
    0, -factor, 0
  ];

  const side = Math.round(Math.sqrt(kernel.length));
  const halfSide = Math.floor(side / 2);
  const output = ctx.createImageData(width, height);
  const dst = output.data;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const dstOff = (y * width + x) * 4;
      let r = 0, g = 0, b = 0;

      for (let cy = 0; cy < side; cy++) {
        for (let cx = 0; cx < side; cx++) {
          const scy = y + cy - halfSide;
          const scx = x + cx - halfSide;

          if (scy >= 0 && scy < height && scx >= 0 && scx < width) {
            const srcOff = (scy * width + scx) * 4;
            const wt = kernel[cy * side + cx];

            r += data[srcOff] * wt;
            g += data[srcOff + 1] * wt;
            b += data[srcOff + 2] * wt;
          }
        }
      }

      dst[dstOff] = Math.min(255, Math.max(0, r));
      dst[dstOff + 1] = Math.min(255, Math.max(0, g));
      dst[dstOff + 2] = Math.min(255, Math.max(0, b));
      dst[dstOff + 3] = data[dstOff + 3]; // Alpha
    }
  }

  ctx.putImageData(output, 0, 0);
};

/**
 * Aplica efecto vignette (viñeta)
 */
const applyVignette = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const centerX = width / 2;
  const centerY = height / 2;
  const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
  const factor = amount / 100;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const vignette = 1 - (distance / maxDistance) * factor;

      data[index] *= vignette;     // R
      data[index + 1] *= vignette; // G
      data[index + 2] *= vignette; // B
    }
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Aplica efecto de ruido/grano
 */
const applyNoise = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
): void => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const factor = amount * 2.55; // Convertir 0-100 a 0-255

  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * factor;
    data[i] += noise;     // R
    data[i + 1] += noise; // G
    data[i + 2] += noise; // B
  }

  ctx.putImageData(imageData, 0, 0);
};

/**
 * Resetea todos los ajustes al valor por defecto
 */
export const resetSettings = (): EditorSettings => {
  return { ...defaultSettings };
};

/**
 * Crea un preset de ajustes
 */
export const createPreset = (name: string, settings: Partial<EditorSettings>) => {
  return {
    name,
    settings: { ...defaultSettings, ...settings },
  };
};

/**
 * Presets predefinidos populares
 */
export const editorPresets = {
  vintage: createPreset('Vintage', {
    sepia: 30,
    contrast: -10,
    brightness: 5,
    saturation: -20,
    vignette: 40,
  }),
  
  blackAndWhite: createPreset('Blanco y Negro', {
    grayscale: 100,
    contrast: 20,
  }),
  
  warm: createPreset('Cálido', {
    temperature: 30,
    saturation: 10,
    contrast: 5,
  }),
  
  cool: createPreset('Frío', {
    temperature: -30,
    saturation: -5,
    tint: 10,
  }),
  
  dramatic: createPreset('Dramático', {
    contrast: 40,
    brightness: -10,
    saturation: 20,
    vignette: 50,
  }),
  
  vivid: createPreset('Vívido', {
    saturation: 40,
    contrast: 15,
    brightness: 5,
  }),
  
  soft: createPreset('Suave', {
    blur: 2,
    contrast: -10,
    brightness: 10,
    saturation: -10,
  }),
  
  sharp: createPreset('Nítido', {
    sharpen: 80,
    contrast: 10,
  }),
};

// Helpers

const getFormatFromMimeType = (mimeType: string): ImageFormat => {
  const map: Record<string, ImageFormat> = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/bmp': 'bmp',
  };
  return map[mimeType] || 'png';
};

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

const generateFileName = (originalName: string, format: ImageFormat): string => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  return `${nameWithoutExt}_edited.${format}`;
};