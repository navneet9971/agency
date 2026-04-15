import Image from 'next/image';
import Link from 'next/link';
import Section from '@/componenets/ui/Section';
import StructuredData from '@/componenets/global/StructuredData';
import SocialShare from '@/componenets/global/SocialShare';
import Contact from '@/componenets/Contact';
import SEOBacklinks from '@/componenets/global/SEOBacklinks';
import BlogNotFound from './BlogNotFound';
import { getTranslations } from '@/lib/i18n';
import { createLocalizedHref } from '@/lib/navigation';
import {
  getPublishedBlogBySlug,
  getRelatedPublishedBlogs,
  convertGoogleDriveUrl,
  formatBlogDate,
  buildBlogPostingSchema,
  buildBlogBreadcrumbSchema,
} from '@/lib/blog-server';

export const revalidate = 3600;

export default async function BlogDetailPage({ params }) {
  const { locale, slug: rawSlug } = await params;
  const slug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;

  if (!slug) {
    return <BlogNotFound locale={locale} />;
  }

  const blog = await getPublishedBlogBySlug(slug, locale);
  if (!blog) {
    return <BlogNotFound locale={locale} />;
  }

  const [relatedBlogs, messages] = await Promise.all([
    getRelatedPublishedBlogs(blog.slug, locale, 3),
    getTranslations(locale),
  ]);

  const t = messages.blogs || {};
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.swagatamtech.com';
  const articleSchema = buildBlogPostingSchema(blog, locale, siteUrl);
  const breadcrumbSchema = buildBlogBreadcrumbSchema(blog, locale, siteUrl);

  const sharePath = createLocalizedHref(`/blogs/${blog.slug}`, locale);
  const keywordFirst =
    typeof blog.keywords === 'string' && blog.keywords.split(',').length > 0
      ? blog.keywords.split(',')[0].trim()
      : '';

  return (
    <main className="bg-white text-gray-900">
      <StructuredData data={articleSchema} />
      <StructuredData data={breadcrumbSchema} />

      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(209,213,219,0.35),_transparent_65%)]" />

        <Section className="pt-8 sm:pt-10 md:pt-16 pb-12 sm:pb-16 md:pb-20 relative z-[1]">
          <div className="max-w-fullhd mx-auto space-y-6 sm:space-y-8">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gray-500">
              <Link
                href={createLocalizedHref('/blogs', locale)}
                className="hover:text-gray-900 transition-colors"
              >
                {t.title || 'Blog'}
              </Link>
              <span className="h-[1px] w-6 bg-gray-300" />
              <span className="line-clamp-1">{blog.title}</span>
            </div>

            <div className="grid gap-8 sm:gap-10 md:grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-start">
              <div className="space-y-6">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[2.7rem] font-semibold tracking-tight text-gray-900">
                  {blog.title}
                </h1>

                {blog.excerpt ? (
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl leading-relaxed">
                    {blog.excerpt}. This article covers {blog.title.toLowerCase()} and provides
                    practical insights for web development and design.
                  </p>
                ) : null}

                <div className="flex flex-wrap gap-3 text-[11px] md:text-xs text-gray-600">
                  {blog.createdAt ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {formatBlogDate(blog.createdAt, locale)}
                    </div>
                  ) : null}
                  {blog.author ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1">
                      By {blog.author}
                    </div>
                  ) : null}
                  {keywordFirst ? (
                    <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/80 px-3 py-1">
                      {keywordFirst}
                    </div>
                  ) : null}
                </div>

                <div className="pt-4">
                  <SocialShare
                    url={sharePath}
                    title={blog.title}
                    description={blog.excerpt || blog.title}
                    variant="compact"
                  />
                </div>
              </div>

              {blog.featuredImage ? (
                <div className="relative rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-[0_22px_55px_rgba(15,23,42,0.12)] overflow-hidden">
                  <div className="relative h-60 md:h-72 lg:h-80">
                    <Image
                      src={convertGoogleDriveUrl(blog.featuredImage)}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(min-width:1024px) 40vw, 100vw"
                      priority
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </Section>
      </section>

      {blog.content ? (
        <Section className="py-10 sm:py-12 md:py-14 lg:py-18 bg-white">
          <div className="max-w-fullhd mx-auto">
            <article
              className="prose prose-sm sm:prose-base md:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-ul:text-gray-600 prose-ol:text-gray-600 blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </div>
        </Section>
      ) : (
        <Section className="py-10 sm:py-12 md:py-14 lg:py-18 bg-white">
          <div className="max-w-fullhd mx-auto text-center">
            <p className="text-sm text-gray-500">
              Content is being prepared. Please check back soon.
            </p>
          </div>
        </Section>
      )}

      {relatedBlogs.length > 0 ? (
        <Section className="py-10 sm:py-12 md:py-14 lg:py-18 bg-gray-50">
          <div className="max-w-fullhd mx-auto space-y-6 sm:space-y-8">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-2">
                {t.relatedArticles || 'Related articles'}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
                {t.moreFromBlog || 'More from our blog'}
              </h2>
            </div>

            <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
              {relatedBlogs.map((relatedBlog, index) => (
                <article
                  key={relatedBlog._id || String(index)}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white/80 backdrop-blur-sm shadow-[0_18px_40px_rgba(15,23,42,0.04)] transition-transform hover:-translate-y-1"
                >
                  <Link
                    href={createLocalizedHref(`/blogs/${relatedBlog.slug}`, locale)}
                    className="flex flex-col h-full"
                  >
                    {relatedBlog.featuredImage ? (
                      <div className="relative h-40 md:h-44 overflow-hidden">
                        <Image
                          src={convertGoogleDriveUrl(relatedBlog.featuredImage)}
                          alt={relatedBlog.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      </div>
                    ) : null}

                    <div className="flex flex-1 flex-col px-4 pb-4 pt-3 md:px-5 md:pb-5 md:pt-4">
                      <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2 line-clamp-2">
                        {relatedBlog.title}
                      </h3>
                      {relatedBlog.excerpt ? (
                        <p className="text-xs md:text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
                          {relatedBlog.excerpt}
                        </p>
                      ) : null}
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-800 group-hover:text-black group-hover:gap-1.5 transition-all mt-auto">
                        {t.readArticle || 'Read article'}
                        <span className="text-xs">↗</span>
                      </span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </Section>
      ) : null}

      <Contact pageName={`Blog: ${blog.slug}`} />
      <SEOBacklinks />
    </main>
  );
}
