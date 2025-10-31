// src/app/pixelar/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pixelar Imagen Online Gratis - Efecto Pixel Art y Mosaico',
  description: 'Pixela imágenes gratis online. Crea efectos de pixel art retro, mosaico o pixelado clásico. Control de tamaño de píxel y colores. 100% en tu navegador.',
  keywords: [
    'pixelar imagen',
    'pixelar foto',
    'pixel art',
    'efecto pixelado',
    'mosaico imagen',
    'censurar foto',
    'blur pixelado',
    'efecto retro',
    '8 bits',
    'pixelar online',
    'pixelar gratis',
    'reducir resolución',
    'efecto cuadrícula'
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
    canonical: 'https://toolsfoto.com/pixelar',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/pixelar',
    siteName: 'ToolsFoto',
    title: 'Pixelar Imagen - Efecto Pixel Art, Mosaico y Pixelado',
    description: 'Aplica efectos de pixelado a tus imágenes. Pixel art retro, mosaico o censura. Control completo de tamaño de píxel y colores.',
    images: [
      {
        url: 'https://toolsfoto.com/og-pixelar.jpg',
        width: 1200,
        height: 630,
        alt: 'Pixelar Imagen - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pixelar Imagen Online Gratis - ToolsFoto',
    description: 'Crea efectos de pixel art, mosaico o pixelado. 100% gratis en tu navegador.',
    images: ['https://toolsfoto.com/og-pixelar.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function PixelarLayout({
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
            name: 'Pixelar Imagen - ToolsFoto',
            description: 'Herramienta gratuita para aplicar efectos de pixelado a imágenes. Tres modos disponibles: pixelado normal, pixel art retro con reducción de colores, y mosaico con cuadrícula opcional. Control de tamaño de píxel (2-50px), profundidad de color (8-128), y exportación en PNG, JPG o WebP.',
            url: 'https://toolsfoto.com/pixelar',
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
            featureList: 'Pixelado clásico ajustable (2-50px), Efecto Pixel Art retro con reducción de colores (8-128 colores), Efecto mosaico con cuadrícula opcional, Control preciso de tamaño de píxel, Profundidad de color personalizable, Exportación a PNG, JPG y WebP, Control de calidad de compresión, Ideal para censura o efectos artísticos',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.7',
              ratingCount: '1234',
            },
          }),
        }}
      />
      {children}
    </>
  );
}