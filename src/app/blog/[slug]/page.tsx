// src/app/blog/[slug]/page.tsx
import { db } from '@/lib/db';
import { posts } from '@/lib/db/schema';
import { eq, ne, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Metadata } from 'next';
import { ImageIcon, Scissors, Palette, Clock, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import ShareButtons from '@/app/components/blog/ShareButtons';

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  
  if (post.length === 0) {
    return {
      title: 'Post no encontrado - ToolsFoto',
      description: 'El artículo que buscas no está disponible',
    };
  }

  const postData = post[0];
  const excerpt = postData.excerpt || postData.content.substring(0, 160);

  return {
    title: `${postData.title} | ToolsFoto Blog`,
    description: excerpt,
    keywords: `${postData.title}, edición de imágenes, herramientas de foto, comprimir imágenes, convertir fotos, recortar imágenes, optimizar fotos`,
    authors: [{ name: postData.author || 'ToolsFoto' }],
    openGraph: {
      title: postData.title,
      description: excerpt,
      url: `https://toolsfoto.com/blog/${postData.slug}`,
      siteName: 'ToolsFoto',
      type: 'article',
      publishedTime: postData.published_at?.toISOString(),
      modifiedTime: postData.updated_at?.toISOString(),
      authors: [postData.author || 'ToolsFoto'],
      images: postData.image_url ? [
        {
          url: postData.image_url,
          width: 1200,
          height: 630,
          alt: postData.title,
        }
      ] : [],
      locale: 'es_ES',
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: excerpt,
      images: postData.image_url ? [postData.image_url] : [],
    },
    alternates: {
      canonical: `https://toolsfoto.com/blog/${postData.slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).limit(1);
  
  if (post.length === 0) {
    notFound();
  }

  const postData = post[0];
  const currentUrl = `https://toolsfoto.com/blog/${postData.slug}`;
  
  // Obtener artículos relacionados (excluyendo el actual)
  const relatedPosts = await db
    .select()
    .from(posts)
    .where(ne(posts.id, postData.id))
    .orderBy(desc(posts.published_at))
    .limit(9);

  // Calcular tiempo de lectura
  const wordCount = postData.content.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  // Schema markup para el artículo
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": postData.title,
    "description": postData.excerpt || postData.content.substring(0, 160),
    "image": postData.image_url || "https://toolsfoto.com/og-image.jpg",
    "datePublished": postData.published_at?.toISOString(),
    "dateModified": postData.updated_at?.toISOString() || postData.published_at?.toISOString(),
    "author": {
      "@type": "Person",
      "name": postData.author || "ToolsFoto"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ToolsFoto",
      "logo": {
        "@type": "ImageObject",
        "url": "https://toolsfoto.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": currentUrl
    },
    "wordCount": wordCount,
    "timeRequired": `PT${readingTime}M`,
    "url": currentUrl,
    "inLanguage": "es-ES"
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Inicio",
        "item": "https://toolsfoto.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://toolsfoto.com/blog"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": postData.title,
        "item": currentUrl
      }
    ]
  };

  return (
    <>
      {/* Schema Markup */}
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} 
      />
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} 
      />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="container mx-auto px-4 py-3 md:py-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm overflow-x-auto" aria-label="Breadcrumb">
              <Link href="/" className="text-gray-500 hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                Inicio
              </Link>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <Link href="/blog" className="text-gray-500 hover:text-blue-600 transition-colors font-medium whitespace-nowrap">
                Blog
              </Link>
              <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 flex-shrink-0" />
              <span className="text-gray-900 font-semibold truncate">{postData.title}</span>
            </nav>
          </div>
        </div>

        {/* Article */}
        <article className="container mx-auto px-4 py-6 sm:py-8 md:py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <header className="mb-8 md:mb-10">
              {/* Categoría */}
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium">
                  <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  Edición de Imágenes
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                {postData.title}
              </h1>
              
              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-gray-600 mb-8 pb-6 border-b border-gray-200">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-lg">
                    {(postData.author || 'T')[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm sm:text-base">
                      {postData.author || 'Equipo ToolsFoto'}
                    </p>
                    <p className="text-xs text-gray-500">Experto en Edición de Imágenes</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                  <time dateTime={postData.published_at?.toISOString()} className="text-xs sm:text-sm">
                    {new Date(postData.published_at!).toLocaleDateString('es-ES', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                  <span className="font-medium text-xs sm:text-sm">{readingTime} min de lectura</span>
                </div>
              </div>

              {/* Featured Image */}
              {postData.image_url && (
                <div className="rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl mb-6 sm:mb-8 relative w-full aspect-video bg-gray-100">
                  <Image 
                    src={postData.image_url} 
                    alt={postData.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                    quality={90}
                  />
                </div>
              )}

              {/* Excerpt */}
              {postData.excerpt && (
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-600 p-4 sm:p-6 rounded-r-xl mb-6 sm:mb-8">
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
                    {postData.excerpt}
                  </p>
                </div>
              )}
            </header>

            {/* Content */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 lg:p-12 border mb-8 sm:mb-12">
              <div 
                className="prose prose-sm sm:prose-base md:prose-lg max-w-none
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:border-b prose-h2:border-gray-200
                  prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4
                  prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4 sm:prose-p:mb-6 prose-p:text-base sm:prose-p:text-lg
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
                  prose-strong:text-gray-900 prose-strong:font-bold
                  prose-ul:my-4 sm:prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
                  prose-ol:my-4 sm:prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
                  prose-li:text-gray-700 prose-li:my-2 prose-li:text-base sm:prose-li:text-lg prose-li:leading-relaxed
                  prose-img:rounded-lg sm:prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-6 sm:prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:rounded-r-xl prose-blockquote:my-4 sm:prose-blockquote:my-6 prose-blockquote:italic
                  prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1.5 sm:prose-code:px-2 prose-code:py-0.5 sm:prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-xs sm:prose-code:text-sm
                  prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:p-4 sm:prose-pre:p-6 prose-pre:rounded-xl prose-pre:shadow-lg
                  prose-table:w-full prose-table:my-6 sm:prose-table:my-8 prose-table:border-collapse
                  prose-thead:bg-gray-100
                  prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
                  prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700
                  prose-tr:border-b prose-tr:border-gray-200"
                dangerouslySetInnerHTML={{ __html: postData.content }}
              />
            </div>

            {/* Author Bio */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-blue-200 mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg flex-shrink-0">
                  {(postData.author || 'T')[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">
                    Escrito por {postData.author || 'Equipo ToolsFoto'}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4">
                    Expertos en edición de imágenes dedicados a ayudarte a crear contenido visual increíble con herramientas gratuitas y fáciles de usar.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2.5 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      Edición de Fotos
                    </span>
                    <span className="px-2.5 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Optimización
                    </span>
                    <span className="px-2.5 sm:px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Herramientas Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Share Section */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl border p-6 sm:p-8 mb-8 sm:mb-12">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
                <div className="flex-1">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    ¿Te resultó útil este artículo?
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    Compártelo con alguien a quien le pueda ayudar
                  </p>
                </div>
                <ShareButtons title={postData.title} url={currentUrl} />
              </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 text-center text-white mb-8 sm:mb-12">
              <h3 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Prueba Nuestras Herramientas</h3>
              <p className="text-base sm:text-xl text-blue-100 mb-6 sm:mb-8">
                Edita tus imágenes gratis y sin registro
              </p>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center">
                <Link
                  href="/compress"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  <Sparkles className="w-5 h-5" />
                  Comprimir Imagen
                </Link>
                <Link
                  href="/crop"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all shadow-lg text-sm sm:text-base"
                >
                  <Scissors className="w-5 h-5" />
                  Recortar Imagen
                </Link>
                <Link
                  href="/convert"
                  className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-purple-500 text-white font-bold rounded-xl hover:bg-purple-600 transition-all shadow-lg text-sm sm:text-base"
                >
                  <Palette className="w-5 h-5" />
                  Convertir Formato
                </Link>
              </div>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
              <div className="mt-12 sm:mt-16">
                <div className="text-center mb-8 sm:mb-10">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
                    Artículos Relacionados
                  </h2>
                  <p className="text-base sm:text-lg text-gray-600">
                    Continúa aprendiendo sobre edición de imágenes
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {relatedPosts.map((relatedPost) => (
                    <Link 
                      key={relatedPost.id}
                      href={`/blog/${relatedPost.slug}`}
                      className="group"
                    >
                      <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col border-2 border-transparent hover:border-blue-500">
                        {relatedPost.image_url ? (
                          <div className="relative h-40 sm:h-48 overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100">
                            <Image 
                              src={relatedPost.image_url} 
                              alt={relatedPost.title}
                              fill
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                              quality={85}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                          </div>
                        ) : (
                          <div className="h-40 sm:h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                            <ImageIcon className="w-12 h-12 sm:w-16 sm:h-16 text-white/50" strokeWidth={1.5} />
                          </div>
                        )}

                        <div className="p-4 sm:p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500 mb-2 sm:mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>
                                {new Date(relatedPost.published_at!).toLocaleDateString('es-ES', {
                                  day: 'numeric',
                                  month: 'short'
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{Math.ceil(relatedPost.content.split(' ').length / 200)} min</span>
                            </div>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                            {relatedPost.title}
                          </h3>

                          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-1">
                            {relatedPost.excerpt || relatedPost.content.substring(0, 100) + '...'}
                          </p>

                          <div className="flex items-center gap-2 text-blue-600 text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all">
                            <span>Leer más</span>
                            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>

                {/* Ver más artículos */}
                <div className="text-center mt-8 sm:mt-10">
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 text-sm sm:text-base"
                  >
                    <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    Ver todos los artículos
                  </Link>
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </>
  );
}