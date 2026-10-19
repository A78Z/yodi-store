import { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'
import { getVisibleUnivers } from '@/lib/catalog'

// Calculé à la demande : reflète toujours les catégories visibles en base.
export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE_URL
  const currentDate = new Date().toISOString().split('T')[0]

  // Pages statiques principales
  const staticPages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/connexion`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/inscription`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/mot-de-passe-oublie`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/profile`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/profile/commandes`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/panier`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/checkout`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/condition-dutilisations`,
      lastModified: currentDate,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Catégories et sous-catégories visibles uniquement (≥ 1 produit actif)
  const univers = await getVisibleUnivers().catch((error) => {
    console.error('Error fetching visible categories for sitemap:', error)
    return []
  })
  const categories = univers.flatMap((u) => [
    u.slug,
    ...u.subcategories.map((s) => `${u.slug}/${s.slug}`),
  ])
  const categoryPages = [
    { url: `${baseUrl}/categories`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.9 },
    ...categories.map((category) => ({
      url: `${baseUrl}/${category}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
  ]

  return [...staticPages, ...categoryPages]
}
