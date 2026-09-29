import type { Metadata } from 'next'
import { SITE_CONFIG } from '@/site.config'
import type { Meta } from '@/content/types'

/** Meta titles in the copy doc already carry the brand, so they are applied as absolute titles. */
export function pageMetadata(meta: Meta, path: string, opts: { noindex?: boolean; image?: string } = {}): Metadata {
  const url = `${SITE_CONFIG.url}${path}`
  const image = opts.image ? `${SITE_CONFIG.url}${opts.image}` : `${SITE_CONFIG.url}/images/home-hero-lamp.webp`
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: url },
    openGraph: {
      type: 'website',
      locale: 'en_AU',
      url,
      siteName: SITE_CONFIG.name,
      title: meta.title,
      description: meta.description,
      images: [{ url: image }],
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
  }
}

/**
 * Organisation schema built only from confirmed details. Placeholder values ([Phone] and so on) are left out,
 * so nothing unconfirmed is published to search engines. Add Dentist/LocalBusiness fields once the practice
 * location, phone and hours are confirmed.
 */
export function organisationSchema() {
  const isReal = (v: string) => v && !/\[[^\]]+\]/.test(v)
  const { phone, email, address } = SITE_CONFIG.contact
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    description: 'A nervous-system-aware approach to dental care.',
  }
  if (isReal(phone)) data.telephone = phone
  if (isReal(email)) data.email = email
  if (isReal(address)) data.address = address
  return data
}
