import type { HtmlTagDescriptor } from 'vite';
import { siteConfig } from '../constant/site.const';

interface SiteUrlEnv {
  VITE_SITE_URL?: string;
  /** Set by Vercel at build time: the production domain, without a scheme. */
  VERCEL_PROJECT_PRODUCTION_URL?: string;
}

/** The public origin of the site, without a trailing slash. */
export function resolveSiteUrl(env: SiteUrlEnv): string {
  const vercel = env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return (env.VITE_SITE_URL || vercel || siteConfig.defaultUrl).replace(/\/+$/, '');
}

export function buildStructuredData(siteUrl: string) {
  const home = `${siteUrl}/`;
  const image = `${siteUrl}${siteConfig.ogImage.path}`;
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${home}#website`,
        url: home,
        name: siteConfig.name,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
      },
      {
        '@type': 'WebApplication',
        '@id': `${home}#app`,
        url: home,
        name: siteConfig.title,
        description: siteConfig.description,
        inLanguage: siteConfig.language,
        applicationCategory: 'EducationalApplication',
        operatingSystem: 'Any',
        browserRequirements: 'Requires JavaScript and WebGL',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'VND' },
        image,
        screenshot: image,
        featureList: siteConfig.features,
        isPartOf: { '@id': `${home}#website` },
      },
    ],
  };
}

const meta = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'meta', attrs, injectTo: 'head' });
const link = (attrs: Record<string, string>): HtmlTagDescriptor => ({ tag: 'link', attrs, injectTo: 'head' });

/** Everything a crawler reads from the head. Static HTML, because link-preview bots do not run scripts. */
export function buildHeadTags(siteUrl: string, googleSiteVerification?: string): HtmlTagDescriptor[] {
  const home = `${siteUrl}/`;
  const { ogImage } = siteConfig;
  const image = `${siteUrl}${ogImage.path}`;

  const tags: HtmlTagDescriptor[] = [
    { tag: 'title', children: siteConfig.title, injectTo: 'head' },
    meta({ name: 'description', content: siteConfig.description }),
    meta({ name: 'keywords', content: siteConfig.keywords.join(', ') }),
    meta({ name: 'author', content: siteConfig.name }),
    meta({ name: 'application-name', content: siteConfig.name }),
    meta({ name: 'apple-mobile-web-app-title', content: siteConfig.name }),
    meta({ name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' }),
    link({ rel: 'canonical', href: home }),
    link({ rel: 'alternate', hreflang: siteConfig.language, href: home }),
    link({ rel: 'alternate', hreflang: 'x-default', href: home }),

    meta({ property: 'og:type', content: 'website' }),
    meta({ property: 'og:site_name', content: siteConfig.name }),
    meta({ property: 'og:title', content: siteConfig.title }),
    meta({ property: 'og:description', content: siteConfig.description }),
    meta({ property: 'og:url', content: home }),
    meta({ property: 'og:locale', content: siteConfig.locale }),
    meta({ property: 'og:image', content: image }),
    meta({ property: 'og:image:type', content: ogImage.type }),
    meta({ property: 'og:image:width', content: String(ogImage.width) }),
    meta({ property: 'og:image:height', content: String(ogImage.height) }),
    meta({ property: 'og:image:alt', content: ogImage.alt }),

    meta({ name: 'twitter:card', content: 'summary_large_image' }),
    meta({ name: 'twitter:title', content: siteConfig.title }),
    meta({ name: 'twitter:description', content: siteConfig.description }),
    meta({ name: 'twitter:image', content: image }),
    meta({ name: 'twitter:image:alt', content: ogImage.alt }),

    {
      tag: 'script',
      attrs: { type: 'application/ld+json' },
      // "<" is escaped so the JSON can never close the script element.
      children: JSON.stringify(buildStructuredData(siteUrl)).replace(/</g, '\\u003c'),
      injectTo: 'head',
    },
  ];
  if (googleSiteVerification) {
    tags.push(meta({ name: 'google-site-verification', content: googleSiteVerification }));
  }
  return tags;
}

export function buildRobotsTxt(siteUrl: string): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

export function buildSitemapXml(siteUrl: string, lastModified: Date): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${lastModified.toISOString().slice(0, 10)}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
}

export function buildManifest(): string {
  return `${JSON.stringify(
    {
      id: '/',
      name: siteConfig.title,
      short_name: siteConfig.name,
      description: siteConfig.description,
      lang: siteConfig.language,
      dir: 'ltr',
      start_url: '/',
      scope: '/',
      display: 'standalone',
      orientation: 'any',
      background_color: siteConfig.themeColor,
      theme_color: siteConfig.themeColor,
      categories: ['education', 'games'],
      icons: [
        { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      ],
    },
    null,
    2
  )}\n`;
}
