// Tipos de herramientas disponibles
export type ToolId = 
  | 'comprimir'
  | 'redimensionar'
  | 'recortar'
  | 'convertir'
  | 'editor'
  | 'eliminar-fondo'
  | 'marca-agua'
  | 'meme'
  | 'girar'
  | 'html-a-imagen'
  | 'pixelar';

// Categorías de herramientas
export type ToolCategory = 'basico' | 'avanzado' | 'creativo';

// Interfaz principal de una herramienta
export interface Tool {
  id: ToolId;
  name: string;
  description: string;
  icon: string; // Emoji o ruta del icono
  path: string; // Ruta de la página (ej: '/comprimir')
  category: ToolCategory;
  isNew?: boolean; // Para marcar herramientas nuevas
  isPro?: boolean; // Para funciones premium (futuro)
}

// Opciones de procesamiento comunes
export interface ProcessOptions {
  quality?: number; // 0-100
  format?: string;
  maintainAspectRatio?: boolean;
}

// Estado de procesamiento
export type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error';

// Resultado de procesamiento
export interface ProcessingResult {
  status: ProcessingStatus;
  message?: string;
  blob?: Blob;
  url?: string;
  error?: string;
}

// Configuración de herramienta individual
export interface ToolConfig {
  maxFileSize: number; // En MB
  acceptedFormats: string[]; // ['image/jpeg', 'image/png', etc]
  defaultOptions?: ProcessOptions;
}

