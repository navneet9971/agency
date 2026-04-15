import { connectToDatabase } from '@/lib/mongodb';
import { createLocalizedHref } from '@/lib/navigation';

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function convertGoogleDriveUrl(url) {
  if (!url) return url;
  const driveSharePattern = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
  const match = url.match(driveSharePattern);
  if (match?.[1]) {
    return `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
  return url;
}

/**
 * Plain object safe to pass from Server → Client Components.
 */
export function serializeBlog(doc) {
  if (!doc) return null;
  const o = { ...doc };
  if (o._id != null) o._id = String(o._id);
  for (const key of ['createdAt', 'updatedAt']) {
    const v = o[key];
    if (v instanceof Date) o[key] = v.toISOString();
  }
  return o;
}

function publishedBlogMatch(slugCondition, locale) {
  const identity = { status: 'published', ...slugCondition };
  const localePart =
    locale && locale !== 'en'
      ? { $or: [{ locale }, { locale: { $exists: false } }] }
      : { $or: [{ locale: 'en' }, { locale: { $exists: false } }] };
  return { $and: [identity, localePart] };
}

export async function getPublishedBlogBySlug(rawSlug, locale) {
  const decodedSlug = decodeURIComponent(String(rawSlug || '').trim());
  if (!decodedSlug) return null;

  const { db } = await connectToDatabase();
  const coll = db.collection('blogs');

  let blog = await coll.findOne(
    publishedBlogMatch({ slug: decodedSlug }, locale)
  );

  if (!blog) {
    const re = new RegExp(`^${escapeRegex(decodedSlug)}$`, 'i');
    blog = await coll.findOne(publishedBlogMatch({ slug: re }, locale));
  }

  return blog ? serializeBlog(blog) : null;
}

export async function getRelatedPublishedBlogs(slug, locale, limit = 3) {
  const { db } = await connectToDatabase();
  const coll = db.collection('blogs');

  const statusSlug = { status: 'published', slug: { $ne: slug } };
  let filter;
  if (locale && locale !== 'en') {
    filter = {
      $and: [
        statusSlug,
        { $or: [{ locale }, { locale: { $exists: false } }] },
      ],
    };
  } else {
    filter = {
      $and: [
        statusSlug,
        { $or: [{ locale: 'en' }, { locale: { $exists: false } }] },
      ],
    };
  }

  const blogs = await coll
    .find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();

  return blogs.map(serializeBlog);
}

export function formatBlogDate(dateString, locale) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'en' ? 'en-US' : locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

const SCHEMA_LANG = {
  en: 'en-US',
  hi: 'hi-IN',
  ar: 'ar-SA',
  fr: 'fr-FR',
  es: 'es-ES',
  de: 'de-DE',
  pt: 'pt-BR',
  ru: 'ru-RU',
  ja: 'ja-JP',
  ko: 'ko-KR',
  zh: 'zh-CN',
  it: 'it-IT',
};

export function buildBlogPostingSchema(blog, locale, siteUrl) {
  const slug = blog.slug;
  const blogPath = createLocalizedHref(`/blogs/${slug}`, locale);
  const blogUrl = `${siteUrl}${blogPath}`;

  const defaultArticle = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.metaDescription || blog.excerpt || blog.title,
    image: blog.featuredImage ? [convertGoogleDriveUrl(blog.featuredImage)] : [],
    datePublished: blog.createdAt ? new Date(blog.createdAt).toISOString() : undefined,
    dateModified: blog.updatedAt
      ? new Date(blog.updatedAt).toISOString()
      : blog.createdAt
        ? new Date(blog.createdAt).toISOString()
        : undefined,
    author: {
      '@type': 'Person',
      name: blog.author || 'Swagatam Tech',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Swagatam Tech',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.jpeg`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': blogUrl,
    },
    keywords: blog.keywords || '',
    articleSection: 'Web Development',
    inLanguage: SCHEMA_LANG[locale] || 'en-US',
  };

  if (blog.customSchemaJson && String(blog.customSchemaJson).trim()) {
    try {
      return JSON.parse(blog.customSchemaJson);
    } catch {
      return defaultArticle;
    }
  }
  return defaultArticle;
}

export function buildBlogBreadcrumbSchema(blog, locale, siteUrl) {
  const slug = blog.slug;
  const blogUrl = `${siteUrl}${createLocalizedHref(`/blogs/${slug}`, locale)}`;
  const blogsIndexUrl = `${siteUrl}${createLocalizedHref('/blogs', locale)}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}${createLocalizedHref('/', locale)}`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: blogsIndexUrl,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: blog.title,
        item: blogUrl,
      },
    ],
  };
}
