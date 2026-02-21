import { lazy, Suspense, useEffect } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";

import { useHashScroll } from "@/hooks/use-hash-scroll";

// Lazy load heavy sections for better performance
const BrandMarquee = lazy(() => import("@/components/home/BrandMarquee"));
const AboutSection = lazy(() => import("@/components/home/AboutSection"));
const ServicesSection = lazy(() => import("@/components/home/ServicesSection"));
const GallerySection = lazy(() => import("@/components/home/GallerySection"));
const VideoSection = lazy(() => import("@/components/home/VideoSection"));


// Loading fallback component
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

const Index = () => {
  useHashScroll();

  useEffect(() => {
    document.title = "Kalangara Paint House | Premium Paints & Design in Alappuzha";
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* SEO: Single H1 in HeroSection, proper heading hierarchy throughout */}
      <Header />
      <main>
        <HeroSection />
        <Suspense fallback={<SectionLoader />}>
          <BrandMarquee />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ServicesSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <GallerySection />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <VideoSection />
        </Suspense>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
};

export default Index;
