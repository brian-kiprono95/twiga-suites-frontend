import { MapPin, Star, Users } from "lucide-react";
import { formatKES } from "../data/suites";

const IMG_HEIGHT = {
  large:  "h-72 md:h-80",
  medium: "h-56 md:h-64",
  small:  "h-48 md:h-56",
};

const GRID_SPAN = {
  large:  "col-span-12 md:col-span-7",
  medium: "col-span-12 md:col-span-5",
  small:  "col-span-12 md:col-span-5",
};

export default function SuiteCard({ suite, onBook, index }) {
  const imgClass = IMG_HEIGHT[suite.cardSize] || IMG_HEIGHT.medium;
  const gridSpan = GRID_SPAN[suite.cardSize] || GRID_SPAN.medium;

  return (
    <article className={`suite-card ${gridSpan}`}>
      {/* Image */}
      <div className={`overflow-hidden ${imgClass}`}>
        <img
          src={suite.image}
          alt={suite.name}
          className={`suite-img ${imgClass} w-full`}
        />
      </div>

      {/* Body */}
      <div className="p-6">
        {/* Index + location row */}
        <div className="flex items-center justify-between mb-3">
          <span className="card-index">{suite.id}</span>
          <div className="flex items-center gap-1 text-slate-light">
            <MapPin size={11} strokeWidth={1.5} className="text-amber" />
            <span className="font-body text-xs text-slate">{suite.location}</span>
          </div>
        </div>

        {/* Name */}
        <h3 className="font-display text-charcoal text-xl md:text-2xl font-semibold leading-tight mb-1">
          {suite.name}
        </h3>

        {/* Tagline */}
        <p className="font-display italic text-slate text-sm mb-3 font-normal">
          {suite.tagline}
        </p>

        {/* Description — truncated */}
        <p className="font-body text-slate text-sm leading-relaxed line-clamp-2 mb-5">
          {suite.description}
        </p>

        {/* Amenities */}
        <div className="flex flex-wrap gap-2 mb-6">
          {suite.amenities.slice(0, 3).map((a) => (
            <span key={a} className="amenity-pill">{a}</span>
          ))}
          {suite.amenities.length > 3 && (
            <span className="amenity-pill text-amber border-amber/30">
              +{suite.amenities.length - 3} more
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between border-t border-charcoal/10 pt-4">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-display text-charcoal text-xl font-semibold">
                {formatKES(suite.pricePerNight)}
              </span>
              <span className="font-body text-xs text-slate"> / night</span>
            </div>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex items-center gap-1">
                <Star size={11} fill="#C8860A" stroke="none" />
                <span className="font-body text-xs text-slate font-medium">
                  {suite.rating}
                </span>
                <span className="font-body text-xs text-slate/50">
                  ({suite.reviewCount})
                </span>
              </div>
              <div className="flex items-center gap-1 text-slate/50">
                <Users size={11} strokeWidth={1.5} />
                <span className="font-body text-xs">Up to {suite.maxGuests}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onBook(suite)}
            className="btn-amber text-xs px-5 py-2.5"
          >
            Reserve
          </button>
        </div>
      </div>
    </article>
  );
}