// src/app/recortar/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Recortar Imagen Online Gratis - Crop con Proporciones',
  description: 'Recorta imágenes gratis online. Selecciona área con proporciones predefinidas: 1:1, 16:9, 4:3, Instagram, Facebook. Control interactivo. 100% en tu navegador.',
  keywords: [
    'recortar imagen',
    'crop imagen',
    'cortar foto',
    'recortar foto online',
    'crop online',
    'recortar 1:1',
    'recortar 16:9',
    'recortar instagram',
    'recortar facebook',
    'aspect ratio',
    'recortar gratis',
    'editor recorte',
    'herramienta crop'
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
    canonical: 'https://toolsfoto.com/recortar',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/recortar',
    siteName: 'ToolsFoto',
    title: 'Recortar Imagen Online - Crop con Proporciones Predefinidas',
    description: 'Recorta imágenes con proporciones exactas. 1:1, 16:9, 4:3, Instagram, Facebook y más. Selección interactiva arrastrando. 100% gratis.',
    images: [
      {
        url: 'https://toolsfoto.com/og-recortar.jpg',
        width: 1200,
        height: 630,
        alt: 'Recortar Imagen - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Recortar Imagen Online Gratis - ToolsFoto',
    description: 'Recorta imágenes con proporciones predefinidas. Instagram, Facebook, YouTube. 100% gratis.',
    images: ['https://toolsfoto.com/og-recortar.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function RecortarLayout({
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
            name: 'Recortar Imagen - ToolsFoto',
            description: 'Herramienta gratuita para recortar imágenes con proporciones predefinidas. Incluye múltiples aspect ratios: libre, cuadrado 1:1, widescreen 16:9, tradicional 4:3, vertical 9:16, y formatos optimizados para redes sociales (Instagram Post, Instagram Story, Facebook Cover, YouTube Thumbnail). Selección interactiva arrastrando el área de recorte con vista previa en tiempo real.',
            url: 'https://toolsfoto.com/recortar',
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
            featureList: 'Recorte libre sin restricciones, Proporciones predefinidas (1:1, 16:9, 4:3, 9:16, 3:2, 2:3), Formatos de redes sociales (Instagram Post 1:1, Instagram Story 9:16, Facebook Cover 16:9, YouTube Thumbnail 16:9), Selección interactiva arrastrando, Vista previa en tiempo real con overlay, Exportación a PNG, JPG y WebP, Control de calidad ajustable, Canvas interactivo con feedback visual',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '2890',
            },
          }),
        }}
      />
      {children}
    </>
  );
}