import { ArrowDown } from "lucide-react";

const STAT_ROW = [
  { value: "100+", label: "Properties" },
  { value: "47", label: "Counties" },
  { value: "100%", label: "Exclusive Access" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-charcoal overflow-hidden flex flex-col">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1800&q=80"
          alt="Kenyan landscape"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 md:px-10 pt-32 pb-16">
        {/* Top label */}
        <div className="flex items-center gap-4 mb-12">
          <div className="hero-rule" />
          <span className="font-body text-xs tracking-widest uppercase text-amber">
            Kenya · Est. 2024
          </span>
        </div>

        {/* Main headline block */}
        <div className="flex-1 flex flex-col md:flex-row md:items-end justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="font-display text-ivory text-5xl md:text-7xl lg:text-8xl leading-none font-normal">
              Discover Kenya,
              <br />
              <em className="italic text-amber font-normal">One stay</em>
              <br />
              at a time.
            </h1>
            <p className="mt-8 font-body text-ivory/60 text-base md:text-lg max-w-md leading-relaxed font-light">
              Comfy residences across the country's most extraordinary
              landscapes. No compromise on craft, comfort, or character.
            </p>
            <div className="mt-10 flex items-center gap-4">
              <a href="#suites" className="btn-amber">
                Explore Suites
              </a>
              <a href="#about" className="btn-ghost border-ivory/30 text-ivory hover:bg-ivory/10 hover:text-ivory">
                Our Story
              </a>
            </div>
          </div>

          {/* Stats column */}
          <div className="flex md:flex-col gap-8 md:gap-10 md:pb-2">
            {STAT_ROW.map(({ value, label }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="font-display text-amber text-3xl md:text-4xl font-semibold">
                  {value}
                </span>
                <span className="font-body text-xs tracking-widest uppercase text-ivory/40">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-12 flex items-center gap-3 text-ivory/30">
          <ArrowDown size={14} strokeWidth={1.5} />
          <span className="font-body text-xs tracking-widest uppercase">Scroll to discover</span>
        </div>
      </div>

      {/* Bottom edge */}
      <div className="relative z-10 bg-ivory h-8" style={{ clipPath: "polygon(0 100%, 100% 100%, 100% 0)" }} />
    </section>
  );
}