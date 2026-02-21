import { ArrowRight, Paintbrush, ShieldCheck, Droplets, Truck, Palette, PaintRoller, Building2, HardHat, Wrench, Briefcase, Sparkles, Layers, Shield } from "lucide-react";
import ShopGallerySection from "./ShopGallerySection";
import { Service } from "@/types";

const ServicesSection = () => {
    const services: Service[] = [
        {
            title: "Waterproofing Solutions",
            subtitle: "LEAK PROTECTION",
            description: "Advanced waterproofing for terraces & walls using top-tier emulsions and primers from Asian Paints, JSW, Berger, & Birla. Complete protection with specialized roof coatings, putty, and leak-proof solutions.",
            image: "/images/waterproofing_solutions.webp",
            icon: Droplets
        },
        {
            title: "Climate Protection Coatings",
            subtitle: "WEATHER SHIELD",
            description: "Advanced heat and weather-resistant coatings that safeguard buildings from extreme sunlight, rain, and temperature changes, improving durability and indoor comfort.",
            image: "/images/climate_protection_coatings.webp",
            icon: ShieldCheck
        },
        {
            title: "Wall Care & Surface Treatment",
            subtitle: "SMOOTH FINISH",
            description: "Premium surface preparation with Birla White & Vembanadu cements, plus Birla Putty. We utilize waterproof primers and polymers from Asian Paints, JSW, & Indigo for effective crack filling and damp treatment.",
            image: "/images/wall_care_surface_treatment.webp",
            icon: Paintbrush
        },
        {
            title: "Professional Painting Services",
            subtitle: "PREMIUM FINISH",
            description: "High-quality interior and exterior painting for residential, commercial, and industrial spaces using premium materials and skilled workmanship.",
            image: "/images/professional_painting_services.webp",
            icon: PaintRoller
        },
        {
            title: "Commercial & Bulk Painting",
            subtitle: "LARGE SCALE",
            description: "Specialized solutions for large-scale projects such as offices, factories, apartments, and housing societies with timely execution and consistent quality.",
            image: "/images/commercial_bulk_painting.webp",
            icon: Building2
        },
        {
            title: "Paint Consultation",
            subtitle: "EXPERT GUIDANCE",
            description: "Expert guidance on color selection, finishes, material choice, and maintenance to help you achieve the perfect look and longlasting results. We have a colour studio to tint over 2,500 Asian Paints shades for customers to choose from.",
            image: "/images/paint_consultation.webp",
            icon: Palette
        },
        {
            title: "Wood Polishing & Varnishing",
            subtitle: "WOOD CARE",
            description: "Enhance wooden surfaces with durable polishing and varnishing that protects against moisture, scratches, aging, and delivers a rich, lasting finish.",
            image: "/images/services/wood_polishing.webp",
            icon: Sparkles
        },
        {
            title: "Floor Painting Solutions",
            subtitle: "DURABLE FLOORS",
            description: "Apply durable, slip-resistant floor coatings for homes, commercial, and industrial spaces, ensuring protection, easy maintenance, and long-lasting performance.",
            image: "/images/services/floor_painting_solutions.webp",
            icon: Layers
        },
        {
            title: "Epoxy Metal Painting",
            subtitle: "METAL PROTECTION",
            description: "Protect metal surfaces with epoxy coatings that resist rust, corrosion, chemicals, and wear while delivering a smooth, long-lasting professional finish.",
            image: "/images/services/epoxy_metal_painting.webp",
            icon: Shield
        }
    ];

    const customerServices = [
        {
            icon: Truck,
            title: "Free Home Delivery",
            description: "Get premium paints and supplies delivered directly to your doorstep with zero hassle."
        },
        {
            icon: Palette,
            title: "Color Consultation",
            description: "Expert assistance to choose the perfect color palette that matches your style and space."
        },
        {
            icon: HardHat,
            title: "Complete Project Works",
            description: "End-to-end management of painting projects, ensuring quality and timely completion."
        },
        {
            icon: ShieldCheck,
            title: "Warranted Painting",
            description: "Professional painting services backed by official warranties for your peace of mind."
        },
        {
            icon: Briefcase,
            title: "Executive Site Visits",
            description: "Our company executives visit your site to assess requirements and ensure standards."
        },
        {
            icon: Wrench,
            title: "After-Sales Support",
            description: "Dedicated maintenance checks and support even after the project is completed."
        }
    ];

    // JSON-LD for Services
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": services.map((s, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "item": {
                "@type": "Service",
                "name": s.title,
                "description": s.description,
                "provider": {
                    "@id": "https://kalangarapaints.com"
                }
            }
        }))
    };

    return (
        <section id="services" className="pt-12 md:pt-24 pb-0 bg-white relative overflow-hidden">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <div className="container mx-auto px-4 relative z-10">
                {/* Minimalist Heading Block */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
                    <div className="max-w-2xl space-y-4">
                        <div>
                            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                                Our Services
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal text-foreground tracking-tighter uppercase leading-[0.9]">
                            We Don't Just <br /> <span className="text-primary font-serif">Sell Color</span>
                        </h2>
                    </div>
                    <p className="text-slate-500 font-medium max-w-sm text-sm md:text-base border-l border-slate-100 pl-6 hidden lg:block">
                        We sell protection. Our specialized products are designed to safeguard your home against the tough Kerala climate.
                    </p>
                </div>

                {/* Services Grid - Modern & Elevated */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-0">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="group relative flex flex-col bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-slate-200"
                        >
                            {/* Service Image */}
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    decoding="async"
                                    width="640"
                                    height="300"
                                />
                                {/* Corner Icon Box */}
                                <div className="absolute bottom-4 right-4 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-xl text-slate-900 flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 z-20 group-hover:bg-primary group-hover:text-white">
                                    <service.icon className="w-5 h-5" strokeWidth={1.5} />
                                </div>
                            </div>

                            {/* Service Content */}
                            <div className="p-8 flex flex-col items-start flex-grow relative">
                                <span className="inline-block py-1 px-3 rounded-full bg-slate-100 text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">
                                    {service.subtitle}
                                </span>
                                <h3 className="text-2xl font-semibold font-heading text-slate-900 uppercase tracking-tight leading-none mb-3 group-hover:text-primary transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-slate-500 text-sm leading-relaxed font-medium mb-6">
                                    {service.description}
                                </p>

                                <div className="mt-auto w-full pt-6 border-t border-slate-100">
                                    <button
                                        onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="w-full group/btn flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-900 hover:text-primary transition-colors"
                                    >
                                        <span>Enquire Now</span>
                                        <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Additional Services - Redesigned & Moved */}
            <div className="bg-white py-16 md:py-24 relative overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30 pointer-events-none" />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            Premium Add-ons
                        </span>
                        <h3 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal text-foreground tracking-tighter uppercase leading-[0.9]">
                            Everything You Need <br />
                            <span className="text-primary font-serif">Under One Roof</span>
                        </h3>
                        <p className="mt-4 text-slate-500 font-medium max-w-lg mx-auto">
                            We go beyond just selling paint. Experience a complete ecosystem of services designed for your convenience and peace of mind.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                        {customerServices.map((item, idx) => (
                            <div key={idx} className="group relative bg-[#F3E8FF] p-8 rounded-3xl border border-purple-300 shadow-sm hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-500 hover:-translate-y-1 overflow-hidden">
                                {/* Subtle Hover Gradient Background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10 flex flex-col items-start h-full">
                                    {/* Minimalist Icon Container */}
                                    <div className="mb-6 w-14 h-14 rounded-2xl bg-white text-purple-600 flex items-center justify-center transition-all duration-500 group-hover:bg-purple-600 group-hover:text-white group-hover:rotate-3 shadow-sm group-hover:shadow-purple-500/25 ring-1 ring-purple-50">
                                        <item.icon className="w-7 h-7" strokeWidth={1.5} />
                                    </div>

                                    {/* Content */}
                                    <h4 className="text-xl font-bold font-heading text-slate-900 uppercase tracking-tight mb-3 group-hover:text-purple-700 transition-colors duration-300">
                                        {item.title}
                                    </h4>
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6 group-hover:text-slate-600">
                                        {item.description}
                                    </p>

                                    {/* Bottom Action Line */}
                                    <div className="mt-auto w-12 h-1 bg-purple-200 rounded-full group-hover:w-full group-hover:bg-purple-600 transition-all duration-500 ease-out" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Shop Gallery Section - Full Width */}
            <ShopGallerySection />
        </section>
    );
};

export default ServicesSection;
