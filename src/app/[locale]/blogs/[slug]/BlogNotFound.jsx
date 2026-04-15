import Link from 'next/link';
import { getTranslations } from '@/lib/i18n';
import { createLocalizedHref } from '@/lib/navigation';
import Section from '@/componenets/ui/Section';
import Button from '@/componenets/ui/Button';

export default async function BlogNotFound({ locale }) {
  const messages = await getTranslations(locale);
  const b = messages.blogs || {};

  return (
    <main className="bg-white text-gray-900">
      <Section className="py-24 md:py-32">
        <div className="max-w-fullhd mx-auto text-center space-y-4">
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
            {b.notFoundTitle || 'Blog post not found'}
          </h1>
          <p className="text-sm md:text-base text-gray-500">
            {b.notFoundDescription ||
              "The article you're looking for doesn't exist or has been moved."}
          </p>
          <Button asChild>
            <Link href={createLocalizedHref('/blogs', locale)}>
              {b.backToBlogs || 'Back to all blogs'}
            </Link>
          </Button>
        </div>
      </Section>
    </main>
  );
}
