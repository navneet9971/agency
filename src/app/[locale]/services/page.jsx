"use client";

import React, { use } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Section from "@/componenets/ui/Section";
import Button from "@/componenets/ui/Button";
import { useRouter } from "next/navigation";
import SEOBacklinks from "@/componenets/global/SEOBacklinks";
import { useLocaleData } from "@/lib/use-locale-data";
import { useTranslations } from "@/lib/translations-context";
import { createLocalizedHref, getCurrentLocale } from "@/lib/navigation";
import { usePathname } from "next/navigation";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, delay },
});

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.9 },
  animate: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.6, 
      delay: i * 0.2,
      ease: [0.22, 1, 0.36, 1]
    },
  }),
};

const imageVariants = {
  initial: { opacity: 0, scale: 1.1 },
  animate: (i) => ({
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.8, 
      delay: i * 0.2 + 0.1,
      ease: [0.22, 1, 0.36, 1]
    },
  }),
};

const ServicesPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = getCurrentLocale(pathname);
  const t = useTranslations();
  const { data: pageData, loading } = useLocaleData('services-page');
  
  // Ensure data is available
  const hero = pageData?.hero || {};
  const services = pageData?.services?.items || [];
  const engagementModels = pageData?.engagementModels?.items || [];
  const faq = pageData?.faq || {};
  const cta = pageData?.cta || {};

  // Map service IDs to SEO-friendly image names (all 6 images)
  const serviceImageMap = {
    "strategy": "seo-optimization.jpg",
    "ux-ui": "ui-ux-design.jpg",
    "development": "content-writer.jpg",
    "cms": "social-media-management.jpg",
    "performance": "website-optimization.jpg",
    "support": "video-shoot-and-editing.jpg"
  };
  return (
    <main className="bg-white text-gray-900">
      {/* HERO */}
      <Section
        id="services-hero"
        aria-label="Website development services"
        className="pt-4 sm:pt-6 md:pt-8 pb-12 sm:pb-16 md:pb-20"
      >
        <div className="grid gap-8 sm:gap-10 md:grid-cols-2 items-center">
          {/* Left text */}
          <motion.div {...fadeUp(0)} className="space-y-6 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-gray-600 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {hero?.badge || "SERVICES"}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[2.7rem] font-semibold tracking-tight text-gray-900">
              {hero?.title || "Website Development Services"}{" "}
              <span className="inline-block border-b border-gray-300 pb-1">
                {hero?.titleHighlight || "Fast Performance Websites Built for Business Growth"}
              </span>
            </h1>

            <p className="text-xs sm:text-sm md:text-base text-gray-500 leading-relaxed max-w-xl">
              {hero?.description ? (
                <>
                  {hero.description.split(/(\{websiteServices\}|\{websites\}|\{caseStudies\})/).map((part, idx) => {
                    if (part === '{websiteServices}') {
                      return <Link key={idx} href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{hero.websiteServices || "Website services"}</Link>;
                    } else if (part === '{websites}') {
                      return <Link key={idx} href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{hero.websites || "websites"}</Link>;
                    } else if (part === '{caseStudies}') {
                      return <Link key={idx} href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{hero.caseStudies || "case studies"}</Link>;
                    }
                    return <span key={idx}>{part}</span>;
                  })}
                </>
              ) : (
                <>
                  <Link href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">Website services</Link> built to generate leads, sales, and real growth. Strategy, design, and development focused on performance — fast <Link href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">websites</Link> that convert visitors into customers. See our <Link href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">case studies</Link> for real results. 4-6 week typical launch.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Button
               onClick={() => router.push(createLocalizedHref("/contact", currentLocale))}
              >
                {hero?.ctaPrimary || "Get a free website plan"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push(createLocalizedHref("/portfolio", currentLocale))}
              >
                {hero?.ctaSecondary || "View real projects"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-6 pt-2 text-xs md:text-sm text-gray-500">
              <div>
                <div className="font-semibold text-gray-900 text-base">
                  {hero?.stats?.projects?.value || "10+"}
                </div>
                <div>{hero?.stats?.projects?.label || "projects delivered"}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-base">
                  {hero?.stats?.timeline?.value || "4–6 weeks"}
                </div>
                <div>{hero?.stats?.timeline?.label || "weeks typical launch"}</div>
              </div>
              <div>
                <div className="font-semibold text-gray-900 text-base">
                  {hero?.stats?.focus?.value || "Performance-focused"}
                </div>
                <div>{hero?.stats?.focus?.label || "Performance-first builds"}</div>
              </div>
            </div>
          </motion.div>

          {/* Right visual */}
          <motion.div {...fadeUp(0.1)} className="relative">
            <div className="pointer-events-none absolute -top-10 -right-4 h-40 w-40 rounded-full bg-gradient-to-tr from-gray-100 via-gray-50 to-white blur-3xl" />
            <div className="relative rounded-3xl border border-gray-100 bg-white/80 backdrop-blur p-6 md:p-7 shadow-[0_20px_50px_rgba(15,23,42,0.08)] space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
                    {hero?.typicalProject?.label || "Typical project"}
                  </div>
                  <div className="text-sm font-medium text-gray-900">
                    {hero?.typicalProject?.title || "What a typical website project includes"}
                  </div>
                </div>
                <span className="text-[11px] rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-emerald-700">
                  {hero?.typicalProject?.badge || "4–6 weeks"}
                </span>
              </div>

              <ul className="space-y-3 text-xs md:text-sm text-gray-600">
                {(hero?.typicalProject?.items || []).map((item, idx) => (
                  <li key={idx}>• {item}</li>
                ))}
              </ul>

              <p className="text-[11px] text-gray-400">
                {hero?.typicalProject?.footer || "No templates. No copy-paste packages. Built for your needs."}
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* SERVICES GRID */}
      <Section
        id="services-list"
        aria-label="Detailed services"
        className="py-12 sm:py-16 md:py-20 bg-white relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_55%)]" />
        <div className="max-w-fullhd mx-auto space-y-6 sm:space-y-8">
          <motion.div
            {...fadeUp(0)}
            className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
          >
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                {pageData?.services?.badge || "What we do"}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
                {pageData?.services?.title || "Website Development Services Built for Fast Performance and Business Growth"}
              </h2>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-500 max-w-2xl">
                {pageData?.services?.description ? (
                  <>
                    {pageData.services.description.split(/(\{service\}|\{website\}|\{caseStudies\}|\{webDevelopment\})/).map((part, idx) => {
                      if (part === '{service}') {
                        return <Link key={idx} href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.services.service || "service"}</Link>;
                      } else if (part === '{website}') {
                        return <Link key={idx} href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.services.website || "website"}</Link>;
                      } else if (part === '{caseStudies}') {
                        return <Link key={idx} href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.services.caseStudies || "case studies"}</Link>;
                      } else if (part === '{webDevelopment}') {
                        return <Link key={idx} href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.services.webDevelopment || "web development"}</Link>;
                      }
                      return <span key={idx}>{part}</span>;
                    })}
                  </>
                ) : (
                  <>
                    Choose a single <Link href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">service</Link> or partner with us end-to-end. Either way, you get a senior team focused on performance and conversions. Everything you need to design, build and grow your <Link href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">website</Link>. See our <Link href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">case studies</Link> for examples of our <Link href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">web development</Link> work.
                  </>
                )}
              </p>
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2"
          >
            {services.map((service, index) => (
              <Link
                key={service.id}
                href={createLocalizedHref(`/services/${service.id}`, currentLocale)}
                className="block"
              >
                <motion.article
                  custom={index}
                  initial="initial"
                  whileInView="animate"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  className="group relative overflow-hidden rounded-2xl sm:rounded-3xl border border-gray-100 bg-white shadow-[0_18px_45px_rgba(15,23,42,0.06)] cursor-pointer"
                >
                  <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)]">
                    {/* Left: Copy */}
                    <div className="p-5 sm:p-6 md:p-7">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] sm:text-[11px] uppercase tracking-[0.18em] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          {service.tag}
                        </span>
                        <span className="inline-flex rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] sm:text-[11px] text-gray-600">
                          {service.meta}
                        </span>
                      </div>

                      <h3 className="mt-4 text-base sm:text-lg md:text-xl font-semibold tracking-tight text-gray-900">
                        {service.title}
                      </h3>

                      <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                        {service.summary}
                      </p>

                      <div className="mt-4 flex items-center justify-between gap-4">
                        <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                          <span className="font-medium text-gray-800">{pageData?.services?.outcome || "Outcome:"}</span>{" "}
                          <span>{service.outcome}</span>
                        </div>
                        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-medium text-emerald-700">
                          <span>Explore</span>
                          <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Image */}
                    <div className="relative md:min-h-[240px] min-h-[200px]">
                      {serviceImageMap[service.id] ? (
                        <motion.div
                          className="absolute inset-0 z-0"
                          custom={index}
                          initial="initial"
                          whileInView="animate"
                          viewport={{ once: true, amount: 0.2 }}
                          variants={imageVariants}
                        >
                          <Image
                            src={`/service/${serviceImageMap[service.id]}`}
                            alt={service.title || "Service image"}
                            fill
                            className="object-cover md:rounded-tr-3xl md:rounded-br-3xl group-hover:scale-[1.02] transition-transform duration-300"
                            sizes="(max-width: 768px) 100vw, 50vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent md:rounded-tr-3xl md:rounded-br-3xl" />
                        </motion.div>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-white md:rounded-tr-3xl md:rounded-br-3xl" />
                      )}

                      {/* Hover details on image */}
                      <div className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-250 md:rounded-tr-3xl md:rounded-br-3xl">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent md:rounded-tr-3xl md:rounded-br-3xl" />
                        <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 pointer-events-none">
                          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-white/70">
                            {service.tag}
                          </p>
                          <p className="mt-2 text-xs sm:text-sm text-white/90 leading-relaxed line-clamp-3">
                            {service.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </motion.div>
        </div>
      </Section>   
   
      {/* ENGAGEMENT MODELS */}
      <Section
        aria-label="How we work"
        className="py-12 sm:py-16 md:py-20 bg-gray-50"
      >
        <div className="max-w-fullhd mx-auto space-y-6 sm:space-y-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
              {pageData?.engagementModels?.badge || "How we work"}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
              {pageData?.engagementModels?.title || "Website Development Services Built for Fast Performance Across Devices"}
            </h2>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm md:text-base text-gray-500">
              {pageData?.engagementModels?.description ? (
                <>
                  {pageData.engagementModels.description.split(/(\{portfolio\}|\{caseStudies\}|\{webDevelopment\})/).map((part, idx) => {
                    if (part === '{portfolio}') {
                      return <Link key={idx} href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.engagementModels.portfolio || "portfolio"}</Link>;
                    } else if (part === '{caseStudies}') {
                      return <Link key={idx} href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.engagementModels.caseStudies || "case studies"}</Link>;
                    } else if (part === '{webDevelopment}') {
                      return <Link key={idx} href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{pageData.engagementModels.webDevelopment || "website development"}</Link>;
                    }
                    return <span key={idx}>{part}</span>;
                  })}
                </>
              ) : (
                <>
                  Whether you're launching something new or leveling up what you already have, we'll suggest the model that fits your stage, budget and team. Check out our <Link href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">portfolio</Link> to see examples, or read our <Link href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">case studies</Link> for detailed <Link href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">website development</Link> results.
                </>
              )}
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {engagementModels.map((model, index) => (
              <div
                key={model.title}
                className="relative rounded-3xl border border-gray-100 bg-white/80 backdrop-blur p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] flex flex-col"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                  Option {String(index + 1).padStart(2, "0")}
                </div>
                <h3 className="text-sm md:text-base font-semibold text-gray-900 mb-2">
                  {model.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed mb-3">
                  {model.description}
                </p>
                <ul className="space-y-1 text-[11px] md:text-xs text-gray-500 mb-4">
                  {model.bullets.map((b) => (
                    <li key={b}>• {b}</li>
                  ))}
                </ul>
                <div className="mt-auto pt-2 text-[11px] text-gray-400">
                  {pageData?.engagementModels?.footer || "We'll recommend this if it fits your goals in our first call."}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* MICRO FAQ BLOCK */}
      <Section
        aria-label="Service FAQs"
        className="py-10 sm:py-12 md:py-14 lg:py-16 bg-white"
      >
        <div className="max-w-fullhd mx-auto space-y-4 sm:space-y-6">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
              {faq?.badge || "FAQs"}
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
              {faq?.title || "Frequently asked questions about our services."}
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 text-xs sm:text-sm text-gray-600"
          >
            {(faq?.items || []).map((item, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-semibold text-gray-900 text-sm">
                  {item.question}
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  {item.answer}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section
        aria-label="Service page final CTA"
        className="py-16 md:py-20 bg-gray-50"
      >
        <motion.div
          {...fadeUp(0)}
          className="max-w-fullhd mx-auto text-center"
        >
          <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
            {cta?.badge || "Next step"}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900 mb-3">
            {cta?.title || "Ready to build a website that delivers results?"}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl mx-auto mb-4 sm:mb-6">
            {cta?.description || "One short call. Clear next steps. No pressure."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
               onClick={() => router.push(createLocalizedHref("/contact", currentLocale))}
            >
              {cta?.primary || "Get a free website plan"}
            </Button>
            <Button
              variant="ghost"
              onClick={() => router.push(createLocalizedHref("/case-studies", currentLocale))}
            >
              {cta?.secondary || "View case studies"}
            </Button>
          </div>
        </motion.div>
      </Section>
      <SEOBacklinks />
    </main>
  );
};

export default ServicesPage;
