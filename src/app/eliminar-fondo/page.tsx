// src/app/eliminar-fondo/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import {
  removeBackground,
  removeBackgroundDeepLab,
  type RemoveBgResult,
} from '@/lib/tools/removeBg';

type ProcessingMethod = 'mediapipe' | 'deeplab';

export default function EliminarFondoPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<RemoveBgResult | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);

  // Opciones
  const [method, setMethod] = useState<ProcessingMethod>('mediapipe');
  const [quality, setQuality] = useState(95);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [useCustomBg, setUseCustomBg] = useState(false);
  const [edgeBlur, setEdgeBlur] = useState(2);

  const handleProcess = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingError(null);
    setProcessedImage(null);
    setProcessingProgress(0);

    try {
      let result: RemoveBgResult;

      const options = {
        quality,
        backgroundColor: useCustomBg ? backgroundColor : undefined,
        edgeBlur,
        progress: (progress: number) => {
          setProcessingProgress(progress);
        },
      };

      if (method === 'mediapipe') {
        result = await removeBackground(uploadedImage, options);
      } else {
        result = await removeBackgroundDeepLab(uploadedImage, options);
      }

      setProcessedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la imagen';
      setProcessingError(errorMessage);
    } finally {
      setIsProcessing(false);
      setProcessingProgress(0);
    }
  };

  const handleDownload = async () => {
    if (processedImage) {
      await downloadProcessedImage(processedImage);
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
              <h1 className="text-2xl font-bold text-gray-900">Eliminar Fondo</h1>
              <p className="text-sm text-gray-600">
                Remueve el fondo de tus imágenes con IA
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
                    setProcessedImage(null);
                    setProcessingError(null);
                  }}
                  acceptedFormats={['image/jpeg', 'image/png', 'image/webp']}
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
                        setProcessedImage(null);
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

                {/* Opciones */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Configuración
                  </h2>

                  <div className="space-y-6">
                    {/* Suavizado de bordes */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="edge-blur-slider" className="text-sm font-medium text-gray-700">
                          Suavizado de bordes
                        </label>
                        <span className="text-sm font-semibold text-blue-600" aria-live="polite">
                          {edgeBlur}px
                        </span>
                      </div>
                      <input
                        id="edge-blur-slider"
                        type="range"
                        min="0"
                        max="10"
                        step="1"
                        value={edgeBlur}
                        onChange={(e) => setEdgeBlur(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label="Control de suavizado de bordes"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Sin suavizado</span>
                        <span>Más suave</span>
                      </div>
                    </div>

                    {/* Color de fondo personalizado */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id="useCustomBg"
                          checked={useCustomBg}
                          onChange={(e) => setUseCustomBg(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="useCustomBg"
                          className="text-sm font-medium text-gray-700"
                        >
                          Color de fondo personalizado
                        </label>
                      </div>
                      {useCustomBg && (
                        <div className="flex gap-2 mt-2">
                          <input
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                            aria-label="Selector de color de fondo"
                          />
                          <input
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="#ffffff"
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Código hexadecimal del color"
                          />
                        </div>
                      )}
                    </div>

                    {/* Calidad */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700">
                          Calidad de exportación
                        </label>
                        <span className="text-sm font-semibold text-blue-600" aria-live="polite">
                          {quality}%
                        </span>
                      </div>
                      <input
                        id="quality-slider"
                        type="range"
                        min="60"
                        max="100"
                        step="5"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label="Control de calidad de exportación"
                      />
                    </div>

                    {/* Botón procesar */}
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      aria-label={isProcessing ? 'Procesando imagen' : 'Eliminar fondo de imagen'}
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
                          {processingProgress > 0
                            ? `Procesando... ${processingProgress}%`
                            : 'Procesando...'}
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
                              d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                            />
                          </svg>
                          Eliminar fondo
                        </>
                      )}
                    </button>

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
            {processedImage ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Resultado
                  </h2>
                  
                  {/* Preview con patrón de transparencia */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div 
                      className="relative"
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                      }}
                    >
                      <img
                        src={processedImage.url}
                        alt="Sin fondo"
                        className="w-full h-auto"
                      />
                    </div>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tiempo de procesamiento</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(processedImage.processingTime / 1000).toFixed(2)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Tamaño del archivo
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(processedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Tiene transparencia
                      </span>
                      <span className={`text-sm font-semibold ${
                        processedImage.hasTransparency ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        {processedImage.hasTransparency ? 'Sí' : 'No'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón descargar */}
                <DownloadButton
                  imageUrl={processedImage.url}
                  fileName={processedImage.fileName}
                  format={processedImage.format}
                  disabled={isDownloading}
                />
              </>
            ) : uploadedImage ? (
              <div className="bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 p-8 h-full flex items-center justify-center">
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
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Configura las opciones y haz click en eliminar fondo
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
            Eliminar Fondo de Imágenes con IA
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Nuestra herramienta de eliminación de fondo utiliza inteligencia artificial avanzada para remover el fondo de tus imágenes de manera automática y precisa. Obtén resultados profesionales en segundos, sin necesidad de conocimientos técnicos en edición de imágenes.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              ¿Por qué eliminar el fondo de tus imágenes?
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>E-commerce profesional:</strong> Crea fotos de productos con fondo blanco o transparente para tu tienda online</li>
              <li><strong>Diseño gráfico:</strong> Integra elementos en tus diseños sin fondos molestos</li>
              <li><strong>Redes sociales:</strong> Destaca tus fotos con fondos personalizados o transparentes</li>
              <li><strong>Documentos oficiales:</strong> Prepara fotos con fondo específico para CV, pasaportes o documentos</li>
              <li><strong>Marketing digital:</strong> Crea contenido visual atractivo para campañas publicitarias</li>
              <li><strong>100% privado:</strong> Todo el procesamiento se hace con IA en tu navegador, tus imágenes nunca se suben a servidores externos</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Cómo funciona el removedor de fondo?
            </h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
              <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
              <li>Ajusta el suavizado de bordes para un resultado más natural</li>
              <li>Opcionalmente, elige un color de fondo personalizado en lugar de transparencia</li>
              <li>Haz click en Eliminar fondo y espera unos segundos mientras la IA procesa tu imagen</li>
              <li>Descarga tu imagen con fondo transparente en formato PNG de alta calidad</li>
            </ol>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Características destacadas:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>IA de última generación:</strong> Detección precisa de personas y objetos usando modelos de segmentación avanzados</li>
              <li><strong>Suavizado de bordes ajustable:</strong> Control total sobre el acabado de los bordes para resultados naturales</li>
              <li><strong>Fondo transparente o personalizado:</strong> Elige PNG transparente o añade tu propio color de fondo</li>
              <li><strong>Procesamiento rápido:</strong> Resultados en segundos, sin tiempos de espera largos</li>
              <li><strong>Alta calidad:</strong> Exporta con hasta 100% de calidad sin pérdida de detalles</li>
              <li><strong>Totalmente gratuito:</strong> Sin límites, sin marcas de agua, sin suscripciones</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Casos de uso populares:
            </h3>
            <p className="text-gray-600 mb-4">
              Esta herramienta es ideal para una amplia variedad de necesidades profesionales y personales:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Fotografía de productos:</strong> Elimina fondos distractores de fotos de productos para catálogos y tiendas online</li>
              <li><strong>Fotos de perfil profesionales:</strong> Crea avatares limpios para LinkedIn, CV y perfiles corporativos</li>
              <li><strong>Contenido para redes sociales:</strong> Genera imágenes destacadas para Instagram, Facebook y TikTok</li>
              <li><strong>Presentaciones y documentos:</strong> Integra imágenes limpias en PowerPoint, Word y otros documentos</li>
              <li><strong>Diseño web:</strong> Obtén PNG transparentes listos para usar en sitios web y aplicaciones</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Formatos soportados:
            </h3>
            <p className="text-gray-600">
              Acepta los formatos más comunes: <strong>JPG/JPEG, PNG y WebP</strong>. Procesa imágenes de hasta 50MB y exporta siempre en formato <strong>PNG con transparencia</strong> para máxima compatibilidad y calidad.
            </p>
          </div>
        </article>
    </div>
  );
}