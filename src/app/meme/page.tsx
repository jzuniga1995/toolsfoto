'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import MemePreview from '@/components/tools/MemePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import { createMeme, createMemeFromTemplate, memeTemplates } from '@/lib/tools/meme';
import type { ProcessedImage, MemeOptions } from '@/types';

type TemplateKey = keyof typeof memeTemplates;

export default function MemePage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Textos del meme
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');

  // Modo de personalización
  const [useTemplate, setUseTemplate] = useState(true);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateKey>('classic');

  // Opciones personalizadas
  const [fontSize, setFontSize] = useState(48);
  const [fontColor, setFontColor] = useState('#FFFFFF');
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [fontFamily, setFontFamily] = useState('Impact');

  const handleCreateMeme = async () => {
    if (!uploadedImage) return;

    if (!topText.trim() && !bottomText.trim()) {
      setProcessingError('Debes agregar al menos un texto (superior o inferior)');
      return;
    }

    setIsProcessing(true);
    setProcessingError(null);

    try {
      let result: ProcessedImage;

      if (useTemplate) {
        result = await createMemeFromTemplate(
          uploadedImage,
          topText,
          bottomText,
          selectedTemplate
        );
      } else {
        const options: MemeOptions = {
          topText,
          bottomText,
          fontSize,
          fontColor,
          fontFamily,
          strokeColor,
          strokeWidth,
        };
        result = await createMeme(uploadedImage, options);
      }

      setProcessedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el meme';
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
    'Impact',
    'Arial Black',
    'Helvetica',
    'Comic Sans MS',
    'Times New Roman',
    'Courier New',
    'Verdana',
  ];

  const templates = [
    { key: 'classic' as TemplateKey, name: 'Clásico', description: 'Estilo tradicional' },
    { key: 'modern' as TemplateKey, name: 'Moderno', description: 'Arial Black' },
    { key: 'minimal' as TemplateKey, name: 'Minimal', description: 'Limpio y simple' },
    { key: 'bold' as TemplateKey, name: 'Bold', description: 'Texto amarillo' },
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
              <h1 className="text-2xl font-bold text-gray-900">Crear Meme</h1>
              <p className="text-sm text-gray-600">
                Agrega texto arriba y abajo a tus imágenes
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
                {/* Botón cambiar imagen */}
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Imagen Cargada
                  </h2>
                  <button
                    onClick={() => {
                      resetUpload();
                      setProcessedImage(null);
                      setProcessingError(null);
                      setTopText('');
                      setBottomText('');
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                    aria-label="Cambiar imagen"
                  >
                    Cambiar imagen
                  </button>
                </div>

                {/* Opciones del meme */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Agrega el texto
                  </h2>

                  <div className="space-y-6">
                    {/* Texto superior */}
                    <div>
                      <label htmlFor="top-text" className="text-sm font-medium text-gray-700 mb-2 block">
                        Texto superior
                      </label>
                      <input
                        id="top-text"
                        type="text"
                        value={topText}
                        onChange={(e) => setTopText(e.target.value)}
                        placeholder="CUANDO PROGRAMAS"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold uppercase"
                        maxLength={50}
                        aria-label="Texto superior del meme"
                      />
                      <p className="text-xs text-gray-500 mt-1" aria-live="polite">
                        {topText.length}/50 caracteres
                      </p>
                    </div>

                    {/* Texto inferior */}
                    <div>
                      <label htmlFor="bottom-text" className="text-sm font-medium text-gray-700 mb-2 block">
                        Texto inferior
                      </label>
                      <input
                        id="bottom-text"
                        type="text"
                        value={bottomText}
                        onChange={(e) => setBottomText(e.target.value)}
                        placeholder="SIN ERRORES"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg font-bold uppercase"
                        maxLength={50}
                        aria-label="Texto inferior del meme"
                      />
                      <p className="text-xs text-gray-500 mt-1" aria-live="polite">
                        {bottomText.length}/50 caracteres
                      </p>
                    </div>

                    {/* Toggle plantilla vs personalizado */}
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="checkbox"
                          id="useTemplate"
                          checked={useTemplate}
                          onChange={(e) => setUseTemplate(e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor="useTemplate"
                          className="text-sm font-medium text-gray-700"
                        >
                          Usar plantilla de estilo
                        </label>
                      </div>

                      {useTemplate ? (
                        // Plantillas
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-3 block">
                            Selecciona un estilo
                          </label>
                          <div className="grid grid-cols-2 gap-3" role="group" aria-label="Plantillas de estilo de meme">
                            {templates.map((template) => (
                              <button
                                key={template.key}
                                onClick={() => setSelectedTemplate(template.key)}
                                className={`p-4 border-2 rounded-xl transition-all text-left ${
                                  selectedTemplate === template.key
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-300 hover:border-gray-400'
                                }`}
                                aria-pressed={selectedTemplate === template.key}
                                aria-label={`Plantilla ${template.name}: ${template.description}`}
                              >
                                <div className="font-bold text-sm mb-1">
                                  {template.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {template.description}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      ) : (
                        // Personalización
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            {/* Tamaño */}
                            <div>
                              <label htmlFor="font-size" className="text-sm font-medium text-gray-700 mb-2 block">
                                Tamaño
                              </label>
                              <input
                                id="font-size"
                                type="number"
                                min="24"
                                max="100"
                                value={fontSize}
                                onChange={(e) => setFontSize(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Tamaño de fuente"
                              />
                            </div>

                            {/* Grosor borde */}
                            <div>
                              <label htmlFor="stroke-width" className="text-sm font-medium text-gray-700 mb-2 block">
                                Grosor
                              </label>
                              <input
                                id="stroke-width"
                                type="number"
                                min="1"
                                max="10"
                                value={strokeWidth}
                                onChange={(e) => setStrokeWidth(Number(e.target.value))}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Grosor del borde del texto"
                              />
                            </div>
                          </div>

                          {/* Color texto */}
                          <div>
                            <label htmlFor="font-color-text" className="text-sm font-medium text-gray-700 mb-2 block">
                              Color del texto
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                aria-label="Selector de color del texto"
                              />
                              <input
                                id="font-color-text"
                                type="text"
                                value={fontColor}
                                onChange={(e) => setFontColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Código hexadecimal del color del texto"
                              />
                            </div>
                          </div>

                          {/* Color borde */}
                          <div>
                            <label htmlFor="stroke-color-text" className="text-sm font-medium text-gray-700 mb-2 block">
                              Color del borde
                            </label>
                            <div className="flex gap-2">
                              <input
                                type="color"
                                value={strokeColor}
                                onChange={(e) => setStrokeColor(e.target.value)}
                                className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                                aria-label="Selector de color del borde"
                              />
                              <input
                                id="stroke-color-text"
                                type="text"
                                value={strokeColor}
                                onChange={(e) => setStrokeColor(e.target.value)}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                aria-label="Código hexadecimal del color del borde"
                              />
                            </div>
                          </div>

                          {/* Fuente */}
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
                        </div>
                      )}
                    </div>

                    {/* Botón crear */}
                    <button
                      onClick={handleCreateMeme}
                      disabled={isProcessing || (!topText.trim() && !bottomText.trim())}
                      className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
                      aria-label={isProcessing ? 'Creando meme' : 'Crear meme final'}
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
                          Creando meme...
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
                              d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                            />
                          </svg>
                          Crear meme final
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

          {/* Columna Derecha - Preview / Resultado */}
          <div className="space-y-6">
            {uploadedImage && (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {processedImage ? 'Tu Meme Final' : 'Vista Previa en Tiempo Real'}
                  </h2>
                  
                  {processedImage ? (
                    // Meme final procesado
                    <ImagePreview
                      imageUrl={processedImage.url}
                      title="Meme"
                      dimensions={processedImage.dimensions}
                      fileSize={processedImage.size}
                    />
                  ) : (
                    // Preview en tiempo real
                    <MemePreview
                      imageUrl={uploadedImage.preview}
                      topText={topText}
                      bottomText={bottomText}
                      options={
                        useTemplate
                          ? memeTemplates[selectedTemplate]
                          : {
                              fontSize,
                              fontColor,
                              fontFamily,
                              strokeColor,
                              strokeWidth,
                            }
                      }
                    />
                  )}
                </div>

                {/* Info o descarga */}
                {processedImage ? (
                  <>
                    {/* Info */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4" role="status">
                      <div className="flex gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div className="text-sm text-blue-800">
                          <p className="font-semibold mb-1">¡Meme creado!</p>
                          <p>Tu meme está listo para descargar.</p>
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

                    {/* Botón crear otro */}
                    <button
                      onClick={() => setProcessedImage(null)}
                      className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
                      aria-label="Editar meme para hacer cambios"
                    >
                      Editar meme
                    </button>
                  </>
                ) : (
                  // Tips cuando está en preview
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4" role="status">
                    <div className="flex gap-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                        />
                      </svg>
                      <div className="text-sm text-blue-800">
                        <p className="font-semibold mb-1">Vista previa en vivo</p>
                        <p>Los cambios se reflejan automáticamente. Cuando estés listo, haz clic en Crear meme final para generar la imagen descargable.</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {!uploadedImage && (
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
                      d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Sube una imagen para comenzar
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Sección informativa SEO */}
<article className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
  <h2 className="text-2xl font-bold text-gray-900 mb-4">
    Crear Memes Online Gratis - Generador de Memes
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Crea memes divertidos y virales en segundos con nuestro generador de memes online gratuito. Agrega texto arriba y abajo de cualquier imagen con el estilo clásico de meme. Sin marcas de agua, sin registro y con vista previa en tiempo real mientras editas.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Por qué usar nuestro generador de memes?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Vista previa en tiempo real:</strong> Ve cómo queda tu meme mientras escribes el texto</li>
      <li><strong>Plantillas de estilo:</strong> Usa estilos predefinidos (Clásico, Moderno, Minimal, Bold) o personaliza completamente</li>
      <li><strong>Sin límites:</strong> Crea todos los memes que quieras sin restricciones</li>
      <li><strong>Sin marcas de agua:</strong> Tus memes no llevarán logos ni watermarks añadidos</li>
      <li><strong>Procesamiento instantáneo:</strong> Genera tu meme en segundos y descárgalo al instante</li>
      <li><strong>100% gratis:</strong> Sin costos ocultos, sin suscripciones, sin pagos</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo crear un meme?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
      <li>Escribe el texto superior (hasta 50 caracteres)</li>
      <li>Escribe el texto inferior (hasta 50 caracteres) - ambos textos son opcionales</li>
      <li>Elige una plantilla de estilo predefinida o personaliza el diseño completamente</li>
      <li>Ve la vista previa en tiempo real de tu meme mientras lo editas</li>
      <li>Haz clic en Crear meme final cuando estés satisfecho con el resultado</li>
      <li>Descarga tu meme listo para compartir en redes sociales</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Plantillas de estilo disponibles:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Clásico:</strong> El estilo tradicional de meme con fuente Impact blanca y borde negro grueso, perfecto para memes nostálgicos</li>
      <li><strong>Moderno:</strong> Fuente Arial Black limpia y contemporánea para un look actual</li>
      <li><strong>Minimal:</strong> Diseño limpio y simple con menos distracciones visuales</li>
      <li><strong>Bold:</strong> Texto amarillo brillante que resalta sobre cualquier fondo</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Personalización completa:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Tamaño de fuente:</strong> Ajusta de 24px a 100px para diferentes tamaños de imagen</li>
      <li><strong>Color del texto:</strong> Selector de color completo con código hexadecimal</li>
      <li><strong>Color del borde:</strong> Personaliza el contorno del texto para mejor legibilidad</li>
      <li><strong>Grosor del borde:</strong> De 1 a 10 píxeles para controlar la intensidad del contorno</li>
      <li><strong>7 fuentes disponibles:</strong> Impact, Arial Black, Helvetica, Comic Sans MS, Times New Roman, Courier New, Verdana</li>
      <li><strong>Texto en mayúsculas automático:</strong> Mantiene el estilo tradicional de meme</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso populares:
    </h3>
    <p className="text-gray-600 mb-4">
      Nuestro generador de memes es perfecto para múltiples situaciones:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Redes sociales:</strong> Crea contenido viral para Instagram, Facebook, Twitter, Reddit y TikTok</li>
      <li><strong>Marketing digital:</strong> Genera contenido humorístico para aumentar engagement con tu audiencia</li>
      <li><strong>Comunicación interna:</strong> Usa memes en presentaciones de trabajo o chats de equipo</li>
      <li><strong>Grupos de WhatsApp:</strong> Crea memes personalizados para tus conversaciones grupales</li>
      <li><strong>Campañas virales:</strong> Desarrolla contenido memético para campañas de marketing viral</li>
      <li><strong>Educación:</strong> Profesores pueden crear memes educativos para hacer las clases más entretenidas</li>
      <li><strong>Eventos y celebraciones:</strong> Memes personalizados para cumpleaños, bodas o eventos especiales</li>
      <li><strong>Expresión personal:</strong> Crea memes de tus fotos, mascotas o situaciones cotidianas</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Vista previa en vivo:</strong> Ve los cambios instantáneamente mientras escribes y editas</li>
      <li><strong>Sin instalación:</strong> Funciona completamente en tu navegador sin descargar nada</li>
      <li><strong>Privacidad garantizada:</strong> Tus imágenes se procesan localmente, nunca se suben a servidores externos</li>
      <li><strong>Sin registro:</strong> Empieza a crear memes inmediatamente sin crear cuenta</li>
      <li><strong>Límite de caracteres claro:</strong> Contador en tiempo real (50 caracteres por texto)</li>
      <li><strong>Edición después de crear:</strong> Modifica tu meme después de generarlo sin perder el progreso</li>
      <li><strong>Alta calidad:</strong> Mantiene la resolución original de tu imagen</li>
      <li><strong>Descarga instantánea:</strong> Obtén tu meme en formato PNG listo para compartir</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Tipos de memes que puedes crear:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Memes clásicos:</strong> Estilo tradicional de internet con texto arriba y abajo</li>
      <li><strong>Memes de reacción:</strong> Usa fotos de caras, gestos o situaciones con texto descriptivo</li>
      <li><strong>Memes de mascotas:</strong> Convierte fotos de tu perro o gato en contenido viral</li>
      <li><strong>Memes de situaciones:</strong> Captura momentos cotidianos y añade texto humorístico</li>
      <li><strong>Memes educativos:</strong> Combina imágenes con datos o información de forma entretenida</li>
      <li><strong>Memes de eventos:</strong> Comentarios sobre eventos actuales, deportes o cultura pop</li>
      <li><strong>Memes personalizados:</strong> Usa tus propias fotos para crear contenido único</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Consejos para crear memes exitosos:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sé conciso:</strong> El texto corto y directo funciona mejor que las frases largas</li>
      <li><strong>Timing del chiste:</strong> El texto superior prepara, el inferior remata el chiste</li>
      <li><strong>Contraste visual:</strong> Asegúrate de que el texto sea fácil de leer sobre la imagen</li>
      <li><strong>Relatable:</strong> Los memes más exitosos son aquellos con los que la gente se identifica</li>
      <li><strong>Actualidad:</strong> Referencias a eventos recientes suelen tener más engagement</li>
      <li><strong>Originalidad:</strong> Pon tu propio giro a formatos populares de memes</li>
      <li><strong>Conoce a tu audiencia:</strong> Adapta el humor al público que lo verá</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas sobre otros generadores de memes:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Sin marcas de agua:</strong> Muchos generadores agregan sus logos, nosotros no</li>
      <li><strong>Vista previa en tiempo real:</strong> No todos ofrecen preview mientras editas</li>
      <li><strong>Privacidad total:</strong> Tus imágenes nunca salen de tu dispositivo</li>
      <li><strong>Gratis sin limitaciones:</strong> Sin límite de memes diarios ni funciones premium</li>
      <li><strong>Interfaz moderna:</strong> Diseño limpio y fácil de usar en cualquier dispositivo</li>
      <li><strong>Sin anuncios intrusivos:</strong> Crea memes sin distracciones publicitarias</li>
      <li><strong>Personalización avanzada:</strong> Control total sobre fuente, tamaño, colores y bordes</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formato y compartir en redes sociales:
    </h3>
    <p className="text-gray-600 mb-4">
      Los memes generados están optimizados para compartir en todas las plataformas sociales principales:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Instagram:</strong> Formato perfecto para posts y stories</li>
      <li><strong>Facebook:</strong> Tamaño ideal para compartir en timeline y grupos</li>
      <li><strong>Twitter/X:</strong> Dimensiones compatibles con el feed</li>
      <li><strong>Reddit:</strong> Alta calidad para subreddits populares</li>
      <li><strong>WhatsApp:</strong> Optimizado para compartir en chats y estados</li>
      <li><strong>TikTok:</strong> Puede usarse en videos o como imagen fija</li>
      <li><strong>Discord:</strong> Tamaño perfecto para canales y servidores</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Historia de los memes:
    </h3>
    <p className="text-gray-600 mb-4">
      El formato de meme de imagen con texto arriba y abajo se popularizó en los años 2000 con sitios como 4chan, Reddit y 9GAG. El estilo clásico usa la fuente Impact blanca con borde negro para garantizar legibilidad sobre cualquier imagen. Hoy en día, los memes son una parte fundamental de la cultura de internet y una forma poderosa de comunicación viral.
    </p>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Formatos soportados:
    </h3>
    <p className="text-gray-600 mb-4">
      Acepta los formatos de imagen más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Puedes subir imágenes de hasta 50MB, lo cual es ideal para fotos de alta resolución o capturas de pantalla. El resultado final se exporta en PNG de alta calidad, perfecto para mantener la nitidez del texto y los colores.
    </p>

    <p className="text-gray-600">
      Ya sea que quieras crear memes para entretenimiento personal, contenido viral para redes sociales, o material humorístico para marketing digital, nuestra herramienta te proporciona todas las funciones necesarias de forma gratuita, rápida y sin complicaciones. ¡Empieza a crear memes memorables ahora!
    </p>
  </div>
</article>
    </div>
  );
}