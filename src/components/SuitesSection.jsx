import { useState, useEffect } from "react";
import API from "../api";
import SuiteCard from "./SuiteCard";
import BookingModal from "./BookingModal";

const FILTERS = ["All", "Beach", "Safari", "City", "Lake"];

const FILTER_MAP = {
  Beach:  ["diani-beachfront", "lamu-archipelago-suite"],
  Safari: ["amboseli-camp-suite", "rift-valley-pavilion"],
  City:   ["nairobi-penthouse"],
  Lake:   ["kisumu-lakeside", "rift-valley-pavilion"],
};

export default function SuitesSection() {
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeSuite, setActiveSuite] = useState(null);

  useEffect(() => {
    const fetchSuites = async () => {
      try {
        const res = await fetch(API + "/api/suites");
        if (!res.ok) throw new Error("Failed to load properties.");
        const data = await res.json();
        setSuites(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSuites();
  }, []);

  const visible =
    activeFilter === "All"
      ? suites
      : suites.filter((s) => FILTER_MAP[activeFilter]?.includes(s.slug));

  return (
    <section id="suites" className="bg-ivory py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="font-body text-xs tracking-widest uppercase text-amber mb-3">
              The Collection
            </p>
            <h2 className="font-display text-charcoal text-3xl md:text-5xl font-normal leading-tight">
              Our properties.
              <br />
              <em className="italic">One country.</em>
            </h2>
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={
                  "font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-150 " +
                  (activeFilter === f
                    ? "bg-charcoal text-ivory border-charcoal"
                    : "border-charcoal/20 text-slate hover:border-charcoal/60")
                }
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="py-20 text-center">
            <p className="font-display italic text-slate text-xl animate-pulse">
              Loading properties...
            </p>
          </div>
        )}

        {error && (
          <div className="py-20 text-center">
            <p className="font-display italic text-red-400 text-xl">{error}</p>
          </div>
        )}

        {!loading && !error && visible.length === 0 && (
          <div className="py-20 text-center">
            <p className="font-display italic text-slate text-xl">
              No properties in this category right now.
            </p>
          </div>
        )}

        {!loading && !error && visible.length > 0 && (
          <div className="suites-grid">
            {visible.map((suite, i) => (
              <SuiteCard
                key={suite._id}
                suite={suite}
                index={i}
                onBook={(s) => setActiveSuite(s)}
              />
            ))}
          </div>
        )}
      </div>

      {activeSuite && (
        <BookingModal
          suite={activeSuite}
          onClose={() => setActiveSuite(null)}
        />
      )}
    </section>
  );
}