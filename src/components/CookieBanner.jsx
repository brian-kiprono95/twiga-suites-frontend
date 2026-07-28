import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("twiga-cookie-consent");
    if (!consent) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("twiga-cookie-consent", "accepted");
    setVisible(false);
    // Enable Google Analytics
    window.gtag("consent", "update", {
      analytics_storage: "granted",
    });
  };

  const decline = () => {
    localStorage.setItem("twiga-cookie-consent", "declined");
    setVisible(false);
    // Disable Google Analytics
    window.gtag("consent", "update", {
      analytics_storage: "denied",
    });
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-charcoal border-t border-amber/30 px-6 py-5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="text-amber text-xl flex-shrink-0">🍪</span>
          <div>
            <p className="font-body text-ivory text-sm leading-relaxed">
              We use cookies to improve your experience and analyze site traffic
              via Google Analytics. Your data helps us improve Twiga Suites for
              everyone.
            </p>
            <p className="font-body text-ivory/40 text-xs mt-1">
              By accepting you consent to our use of cookies.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="font-body text-xs tracking-widest uppercase text-ivory/50 border border-ivory/20 px-5 py-2.5 hover:border-ivory/40 hover:text-ivory transition-colors"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="btn-amber text-xs px-5 py-2.5"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}