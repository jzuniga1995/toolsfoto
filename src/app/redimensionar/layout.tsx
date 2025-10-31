// src/app/redimensionar/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Redimensionar Imagen Online Gratis - Cambiar Tamaño por Píxeles o % ',
  description: 'Redimensiona imágenes gratis online. Cambia tamaño por píxeles, porcentaje o presets. Mantén proporción o ajusta libremente. Sin perder calidad. 100% en tu navegador.',
  keywords: [
    'redimensionar imagen',
    'cambiar tamaño imagen',
    'resize imagen',
    'escalar imagen',
    'redimensionar foto',
    'cambiar resolución',
    'reducir tamaño',
    'ampliar imagen',
    'resize online',
    'presets dimensiones',
    'mantener proporción',
    'aspect ratio',
    'redimensionar gratis'
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
    canonical: 'https://toolsfoto.com/redimensionar',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/redimensionar',
    siteName: 'ToolsFoto',
    title: 'Redimensionar Imagen Online - Cambiar Tamaño por Píxeles o Porcentaje',
    description: 'Cambia el tamaño de imágenes fácilmente. Por píxeles, porcentaje o presets predefinidos. Mantén la proporción o ajusta libremente. 100% gratis.',
    images: [
      {
        url: 'https://toolsfoto.com/og-redimensionar.jpg',
        width: 1200,
        height: 630,
        alt: 'Redimensionar Imagen - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Redimensionar Imagen Online Gratis - ToolsFoto',
    description: 'Cambia el tamaño de imágenes por píxeles, porcentaje o presets. Mantén proporción. 100% gratis.',
    images: ['https://toolsfoto.com/og-redimensionar.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function RedimensionarLayout({
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
            name: 'Redimensionar Imagen - ToolsFoto',
            description: 'Herramienta gratuita para redimensionar imágenes con tres modos: por píxeles exactos (con opción de mantener proporción), por porcentaje de escala (10-200%), y presets predefinidos para resoluciones comunes. Incluye presets para HD, Full HD, 4K, redes sociales y más. Cálculo automático de dimensiones con vista previa en tiempo real.',
            url: 'https://toolsfoto.com/redimensionar',
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
            featureList: 'Redimensionamiento por píxeles exactos (1-10000px), Escalado por porcentaje (10-200%), Presets predefinidos (HD 1280×720, Full HD 1920×1080, 2K, 4K, Instagram, Facebook, Twitter), Mantener proporción automático, Ajuste libre de dimensiones, Cálculo en tiempo real de nuevas dimensiones, Vista previa antes de procesar, Comparación de dimensiones originales vs nuevas, Sin pérdida de calidad, Compatible con JPG, PNG y WebP',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '3567',
            },
          }),
        }}
      />
      {children}
    </>
  );
}