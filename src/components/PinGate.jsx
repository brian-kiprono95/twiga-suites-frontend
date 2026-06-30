import { useState } from "react";
import API from "../api";
import { Lock, Loader, AlertCircle } from "lucide-react";

export default function PinGate({ onSuccess }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pin) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(API + "/api/admin/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Incorrect PIN.");
        setLoading(false);
        return;
      }

      sessionStorage.setItem("twiga-admin", data.token);
      onSuccess();
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-charcoal flex items-center justify-center px-6">
      <div className="bg-ivory w-full max-w-sm p-10" style={{ borderTop: "3px solid #C8860A" }}>
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-amber/10 border border-amber/30 flex items-center justify-center mx-auto mb-4">
            <Lock size={20} strokeWidth={1.5} className="text-amber" />
          </div>
          <h1 className="font-display text-charcoal text-2xl mb-1">Admin Access</h1>
          <p className="font-body text-slate text-xs tracking-wide">
            Twiga Suites · Management Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="form-label" htmlFor="pin">Enter Admin PIN</label>
            <input
              id="pin"
              type="password"
              inputMode="numeric"
              maxLength={6}
              className={"form-input text-center text-2xl tracking-widest " + (error ? "border-red-400" : "")}
              placeholder="••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              autoFocus
            />
            {error && (
              <div className="flex items-center gap-2 mt-2">
                <AlertCircle size={13} className="text-red-500 flex-shrink-0" />
                <p className="text-xs text-red-500 font-body">{error}</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !pin}
            className="btn-amber w-full justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader size={14} className="animate-spin" />
                Verifying...
              </>
            ) : (
              "Access Dashboard"
            )}
          </button>
        </form>

        <p className="font-body text-xs text-slate/40 text-center mt-6">
          Authorized personnel only.
        </p>
      </div>
    </div>
  );
}