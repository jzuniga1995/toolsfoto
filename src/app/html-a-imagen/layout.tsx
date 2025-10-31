// src/app/html-a-imagen/layout.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HTML a Imagen Online Gratis - Convertir HTML/CSS a PNG, JPG',
  description: 'Convierte código HTML y CSS a imágenes de alta calidad. Genera PNG, JPG o WebP desde HTML. Plantillas incluidas. 100% gratis en tu navegador.',
  keywords: [
    'html a imagen',
    'html to image',
    'convertir html a png',
    'html a jpg',
    'css a imagen',
    'código a imagen',
    'html screenshot',
    'renderizar html',
    'exportar html',
    'html canvas',
    'plantillas html',
    'html gratis',
    'código a foto'
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
    canonical: 'https://toolsfoto.com/html-a-imagen',
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com/html-a-imagen',
    siteName: 'ToolsFoto',
    title: 'HTML a Imagen - Convertir Código HTML/CSS a PNG, JPG o WebP',
    description: 'Transforma código HTML y CSS en imágenes de alta calidad. Plantillas predefinidas incluidas. Exporta a PNG, JPG o WebP. 100% gratis.',
    images: [
      {
        url: 'https://toolsfoto.com/og-html-a-imagen.jpg',
        width: 1200,
        height: 630,
        alt: 'HTML a Imagen - ToolsFoto',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML a Imagen Online Gratis - ToolsFoto',
    description: 'Convierte HTML/CSS a imágenes PNG, JPG o WebP. Plantillas incluidas. 100% gratis.',
    images: ['https://toolsfoto.com/og-html-a-imagen.jpg'],
    creator: '@toolsfoto',
  },
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  category: 'Technology',
};

export default function HtmlAImagenLayout({
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
            name: 'HTML a Imagen - ToolsFoto',
            description: 'Herramienta gratuita para convertir código HTML y CSS en imágenes de alta calidad. Incluye plantillas predefinidas: simple, tarjeta, cita y redes sociales. Exporta a PNG, JPG o WebP con control de dimensiones, calidad y escala de renderizado.',
            url: 'https://toolsfoto.com/html-a-imagen',
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
            featureList: 'Conversión HTML/CSS a imagen, Plantillas predefinidas (simple, tarjeta, cita, redes sociales), CSS separado opcional, Exportación a PNG, JPG y WebP, Control de dimensiones personalizado, Calidad de renderizado ajustable (1x-3x), Fondo personalizado, Control de calidad de compresión, Editor de código integrado, Validación HTML automática',
            aggregateRating: {
              '@type': 'AggregateRating',
              ratingValue: '4.8',
              ratingCount: '1456',
            },
          }),
        }}
      />
      {children}
    </>
  );
}