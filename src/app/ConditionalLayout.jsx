"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from "@/componenets/global/Navbar";
import Footer from "@/componenets/global/Footer";
import CapabilitiesStrip from "@/componenets/CapabilitiesStrip";
import CustomCursor from "@/componenets/global/CustomCursor";
import { ToastProvider } from "@/componenets/global/Toast";
import { LeadPopupProvider } from "@/componenets/global/LeadPopupContext";
import { LoadingProvider } from "@/componenets/global/LoadingContext";
import LeadPopup from "@/componenets/global/LeadPopup";
import GoogleAnalyticsTracker from "@/componenets/global/GoogleAnalyticsTracker";
import GlobalClickTracker from "@/componenets/global/GlobalClickTracker";
import { removeLocaleFromPath } from "@/lib/i18n";

export default function ConditionalLayout({ children }) {
  const pathname = usePathname();
  // Remove locale from pathname for checking admin pages
  const pathWithoutLocale = removeLocaleFromPath(pathname);
  const isBlogPostPage = pathWithoutLocale === '/blog-post' || pathWithoutLocale?.startsWith('/blog-post');
  const isRequestQueryPage = pathWithoutLocale === '/request-query';
  const isJobPostPage = pathWithoutLocale === '/job-post' || pathWithoutLocale?.startsWith('/job-post');

  // Ensure each route starts at the top (fixes services pages opening mid-scroll)
  useEffect(() => {
    const isAdminPage = isBlogPostPage || isRequestQueryPage || isJobPostPage;
    if (isAdminPage) return;
    if (typeof window === 'undefined') return;

    // If navigating to an anchored URL, let the browser handle it.
    if (window.location.hash) return;

    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname, isBlogPostPage, isRequestQueryPage, isJobPostPage]);

  useEffect(() => {
    const isAdminPage = isBlogPostPage || isRequestQueryPage || isJobPostPage;
    
    // Show normal cursor on admin pages
    if (isAdminPage) {
      document.body.style.cursor = 'auto';
      // Also ensure all elements show normal cursor
      const style = document.createElement('style');
      style.id = 'admin-cursor-style';
      style.textContent = `
        body, body * {
          cursor: auto !important;
        }
        a, button, [role="button"], input, textarea, select {
          cursor: pointer !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.body.style.cursor = '';
        const existingStyle = document.getElementById('admin-cursor-style');
        if (existingStyle) {
          existingStyle.remove();
        }
      };
    } else {
      // Restore custom cursor for other pages
      document.body.style.cursor = 'none';
      const existingStyle = document.getElementById('admin-cursor-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [isBlogPostPage, isRequestQueryPage, isJobPostPage]);

  if (isBlogPostPage || isRequestQueryPage || isJobPostPage) {
    // Admin pages - no navbar, footer, or custom cursor
    return (
      <ToastProvider>
        <LeadPopupProvider>
          <LoadingProvider>
            <GoogleAnalyticsTracker />
            <GlobalClickTracker />
            <main className="min-h-screen">
              {children}
            </main>
          </LoadingProvider>
        </LeadPopupProvider>
      </ToastProvider>
    );
  }

  // All other pages - include navbar and footer
  return (
    <ToastProvider>
      <LeadPopupProvider>
        <LoadingProvider>
          <GoogleAnalyticsTracker />
          <GlobalClickTracker />
          <CustomCursor />
          <LeadPopup />
          {/* Fixed header: stripe + navbar */}
          <div className="fixed top-0 left-0 w-full z-50">
            <CapabilitiesStrip />
            <Navbar />
          </div>
          <main className="pt-20 sm:pt-24 md:pt-28 lg:pt-32 xl:pt-36">
            {children}
          </main>
          <Footer />
        </LoadingProvider>
      </LeadPopupProvider>
    </ToastProvider>
  );
}

