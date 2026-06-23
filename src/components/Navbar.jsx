import { useState, useEffect } from "react";
import { MapPin, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? "bg-ivory border-b border-charcoal/10 shadow-sm" : "bg-transparent"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between h-16">
        
        {/* Wordmark with Integrated Giraffe Icon */}
        <a href="/" className="flex items-center gap-0.1 select-none">
          {/* Small Giraffe Image Container */}
          <div className="w-12 h-12 flex items-center justify-center overflow-hidden">
            <img 
              src="/twiga-giraffe.png" 
              alt="Twiga Giraffe Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          
          {/* Brand Name Typography */}
          <div className="flex items-center gap-2">
            <span className="text-amber font-body font-medium text-lg tracking-widest uppercase">
              Twiga
            </span>
            <span
              className="w-px h-5 bg-charcoal/30 inline-block"
              aria-hidden="true"
            />
            <span className="font-display italic text-charcoal text-base font-normal">
              Suites
            </span>
          </div>
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#suites"
            className="font-body text-xs tracking-widest uppercase text-slate hover:text-charcoal transition-colors"
          >
            Suites
          </a>
          <a
            href="#about"
            className="font-body text-xs tracking-widest uppercase text-slate hover:text-charcoal transition-colors"
          >
            About
          </a>
          <a
            href="#contact"
            className="font-body text-xs tracking-widest uppercase text-slate hover:text-charcoal transition-colors"
          >
            Contact
          </a>
        </div>

        {/* Location Info (Updated pin to blue to match logo) */}
        <div className="hidden md:flex items-center gap-3 text-xs font-body text-slate">
          <MapPin size={13} strokeWidth={1.5} className="text-blue-600" />
          <span className="tracking-wide">Kenya Collection</span>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-charcoal p-1"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {/* If mobile menu is open, show X, otherwise show Menu icon */}
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden bg-ivory border-t border-charcoal/10 px-6 py-6 flex flex-col gap-5">
          {["Suites", "About", "Contact"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-sm tracking-widest uppercase text-slate"
              onClick={() => setMobileOpen(false)}
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}