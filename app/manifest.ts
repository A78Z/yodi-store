import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yodi Cosmetics - Parapharmacie en ligne',
    short_name: 'Yodi Cosmetics',
    description: 'Yodi vend des produits parapharmaceutiques et cosmétiques. Vous trouverez ici toutes sortes de produits cosmétiques à Dakar, Sénégal.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#A36F5E',
    icons: [
      {
        src: '/logo-yodi-k.png',
        sizes: 'any',
        type: 'image/png',
      },
    ],
    categories: ['shopping', 'health', 'beauty'],
    lang: 'fr',
    orientation: 'portrait',
  }
}
