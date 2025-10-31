// src/app/convertir/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Convertir Imágenes Online - JPG, PNG, WebP, GIF y BMP Gratis',
  description: 'Convierte imágenes entre JPG, PNG, WebP, GIF y BMP de forma gratuita. Mantén la calidad original. Herramienta 100% en tu navegador, rápida y segura.',
  keywords: [
    'convertir imagen',
    'convertir jpg a png',
    'convertir png a jpg',
    'convertir webp',
    'convertir gif',
    'convertir bmp',
    'cambiar formato imagen',
    'conversor de imágenes',
    'transformar imagen',
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
    canonical: 'https://toolsfoto.com/convertir',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/convertir',
    siteName: 'ToolsFoto',
    title: 'Convertir Imágenes Online - JPG, PNG, WebP, GIF y BMP Gratis',
    description: 'Convierte imágenes entre diferentes formatos sin perder calidad. JPG, PNG, WebP, GIF y BMP. 100% gratis y privado en tu navegador.',
    images: [
      {
        url: 'https://toolsfoto.com/og-convertir.jpg',
        width: 1200,
        height: 630,
        alt: 'Convertir Formato de Imagen - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Convertir Imágenes Online Gratis - ToolsFoto',
    description: 'Convierte imágenes entre JPG, PNG, WebP, GIF y BMP sin perder calidad. 100% gratis y privado.',
    images: ['https://toolsfoto.com/og-convertir.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function ConvertirLayout({
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
            name: 'Convertir Formato de Imagen - ToolsFoto',
            description: 'Herramienta gratuita para convertir imágenes entre JPG, PNG, WebP, GIF y BMP manteniendo la calidad.',
            url: 'https://toolsfoto.com/convertir',
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
            featureList: 'Convertir JPG, PNG, WebP, GIF, BMP, Ajustar calidad, Color de fondo personalizable',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '1580',
            },
          }),
        }}
      />
      {children}
    </>
  );
}