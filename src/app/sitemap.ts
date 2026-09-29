import type { MetadataRoute } from 'next'
import { SITE_CONFIG } from '@/site.config'

const ROUTES = ['/', '/understanding-the-experience/', '/meet-the-team/', '/book-now/', '/faqs/']

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map((path) => ({
    url: `${SITE_CONFIG.url}${path}`,
    changeFrequency: 'monthly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
