import { Helmet } from 'react-helmet'
import { seoConfig } from '@/constants/seo'

interface SeoProps {
  title: string
  description?: string
  image?: string
  pathname?: string
  type?: 'website' | 'article'
  robots?: string
  locale?: string
}

export default function Seo({
  title,
  description,
  image,
  pathname,
  type = 'website',
  robots = 'index,follow',
  locale = seoConfig.locale
}: SeoProps) {
  const metaDescription = description || seoConfig.description
  const metaImage = image || seoConfig.image
  const origin = typeof window !== 'undefined' ? window.location.origin : seoConfig.url
  const canonical = pathname ? `${origin}${pathname}` : origin

  return (
    <Helmet>
      <title>{title}</title>
      <meta name='description' content={metaDescription} />
      <link rel='canonical' href={canonical} />
      <meta property='og:type' content={type} />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={metaDescription} />
      <meta property='og:locale' content={locale} />
      {metaImage && <meta property='og:image' content={metaImage} />}
      <meta name='twitter:card' content='summary_large_image' />
      <meta name='twitter:title' content={title} />
      <meta name='twitter:description' content={metaDescription} />
      {metaImage && <meta name='twitter:image' content={metaImage} />}
      <meta name='robots' content={robots} />
    </Helmet>
  )
}
