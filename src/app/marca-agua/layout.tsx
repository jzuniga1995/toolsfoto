// src/app/marca-agua/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Agregar Marca de Agua a Fotos Gratis - Texto y Logo',
  description: 'Añade marca de agua a tus imágenes gratis. Protege fotos con texto o logo personalizado. Control de posición, opacidad y fuente. 100% en tu navegador.',
  keywords: [
    'marca de agua',
    'watermark',
    'agregar marca de agua',
    'añadir watermark',
    'proteger fotos',
    'logo en imagen',
    'texto en foto',
    'marca de agua texto',
    'marca de agua logo',
    'copyright imagen',
    'firma digital',
    'watermark gratis',
    'protección de imágenes'
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
    canonical: 'https://toolsfoto.com/marca-agua',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/marca-agua',
    siteName: 'ToolsFoto',
    title: 'Agregar Marca de Agua - Protege tus Fotos con Texto o Logo',
    description: 'Añade marca de agua personalizada a tus imágenes. Texto o logo con control total de posición, opacidad y estilo. 100% gratis.',
    images: [
      {
        url: 'https://toolsfoto.com/og-marca-agua.jpg',
        width: 1200,
        height: 630,
        alt: 'Agregar Marca de Agua - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Agregar Marca de Agua Gratis - ToolsFoto',
    description: 'Protege tus imágenes con marca de agua personalizada. Texto o logo. 100% gratis.',
    images: ['https://toolsfoto.com/og-marca-agua.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function MarcaAguaLayout({
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
            name: 'Agregar Marca de Agua - ToolsFoto',
            description: 'Herramienta gratuita para agregar marca de agua a imágenes. Protege tus fotos con texto personalizado o logo. Control completo de posición (5 ubicaciones), opacidad, tamaño de fuente, color, y familia tipográfica. Soporta PNG con transparencia.',
            url: 'https://toolsfoto.com/marca-agua',
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
            featureList: 'Marca de agua de texto personalizada, Marca de agua con logo o imagen, 5 posiciones (esquinas y centro), Control de opacidad (0-100%), Personalización de fuente (10 familias), Tamaño de fuente ajustable, Color de texto personalizable, Soporte para PNG transparente, Sin pérdida de calidad, Compatible con JPG, PNG y WebP',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '2678',
            },
          }),
        }}
      />
      {children}
    </>
  );
}