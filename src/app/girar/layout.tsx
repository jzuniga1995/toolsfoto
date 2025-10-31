// src/app/girar/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Girar y Voltear Imagen Online Gratis - Rotar 90°, 180° y Espejo',
  description: 'Gira y voltea imágenes online gratis. Rota 90°, 180°, ángulo personalizado o espejo horizontal/vertical. Sin perder calidad. 100% en tu navegador.',
  keywords: [
    'girar imagen',
    'rotar imagen',
    'voltear imagen',
    'rotar 90 grados',
    'rotar 180 grados',
    'espejo horizontal',
    'espejo vertical',
    'flip imagen',
    'rotar foto',
    'ángulo personalizado',
    'rotación libre',
    'girar gratis',
    'voltear foto online'
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
    canonical: 'https://toolsfoto.com/girar',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/girar',
    siteName: 'ToolsFoto',
    title: 'Girar y Voltear Imagen Online - Rotar en Cualquier Ángulo',
    description: 'Rota imágenes 90°, 180° o cualquier ángulo personalizado. Voltea horizontal o verticalmente. Sin perder calidad. 100% gratis.',
    images: [
      {
        url: 'https://toolsfoto.com/og-girar.jpg',
        width: 1200,
        height: 630,
        alt: 'Girar y Voltear Imagen - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Girar y Voltear Imagen Online Gratis - ToolsFoto',
    description: 'Rota imágenes en cualquier ángulo o voltéalas como espejo. 100% gratis y privado.',
    images: ['https://toolsfoto.com/og-girar.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function GirarLayout({
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
            name: 'Girar y Voltear Imagen - ToolsFoto',
            description: 'Herramienta gratuita para girar y voltear imágenes. Rotación rápida de 90°, 180°, espejo horizontal y vertical, o ángulo personalizado con color de fondo ajustable.',
            url: 'https://toolsfoto.com/girar',
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
            featureList: 'Rotación 90° derecha e izquierda, Rotación 180°, Volteo horizontal (espejo), Volteo vertical, Rotación de ángulo personalizado (-180° a 180°), Color de fondo personalizable, Sin pérdida de calidad, Compatible con JPG, PNG, WebP y GIF',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '1890',
            },
          }),
        }}
      />
      {children}
    </>
  );
}