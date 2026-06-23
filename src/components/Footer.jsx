import { MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="bg-charcoal-600 border-t border-charcoal/60 py-14">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-amber font-body font-medium tracking-widest uppercase">
                Twiga
              </span>
              <span className="w-px h-4 bg-ivory/20 inline-block" />
              <span className="font-display italic text-ivory/80 text-sm">Suites</span>
            </div>
            <p className="font-body text-ivory/40 text-xs leading-relaxed max-w-xs">
              Extraordinary properties across Kenya's most memorable landscapes.
              Crafted for the discerning traveller who demands both comfort and authenticity.
              
              Book with us!
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-amber mb-5">
              Navigate
            </p>
            <ul className="space-y-3">
              {["Suites", "About", "Contact"].map((item) => (
                <li key={item}>
                  <a
                    href={`#${item.toLowerCase()}`}
                    className="font-body text-xs tracking-wide uppercase text-ivory/40 hover:text-ivory/80 transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-amber mb-5">
              Get in Touch
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-ivory/40">
                <MapPin size={12} strokeWidth={1.5} className="text-amber flex-shrink-0" />
                <span className="font-body text-xs">Westlands, Nairobi, Kenya</span>
              </li>
              <li className="flex items-center gap-3 text-ivory/40">
                <Phone size={12} strokeWidth={1.5} className="text-amber flex-shrink-0" />
                <a href="tel:+254729915560" className="font-body text-xs hover:text-ivory/70 transition-colors">
                  +254 729915560
                </a>
              </li>
              <li className="flex items-center gap-3 text-ivory/40">
                <Mail size={12} strokeWidth={1.5} className="text-amber flex-shrink-0" />
                <a href="mailto:hello@twigasuites.co.ke" className="font-body text-xs hover:text-ivory/70 transition-colors">
                  hello@twigasuites.co.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-charcoal/60 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <p className="font-body text-xs text-ivory/20">
            © {new Date().getFullYear()} Twiga Suites. All rights reserved.
          </p>
          <p className="font-body text-xs text-ivory/20">
            Nairobi · Mombasa · Kisumu · Naivasha · Lamu · Amboseli
          </p>
        </div>
      </div>
    </footer>
  );
}