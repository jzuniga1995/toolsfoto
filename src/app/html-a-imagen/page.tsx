// src/app/html-a-imagen/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useDownload } from '@/hooks/useDownload';
import DownloadButton from '@/components/tools/DownloadButton';
import {
  htmlToImage,
  htmlWithStylesToImage,
  validateHtml,
  htmlTemplates,
  type HtmlToImageResult,
  type HtmlToImageOptions,
} from '@/lib/tools/htmlToImage';
import type { ImageFormat } from '@/types';

type Template = 'simple' | 'card' | 'quote' | 'social' | 'custom';

export default function HtmlAImagenPage() {
  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<HtmlToImageResult | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Editor states
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('simple');
  const [htmlCode, setHtmlCode] = useState(htmlTemplates.simple);
  const [cssCode, setCssCode] = useState('');
  const [useSeparateCSS, setUseSeparateCSS] = useState(false);

  // Opciones
  const [format, setFormat] = useState<ImageFormat>('png');
  const [quality, setQuality] = useState(95);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [useCustomBg, setUseCustomBg] = useState(false);
  const [scale, setScale] = useState(2);

  // Cambiar plantilla
  const handleTemplateChange = (template: Template) => {
    setSelectedTemplate(template);
    if (template !== 'custom') {
      setHtmlCode(htmlTemplates[template]);
      setCssCode('');
      setUseSeparateCSS(false);
    }
    setProcessedImage(null);
    setProcessingError(null);
  };

  // Procesar HTML a imagen
  const handleGenerate = async () => {
    setIsProcessing(true);
    setProcessingError(null);
    setProcessedImage(null);

    try {
      // Validar HTML
      const validation = validateHtml(htmlCode);
      if (!validation.isValid) {
        throw new Error(validation.error || 'HTML inválido');
      }

      const options: HtmlToImageOptions = {
        format,
        quality,
        width,
        height,
        backgroundColor: useCustomBg ? backgroundColor : undefined,
        scale,
      };

      let result: HtmlToImageResult;

      if (useSeparateCSS && cssCode.trim()) {
        result = await htmlWithStylesToImage(htmlCode, cssCode, options);
      } else {
        result = await htmlToImage(htmlCode, options);
      }

      setProcessedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al generar la imagen';
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
              <h1 className="text-2xl font-bold text-gray-900">HTML a Imagen</h1>
              <p className="text-sm text-gray-600">
                Convierte código HTML/CSS en imágenes de alta calidad
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda - Editor */}
          <div className="space-y-6">
            {/* Plantillas */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                1. Elige una plantilla
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'simple', label: 'Simple', icon: '📄' },
                  { id: 'card', label: 'Tarjeta', icon: '💳' },
                  { id: 'quote', label: 'Cita', icon: '💬' },
                  { id: 'social', label: 'Redes Sociales', icon: '📱' },
                ].map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateChange(template.id as Template)}
                    className={`p-4 rounded-lg border-2 transition-all text-left ${
                      selectedTemplate === template.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{template.icon}</span>
                      <span className="font-medium text-gray-900">{template.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Editor HTML */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  2. Edita el código
                </h2>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="useSeparateCSS"
                    checked={useSeparateCSS}
                    onChange={(e) => setUseSeparateCSS(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="useSeparateCSS" className="text-sm text-gray-700">
                    CSS separado
                  </label>
                </div>
              </div>

              {/* HTML Code */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HTML
                </label>
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="<div>Tu código HTML aquí...</div>"
                  spellCheck={false}
                />
              </div>

              {/* CSS Code (opcional) */}
              {useSeparateCSS && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CSS
                  </label>
                  <textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    className="w-full h-40 px-4 py-3 border border-gray-300 rounded-lg font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder=".clase { color: blue; }"
                    spellCheck={false}
                  />
                </div>
              )}
            </div>

            {/* Opciones de exportación */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                3. Opciones de exportación
              </h2>

              <div className="space-y-6">
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

                {/* Dimensiones */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Dimensiones (opcional)
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <input
                        type="number"
                        value={width || ''}
                        onChange={(e) =>
                          setWidth(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="Ancho (px)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <input
                        type="number"
                        value={height || ''}
                        onChange={(e) =>
                          setHeight(e.target.value ? Number(e.target.value) : undefined)
                        }
                        placeholder="Alto (px)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Dejar vacío para usar las dimensiones del contenido
                  </p>
                </div>

                {/* Escala */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-700">
                      Calidad de renderizado
                    </label>
                    <span className="text-sm font-semibold text-blue-600">{scale}x</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="3"
                    step="1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Normal</span>
                    <span>Alta</span>
                  </div>
                </div>

                {/* Color de fondo */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="checkbox"
                      id="useCustomBg"
                      checked={useCustomBg}
                      onChange={(e) => setUseCustomBg(e.target.checked)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="useCustomBg" className="text-sm font-medium text-gray-700">
                      Fondo personalizado
                    </label>
                  </div>
                  {useCustomBg && (
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  )}
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

                {/* Botón generar */}
                <button
                  onClick={handleGenerate}
                  disabled={isProcessing || !htmlCode.trim()}
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
                      Generando...
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
                          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                        />
                      </svg>
                      Generar imagen
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
          </div>

          {/* Columna Derecha - Preview */}
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
                        alt="Resultado"
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
                      <span className="text-sm text-gray-600">Dimensiones</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {processedImage.dimensions.width} x{' '}
                        {processedImage.dimensions.height}px
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600">Tamaño del archivo</span>
                      <span className="text-sm font-semibold text-gray-900">
                        {(processedImage.size / 1024).toFixed(2)} KB
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
            ) : (
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
                      d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Edita el código y genera la imagen
                  </p>
                  <p className="text-xs mt-2">
                    La vista previa aparecerá aquí
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
    Convertir HTML a Imagen Online Gratis
  </h2>
  <div className="prose prose-gray max-w-none">
    <p className="text-gray-600 mb-4">
      Transforma tu código HTML y CSS en imágenes de alta calidad de manera instantánea. Nuestra herramienta online gratuita te permite generar imágenes PNG, JPG o WebP a partir de código HTML, perfecta para crear capturas de componentes, mockups, posts para redes sociales y más, sin necesidad de instalar nada.
    </p>
    
    <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
      ¿Por qué convertir HTML a imagen?
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Contenido para redes sociales:</strong> Crea tarjetas visuales atractivas para Twitter, Instagram o LinkedIn</li>
      <li><strong>Documentación técnica:</strong> Captura componentes y elementos de UI para tutoriales y guías</li>
      <li><strong>Mockups y prototipos:</strong> Genera previsualizaciones visuales de diseños web</li>
      <li><strong>Open Graph Images:</strong> Crea imágenes de vista previa personalizadas para compartir en redes</li>
      <li><strong>Tarjetas de presentación:</strong> Diseña tarjetas digitales con HTML y expórtalas como imagen</li>
      <li><strong>Emails y newsletters:</strong> Convierte secciones HTML complejas en imágenes compatibles</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      ¿Cómo convertir HTML a imagen?
    </h3>
    <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
      <li>Elige una plantilla prediseñada o selecciona Personalizado para tu propio código</li>
      <li>Edita el código HTML en el editor integrado</li>
      <li>Opcionalmente, activa CSS separado para agregar estilos adicionales</li>
      <li>Selecciona el formato de salida: PNG (con transparencia), JPG o WebP</li>
      <li>Ajusta las dimensiones, calidad y opciones de renderizado según tus necesidades</li>
      <li>Haz clic en Generar imagen y descarga tu resultado instantáneamente</li>
    </ol>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Plantillas disponibles:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Simple:</strong> Plantilla básica para comenzar rápidamente con tu contenido</li>
      <li><strong>Tarjeta:</strong> Diseño tipo card perfecto para componentes y secciones destacadas</li>
      <li><strong>Cita:</strong> Formato ideal para crear imágenes de quotes y testimonios</li>
      <li><strong>Redes Sociales:</strong> Optimizada para posts de Instagram, Twitter y Facebook</li>
      <li><strong>Personalizado:</strong> Libertad total para escribir tu propio código HTML/CSS</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Características destacadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Editor integrado:</strong> Escribe y edita tu código HTML directamente en el navegador</li>
      <li><strong>CSS separado opcional:</strong> Agrega estilos adicionales de forma organizada</li>
      <li><strong>Múltiples formatos:</strong> Exporta en PNG (con transparencia), JPG o WebP</li>
      <li><strong>Dimensiones personalizables:</strong> Define el ancho y alto exacto de tu imagen</li>
      <li><strong>Calidad ajustable:</strong> Control de escala de renderizado (1x, 2x, 3x) para máxima nitidez</li>
      <li><strong>Fondo personalizado:</strong> Elige el color de fondo o mantén la transparencia</li>
      <li><strong>Vista previa instantánea:</strong> Ve el resultado antes de descargar</li>
      <li><strong>Sin límites:</strong> Genera todas las imágenes que necesites sin restricciones</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Casos de uso profesionales:
    </h3>
    <p className="text-gray-600 mb-4">
      Esta herramienta es esencial para desarrolladores, diseñadores y creadores de contenido:
    </p>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Marketing digital:</strong> Crea tarjetas visuales para anuncios y campañas en redes sociales</li>
      <li><strong>Documentación de código:</strong> Captura ejemplos de componentes para documentación técnica</li>
      <li><strong>Portfolios web:</strong> Genera imágenes de vista previa de tus proyectos</li>
      <li><strong>Blog posts:</strong> Crea imágenes destacadas personalizadas para artículos</li>
      <li><strong>Presentaciones:</strong> Convierte slides HTML en imágenes para PowerPoint o Keynote</li>
      <li><strong>Email marketing:</strong> Transforma diseños complejos en imágenes optimizadas</li>
      <li><strong>Social media cards:</strong> Diseña Open Graph images para compartir en plataformas sociales</li>
      <li><strong>Certificados digitales:</strong> Crea certificados y diplomas en HTML y expórtalos como imagen</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Opciones de configuración avanzadas:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>Formato PNG:</strong> Ideal para imágenes con transparencia y calidad sin pérdida</li>
      <li><strong>Formato JPG:</strong> Perfecto para fotografías y diseños sin transparencia, con menor tamaño de archivo</li>
      <li><strong>Formato WebP:</strong> Máxima compresión con excelente calidad, ideal para web</li>
      <li><strong>Escala de renderizado:</strong> Aumenta la resolución 2x o 3x para displays de alta densidad (Retina)</li>
      <li><strong>Dimensiones automáticas:</strong> La imagen se ajusta automáticamente al contenido HTML</li>
      <li><strong>Dimensiones fijas:</strong> Define ancho y alto específicos para formatos estandarizados</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Ventajas de nuestra herramienta:
    </h3>
    <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
      <li><strong>100% gratuito:</strong> Sin costos ocultos, sin marcas de agua, sin límites de uso</li>
      <li><strong>Sin registro:</strong> Comienza a usar inmediatamente sin crear una cuenta</li>
      <li><strong>Privacidad garantizada:</strong> Todo el procesamiento se realiza en tu navegador</li>
      <li><strong>Sin instalación:</strong> No necesitas descargar ningún software o extensión</li>
      <li><strong>Resultados instantáneos:</strong> Genera imágenes en segundos</li>
      <li><strong>Alta calidad:</strong> Renderizado profesional con soporte para CSS moderno</li>
      <li><strong>Responsive preview:</strong> Ve exactamente cómo quedará tu imagen antes de exportar</li>
    </ul>

    <h3 className="text-xl font-semibold text-gray-900 mb-3">
      Compatibilidad y soporte:
    </h3>
    <p className="text-gray-600 mb-4">
      Nuestra herramienta soporta <strong>HTML5 moderno y CSS3</strong>, incluyendo Flexbox, Grid, transformaciones, sombras, gradientes y más. Exporta en los formatos más populares: <strong>PNG, JPG y WebP</strong>, con control total sobre dimensiones, calidad y escala de renderizado.
    </p>
    
    <p className="text-gray-600">
      Ya sea que necesites crear contenido visual para redes sociales, documentar componentes de UI, generar mockups o producir imágenes para marketing, esta herramienta te permite hacerlo de forma rápida, sencilla y profesional.
    </p>
  </div>
</article>
    </div>
  );
}