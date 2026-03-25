"use client";

import React from "react";
import { motion } from "framer-motion";
import Section from "@/componenets/ui/Section";
import Button from "@/componenets/ui/Button";
import Image from "next/image";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useLocaleData } from "@/lib/use-locale-data";
import { getCurrentLocale, createLocalizedHref } from "@/lib/navigation";
import { useTranslations } from "@/lib/translations-context";
import SEOBacklinks from "@/componenets/global/SEOBacklinks";
import Contact from "@/componenets/Contact";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.5, delay },
});

// Generate dummy data for each service
const getServiceDetails = (serviceId) => {
  const detailsMap = {
    "strategy": {
      features: [
        "Comprehensive market research and competitor analysis",
        "User journey mapping and conversion optimization",
        "Content strategy and messaging framework",
        "SEO-friendly site architecture planning",
        "Performance metrics and KPIs definition"
      ],
      process: [
        { step: "01", title: "Discovery", description: "We analyze your business goals, target audience, and current challenges through detailed consultations." },
        { step: "02", title: "Research", description: "Market research, competitor analysis, and user behavior studies to inform strategy decisions." },
        { step: "03", title: "Planning", description: "Create comprehensive sitemap, content hierarchy, and user flow documentation." },
        { step: "04", title: "Delivery", description: "Present strategy document with actionable recommendations and implementation roadmap." }
      ],
      useCases: [
        "New website launches requiring clear direction",
        "Website redesigns needing strategic foundation",
        "E-commerce platforms optimizing conversion paths",
        "SaaS products defining user onboarding flows"
      ],
      technologies: ["Google Analytics", "Hotjar", "Figma", "Miro", "Ahrefs", "SEMrush"],
      pricing: [
        { plan: "Starter", price: "$2,500", features: ["Basic sitemap", "Content audit", "Strategy document"] },
        { plan: "Professional", price: "$5,000", features: ["Full strategy", "User research", "Competitor analysis", "Implementation roadmap"] },
        { plan: "Enterprise", price: "Custom", features: ["Custom strategy", "Ongoing consultation", "Team training", "Priority support"] }
      ],
      testimonials: [
        { name: "Sarah Johnson", role: "CEO, TechStart", quote: "The strategy they provided transformed our approach to web presence. Clear, actionable, and results-driven." },
        { name: "Michael Chen", role: "Marketing Director", quote: "Best investment we made. The strategic foundation they built is still guiding our decisions today." }
      ]
    },
    "ux-ui": {
      features: [
        "Mobile-first responsive design approach",
        "Interactive prototypes and user testing",
        "Accessibility compliance (WCAG 2.1)",
        "Design system and component library",
        "Brand-aligned visual identity"
      ],
      process: [
        { step: "01", title: "Wireframing", description: "Create low-fidelity wireframes to establish layout and information architecture." },
        { step: "02", title: "Design", description: "Develop high-fidelity designs with brand colors, typography, and visual elements." },
        { step: "03", title: "Prototyping", description: "Build interactive prototypes for user testing and stakeholder approval." },
        { step: "04", title: "Handoff", description: "Deliver design files, specifications, and assets ready for development." }
      ],
      useCases: [
        "Website redesigns requiring modern UI/UX",
        "Mobile app interface design",
        "Dashboard and admin panel design",
        "Landing page optimization"
      ],
      technologies: ["Figma", "Adobe XD", "Sketch", "Principle", "InVision", "Zeplin"],
      pricing: [
        { plan: "Starter", price: "$3,500", features: ["5 page designs", "Mobile responsive", "Basic prototype"] },
        { plan: "Professional", price: "$7,500", features: ["10+ page designs", "Full prototype", "Design system", "User testing"] },
        { plan: "Enterprise", price: "Custom", features: ["Unlimited pages", "Custom design system", "Ongoing support", "Team collaboration"] }
      ],
      testimonials: [
        { name: "Emily Rodriguez", role: "Product Manager", quote: "The designs exceeded our expectations. Beautiful, functional, and perfectly aligned with our brand." },
        { name: "David Kim", role: "Founder", quote: "Our conversion rate increased by 40% after implementing their designs. Incredible work." }
      ]
    },
    "development": {
      features: [
        "Modern frameworks (Next.js, React, Vue)",
        "Performance optimization and Core Web Vitals",
        "SEO-friendly code structure",
        "Responsive and mobile-optimized",
        "Integration with third-party services"
      ],
      process: [
        { step: "01", title: "Setup", description: "Project initialization, environment configuration, and development workflow setup." },
        { step: "02", title: "Development", description: "Build features following best practices, with regular code reviews and testing." },
        { step: "03", title: "Testing", description: "Comprehensive testing including unit tests, integration tests, and browser compatibility." },
        { step: "04", title: "Launch", description: "Deployment, performance monitoring, and post-launch support." }
      ],
      useCases: [
        "Custom web applications",
        "E-commerce platform development",
        "SaaS product development",
        "Website migrations and rebuilds"
      ],
      technologies: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL", "Vercel"],
      pricing: [
        { plan: "Starter", price: "$8,000", features: ["5-10 pages", "Basic CMS", "Responsive design"] },
        { plan: "Professional", price: "$15,000", features: ["10-20 pages", "Custom features", "API integration", "SEO optimization"] },
        { plan: "Enterprise", price: "Custom", features: ["Unlimited pages", "Custom architecture", "Scalable infrastructure", "Ongoing maintenance"] }
      ],
      testimonials: [
        { name: "James Wilson", role: "CTO", quote: "Fast, reliable, and scalable. The code quality is exceptional and the site performance is outstanding." },
        { name: "Lisa Anderson", role: "Operations Director", quote: "They delivered on time and exceeded expectations. Our new site is fast and user-friendly." }
      ]
    },
    "cms": {
      features: [
        "WordPress or headless CMS setup",
        "Custom content types and fields",
        "User-friendly admin interface",
        "Content migration and import",
        "Training and documentation"
      ],
      process: [
        { step: "01", title: "Planning", description: "Define content structure, content types, and user roles for your CMS." },
        { step: "02", title: "Configuration", description: "Set up CMS platform, configure fields, and create content templates." },
        { step: "03", title: "Migration", description: "Import existing content and ensure data integrity throughout the process." },
        { step: "04", title: "Training", description: "Provide comprehensive training and documentation for your team." }
      ],
      useCases: [
        "Content-heavy websites",
        "Blog and news platforms",
        "Multi-author publishing systems",
        "E-commerce product management"
      ],
      technologies: ["WordPress", "Contentful", "Strapi", "Sanity", "Drupal", "Ghost"],
      pricing: [
        { plan: "Starter", price: "$2,000", features: ["Basic CMS setup", "5 content types", "User training"] },
        { plan: "Professional", price: "$4,500", features: ["Custom CMS", "Unlimited content types", "Content migration", "Advanced training"] },
        { plan: "Enterprise", price: "Custom", features: ["Enterprise CMS", "Custom integrations", "Ongoing support", "Dedicated account manager"] }
      ],
      testimonials: [
        { name: "Robert Taylor", role: "Content Manager", quote: "The CMS is intuitive and powerful. Our team was up and running in no time." },
        { name: "Jennifer Lee", role: "Marketing Lead", quote: "Content management has never been easier. The system is flexible and user-friendly." }
      ]
    },
    "performance": {
      features: [
        "Core Web Vitals optimization",
        "Page speed analysis and improvement",
        "Technical SEO audit and fixes",
        "Image and asset optimization",
        "Caching and CDN configuration"
      ],
      process: [
        { step: "01", title: "Audit", description: "Comprehensive performance audit using industry-standard tools and metrics." },
        { step: "02", title: "Analysis", description: "Identify bottlenecks, slow queries, and optimization opportunities." },
        { step: "03", title: "Optimization", description: "Implement fixes including code optimization, caching, and asset compression." },
        { step: "04", title: "Monitoring", description: "Set up ongoing monitoring and provide optimization recommendations." }
      ],
      useCases: [
        "Slow-loading websites",
        "SEO performance issues",
        "High bounce rates",
        "Mobile performance problems"
      ],
      technologies: ["Lighthouse", "PageSpeed Insights", "GTmetrix", "WebPageTest", "Cloudflare", "Vercel"],
      pricing: [
        { plan: "Starter", price: "$1,500", features: ["Performance audit", "Basic optimizations", "Report and recommendations"] },
        { plan: "Professional", price: "$3,500", features: ["Full optimization", "SEO improvements", "Ongoing monitoring", "Monthly reports"] },
        { plan: "Enterprise", price: "Custom", features: ["Custom optimization", "24/7 monitoring", "Priority support", "Dedicated specialist"] }
      ],
      testimonials: [
        { name: "Mark Thompson", role: "SEO Manager", quote: "Our site speed improved by 60% and search rankings increased significantly. Excellent results." },
        { name: "Amanda White", role: "Web Director", quote: "The performance improvements were immediate and measurable. Great ROI on this service." }
      ]
    },
    "support": {
      features: [
        "Monthly maintenance and updates",
        "Security monitoring and patches",
        "Content updates and changes",
        "Bug fixes and troubleshooting",
        "Performance monitoring"
      ],
      process: [
        { step: "01", title: "Onboarding", description: "Review your site, set up monitoring tools, and establish support workflows." },
        { step: "02", title: "Monitoring", description: "Continuous monitoring of site health, security, and performance metrics." },
        { step: "03", title: "Maintenance", description: "Regular updates, backups, and proactive issue resolution." },
        { step: "04", title: "Reporting", description: "Monthly reports on site performance, updates, and recommendations." }
      ],
      useCases: [
        "Ongoing website maintenance",
        "Security and update management",
        "Content management support",
        "Technical troubleshooting"
      ],
      technologies: ["Git", "CI/CD", "Monitoring Tools", "Backup Systems", "Security Scanners", "Analytics"],
      pricing: [
        { plan: "Starter", price: "$500/mo", features: ["Monthly updates", "Basic monitoring", "Email support"] },
        { plan: "Professional", price: "$1,200/mo", features: ["Weekly updates", "Advanced monitoring", "Priority support", "Content updates"] },
        { plan: "Enterprise", price: "Custom", features: ["24/7 monitoring", "Dedicated support", "Custom SLA", "Unlimited updates"] }
      ],
      testimonials: [
        { name: "Chris Martinez", role: "Business Owner", quote: "Having reliable support gives us peace of mind. They handle everything seamlessly." },
        { name: "Rachel Green", role: "Operations Manager", quote: "The support team is responsive and proactive. Our site has never been more stable." }
      ]
    }
  };

  return detailsMap[serviceId] || {
    features: [
      "Professional service delivery",
      "Expert team support",
      "Quality assurance",
      "Timely delivery",
      "Ongoing support"
    ],
    process: [
      { step: "01", title: "Consultation", description: "Initial discussion to understand your needs and requirements." },
      { step: "02", title: "Planning", description: "Detailed planning and strategy development for your project." },
      { step: "03", title: "Execution", description: "Professional execution of the service with regular updates." },
      { step: "04", title: "Delivery", description: "Final delivery and handover with documentation and support." }
    ],
    useCases: [
      "Business growth initiatives",
      "Digital transformation",
      "Performance improvements",
      "Strategic development"
    ],
    technologies: ["Modern Tools", "Best Practices", "Industry Standards"],
    pricing: [
      { plan: "Starter", price: "$2,000", features: ["Basic service", "Standard support"] },
      { plan: "Professional", price: "$5,000", features: ["Full service", "Priority support", "Extended features"] },
      { plan: "Enterprise", price: "Custom", features: ["Custom solution", "Dedicated support", "Unlimited features"] }
    ],
    testimonials: [
      { name: "Client Name", role: "Position", quote: "Great service and excellent results. Highly recommended." },
      { name: "Another Client", role: "Role", quote: "Professional team that delivers on their promises." }
    ]
  };
};

