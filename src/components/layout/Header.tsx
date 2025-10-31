'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { TOOLS } from '@/lib/constants';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = React.useState(false);

  // Organizar herramientas por categoría
  const toolsByCategory = {
    basico: TOOLS.filter(tool => tool.category === 'basico'),
    creativo: TOOLS.filter(tool => tool.category === 'creativo'),
    avanzado: TOOLS.filter(tool => tool.category === 'avanzado'),
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link 
            href="/" 
            className="flex items-center gap-2 sm:gap-3 hover:opacity-90 transition-opacity flex-shrink-0"
          >
            <div className="relative">
              <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white text-base sm:text-lg font-bold tracking-tight">TF</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 sm:-bottom-1 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold text-gray-900 leading-none">
                ToolsFoto
              </span>
              <span className="hidden xs:block text-[9px] sm:text-[10px] text-gray-500 leading-none">
                Edita en segundos
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - 8 herramientas */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/comprimir"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Comprimir
            </Link>
            <Link
              href="/redimensionar"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Redimensionar
            </Link>
            <Link
              href="/recortar"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Recortar
            </Link>
            <Link
              href="/convertir"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Convertir
            </Link>
            <Link
              href="/girar"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Girar
            </Link>
            <Link
              href="/marca-agua"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Marca de Agua
            </Link>
            <Link
              href="/meme"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Meme
            </Link>
            <Link
              href="/editor"
              className="px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
            >
              Editor
            </Link>

            {/* Mega Menu Horizontal - Todas las 11 herramientas */}
            <div 
              className="relative"
              onMouseEnter={() => setToolsMenuOpen(true)}
              onMouseLeave={() => setToolsMenuOpen(false)}
            >
              <button
                className="flex items-center gap-1 px-2.5 xl:px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all whitespace-nowrap"
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
              >
                Más
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${toolsMenuOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Mega Dropdown Horizontal - 11 herramientas */}
              {toolsMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40"
                    onClick={() => setToolsMenuOpen(false)}
                  />
                  
                  <div className="absolute top-full right-0 mt-2 w-[min(900px,90vw)] bg-white rounded-xl shadow-2xl border border-gray-100 p-4 sm:p-6 z-50 animate-fade-in max-h-[calc(100vh-5rem)] overflow-y-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {/* Herramientas Básicas */}
                      <div>
                        <h3 className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3 pb-2 border-b-2 border-blue-100 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Básicas ({toolsByCategory.basico.length})
                        </h3>
                        <div className="space-y-1">
                          {toolsByCategory.basico.map((tool) => (
                            <Link
                              key={tool.id}
                              href={tool.path}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors group"
                              onClick={() => setToolsMenuOpen(false)}
                            >
                              <span 
                                className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-blue-600 transition-colors"
                                dangerouslySetInnerHTML={{ __html: tool.icon }}
                              />
                              <span className="font-medium truncate">{tool.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Herramientas Creativas */}
                      <div>
                        <h3 className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-3 pb-2 border-b-2 border-green-100 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                          </svg>
                          Creativas ({toolsByCategory.creativo.length})
                        </h3>
                        <div className="space-y-1">
                          {toolsByCategory.creativo.map((tool) => (
                            <Link
                              key={tool.id}
                              href={tool.path}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors group"
                              onClick={() => setToolsMenuOpen(false)}
                            >
                              <span 
                                className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-green-600 transition-colors"
                                dangerouslySetInnerHTML={{ __html: tool.icon }}
                              />
                              <span className="font-medium truncate">{tool.name}</span>
                            </Link>
                          ))}
                        </div>
                      </div>

                      {/* Herramientas Avanzadas */}
                      <div>
                        <h3 className="text-xs font-semibold text-purple-600 uppercase tracking-wider mb-3 pb-2 border-b-2 border-purple-100 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Avanzadas ({toolsByCategory.avanzado.length})
                        </h3>
                        <div className="space-y-1">
                          {toolsByCategory.avanzado.map((tool) => (
                            <Link
                              key={tool.id}
                              href={tool.path}
                              className="flex items-center gap-3 px-3 py-2.5 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors group relative"
                              onClick={() => setToolsMenuOpen(false)}
                            >
                              <span 
                                className="flex-shrink-0 w-5 h-5 text-gray-500 group-hover:text-purple-600 transition-colors"
                                dangerouslySetInnerHTML={{ __html: tool.icon }}
                              />
                              <span className="font-medium truncate pr-14">{tool.name}</span>
                              {tool.isNew && (
                                <span className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                                  Nuevo
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Menú"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4 animate-fade-in max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {/* Herramientas Básicas Mobile */}
              <div className="px-3 pt-3 pb-2">
                <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Básicas ({toolsByCategory.basico.length})
                </p>
              </div>
              {toolsByCategory.basico.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span 
                    className="flex-shrink-0 w-5 h-5"
                    dangerouslySetInnerHTML={{ __html: tool.icon }}
                  />
                  <span>{tool.name}</span>
                </Link>
              ))}
              
              {/* Herramientas Creativas Mobile */}
              <div className="px-3 pt-3 pb-2 mt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-green-600 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  Creativas ({toolsByCategory.creativo.length})
                </p>
              </div>
              {toolsByCategory.creativo.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span 
                    className="flex-shrink-0 w-5 h-5"
                    dangerouslySetInnerHTML={{ __html: tool.icon }}
                  />
                  <span>{tool.name}</span>
                </Link>
              ))}

              {/* Herramientas Avanzadas Mobile */}
              <div className="px-3 pt-3 pb-2 mt-2 border-t border-gray-200">
                <p className="text-xs font-semibold text-purple-600 uppercase tracking-wider flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Avanzadas ({toolsByCategory.avanzado.length})
                </p>
              </div>
              {toolsByCategory.avanzado.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.path}
                  className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span 
                    className="flex-shrink-0 w-5 h-5"
                    dangerouslySetInnerHTML={{ __html: tool.icon }}
                  />
                  <span className="flex-1">{tool.name}</span>
                  {tool.isNew && (
                    <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded uppercase">
                      Nuevo
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}