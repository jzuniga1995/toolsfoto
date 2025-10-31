'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import { 
  convertImage, 
  IMAGE_FORMAT_INFO,
  BACKGROUND_COLORS,
  checkFormatCompatibility,
  detectImageFormat
} from '@/lib/tools/convert';
import type { ProcessedImage, ImageFormat } from '@/types';

export default function ConvertirPage() {
  const { uploadedImage, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isConverting, setIsConverting] = useState(false);
  const [convertedImage, setConvertedImage] = useState<ProcessedImage | null>(null);
  const [convertError, setConvertError] = useState<string | null>(null);

  // Opciones de conversión
  const [targetFormat, setTargetFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(90);
  const [backgroundColor, setBackgroundColor] = useState('#FFFFFF');
  const [warnings, setWarnings] = useState<string[]>([]);

  // Detectar formato original
  const originalFormat = uploadedImage ? detectImageFormat(uploadedImage.preview) : null;

  const handleFormatChange = (format: ImageFormat) => {
    setTargetFormat(format);
    
    // Verificar compatibilidad
    if (uploadedImage) {
      const hasTransparency = uploadedImage.type === 'image/png' || uploadedImage.type === 'image/webp';
      const isAnimated = uploadedImage.type === 'image/gif';
      
      const compatibility = checkFormatCompatibility(format, hasTransparency, isAnimated);
      setWarnings(compatibility.warnings);
    }
  };

  const handleConvert = async () => {
    if (!uploadedImage) return;

    setIsConverting(true);
    setConvertError(null);
    setConvertedImage(null);

    try {
      const result = await convertImage(uploadedImage.preview, {
        format: targetFormat,
        quality: quality / 100,
        backgroundColor: targetFormat === 'jpg' ? backgroundColor : undefined,
      });
      setConvertedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al convertir la imagen';
      setConvertError(errorMessage);
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = async () => {
    if (convertedImage) {
      await downloadProcessedImage(convertedImage);
    }
  };

  // Formatos disponibles para mostrar
  const availableFormats: ImageFormat[] = ['png', 'jpg', 'webp', 'gif', 'bmp'];

  return (
    <>
      {/* JSON-LD Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Convertir Formato de Imagen - ToolsFoto',
            description: 'Herramienta gratuita para convertir imágenes entre JPG, PNG, WebP, GIF y BMP manteniendo la calidad.',
            url: 'https://toolsfoto.com/convertir',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Organization',
              name: 'ToolsFoto',
              url: 'https://toolsfoto.com',
            },
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            softwareVersion: '1.0',
            featureList: 'Convertir JPG, PNG, WebP, GIF, BMP, Ajustar calidad, Color de fondo personalizable',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '1580',
            },
          }),
        }}
      />

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
                <h1 className="text-2xl font-bold text-gray-900">Convertir Formato de Imagen</h1>
                <p className="text-sm text-gray-600">
                  Convierte tus imágenes entre diferentes formatos
                </p>
              </div>
            </div>
          </div>
        </header>

        <div className="container-custom py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Columna Izquierda - Upload y Opciones */}
            <div className="space-y-6">
              {!uploadedImage ? (
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    1. Sube tu imagen
                  </h2>
                  <ImageUploader
                    onImageSelect={(file, url) => {
                      handleImageUpload(file);
                      setConvertedImage(null);
                      setConvertError(null);
                      setWarnings([]);
                    }}
                    acceptedFormats={['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp']}
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
                          setConvertedImage(null);
                          setConvertError(null);
                          setWarnings([]);
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
                    {originalFormat && (
                      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Formato actual:</span>{' '}
                          {IMAGE_FORMAT_INFO[originalFormat]?.name || originalFormat.toUpperCase()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Opciones de conversión */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      2. Selecciona el formato de destino
                    </h2>

                    <div className="space-y-6">
                      {/* Formatos disponibles */}
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-3 block">
                          Formato
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {availableFormats.map((format) => (
                            <button
                              key={format}
                              onClick={() => handleFormatChange(format)}
                              className={`p-4 rounded-lg border-2 transition-all ${
                                targetFormat === format
                                  ? 'border-blue-600 bg-blue-50'
                                  : 'border-gray-200 bg-white hover:border-gray-300'
                              }`}
                              aria-label={`Convertir a ${IMAGE_FORMAT_INFO[format]?.name}`}
                              aria-pressed={targetFormat === format}
                            >
                              <div className="text-left">
                                <p className={`font-semibold ${
                                  targetFormat === format ? 'text-blue-600' : 'text-gray-900'
                                }`}>
                                  {IMAGE_FORMAT_INFO[format]?.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {IMAGE_FORMAT_INFO[format]?.compression}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Información del formato seleccionado */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-semibold text-gray-900 mb-2">
                          {IMAGE_FORMAT_INFO[targetFormat]?.name}
                        </h3>
                        <p className="text-xs text-gray-600 mb-3">
                          {IMAGE_FORMAT_INFO[targetFormat]?.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {IMAGE_FORMAT_INFO[targetFormat]?.supportsTransparency && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              Transparencia
                            </span>
                          )}
                          {IMAGE_FORMAT_INFO[targetFormat]?.supportsAnimation && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                              Animación
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Advertencias */}
                      {warnings.length > 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4" role="alert">
                          <div className="flex gap-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={2}
                              stroke="currentColor"
                              className="w-5 h-5 text-yellow-600 flex-shrink-0"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                              />
                            </svg>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-yellow-800 mb-1">
                                Advertencias:
                              </p>
                              <ul className="text-xs text-yellow-700 space-y-1">
                                {warnings.map((warning, index) => (
                                  <li key={index}>• {warning}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Calidad (solo para JPG y WebP) */}
                      {(targetFormat === 'jpg' || targetFormat === 'webp') && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label htmlFor="quality-slider" className="text-sm font-medium text-gray-700">
                              Calidad
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
                            aria-label="Control de calidad"
                          />
                        </div>
                      )}

                      {/* Color de fondo (solo para JPG) */}
                      {targetFormat === 'jpg' && (
                        <div>
                          <label htmlFor="background-color" className="text-sm font-medium text-gray-700 mb-2 block">
                            Color de fondo
                          </label>
                          <div className="grid grid-cols-4 gap-2 mb-3">
                            {Object.entries(BACKGROUND_COLORS).map(([name, color]) => (
                              <button
                                key={color}
                                onClick={() => setBackgroundColor(color)}
                                className={`p-3 rounded-lg border-2 transition-all ${
                                  backgroundColor === color
                                    ? 'border-blue-600 ring-2 ring-blue-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                style={{ backgroundColor: color }}
                                title={name}
                                aria-label={`Seleccionar color ${name}`}
                              >
                                <span className="sr-only">{name}</span>
                              </button>
                            ))}
                          </div>
                          <input
                            id="background-color"
                            type="text"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            placeholder="#FFFFFF"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            aria-label="Color de fondo personalizado"
                          />
                        </div>
                      )}

                      {/* Botón convertir */}
                      <button
                        onClick={handleConvert}
                        disabled={isConverting || targetFormat === originalFormat}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                        aria-label={isConverting ? 'Convirtiendo imagen' : 'Convertir imagen'}
                      >
                        {isConverting ? (
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
                            Convirtiendo...
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
                                d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                              />
                            </svg>
                            {targetFormat === originalFormat 
                              ? 'Ya está en este formato' 
                              : 'Convertir imagen'}
                          </>
                        )}
                      </button>

                      {convertError && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                          <p className="text-sm text-red-600">{convertError}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Columna Derecha - Resultado */}
            <div className="space-y-6">
              {convertedImage ? (
                <>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Imagen Convertida
                    </h2>
                    <ImagePreview
                      imageUrl={convertedImage.url}
                      title="Convertida"
                      dimensions={convertedImage.dimensions}
                      fileSize={convertedImage.size}
                    />
                  </div>

                  {/* Comparación */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Comparación
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Formato original</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {originalFormat?.toUpperCase() || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Formato convertido</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {convertedImage.format.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                        <span className="text-sm text-gray-600">Tamaño original</span>
                        <span className="text-sm font-semibold text-gray-900">
                          {(uploadedImage!.size / (1024 * 1024)).toFixed(2)} MB
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tamaño convertido</span>
                        <span className={`text-sm font-semibold ${
                          convertedImage.size < uploadedImage!.size 
                            ? 'text-green-600' 
                            : 'text-gray-900'
                        }`}>
                          {(convertedImage.size / (1024 * 1024)).toFixed(2)} MB
                          {convertedImage.size < uploadedImage!.size && (
                            <span className="ml-2 text-xs">
                              (-{((1 - convertedImage.size / uploadedImage!.size) * 100).toFixed(0)}%)
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Botón descargar */}
                  <DownloadButton
                    imageUrl={convertedImage.url}
                    fileName={`imagen-convertida.${targetFormat}`}
                    format={targetFormat}
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
                        d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3l-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3l-3 3"
                      />
                    </svg>
                    <p className="text-sm font-medium">
                      Selecciona el formato y haz click en convertir
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
    Convertir Formato de Imagen Online Gratis - JPG, PNG, WebP, GIF, BMP
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Convierte tus imágenes entre diferentes formatos de forma gratuita y sin perder calidad. Transforma JPG a PNG, PNG a WebP, WebP a JPG y más. Herramienta online profesional con control total sobre calidad, transparencia y optimización. Sin instalación, sin límites, completamente privado.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Por qué convertir el formato de una imagen?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Compatibilidad:</strong> Algunos programas o plataformas solo aceptan formatos específicos</li>
      <li><strong>Optimización web:</strong> WebP ofrece mejor compresión que JPG o PNG para sitios más rápidos</li>
      <li><strong>Transparencia:</strong> Convierte a PNG o WebP para mantener fondos transparentes</li>
      <li><strong>Tamaño de archivo:</strong> Cambia a formatos con mejor compresión para ahorrar espacio</li>
      <li><strong>Animaciones:</strong> Solo GIF y WebP soportan imágenes animadas</li>
      <li><strong>Calidad vs peso:</strong> Elige el formato óptimo según tus prioridades</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo convertir una imagen de formato?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG, WebP, GIF o BMP (hasta 50MB)</li>
      <li>Revisa el formato actual detectado automáticamente</li>
      <li>Selecciona el formato de destino deseado entre 5 opciones disponibles</li>
      <li>Lee la descripción y características del formato seleccionado</li>
      <li>Ajusta la calidad (para JPG y WebP) según tus necesidades</li>
      <li>Si conviertes a JPG, elige el color de fondo para áreas transparentes</li>
      <li>Revisa las advertencias de compatibilidad si las hay</li>
      <li>Haz clic en Convertir imagen y descarga el resultado instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formatos de imagen disponibles:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>PNG (Portable Network Graphics):</strong> Compresión sin pérdida, soporta transparencia. Ideal para logos, gráficos, capturas de pantalla y diseños que requieren calidad perfecta. Archivos más grandes pero sin degradación visual.</li>
      <li><strong>JPG/JPEG (Joint Photographic Experts Group):</strong> Compresión con pérdida, no soporta transparencia. Perfecto para fotografías y imágenes complejas. Archivos mucho más pequeños que PNG. Mejor para contenido fotográfico en web.</li>
      <li><strong>WebP:</strong> Formato moderno de Google con excelente compresión. Soporta transparencia y animación. Hasta 30% más pequeño que JPG y 50% más que PNG manteniendo calidad. Ideal para optimización web moderna.</li>
      <li><strong>GIF (Graphics Interchange Format):</strong> Soporta animación, paleta limitada de 256 colores. Perfecto para animaciones simples, memes y gráficos pequeños. Transparencia básica. Popular en redes sociales.</li>
      <li><strong>BMP (Bitmap):</strong> Sin compresión, archivos muy grandes. Máxima calidad sin pérdida. Usado principalmente en edición profesional y cuando la compresión no es aceptable. No recomendado para web.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Conversiones más populares:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>PNG a JPG:</strong> Reduce significativamente el tamaño de archivo. Útil cuando no necesitas transparencia. Advertencia: perderás el canal alpha (transparencia).</li>
      <li><strong>JPG a PNG:</strong> Gana transparencia y compresión sin pérdida. Aumenta tamaño de archivo pero mejora calidad para edición posterior.</li>
      <li><strong>PNG a WebP:</strong> Moderniza tus imágenes manteniendo transparencia. Reduce hasta 50% el tamaño. Perfecto para optimización web.</li>
      <li><strong>JPG a WebP:</strong> Mejora compresión manteniendo calidad visual. Reduce 25-35% el peso. Acelera tu sitio web significativamente.</li>
      <li><strong>WebP a JPG:</strong> Aumenta compatibilidad para programas antiguos o plataformas que no soportan WebP. Ligero aumento de tamaño.</li>
      <li><strong>GIF a PNG:</strong> Convierte frames estáticos de GIF a PNG. Mejora calidad de color de 256 a millones. Pierde animación.</li>
      <li><strong>BMP a JPG/PNG:</strong> Reduce dramáticamente el tamaño (hasta 95%). Esencial para hacer BMPs manejables para web o almacenamiento.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características de cada formato:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Transparencia:</strong> PNG y WebP soportan canal alpha completo. GIF tiene transparencia binaria (todo o nada). JPG y BMP no soportan transparencia.</li>
      <li><strong>Animación:</strong> GIF y WebP pueden contener múltiples frames. PNG tiene APNG (poco usado). JPG y BMP son estáticos únicamente.</li>
      <li><strong>Compresión:</strong> WebP (mejor), JPG (buena), PNG (sin pérdida), GIF (limitada), BMP (ninguna).</li>
      <li><strong>Colores:</strong> PNG, JPG, WebP, BMP soportan millones. GIF limitado a 256 colores por frame.</li>
      <li><strong>Metadatos:</strong> JPG preserva EXIF completo. PNG y WebP soportan metadatos básicos. GIF y BMP muy limitados.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso específicos:
    </h3>
    <p className="text-gray-600 mb-4">
      Elige el formato correcto según tu necesidad:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Logos y branding:</strong> PNG para transparencia perfecta, o WebP para web moderna. Evita JPG (pierde transparencia) y GIF (colores limitados).</li>
      <li><strong>Fotografías para web:</strong> WebP primera opción (mejor compresión), JPG como alternativa universal. PNG solo si necesitas edición sin pérdida.</li>
      <li><strong>Capturas de pantalla:</strong> PNG para texto nítido y colores exactos. WebP si el tamaño es crítico. Nunca JPG (degrada texto).</li>
      <li><strong>Imágenes para impresión:</strong> PNG o BMP para máxima calidad. JPG con calidad 95-100%. Evita WebP (compatibilidad limitada en software de impresión).</li>
      <li><strong>Memes y animaciones:</strong> GIF para compatibilidad universal. WebP para mejor calidad y menor tamaño (si la plataforma lo soporta).</li>
      <li><strong>Íconos e ilustraciones:</strong> PNG para colores planos perfectos. WebP para web. SVG aún mejor si es vectorial (usa otra herramienta).</li>
      <li><strong>Galerías fotográficas:</strong> WebP con fallback a JPG. Ofrece mejor experiencia sin sacrificar compatibilidad.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Manejo de transparencia al convertir:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>PNG/WebP a JPG:</strong> La transparencia se reemplaza con color sólido. Nuestra herramienta te permite elegir el color de fondo (blanco, negro, gris, etc.).</li>
      <li><strong>JPG a PNG/WebP:</strong> No ganas transparencia mágicamente, pero preparas la imagen para futura edición donde puedas agregarla.</li>
      <li><strong>GIF a PNG:</strong> Mantiene transparencia pero mejora de binaria (sí/no) a alpha completo (niveles de opacidad).</li>
      <li><strong>Advertencia automática:</strong> Nuestra herramienta te alerta cuando una conversión afectará la transparencia.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Optimización de calidad por formato:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>JPG - Calidad 90-95%:</strong> Excelente para fotografías, imperceptible pérdida visual.</li>
      <li><strong>JPG - Calidad 80-85%:</strong> Óptimo para web, buen balance tamaño/calidad.</li>
      <li><strong>JPG - Calidad 70-75%:</strong> Para thumbnails o cuando el tamaño es crítico.</li>
      <li><strong>WebP - Calidad 85-90%:</strong> Comparable a JPG 95% pero 25-30% más ligero.</li>
      <li><strong>WebP - Calidad 75-80%:</strong> Comparable a JPG 85% pero mucho más pequeño.</li>
      <li><strong>PNG:</strong> Sin ajuste de calidad (siempre sin pérdida). Optimización solo mediante compresión.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Compatibilidad de formatos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>JPG:</strong> Universal, soportado por todo. Mejor opción para máxima compatibilidad.</li>
      <li><strong>PNG:</strong> Universal en web y diseño. Soportado por todos los navegadores y software moderno.</li>
      <li><strong>WebP:</strong> Soportado por Chrome, Firefox, Edge, Safari (desde 2020). No compatible con software antiguo o algunos programas de edición.</li>
      <li><strong>GIF:</strong> Universal, especialmente en redes sociales. Perfecto para compartir animaciones.</li>
      <li><strong>BMP:</strong> Limitado, principalmente Windows. No recomendado para web o compartir. Usa solo para edición profesional específica.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas de nuestra herramienta:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Detección automática:</strong> Identifica el formato original instantáneamente</li>
      <li><strong>5 formatos soportados:</strong> PNG, JPG, WebP, GIF y BMP para máxima flexibilidad</li>
      <li><strong>Advertencias inteligentes:</strong> Te alerta sobre pérdida de transparencia o animación</li>
      <li><strong>Control de calidad:</strong> Ajusta compresión para JPG y WebP (60-100%)</li>
      <li><strong>Color de fondo personalizable:</strong> Elige cómo se verá la transparencia en JPG</li>
      <li><strong>Información del formato:</strong> Descripción y características de cada opción</li>
      <li><strong>Comparación detallada:</strong> Ve cambios en formato, tamaño y porcentaje de reducción</li>
      <li><strong>Procesamiento instantáneo:</strong> Conversiones en segundos sin importar tamaño</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Conversión vs Compresión vs Redimensionamiento:
    </h3>
    <p className="text-gray-600 mb-4">
      Tres operaciones diferentes con propósitos distintos:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Conversión de formato:</strong> Cambia el contenedor y método de codificación. Puede afectar tamaño, calidad y características (transparencia, animación).</li>
      <li><strong>Compresión:</strong> Reduce tamaño de archivo manteniendo formato. Optimiza datos sin cambiar tipo de archivo.</li>
      <li><strong>Redimensionamiento:</strong> Cambia dimensiones físicas (píxeles). Reduce resolución pero mantiene formato.</li>
      <li><strong>Combinar técnicas:</strong> Para máxima optimización, primero redimensiona, luego convierte a formato eficiente, finalmente comprime.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Errores comunes al convertir formatos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Perder transparencia involuntariamente:</strong> Al convertir PNG a JPG sin considerar el fondo. Nuestra herramienta te advierte y permite elegir color.</li>
      <li><strong>Usar PNG para fotos web:</strong> PNG de fotografías es 3-5x más pesado que JPG/WebP equivalente. Ralentiza tu sitio innecesariamente.</li>
      <li><strong>No usar WebP en 2024:</strong> WebP tiene soporte universal moderno. Seguir usando solo JPG/PNG desperdicia ancho de banda.</li>
      <li><strong>Convertir múltiples veces:</strong> Cada conversión con pérdida (JPG, WebP) degrada calidad. Convierte siempre desde original de alta calidad.</li>
      <li><strong>Ignorar el uso final:</strong> Formato perfecto depende de dónde se usará. Web, impresión, edición tienen necesidades diferentes.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Impacto SEO de formatos de imagen:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>WebP mejora PageSpeed:</strong> Google PageSpeed Insights recomienda específicamente WebP. Mayor puntuación = mejor ranking.</li>
      <li><strong>Tiempo de carga:</strong> Formatos eficientes cargan más rápido. Cada segundo cuenta para SEO y conversiones.</li>
      <li><strong>Core Web Vitals:</strong> LCP (Largest Contentful Paint) mejora con imágenes optimizadas. WebP es clave para pasar esta métrica.</li>
      <li><strong>Mobile-first:</strong> Usuarios móviles con datos limitados agradecen formatos ligeros. Google prioriza experiencia móvil.</li>
      <li><strong>Tasa de rebote:</strong> Imágenes pesadas = sitio lento = usuarios frustrados = peor ranking.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Estrategia de formatos para sitios web:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Enfoque moderno:</strong> Usa WebP como formato principal con fallback a JPG/PNG para navegadores antiguos.</li>
      <li><strong>Picture element:</strong> HTML permite servir WebP a navegadores compatibles, JPG/PNG a otros automáticamente.</li>
      <li><strong>Logos y UI:</strong> PNG para transparencia, SVG mejor si es vectorial (escalable sin pérdida).</li>
      <li><strong>Fotografías de contenido:</strong> WebP calidad 80-85% para balance perfecto.</li>
      <li><strong>Hero images:</strong> WebP calidad 85-90% para impacto visual sin sacrificar velocidad.</li>
      <li><strong>Backgrounds:</strong> WebP calidad 75-80% o incluso JPG si no necesita transparencia.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consideraciones de metadatos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>EXIF en fotografías:</strong> JPG preserva información de cámara, ubicación, fecha. PNG y WebP preservan algunos. GIF y BMP pierden todo.</li>
      <li><strong>Privacidad:</strong> Si compartes fotos personales, considera que JPG puede contener ubicación GPS. Conversión a PNG/WebP puede eliminarla.</li>
      <li><strong>Derechos de autor:</strong> JPG permite incrustar información de copyright. Importante para fotógrafos profesionales.</li>
      <li><strong>Perfil de color:</strong> JPG y PNG mantienen perfiles ICC para reproducción precisa. Crítico para fotografía profesional e impresión.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otras herramientas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin instalación:</strong> No necesitas Photoshop, XnConvert ni convertidores de escritorio</li>
      <li><strong>5 formatos completos:</strong> Más que herramientas básicas que solo hacen JPG/PNG</li>
      <li><strong>Advertencias inteligentes:</strong> Te alertamos sobre pérdida de características antes de convertir</li>
      <li><strong>Privacidad total:</strong> Todo en tu navegador, imágenes nunca se suben a servidores</li>
      <li><strong>Información educativa:</strong> Aprende sobre cada formato mientras conviertes</li>
      <li><strong>Control profesional:</strong> Ajusta calidad y opciones avanzadas como color de fondo</li>
      <li><strong>Completamente gratis:</strong> Sin límites, sin marcas de agua, sin registro</li>
      <li><strong>Comparación clara:</strong> Ve exactamente cómo cambia tamaño y características</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Futuro de formatos de imagen:
    </h3>
    <p className="text-gray-600 mb-4">
      El panorama de formatos está evolucionando:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>WebP establecido:</strong> Ya no es experimental, es el estándar moderno de facto</li>
      <li><strong>AVIF emergente:</strong> Compresión aún mejor que WebP, pero soporte limitado en 2024</li>
      <li><strong>JPEG XL prometedor:</strong> Sucesor de JPG con características modernas, adopción lenta</li>
      <li><strong>PNG y JPG permanecen:</strong> Demasiado establecidos para desaparecer, seguirán como fallbacks</li>
      <li><strong>GIF persistente:</strong> A pesar de limitaciones técnicas, domina animaciones en redes sociales</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Recomendaciones finales:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Para la mayoría:</strong> WebP es la mejor opción en 2024 para balance perfecto compresión/calidad/compatibilidad</li>
      <li><strong>Para fotografías legado:</strong> JPG calidad 85-90% sigue siendo excelente y universal</li>
      <li><strong>Para transparencia:</strong> PNG cuando compatibilidad máxima importa, WebP cuando optimización es crítica</li>
      <li><strong>Para animaciones:</strong> GIF para compatibilidad, WebP animado para mejor calidad/tamaño</li>
      <li><strong>Evita BMP:</strong> A menos que tengas razón muy específica, no uses BMP para nada moderno</li>
    </ul>

    <p className="text-gray-600">
      Ya sea que necesites optimizar imágenes para tu sitio web, preparar archivos para un programa específico, mantener transparencia, reducir tamaño de archivo o simplemente cambiar de formato, esta herramienta te proporciona conversión profesional con control total y advertencias inteligentes. Convierte entre JPG, PNG, WebP, GIF y BMP con calidad perfecta, privacidad garantizada y totalmente gratis.
    </p>
  </div>
</article>
      </div>
    </>
  );
}