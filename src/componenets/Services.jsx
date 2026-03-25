"use client";
import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Section from "./ui/Section";
import Button from "./ui/Button";
import { useLocaleData } from "@/lib/use-locale-data";
import { useTranslations } from "@/lib/translations-context";
import { createLocalizedHref, getCurrentLocale } from "@/lib/navigation";
import { usePathname } from "next/navigation";

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

// Map home/legacy service IDs to detail page IDs (so card clicks open the right page)
const SERVICE_ID_TO_DETAIL = {
  design: "ux-ui",
  maintenance: "support",
};

const Services = () => {
  const pathname = usePathname();
  const currentLocale = getCurrentLocale(pathname);
  const t = useTranslations();
  const { data: pageData, loading } = useLocaleData('services-page');
  const servicesList = pageData?.services?.items || [];

  // Map service IDs to SEO-friendly image names (covers both services.json and services-page IDs)
  const serviceImageMap = {
    strategy: "seo-optimization.jpg",
    design: "ui-ux-design.jpg",
    "ux-ui": "ui-ux-design.jpg",
    development: "content-writer.jpg",
    cms: "social-media-management.jpg",
    performance: "website-optimization.jpg",
    support: "video-shoot-and-editing.jpg",
    maintenance: "website-optimization.jpg",
  };

  // Link href: use detail-page ID so every card opens a valid service page
  const getServiceHref = (service) => {
    const detailId = SERVICE_ID_TO_DETAIL[service.id] || service.id;
    return createLocalizedHref(`/services/${detailId}`, currentLocale);
  };

  return (
    <Section
      id="services"
      aria-label="Services we offer"
      className="py-10 sm:py-12 md:py-14 lg:py-16 bg-white"
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_55%)]" />
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 sm:gap-6 mb-7 sm:mb-9 md:mb-10 lg:mb-12">
        <div className="space-y-2 sm:space-y-3 max-w-6xl">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] text-gray-500">
            {t?.services?.badge || "Services"}
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight text-gray-900">
            {t?.services?.title || "Website Development Services Built for Fast Performance and Business Growth"}
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-gray-500 max-w-4xl">
            {t?.services?.description ? (
              <>
                {t.services.description.split(/(\{website\}|\{portfolio\}|\{caseStudies\})/).map((part, idx) => {
                  if (part === '{website}') {
                    return <Link key={idx} href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{t.services.website || "website"}</Link>;
                  } else if (part === '{portfolio}') {
                    return <Link key={idx} href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{t.services.portfolio || "portfolio"}</Link>;
                  } else if (part === '{caseStudies}') {
                    return <Link key={idx} href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">{t.services.caseStudies || "case studies"}</Link>;
                  }
                  return <span key={idx}>{part}</span>;
                })}
              </>
            ) : (
              <>
                From concept to a fully launched <Link href={createLocalizedHref("/services", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">website</Link>, we partner with you at every stage. Explore our <Link href={createLocalizedHref("/portfolio", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">portfolio</Link> to see completed projects, or check our <Link href={createLocalizedHref("/case-studies", currentLocale)} className="text-gray-600 hover:text-gray-900 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-500 transition-colors">case studies</Link> for detailed results.
              </>
            )}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      {loading && servicesList.length === 0 ? (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
          {/* Loading skeleton */}
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-64 bg-gray-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 md:grid-cols-2">
          {servicesList.map((service, index) => {
            const imageKey = SERVICE_ID_TO_DETAIL[service.id] || service.id;
            const hasImage = serviceImageMap[imageKey] || serviceImageMap[service.id];
            return (
          <Link
            key={service.id}
            href={getServiceHref(service)}
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
                  {service.title || service.label}
                </h3>

                <p className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {service.summary || service.description}
                </p>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="text-[10px] sm:text-xs text-gray-500 line-clamp-1">
                    <span className="font-medium text-gray-800">{t?.services?.outcome || "Outcome:"}</span>{" "}
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
                {hasImage ? (
                  <motion.div
                    className="absolute inset-0 z-0"
                    custom={index}
                    initial="initial"
                    whileInView="animate"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={imageVariants}
                  >
                    <Image
                      src={`/service/${serviceImageMap[imageKey] || serviceImageMap[service.id]}`}
                      alt={service.title || service.label || "Service image"}
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
                      {service.summary || service.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            </motion.article>
          </Link>
          );
          })}
        </div>
      )}
    </Section>
  );
};

export default Services;
