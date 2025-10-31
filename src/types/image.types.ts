// Formatos de imagen soportados
export type ImageFormat = 'png' | 'jpg' | 'jpeg' | 'webp' | 'gif' | 'bmp' | 'svg';

// Tipo MIME de imágenes
export type ImageMimeType = 
  | 'image/png' 
  | 'image/jpeg' 
  | 'image/webp' 
  | 'image/gif'
  | 'image/bmp'
  | 'image/svg+xml';

// Archivo de imagen con metadata
export interface ImageFile {
  file: File;
  preview: string; // URL temporal para preview
  name: string;
  size: number; // En bytes
  type: ImageMimeType;
  width?: number;
  height?: number;
}

// Dimensiones de imagen
export interface ImageDimensions {
  width: number;
  height: number;
}

// Área de recorte
export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Área de recorte en píxeles (para canvas)
export interface PixelCrop {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Imagen procesada lista para descargar
export interface ProcessedImage {
  blob: Blob;
  url: string; // Object URL del blob
  fileName: string;
  format: ImageFormat;
  size: number; // Tamaño en bytes
  dimensions?: ImageDimensions;
  processingTime?: number; // ← AGREGA ESTA LÍNEA (tiempo en milisegundos)
}

// Opciones de conversión de formato
export interface ConversionOptions {
  format: ImageFormat;
  quality?: number; // 0-100 (para jpg, webp)
  backgroundColor?: string; // Para formatos sin transparencia
}

// Opciones de compresión
export interface CompressionOptions {
  maxSizeMB: number;
  maxWidthOrHeight?: number;
  quality?: number; // 0-1
  useWebWorker?: boolean;
}

// Opciones de redimensionamiento
export interface ResizeOptions {
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  quality?: number;
}

// Opciones de rotación
export interface RotateOptions {
  angle: number; // 0, 90, 180, 270, o cualquier ángulo
  backgroundColor?: string;
}

// Opciones de marca de agua
export interface WatermarkOptions {
  text?: string;
  imageUrl?: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
  opacity: number; // 0-1
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
}

// Opciones para crear memes
export interface MemeOptions {
  topText: string;
  bottomText: string;
  fontSize?: number;
  fontColor?: string;
  fontFamily?: string;
  strokeColor?: string;
  strokeWidth?: number;
}

// Opciones para pixelar
export interface PixelateOptions {
  pixelSize: number; // Tamaño del píxel (5-50)
  detectFaces?: boolean; // Si debe detectar caras automáticamente
  manualAreas?: CropArea[]; // Áreas manuales para pixelar
}

// Estadísticas de imagen
export interface ImageStats {
  originalSize: number; // bytes
  processedSize: number; // bytes
  compressionRatio?: number; // porcentaje
  dimensions: ImageDimensions;
  format: ImageFormat;
}

// Estado de carga de imagen
export interface ImageUploadState {
  isUploading: boolean;
  progress: number; // 0-100
  error: string | null;
  image: ImageFile | null;
}

// Estado de procesamiento de imagen
export interface ImageProcessingState {
  isProcessing: boolean;
  progress: number; // 0-100
  error: string | null;
  result: ProcessedImage | null;
}