'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { 
  ImageFile, 
  ImageMimeType, 
  ImageUploadState,
  ImageDimensions 
} from '@/types';

interface UploadOptions {
  maxSizeMB?: number;
  acceptedFormats?: ImageMimeType[];
  autoCompress?: boolean;
  maxWidth?: number;
  maxHeight?: number;
}

interface UseImageUploadReturn extends ImageUploadState {
  handleImageUpload: (file: File) => Promise<void>;
  resetUpload: () => void;
  uploadedImage: ImageFile | null;
}

export function useImageUpload(options?: UploadOptions): UseImageUploadReturn {
  const [uploadState, setUploadState] = useState<ImageUploadState>({
    isUploading: false,
    progress: 0,
    error: null,
    image: null,
  });

  // Usar ref para mantener la URL actual sin causar re-renders
  const previewUrlRef = useRef<string | null>(null);

  const defaultOptions: UploadOptions = {
    maxSizeMB: 10,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
    autoCompress: false,
    maxWidth: 4096,
    maxHeight: 4096,
    ...options,
  };

  const validateFile = useCallback(
    (file: File): string | null => {
      // Validar tipo de archivo
      if (!defaultOptions.acceptedFormats?.includes(file.type as ImageMimeType)) {
        return `Formato no válido. Formatos aceptados: ${defaultOptions.acceptedFormats
          ?.map((format) => format.split('/')[1].toUpperCase())
          .join(', ')}`;
      }

      // Validar tamaño
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > (defaultOptions.maxSizeMB || 10)) {
        return `El archivo es demasiado grande. Tamaño máximo: ${defaultOptions.maxSizeMB}MB`;
      }

      return null;
    },
    [defaultOptions.acceptedFormats, defaultOptions.maxSizeMB]
  );

  const getImageDimensions = useCallback(
    (file: File): Promise<ImageDimensions> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
          URL.revokeObjectURL(url);
          resolve({ width: img.width, height: img.height });
        };

        img.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Error al cargar las dimensiones de la imagen'));
        };

        img.src = url;
      });
    },
    []
  );

  const compressImage = useCallback(
    (file: File): Promise<File> => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            let { width, height } = img;

            // Redimensionar si excede los límites
            if (width > (defaultOptions.maxWidth || 4096) || height > (defaultOptions.maxHeight || 4096)) {
              if (width > height) {
                if (width > (defaultOptions.maxWidth || 4096)) {
                  height = Math.round((height * (defaultOptions.maxWidth || 4096)) / width);
                  width = defaultOptions.maxWidth || 4096;
                }
              } else {
                if (height > (defaultOptions.maxHeight || 4096)) {
                  width = Math.round((width * (defaultOptions.maxHeight || 4096)) / height);
                  height = defaultOptions.maxHeight || 4096;
                }
              }
            }

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('No se pudo obtener el contexto del canvas'));
              return;
            }

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) {
                  reject(new Error('Error al comprimir la imagen'));
                  return;
                }
                const compressedFile = new File([blob], file.name, {
                  type: file.type,
                  lastModified: Date.now(),
                });
                resolve(compressedFile);
              },
              file.type,
              0.9
            );
          };

          img.onerror = () => reject(new Error('Error al cargar la imagen'));
          img.src = e.target?.result as string;
        };

        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsDataURL(file);
      });
    },
    [defaultOptions.maxWidth, defaultOptions.maxHeight]
  );

  const handleImageUpload = useCallback(
    async (file: File) => {
      try {
        setUploadState({ isUploading: true, progress: 0, error: null, image: null });

        // Validar archivo
        const validationError = validateFile(file);
        if (validationError) {
          setUploadState({ isUploading: false, progress: 0, error: validationError, image: null });
          return;
        }

        setUploadState(prev => ({ ...prev, progress: 30 }));

        // Comprimir si es necesario
        let processedFile = file;
        if (defaultOptions.autoCompress) {
          try {
            processedFile = await compressImage(file);
          } catch (compressError) {
            console.warn('Error al comprimir, usando archivo original:', compressError);
          }
        }

        setUploadState(prev => ({ ...prev, progress: 60 }));

        // Obtener dimensiones
        const dimensions = await getImageDimensions(processedFile);

        // Validar dimensiones máximas
        if (
          dimensions.width > (defaultOptions.maxWidth || 4096) ||
          dimensions.height > (defaultOptions.maxHeight || 4096)
        ) {
          setUploadState({
            isUploading: false,
            progress: 0,
            error: `Dimensiones demasiado grandes. Máximo: ${defaultOptions.maxWidth}x${defaultOptions.maxHeight}px`,
            image: null,
          });
          return;
        }

        setUploadState(prev => ({ ...prev, progress: 90 }));

        // Limpiar URL anterior si existe
        if (previewUrlRef.current) {
          URL.revokeObjectURL(previewUrlRef.current);
        }

        // Crear URL de preview
        const preview = URL.createObjectURL(processedFile);
        previewUrlRef.current = preview;

        // Crear objeto ImageFile según tus tipos
        const imageFile: ImageFile = {
          file: processedFile,
          preview,
          name: processedFile.name,
          size: processedFile.size,
          type: processedFile.type as ImageMimeType,
          width: dimensions.width,
          height: dimensions.height,
        };

        setUploadState({
          isUploading: false,
          progress: 100,
          error: null,
          image: imageFile,
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar la imagen';
        setUploadState({ isUploading: false, progress: 0, error: errorMessage, image: null });
        console.error('Error uploading image:', err);
      }
    },
    [validateFile, getImageDimensions, compressImage, defaultOptions]
  );

  const resetUpload = useCallback(() => {
    // Limpiar URL de objeto usando la ref
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setUploadState({ isUploading: false, progress: 0, error: null, image: null });
  }, []); // Sin dependencias ahora

  // Cleanup al desmontar el componente
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  return {
    ...uploadState,
    handleImageUpload,
    resetUpload,
    uploadedImage: uploadState.image,
  };
}

// Funciones auxiliares
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const base64ToFile = (base64: string, fileName: string): File => {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], fileName, { type: mime });
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};