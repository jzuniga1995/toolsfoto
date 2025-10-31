'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import {
  resizeImage,
  calculateAspectRatioDimensions,
  resizeByPercentage,
  RESIZE_PRESETS,
  validateResizeOptions,
} from '@/lib/tools/resize';
import type { ResizeOptions, ProcessedImage } from '@/types';

export default function RedimensionarPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isResizing, setIsResizing] = useState(false);
  const [resizedImage, setResizedImage] = useState<ProcessedImage | null>(null);
  const [resizeError, setResizeError] = useState<string | null>(null);

  // Opciones de redimensionamiento
  const [resizeMode, setResizeMode] = useState<'pixels' | 'percentage' | 'preset'>('pixels');
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [percentage, setPercentage] = useState(100);
  const [selectedPreset, setSelectedPreset] = useState<string>('');
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  // Dimensiones calculadas
  const [calculatedDimensions, setCalculatedDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  // Calcular dimensiones en tiempo real
  React.useEffect(() => {
    if (!uploadedImage) return;

    if (resizeMode === 'pixels' && (width || height)) {
      const dims = calculateAspectRatioDimensions(
        uploadedImage.width || 0,
        uploadedImage.height || 0,
        width,
        height
      );
      setCalculatedDimensions(dims);
    } else if (resizeMode === 'percentage') {
      const dims = resizeByPercentage(
        uploadedImage.width || 0,
        uploadedImage.height || 0,
        percentage
      );
      setCalculatedDimensions(dims);
    } else if (resizeMode === 'preset' && selectedPreset) {
      const preset = RESIZE_PRESETS[selectedPreset as keyof typeof RESIZE_PRESETS];
      setCalculatedDimensions(preset);
    } else {
      setCalculatedDimensions(null);
    }
  }, [uploadedImage, resizeMode, width, height, percentage, selectedPreset, maintainAspectRatio]);

  const handleResize = async () => {
    if (!uploadedImage || !calculatedDimensions) return;

    setIsResizing(true);
    setResizeError(null);
    setResizedImage(null);

    try {
      const options: ResizeOptions = {
        width: calculatedDimensions.width,
        height: calculatedDimensions.height,
        maintainAspectRatio,
        quality: 100,
      };

      const validationError = validateResizeOptions(options);
      if (validationError) {
        setResizeError(validationError);
        return;
      }

      const result = await resizeImage(uploadedImage.preview, options);
      setResizedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al redimensionar la imagen';
      setResizeError(errorMessage);
    } finally {
      setIsResizing(false);
    }
  };

  const handleDownload = async () => {
    if (resizedImage) {
      await downloadProcessedImage(resizedImage);
    }
  };

  const handlePresetClick = (presetName: string) => {
    setSelectedPreset(presetName);
    setResizeMode('preset');
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
              <h1 className="text-2xl font-bold text-gray-900">Redimensionar Imagen</h1>
              <p className="text-sm text-gray-600">
                Cambia las dimensiones de tu imagen por píxeles, porcentaje o presets
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
                    setResizedImage(null);
                    setResizeError(null);
                    setWidth(undefined);
                    setHeight(undefined);
                    setPercentage(100);
                    setSelectedPreset('');
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
                        setResizedImage(null);
                        setResizeError(null);
                        setWidth(undefined);
                        setHeight(undefined);
                        setPercentage(100);
                        setSelectedPreset('');
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

                {/* Opciones de redimensionamiento */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Opciones de redimensionamiento
                  </h2>

                  <div className="space-y-6">
                    {/* Modo de redimensionamiento */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Modo
                      </label>
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Modo de redimensionamiento">
                        <button
                          onClick={() => setResizeMode('pixels')}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            resizeMode === 'pixels'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-pressed={resizeMode === 'pixels'}
                          aria-label="Redimensionar por píxeles"
                        >
                          Píxeles
                        </button>
                        <button
                          onClick={() => setResizeMode('percentage')}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            resizeMode === 'percentage'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-pressed={resizeMode === 'percentage'}
                          aria-label="Redimensionar por porcentaje"
                        >
                          Porcentaje
                        </button>
                        <button
                          onClick={() => setResizeMode('preset')}
                          className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                            resizeMode === 'preset'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                          aria-pressed={resizeMode === 'preset'}
                          aria-label="Redimensionar usando presets"
                        >
                          Presets
                        </button>
                      </div>
                    </div>

                    {/* Por Píxeles */}
                    {resizeMode === 'pixels' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <input
                            type="checkbox"
                            id="maintainAspectRatio"
                            checked={maintainAspectRatio}
                            onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                            className="w-4 h-4 accent-blue-600"
                            aria-describedby="aspect-ratio-description"
                          />
                          <label
                            htmlFor="maintainAspectRatio"
                            className="text-sm font-medium text-gray-700"
                          >
                            Mantener proporción (aspect ratio)
                          </label>
                        </div>
                        <p id="aspect-ratio-description" className="sr-only">
                          Cuando está activado, el alto se ajustará automáticamente al cambiar el ancho para mantener la proporción original
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="width-input" className="text-sm font-medium text-gray-700 mb-2 block">
                              Ancho (px)
                            </label>
                            <input
                              id="width-input"
                              type="number"
                              min="1"
                              max="10000"
                              value={width || ''}
                              onChange={(e) =>
                                setWidth(e.target.value ? Number(e.target.value) : undefined)
                              }
                              placeholder={`Original: ${uploadedImage.width}`}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              aria-label="Ancho en píxeles"
                            />
                          </div>
                          <div>
                            <label htmlFor="height-input" className="text-sm font-medium text-gray-700 mb-2 block">
                              Alto (px)
                            </label>
                            <input
                              id="height-input"
                              type="number"
                              min="1"
                              max="10000"
                              value={height || ''}
                              onChange={(e) =>
                                setHeight(e.target.value ? Number(e.target.value) : undefined)
                              }
                              placeholder={`Original: ${uploadedImage.height}`}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                              disabled={maintainAspectRatio && !!width}
                              aria-label="Alto en píxeles"
                              aria-disabled={maintainAspectRatio && !!width}
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Por Porcentaje */}
                    {resizeMode === 'percentage' && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label htmlFor="percentage-slider" className="text-sm font-medium text-gray-700">
                            Escalar al
                          </label>
                          <span className="text-sm font-semibold text-blue-600" aria-live="polite">
                            {percentage}%
                          </span>
                        </div>
                        <input
                          id="percentage-slider"
                          type="range"
                          min="10"
                          max="200"
                          step="5"
                          value={percentage}
                          onChange={(e) => setPercentage(Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                          aria-label="Control de escala por porcentaje"
                          aria-valuemin={10}
                          aria-valuemax={200}
                          aria-valuenow={percentage}
                          aria-valuetext={`${percentage} por ciento`}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1" aria-hidden="true">
                          <span>10%</span>
                          <span>100%</span>
                          <span>200%</span>
                        </div>
                      </div>
                    )}

                    {/* Presets */}
                    {resizeMode === 'preset' && (
                      <div className="space-y-3">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Selecciona un preset
                        </label>
                        <div 
                          className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto scrollbar-custom"
                          role="listbox"
                          aria-label="Lista de presets de dimensiones"
                        >
                          {Object.entries(RESIZE_PRESETS).map(([name, dimensions]) => (
                            <button
                              key={name}
                              onClick={() => handlePresetClick(name)}
                              className={`text-left px-4 py-3 rounded-lg border-2 transition-all ${
                                selectedPreset === name
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 hover:border-blue-300 bg-white'
                              }`}
                              role="option"
                              aria-selected={selectedPreset === name}
                              aria-label={`Preset ${name}: ${dimensions.width} por ${dimensions.height} píxeles`}
                            >
                              <div className="font-medium text-sm text-gray-900">{name}</div>
                              <div className="text-xs text-gray-500">
                                {dimensions.width} × {dimensions.height} px
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Dimensiones calculadas */}
                    {calculatedDimensions && (
                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200" role="status" aria-live="polite">
                        <h3 className="text-sm font-semibold text-blue-900 mb-2">
                          Nuevas dimensiones
                        </h3>
                        <div className="flex items-center gap-4 text-sm">
                          <div>
                            <span className="text-blue-600 font-medium">Ancho:</span>
                            <span className="text-blue-900 ml-2 font-semibold">
                              {calculatedDimensions.width}px
                            </span>
                          </div>
                          <div>
                            <span className="text-blue-600 font-medium">Alto:</span>
                            <span className="text-blue-900 ml-2 font-semibold">
                              {calculatedDimensions.height}px
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Botón redimensionar */}
                    <button
                      onClick={handleResize}
                      disabled={isResizing || !calculatedDimensions}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      aria-label={isResizing ? 'Redimensionando imagen' : 'Redimensionar imagen con las opciones seleccionadas'}
                    >
                      {isResizing ? (
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
                          Redimensionando...
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
                              d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                            />
                          </svg>
                          Redimensionar imagen
                        </>
                      )}
                    </button>

                    {resizeError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-sm text-red-600">{resizeError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Columna Derecha - Resultado */}
          <div className="space-y-6">
            {resizedImage ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagen Redimensionada
                  </h2>
                  <ImagePreview
                    imageUrl={resizedImage.url}
                    title="Redimensionada"
                    dimensions={resizedImage.dimensions}
                    fileSize={resizedImage.size}
                  />
                </div>

                {/* Comparación */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Comparación
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Dimensiones originales</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {uploadedImage!.width} × {uploadedImage!.height}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Nuevas dimensiones
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {resizedImage.dimensions?.width} × {resizedImage.dimensions?.height}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tamaño archivo</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(resizedImage.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Cambio de escala</span>
                      <span className="text-sm font-semibold text-blue-600">
                        {uploadedImage && resizedImage.dimensions
                          ? Math.round(
                              (resizedImage.dimensions.width / uploadedImage.width!) * 100
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón descargar */}
                <DownloadButton
                  imageUrl={resizedImage.url}
                  fileName="imagen-redimensionada"
                  format="png"
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
                      d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Configura las dimensiones y haz click en redimensionar
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
    Redimensionar Imágenes Online Gratis - Cambiar Tamaño de Fotos
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Cambia el tamaño de tus imágenes de forma rápida y profesional con nuestra herramienta online gratuita. Redimensiona por píxeles exactos, porcentaje de escala o usando presets predefinidos. Perfecto para optimizar imágenes para web, redes sociales, email o impresión manteniendo la calidad original.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Cuándo necesitas redimensionar una imagen?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Optimización web:</strong> Reduce el tamaño de imágenes grandes para mejorar la velocidad de carga de tu sitio</li>
      <li><strong>Redes sociales:</strong> Adapta fotos a las dimensiones exactas requeridas por cada plataforma</li>
      <li><strong>Email marketing:</strong> Disminuye el peso de imágenes para newsletters y correos sin perder calidad</li>
      <li><strong>Almacenamiento:</strong> Ahorra espacio reduciendo el tamaño de fotos mientras mantienes calidad visual</li>
      <li><strong>Impresión:</strong> Ajusta imágenes a dimensiones específicas de impresión (4×6, 5×7, 8×10 pulgadas)</li>
      <li><strong>Presentaciones:</strong> Optimiza imágenes para PowerPoint, Keynote o Google Slides</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo redimensionar una imagen?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
      <li>Elige tu modo preferido: píxeles, porcentaje o presets predefinidos</li>
      <li>En modo píxeles: ingresa ancho y/o alto específico (con opción de mantener proporción)</li>
      <li>En modo porcentaje: usa el slider para escalar de 10% a 200%</li>
      <li>En modo presets: selecciona dimensiones estándar para web, HD, redes sociales, etc.</li>
      <li>Revisa las nuevas dimensiones calculadas en tiempo real</li>
      <li>Haz clic en Redimensionar imagen y descarga tu resultado instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Tres formas de redimensionar:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Por Píxeles:</strong> Control preciso de dimensiones exactas. Define ancho y/o alto específico. Opción de mantener proporción automáticamente o ajustar libremente. Ideal cuando necesitas dimensiones exactas para un propósito específico.</li>
      <li><strong>Por Porcentaje:</strong> Escala proporcional de 10% a 200%. Mantiene siempre la proporción original de la imagen. Perfecto para hacer versiones más pequeñas o grandes manteniendo la apariencia. Slider interactivo para ajustes rápidos.</li>
      <li><strong>Presets Predefinidos:</strong> Dimensiones estándar listas para usar. Incluye formatos populares como HD, Full HD, 4K, web, y más. Un clic para aplicar tamaños comunes sin cálculos manuales.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Presets de dimensiones disponibles:
    </h3>
    <p className="text-gray-600 mb-4">
      Dimensiones estándar listas para usar sin necesidad de calcular:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Web pequeño:</strong> 640×480px - Ideal para miniaturas y previews</li>
      <li><strong>Web mediano:</strong> 1024×768px - Perfecto para imágenes de blog y contenido web</li>
      <li><strong>Web grande:</strong> 1280×720px - Para banners y hero images</li>
      <li><strong>HD (720p):</strong> 1280×720px - Calidad HD estándar</li>
      <li><strong>Full HD (1080p):</strong> 1920×1080px - Alta definición completa</li>
      <li><strong>2K:</strong> 2560×1440px - Calidad superior para displays modernos</li>
      <li><strong>4K:</strong> 3840×2160px - Ultra alta definición</li>
      <li><strong>Instagram cuadrado:</strong> 1080×1080px - Posts de Instagram</li>
      <li><strong>Facebook cover:</strong> 820×312px - Portada de Facebook</li>
      <li><strong>Twitter header:</strong> 1500×500px - Cabecera de Twitter</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Dimensiones recomendadas para diferentes usos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Fotos de producto (e-commerce):</strong> 1000-2000px de ancho para permitir zoom sin perder calidad</li>
      <li><strong>Imágenes de blog:</strong> 800-1200px de ancho, mantiene calidad sin ralentizar carga</li>
      <li><strong>Email newsletters:</strong> 600-800px de ancho máximo para compatibilidad con clientes de correo</li>
      <li><strong>Perfiles sociales:</strong> Varía por plataforma, usa nuestros presets para dimensiones exactas</li>
      <li><strong>Fondos de pantalla:</strong> Según resolución de tu pantalla (1920×1080 común para laptops)</li>
      <li><strong>Impresión 4×6 pulgadas:</strong> 1200×1800px mínimo (300 DPI)</li>
      <li><strong>Impresión 8×10 pulgadas:</strong> 2400×3000px mínimo (300 DPI)</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Cálculo en tiempo real:</strong> Ve las nuevas dimensiones instantáneamente mientras ajustas</li>
      <li><strong>Mantener proporción:</strong> Opción para preservar el aspect ratio original automáticamente</li>
      <li><strong>Tres modos flexibles:</strong> Píxeles exactos, porcentaje de escala o presets predefinidos</li>
      <li><strong>Vista comparativa:</strong> Compara dimensiones originales vs nuevas antes de descargar</li>
      <li><strong>Indicador de escala:</strong> Visualiza el porcentaje de cambio de tamaño</li>
      <li><strong>Calidad preservada:</strong> Algoritmos de redimensionamiento que mantienen nitidez</li>
      <li><strong>Sin pérdida innecesaria:</strong> Procesamiento optimizado para mejor relación calidad/tamaño</li>
      <li><strong>Procesamiento instantáneo:</strong> Resultados en segundos sin importar el tamaño original</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso profesionales:
    </h3>
    <p className="text-gray-600 mb-4">
      Esta herramienta es esencial para múltiples profesionales:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Desarrolladores web:</strong> Optimiza imágenes para mejorar velocidad de carga y Core Web Vitals</li>
      <li><strong>Diseñadores gráficos:</strong> Crea múltiples versiones de una imagen para diferentes medios</li>
      <li><strong>Fotógrafos:</strong> Genera versiones web de fotos en alta resolución para portfolios online</li>
      <li><strong>E-commerce:</strong> Prepara imágenes de productos con dimensiones consistentes para tiendas online</li>
      <li><strong>Bloggers:</strong> Optimiza imágenes destacadas para mejorar SEO y experiencia de usuario</li>
      <li><strong>Social media managers:</strong> Adapta contenido visual rápidamente para múltiples plataformas</li>
      <li><strong>Email marketers:</strong> Reduce peso de imágenes para newsletters que cargan rápido</li>
      <li><strong>Presentadores:</strong> Ajusta imágenes para PowerPoint sin exceder límites de archivo</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Redimensionar vs Recortar: ¿Cuál usar?
    </h3>
    <p className="text-gray-600 mb-4">
      Aunque ambas cambian las dimensiones, funcionan de manera diferente:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Redimensionar:</strong> Cambia el tamaño total manteniendo toda la composición. Hace la imagen más grande o pequeña. No elimina ninguna parte.</li>
      <li><strong>Recortar:</strong> Elimina partes de la imagen para cambiar composición o proporción. Mantiene resolución del área seleccionada.</li>
      <li><strong>Usa redimensionar cuando:</strong> Necesites optimizar tamaño sin cambiar composición, o escalar para diferentes dispositivos</li>
      <li><strong>Usa recortar cuando:</strong> Necesites cambiar proporción, eliminar elementos no deseados o mejorar encuadre</li>
      <li><strong>Combina ambas:</strong> Primero recorta para composición perfecta, luego redimensiona para tamaño óptimo</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Optimización para SEO y rendimiento web:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Google PageSpeed:</strong> Imágenes optimizadas mejoran significativamente tu puntuación</li>
      <li><strong>Core Web Vitals:</strong> LCP (Largest Contentful Paint) se beneficia de imágenes más ligeras</li>
      <li><strong>Mobile-first:</strong> Dimensiones apropiadas evitan que móviles descarguen imágenes innecesariamente grandes</li>
      <li><strong>Ancho de banda:</strong> Usuarios con conexiones lentas apreciarán cargas más rápidas</li>
      <li><strong>Responsive design:</strong> Crea múltiples tamaños para servir la imagen correcta según dispositivo</li>
      <li><strong>Hosting costs:</strong> Archivos más pequeños reducen costos de almacenamiento y transferencia</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consejos para mejores resultados:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Reducir tamaño:</strong> Siempre redimensiona desde imagen de alta resolución hacia abajo, nunca amplíes demasiado</li>
      <li><strong>Mantener proporción:</strong> Activa mantener aspect ratio para evitar distorsión de la imagen</li>
      <li><strong>Regla 2x:</strong> Para pantallas Retina/HiDPI, considera hacer imágenes 2x del tamaño de visualización</li>
      <li><strong>Tamaño máximo web:</strong> Para web, raramente necesitas más de 2000px de ancho</li>
      <li><strong>Múltiples versiones:</strong> Crea varios tamaños para servir diferentes dispositivos (responsive images)</li>
      <li><strong>Preservar originales:</strong> Guarda siempre una copia de alta resolución antes de redimensionar</li>
      <li><strong>Prueba visual:</strong> Revisa la imagen redimensionada en el contexto donde se usará</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Impacto en calidad de imagen:
    </h3>
    <p className="text-gray-600 mb-4">
      Entender cómo afecta el redimensionamiento a la calidad:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Reducir tamaño (downscaling):</strong> Generalmente seguro, mantiene buena calidad visual</li>
      <li><strong>Aumentar tamaño (upscaling):</strong> Puede causar pixelación o pérdida de nitidez si excedes mucho</li>
      <li><strong>Límite de ampliación:</strong> No amplíes más del 125-150% para mantener calidad aceptable</li>
      <li><strong>Algoritmos de interpolación:</strong> Usamos métodos de alta calidad para minimizar artefactos</li>
      <li><strong>Mejor práctica:</strong> Empieza con imágenes de mayor resolución de la que necesitas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Redimensionamiento por lotes vs individual:
    </h3>
    <p className="text-gray-600 mb-4">
      Nuestra herramienta procesa imágenes individualmente, lo cual es ideal para:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Control preciso:</strong> Ajusta cada imagen según sus necesidades específicas</li>
      <li><strong>Diferentes dimensiones:</strong> Cada imagen puede requerir tamaños distintos</li>
      <li><strong>Revisión visual:</strong> Verifica resultado antes de procesar la siguiente</li>
      <li><strong>Privacidad:</strong> Procesa imágenes sensibles una por una sin subirlas a servidores</li>
      <li><strong>Flexibilidad:</strong> Cambia método (píxeles/porcentaje/preset) entre imágenes</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formatos y compatibilidad:
    </h3>
    <p className="text-gray-600 mb-4">
      Trabaja con los formatos de imagen más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Procesa imágenes de hasta 50MB, ideal para:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Fotos DSLR:</strong> Procesa imágenes de cámaras profesionales de 20+ megapíxeles</li>
      <li><strong>Smartphones modernos:</strong> Maneja fotos de iPhone, Samsung, Google Pixel de alta resolución</li>
      <li><strong>Scans de alta calidad:</strong> Reduce documentos escaneados a tamaños manejables</li>
      <li><strong>Diseños gráficos:</strong> Optimiza exports de Photoshop, Illustrator o Figma</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otras herramientas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin instalación:</strong> No necesitas Photoshop, GIMP o software especializado</li>
      <li><strong>Tres métodos integrados:</strong> Píxeles, porcentaje y presets en una sola herramienta</li>
      <li><strong>Vista previa calculada:</strong> Ve dimensiones exactas antes de procesar</li>
      <li><strong>Privacidad absoluta:</strong> Todo el procesamiento en tu navegador, sin subir imágenes</li>
      <li><strong>Completamente gratis:</strong> Sin límites de uso, sin marcas de agua, sin registro</li>
      <li><strong>Interfaz intuitiva:</strong> Más simple que Photoshop, más potente que apps básicas</li>
      <li><strong>Comparación visual:</strong> Ve antes/después con métricas detalladas</li>
      <li><strong>Presets inteligentes:</strong> Dimensiones estándar sin necesidad de buscarlas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consideraciones técnicas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Aspect ratio:</strong> Proporción ancho/alto que define la forma de la imagen</li>
      <li><strong>DPI vs píxeles:</strong> DPI importa para impresión, píxeles para pantallas</li>
      <li><strong>Resolución nativa:</strong> Tamaño en píxeles es lo que importa para displays</li>
      <li><strong>Downsampling:</strong> Reducir píxeles generalmente mantiene calidad visual</li>
      <li><strong>Upsampling:</strong> Aumentar píxeles crea información mediante interpolación</li>
      <li><strong>Bicubic interpolation:</strong> Método de alta calidad que usamos para redimensionar</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Errores comunes al redimensionar:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>No mantener proporción:</strong> Desactivar aspect ratio puede distorsionar la imagen</li>
      <li><strong>Ampliar demasiado:</strong> Upscaling extremo ( superior a  200%) causa pixelación notable</li>
      <li><strong>Un solo tamaño para todo:</strong> Crea múltiples versiones para diferentes usos</li>
      <li><strong>Olvidar el contexto:</strong> Considera dónde se verá (móvil, desktop, impreso)</li>
      <li><strong>No probar el resultado:</strong> Siempre revisa cómo se ve en el contexto final</li>
      <li><strong>Perder originales:</strong> Mantén siempre copias de alta resolución</li>
    </ul>

    <p className="text-gray-600">
      Ya sea que necesites optimizar imágenes para tu sitio web, adaptar fotos para redes sociales, reducir el peso de archivos para email, o preparar imágenes para impresión, esta herramienta te proporciona el control preciso y la flexibilidad que necesitas. Redimensiona profesionalmente con cálculos en tiempo real, múltiples métodos y resultados instantáneos, todo de forma gratuita y privada.
    </p>
  </div>
</article>
    </div>
  );
}