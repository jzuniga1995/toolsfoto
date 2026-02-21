'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import { addWatermark } from '@/lib/tools/watermark';
import type { ProcessedImage, WatermarkOptions } from '@/types';

export default function MarcaAguaPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Tipo de marca de agua
  const [watermarkType, setWatermarkType] = useState<'text' | 'image'>('text');

  // Opciones de marca de agua de texto
  const [text, setText] = useState('© 2026 Mi Marca');
  const [fontSize, setFontSize] = useState(24);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [opacity, setOpacity] = useState(0.7);
  const [position, setPosition] = useState<WatermarkOptions['position']>('bottom-right');

  // Opciones de marca de agua de imagen
  const [watermarkImageUrl, setWatermarkImageUrl] = useState('');
  const [watermarkImageFile, setWatermarkImageFile] = useState<File | null>(null);

  const handleWatermarkImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setWatermarkImageFile(file);
      const url = URL.createObjectURL(file);
      setWatermarkImageUrl(url);
    }
  };

  const handleApplyWatermark = async () => {
    if (!uploadedImage) return;

    if (watermarkType === 'text' && !text.trim()) {
      setProcessingError('Por favor ingresa un texto para la marca de agua');
      return;
    }

    if (watermarkType === 'image' && !watermarkImageUrl) {
      setProcessingError('Por favor sube una imagen para la marca de agua');
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);
    setProcessedImage(null);

    try {
      const options: WatermarkOptions = {
        position,
        opacity,
        ...(watermarkType === 'text' 
          ? { text, fontSize, fontColor, fontFamily }
          : { imageUrl: watermarkImageUrl }
        ),
      };

      const result = await addWatermark(uploadedImage, options);
      setProcessedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al aplicar marca de agua';
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

  const fonts = [
    'Arial',
    'Helvetica',
    'Times New Roman',
    'Georgia',
    'Courier New',
    'Verdana',
    'Impact',
    'Comic Sans MS',
    'Trebuchet MS',
    'Arial Black',
  ];

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
              <h1 className="text-2xl font-bold text-gray-900">Agregar Marca de Agua</h1>
              <p className="text-sm text-gray-600">
                Protege tus imágenes con texto o logo personalizado
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

                {/* Opciones de marca de agua */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Configura la marca de agua
                  </h2>

                  <div className="space-y-6">
                    {/* Tipo de marca de agua */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Tipo de marca de agua
                      </label>
                      <div className="grid grid-cols-2 gap-3" role="group" aria-label="Tipo de marca de agua">
                        <button
                          onClick={() => setWatermarkType('text')}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            watermarkType === 'text'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={watermarkType === 'text'}
                          aria-label="Marca de agua de texto"
                        >
                          <div className="flex flex-col items-center gap-2">
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
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"
                              />
                            </svg>
                            <span className="text-sm font-medium">Texto</span>
                          </div>
                        </button>

                        <button
                          onClick={() => setWatermarkType('image')}
                          className={`p-4 border-2 rounded-xl transition-all ${
                            watermarkType === 'image'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={watermarkType === 'image'}
                          aria-label="Marca de agua de imagen o logo"
                        >
                          <div className="flex flex-col items-center gap-2">
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
                                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                              />
                            </svg>
                            <span className="text-sm font-medium">Imagen/Logo</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Opciones de texto */}
                    {watermarkType === 'text' && (
                      <>
                        <div>
                          <label htmlFor="watermark-text" className="text-sm font-medium text-gray-700 mb-2 block">
                            Texto
                          </label>
                          <input
                            id="watermark-text"
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="© 2026 Mi Marca"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Texto de la marca de agua"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="font-size" className="text-sm font-medium text-gray-700 mb-2 block">
                              Tamaño
                            </label>
                            <input
                              id="font-size"
                              type="number"
                              min="12"
                              max="100"
                              value={fontSize}
                              onChange={(e) => setFontSize(Number(e.target.value))}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              aria-label="Tamaño de fuente"
                            />
                          </div>

                          <div>
                            <label htmlFor="font-color-text" className="text-sm font-medium text-gray-700 mb-2 block">
                              Color
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                aria-label="Selector de color de fuente"
                              />
                              <input
                                id="font-color-text"
                                type="text"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Código hexadecimal del color de fuente"
                              />
                            </div>
                          </div>
                        </div>

                        <div>
                          <label htmlFor="font-family" className="text-sm font-medium text-gray-700 mb-2 block">
                            Fuente
                          </label>
                          <select
                            id="font-family"
                            value={fontFamily}
                            onChange={(e) => setFontFamily(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            aria-label="Familia de fuente"
                          >
                            {fonts.map((font) => (
                              <option key={font} value={font} style={{ fontFamily: font }}>
                                {font}
                              </option>
                            ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* Opciones de imagen */}
                    {watermarkType === 'image' && (
                      <div>
                        <label htmlFor="watermark-image-upload" className="text-sm font-medium text-gray-700 mb-2 block">
                          Imagen de marca de agua
                        </label>
                        <div className="space-y-3">
                          <input
                            id="watermark-image-upload"
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={handleWatermarkImageUpload}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            aria-label="Subir imagen de marca de agua"
                          />
                          {watermarkImageUrl && (
                            <div className="relative w-32 h-32 border-2 border-gray-300 rounded-lg overflow-hidden">
                              <img
                                src={watermarkImageUrl}
                                alt="Vista previa de marca de agua"
                                className="w-full h-full object-contain"
                              />
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            Recomendado: PNG con fondo transparente
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Posición */}
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-3 block">
                        Posición
                      </label>
                      <div className="grid grid-cols-3 gap-2" role="group" aria-label="Posición de la marca de agua">
                        <button
                          onClick={() => setPosition('top-left')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            position === 'top-left'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={position === 'top-left'}
                          aria-label="Posición superior izquierda"
                        >
                          <div className="w-full h-12 border border-gray-300 rounded relative">
                            <div className="absolute top-1 left-1 w-3 h-3 bg-blue-600 rounded" aria-hidden="true"></div>
                          </div>
                          <p className="text-xs mt-2 text-center">Superior Izq.</p>
                        </button>

                        <button
                          onClick={() => setPosition('top-right')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            position === 'top-right'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={position === 'top-right'}
                          aria-label="Posición superior derecha"
                        >
                          <div className="w-full h-12 border border-gray-300 rounded relative">
                            <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded" aria-hidden="true"></div>
                          </div>
                          <p className="text-xs mt-2 text-center">Superior Der.</p>
                        </button>

                        <button
                          onClick={() => setPosition('center')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            position === 'center'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={position === 'center'}
                          aria-label="Posición centrada"
                        >
                          <div className="w-full h-12 border border-gray-300 rounded relative">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-blue-600 rounded" aria-hidden="true"></div>
                          </div>
                          <p className="text-xs mt-2 text-center">Centro</p>
                        </button>

                        <button
                          onClick={() => setPosition('bottom-left')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            position === 'bottom-left'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={position === 'bottom-left'}
                          aria-label="Posición inferior izquierda"
                        >
                          <div className="w-full h-12 border border-gray-300 rounded relative">
                            <div className="absolute bottom-1 left-1 w-3 h-3 bg-blue-600 rounded" aria-hidden="true"></div>
                          </div>
                          <p className="text-xs mt-2 text-center">Inferior Izq.</p>
                        </button>

                        <button
                          onClick={() => setPosition('bottom-right')}
                          className={`p-3 border-2 rounded-lg transition-all ${
                            position === 'bottom-right'
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                          aria-pressed={position === 'bottom-right'}
                          aria-label="Posición inferior derecha"
                        >
                          <div className="w-full h-12 border border-gray-300 rounded relative">
                            <div className="absolute bottom-1 right-1 w-3 h-3 bg-blue-600 rounded" aria-hidden="true"></div>
                          </div>
                          <p className="text-xs mt-2 text-center">Inferior Der.</p>
                        </button>
                      </div>
                    </div>

                    {/* Opacidad */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label htmlFor="opacity-slider" className="text-sm font-medium text-gray-700">
                          Opacidad
                        </label>
                        <span className="text-sm font-semibold text-blue-600" aria-live="polite">
                          {Math.round(opacity * 100)}%
                        </span>
                      </div>
                      <input
                        id="opacity-slider"
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={opacity}
                        onChange={(e) => setOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        aria-label="Control de opacidad de la marca de agua"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Transparente</span>
                        <span>Opaco</span>
                      </div>
                    </div>

                    {/* Botón aplicar */}
                    <button
                      onClick={handleApplyWatermark}
                      disabled={isProcessing}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      aria-label={isProcessing ? 'Aplicando marca de agua' : 'Aplicar marca de agua a la imagen'}
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
                              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Aplicar marca de agua
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
                    Imagen con Marca de Agua
                  </h2>
                  <ImagePreview
                    imageUrl={processedImage.url}
                    title="Con marca de agua"
                    dimensions={processedImage.dimensions}
                    fileSize={processedImage.size}
                  />
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
                      d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 6h.008v.008H6V6z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Configura tu marca de agua y haz click en aplicar
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
    Agregar Marca de Agua a Imágenes Online Gratis
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Protege tus imágenes y fotografías añadiendo marcas de agua personalizadas de forma gratuita. Nuestra herramienta online te permite agregar texto o logo a tus imágenes para proteger tu propiedad intelectual, identificar tu autoría y evitar el uso no autorizado de tu contenido visual.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Por qué agregar marca de agua a tus imágenes?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Protección de copyright:</strong> Indica claramente la autoría de tus fotografías y diseños</li>
      <li><strong>Prevención de robo:</strong> Disuade el uso no autorizado de tus imágenes en otros sitios</li>
      <li><strong>Branding profesional:</strong> Agrega tu logo o nombre de marca para mayor reconocimiento</li>
      <li><strong>Trazabilidad:</strong> Identifica fácilmente el origen de tus imágenes cuando se comparten</li>
      <li><strong>Marketing visual:</strong> Promociona tu marca cada vez que alguien comparte tus imágenes</li>
      <li><strong>Profesionalismo:</strong> Da una apariencia más seria y profesional a tu trabajo</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo agregar marca de agua a una imagen?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
      <li>Elige el tipo de marca de agua: texto personalizado o tu logo/imagen</li>
      <li>Si es texto: personaliza el contenido, tamaño, color y fuente</li>
      <li>Si es imagen: sube tu logo (se recomienda PNG con transparencia)</li>
      <li>Selecciona la posición donde quieres colocar la marca de agua</li>
      <li>Ajusta la opacidad para lograr el equilibrio perfecto entre visibilidad y discreción</li>
      <li>Aplica la marca de agua y descarga tu imagen protegida instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Tipos de marca de agua disponibles:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Marca de agua de texto:</strong> Agrega copyright, tu nombre, sitio web o cualquier texto personalizado con control total sobre estilo, tamaño, color y fuente</li>
      <li><strong>Marca de agua de imagen:</strong> Sube tu logo empresarial, firma digital o cualquier imagen PNG con transparencia para una apariencia profesional</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Opciones de personalización:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Posiciones flexibles:</strong> Coloca la marca en superior izquierda/derecha, centro, inferior izquierda/derecha</li>
      <li><strong>10 fuentes disponibles:</strong> Arial, Helvetica, Times New Roman, Georgia, Courier New, Verdana, Impact, Comic Sans MS, Trebuchet MS, Arial Black</li>
      <li><strong>Tamaño ajustable:</strong> Desde 12px hasta 100px para adaptarse a cualquier imagen</li>
      <li><strong>Color personalizado:</strong> Selector de color completo con código hexadecimal para match perfecto con tu marca</li>
      <li><strong>Control de opacidad:</strong> Ajusta la transparencia de 0% a 100% para lograr el efecto deseado</li>
      <li><strong>Logos con transparencia:</strong> Soporte completo para PNG transparente para marcas profesionales</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso profesionales:
    </h3>
    <p className="text-gray-600 mb-4">
      Esta herramienta es esencial para fotógrafos, diseñadores, artistas y creadores de contenido:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Fotografía profesional:</strong> Protege tus fotos de bodas, eventos, retratos y fotografía comercial</li>
      <li><strong>Portfolios en línea:</strong> Muestra tu trabajo mientras proteges tu propiedad intelectual</li>
      <li><strong>Redes sociales:</strong> Comparte contenido en Instagram, Pinterest y Facebook con tu marca visible</li>
      <li><strong>Stock photography:</strong> Agrega marcas de agua a tus imágenes de muestra antes de la venta</li>
      <li><strong>Marketing de contenidos:</strong> Protege infografías, gráficos y material visual de marketing</li>
      <li><strong>Diseño gráfico:</strong> Marca tus diseños antes de presentar propuestas a clientes</li>
      <li><strong>Arte digital:</strong> Protege ilustraciones, pinturas digitales y obras de arte</li>
      <li><strong>Blogs y sitios web:</strong> Agrega marca de agua a imágenes destacadas y contenido visual</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Mejores prácticas para marcas de agua efectivas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Opacidad balanceada:</strong> Entre 50-80% para que sea visible pero no intrusiva</li>
      <li><strong>Posición estratégica:</strong> Esquinas o bordes para no distraer del contenido principal</li>
      <li><strong>Tamaño proporcional:</strong> No muy grande para no arruinar la composición, ni muy pequeña para que sea fácil de eliminar</li>
      <li><strong>Contraste adecuado:</strong> Elige colores que contrasten con el fondo de la imagen</li>
      <li><strong>Consistencia de marca:</strong> Usa siempre el mismo estilo de marca de agua en todas tus imágenes</li>
      <li><strong>Legibilidad:</strong> Asegúrate de que el texto sea fácil de leer sin comprometer la estética</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Procesamiento instantáneo:</strong> Aplica marcas de agua en segundos sin esperas</li>
      <li><strong>Sin pérdida de calidad:</strong> Mantiene la resolución y calidad original de tus imágenes</li>
      <li><strong>Vista previa en tiempo real:</strong> Ve cómo quedará tu imagen antes de descargar</li>
      <li><strong>100% privado y seguro:</strong> Todo el procesamiento se realiza en tu navegador, tus imágenes no se suben a ningún servidor</li>
      <li><strong>Sin límites de uso:</strong> Agrega marcas de agua a todas las imágenes que necesites</li>
      <li><strong>Sin marcas de agua adicionales:</strong> Tu imagen final solo tendrá TU marca de agua</li>
      <li><strong>Completamente gratis:</strong> Sin costos ocultos, sin suscripciones, sin registro requerido</li>
      <li><strong>Compatible con múltiples formatos:</strong> JPG, PNG y WebP hasta 50MB</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Tipos de texto común para marcas de agua:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Copyright:</strong> © 2026 Tu Nombre / Tu Empresa</li>
      <li><strong>URL del sitio web:</strong> www.tusitio.com</li>
      <li><strong>Nombre de usuario:</strong> @tunombreusuario (para redes sociales)</li>
      <li><strong>Marca personal:</strong> Fotografía por [Tu Nombre]</li>
      <li><strong>Información de contacto:</strong> Email o teléfono para consultas</li>
      <li><strong>Advertencia legal:</strong> Propiedad de... o Uso no autorizado prohibido</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otras herramientas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin instalación:</strong> Funciona completamente en tu navegador, no necesitas descargar software</li>
      <li><strong>Privacidad total:</strong> A diferencia de otras herramientas online, tus imágenes nunca salen de tu dispositivo</li>
      <li><strong>Sin registro:</strong> No necesitas crear cuenta ni proporcionar información personal</li>
      <li><strong>Gratis sin limitaciones:</strong> Sin restricciones de cantidad, tamaño o funciones premium</li>
      <li><strong>Interfaz intuitiva:</strong> Diseño simple y fácil de usar incluso para principiantes</li>
      <li><strong>Resultados profesionales:</strong> Calidad comparable a software de pago como Photoshop</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formatos soportados:
    </h3>
    <p className="text-gray-600 mb-4">
      Trabaja con los formatos de imagen más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Puedes procesar imágenes de hasta 50MB manteniendo la calidad original y el formato de salida. Ideal para fotografías de alta resolución, diseños profesionales y contenido web optimizado.
    </p>

    <p className="text-gray-600">
      Ya sea que necesites proteger tus fotografías profesionales, marcar tu trabajo de diseño, o simplemente agregar tu logo a imágenes para redes sociales, esta herramienta te permite hacerlo de forma rápida, profesional y totalmente gratuita. Protege tu trabajo y promociona tu marca en cada imagen que compartes.
    </p>
  </div>
</article>
    </div>
  );
}