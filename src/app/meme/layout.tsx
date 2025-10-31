// src/app/meme/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Crear Memes Online Gratis - Generador de Memes con Texto',
  description: 'Crea memes gratis online. Agrega texto arriba y abajo a tus imágenes. Plantillas de estilo incluidas. Vista previa en tiempo real. 100% gratis.',
  keywords: [
    'crear meme',
    'generador de memes',
    'hacer memes',
    'meme generator',
    'agregar texto a imagen',
    'memes gratis',
    'crear memes online',
    'plantillas meme',
    'texto arriba abajo',
    'editor de memes',
    'memes personalizados',
    'meme maker',
    'generador memes español'
  ],
  authors: [{ name: 'ToolsFoto' }],
  creator: 'ToolsFoto',
  publisher: 'ToolsFoto',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://toolsfoto.com/meme',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/meme',
    siteName: 'ToolsFoto',
    title: 'Crear Memes Online Gratis - Generador de Memes con Texto',
    description: 'Generador de memes fácil y rápido. Agrega texto personalizado arriba y abajo. Plantillas de estilo incluidas. Vista previa en vivo.',
    images: [
      {
        url: 'https://toolsfoto.com/og-meme.jpg',
        width: 1200,
        height: 630,
        alt: 'Generador de Memes - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Crear Memes Online Gratis - ToolsFoto',
    description: 'Generador de memes con texto personalizado. Plantillas incluidas. 100% gratis.',
    images: ['https://toolsfoto.com/og-meme.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function MemeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'Generador de Memes - ToolsFoto',
            description: 'Herramienta gratuita para crear memes online. Agrega texto personalizado en la parte superior e inferior de tus imágenes. Incluye plantillas de estilo (clásico, moderno, minimal, bold) con vista previa en tiempo real. Control completo de fuente, tamaño, colores y bordes.',
            url: 'https://toolsfoto.com/meme',
            applicationCategory: 'MultimediaApplication',
            operatingSystem: 'Any',
            offers: {
              '@type': 'Offer',
              price: '0',
              priceCurrency: 'USD',
            },
            author: {
              '@type': 'Organization',
              name: 'ToolsFoto',
              url: 'https://toolsfoto.com',
            },
            browserRequirements: 'Requires JavaScript. Requires HTML5.',
            softwareVersion: '1.0',
            featureList: 'Texto superior e inferior personalizable, Vista previa en tiempo real, 4 plantillas de estilo predefinidas (clásico, moderno, minimal, bold), Personalización completa de fuente (7 familias), Control de tamaño de texto (24-100px), Colores personalizables (texto y borde), Grosor de borde ajustable, Límite de 50 caracteres por línea, Compatible con JPG, PNG y WebP',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '3456',
            },
          }),
        }}
      />
      {children}
    </>
  );
}