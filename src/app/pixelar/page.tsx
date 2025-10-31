// src/app/pixelar/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import {
  pixelateImage,
  createPixelArt,
  createMosaic,
  type PixelateResult,
} from '@/lib/tools/pixelate';
import type { ImageFormat } from '@/types';

type PixelateMode = 'normal' | 'pixelart' | 'mosaic';

export default function PixelarPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<PixelateResult | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Opciones
  const [mode, setMode] = useState<PixelateMode>('normal');
  const [pixelSize, setPixelSize] = useState(10);
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(95);
  const [showGrid, setShowGrid] = useState(false);
  const [colorDepth, setColorDepth] = useState(32);

  const handleProcess = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingError(null);
    setProcessedImage(null);

    try {
      let result: PixelateResult;

      const baseOptions = {
        pixelSize,
        format,
        quality,
      };

      if (mode === 'normal') {
        result = await pixelateImage(uploadedImage, baseOptions);
      } else if (mode === 'pixelart') {
        result = await createPixelArt(uploadedImage, {
          ...baseOptions,
          colorDepth,
        });
      } else {
        result = await createMosaic(uploadedImage, {
          ...baseOptions,
          showGrid,
        });
      }

      setProcessedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la imagen';
      setProcessingError(errorMessage);
    } finally {
      setIsProcessing(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Pixelar Imagen</h1>
              <p className="text-sm text-gray-600">
                Aplica efectos de pixelado, pixel art y mosaico
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
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
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
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
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
                    {/* Modo */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Modo de pixelado
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        <button
                          onClick={() => setMode('normal')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            mode === 'normal'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8 mx-auto mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                            />
                          </svg>
                          <div className="text-xs font-medium text-gray-900">Normal</div>
                        </button>
                        <button
                          onClick={() => setMode('pixelart')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            mode === 'pixelart'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8 mx-auto mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                            />
                          </svg>
                          <div className="text-xs font-medium text-gray-900">Pixel Art</div>
                        </button>
                        <button
                          onClick={() => setMode('mosaic')}
                          className={`p-3 rounded-lg border-2 transition-all ${
                            mode === 'mosaic'
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 bg-white hover:border-gray-300'
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-8 h-8 mx-auto mb-1"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                            />
                          </svg>
                          <div className="text-xs font-medium text-gray-900">Mosaico</div>
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {mode === 'normal' && 'Pixelado clásico'}
                        {mode === 'pixelart' && 'Efecto retro con reducción de colores'}
                        {mode === 'mosaic' && 'Mosaico con grid opcional'}
                      </p>
                    </div>

                    {/* Tamaño del píxel */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700">
                          Tamaño del píxel
                        </label>
                        <span className="text-sm font-semibold text-blue-600">
                          {pixelSize}px
                        </span>
                      </div>
                      <input
                        type="range"
                        min="2"
                        max="50"
                        step="1"
                        value={pixelSize}
                        onChange={(e) => setPixelSize(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Fino</span>
                        <span>Grueso</span>
                      </div>
                    </div>

                    {/* Opciones específicas de Pixel Art */}
                    {mode === 'pixelart' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Profundidad de color
                          </label>
                          <span className="text-sm font-semibold text-blue-600">
                            {colorDepth} colores
                          </span>
                        </div>
                        <input
                          type="range"
                          min="8"
                          max="128"
                          step="8"
                          value={colorDepth}
                          onChange={(e) => setColorDepth(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Retro</span>
                          <span>Moderno</span>
                        </div>
                      </div>
                    )}

                    {/* Opciones específicas de Mosaico */}
                    {mode === 'mosaic' && (
                      <div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id="showGrid"
                            checked={showGrid}
                            onChange={(e) => setShowGrid(e.target.checked)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <label htmlFor="showGrid" className="text-sm font-medium text-gray-700">
                            Mostrar cuadrícula
                          </label>
                        </div>
                      </div>
                    )}

                    {/* Formato */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Formato de salida
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['png', 'jpg', 'webp'] as ImageFormat[]).map((fmt) => (
                          <button
                            key={fmt}
                            onClick={() => setFormat(fmt)}
                            className={`px-4 py-2 rounded-lg border-2 transition-all uppercase text-sm font-semibold ${
                              format === fmt
                                ? 'border-blue-600 bg-blue-50 text-blue-700'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                            }`}
                          >
                            {fmt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calidad (solo para JPG/WEBP) */}
                    {(format === 'jpg' || format === 'webp') && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-sm font-medium text-gray-700">
                            Calidad de compresión
                          </label>
                          <span className="text-sm font-semibold text-blue-600">
                            {quality}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="100"
                          step="5"
                          value={quality}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                      </div>
                    )}

                    {/* Botón procesar */}
                    <button
                      onClick={handleProcess}
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin h-5 w-5"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
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
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                            />
                          </svg>
                          Aplicar efecto
                        </>
                      )}
                    </button>

                    {processingError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
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

                  {/* Preview */}
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <div
                      className="relative p-4"
                      style={{
                        backgroundImage:
                          'linear-gradient(45deg, #e5e7eb 25%, transparent 25%), linear-gradient(-45deg, #e5e7eb 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e7eb 75%), linear-gradient(-45deg, transparent 75%, #e5e7eb 75%)',
                        backgroundSize: '20px 20px',
                        backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
                      }}
                    >
                      <img
                        src={processedImage.url}
                        alt="Pixelado"
                        className="w-full h-auto border border-gray-300 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Información */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tamaño de píxel</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {processedImage.pixelSize}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Dimensiones</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {processedImage.dimensions?.width || 0} x{' '}
                        {processedImage.dimensions?.height || 0}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tamaño del archivo</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(processedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tiempo de procesamiento</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {((processedImage.processingTime || 0) / 1000).toFixed(2)}s
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Formato</span>
                      <span className="text-sm font-semibold text-gray-900 uppercase">
                        {processedImage.format}
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
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Configura las opciones y aplica el efecto
                  </p>
                  <p className="text-xs mt-2">
                    La vista previa aparecerá aquí
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
    Pixelar Imágenes Online Gratis - Efecto Pixelado, Pixel Art y Mosaico
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Transforma tus imágenes con efectos de pixelado profesionales completamente gratis. Nuestra herramienta online te permite aplicar pixelado clásico, crear arte pixel retro o generar mosaicos artísticos en segundos. Perfecta para censurar información sensible, crear efectos artísticos o darle un toque retro a tus fotos.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Cuándo necesitas pixelar una imagen?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Privacidad y censura:</strong> Oculta rostros, matrículas, información personal o datos sensibles en capturas de pantalla</li>
      <li><strong>Cumplimiento legal:</strong> Protege la identidad de personas en fotos publicadas en medios o redes sociales</li>
      <li><strong>Arte y diseño:</strong> Crea efectos visuales únicos con estilo retro o moderno</li>
      <li><strong>Videojuegos retro:</strong> Genera sprites y assets con estética de 8-bits o 16-bits</li>
      <li><strong>Blur artístico:</strong> Alternativa creativa al desenfoque tradicional</li>
      <li><strong>Redes sociales:</strong> Crea contenido visual llamativo con efectos de pixelado</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo pixelar una imagen?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
      <li>Selecciona el modo de pixelado: Normal, Pixel Art o Mosaico</li>
      <li>Ajusta el tamaño del píxel desde 2px (fino) hasta 50px (grueso)</li>
      <li>Configura opciones adicionales según el modo elegido</li>
      <li>Selecciona el formato de salida (PNG, JPG o WebP) y la calidad</li>
      <li>Aplica el efecto y descarga tu imagen pixelada instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Modos de pixelado disponibles:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Pixelado Normal:</strong> Efecto clásico de pixelado que divide la imagen en bloques uniformes. Ideal para censurar áreas específicas o crear efectos de baja resolución. Perfecto para ocultar rostros, placas de vehículos o información confidencial en documentos.</li>
      <li><strong>Pixel Art:</strong> Transforma tu foto en arte retro estilo videojuegos de 8-bits y 16-bits. Incluye reducción de paleta de colores (8 a 128 colores) para lograr el aspecto auténtico de los clásicos videojuegos. Perfecto para crear avatares, sprites o arte nostálgico.</li>
      <li><strong>Mosaico:</strong> Crea un efecto de mosaico artístico con opción de cuadrícula visible. Genera composiciones visuales únicas perfectas para diseño gráfico, fondos de pantalla o arte digital moderno.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Opciones de personalización:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Tamaño de píxel ajustable:</strong> Control preciso de 2px a 50px para lograr el nivel exacto de pixelado deseado</li>
      <li><strong>Profundidad de color (Pixel Art):</strong> Reduce la paleta de 8 a 128 colores para diferentes estilos retro</li>
      <li><strong>Cuadrícula visible (Mosaico):</strong> Activa líneas divisorias para un efecto de teselas más definido</li>
      <li><strong>Múltiples formatos:</strong> Exporta en PNG (sin pérdida), JPG (comprimido) o WebP (optimizado)</li>
      <li><strong>Control de calidad:</strong> Ajusta la compresión de 60% a 100% para JPG y WebP</li>
      <li><strong>Métricas detalladas:</strong> Visualiza dimensiones, tamaño de archivo y tiempo de procesamiento</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso profesionales:
    </h3>
    <p className="text-gray-600 mb-4">
      Esta herramienta es esencial para múltiples profesionales y situaciones:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Periodismo y medios:</strong> Protege la identidad de fuentes o personas en fotografías publicadas cumpliendo con normativas de privacidad</li>
      <li><strong>Desarrolladores de videojuegos:</strong> Crea sprites, fondos y assets con estética retro para juegos indie</li>
      <li><strong>Diseñadores gráficos:</strong> Genera texturas pixeladas, patrones o efectos artísticos para proyectos creativos</li>
      <li><strong>Marketing digital:</strong> Crea teasers visuales pixelados para campañas de expectativa o mystery marketing</li>
      <li><strong>Redes sociales:</strong> Protege información personal en capturas de pantalla antes de compartirlas</li>
      <li><strong>Educación:</strong> Oculta información sensible en materiales educativos o presentaciones</li>
      <li><strong>YouTubers y streamers:</strong> Censura datos privados en videos y streams en vivo</li>
      <li><strong>Recursos humanos:</strong> Protege datos personales en documentos mientras mantienes el formato visible</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Guía de tamaños de píxel recomendados:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>2-5px:</strong> Pixelado sutil, mantiene la imagen reconocible con efecto ligero</li>
      <li><strong>8-12px:</strong> Efecto medio, ideal para pixel art detallado o censura moderada</li>
      <li><strong>15-25px:</strong> Pixelado fuerte, bueno para ocultar rostros o crear arte retro marcado</li>
      <li><strong>30-50px:</strong> Pixelado extremo, censura total o efectos artísticos abstractos</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Procesamiento instantáneo:</strong> Aplica efectos de pixelado en segundos sin tiempos de espera</li>
      <li><strong>Tres modos especializados:</strong> Pixelado clásico, Pixel Art con reducción de colores y Mosaico artístico</li>
      <li><strong>Control granular:</strong> Ajusta cada parámetro para lograr el resultado exacto que buscas</li>
      <li><strong>Vista previa profesional:</strong> Fondo en patrón checkerboard para ver transparencias</li>
      <li><strong>Información detallada:</strong> Métricas completas incluyendo tiempo de procesamiento</li>
      <li><strong>100% privado:</strong> Todo el procesamiento se realiza en tu navegador, tus imágenes nunca se suben a servidores</li>
      <li><strong>Sin límites de uso:</strong> Pixela todas las imágenes que necesites sin restricciones</li>
      <li><strong>Completamente gratis:</strong> Sin costos ocultos, sin marcas de agua, sin suscripciones</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Pixelado vs Desenfoque: ¿Cuál usar?
    </h3>
    <p className="text-gray-600 mb-4">
      Aunque tanto el pixelado como el desenfoque ocultan información, tienen diferentes aplicaciones:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Pixelado:</strong> Más efectivo para censura, estéticamente reconocible, difícil de revertir, perfecto para rostros y texto</li>
      <li><strong>Desenfoque:</strong> Más suave visualmente, puede ser reversible con técnicas avanzadas, mejor para fondos y contexto</li>
      <li><strong>Recomendación de seguridad:</strong> Para privacidad crítica, siempre usa pixelado con bloques grandes (20px+)</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Aplicaciones en arte digital y diseño:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Estética retro:</strong> Recrea el look nostálgico de los videojuegos de los 80s y 90s</li>
      <li><strong>NFT y crypto art:</strong> Crea arte digital pixelado único para colecciones</li>
      <li><strong>Avatares y perfiles:</strong> Genera imágenes de perfil con estilo pixel art</li>
      <li><strong>Texturas para 3D:</strong> Crea texturas pixeladas para modelos 3D low-poly</li>
      <li><strong>Fondos de pantalla:</strong> Diseña wallpapers con efectos de mosaico o pixel art</li>
      <li><strong>UI/UX retro:</strong> Elementos visuales para interfaces con estética vintage</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Cumplimiento normativo y privacidad:
    </h3>
    <p className="text-gray-600 mb-4">
      El pixelado es una técnica aceptada para cumplir con normativas de protección de datos:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>GDPR/RGPD:</strong> Método válido para anonimizar datos personales en imágenes</li>
      <li><strong>Protección de menores:</strong> Herramienta esencial para medios que trabajan con contenido infantil</li>
      <li><strong>Confidencialidad empresarial:</strong> Oculta información sensible en documentos compartidos</li>
      <li><strong>Seguridad médica:</strong> Protege datos de pacientes en material educativo o de investigación</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consejos para mejores resultados:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Para censura efectiva:</strong> Usa tamaños de píxel de 20px o más para garantizar que la información no sea reconocible</li>
      <li><strong>Para pixel art:</strong> Empieza con imágenes de resolución media (800-1200px) y usa tamaños de píxel de 8-15px</li>
      <li><strong>Para mosaicos:</strong> Activa la cuadrícula con píxeles medianos (15-25px) para efectos más definidos</li>
      <li><strong>Reducción de colores:</strong> Para look retro auténtico, usa 16-32 colores en modo Pixel Art</li>
      <li><strong>Formato de exportación:</strong> PNG para conservar detalles, JPG para archivos más pequeños</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otras herramientas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin software:</strong> No necesitas Photoshop, GIMP u otros programas costosos</li>
      <li><strong>Privacidad absoluta:</strong> A diferencia de otras herramientas online, todo se procesa localmente</li>
      <li><strong>Tres modos en uno:</strong> Combina pixelado, pixel art y mosaico en una sola herramienta</li>
      <li><strong>Control profesional:</strong> Opciones avanzadas que herramientas simples no ofrecen</li>
      <li><strong>Sin marcas de agua:</strong> Tu imagen final es completamente tuya</li>
      <li><strong>Interfaz intuitiva:</strong> Más fácil de usar que editores complejos, más potente que apps básicas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formatos y compatibilidad:
    </h3>
    <p className="text-gray-600 mb-4">
      Trabaja con los formatos de imagen más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Procesa imágenes de hasta 50MB manteniendo la calidad deseada. Exporta en el formato que prefieras:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>PNG:</strong> Ideal para pixel art y mosaicos, mantiene transparencias y calidad sin pérdida</li>
      <li><strong>JPG:</strong> Perfecto para fotografías pixeladas con menor tamaño de archivo</li>
      <li><strong>WebP:</strong> Mejor compresión manteniendo calidad, ideal para uso web</li>
    </ul>

    <p className="text-gray-600">
      Ya sea que necesites proteger la privacidad de personas en tus fotos, crear arte digital retro, generar efectos visuales únicos o cumplir con normativas de protección de datos, esta herramienta te proporciona todo lo necesario de forma gratuita, rápida y privada. Transforma tus imágenes con efectos de pixelado profesionales en segundos.
    </p>
  </div>
</article>
    </div>
  );
}