// src/app/editor/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Editor de Fotos Online Gratis - Ajustar Brillo, Contraste, Filtros',
  description: 'Editor de fotos profesional online gratis. Ajusta brillo, contraste, saturación, nitidez. Aplica filtros: vintage, blanco y negro, sepia. 100% en tu navegador.',
  keywords: [
    'editor de fotos',
    'editor de imágenes online',
    'ajustar brillo',
    'ajustar contraste',
    'filtros de fotos',
    'filtros instagram',
    'filtro vintage',
    'filtro sepia',
    'blanco y negro',
    'saturación',
    'nitidez',
    'temperatura color',
    'editor gratuito',
    'herramienta de edición'
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
    canonical: 'https://toolsfoto.com/editor',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/editor',
    siteName: 'ToolsFoto',
    title: 'Editor de Fotos Online Gratis - Filtros y Ajustes Profesionales',
    description: 'Editor de fotos completo con filtros profesionales. Ajusta brillo, contraste, saturación y aplica efectos vintage, blanco y negro, sepia. 100% gratis.',
    images: [
      {
        url: 'https://toolsfoto.com/og-editor.jpg',
        width: 1200,
        height: 630,
        alt: 'Editor de Fotos Online - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Editor de Fotos Online Gratis - ToolsFoto',
    description: 'Edita fotos con filtros profesionales. Ajusta brillo, contraste, saturación. 100% gratis y privado.',
    images: ['https://toolsfoto.com/og-editor.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function EditorLayout({
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
            name: 'Editor de Fotos Online - ToolsFoto',
            description: 'Editor de fotos profesional gratuito con filtros y ajustes avanzados. Controla brillo, contraste, saturación, nitidez, temperatura y aplica filtros como vintage, sepia, blanco y negro.',
            url: 'https://toolsfoto.com/editor',
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
            featureList: 'Ajuste de brillo, contraste, saturación, nitidez, temperatura, tono, viñeta, grano, filtros vintage, blanco y negro, sepia, inversión de colores, desenfoque, rotación de color, presets profesionales',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '2340',
            },
          }),
        }}
      />
      {children}
    </>
  );
}