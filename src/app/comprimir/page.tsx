// src/app/comprimir/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import { compressImage, calculateCompressionRatio } from '@/lib/tools/compress';
import type { CompressionOptions, ProcessedImage } from '@/types';

export default function ComprimirPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isCompressing, setIsCompressing] = useState(false);
  const [compressedImage, setCompressedImage] = useState<ProcessedImage | null>(null);
  const [compressionError, setCompressionError] = useState<string | null>(null);

  // Opciones de compresión
  const [quality, setQuality] = useState(80);
  const [maxSizeMB, setMaxSizeMB] = useState(1);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState<number | undefined>(undefined);
  const [useMaxDimensions, setUseMaxDimensions] = useState(false);

  const handleCompress = async () => {
    if (!uploadedImage) return;

    setIsCompressing(true);
    setCompressionError(null);
    setCompressedImage(null);

    try {
      const options: CompressionOptions = {
        maxSizeMB,
        quality: quality / 100,
        maxWidthOrHeight: useMaxDimensions ? maxWidthOrHeight : undefined,
      };

      const result = await compressImage(uploadedImage.preview, options);
      setCompressedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al comprimir la imagen';
      setCompressionError(errorMessage);
    } finally {
      setIsCompressing(false);
    }
  };

  const handleDownload = async () => {
    if (compressedImage) {
      await downloadProcessedImage(compressedImage);
    }
  };

  const compressionRatio = uploadedImage && compressedImage
    ? calculateCompressionRatio(uploadedImage.size, compressedImage.size)
    : 0;

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
              <h1 className="text-2xl font-bold text-gray-900">Comprimir Imagen Online</h1>
              <p className="text-sm text-gray-600">
                Reduce el tamaño de tus imágenes sin perder calidad visible
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
                    setCompressedImage(null);
                    setCompressionError(null);
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
                        setCompressedImage(null);
                        setCompressionError(null);
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

                {/* Opciones de compresión */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Opciones de compresión
                  </h2>

                  <div className="space-y-6">
                    {/* Calidad */}
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
                        min="10"
                        max="100"
                        step="5"
                        value={quality}
                        onChange={(e) => setQuality(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label="Control de calidad de compresión"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Menor tamaño</span>
                        <span>Mayor calidad</span>
                      </div>
                    </div>

                    {/* Tamaño máximo */}
                    <div>
                      <label htmlFor="max-size" className="text-sm font-medium text-gray-700 mb-2 block">
                        Tamaño máximo del archivo
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          id="max-size"
                          type="number"
                          min="0.1"
                          max="10"
                          step="0.1"
                          value={maxSizeMB}
                          onChange={(e) => setMaxSizeMB(Number(e.target.value))}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          aria-label="Tamaño máximo en megabytes"
                        />
                        <span className="text-sm font-medium text-gray-700">MB</span>
                      </div>
                    </div>

                    {/* Redimensionar */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="checkbox"
                          id="useMaxDimensions"
                          checked={useMaxDimensions}
                          onChange={(e) => setUseMaxDimensions(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="useMaxDimensions"
                          className="text-sm font-medium text-gray-700"
                        >
                          Limitar dimensiones
                        </label>
                      </div>
                      {useMaxDimensions && (
                        <div className="mt-2">
                          <input
                            id="max-dimensions"
                            type="number"
                            min="100"
                            max="4096"
                            step="100"
                            value={maxWidthOrHeight || 1920}
                            onChange={(e) =>
                              setMaxWidthOrHeight(Number(e.target.value))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ej: 1920"
                            aria-label="Dimensión máxima en píxeles"
                          />
                          <p className="text-xs text-gray-500 mt-1">
                            Ancho o alto máximo en píxeles
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Botón comprimir */}
                    <button
                      onClick={handleCompress}
                      disabled={isCompressing}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      aria-label={isCompressing ? 'Comprimiendo imagen' : 'Comprimir imagen'}
                    >
                      {isCompressing ? (
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
                          Comprimiendo...
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
                              d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875l-2.25-2.25M12 13.875V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                            />
                          </svg>
                          Comprimir imagen
                        </>
                      )}
                    </button>

                    {compressionError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-sm text-red-600">{compressionError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Columna Derecha - Resultado */}
          <div className="space-y-6">
            {compressedImage ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagen Comprimida
                  </h2>
                  <ImagePreview
                    imageUrl={compressedImage.url}
                    title="Comprimida"
                    dimensions={compressedImage.dimensions}
                    fileSize={compressedImage.size}
                  />
                </div>

                {/* Estadísticas */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Resultados
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tamaño original</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(uploadedImage!.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">
                        Tamaño comprimido
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(compressedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        Reducción de tamaño
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        {compressionRatio}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón descargar */}
                <DownloadButton
                  imageUrl={compressedImage.url}
                  fileName="imagen-comprimida"
                  format="jpg"
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
                      d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m6 4.125l2.25 2.25m0 0l2.25-2.25M12 13.875l-2.25-2.25M12 13.875V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Configura las opciones y haz click en comprimir
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
    Comprimir Imágenes Online Gratis - Reduce el Tamaño sin Perder Calidad
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Reduce el tamaño de tus imágenes hasta un 90% sin perder calidad visible con nuestra herramienta de compresión online gratuita. Optimiza fotos para web, acelera tu sitio, ahorra espacio de almacenamiento y mejora tu SEO. Control total sobre calidad, tamaño máximo y dimensiones.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Por qué comprimir imágenes?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Velocidad de carga web:</strong> Sitios más rápidos mejoran experiencia de usuario y ranking en Google</li>
      <li><strong>SEO y posicionamiento:</strong> Google prioriza sitios que cargan rápido, las imágenes optimizadas son clave</li>
      <li><strong>Ahorro de ancho de banda:</strong> Reduce costos de hosting y transferencia de datos</li>
      <li><strong>Espacio de almacenamiento:</strong> Guarda más fotos en tu dispositivo, nube o servidor</li>
      <li><strong>Experiencia móvil:</strong> Usuarios con conexiones lentas apreciarán tiempos de carga menores</li>
      <li><strong>Email y mensajería:</strong> Envía fotos sin exceder límites de tamaño de archivos adjuntos</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo comprimir una imagen?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
      <li>Ajusta el nivel de calidad con el slider (10% a 100%) - recomendado: 75-85%</li>
      <li>Define el tamaño máximo del archivo deseado (0.1MB a 10MB)</li>
      <li>Opcionalmente, activa Limitar dimensiones para redimensionar además de comprimir</li>
      <li>Haz clic en Comprimir imagen y espera unos segundos</li>
      <li>Revisa las estadísticas de reducción de tamaño</li>
      <li>Descarga tu imagen optimizada instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Niveles de calidad recomendados:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>90-100%:</strong> Máxima calidad, compresión mínima. Para fotografía profesional, impresión o archivos maestros.</li>
      <li><strong>80-90%:</strong> Excelente calidad, buena compresión. Ideal para portfolios, galerías de fotos y sitios de fotografía.</li>
      <li><strong>75-80%:</strong> Muy buena calidad, compresión óptima. Recomendado para la mayoría de sitios web y blogs.</li>
      <li><strong>60-75%:</strong> Buena calidad, alta compresión. Perfecto para thumbnails, previews y carruseles de imágenes.</li>
      <li><strong>40-60%:</strong> Calidad aceptable, máxima compresión. Para imágenes de fondo, texturas o cuando el tamaño es crítico.</li>
      <li><strong>10-40%:</strong> Baja calidad, compresión extrema. Solo para placeholders o cuando el tamaño es absolutamente prioritario.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Opciones de compresión avanzadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Control de calidad:</strong> Slider de 10% a 100% para balance perfecto entre tamaño y calidad visual</li>
      <li><strong>Tamaño máximo de archivo:</strong> Define el peso objetivo (0.1MB a 10MB) y la herramienta ajustará automáticamente</li>
      <li><strong>Limitar dimensiones:</strong> Reduce también el tamaño en píxeles (100px a 4096px) para mayor compresión</li>
      <li><strong>Estadísticas en tiempo real:</strong> Ve el porcentaje exacto de reducción logrado</li>
      <li><strong>Comparación visual:</strong> Revisa tamaño original vs comprimido antes de descargar</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso profesionales:
    </h3>
    <p className="text-gray-600 mb-4">
      La compresión de imágenes es esencial para múltiples profesionales y situaciones:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Desarrolladores web:</strong> Optimiza recursos para mejorar PageSpeed Insights y Core Web Vitals</li>
      <li><strong>Diseñadores web:</strong> Balancea calidad visual con rendimiento del sitio</li>
      <li><strong>Bloggers y escritores:</strong> Reduce peso de imágenes destacadas sin perder atractivo visual</li>
      <li><strong>E-commerce:</strong> Acelera carga de páginas de producto manteniendo calidad de fotos</li>
      <li><strong>Fotógrafos:</strong> Crea versiones web ligeras de fotos en alta resolución</li>
      <li><strong>Social media managers:</strong> Optimiza contenido para compartir sin demoras de carga</li>
      <li><strong>Email marketers:</strong> Reduce tamaño de newsletters para mejor deliverability</li>
      <li><strong>Agencias digitales:</strong> Entrega proyectos optimizados que cumplen estándares de rendimiento</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Impacto en SEO y rendimiento web:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>PageSpeed Score:</strong> Google PageSpeed Insights penaliza imágenes pesadas, la compresión mejora tu puntuación significativamente</li>
      <li><strong>Core Web Vitals:</strong> LCP (Largest Contentful Paint) mejora dramáticamente con imágenes optimizadas</li>
      <li><strong>Ranking de búsqueda:</strong> La velocidad del sitio es factor de ranking, imágenes ligeras te ayudan a posicionar mejor</li>
      <li><strong>Tasa de rebote:</strong> Sitios lentos tienen mayor bounce rate, la compresión retiene visitantes</li>
      <li><strong>Conversiones:</strong> Cada segundo de carga perdido reduce conversiones, optimiza para vender más</li>
      <li><strong>Mobile-first indexing:</strong> Google prioriza versión móvil, donde el peso de imágenes es aún más crítico</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Compresión vs Redimensionamiento:
    </h3>
    <p className="text-gray-600 mb-4">
      Ambas técnicas reducen el tamaño del archivo, pero funcionan diferente:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Compresión:</strong> Reduce el peso del archivo manteniendo las dimensiones en píxeles. Elimina datos redundantes y aplica algoritmos de optimización.</li>
      <li><strong>Redimensionamiento:</strong> Reduce las dimensiones físicas (ancho × alto). Elimina píxeles pero mantiene calidad relativa.</li>
      <li><strong>Mejor práctica:</strong> Combina ambas técnicas - primero redimensiona a las dimensiones necesarias, luego comprime para optimizar peso</li>
      <li><strong>Nuestra herramienta:</strong> Permite activar Limitar dimensiones para aplicar ambas optimizaciones simultáneamente</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formatos de imagen y compresión:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>JPG/JPEG:</strong> Mejor para fotografías. Compresión con pérdida pero excelentes resultados visuales. Ideal para contenido fotográfico.</li>
      <li><strong>PNG:</strong> Mejor para gráficos, logos, capturas de pantalla. Soporta transparencia. Compresión sin pérdida pero archivos más grandes.</li>
      <li><strong>WebP:</strong> Formato moderno con mejor compresión que JPG y PNG. Soportado por navegadores modernos. Hasta 30% más pequeño manteniendo calidad.</li>
      <li><strong>Recomendación:</strong> Usa WebP cuando sea posible, JPG para fotos, PNG solo cuando necesites transparencia</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Compresión inteligente:</strong> Algoritmos optimizados que mantienen calidad visual mientras reducen peso</li>
      <li><strong>Control granular:</strong> Ajusta calidad con precisión del 5% para lograr el balance perfecto</li>
      <li><strong>Objetivo de tamaño:</strong> Define el peso máximo deseado y la herramienta ajusta automáticamente</li>
      <li><strong>Doble optimización:</strong> Comprime y redimensiona simultáneamente si es necesario</li>
      <li><strong>Estadísticas claras:</strong> Porcentaje de reducción y comparación antes/después</li>
      <li><strong>Vista previa:</strong> Compara visualmente la imagen comprimida con la original</li>
      <li><strong>Procesamiento rápido:</strong> Compresión en segundos sin importar el tamaño original</li>
      <li><strong>100% privado:</strong> Todo se procesa en tu navegador, imágenes nunca se suben a servidores</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consejos para máxima optimización:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Calidad óptima web:</strong> 75-80% ofrece el mejor balance para la mayoría de sitios</li>
      <li><strong>Redimensiona primero:</strong> Si la imagen es más grande de lo necesario, activa Limitar dimensiones</li>
      <li><strong>Prueba visual:</strong> Descarga y visualiza en el contexto real antes de publicar</li>
      <li><strong>Diferentes calidades:</strong> Usa mayor calidad (85-90%) para hero images, menor (70-75%) para thumbnails</li>
      <li><strong>Formato correcto:</strong> JPG para fotos, PNG para gráficos con transparencia, WebP para ambos si es compatible</li>
      <li><strong>Batch processing:</strong> Para múltiples imágenes, encuentra la calidad óptima con una de prueba</li>
      <li><strong>Responsive images:</strong> Crea múltiples versiones comprimidas para diferentes tamaños de pantalla</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Mitos sobre compresión de imágenes:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Mito:</strong> La compresión siempre arruina la calidad - Falso. Con ajustes correctos, la diferencia es imperceptible al ojo humano.</li>
      <li><strong>Mito:</strong> 100% de calidad es siempre mejor - Falso. A menudo 85% vs 100% es visualmente idéntico pero 50% más ligero.</li>
      <li><strong>Mito:</strong> PNG es siempre mejor que JPG - Falso. Para fotos, JPG comprimido es mucho más eficiente.</li>
      <li><strong>Mito:</strong> Solo necesito comprimir una vez - Falso. Re-comprimir imágenes ya comprimidas puede degradar calidad significativamente.</li>
      <li><strong>Verdad:</strong> La compresión inteligente puede reducir 70-90% del tamaño sin pérdida visible de calidad.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Impacto de imágenes pesadas en tu sitio:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Velocidad de carga:</strong> Imágenes sin optimizar pueden hacer que tu sitio cargue 5-10 segundos más lento</li>
      <li><strong>Abandono de usuarios:</strong> 53% de usuarios móviles abandonan sitios que tardan más de 3 segundos</li>
      <li><strong>Costos de hosting:</strong> Mayor transferencia de datos = mayores costos mensuales de servidor</li>
      <li><strong>Experiencia de usuario:</strong> Páginas que se saltan mientras cargan imágenes crean frustración</li>
      <li><strong>Ranking Google:</strong> Sitios lentos pierden posiciones en resultados de búsqueda</li>
      <li><strong>Accesibilidad:</strong> Usuarios con conexiones lentas o datos limitados sufren más</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Compresión para diferentes dispositivos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Desktop (1920px+):</strong> Calidad 80-85%, dimensiones hasta 2000px de ancho</li>
      <li><strong>Tablet (768-1024px):</strong> Calidad 75-80%, dimensiones hasta 1200px</li>
      <li><strong>Móvil (320-768px):</strong> Calidad 70-75%, dimensiones hasta 800px</li>
      <li><strong>Retina/HiDPI:</strong> Considera crear versiones 2x con mayor compresión (65-70%)</li>
      <li><strong>Estrategia responsive:</strong> Sirve la imagen apropiada según el dispositivo del usuario</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Herramientas complementarias:
    </h3>
    <p className="text-gray-600 mb-4">
      Combina la compresión con otras optimizaciones para mejores resultados:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Lazy loading:</strong> Carga imágenes solo cuando son visibles en viewport</li>
      <li><strong>CDN:</strong> Distribuye imágenes desde servidores cercanos al usuario</li>
      <li><strong>Cache del navegador:</strong> Evita descargar la misma imagen múltiples veces</li>
      <li><strong>Sprites CSS:</strong> Combina múltiples imágenes pequeñas en un solo archivo</li>
      <li><strong>Picture element:</strong> Sirve diferentes formatos según soporte del navegador</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Benchmarks de referencia:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Imagen hero/destacada:</strong> Objetivo menor a 200KB, máximo aceptable 500KB</li>
      <li><strong>Imagen de contenido:</strong> Objetivo menor a 100KB, máximo aceptable 300KB</li>
      <li><strong>Thumbnail/miniatura:</strong> Objetivo menor a 30KB, máximo aceptable 100KB</li>
      <li><strong>Background/textura:</strong> Objetivo menor a 150KB, usa patrones repetibles cuando sea posible</li>
      <li><strong>Logo/iconos:</strong> Prefiere SVG, si es raster objetivo menor a 20KB</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otras herramientas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin instalación:</strong> No necesitas Photoshop, TinyPNG ni software especializado</li>
      <li><strong>Control total:</strong> Ajusta cada parámetro a diferencia de compresores automáticos</li>
      <li><strong>Privacidad absoluta:</strong> Tus imágenes nunca salen de tu dispositivo, crítico para contenido confidencial</li>
      <li><strong>Sin límites:</strong> Comprime todas las imágenes que necesites sin restricciones diarias</li>
      <li><strong>Completamente gratis:</strong> Sin planes premium, sin marcas de agua, sin costos ocultos</li>
      <li><strong>Estadísticas claras:</strong> Ve exactamente cuánto redujiste a diferencia de cajas negras</li>
      <li><strong>Interfaz simple:</strong> Más fácil que herramientas profesionales, más potente que apps básicas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Compatibilidad y soporte:
    </h3>
    <p className="text-gray-600 mb-4">
      Trabaja con los formatos más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Procesa imágenes de hasta 50MB, suficiente para:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Fotos de cámaras DSLR:</strong> Archivos RAW convertidos a JPG de 10-30MB</li>
      <li><strong>Scans de alta resolución:</strong> Documentos escaneados a 300+ DPI</li>
      <li><strong>Exports de diseño:</strong> Archivos de Photoshop, Illustrator o Figma</li>
      <li><strong>Screenshots 4K:</strong> Capturas de pantalla de monitores de alta resolución</li>
    </ul>

    <p className="text-gray-600">
      Ya sea que necesites acelerar tu sitio web, cumplir con límites de tamaño de archivos, ahorrar espacio de almacenamiento o mejorar tu SEO, nuestra herramienta de compresión te permite lograr reducciones de hasta 90% manteniendo calidad visual excelente. Optimiza profesionalmente con control total, estadísticas claras y privacidad garantizada, todo completamente gratis.
    </p>
  </div>
</article>
    </div>
  );
}