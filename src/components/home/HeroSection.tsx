import { Button } from "@/components/ui/button";
import { QuickContactForm } from "@/components/home/QuickContactForm";
import {
  ShieldCheck,
  Sparkles,
  UserCheck,
  PaintBucket,
  ArrowRight,
  ChevronRight,
  Percent
} from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-[95vh] lg:min-h-[90vh] flex flex-col justify-between overflow-hidden bg-white">

      <div className="absolute inset-0 z-0">
        {/* Responsive Gradient Overlays */}
        {/* Mobile: Very light vertical gradient to maintain painter visibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/20 to-transparent lg:hidden z-10" />
        {/* Desktop: Horizontal gradient */}
        <div className="absolute inset-y-0 left-0 w-full lg:w-1/2 bg-gradient-to-r from-white/95 via-white/40 to-transparent hidden lg:block z-10" />

        <img
          src="/images/bg-hero.webp"
          alt="Professional Painter at Work"
          className="w-full h-full object-cover object-[50%_center] lg:object-right"
          fetchPriority="high"
          decoding="sync"
          width="1920"
          height="1080"
        />
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="container mx-auto px-4 relative z-30 flex-grow flex items-center pt-28 lg:pt-32 pb-12 lg:pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16 w-full">

          {/* LEFT CONTENT */}
          <div className="w-full lg:w-[55%] space-y-6 lg:space-y-8 animate-fade-in text-center lg:text-left">
            <div className="space-y-4 lg:space-y-6 relative z-20">
              <h1 className="flex flex-col text-4xl md:text-6xl xl:text-7xl font-serif font-black leading-[0.85] tracking-tighter text-black uppercase lg:ml-[-4px]">
                <span className="tracking-tight">THE PAINT</span>
                <span className="text-violet-600 w-fit mx-auto lg:mx-0">
                  HOUSE
                </span>
              </h1>

              {/* Minimalist Editorial Description */}
              <div className="max-w-md lg:max-w-lg mx-auto lg:mx-0">
                <p className="font-sans text-xs sm:text-sm lg:text-lg text-slate-600 leading-[1.6] lg:leading-[1.8] font-medium">
                  The <span className="text-black font-bold">only wholesale paint dealer</span> in Kuttanad. <br className="hidden sm:block" />
                  We offer <span className="text-violet-600 font-bold decoration-violet-200 underline-offset-4 underline decoration-1">10–25% cash purchase discounts</span> on selected premium brands.
                </p>
              </div>
            </div>

            {/* Architectural Modern Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full mx-auto lg:mx-0 px-2 sm:px-0">
              <a
                href="#services"
                onClick={(e) => { e.preventDefault(); document.querySelector('#services')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="group relative px-6 py-4 bg-violet-700 hover:bg-violet-800 text-white font-bold text-[10px] lg:text-xs uppercase tracking-[0.15em] transition-all duration-300 rounded-lg flex items-center justify-center gap-3 shadow-lg shadow-violet-200 overflow-hidden w-fit sm:w-auto"
              >
                <span className="relative z-10">Our Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-violet-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>

              <a
                href="#brands"
                onClick={(e) => { e.preventDefault(); document.querySelector('.animate-marquee')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }}
                className="group relative px-6 py-4 bg-white text-slate-900 border border-slate-200 hover:border-violet-200 font-bold text-[10px] lg:text-xs uppercase tracking-[0.15em] hover:bg-slate-50 transition-all duration-300 rounded-lg flex items-center justify-center gap-2 shadow-sm hover:shadow-md w-fit sm:w-auto"
              >
                <span>View Brands</span>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-violet-600 transition-colors" />
              </a>
            </div>

            {/* Horizontal Divider Stats */}
            <div className="pt-6 w-full border-t border-slate-200/60 mt-4 max-w-md mx-auto lg:mx-0">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center">
                {[
                  { label: "Legacy", value: "25 Yrs" },
                  { label: "Discount", value: "30% Off" },
                  { label: "Warranty", value: "10 Yrs" }
                ].map((badge, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-3 justify-center lg:justify-start">
                    {idx !== 0 && <div className="h-6 w-[1px] bg-slate-200 hidden sm:block"></div>}
                    <div className="text-left">
                      <div className="text-[7px] lg:text-[8px] font-bold uppercase tracking-wider text-slate-400">{badge.label}</div>
                      <div className="text-xs lg:text-base font-black text-slate-900 leading-none mt-0.5 whitespace-nowrap">{badge.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: Quick Contact Form */}
          <div className="w-full lg:w-auto shrink-0 flex justify-center lg:justify-end relative mt-2 lg:-mt-8">
            {/* Decorative glow behind form */}
            <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full opacity-40 animate-pulse hidden lg:block" />
            <div className="relative z-10 w-full max-w-[100%] sm:max-w-md scale-[0.9] sm:scale-100 transform-gpu origin-top lg:origin-center">
              <QuickContactForm isHero />
            </div>
          </div>

        </div>
      </div>

    </section >
  );
};

export default HeroSection;
