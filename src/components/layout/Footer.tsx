import { Link, useLocation, useNavigate } from "react-router-dom";
import { Phone, MapPin, ArrowUpRight, Facebook, Instagram, Linkedin, Building2, Ticket, MessageCircle } from "lucide-react";

const Footer = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleNavigation = (e: React.MouseEvent<HTMLElement>, href: string) => {
        e.preventDefault();

        // If it's not an anchor link, just navigate
        if (!href.startsWith('#')) {
            navigate(href);
            return;
        }

        // If we're on the home page, update URL and scroll
        if (location.pathname === '/') {
            // Update URL hash without forcing a full page reload, but ensuring history fits
            navigate(href);

            // Manually scroll as well, in case the URL didn't change (already at #contact)
            const element = document.querySelector(href);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // If on another page, navigate to home with hash
            navigate(`/${href}`);
        }
    };

    return (
        <footer className="bg-[#050505] text-white pt-12 md:pt-24 pb-8 md:pb-12 border-t-2 border-primary relative overflow-hidden">

            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Top Section: Main Brand & CTA */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-end">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white p-1.5 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
                                <img
                                    src="/icons/icon.png"
                                    alt="KPH Logo"
                                    className="w-full h-full object-contain"
                                />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-3xl font-black tracking-tighter uppercase leading-none">The Paint House</span>
                                <span className="text-[10px] font-bold tracking-[0.4em] text-slate-500 uppercase">Edathua</span>
                            </div>
                        </div>
                        {/* Heading removed */}
                    </div>

                    <div className="flex flex-col items-start lg:items-end gap-6">
                        <p className="text-slate-400 max-w-sm text-sm lg:text-right leading-relaxed font-medium border-l-2 lg:border-l-0 lg:border-r-2 border-primary/30 pl-6 lg:pl-0 lg:pr-6">
                            We are more than a paint shop. We are a legacy of color, quality, and community service in Kerala.
                        </p>
                        <button
                            onClick={(e) => handleNavigation(e, '#contact')}
                            className="group flex items-center gap-4 bg-white text-black px-8 py-5 text-xs font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-300"
                        >
                            <span>Book Consultation</span>
                            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                        </button>
                    </div>
                </div>

                {/* Divider */}
                <div className="w-full h-px bg-white/10 mb-20" />

                {/* Middle Section: Links & Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-24">

                    {/* Column 1: Contact */}
                    <div className="space-y-8">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                            <Phone className="w-3 h-3" /> Contact
                        </span>
                        <ul className="space-y-6">
                            {[
                                { label: "Main Office", val: "0477-2212444" },
                                { label: "Mobile", val: "+91 94461 94178" },
                                { label: "Support", val: "+91 81569 65090" },
                            ].map((item, i) => (
                                <li key={i} className="group">
                                    <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-1">{item.label}</span>
                                    {item.label === "Email" ? (
                                        <a href={`mailto:${item.val}`} className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors cursor-pointer">{item.val}</a>
                                    ) : (
                                        <a href={`tel:${item.val.replace(/[^0-9+]/g, '')}`} className="text-lg font-heading font-bold text-white group-hover:text-primary transition-colors cursor-pointer">{item.val}</a>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 2: Navigation */}
                    <div className="space-y-8">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                            <Ticket className="w-3 h-3" /> Explore
                        </span>
                        <ul className="space-y-4">
                            {[
                                { name: "Home", href: "#hero" },
                                { name: "About Brand", href: "#about" },
                                { name: "Our Services", href: "#services" },
                                { name: "Project Gallery", href: "#gallery" },
                                { name: "Contact Us", href: "#contact" }
                            ].map((link) => (
                                <li key={link.name}>
                                    <a href={link.href} onClick={(e) => handleNavigation(e, link.href)} className="text-sm font-bold text-slate-400 hover:text-white hover:text-base transition-all flex items-center gap-2 group cursor-pointer">
                                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full group-hover:bg-primary transition-colors" />
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Hours */}
                    <div className="space-y-8">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                            <Building2 className="w-3 h-3" /> Visit Us
                        </span>
                        <div className="space-y-4">
                            <p className="text-sm text-slate-300 leading-relaxed font-medium">
                                St. George Shopping Complex,<br />
                                Edathua, Kerala 689573
                            </p>
                            <div className="p-4 bg-white/5 border border-white/10 animate-pulse">
                                <span className="block text-[10px] text-primary uppercase tracking-widest font-bold mb-1">Opening Hours</span>
                                <span className="text-white font-bold text-sm">Mon - Sat: 9:00 AM - 7:30 PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Map/Social */}
                    <div className="space-y-8">
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                            <MapPin className="w-3 h-3" /> Location
                        </span>
                        <a
                            href="https://www.google.com/maps/place/KALANGARA+PAINT+HOUSE/@9.3678364,76.476737,17z/data=!3m1!4b1!4m6!3m5!1s0x3b0621a92f986f4d:0xd2f3d16827d04d3f!8m2!3d9.3678364!4d76.476737!16s%2Fg%2F11yc8147td"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full h-44 bg-slate-900 relative group overflow-hidden block border-l-4 border-primary shadow-2xl"
                        >
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3936.6088701082676!2d76.476737!3d9.367836399999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b0621a92f986f4d%3A0xd2f3d16827d04d3f!2sKALANGARA%20PAINT%20HOUSE!5e0!3m2!1sen!2sin!4v1768544132546!5m2!1sen!2sin"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 pointer-events-none"
                                title="Google Maps Location of Kalangara Paint House"
                            />
                            {/* Creative Overlay Elements */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                            <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                <div className="bg-primary px-3 py-1.5 text-[8px] font-black text-white uppercase tracking-widest shadow-lg">
                                    GET DIRECTIONS
                                </div>
                            </div>

                            <div className="absolute top-3 right-3 w-8 h-8 bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                                <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </a>
                        <div className="flex gap-4">
                            {[
                                { Icon: Facebook, href: "https://www.facebook.com/people/Kalangara-Paints/100071210554136/" },
                                { Icon: Instagram, href: "https://www.instagram.com/kalangarapaints_edathua/" },
                                { Icon: MessageCircle, href: "https://wa.me/919446194178" }
                            ].map((social, idx) => (
                                <a key={idx} href={social.href} target="_blank" rel="noopener noreferrer" aria-label={`Visit our ${social.href.includes('facebook') ? 'Facebook' : social.href.includes('instagram') ? 'Instagram' : 'WhatsApp'} page`} className="w-10 h-10 border border-white/20 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-all">
                                    <social.Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        © {new Date().getFullYear()} Kalangara Paint House
                    </p>

                </div>

            </div>
        </footer>
    );
};

export default Footer;
