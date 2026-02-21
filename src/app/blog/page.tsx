// src/app/blog/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { desc, sql } from 'drizzle-orm';
import { Metadata } from 'next';
import { ImageIcon, Scissors, Palette, Sparkles, Target, Zap, Award, Lightbulb, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog - ToolsFoto | Guías y Tutoriales de Edición de Imágenes',
  description: 'Aprende a editar, optimizar y transformar tus imágenes con nuestras guías y tutoriales. Tips profesionales para mejorar tus fotos online.',
  keywords: 'blog edición imágenes, tutoriales fotos, comprimir imágenes, convertir fotos, recortar imágenes, optimizar fotos, herramientas online',
  openGraph: {
    title: 'Blog de Edición de Imágenes - ToolsFoto',
    description: 'Guías completas sobre edición, optimización y conversión de imágenes',
    url: 'https://toolsfoto.com/blog',
    siteName: 'ToolsFoto',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog de Edición de Imágenes - ToolsFoto',
    description: 'Tutoriales y guías para editar y optimizar tus fotos online',
  },
  alternates: {
    canonical: 'https://toolsfoto.com/blog',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const revalidate = 3600;

const POSTS_PER_PAGE = 12;

// Herramientas disponibles
const herramientasDisponibles = [
  {
    nombre: 'Comprimir Imagen',
    descripcion: 'Reduce el tamaño sin perder calidad',
    color: 'from-blue-500 to-indigo-600',
    url: '/compress',
    Icon: Sparkles,
  },
  {
    nombre: 'Recortar Imagen',
    descripcion: 'Ajusta y recorta tus fotos',
    color: 'from-green-500 to-teal-600',
    url: '/crop',
    Icon: Scissors,
  },
  {
    nombre: 'Convertir Formato',
    descripcion: 'Cambia entre JPG, PNG, WebP',
    color: 'from-purple-500 to-pink-600',
    url: '/convert',
    Icon: Palette,
  },
];

// Componente de Paginación
interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pages: number[] = [];
  const showPages = 5;

  let startPage = Math.max(1, currentPage - Math.floor(showPages / 2));
  const endPage = Math.min(totalPages, startPage + showPages - 1);

  if (endPage - startPage + 1 < showPages) {
    startPage = Math.max(1, endPage - showPages + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <nav className="flex justify-center items-center gap-2 mt-12" aria-label="Paginación">
      {/* Botón Anterior */}
      {currentPage > 1 ? (
        <Link
          href={`/blog?page=${currentPage - 1}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </Link>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="hidden sm:inline">Anterior</span>
        </button>
      )}

      {/* Primera página */}
      {startPage > 1 && (
        <>
          <Link
            href="/blog?page=1"
            className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            1
          </Link>
          {startPage > 2 && <span className="text-gray-400">...</span>}
        </>
      )}

      {/* Números de página */}
      {pages.map((page) => (
        <Link
          key={page}
          href={`/blog?page=${page}`}
          className={`w-10 h-10 flex items-center justify-center border rounded-lg transition-colors font-medium ${
            currentPage === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </Link>
      ))}

      {/* Última página */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="text-gray-400">...</span>}
          <Link
            href={`/blog?page=${totalPages}`}
            className="w-10 h-10 flex items-center justify-center bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {/* Botón Siguiente */}
      {currentPage < totalPages ? (
        <Link
          href={`/blog?page=${currentPage + 1}`}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      ) : (
        <button
          disabled
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-400 border border-gray-200 rounded-lg cursor-not-allowed"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </nav>
  );
}

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params?.page || '1');
  const offset = (currentPage - 1) * POSTS_PER_PAGE;

  // Obtener posts paginados
  const allPosts = await db
    .select()
    .from(posts)
    .orderBy(desc(posts.published_at))
    .limit(POSTS_PER_PAGE)
    .offset(offset);

  // Contar total de posts
  const totalPostsResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(posts);
  
  const totalPosts = totalPostsResult[0]?.count || 0;
  const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
          {/* Pattern background */}
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          <div className="container mx-auto px-4 py-20 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                <span>Aprende a editar como un profesional</span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Blog de Edición de Imágenes
              </h1>
              <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
                Tutoriales, guías y consejos profesionales<br/>
                para transformar tus fotos online
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-1">3</div>
                  <div className="text-sm text-blue-100">Herramientas</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-1">{totalPosts}</div>
                  <div className="text-sm text-blue-100">Artículos</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                  <div className="text-3xl font-bold text-white mb-1">100%</div>
                  <div className="text-sm text-blue-100">Gratis</div>
                </div>
              </div>
            </div>
          </div>

          {/* Wave separator */}
          <div className="absolute bottom-0 left-0 right-0">
            <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-blue-50">
              <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="currentColor"/>
            </svg>
          </div>
        </div>

        {/* Herramientas Grid */}
        <div className="container mx-auto px-4 py-16 -mt-12 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Nuestras Herramientas Gratuitas
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Edita tus imágenes directamente en tu navegador. 100% gratis, sin registro ni límites
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {herramientasDisponibles.map((tool, index) => {
              const IconComponent = tool.Icon;
              return (
                <Link
                  key={tool.nombre}
                  href={tool.url}
                  className="group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 hover:scale-105 border-2 border-transparent hover:border-blue-500 text-center h-full flex flex-col">
                    <div className={`bg-gradient-to-br ${tool.color} w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg group-hover:text-blue-600 transition-colors">
                      {tool.nombre}
                    </h3>
                    <p className="text-sm text-gray-500 flex-1 mb-4">
                      {tool.descripcion}
                    </p>
                    <div className="text-blue-600 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Usar herramienta →
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">100% Privado</h3>
              <p className="text-sm text-gray-600">Todo el procesamiento ocurre en tu navegador</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Súper Rápido</h3>
              <p className="text-sm text-gray-600">Sin esperas ni archivos subidos a servidores</p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Sin Límites</h3>
              <p className="text-sm text-gray-600">Usa todas las herramientas sin restricciones</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-4">
                <Lightbulb className="w-4 h-4" />
                <span>Tutoriales y Guías</span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Aprende a Editar Imágenes
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                {totalPosts > 0 
                  ? `Página ${currentPage} de ${totalPages} - ${totalPosts} artículos disponibles`
                  : 'Guías sobre edición, optimización y conversión de imágenes'
                }
              </p>
            </div>

            {allPosts.length === 0 ? (
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl shadow-2xl p-16 text-center border max-w-3xl mx-auto">
                <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                  <ImageIcon className="w-16 h-16 text-blue-600" strokeWidth={2} />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Contenido en Camino</h3>
                <p className="text-lg text-gray-600 mb-8">
                  Estamos preparando tutoriales y guías profesionales sobre edición y optimización de imágenes
                </p>
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    📸 Compresión
                  </span>
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    ✂️ Recorte
                  </span>
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    🎨 Conversión
                  </span>
                  <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-medium">
                    ✨ Optimización
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  Mientras tanto, prueba nuestras herramientas gratuitas ↓
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {allPosts.map((post, index) => (
                    <Link 
                      key={post.id} 
                      href={`/blog/${post.slug}`}
                      className="group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-3 h-full flex flex-col border-2 border-transparent hover:border-blue-500">
                        {post.image_url ? (
                          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                            <Image 
                              src={post.image_url} 
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              quality={85}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                              <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900">
                                <Clock className="w-3 h-3" />
                                {Math.ceil(post.content.split(' ').length / 200)} min
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-56 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 opacity-10">
                              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <pattern id={`pattern-${post.id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                                    <circle cx="10" cy="10" r="2" fill="white"/>
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#pattern-${post.id})`} />
                              </svg>
                            </div>
                            <ImageIcon className="w-20 h-20 text-white/70 relative z-10" strokeWidth={1.5} />
                          </div>
                        )}

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>
                                {new Date(post.published_at!).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                            {post.author && (
                              <div className="flex items-center gap-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>{post.author}</span>
                              </div>
                            )}
                          </div>

                          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {post.title}
                          </h2>

                          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
                            {post.excerpt || post.content.substring(0, 150) + '...'}
                          </p>

                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm group-hover:gap-3 transition-all">
                              <span>Leer artículo</span>
                              <ImageIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="container mx-auto px-4 py-20">
          <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full -ml-48 -mb-48"></div>
            
            <div className="relative p-12 md:p-16 text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para editar tus imágenes?</h2>
              <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                Usa nuestras herramientas profesionales. 100% gratis, sin registro
              </p>
              
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/compress"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Comprimir
                </Link>
                <Link
                  href="/crop"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <Scissors className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Recortar
                </Link>
                <Link
                  href="/convert"
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <Palette className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  Convertir
                </Link>
              </div>

              <p className="mt-8 text-sm text-blue-100">
                ✨ Más de 10,000 usuarios confían en ToolsFoto para editar sus imágenes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Schema Markup */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": "Blog de Edición de Imágenes ToolsFoto",
          "description": "Tutoriales y guías sobre edición, optimización y conversión de imágenes online",
          "url": "https://toolsfoto.com/blog",
          "inLanguage": "es-ES",
          "publisher": {
            "@type": "Organization",
            "name": "ToolsFoto",
            "logo": {
              "@type": "ImageObject",
              "url": "https://toolsfoto.com/logo.png"
            }
          }
        }) }} 
      />
    </>
  );
}