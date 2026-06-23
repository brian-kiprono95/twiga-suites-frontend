import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertCircle, Loader, Shield, Phone } from "lucide-react";
import { formatKES } from "../data/suites";

const INITIAL_FORM = {
  fullName: "",
  email: "",
  phone: "",
  checkIn: "",
  checkOut: "",
  guests: 1,
};

const KENYAN_PHONE = /^(\+254|0)[17]\d{8}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function nightsBetween(a, b) {
  if (!a || !b) return 0;
  const diff = new Date(b) - new Date(a);
  return Math.max(0, Math.round(diff / 86_400_000));
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BookingModal({ suite, onClose }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState("form"); // form | deposit | loading | success | error
  const overlayRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const set = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim() || form.fullName.trim().split(" ").length < 2)
      errs.fullName = "Please enter your full name.";
    if (!EMAIL_RE.test(form.email))
      errs.email = "Enter a valid email address.";
    if (!KENYAN_PHONE.test(form.phone.replace(/\s/g, "")))
      errs.phone = "Use format 07XX XXX XXX or +254 7XX XXX XXX.";
    if (!form.checkIn)
      errs.checkIn = "Select a check-in date.";
    if (!form.checkOut)
      errs.checkOut = "Select a check-out date.";
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn))
      errs.checkOut = "Check-out must be after check-in.";
    if (form.guests < 1 || form.guests > suite.maxGuests)
      errs.guests = "Invalid guest count.";
    return errs;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setStep("deposit");
  };

  const handlePayDeposit = async () => {
    setStep("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          suiteId: suite.id,
          suiteName: suite.name,
          totalAmount: totalCost,
          depositAmount: deposit,
        }),
      });
      if (!res.ok) throw new Error("Server error");
      setStep("success");
    } catch {
      setStep("error");
    }
  };

  const nights = nightsBetween(form.checkIn, form.checkOut);
  const totalCost = suite.pricePerNight * nights;
  const deposit = Math.ceil(totalCost / 2);
  const today = new Date().toISOString().split("T")[0];

  // Success screen
  if (step === "success") {
    const bookingRef = "TWG-" + Date.now() + "-" + Math.random().toString(36).substr(2, 4).toUpperCase();
    const balance = totalCost - deposit;

    const handlePrint = () => {
      const receiptContent = `
        <html>
          <head>
            <title>Twiga Suites - Booking Receipt</title>
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body { font-family: 'Courier New', monospace; padding: 40px; max-width: 420px; margin: 0 auto; color: #1C1A17; }
              .header { text-align: center; border-bottom: 2px solid #1C1A17; padding-bottom: 16px; margin-bottom: 16px; }
              .brand { font-size: 22px; font-weight: bold; letter-spacing: 6px; text-transform: uppercase; }
              .brand-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 4px; color: #3D3830; }
              .title { font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin-top: 8px; }
              .ref { text-align: center; background: #1C1A17; color: #F5F0E8; padding: 8px; margin: 16px 0; font-size: 13px; letter-spacing: 2px; }
              .section { border-bottom: 1px dashed #3D3830; padding: 12px 0; }
              .row { display: flex; justify-content: space-between; margin-bottom: 6px; font-size: 12px; }
              .row .label { color: #3D3830; }
              .row .value { font-weight: bold; text-align: right; max-width: 60%; }
              .totals { padding: 12px 0; }
              .total-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
              .total-row.deposit { color: #C8860A; font-weight: bold; }
              .total-row.balance { font-weight: bold; font-size: 14px; border-top: 1px solid #1C1A17; padding-top: 8px; margin-top: 4px; }
              .footer { text-align: center; margin-top: 20px; padding-top: 16px; border-top: 2px solid #1C1A17; }
              .footer p { font-size: 11px; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 4px; color: #3D3830; }
              .arrival-note { text-align: center; margin-top: 16px; font-size: 11px; border: 1px solid #1C1A17; padding: 10px; letter-spacing: 1px; text-transform: uppercase; }
              @media print { body { padding: 20px; } }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="brand">Twiga Suites</div>
              <div class="brand-sub">Kenya Collection</div>
              <div class="title">Booking Confirmation Receipt</div>
            </div>

            <div class="ref">${bookingRef}</div>

            <div class="section">
              <div class="row"><span class="label">Guest Name</span><span class="value">${form.fullName}</span></div>
              <div class="row"><span class="label">Email</span><span class="value">${form.email}</span></div>
              <div class="row"><span class="label">Phone</span><span class="value">${form.phone}</span></div>
            </div>

            <div class="section">
              <div class="row"><span class="label">Suite</span><span class="value">${suite.name}</span></div>
              <div class="row"><span class="label">Location</span><span class="value">${suite.location}</span></div>
              <div class="row"><span class="label">Guests</span><span class="value">${form.guests}</span></div>
              <div class="row"><span class="label">Check-in</span><span class="value">${formatDate(form.checkIn)}</span></div>
              <div class="row"><span class="label">Check-out</span><span class="value">${formatDate(form.checkOut)}</span></div>
              <div class="row"><span class="label">Nights</span><span class="value">${nights}</span></div>
            </div>

            <div class="totals">
              <div class="total-row"><span>Total Stay Cost</span><span>${formatKES(totalCost)}</span></div>
              <div class="total-row deposit"><span>Deposit Paid (50%)</span><span>${formatKES(deposit)}</span></div>
              <div class="total-row balance"><span>Balance Due on Arrival</span><span>${formatKES(balance)}</span></div>
            </div>

            <div class="arrival-note">
              Present this receipt on arrival to the property
            </div>

            <div class="footer">
              <p>Westlands, Nairobi, Kenya</p>
              <p>hello@twigasuites.co.ke</p>
              <p>+254 729 915 560</p>
              <p style="margin-top: 8px; font-size: 10px;">Generated: ${new Date().toLocaleString("en-KE")}</p>
            </div>
          </body>
        </html>
      `;

      const printWindow = window.open("", "_blank", "width=500,height=700");
      printWindow.document.write(receiptContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    };

    return (
      <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
        <div className="bg-ivory w-full max-w-md p-10 text-center" style={{ borderTop: "3px solid #C8860A" }}>
          <CheckCircle size={48} strokeWidth={1.2} className="text-amber mx-auto mb-4" />
          <h2 className="font-display text-charcoal text-2xl mb-2">Reservation Confirmed</h2>
          <p className="font-body text-slate text-sm leading-relaxed mb-1">
            Your booking at <strong className="text-charcoal">{suite.name}</strong> has been received.
          </p>
          <p className="font-body text-slate/60 text-xs mb-2">
            Booking reference: <strong className="text-charcoal">{bookingRef}</strong>
          </p>
          <p className="font-body text-slate/60 text-xs mb-8">
            Print your receipt and present it on arrival.
          </p>

          <div className="space-y-3">
            <button
              onClick={handlePrint}
              className="btn-amber w-full justify-center"
            >
              Download / Print Receipt
            </button>
            <button
              onClick={onClose}
              className="btn-ghost w-full justify-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Deposit summary screen
  if (step === "deposit") {
    return (
      <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
        <div className="bg-ivory w-full max-w-lg relative" style={{ borderTop: "3px solid #C8860A" }}>

          <div className="sticky top-0 bg-ivory border-b border-charcoal/10 px-6 md:px-8 py-5 flex items-start justify-between z-10">
            <div>
              <p className="card-index mb-1">{suite.id}</p>
              <h2 className="font-display text-charcoal text-lg font-semibold leading-tight">
                Review Your Reservation
              </h2>
            </div>
            <button onClick={onClose} className="text-slate hover:text-charcoal transition-colors mt-1 ml-4">
              <X size={20} strokeWidth={1.5} />
            </button>
          </div>

          <div className="px-6 md:px-8 py-8 space-y-6">

            {/* Booking summary */}
            <div className="bg-ivory-warm border border-charcoal/10 p-5 space-y-3">
              <h3 className="font-body text-xs tracking-widest uppercase text-amber mb-4">
                Booking Summary
              </h3>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Guest</span>
                <span className="text-charcoal font-medium">{form.fullName}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Suite</span>
                <span className="text-charcoal font-medium">{suite.name}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Location</span>
                <span className="text-charcoal font-medium">{suite.location}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Check-in</span>
                <span className="text-charcoal font-medium">{formatDate(form.checkIn)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Check-out</span>
                <span className="text-charcoal font-medium">{formatDate(form.checkOut)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Guests</span>
                <span className="text-charcoal font-medium">{form.guests}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate">Nights</span>
                <span className="text-charcoal font-medium">{nights}</span>
              </div>
              <div className="border-t border-charcoal/10 pt-3 flex justify-between font-body text-sm">
                <span className="text-slate">Rate per night</span>
                <span className="text-charcoal font-medium">{formatKES(suite.pricePerNight)}</span>
              </div>
              <div className="flex justify-between font-body text-sm">
                <span className="text-slate font-medium">Total Stay Cost</span>
                <span className="text-charcoal font-semibold">{formatKES(totalCost)}</span>
              </div>
            </div>

            {/* Deposit callout */}
            <div className="border border-amber/40 bg-amber/5 p-5 space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <Shield size={14} className="text-amber flex-shrink-0" />
                <span className="font-body text-xs tracking-widest uppercase text-amber">
                  Deposit Required to Secure Booking
                </span>
              </div>
              <p className="font-body text-slate text-sm leading-relaxed">
                To confirm your reservation, a deposit of{" "}
                <strong className="text-charcoal">50% of the total stay cost</strong> is required.
                The remaining balance is settled directly at the property on arrival.
              </p>
              <div className="border-t border-amber/20 pt-3 mt-3 flex justify-between items-center">
                <span className="font-body text-sm text-slate">Deposit due now</span>
                <span className="font-display text-amber text-2xl font-semibold">
                  {formatKES(deposit)}
                </span>
              </div>
            </div>

            {/* M-Pesa notice */}
            <div className="flex items-start gap-3 bg-charcoal/5 border border-charcoal/10 px-4 py-4">
              <Phone size={14} className="text-charcoal flex-shrink-0 mt-0.5" />
              <p className="font-body text-xs text-slate leading-relaxed">
                After clicking <strong className="text-charcoal">"Pay Deposit via M-Pesa"</strong>,
                you will receive an <strong className="text-charcoal">M-Pesa STK Push</strong> on{" "}
                <strong className="text-charcoal">{form.phone}</strong>. Enter your M-Pesa PIN to
                complete the deposit. Do not close this window until the payment is confirmed.
              </p>
            </div>

            {step === "error" && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 px-4 py-3">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
                <p className="font-body text-sm text-red-700">
                  Something went wrong. Please try again.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setStep("form")}
                className="btn-ghost flex-1 justify-center"
              >
                Edit Details
              </button>
              <button
                onClick={handlePayDeposit}
                className="btn-amber flex-1 justify-center gap-2"
              >
                Pay Deposit via M-Pesa
              </button>
            </div>

            <p className="font-body text-xs text-slate/50 text-center leading-relaxed">
              Your reservation is only confirmed once the deposit payment is received.
              Deposits are non-refundable within 48 hours of check-in.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Loading screen
  if (step === "loading") {
    return (
      <div className="modal-overlay" ref={overlayRef}>
        <div className="bg-ivory w-full max-w-sm p-10 text-center" style={{ borderTop: "3px solid #C8860A" }}>
          <Loader size={36} strokeWidth={1.2} className="text-amber mx-auto mb-4 animate-spin" />
          <h2 className="font-display text-charcoal text-xl mb-2">Processing Payment</h2>
          <p className="font-body text-slate text-sm leading-relaxed">
            Check your phone for the M-Pesa prompt on <strong>{form.phone}</strong> and enter your PIN.
          </p>
        </div>
      </div>
    );
  }

  // Form screen
  return (
    <div className="modal-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div
        className="bg-ivory w-full max-w-2xl max-h-[92vh] overflow-y-auto relative"
        style={{ borderTop: "3px solid #C8860A" }}
      >
        <div className="sticky top-0 bg-ivory border-b border-charcoal/10 px-6 md:px-8 py-5 flex items-start justify-between z-10">
          <div>
            <p className="card-index mb-1">{suite.id}</p>
            <h2 className="font-display text-charcoal text-lg font-semibold leading-tight">
              {suite.name}
            </h2>
            <p className="font-body text-slate text-xs mt-0.5">{suite.location}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate hover:text-charcoal transition-colors mt-1 ml-4 flex-shrink-0"
            aria-label="Close"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} noValidate className="px-6 md:px-8 py-8 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                className={"form-input " + (errors.fullName ? "border-red-400" : "")}
                type="text"
                placeholder="Amina Wanjiku Njoroge"
                value={form.fullName}
                onChange={set("fullName")}
                autoComplete="name"
              />
              {errors.fullName && <p className="mt-1.5 text-xs text-red-500 font-body">{errors.fullName}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                className={"form-input " + (errors.email ? "border-red-400" : "")}
                type="email"
                placeholder="amina@example.co.ke"
                value={form.email}
                onChange={set("email")}
                autoComplete="email"
              />
              {errors.email && <p className="mt-1.5 text-xs text-red-500 font-body">{errors.email}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              className={"form-input " + (errors.phone ? "border-red-400" : "")}
              type="tel"
              placeholder="0712 345 678 or +254 712 345 678"
              value={form.phone}
              onChange={set("phone")}
              autoComplete="tel"
            />
            {errors.phone && <p className="mt-1.5 text-xs text-red-500 font-body">{errors.phone}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="form-label" htmlFor="checkIn">Check-in Date</label>
              <input
                id="checkIn"
                className={"form-input " + (errors.checkIn ? "border-red-400" : "")}
                type="date"
                min={today}
                value={form.checkIn}
                onChange={set("checkIn")}
              />
              {errors.checkIn && <p className="mt-1.5 text-xs text-red-500 font-body">{errors.checkIn}</p>}
            </div>
            <div>
              <label className="form-label" htmlFor="checkOut">Check-out Date</label>
              <input
                id="checkOut"
                className={"form-input " + (errors.checkOut ? "border-red-400" : "")}
                type="date"
                min={form.checkIn || today}
                value={form.checkOut}
                onChange={set("checkOut")}
              />
              {errors.checkOut && <p className="mt-1.5 text-xs text-red-500 font-body">{errors.checkOut}</p>}
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="guests">
              Number of Guests
              <span className="text-slate/50 normal-case"> (max {suite.maxGuests})</span>
            </label>
            <select
              id="guests"
              className={"form-input " + (errors.guests ? "border-red-400" : "")}
              value={form.guests}
              onChange={set("guests")}
            >
              {Array.from({ length: suite.maxGuests }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n} {n === 1 ? "Guest" : "Guests"}</option>
              ))}
            </select>
            {errors.guests && <p className="mt-1.5 text-xs text-red-500 font-body">{errors.guests}</p>}
          </div>

          {nights > 0 && (
            <div className="bg-ivory-warm border border-charcoal/10 px-5 py-4 space-y-2">
              <div className="flex justify-between font-body text-sm text-slate">
                <span>{formatKES(suite.pricePerNight)} x {nights} {nights === 1 ? "night" : "nights"}</span>
                <span className="text-charcoal font-medium">{formatKES(totalCost)}</span>
              </div>
              <div className="flex justify-between font-body text-sm text-slate">
                <span>Deposit (50%)</span>
                <span className="text-amber font-medium">{formatKES(deposit)}</span>
              </div>
              <div className="border-t border-charcoal/10 pt-2 flex justify-between font-body text-sm">
                <span className="font-medium text-charcoal">Total Stay Cost</span>
                <span className="font-display text-charcoal text-base font-semibold">{formatKES(totalCost)}</span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-amber w-full flex items-center justify-center gap-2">
            Review Reservation
          </button>

          <p className="font-body text-xs text-slate/50 text-center leading-relaxed">
            You will review your booking details and deposit amount before any payment is made.
          </p>
        </form>
      </div>
    </div>
  );
}