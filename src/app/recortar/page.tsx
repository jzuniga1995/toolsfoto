'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import { 
  cropImage, 
  CROP_ASPECT_RATIOS,
  createCenteredCropArea,
  adjustCropToAspectRatio
} from '@/lib/tools/crop';
import type { ProcessedImage, PixelCrop, ImageFormat } from '@/types';

type AspectRatioKey = keyof typeof CROP_ASPECT_RATIOS;

export default function RecortarPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isCropping, setIsCropping] = useState(false);
  const [croppedImage, setCroppedImage] = useState<ProcessedImage | null>(null);
  const [cropError, setCropError] = useState<string | null>(null);

  // Opciones de recorte
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatioKey>('Libre');
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(95);

  // Control del área de recorte
  const [cropArea, setCropArea] = useState<PixelCrop>({ x: 0, y: 0, width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inicializar área de recorte cuando se carga la imagen
  useEffect(() => {
    if (uploadedImage && uploadedImage.width && uploadedImage.height) {
      const aspectRatio = CROP_ASPECT_RATIOS[selectedAspectRatio];
      
      if (aspectRatio) {
        const centeredCrop = createCenteredCropArea(
          { width: uploadedImage.width, height: uploadedImage.height },
          aspectRatio
        );
        setCropArea(centeredCrop);
      } else {
        // Libre - usar toda la imagen
        setCropArea({
          x: 0,
          y: 0,
          width: uploadedImage.width,
          height: uploadedImage.height,
        });
      }
    }
  }, [uploadedImage, selectedAspectRatio]);

  // Dibujar imagen con overlay de recorte
  useEffect(() => {
    if (!uploadedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.src = uploadedImage.preview;

    img.onload = () => {
      // Ajustar canvas al tamaño del contenedor
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.clientWidth;
      const scale = containerWidth / img.width;
      
      canvas.width = containerWidth;
      canvas.height = img.height * scale;

      // Dibujar imagen
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Dibujar overlay oscuro
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Limpiar área de recorte
      const scaledCrop = {
        x: cropArea.x * scale,
        y: cropArea.y * scale,
        width: cropArea.width * scale,
        height: cropArea.height * scale,
      };

      ctx.clearRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height);
      ctx.drawImage(
        img,
        cropArea.x,
        cropArea.y,
        cropArea.width,
        cropArea.height,
        scaledCrop.x,
        scaledCrop.y,
        scaledCrop.width,
        scaledCrop.height
      );

      // Dibujar borde del área de recorte
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.strokeRect(scaledCrop.x, scaledCrop.y, scaledCrop.width, scaledCrop.height);
    };
  }, [uploadedImage, cropArea]);

  const handleCrop = async () => {
    if (!uploadedImage) return;

    setIsCropping(true);
    setCropError(null);
    setCroppedImage(null);

    try {
      const result = await cropImage(
        uploadedImage.preview,
        cropArea,
        outputFormat,
        quality / 100
      );
      setCroppedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al recortar la imagen';
      setCropError(errorMessage);
    } finally {
      setIsCropping(false);
    }
  };

  const handleDownload = async () => {
    if (croppedImage) {
      await downloadProcessedImage(croppedImage);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !uploadedImage || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / (uploadedImage.width || 1);

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;

    const width = Math.abs(currentX - dragStart.x);
    const height = Math.abs(currentY - dragStart.y);

    let newCropArea: PixelCrop = {
      x: Math.min(dragStart.x, currentX) / scale,
      y: Math.min(dragStart.y, currentY) / scale,
      width: width / scale,
      height: height / scale,
    };

    // Aplicar aspect ratio si está seleccionado
    const aspectRatio = CROP_ASPECT_RATIOS[selectedAspectRatio];
    if (aspectRatio && uploadedImage.width && uploadedImage.height) {
      newCropArea = adjustCropToAspectRatio(
        newCropArea,
        aspectRatio,
        { width: uploadedImage.width, height: uploadedImage.height }
      );
    }

    setCropArea(newCropArea);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
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
              <h1 className="text-2xl font-bold text-gray-900">Recortar Imagen</h1>
              <p className="text-sm text-gray-600">
                Recorta tus imágenes con diferentes proporciones
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda - Upload y Canvas */}
          <div className="space-y-6">
            {!uploadedImage ? (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  1. Sube tu imagen
                </h2>
                <ImageUploader
                  onImageSelect={(file, url) => {
                    handleImageUpload(file);
                    setCroppedImage(null);
                    setCropError(null);
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
                {/* Canvas de recorte */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Imagen Original
                    </h2>
                    <button
                      onClick={() => {
                        resetUpload();
                        setCroppedImage(null);
                        setCropError(null);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      aria-label="Cambiar imagen"
                    >
                      Cambiar imagen
                    </button>
                  </div>
                  <div ref={containerRef} className="bg-white rounded-xl border border-gray-200 p-4">
                    <canvas
                      ref={canvasRef}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      className="w-full cursor-crosshair rounded-lg"
                      aria-label="Canvas interactivo para seleccionar área de recorte. Arrastra el ratón para definir el área."
                      role="img"
                    />
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      Arrastra para seleccionar el área de recorte
                    </p>
                  </div>
                </div>

                {/* Opciones de recorte */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Opciones de recorte
                  </h2>

                  <div className="space-y-6">
                    {/* Aspect Ratio */}
                    <div>
                      <label htmlFor="aspect-ratio" className="text-sm font-medium text-gray-700 mb-2 block">
                        Proporción de aspecto
                      </label>
                      <select
                        id="aspect-ratio"
                        value={selectedAspectRatio}
                        onChange={(e) => setSelectedAspectRatio(e.target.value as AspectRatioKey)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        aria-label="Seleccionar proporción de aspecto"
                      >
                        {Object.keys(CROP_ASPECT_RATIOS).map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Formato de salida */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Formato de salida
                      </label>
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Formato de salida">
                        {(['png', 'jpg', 'webp'] as ImageFormat[]).map((format) => (
                          <button
                            key={format}
                            onClick={() => setOutputFormat(format)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                              outputFormat === format
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                            aria-pressed={outputFormat === format}
                            aria-label={`Formato ${format.toUpperCase()}`}
                          >
                            {format.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Calidad */}
                    {outputFormat !== 'png' && (
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
                          aria-label="Control de calidad de compresión"
                        />
                      </div>
                    )}

                    {/* Dimensiones actuales */}
                    <div className="bg-gray-50 rounded-lg p-4" role="status" aria-live="polite">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">
                        Área seleccionada
                      </h3>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Ancho:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {Math.round(cropArea.width)}px
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Alto:</span>
                          <span className="ml-2 font-semibold text-gray-900">
                            {Math.round(cropArea.height)}px
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Botón recortar */}
                    <button
                      onClick={handleCrop}
                      disabled={isCropping || cropArea.width === 0 || cropArea.height === 0}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      aria-label={isCropping ? 'Recortando imagen' : 'Recortar imagen seleccionada'}
                    >
                      {isCropping ? (
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
                          Recortando...
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
                              d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          Recortar imagen
                        </>
                      )}
                    </button>

                    {cropError && (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-sm text-red-600">{cropError}</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Columna Derecha - Resultado */}
          <div className="space-y-6">
            {croppedImage ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagen Recortada
                  </h2>
                  <ImagePreview
                    imageUrl={croppedImage.url}
                    title="Recortada"
                    dimensions={croppedImage.dimensions}
                    fileSize={croppedImage.size}
                  />
                </div>

                {/* Información */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Información
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Dimensiones</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {croppedImage.dimensions?.width || 0} × {croppedImage.dimensions?.height || 0}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Formato</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {croppedImage.format.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tamaño</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(croppedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </span>
                    </div>
                  </div>
                </div>

                {/* Botón descargar */}
                <DownloadButton
                  imageUrl={croppedImage.url}
                  fileName={`imagen-recortada.${outputFormat}`}
                  format={outputFormat}
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
                      d="M7.5 3.75H6A2.25 2.25 0 003.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0120.25 6v1.5m0 9V18A2.25 2.25 0 0118 20.25h-1.5m-9 0H6A2.25 2.25 0 013.75 18v-1.5M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Selecciona el área y haz click en recortar
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
    Recortar Imágenes Online Gratis - Crop Tool con Proporciones Personalizadas
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Recorta tus imágenes de forma precisa y profesional con nuestra herramienta online gratuita. Selecciona el área exacta que deseas conservar, aplica proporciones de aspecto predefinidas o recorta libremente. Perfecto para ajustar fotos para redes sociales, eliminar elementos no deseados o crear composiciones perfectas.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Cuándo necesitas recortar una imagen?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Redes sociales:</strong> Ajusta fotos a las dimensiones exactas de Instagram, Facebook, Twitter, LinkedIn o TikTok</li>
      <li><strong>Eliminar elementos:</strong> Quita fondos no deseados, personas u objetos de los bordes de tus fotos</li>
      <li><strong>Mejorar composición:</strong> Aplica la regla de los tercios y mejora el encuadre de tus fotografías</li>
      <li><strong>Fotos de perfil:</strong> Crea avatares cuadrados perfectos para perfiles y cuentas</li>
      <li><strong>Banners y portadas:</strong> Recorta imágenes con proporciones específicas para headers de sitios web</li>
      <li><strong>Impresión:</strong> Ajusta fotos a tamaños estándar de impresión (4×6, 5×7, 8×10 pulgadas)</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo recortar una imagen?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
      <li>Selecciona una proporción de aspecto predefinida o elige Libre para recorte personalizado</li>
      <li>Arrastra el cursor sobre la imagen para definir el área de recorte deseada</li>
      <li>Ajusta el área seleccionada hasta lograr el encuadre perfecto</li>
      <li>Elige el formato de salida (PNG, JPG o WebP) y la calidad de compresión</li>
      <li>Haz clic en Recortar imagen y descarga tu resultado instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Proporciones de aspecto disponibles:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Libre:</strong> Recorta en cualquier tamaño y proporción sin restricciones</li>
      <li><strong>Cuadrado 1:1:</strong> Perfecto para fotos de perfil, Instagram posts y avatares</li>
      <li><strong>Retrato 4:5:</strong> Ideal para Instagram posts verticales y feeds</li>
      <li><strong>Paisaje 16:9:</strong> Estándar para videos, miniaturas de YouTube y presentaciones</li>
      <li><strong>Clásico 4:3:</strong> Proporción tradicional de fotografía y pantallas</li>
      <li><strong>Widescreen 21:9:</strong> Para banners ultra anchos y diseños cinematográficos</li>
      <li><strong>Vertical 9:16:</strong> Formato de stories de Instagram, TikTok y Reels</li>
      <li><strong>Impresión 5:7:</strong> Tamaño estándar para fotos impresas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Dimensiones específicas para redes sociales:
    </h3>
    <p className="text-gray-600 mb-4">
      Usa nuestro recortador con las proporciones correctas para cada plataforma:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Instagram:</strong> Cuadrado 1:1 (1080×1080px) para posts, Vertical 9:16 (1080×1920px) para stories</li>
      <li><strong>Facebook:</strong> Paisaje 16:9 (1200×675px) para posts, Cuadrado 1:1 (1200×1200px) para perfil</li>
      <li><strong>Twitter/X:</strong> Paisaje 16:9 (1200×675px) para tweets con imagen</li>
      <li><strong>LinkedIn:</strong> Paisaje 16:9 (1200×627px) para posts, Cuadrado 1:1 (400×400px) para perfil</li>
      <li><strong>YouTube:</strong> Paisaje 16:9 (1280×720px o 1920×1080px) para miniaturas</li>
      <li><strong>TikTok:</strong> Vertical 9:16 (1080×1920px) para videos</li>
      <li><strong>Pinterest:</strong> Vertical 2:3 (1000×1500px) para pins</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso profesionales:
    </h3>
    <p className="text-gray-600 mb-4">
      Esta herramienta es esencial para múltiples profesionales y situaciones:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Fotógrafos:</strong> Ajusta composiciones, elimina distracciones y prepara imágenes para clientes</li>
      <li><strong>Diseñadores gráficos:</strong> Recorta elementos para collages, montajes y composiciones</li>
      <li><strong>Community managers:</strong> Adapta contenido visual a diferentes formatos de redes sociales</li>
      <li><strong>Bloggers y escritores:</strong> Crea imágenes destacadas con las dimensiones perfectas para artículos</li>
      <li><strong>E-commerce:</strong> Recorta fotos de productos para catálogos y tiendas online</li>
      <li><strong>Agencias inmobiliarias:</strong> Ajusta fotos de propiedades para listados y marketing</li>
      <li><strong>Marketing digital:</strong> Prepara banners, anuncios y material promocional</li>
      <li><strong>Creadores de contenido:</strong> Optimiza imágenes para miniaturas de videos y thumbnails</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Canvas interactivo:</strong> Arrastra y selecciona el área de recorte visualmente de forma intuitiva</li>
      <li><strong>Vista previa en tiempo real:</strong> Ve exactamente qué área quedará en la imagen final</li>
      <li><strong>Overlay visual:</strong> Fondo oscurecido que resalta el área seleccionada para mayor precisión</li>
      <li><strong>Múltiples proporciones:</strong> Más de 8 ratios predefinidos más opción libre</li>
      <li><strong>Dimensiones en vivo:</strong> Visualiza el ancho y alto del área seleccionada en píxeles</li>
      <li><strong>Control de formato:</strong> Exporta en PNG, JPG o WebP según tus necesidades</li>
      <li><strong>Ajuste de calidad:</strong> Control fino de compresión para JPG y WebP (60-100%)</li>
      <li><strong>Procesamiento instantáneo:</strong> Recorta y descarga en segundos sin esperas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Técnicas de composición fotográfica:
    </h3>
    <p className="text-gray-600 mb-4">
      Mejora tus imágenes aplicando principios de composición al recortar:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Regla de los tercios:</strong> Coloca elementos importantes en las intersecciones de una cuadrícula 3×3</li>
      <li><strong>Espacio negativo:</strong> Deja espacio alrededor del sujeto para dar respiro visual</li>
      <li><strong>Líneas guía:</strong> Usa líneas naturales de la imagen para dirigir la mirada del espectador</li>
      <li><strong>Centrado estratégico:</strong> Para retratos y fotos de productos, el centrado puede ser efectivo</li>
      <li><strong>Eliminar distracciones:</strong> Recorta elementos de los bordes que desvían la atención</li>
      <li><strong>Proporción áurea:</strong> Aproxima el ratio 1.618:1 para composiciones armoniosas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consejos para recortes profesionales:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Mantén la resolución:</strong> Evita recortar demasiado para no perder calidad de imagen</li>
      <li><strong>Respeta el espacio de cabeza:</strong> En retratos, deja espacio arriba de la cabeza sin exagerar</li>
      <li><strong>No cortes articulaciones:</strong> Evita recortar en codos, rodillas o muñecas en fotos de personas</li>
      <li><strong>Considera el contexto:</strong> Mantén elementos que dan contexto a la historia de la imagen</li>
      <li><strong>Prueba múltiples opciones:</strong> Recorta de diferentes formas para encontrar la mejor composición</li>
      <li><strong>Piensa en el uso final:</strong> Recorta según dónde se publicará la imagen</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Opciones de formato de exportación:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>PNG:</strong> Calidad sin pérdida, ideal para imágenes con texto, logos o transparencias. Archivos más grandes pero máxima calidad.</li>
      <li><strong>JPG:</strong> Formato comprimido perfecto para fotografías y web. Archivos más pequeños con calidad ajustable (recomendado 85-95%).</li>
      <li><strong>WebP:</strong> Formato moderno con excelente compresión y calidad. Ideal para uso web, reduce tiempos de carga significativamente.</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Recortar vs Redimensionar: ¿Cuál necesitas?
    </h3>
    <p className="text-gray-600 mb-4">
      Aunque relacionadas, son operaciones diferentes:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Recortar:</strong> Elimina partes de la imagen, cambia la composición pero mantiene la resolución del área seleccionada</li>
      <li><strong>Redimensionar:</strong> Cambia el tamaño total de la imagen manteniendo toda la composición, pero puede perder resolución</li>
      <li><strong>Cuándo recortar:</strong> Para mejorar composición, eliminar elementos o cambiar proporción</li>
      <li><strong>Cuándo redimensionar:</strong> Para reducir peso del archivo o adaptar a tamaño específico sin cambiar composición</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Errores comunes al recortar y cómo evitarlos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Recortar demasiado apretado:</strong> Deja margen alrededor del sujeto principal para dar respiro</li>
      <li><strong>Cortar en puntos críticos:</strong> Evita cortar exactamente en articulaciones de personas</li>
      <li><strong>Ignorar el horizonte:</strong> Asegúrate de que líneas horizontales queden rectas</li>
      <li><strong>Perder contexto importante:</strong> No elimines elementos que dan sentido a la imagen</li>
      <li><strong>No considerar el destino:</strong> Recorta pensando en dónde se verá finalmente la imagen</li>
      <li><strong>Forzar proporciones incorrectas:</strong> Si la imagen no funciona en cierta proporción, busca una alternativa</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otras herramientas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin instalación:</strong> No necesitas Photoshop, GIMP u otro software pesado</li>
      <li><strong>Interfaz intuitiva:</strong> Canvas interactivo más fácil de usar que herramientas complejas</li>
      <li><strong>Proporciones predefinidas:</strong> No necesitas calcular ratios manualmente</li>
      <li><strong>Privacidad total:</strong> Todo el procesamiento en tu navegador, imágenes nunca se suben</li>
      <li><strong>Completamente gratis:</strong> Sin límites de uso, sin marcas de agua, sin suscripciones</li>
      <li><strong>Vista previa clara:</strong> Overlay visual que muestra exactamente qué quedará</li>
      <li><strong>Múltiples formatos:</strong> Exporta en el formato óptimo para tu caso de uso</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Optimización para diferentes usos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Para web:</strong> Usa WebP con calidad 85-90% para mejor rendimiento</li>
      <li><strong>Para impresión:</strong> PNG con alta resolución (300 DPI mínimo en el área recortada)</li>
      <li><strong>Para redes sociales:</strong> JPG calidad 90-95%, dimensiones exactas de la plataforma</li>
      <li><strong>Para email:</strong> JPG calidad 80-85% para reducir peso del mensaje</li>
      <li><strong>Para archivo:</strong> PNG sin compresión para preservar máxima calidad</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Compatibilidad y formatos:
    </h3>
    <p className="text-gray-600 mb-4">
      Trabaja con los formatos de imagen más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Puedes procesar imágenes de hasta 50MB, ideal para fotos de alta resolución de cámaras DSLR y smartphones modernos. El área recortada mantiene la resolución original de píxeles de esa región, garantizando máxima calidad sin interpolación.
    </p>

    <p className="text-gray-600">
      Ya sea que necesites ajustar fotos para redes sociales, mejorar la composición de tus fotografías, preparar imágenes para impresión o crear material visual para tu negocio, esta herramienta te proporciona el control preciso que necesitas de forma gratuita, rápida y sin complicaciones. Recorta como un profesional con nuestra interfaz visual intuitiva.
    </p>
  </div>
</article>
    </div>
  );
}