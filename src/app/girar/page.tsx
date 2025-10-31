'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import {
  rotateRight,
  rotateLeft,
  flip180,
  rotateCustom,
  flipHorizontal,
  flipVertical,
} from '@/lib/tools/rotate';
import type { ProcessedImage } from '@/types';

export default function GirarPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [rotatedImage, setRotatedImage] = useState<ProcessedImage | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Opciones de rotación personalizada
  const [customAngle, setCustomAngle] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');

  const handleRotation = async (type: 'right' | 'left' | 'flip' | 'custom' | 'flipH' | 'flipV') => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingError(null);

    try {
      let result: ProcessedImage;

      switch (type) {
        case 'right':
          result = await rotateRight(uploadedImage);
          break;
        case 'left':
          result = await rotateLeft(uploadedImage);
          break;
        case 'flip':
          result = await flip180(uploadedImage);
          break;
        case 'flipH':
          result = await flipHorizontal(uploadedImage);
          break;
        case 'flipV':
          result = await flipVertical(uploadedImage);
          break;
        case 'custom':
          result = await rotateCustom(uploadedImage, customAngle, backgroundColor);
          break;
        default:
          throw new Error('Tipo de rotación no válido');
      }

      setRotatedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al rotar la imagen';
      setProcessingError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (rotatedImage) {
      await downloadProcessedImage(rotatedImage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Volver al inicio"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Girar y Voltear Imagen</h1>
              <p className="text-sm text-gray-600">
                Rota tu imagen en cualquier ángulo o voltéala horizontal/verticalmente
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda - Upload y Opciones */}
          <div className="space-y-6">
            {/* Upload */}
            {!uploadedImage ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  1. Sube tu imagen
                </h2>
                <ImageUploader
                  onImageSelect={(file, url) => {
                    handleImageUpload(file);
                    setRotatedImage(null);
                    setProcessingError(null);
                  }}
                  acceptedFormats={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
                  maxSizeMB={50}
                />
                {uploadError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                    <p className="text-sm text-red-600">{uploadError}</p>
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Vista previa original */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Imagen Original
                    </h2>
                    <button
                      onClick={() => {
                        resetUpload();
                        setRotatedImage(null);
                        setProcessingError(null);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      aria-label="Cambiar imagen"
                    >
                      Cambiar imagen
                    </button>
                  </div>
                  <ImagePreview
                    imageUrl={uploadedImage.preview}
                    title="Original"
                    dimensions={{
                      width: uploadedImage.width || 0,
                      height: uploadedImage.height || 0,
                    }}
                    fileSize={uploadedImage.size}
                  />
                </div>

                {/* Opciones de rotación */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Elige cómo rotar
                  </h2>

                  <div className="space-y-6">
                    {/* Botones rápidos */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Rotación rápida
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          onClick={() => handleRotation('right')}
                          disabled={isProcessing}
                          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                          aria-label="Rotar 90 grados a la derecha"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                          </svg>
                          <span className="text-sm font-medium">90° Derecha</span>
                        </button>

                        <button
                          onClick={() => handleRotation('left')}
                          disabled={isProcessing}
                          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                          aria-label="Rotar 90 grados a la izquierda"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6 scale-x-[-1]"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                          </svg>
                          <span className="text-sm font-medium">90° Izquierda</span>
                        </button>

                        <button
                          onClick={() => handleRotation('flip')}
                          disabled={isProcessing}
                          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                          aria-label="Rotar 180 grados"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                            />
                          </svg>
                          <span className="text-sm font-medium">180°</span>
                        </button>

                        <button
                          onClick={() => handleRotation('flipH')}
                          disabled={isProcessing}
                          className="flex flex-col items-center justify-center gap-2 p-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                          aria-label="Voltear horizontalmente"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-6 h-6"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                            />
                          </svg>
                          <span className="text-sm font-medium">Espejo ↔</span>
                        </button>
                      </div>

                      <button
                        onClick={() => handleRotation('flipV')}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-2 w-full mt-3 p-4 border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all"
                        aria-label="Voltear verticalmente"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-6 h-6 rotate-90"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"
                          />
                        </svg>
                        <span className="text-sm font-medium">Espejo Vertical ↕</span>
                      </button>
                    </div>

                    {/* Rotación personalizada */}
                    <div className="pt-6 border-t border-gray-200">
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Rotación personalizada
                      </label>

                      <div className="space-y-4">
                        {/* Ángulo */}
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">Ángulo</span>
                            <span className="text-sm font-semibold text-blue-600" aria-live="polite">
                              {customAngle}°
                            </span>
                          </div>
                          <input
                            id="angle-slider"
                            type="range"
                            min="-180"
                            max="180"
                            step="1"
                            value={customAngle}
                            onChange={(e) => setCustomAngle(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            aria-label="Control de ángulo de rotación"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>-180°</span>
                            <span>0°</span>
                            <span>180°</span>
                          </div>
                        </div>

                        {/* Color de fondo */}
                        <div>
                          <label htmlFor="bg-color-text" className="text-sm text-gray-600 mb-2 block">
                            Color de fondo (para ángulos no exactos)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="color"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                              aria-label="Selector de color de fondo"
                            />
                            <input
                              id="bg-color-text"
                              type="text"
                              value={backgroundColor}
                              onChange={(e) => setBackgroundColor(e.target.value)}
                              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="#FFFFFF"
                              aria-label="Código hexadecimal del color de fondo"
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => handleRotation('custom')}
                          disabled={isProcessing || customAngle === 0}
                          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                          aria-label={isProcessing ? 'Procesando rotación' : 'Aplicar rotación personalizada'}
                        >
                          {isProcessing ? (
                            <>
                              <svg
                                className="animate-spin h-5 w-5"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Procesando...
                            </>
                          ) : (
                            <>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                                stroke="currentColor"
                                className="w-5 h-5"
                                aria-hidden="true"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                                />
                              </svg>
                              Aplicar rotación
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {processingError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-sm text-red-600">{processingError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Columna Derecha - Resultado */}
          <div className="space-y-6">
            {rotatedImage ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagen Procesada
                  </h2>
                  <ImagePreview
                    imageUrl={rotatedImage.url}
                    title="Rotada"
                    dimensions={rotatedImage.dimensions}
                    fileSize={rotatedImage.size}
                  />
                </div>

                {/* Botón descargar */}
                <DownloadButton
                  imageUrl={rotatedImage.url}
                  fileName={rotatedImage.fileName}
                  format={rotatedImage.format}
                  disabled={isDownloading}
                />
              </>
            ) : uploadedImage ? (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8">
                <div className="flex flex-col items-center justify-center text-gray-400 text-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-16 h-16 mb-4"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Selecciona una opción de rotación
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {/* Sección informativa SEO */}
        <article className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Girar y Voltear Imágenes Online Gratis
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Rota tus imágenes de manera rápida y sencilla con nuestra herramienta online gratuita. Ya sea que necesites corregir la orientación de una foto, crear efectos espejo o rotar en cualquier ángulo personalizado, lo puedes hacer en segundos sin instalar ningún software.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              ¿Cuándo necesitas girar una imagen?
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Corregir orientación:</strong> Fotos tomadas en vertical que se ven horizontalmente</li>
              <li><strong>Fotos de documentos:</strong> Escaneos o capturas de pantalla que necesitan rotación</li>
              <li><strong>Redes sociales:</strong> Ajustar imágenes para el formato correcto de Instagram, Facebook o TikTok</li>
              <li><strong>Efectos creativos:</strong> Crear composiciones artísticas con rotaciones y reflejos</li>
              <li><strong>Diseño gráfico:</strong> Preparar imágenes con la orientación correcta para proyectos</li>
              <li><strong>100% privado:</strong> Todo el procesamiento se hace en tu navegador, tus imágenes no se suben a ningún servidor</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Cómo girar una imagen?
            </h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
              <li>Sube tu imagen en formato JPG, PNG, WebP o GIF (hasta 50MB)</li>
              <li>Elige una rotación rápida: 90° derecha, 90° izquierda o 180°</li>
              <li>O usa la rotación personalizada para girar en cualquier ángulo específico (-180° a 180°)</li>
              <li>Para rotaciones personalizadas, selecciona el color de fondo que prefieras</li>
              <li>Descarga tu imagen rotada instantáneamente</li>
            </ol>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Opciones de rotación disponibles:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>90° a la derecha:</strong> Rotación en sentido horario, ideal para fotos verticales</li>
              <li><strong>90° a la izquierda:</strong> Rotación antihoraria para correcciones rápidas</li>
              <li><strong>180°:</strong> Voltea completamente la imagen de arriba hacia abajo</li>
              <li><strong>Espejo horizontal:</strong> Crea un reflejo de izquierda a derecha</li>
              <li><strong>Espejo vertical:</strong> Refleja la imagen de arriba hacia abajo</li>
              <li><strong>Ángulo personalizado:</strong> Rota con precisión en cualquier grado de -180° a 180°</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Características destacadas:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Rotación instantánea:</strong> Resultados inmediatos sin tiempos de espera</li>
              <li><strong>Sin pérdida de calidad:</strong> Mantiene la resolución original de tu imagen</li>
              <li><strong>Color de fondo personalizable:</strong> Elige el color perfecto para rotaciones no exactas</li>
              <li><strong>Múltiples formatos:</strong> Compatible con JPG, PNG, WebP y GIF animados</li>
              <li><strong>Vista previa clara:</strong> Ve los resultados antes de descargar</li>
              <li><strong>Completamente gratis:</strong> Sin límites, sin marcas de agua, sin registro</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Casos de uso populares:
            </h3>
            <p className="text-gray-600 mb-4">
              Esta herramienta es perfecta para diversas situaciones cotidianas y profesionales:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Fotos del móvil:</strong> Corrige la orientación de fotos tomadas con el teléfono</li>
              <li><strong>Documentos escaneados:</strong> Endereza PDFs o imágenes de documentos mal orientados</li>
              <li><strong>Contenido para redes:</strong> Ajusta imágenes para historias de Instagram o posts de Facebook</li>
              <li><strong>Diseño web:</strong> Prepara imágenes con la orientación correcta para tu sitio</li>
              <li><strong>Efectos creativos:</strong> Crea imágenes con efecto espejo para proyectos artísticos</li>
              <li><strong>Fotografía de productos:</strong> Asegura que tus productos se vean en la orientación correcta</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Formatos soportados:
            </h3>
            <p className="text-gray-600">
              Trabaja con los formatos más comunes: <strong>JPG/JPEG, PNG, WebP y GIF</strong> (incluyendo GIFs animados). Procesa imágenes de hasta 50MB manteniendo la calidad original y el formato de salida.
            </p>
          </div>
        </article>
    </div>
  );
}