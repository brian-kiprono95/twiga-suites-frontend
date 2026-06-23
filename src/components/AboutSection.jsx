const PILLARS = [
  {
    num: "I",
    heading: "Radical Selectivity",
    body: "We maintain an intentionally limited portfolio rather than an expansive catalog. Each property is accepted only after an exhaustive, multi-day on-site assessment by our curatorial team.",
  },
  {
    num: "II",
    heading: "Local by Design",
    body: "Every suite is furnished with work from Kenyan artisans. From Kisumu pottery to Maasai-inspired textiles — nothing is imported for import's sake.",
  },
  {
    num: "III",
    heading: "Direct Access",
    body: "No agency markups. No login walls. Reserve instantly and speak directly with the property team from day one.",
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-charcoal py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
        {/* Image */}
        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=900&q=80"
            alt="Kenyan landscape at golden hour"
            className="w-full h-80 md:h-[520px] object-cover"
          />
          <div
            className="absolute -bottom-4 -right-4 w-32 h-32 border border-amber/40 hidden md:block"
            aria-hidden="true"
          />
        </div>

        {/* Text */}
        <div>
         <p className="font-body text-xs tracking-widest uppercase text-blue-500 mb-4">
            Why Twiga Suites
          </p>
          <h2 className="font-display text-ivory text-3xl md:text-4xl font-normal leading-snug mb-8">
            Accommodation
            <br />
            <em className="italic">as it should be.</em>
          </h2>
          <p className="font-body text-ivory/50 text-sm leading-relaxed mb-12 max-w-sm">
            The giraffe sees far because it stands above the ordinary. 
             Elevated perspective, grounded in the landscape.
          </p>

          <div className="space-y-8">
            {PILLARS.map(({ num, heading, body }) => (
              <div key={num} className="flex gap-5 items-start">
                <span className="font-display italic text-sky-500 text-xl mt-0.5 flex-shrink-0 w-6">
                  {num}
                </span>
                <div>
                  <h3 className="font-body text-ivory text-sm font-medium tracking-wide mb-1">
                    {heading}
                  </h3>
                  <p className="font-body text-ivory/40 text-sm leading-relaxed">
                    {body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}