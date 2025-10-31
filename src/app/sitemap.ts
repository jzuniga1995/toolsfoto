import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/comprimir',
    '/convertir',
    '/editor',
    '/eliminar-fondo',
    '/girar',
    '/html-a-imagen',
    '/marca-agua',
    '/meme',
    '/pixelar',
    '/recortar',
    '/redimensionar',
  ]

  return routes.map((route) => ({
    url: `https://toolsfoto.com${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}