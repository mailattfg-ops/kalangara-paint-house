import { useState, useEffect } from "react";
import { Menu, X, Phone, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  forceWhite?: boolean;
}

const Header = ({ forceWhite = false }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#hero" },
    { name: "Services", href: "#services" },
    { name: "About", href: "#about" },
    { name: "Showroom", href: "#showroom" },
    { name: "Gallery", href: "#gallery" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = 60; // New lower header height
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    scrollToSection(href);
    setIsMobileMenuOpen(false);
  };

  const handleContactClick = () => {
    scrollToSection('#contact');
    setIsMobileMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-slate-100 bg-white ${isScrolled ? "py-2 md:py-1 shadow-md" : "py-3 md:py-2 shadow-sm"
        }`}
    >
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">

          {/* Brand / Logo */}
          <div className="flex-shrink-0">
            <a
              href="#hero"
              onClick={(e) => handleNavClick(e, '#hero')}
              className="flex items-center group cursor-pointer"
            >
              <div className="relative w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center transition-transform group-hover:scale-105">
                <img
                  src="/icons/icon.png"
                  alt="KPH Logo"
                  className="w-full h-full object-contain"
                  width="48"
                  height="48"
                />
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-0">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-[12px] font-bold uppercase tracking-widest text-slate-600 hover:text-primary transition-colors rounded-lg hover:bg-slate-50"
                onClick={(e) => handleNavClick(e, link.href)}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden xl:flex items-center gap-3 border-r border-slate-100 pr-6">
              <div className="p-1.5 rounded-full bg-primary/10 text-primary">
                <Phone size={14} />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  Call Expert
                </span>
                <span className="text-xs font-bold tracking-tight text-foreground">
                  0477-2212444
                </span>
              </div>
            </div>

            <Button
              onClick={handleContactClick}
              className="hidden sm:flex rounded-none px-6 py-4 h-10 text-[10px] font-extrabold uppercase tracking-[0.2em] transition-all bg-foreground text-white hover:bg-primary shadow-sm"
            >
              ENQUIRE NOW
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2.5 rounded bg-slate-100 text-foreground hover:bg-slate-200 active:scale-95 transition-all"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <div
        id="mobile-menu"
        className={`lg:hidden fixed left-0 right-0 bg-white border-t border-slate-100 shadow-2xl transition-all duration-300 overflow-hidden z-40 ${isMobileMenuOpen ? "max-h-[calc(100vh-60px)] opacity-100" : "max-h-0 opacity-0"
          }`}
        style={{ top: isScrolled ? '52px' : '60px' }}
      >
        <div className="p-4 space-y-1 max-h-[calc(100vh-80px)] overflow-y-auto">
          {navLinks.map((link, idx) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-primary/5 text-foreground font-bold text-sm tracking-widest uppercase transition-all active:scale-95"
            >
              {link.name}
              <ChevronRight size={16} className="text-primary" />
            </a>
          ))}

          <div className="pt-3 grid gap-3">
            <Button
              onClick={handleContactClick}
              className="w-full py-6 text-xs font-bold tracking-widest uppercase rounded-none bg-primary hover:bg-primary/90"
            >
              FREE CONSULTATION
            </Button>

            {/* Mobile Phone Number */}
            <a
              href="tel:04772212444"
              className="flex items-center justify-center gap-2 p-4 bg-slate-100 text-foreground rounded-lg hover:bg-slate-200 transition-colors"
            >
              <Phone size={16} className="text-primary" />
              <span className="text-sm font-bold">0477-2212444</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
