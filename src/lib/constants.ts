import type { Tool } from '@/types';

// ===== CONSTANTES DE LÍMITES =====
export const LIMITS = {
  MAX_FILE_SIZE_MB: 50,
  MAX_FILE_SIZE_BYTES: 50 * 1024 * 1024, // 50MB en bytes
  MIN_IMAGE_DIMENSION: 1,
  MAX_IMAGE_DIMENSION: 10000,
};

// ===== MENSAJES DE ERROR =====
export const ERROR_MESSAGES = {
  FILE_TOO_LARGE: 'El archivo es demasiado grande. Máximo 50MB.',
  INVALID_FILE_TYPE: 'Tipo de archivo no válido.',
  IMAGE_TOO_LARGE: 'La imagen es demasiado grande.',
  PROCESSING_ERROR: 'Error al procesar la imagen.',
  UPLOAD_ERROR: 'Error al cargar la imagen.',
  DOWNLOAD_ERROR: 'Error al descargar la imagen.',
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
};

// ===== FORMATOS DE IMAGEN =====
export const IMAGE_FORMATS = {
  JPEG: 'image/jpeg',
  PNG: 'image/png',
  WEBP: 'image/webp',
  GIF: 'image/gif',
  BMP: 'image/bmp',
} as const;

// Definición de categorías
export const CATEGORIES = {
  basico: {
    id: 'basico',
    name: 'Herramientas Básicas',
    description: 'Operaciones esenciales para optimizar y ajustar tus imágenes de forma rápida y sencilla.',
    color: 'blue',
  },
  creativo: {
    id: 'creativo',
    name: 'Herramientas Creativas',
    description: 'Añade tu toque personal con efectos creativos y elementos visuales únicos.',
    color: 'green',
  },
  avanzado: {
    id: 'avanzado',
    name: 'Herramientas Avanzadas',
    description: 'Funciones profesionales para edición avanzada y procesamiento especializado.',
    color: 'purple',
  },
} as const;

// Definición de herramientas
export const TOOLS: Tool[] = [
  {
    id: 'comprimir',
    name: 'Comprimir Imagen',
    description: 'Reduce el tamaño de tus imágenes sin perder calidad visible',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875l-2.25-2.25M12 13.875V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /></svg>`,
    path: '/comprimir',
    category: 'basico',
  },
  {
    id: 'redimensionar',
    name: 'Redimensionar Imagen',
    description: 'Cambia las dimensiones de tus imágenes por píxeles o porcentaje',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" /></svg>`,
    path: '/redimensionar',
    category: 'basico',
  },
  {
    id: 'recortar',
    name: 'Recortar Imagen',
    description: 'Recorta tus imágenes definiendo un área específica',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 004.5 9.75v7.5a2.25 2.25 0 002.25 2.25h7.5a2.25 2.25 0 002.25-2.25v-.75m0-12h-7.5m7.5 0v7.5m0-7.5l-7.5 7.5" /></svg>`,
    path: '/recortar',
    category: 'basico',
  },
  {
    id: 'convertir',
    name: 'Convertir Formato',
    description: 'Convierte entre PNG, JPG, WEBP, GIF y más formatos',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3" /></svg>`,
    path: '/convertir',
    category: 'basico',
  },
  {
    id: 'girar',
    name: 'Girar Imagen',
    description: 'Rota tus imágenes 90°, 180°, 270° o cualquier ángulo',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>`,
    path: '/girar',
    category: 'basico',
  },
  {
    id: 'marca-agua',
    name: 'Añadir Marca de Agua',
    description: 'Protege tus imágenes añadiendo texto o logo como marca',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z" /></svg>`,
    path: '/marca-agua',
    category: 'creativo',
  },
  {
    id: 'meme',
    name: 'Crear Meme',
    description: 'Añade texto superior e inferior para crear memes divertidos',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" /></svg>`,
    path: '/meme',
    category: 'creativo',
  },
  {
    id: 'editor',
    name: 'Editor de Fotos',
    description: 'Editor completo con filtros, ajustes, texto y más',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" /></svg>`,
    path: '/editor',
    category: 'avanzado',
  },
  {
    id: 'eliminar-fondo',
    name: 'Eliminar Fondo',
    description: 'Remueve el fondo de tus imágenes automáticamente con IA',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>`,
    path: '/eliminar-fondo',
    category: 'avanzado',
    isNew: true,
  },
  {
    id: 'html-a-imagen',
    name: 'HTML a Imagen',
    description: 'Convierte código HTML a imagen PNG o JPG',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>`,
    path: '/html-a-imagen',
    category: 'avanzado',
  },
  {
    id: 'pixelar',
    name: 'Pixelar Imagen',
    description: 'Aplica efecto pixelado a tus imágenes',
    icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>`,
    path: '/pixelar',
    category: 'avanzado',
    isNew: true,
  },
];