const ServiceDetailPage = () => {
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const currentLocale = getCurrentLocale(pathname);
  const t = useTranslations();
  const { data: pageData, loading: pageDataLoading } = useLocaleData('services-page');
  
  const rawServiceId = params?.serviceId;
  const serviceId = Array.isArray(rawServiceId) ? rawServiceId[0] : rawServiceId || "";

  const services = pageData?.services?.items || [];
  const service = services.find((s) => s.id === serviceId);

  // Map service IDs to SEO-friendly image names
  const serviceImageMap = {
    "strategy": "seo-optimization.jpg",
    "ux-ui": "ui-ux-design.jpg",
    "design": "ui-ux-design.jpg",
    "development": "content-writer.jpg",
    "cms": "social-media-management.jpg",
    "performance": "website-optimization.jpg",
    "support": "video-shoot-and-editing.jpg",
    "maintenance": "website-optimization.jpg"
  };

  if (pageDataLoading) {
    return (
      <main className="bg-white text-gray-900">
        <Section className="py-24 md:py-32">
          <div className="max-w-fullhd mx-auto text-center">
            <p className="text-sm md:text-base text-gray-500">Loading...</p>
          </div>
        </Section>
      </main>
    );
  }

  if (!service) {
    return (
      <main className="bg-white text-gray-900">
        <Section className="py-24 md:py-32">
          <div className="max-w-fullhd mx-auto text-center space-y-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Service not found
            </h1>
            <p className="text-sm md:text-base text-gray-500">
              The service you're looking for doesn't exist or has been moved.
            </p>
            <Button asChild>
              <Link href={createLocalizedHref("/services", currentLocale)}>
                Back to all services
              </Link>
            </Button>
          </div>
        </Section>
      </main>
    );
  }

  const serviceImage = serviceImageMap[service.id] || serviceImageMap[serviceId];
  const currentIndex = services.findIndex((s) => s.id === serviceId);
  const prevService = currentIndex > 0 ? services[currentIndex - 1] : null;
  const nextService = currentIndex < services.length - 1 ? services[currentIndex + 1] : null;
  
  // Get service-specific details
  const serviceDetails = getServiceDetails(serviceId);

  return (
    <main className="bg-white text-gray-900">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-50 via-white to-white">
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_transparent_60%)]" />
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-200/30 blur-3xl" />

        <Section className="pt-8 sm:pt-10 md:pt-16 pb-12 sm:pb-16 md:pb-20 relative z-[1]">
          <div className="max-w-fullhd mx-auto">
            {/* Breadcrumbs */}
            <motion.div {...fadeUp(0)} className="mb-6">
              <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-gray-500">
                <Link
                  href={createLocalizedHref("/services", currentLocale)}
                  className="hover:text-gray-900 transition-colors"
                >
                  {t?.navigation?.services || "Services"}
                </Link>
                <span className="h-[1px] w-6 bg-gray-300" />
                <span>{service.tag}</span>
              </div>
            </motion.div>

            <div className="grid gap-8 sm:gap-10 md:grid-cols-1 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] items-start">
              {/* Left: Content */}
              <motion.div {...fadeUp(0)} className="space-y-6">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                    {service.tag}
                  </span>
                  <span className="inline-flex rounded-full border border-gray-200 bg-white/80 px-3 py-1 text-[11px] text-gray-600">
                    {service.meta}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[2.7rem] font-semibold tracking-tight text-gray-900">
                  {service.title}
                </h1>

                <p className="text-xs sm:text-sm md:text-base text-gray-600 max-w-xl leading-relaxed">
                  {service.summary}
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Button onClick={() => router.push(createLocalizedHref("/contact", currentLocale))}>
                    {t?.services?.getStarted || "Get started"}
                  </Button>
                  <Button variant="ghost" onClick={() => router.push(createLocalizedHref("/services", currentLocale))}>
                    View all services
                  </Button>
                </div>
              </motion.div>

              {/* Right: Service Image */}
              {serviceImage && (
                <motion.div
                  {...fadeUp(0.1)}
                  className="relative rounded-3xl border border-gray-100 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.12)] overflow-hidden"
                >
                  <div className="relative h-60 md:h-72 lg:h-80">
                    <Image
                      src={`/service/${serviceImage}`}
                      alt={service.title || "Service image"}
                      fill
                      className="object-cover"
                      sizes="(min-width:1024px) 40vw, 100vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/10 to-transparent" />
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </Section>
      </section>

      {/* DETAILED CONTENT */}
      <Section className="py-10 sm:py-12 md:py-14 lg:py-18 bg-white">
        <div className="max-w-fullhd mx-auto space-y-8">
          {/* Outcome */}
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
              What you'll get
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Expected Outcome
            </h2>
            <div className="rounded-2xl border border-gray-100 bg-white px-5 py-4 text-sm md:text-base text-gray-700 shadow-[0_14px_32px_rgba(15,23,42,0.04)]">
              {service.outcome}
            </div>
          </motion.div>

          {/* Service Details */}
          <motion.div {...fadeUp(0.05)} className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                Service Category
              </p>
              <p className="text-base md:text-lg font-semibold text-gray-900">
                {service.tag}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500">
                Best For
              </p>
              <p className="text-sm md:text-base text-gray-600">
                {service.meta}
              </p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* KEY FEATURES SECTION */}
      <Section className="py-12 sm:py-16 md:py-20 bg-gray-50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.08),_transparent_60%)]" />
        <div className="max-w-fullhd mx-auto space-y-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
              What's included
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Key Features
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3"
          >
            {serviceDetails.features.map((feature, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mt-0.5">
                    <span className="text-emerald-600 text-xs font-semibold">✓</span>
                  </div>
                  <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                    {feature}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* HOW IT WORKS / PROCESS SECTION */}
      <Section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-fullhd mx-auto space-y-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
              Our process
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              How It Works
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
          >
            {serviceDetails.process.map((step, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)]"
              >
                <div className="text-[11px] uppercase tracking-[0.18em] text-emerald-600 font-semibold mb-2">
                  {step.step}
                </div>
                <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-3">
                  {step.title}
                </h3>
                <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                  {step.description}
                </p>
                {index < serviceDetails.process.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-0.5 bg-gray-200" />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* USE CASES SECTION */}
      <Section className="py-12 sm:py-16 md:py-20 bg-gray-50">
        <div className="max-w-fullhd mx-auto space-y-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
              Perfect for
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Use Cases
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-4 sm:gap-5 md:grid-cols-2"
          >
            {serviceDetails.useCases.map((useCase, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-5 shadow-[0_14px_32px_rgba(15,23,42,0.04)] flex items-start gap-3"
              >
                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-2" />
                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                  {useCase}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* TECHNOLOGIES & TOOLS SECTION */}
      <Section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-fullhd mx-auto space-y-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
              Tools we use
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              Technologies & Tools
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="flex flex-wrap gap-3"
          >
            {serviceDetails.technologies.map((tech, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {tech}
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* TESTIMONIALS SECTION */}
      <Section className="py-12 sm:py-16 md:py-20 bg-white">
        <div className="max-w-fullhd mx-auto space-y-8">
          <motion.div {...fadeUp(0)} className="max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
              Client feedback
            </p>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
              What Our Clients Say
            </h2>
          </motion.div>

          <motion.div
            {...fadeUp(0.05)}
            className="grid gap-6 md:grid-cols-2"
          >
            {serviceDetails.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-gray-100 bg-white/80 backdrop-blur p-6 shadow-[0_14px_32px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-sm">★</span>
                  ))}
                </div>
                <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* RELATED SERVICES SECTION */}
      {services.length > 1 && (
        <Section className="py-12 sm:py-16 md:py-20 bg-gray-50 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_55%)]" />
          <div className="max-w-fullhd mx-auto space-y-8">
            <motion.div {...fadeUp(0)} className="max-w-3xl">
              <p className="text-[11px] uppercase tracking-[0.2em] text-gray-500 mb-3">
                Explore more
              </p>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-6">
                Related Services
              </h2>
            </motion.div>

            <motion.div
              {...fadeUp(0.05)}
              className="grid gap-4 sm:gap-5 md:grid-cols-2"
            >
              {services
                .filter((s) => s.id !== serviceId)
                .slice(0, 3)
                .map((relatedService, index) => (
                  <Link
                    key={relatedService.id}
                    href={createLocalizedHref(`/services/${relatedService.id}`, currentLocale)}
                    className="block"
                  >
                    <motion.div
                      whileHover={{ y: -6 }}
                      className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_14px_32px_rgba(15,23,42,0.05)] hover:shadow-[0_22px_55px_rgba(15,23,42,0.10)] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                          {relatedService.tag}
                        </span>
                        <span className="inline-flex rounded-full border border-gray-200 bg-white px-2.5 py-1 text-[10px] text-gray-600">
                          {relatedService.meta}
                        </span>
                      </div>
                      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                        {relatedService.title}
                      </h3>
                      <p className="text-xs md:text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {relatedService.summary}
                      </p>
                      <div className="mt-5 text-xs text-emerald-700 font-medium flex items-center gap-2">
                        Explore
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                      </div>
                    </motion.div>
                  </Link>
                ))}
            </motion.div>
          </div>
        </Section>
      )}

      {/* PREV / NEXT NAVIGATION */}
      {prevService || nextService ? (
        <Section className="py-8 md:py-10 bg-white border-t border-gray-100">
          <div className="max-w-fullhd mx-auto flex flex-col md:flex-row items-stretch justify-between gap-4 text-sm">
            {prevService ? (
              <Link
                href={createLocalizedHref(`/services/${prevService.id}`, currentLocale)}
                className="group flex-1 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-100 transition-colors"
              >
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                    Previous service
                  </div>
                  <div className="font-medium text-gray-900 line-clamp-1">
                    {prevService.title}
                  </div>
                </div>
                <span className="text-xs text-gray-500 group-hover:-translate-x-1 transition-transform">
                  ←
                </span>
              </Link>
            ) : (
              <div />
            )}

            {nextService ? (
              <Link
                href={createLocalizedHref(`/services/${nextService.id}`, currentLocale)}
                className="group flex-1 rounded-2xl border border-gray-100 bg-gray-50/80 px-4 py-3 flex items-center justify-between gap-3 hover:bg-gray-100 transition-colors"
              >
                <div className="text-right">
                  <div className="text-[10px] uppercase tracking-[0.18em] text-gray-400 mb-1">
                    Next service
                  </div>
                  <div className="font-medium text-gray-900 line-clamp-1">
                    {nextService.title}
                  </div>
                </div>
                <span className="text-xs text-gray-500 group-hover:translate-x-1 transition-transform">
                  →
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </Section>
      ) : null}

      {/* CONTACT SECTION */}
      <Contact pageName="Service Detail" />
      <SEOBacklinks />
    </main>
  );
};

export default ServiceDetailPage;
