// src/app/editor/page.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useImageUpload } from '@/hooks/useImageUpload';
import { useDownload } from '@/hooks/useDownload';
import ImageUploader from '@/components/tools/ImageUploader';
import ImagePreview from '@/components/tools/ImagePreview';
import DownloadButton from '@/components/tools/DownloadButton';
import {
  applyEditorFilters,
  defaultSettings,
  editorPresets,
  settingsToFilterString,
  type EditorSettings,
  type EditorOptions,
} from '@/lib/tools/editor';
import type { ProcessedImage } from '@/types';

export default function EditorPage() {
  const { uploadedImage, isUploading, error: uploadError, handleImageUpload, resetUpload } = useImageUpload({
    maxSizeMB: 50,
    acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  });

  const { downloadProcessedImage, isDownloading } = useDownload();

  const [isProcessing, setIsProcessing] = useState(false);
  const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(null);
  const [processingError, setProcessingError] = useState<string | null>(null);

  // Settings del editor
  const [settings, setSettings] = useState<EditorSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced' | 'presets'>('basic');

  // Opciones de exportación
  const [exportQuality, setExportQuality] = useState(95);

  const updateSetting = (key: keyof EditorSettings, value: number) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = async () => {
    if (!uploadedImage) return;

    setIsProcessing(true);
    setProcessingError(null);

    try {
      const options: EditorOptions = {
        quality: exportQuality,
      };

      const result = await applyEditorFilters(uploadedImage, settings, options);
      setProcessedImage(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al procesar la imagen';
      setProcessingError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSettings(defaultSettings);
    setProcessedImage(null);
  };

  const handleChangeImage = () => {
    resetUpload();
    setProcessedImage(null);
    setProcessingError(null);
    setSettings(defaultSettings);
  };

  const handleApplyPreset = (presetSettings: EditorSettings) => {
    setSettings(presetSettings);
  };

  const handleDownload = async () => {
    if (processedImage) {
      await downloadProcessedImage(processedImage);
    }
  };

  // Style para preview en tiempo real
  const previewStyle = {
    filter: settingsToFilterString(settings),
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
              <h1 className="text-2xl font-bold text-gray-900">Editor de Fotos</h1>
              <p className="text-sm text-gray-600">
                Ajusta brillo, contraste, saturación y aplica filtros profesionales
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Columna Izquierda - Upload y Controles */}
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
                {/* Vista previa con filtros en tiempo real */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Vista Previa
                    </h2>
                    <button
                      onClick={handleChangeImage}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      aria-label="Cambiar imagen"
                    >
                      Cambiar imagen
                    </button>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                    <img
                      src={uploadedImage.preview}
                      alt="Preview"
                      style={previewStyle}
                      className="w-full h-auto"
                    />
                  </div>
                </div>

                {/* Tabs de controles */}
                <div className="bg-white rounded-xl border border-gray-200">
                  {/* Tab Headers */}
                  <div className="flex border-b border-gray-200">
                    <button
                      onClick={() => setActiveTab('basic')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'basic'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Básico
                    </button>
                    <button
                      onClick={() => setActiveTab('advanced')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'advanced'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Avanzado
                    </button>
                    <button
                      onClick={() => setActiveTab('presets')}
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === 'presets'
                          ? 'text-blue-600 border-b-2 border-blue-600'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Presets
                    </button>
                  </div>

                  {/* Tab Content */}
                  <div className="p-6">
                    {/* Básico Tab */}
                    {activeTab === 'basic' && (
                      <div className="space-y-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">
                          2. Ajusta los valores básicos
                        </h3>

                        {/* Brightness */}
                        <SliderControl
                          label="Brillo"
                          value={settings.brightness}
                          min={-100}
                          max={100}
                          onChange={(value) => updateSetting('brightness', value)}
                        />

                        {/* Contrast */}
                        <SliderControl
                          label="Contraste"
                          value={settings.contrast}
                          min={-100}
                          max={100}
                          onChange={(value) => updateSetting('contrast', value)}
                        />

                        {/* Saturation */}
                        <SliderControl
                          label="Saturación"
                          value={settings.saturation}
                          min={-100}
                          max={100}
                          onChange={(value) => updateSetting('saturation', value)}
                        />

                        {/* Blur */}
                        <SliderControl
                          label="Desenfoque"
                          value={settings.blur}
                          min={0}
                          max={20}
                          onChange={(value) => updateSetting('blur', value)}
                        />

                        {/* Sharpen */}
                        <SliderControl
                          label="Nitidez"
                          value={settings.sharpen}
                          min={0}
                          max={100}
                          onChange={(value) => updateSetting('sharpen', value)}
                        />
                      </div>
                    )}

                    {/* Avanzado Tab */}
                    {activeTab === 'advanced' && (
                      <div className="space-y-6">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">
                          Ajustes avanzados
                        </h3>

                        {/* Temperature */}
                        <SliderControl
                          label="Temperatura"
                          value={settings.temperature}
                          min={-100}
                          max={100}
                          onChange={(value) => updateSetting('temperature', value)}
                          leftLabel="Frío"
                          rightLabel="Cálido"
                        />

                        {/* Tint */}
                        <SliderControl
                          label="Tono"
                          value={settings.tint}
                          min={-100}
                          max={100}
                          onChange={(value) => updateSetting('tint', value)}
                          leftLabel="Verde"
                          rightLabel="Magenta"
                        />

                        {/* Hue Rotate */}
                        <SliderControl
                          label="Rotación de color"
                          value={settings.hueRotate}
                          min={0}
                          max={360}
                          onChange={(value) => updateSetting('hueRotate', value)}
                          unit="°"
                        />

                        {/* Vignette */}
                        <SliderControl
                          label="Viñeta"
                          value={settings.vignette}
                          min={0}
                          max={100}
                          onChange={(value) => updateSetting('vignette', value)}
                        />

                        {/* Noise */}
                        <SliderControl
                          label="Grano"
                          value={settings.noise}
                          min={0}
                          max={100}
                          onChange={(value) => updateSetting('noise', value)}
                        />

                        {/* Grayscale */}
                        <SliderControl
                          label="Blanco y negro"
                          value={settings.grayscale}
                          min={0}
                          max={100}
                          onChange={(value) => updateSetting('grayscale', value)}
                        />

                        {/* Sepia */}
                        <SliderControl
                          label="Sepia"
                          value={settings.sepia}
                          min={0}
                          max={100}
                          onChange={(value) => updateSetting('sepia', value)}
                        />

                        {/* Invert */}
                        <SliderControl
                          label="Invertir colores"
                          value={settings.invert}
                          min={0}
                          max={100}
                          onChange={(value) => updateSetting('invert', value)}
                        />
                      </div>
                    )}

                    {/* Presets Tab */}
                    {activeTab === 'presets' && (
                      <div className="space-y-4">
                        <h3 className="text-md font-semibold text-gray-900 mb-4">
                          Filtros predefinidos
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(editorPresets).map(([key, preset]) => (
                            <button
                              key={key}
                              onClick={() => handleApplyPreset(preset.settings)}
                              className="px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                            >
                              {preset.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Calidad de exportación */}
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-4">
                    Calidad de exportación
                  </h3>
                  <SliderControl
                    label="Calidad"
                    value={exportQuality}
                    min={10}
                    max={100}
                    onChange={setExportQuality}
                    unit="%"
                  />
                </div>

                {/* Botones de acción */}
                <div className="flex gap-3">
                  <button
                    onClick={handleReset}
                    className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors duration-200"
                  >
                    Resetear
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
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
                      'Aplicar y Exportar'
                    )}
                  </button>
                </div>

                {processingError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{processingError}</p>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Columna Derecha - Resultado */}
          <div className="space-y-6">
            {processedImage ? (
              <>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    Imagen Editada
                  </h2>
                  <ImagePreview
                    imageUrl={processedImage.url}
                    title="Editada"
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
                      d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42"
                    />
                  </svg>
                  <p className="text-sm font-medium">
                    Ajusta los filtros y haz click en Aplicar y Exportar
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Sección informativa SEO */}
        <article className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Editor de Fotos Online Gratis
          </h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Nuestro editor de fotos online te permite ajustar y mejorar tus imágenes de manera profesional directamente desde tu navegador. Aplica filtros, ajusta colores, brillo, contraste y mucho más sin necesidad de instalar programas complejos.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">
              Características principales:
            </h3>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Vista previa en tiempo real:</strong> Ve los cambios al instante mientras ajustas los valores</li>
              <li><strong>Controles profesionales:</strong> Ajusta brillo, contraste, saturación, temperatura y más</li>
              <li><strong>Filtros predefinidos:</strong> Aplica efectos profesionales con un solo click</li>
              <li><strong>Efectos avanzados:</strong> Viñeta, grano, blanco y negro, sepia y más</li>
              <li><strong>Control de calidad:</strong> Exporta con la calidad que necesites</li>
              <li><strong>100% privado:</strong> Todo el procesamiento se hace en tu navegador, tus fotos nunca se suben a ningún servidor</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              ¿Cómo usar el editor de fotos?
            </h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-2 mb-6">
              <li>Sube tu imagen en formato JPG, PNG o WebP (hasta 50MB)</li>
              <li>Ajusta los valores básicos como brillo, contraste y saturación</li>
              <li>Explora los ajustes avanzados o aplica un filtro predefinido</li>
              <li>Previsualiza los cambios en tiempo real</li>
              <li>Haz click en Aplicar y Exportar para procesar la imagen</li>
              <li>Descarga tu foto editada con la calidad que desees</li>
            </ol>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Filtros y efectos disponibles:
            </h3>
            <p className="text-gray-600 mb-4">
              Nuestro editor incluye una amplia variedad de ajustes profesionales:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li><strong>Ajustes básicos:</strong> Brillo, contraste, saturación, desenfoque y nitidez</li>
              <li><strong>Balance de color:</strong> Temperatura y tono para corregir el color de tus fotos</li>
              <li><strong>Efectos creativos:</strong> Viñeta, grano, rotación de color</li>
              <li><strong>Filtros artísticos:</strong> Blanco y negro, sepia, inversión de colores</li>
              <li><strong>Presets profesionales:</strong> Vintage, dramático, vibrante, suave y más</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              Formatos soportados:
            </h3>
            <p className="text-gray-600">
              Trabaja con los formatos más populares: <strong>JPG/JPEG, PNG y WebP</strong>. Puedes editar imágenes de hasta 50MB y exportar con control total sobre la calidad final del archivo.
            </p>
          </div>
        </article>
      </div>
    </div>
  );
}

// Componente auxiliar para los sliders
interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  unit?: string;
  leftLabel?: string;
  rightLabel?: string;
}

function SliderControl({
  label,
  value,
  min,
  max,
  onChange,
  unit = '',
  leftLabel,
  rightLabel,
}: SliderControlProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <span className="text-sm font-semibold text-blue-600">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
      />
      {(leftLabel || rightLabel) && (
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{leftLabel || ''}</span>
          <span>{rightLabel || ''}</span>
        </div>
      )}
    </div>
  );
}