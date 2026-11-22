import { describe, expect, it } from 'vitest';
import { siteConfig } from '../constant/site.const';
import {
  buildHeadTags,
  buildManifest,
  buildRobotsTxt,
  buildSitemapXml,
  buildStructuredData,
  resolveSiteUrl,
} from './seo';

const URL = 'https://example.test';

const content = (tags: ReturnType<typeof buildHeadTags>, key: 'name' | 'property', value: string) =>
  tags.find((tag) => tag.tag === 'meta' && tag.attrs?.[key] === value)?.attrs?.content;

describe('resolveSiteUrl', () => {
  it('prefers the explicit URL, then the Vercel production domain, then the default', () => {
    expect(resolveSiteUrl({ VITE_SITE_URL: 'https://a.test/', VERCEL_PROJECT_PRODUCTION_URL: 'b.test' })).toBe(
      'https://a.test'
    );
    expect(resolveSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: 'b.test' })).toBe('https://b.test');
    expect(resolveSiteUrl({ VITE_SITE_URL: '' })).toBe(siteConfig.defaultUrl);
  });
});

describe('buildHeadTags', () => {
  const tags = buildHeadTags(URL);

  it('allows indexing and points every URL at the canonical origin', () => {
    expect(content(tags, 'name', 'robots')).toMatch(/^index, follow/);
    expect(tags.find((tag) => tag.attrs?.rel === 'canonical')?.attrs?.href).toBe(`${URL}/`);
    expect(content(tags, 'property', 'og:url')).toBe(`${URL}/`);
    expect(content(tags, 'property', 'og:image')).toBe(`${URL}/og-image.jpg`);
    expect(content(tags, 'name', 'twitter:image')).toBe(`${URL}/og-image.jpg`);
  });

  it('carries the brand in the title and the share cards', () => {
    expect(tags.find((tag) => tag.tag === 'title')?.children).toContain('jacobhocoto');
    expect(content(tags, 'property', 'og:site_name')).toBe('jacobhocoto');
    expect(content(tags, 'name', 'twitter:card')).toBe('summary_large_image');
  });

  it('keeps the description within what search results show', () => {
    expect(siteConfig.title.length).toBeLessThanOrEqual(60);
    expect(siteConfig.description.length).toBeGreaterThanOrEqual(120);
    expect(siteConfig.description.length).toBeLessThanOrEqual(160);
  });

  it('adds the Search Console tag only when a token is configured', () => {
    expect(content(tags, 'name', 'google-site-verification')).toBeUndefined();
    expect(content(buildHeadTags(URL, 'token'), 'name', 'google-site-verification')).toBe('token');
  });

  it('embeds structured data that cannot break out of its script element', () => {
    const script = tags.find((tag) => tag.tag === 'script');
    expect(script?.children).not.toContain('<');
    expect(JSON.parse(String(script?.children))).toEqual(buildStructuredData(URL));
  });
});

describe('buildStructuredData', () => {
  it('describes a free web application that belongs to the site', () => {
    const [site, app] = buildStructuredData(URL)['@graph'];
    expect(site).toMatchObject({ '@type': 'WebSite', url: `${URL}/`, name: 'jacobhocoto' });
    expect(app).toMatchObject({
      '@type': 'WebApplication',
      isAccessibleForFree: true,
      isPartOf: { '@id': site['@id'] },
    });
  });
});

describe('crawler files', () => {
  it('robots.txt allows everything and names the sitemap', () => {
    expect(buildRobotsTxt(URL)).toBe(`User-agent: *\nAllow: /\n\nSitemap: ${URL}/sitemap.xml\n`);
  });

  it('the sitemap lists the home page with its build date', () => {
    const xml = buildSitemapXml(URL, new Date('2026-11-22T10:00:00Z'));
    expect(xml).toContain(`<loc>${URL}/</loc>`);
    expect(xml).toContain('<lastmod>2026-11-22</lastmod>');
  });

  it('the manifest is installable: name, start URL, standalone display and a maskable icon', () => {
    const manifest = JSON.parse(buildManifest());
    expect(manifest).toMatchObject({ short_name: 'jacobhocoto', start_url: '/', display: 'standalone', lang: 'vi' });
    expect(manifest.icons.map((icon: { purpose: string }) => icon.purpose)).toContain('maskable');
  });
});
