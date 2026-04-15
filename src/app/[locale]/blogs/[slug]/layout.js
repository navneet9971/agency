import { connectToDatabase } from '@/lib/mongodb';
import { generateArticleMetadata as generateSEO } from '@/lib/seo';
import { locales } from '@/lib/i18n';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swagatamtech.com';

/** ISR: refresh metadata periodically so titles/descriptions stay aligned with CMS. */
export const revalidate = 3600;

export async function generateMetadata({ params }) {
  try {
    const { slug, locale } = await params;
    const { db } = await connectToDatabase();
    
    // Build query with locale support
    let query = { slug, status: 'published' };
    
    // Add locale filter - prefer locale-specific blog, but fallback to blogs without locale
    if (locale && locale !== 'en') {
      query.$or = [
        { ...query, locale: locale },
        { ...query, locale: { $exists: false } } // Fallback to blogs without locale
      ];
    } else {
      // For English, prefer 'en' locale or no locale field
      query.$or = [
        { ...query, locale: 'en' },
        { ...query, locale: { $exists: false } }
      ];
    }
    
    const blog = await db.collection('blogs').findOne(query);

    if (!blog) {
      return {
        title: 'Blog Post Not Found | Swagatam Tech',
        description: 'The blog post you are looking for does not exist.',
      };
    }

    const blogUrl = `/${locale}/blogs/${slug}`;
    
    // Use SEO utility for consistent metadata generation
    const keywords = blog.keywords 
      ? (typeof blog.keywords === 'string' ? blog.keywords.split(',').map(k => k.trim()) : blog.keywords)
      : [];
    
    // Generate hreflang alternates
    const alternates = {
      canonical: `${siteUrl}${blogUrl}`,
      languages: {},
    };

    for (const loc of locales) {
      alternates.languages[loc] = `${siteUrl}/${loc}/blogs/${slug}`;
    }

    // Map locale to OpenGraph locale format
    const ogLocaleMap = {
      en: 'en_US',
      hi: 'hi_IN',
      ar: 'ar_SA',
      fr: 'fr_FR',
      es: 'es_ES',
      de: 'de_DE',
      pt: 'pt_BR',
      ru: 'ru_RU',
      ja: 'ja_JP',
      ko: 'ko_KR',
      zh: 'zh_CN',
      it: 'it_IT',
    };

    const baseMetadata = generateSEO({
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || blog.title,
      keywords,
      path: blogUrl,
      image: blog.featuredImage || '/logo.jpeg',
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      author: blog.author || 'Swagatam Tech',
      section: 'Web Development',
      noindex: blog.status !== 'published',
    });

    return {
      ...baseMetadata,
      alternates: {
        ...baseMetadata.alternates,
        ...alternates,
      },
      openGraph: {
        ...baseMetadata.openGraph,
        locale: ogLocaleMap[locale] || 'en_US',
        alternateLocale: locales.filter(l => l !== locale).map(l => ogLocaleMap[l] || l),
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Blog Post | Swagatam Tech',
      description: 'Read our latest blog post.',
    };
  }
}

export default function BlogSlugLayout({ children }) {
  return children;
}

