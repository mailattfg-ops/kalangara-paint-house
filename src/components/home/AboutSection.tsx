import { Droplets, Shield, Palette, Award, Building2, Users, History, Store } from "lucide-react";

const AboutSection = () => {
  const currentYear = new Date().getFullYear();
  const yearsLegacy = currentYear - 2000;

  const features = [
    {
      icon: History,
      title: `${yearsLegacy}+ Years Legacy`,
      description: "Founded by Tomychen Kalangara, growing from a modest shop to a state-of-the-art studio.",
    },
    {
      icon: Store,
      title: "Modern Studio",
      description: "Initially renovated in August 2022, with a major modernization in May 2025 to keep up with technology.",
    },
    {
      icon: Users,
      title: "Community First",
      description: "Deeply rooted in Edathua's culture, we are a respected part of the local community fabric.",
    },
    {
      icon: Shield,
      title: "Trusted Expertise",
      description: "From a modest shop to Kuttanad's premier paint destination, we grow through trust and quality.",
    }
  ];

  return (
    <section id="about" className="py-20 md:py-32 bg-gradient-to-b from-white via-purple-50/30 to-white relative overflow-hidden">
      {/* Royal Background Elements */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-50/50 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-center">

          {/* IMAGE SIDE - Premium Framed Design */}
          <div className="lg:col-span-5 relative group perspective-1000">
            {/* Gold/Purple decorative backing */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-600 to-indigo-600 rounded-[2rem] rotate-3 scale-[1.02] opacity-20 blur-sm transition-all duration-700 group-hover:rotate-6 group-hover:scale-105" />

            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white bg-white z-10 transition-transform duration-700 group-hover:-translate-y-2">
              <div className="aspect-[4/5] relative">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 z-10" />
                <img
                  src="/images/about_us_img.webp"
                  alt="Kalangara Paint House Stock Display"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  loading="lazy"
                  decoding="async"
                />

                {/* Glassmorphic Badge Removed */}
              </div>
            </div>

            {/* Floating Royal Element */}
            <div className="absolute -top-10 -right-10 w-32 h-32 border-[1px] border-purple-200/60 rounded-full hidden md:flex items-center justify-center animate-[spin_10s_linear_infinite] pointer-events-none">
              <div className="w-2 h-2 bg-purple-400 rounded-full absolute top-0" />
              <div className="w-2 h-2 bg-purple-400 rounded-full absolute bottom-0" />
            </div>
          </div>

          {/* CONTENT SIDE */}
          <div className="lg:col-span-7 space-y-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-[2px] bg-gradient-to-r from-purple-600 to-transparent" />
                <span className="text-xs font-bold text-purple-700 uppercase tracking-[0.4em]">Who We Are</span>
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal text-foreground tracking-tighter uppercase leading-[0.9]">
                Your Trusted <br />
                <span className="text-primary font-serif">Paint Partner</span>
                <span className="block text-2xl md:text-3xl font-serif italic text-slate-400 font-normal mt-2 tracking-normal">In Edathua</span>
              </h2>

              <p className="text-slate-600 text-lg leading-relaxed max-w-2xl font-medium">
                Kalangara Paint House is more than just a retail shop; we are a specialized paint studio and wholesale hub that has served the community for over two decades. Located in the St. George Shopping Complex, we are the go-to destination for painting solutions in Kuttanad.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-x-12 gap-y-10 pt-4">
              {features.map((feature, idx) => (
                <div key={idx} className="flex gap-5 group items-start">
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-purple-50 border border-purple-100/50 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-purple-500/30 transition-all duration-500 rotate-0 group-hover:-rotate-3">
                    <feature.icon className="w-7 h-7" strokeWidth={1.5} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-bold text-base uppercase tracking-wider text-slate-900 group-hover:text-purple-700 transition-colors">{feature.title}</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default AboutSection;
