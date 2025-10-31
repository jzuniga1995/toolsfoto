// src/app/layout.tsx
import type { Metadata, Viewport } from 'next'; // ← Agrega Viewport aquí
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ClientWrapper from '@/components/layout/ClientWrapper';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://toolsfoto.com'),
  title: {
    default: 'ToolsFoto - Herramientas Gratuitas para Editar Imágenes Online',
    template: '%s | ToolsFoto',
  },
  description: 'Edita, convierte, comprime y optimiza tus imágenes directamente en tu navegador. Herramientas 100% gratuitas, privadas y sin registro.',
  keywords: [
    'editar imagen',
    'comprimir imagen',
    'convertir imagen',
    'redimensionar imagen',
    'recortar imagen',
    'herramientas gratuitas',
    'editor de fotos online',
    'optimizar imágenes',
    'tools foto',
    'procesamiento local'
  ],
  authors: [{ name: 'ToolsFoto', url: 'https://toolsfoto.com' }],
  creator: 'ToolsFoto',
  publisher: 'ToolsFoto',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://toolsfoto.com',
    siteName: 'ToolsFoto',
    title: 'ToolsFoto - Herramientas Gratuitas para Editar Imágenes Online',
    description: 'Edita, convierte y optimiza tus imágenes directamente en tu navegador. 100% gratis y privado.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'ToolsFoto - Herramientas para Imágenes',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ToolsFoto - Herramientas Gratuitas para Editar Imágenes',
    description: 'Edita, convierte y optimiza tus imágenes directamente en tu navegador. 100% gratis y privado.',
    creator: '@toolsfoto',
    images: ['/og-image.jpg'],
  },
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
  verification: {
    google: 'tu-codigo-de-verificacion-google',
  },
  alternates: {
    canonical: 'https://toolsfoto.com',
  },
  category: 'Technology',
};

// ✅ AGREGA ESTO DESPUÉS DE metadata:
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        <ClientWrapper />
      </body>
    </html>
  );
}