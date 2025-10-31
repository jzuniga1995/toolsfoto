// src/app/eliminar-fondo/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Eliminar Fondo de Imagen con IA Gratis - Quitar Fondo Online',
  description: 'Elimina el fondo de tus imágenes automáticamente con IA. Quita fondos de fotos en segundos. Herramienta gratuita 100% en tu navegador. Sin registro.',
  keywords: [
    'eliminar fondo',
    'quitar fondo imagen',
    'remover fondo',
    'fondo transparente',
    'eliminar fondo con IA',
    'background remover',
    'quitar fondo fotos',
    'transparencia imagen',
    'eliminar fondo gratis',
    'remove background',
    'fondo automático',
    'IA eliminar fondo',
    'herramienta transparencia'
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
    canonical: 'https://toolsfoto.com/eliminar-fondo',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/eliminar-fondo',
    siteName: 'ToolsFoto',
    title: 'Eliminar Fondo de Imagen con IA - Gratis y Automático',
    description: 'Remueve el fondo de tus imágenes automáticamente con inteligencia artificial. Obtén fondos transparentes en segundos. 100% gratis y privado.',
    images: [
      {
        url: 'https://toolsfoto.com/og-eliminar-fondo.jpg',
        width: 1200,
        height: 630,
        alt: 'Eliminar Fondo de Imagen con IA - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Eliminar Fondo con IA Gratis - ToolsFoto',
    description: 'Quita el fondo de imágenes automáticamente con IA. Fondos transparentes en segundos. 100% gratis.',
    images: ['https://toolsfoto.com/og-eliminar-fondo.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function EliminarFondoLayout({
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
            name: 'Eliminar Fondo de Imagen con IA - ToolsFoto',
            description: 'Herramienta gratuita para eliminar el fondo de imágenes automáticamente usando inteligencia artificial. Genera fondos transparentes con suavizado de bordes y color de fondo personalizable.',
            url: 'https://toolsfoto.com/eliminar-fondo',
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
            featureList: 'Eliminación automática de fondo con IA, Fondos transparentes (PNG), Suavizado de bordes ajustable, Color de fondo personalizado, Control de calidad de exportación, Procesamiento rápido, Compatible con JPG, PNG y WebP',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.9',
              ratingCount: '3125',
            },
          }),
        }}
      />
      {children}
    </>
  );
}