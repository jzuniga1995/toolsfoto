import React from 'react';
import Link from 'next/link';
import type { Tool } from '@/types';

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link href={tool.path} className="group">
      <div className="relative bg-white rounded-2xl border-2 border-gray-100 p-6 hover:border-blue-500 hover:shadow-xl transition-all duration-300 overflow-hidden h-full flex flex-col">
        {/* Efecto de fondo animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-purple-50/0 to-pink-50/0 group-hover:from-blue-50/50 group-hover:via-purple-50/30 group-hover:to-pink-50/50 transition-all duration-500 -z-10" />
        
        {/* Badge "Nuevo" */}
        {tool.isNew && (
          <div className="absolute -top-1 -right-1">
            <div className="relative">
              <span className="absolute inset-0 bg-blue-500 rounded-full blur-sm opacity-75 animate-pulse" />
              <span className="relative block bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ✨ Nuevo
              </span>
            </div>
          </div>
        )}

        {/* Icono con efecto mejorado */}
        <div className="relative mb-5">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
          <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg">
            <div 
              dangerouslySetInnerHTML={{ __html: tool.icon }} 
              className="w-9 h-9 text-white [&>svg]:w-full [&>svg]:h-full"
            />
          </div>
        </div>

        {/* Contenido */}
        <div className="flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {tool.name}
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed mb-4 flex-1">
            {tool.description}
          </p>

          {/* CTA Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100 group-hover:border-blue-200 transition-colors">
            <span className="text-blue-600 font-semibold text-sm group-hover:text-blue-700 transition-colors">
              Abrir herramienta
            </span>
            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
              <svg
                className="w-4 h-4 text-blue-600 group-hover:text-white group-hover:translate-x-0.5 transition-all"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Shine effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </div>
      </div>
    </Link>
  );
}