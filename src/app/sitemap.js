import { locales } from '@/lib/i18n';
import { connectToDatabase } from '@/lib/mongodb';

const serviceIds = ['strategy', 'ux-ui', 'development', 'cms', 'performance', 'support'];

/**
 * Load published blog slugs for the sitemap (build-time + runtime).
 * Uses MongoDB directly so blog URLs are included during `next build` (HTTP fetch to
 * baseUrl/api/blogs often fails or is skipped in CI, which left dynamic posts out of sitemap.xml).
 */
async function getPublishedBlogsForSitemap() {
  try {
    const { db } = await connectToDatabase();
    const blogs = await db
      .collection('blogs')
      .find({ status: 'published' })
      .project({ slug: 1, updatedAt: 1, createdAt: 1 })
      .toArray();

    const bySlug = new Map();
    for (const b of blogs) {
      if (!b?.slug || typeof b.slug !== 'string') continue;
      bySlug.set(b.slug, b);
    }
    return [...bySlug.values()];
  } catch (e) {
    console.warn('Sitemap: could not load blogs from database:', e?.message || e);
    return [];
  }
}

/**
 * Sitemap Generator – SEO: URLs must match actual routes (all locales in path, including /en)
 * so canonicals and sitemap align; excludes admin/redirect-only pages.
 */
export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.swagatamtech.com';

  let caseStudySlugs = [];
  try {
    const caseStudies = (await import('@/data/case-studies.json')).default;
    caseStudySlugs = Array.isArray(caseStudies) ? caseStudies.map((cs) => cs.id).filter(Boolean) : [];
  } catch {
    caseStudySlugs = [];
  }

  // Static paths (no leading locale – we add /locale for each)
  const staticPaths = [
    '',
    '/about',
    '/services',
    '/contact',
    '/blogs',
    '/portfolio',
    '/case-studies',
    '/careers',
    '/bussines-consultancy',
  ];

  const blogData = await getPublishedBlogsForSitemap();

  const entries = [];

  // One entry set per locale – URLs match actual routes (e.g. /en, /en/services)
  for (const locale of locales) {
    const localePrefix = `/${locale}`;

    for (const path of staticPaths) {
      const urlPath = path ? `${localePrefix}${path}` : localePrefix;
      entries.push({
        url: `${baseUrl}${urlPath}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [`${loc}`, `${baseUrl}/${loc}${path}`])
          ),
        },
      });
    }

    for (const serviceId of serviceIds) {
      entries.push({
        url: `${baseUrl}${localePrefix}/services/${serviceId}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [`${loc}`, `${baseUrl}/${loc}/services/${serviceId}`])
          ),
        },
      });
    }

    for (const slug of caseStudySlugs) {
      entries.push({
        url: `${baseUrl}${localePrefix}/case-studies/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [`${loc}`, `${baseUrl}/${loc}/case-studies/${slug}`])
          ),
        },
      });
    }

    for (const blog of blogData) {
      if (!blog.slug) continue;
      const slugPath = blog.slug.startsWith('/') ? blog.slug : `/${blog.slug}`;
      entries.push({
        url: `${baseUrl}${localePrefix}/blogs${slugPath}`,
        lastModified: blog.updatedAt || blog.createdAt ? new Date(blog.updatedAt || blog.createdAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((loc) => [`${loc}`, `${baseUrl}/${loc}/blogs${slugPath}`])
          ),
        },
      });
    }
  }

  return entries;
}
