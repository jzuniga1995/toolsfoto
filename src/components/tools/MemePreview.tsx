// src/components/tools/MemePreview.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import type { MemeOptions } from '@/types';

interface MemePreviewProps {
  imageUrl: string;
  topText: string;
  bottomText: string;
  options: Omit<MemeOptions, 'topText' | 'bottomText'>;
}

export default function MemePreview({ 
  imageUrl, 
  topText, 
  bottomText, 
  options 
}: MemePreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      // Configurar tamaño del canvas
      canvas.width = img.width;
      canvas.height = img.height;
      setDimensions({ width: img.width, height: img.height });

      // Dibujar imagen
      ctx.drawImage(img, 0, 0);

      // Configurar estilo del texto
      const {
        fontSize = 48,
        fontColor = '#FFFFFF',
        fontFamily = 'Impact',
        strokeColor = '#000000',
        strokeWidth = 3,
      } = options;

      ctx.font = `bold ${fontSize}px ${fontFamily}`;
      ctx.fillStyle = fontColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      const padding = 20;
      const maxTextWidth = canvas.width - (padding * 2);
      const centerX = canvas.width / 2;

      // Función para dibujar texto con wrapping
      const drawText = (text: string, y: number) => {
        if (!text.trim()) return 0;

        const upperText = text.toUpperCase();
        const words = upperText.split(' ');
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxTextWidth) {
            lines.push(currentLine);
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }
        lines.push(currentLine);

        // Dibujar cada línea
        const lineHeight = fontSize * 1.2;
        lines.forEach((line, index) => {
          const lineY = y + (index * lineHeight);
          
          // Sombra para mejor legibilidad
          ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;
          
          // Dibujar borde
          ctx.strokeText(line, centerX, lineY);
          
          // Resetear sombra
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          // Dibujar texto
          ctx.fillText(line, centerX, lineY);
        });

        return lines.length * lineHeight;
      };

      // Dibujar texto superior
      if (topText.trim()) {
        drawText(topText, padding);
      }

      // Dibujar texto inferior
      if (bottomText.trim()) {
        // Calcular altura del texto inferior para posicionarlo desde abajo
        const words = bottomText.toUpperCase().split(' ');
        let lines = 1;
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const testLine = currentLine + ' ' + words[i];
          const metrics = ctx.measureText(testLine);
          if (metrics.width > maxTextWidth) {
            lines++;
            currentLine = words[i];
          } else {
            currentLine = testLine;
          }
        }

        const lineHeight = fontSize * 1.2;
        const totalTextHeight = lines * lineHeight;
        const bottomY = canvas.height - totalTextHeight - padding;

        drawText(bottomText, bottomY);
      }

      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };

    img.src = imageUrl;
  }, [imageUrl, topText, bottomText, options]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Canvas */}
      <div className="relative bg-gray-100">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <svg
              className="animate-spin h-8 w-8 text-gray-400"
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
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ display: isLoading ? 'none' : 'block' }}
        />
      </div>

      {/* Info */}
      {!isLoading && dimensions.width > 0 && (
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-gray-500">Dimensiones:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {dimensions.width} × {dimensions.height}px
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-600 font-medium">Preview en vivo</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}