// src/app/comprimir/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comprimir Imagen Online Gratis - Reduce Tamaño sin Perder Calidad ',
  description: 'Comprime tus imágenes JPG, PNG y WebP hasta un 80% sin perder calidad visible. Herramienta gratuita 100% en tu navegador. Sin registro, rápido y seguro.',
  keywords: [
    'comprimir imagen',
    'reducir tamaño imagen',
    'optimizar foto',
    'comprimir jpg',
    'comprimir png',
    'comprimir webp',
    'compresor de imágenes',
    'optimizar imagen web',
    'reducir peso foto',
    'herramienta gratuita'
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
    canonical: 'https://toolsfoto.com/comprimir',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/comprimir',
    siteName: 'ToolsFoto',
    title: 'Comprimir Imagen Online Gratis - Reduce Tamaño sin Perder Calidad',
    description: 'Comprime tus imágenes JPG, PNG y WebP hasta un 80% sin perder calidad visible. 100% gratis y privado en tu navegador.',
    images: [
      {
        url: 'https://toolsfoto.com/og-comprimir.jpg',
        width: 1200,
        height: 630,
        alt: 'Comprimir Imagen Online - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comprimir Imagen Online Gratis - ToolsFoto',
    description: 'Comprime tus imágenes JPG, PNG y WebP hasta un 80% sin perder calidad visible. 100% gratis y privado.',
    images: ['https://toolsfoto.com/og-comprimir.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function ComprimirLayout({
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
            name: 'Comprimir Imagen Online - ToolsFoto',
            description: 'Herramienta gratuita para comprimir imágenes JPG, PNG y WebP sin perder calidad visible.',
            url: 'https://toolsfoto.com/comprimir',
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
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1250',
            },
          }),
        }}
      />
      {children}
    </>
  );
}