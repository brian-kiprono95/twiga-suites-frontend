import { useState, useEffect } from "react";
import { LogOut, RefreshCw, CheckCircle, XCircle, Clock, TrendingUp, Calendar, Trash2, PlusCircle, Edit2 } from "lucide-react";
import { formatKES } from "../data/suites";

const STATUS_STYLES = {
  pending:   "bg-amber/10 text-amber border border-amber/30",
  confirmed: "bg-green-50 text-green-700 border border-green-200",
  cancelled: "bg-red-50 text-red-600 border border-red-200",
};

const STATUS_ICONS = {
  pending:   <Clock size={11} />,
  confirmed: <CheckCircle size={11} />,
  cancelled: <XCircle size={11} />,
};

const EMPTY_SUITE_FORM = {
  name: "",
  location: "",
  tagline: "",
  description: "",
  pricePerNight: "",
  maxGuests: "",
  bedrooms: "",
  bathrooms: "",
  image: "",
  cardSize: "medium",
  amenities: "",
  rating: "",
  reviewCount: "",
};

function StatCard({ icon, label, value, sub }) {
  return (
    <div className="bg-ivory border-l-2 border-amber p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-amber">{icon}</span>
      </div>
      <p className="font-display text-charcoal text-3xl font-semibold mb-1">{value}</p>
      <p className="font-body text-xs tracking-widest uppercase text-slate">{label}</p>
      {sub && <p className="font-body text-xs text-slate/50 mt-1">{sub}</p>}
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [data, setData] = useState(null);
  const [suites, setSuites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showSuiteForm, setShowSuiteForm] = useState(false);
  const [editingSuite, setEditingSuite] = useState(null);
  const [suiteForm, setSuiteForm] = useState(EMPTY_SUITE_FORM);
  const [suiteFormLoading, setSuiteFormLoading] = useState(false);
  const [suiteFormError, setSuiteFormError] = useState("");

  const fetchDashboard = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/dashboard");
      if (!res.ok) throw new Error("Failed to load dashboard.");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuites = async () => {
    try {
      const res = await fetch("/api/suites/admin");
      if (!res.ok) throw new Error("Failed to load properties.");
      const json = await res.json();
      setSuites(json);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchDashboard();
    fetchSuites();
  }, []);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/bookings/" + id + "/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed.");
      await fetchDashboard();
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleSuiteFormChange = (field) => (e) => {
    setSuiteForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const openAddForm = () => {
    setEditingSuite(null);
    setSuiteForm(EMPTY_SUITE_FORM);
    setSuiteFormError("");
    setShowSuiteForm(true);
  };

  const openEditForm = (suite) => {
    setEditingSuite(suite);
    setSuiteForm({
      name: suite.name,
      location: suite.location,
      tagline: suite.tagline,
      description: suite.description,
      pricePerNight: suite.pricePerNight,
      maxGuests: suite.maxGuests,
      bedrooms: suite.bedrooms,
      bathrooms: suite.bathrooms,
      image: suite.image,
      cardSize: suite.cardSize,
      amenities: suite.amenities.join(", "),
      rating: suite.rating,
      reviewCount: suite.reviewCount,
    });
    setSuiteFormError("");
    setShowSuiteForm(true);
  };

  const handleSuiteSubmit = async (e) => {
    e.preventDefault();
    setSuiteFormLoading(true);
    setSuiteFormError("");

    const payload = {
      ...suiteForm,
      pricePerNight: Number(suiteForm.pricePerNight),
      maxGuests: Number(suiteForm.maxGuests),
      bedrooms: Number(suiteForm.bedrooms),
      bathrooms: Number(suiteForm.bathrooms),
      rating: Number(suiteForm.rating),
      reviewCount: Number(suiteForm.reviewCount),
      amenities: suiteForm.amenities.split(",").map((a) => a.trim()).filter(Boolean),
    };

    try {
      const url = editingSuite
        ? "/api/suites/" + editingSuite._id
        : "/api/suites";
      const method = editingSuite ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.message || "Failed to save property.");

      await fetchSuites();
      setShowSuiteForm(false);
      setEditingSuite(null);
      setSuiteForm(EMPTY_SUITE_FORM);
    } catch (err) {
      setSuiteFormError(err.message);
    } finally {
      setSuiteFormLoading(false);
    }
  };

  const handleDeleteSuite = async (id) => {
    if (!window.confirm("Remove this property from the listing?")) return;
    try {
      const res = await fetch("/api/suites/" + id, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to remove property.");
      await fetchSuites();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("twiga-admin");
    onLogout();
  };

  const filteredBookings = data?.bookings?.filter((b) =>
    filterStatus === "all" ? true : b.status === filterStatus
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory-warm flex items-center justify-center">
        <div className="text-center">
          <RefreshCw size={32} strokeWidth={1.2} className="text-amber mx-auto mb-3 animate-spin" />
          <p className="font-body text-sm text-slate tracking-wide">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-ivory-warm flex items-center justify-center">
        <div className="text-center">
          <p className="font-body text-sm text-red-500 mb-4">{error}</p>
          <button onClick={fetchDashboard} className="btn-amber">Retry</button>
        </div>
      </div>
    );
  }

  const { stats, bookings } = data;

  return (
    <div className="min-h-screen bg-ivory-warm">
      {/* Top bar */}
      <header className="bg-charcoal px-6 md:px-10 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-amber font-body font-medium tracking-widest uppercase text-sm">Twiga</span>
          <span className="w-px h-4 bg-ivory/20 inline-block" />
          <span className="font-display italic text-ivory/80 text-sm">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => { fetchDashboard(); fetchSuites(); }} className="text-ivory/40 hover:text-ivory transition-colors" title="Refresh">
            <RefreshCw size={16} strokeWidth={1.5} />
          </button>
          <button onClick={handleLogout} className="flex items-center gap-2 font-body text-xs tracking-widest uppercase text-ivory/40 hover:text-ivory transition-colors">
            <LogOut size={14} strokeWidth={1.5} />
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {/* Page title */}
        <div className="mb-8">
          <p className="font-body text-xs tracking-widest uppercase text-amber mb-1">Management Portal</p>
          <h1 className="font-display text-charcoal text-3xl md:text-4xl font-normal">Dashboard</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard icon={<Calendar size={18} strokeWidth={1.5} />} label="Total Bookings" value={stats.totalBookings} />
          <StatCard icon={<Clock size={18} strokeWidth={1.5} />} label="Pending" value={stats.pendingBookings} />
          <StatCard icon={<CheckCircle size={18} strokeWidth={1.5} />} label="Confirmed" value={stats.confirmedBookings} />
          <StatCard icon={<TrendingUp size={18} strokeWidth={1.5} />} label="Total Deposits" value={formatKES(stats.totalDeposits)} sub="collected so far" />
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-charcoal/10">
          {["bookings", "properties"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={
                "font-body text-xs tracking-widest uppercase px-5 py-3 border-b-2 transition-all duration-150 -mb-px " +
                (activeTab === tab
                  ? "border-amber text-charcoal"
                  : "border-transparent text-slate hover:text-charcoal")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === "bookings" && (
          <>
            <div className="flex flex-wrap gap-2 mb-6">
              {["all", "pending", "confirmed", "cancelled"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilterStatus(f)}
                  className={
                    "font-body text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-150 " +
                    (filterStatus === f
                      ? "bg-charcoal text-ivory border-charcoal"
                      : "border-charcoal/20 text-slate hover:border-charcoal/60")
                  }
                >
                  {f === "all" ? "All" : f}
                  {f !== "all" && (
                    <span className="ml-2 opacity-50">
                      ({bookings.filter((b) => b.status === f).length})
                    </span>
                  )}
                </button>
              ))}
            </div>

            {filteredBookings.length === 0 ? (
              <div className="py-20 text-center bg-ivory border-l-2 border-amber">
                <p className="font-display italic text-slate text-xl">No bookings found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full bg-ivory border-l-2 border-amber">
                  <thead>
                    <tr className="border-b border-charcoal/10">
                      {["Guest", "Suite", "Check-in", "Check-out", "Guests", "Deposit", "Status", "Actions"].map((h) => (
                        <th key={h} className="font-body text-xs tracking-widest uppercase text-slate text-left px-5 py-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking._id} className="border-b border-charcoal/5 hover:bg-ivory-warm transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-body text-sm text-charcoal font-medium">{booking.fullName}</p>
                          <p className="font-body text-xs text-slate/60">{booking.email}</p>
                          <p className="font-body text-xs text-slate/60">{booking.phone}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-sm text-charcoal">{booking.suiteName}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-sm text-charcoal">{formatDate(booking.checkIn)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-sm text-charcoal">{formatDate(booking.checkOut)}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-sm text-charcoal">{booking.guests}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-body text-sm text-charcoal font-medium">
                            {booking.depositAmount ? formatKES(booking.depositAmount) : "—"}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={"inline-flex items-center gap-1 px-2.5 py-1 text-xs font-body font-medium " + STATUS_STYLES[booking.status]}>
                            {STATUS_ICONS[booking.status]}
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col gap-1.5">
                            {booking.status !== "confirmed" && (
                              <button onClick={() => updateStatus(booking._id, "confirmed")} disabled={updatingId === booking._id} className="font-body text-xs text-green-700 border border-green-200 px-3 py-1 hover:bg-green-50 transition-colors disabled:opacity-40">Confirm</button>
                            )}
                            {booking.status !== "cancelled" && (
                              <button onClick={() => updateStatus(booking._id, "cancelled")} disabled={updatingId === booking._id} className="font-body text-xs text-red-600 border border-red-200 px-3 py-1 hover:bg-red-50 transition-colors disabled:opacity-40">Cancel</button>
                            )}
                            {booking.status !== "pending" && (
                              <button onClick={() => updateStatus(booking._id, "pending")} disabled={updatingId === booking._id} className="font-body text-xs text-amber border border-amber/30 px-3 py-1 hover:bg-amber/5 transition-colors disabled:opacity-40">Pending</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* PROPERTIES TAB */}
        {activeTab === "properties" && (
          <>
            <div className="flex justify-between items-center mb-6">
              <p className="font-body text-sm text-slate">{suites.length} {suites.length === 1 ? "property" : "properties"} total</p>
              <button onClick={openAddForm} className="btn-amber gap-2">
                <PlusCircle size={14} strokeWidth={1.5} />
                Add Property
              </button>
            </div>

            {/* Suite form */}
            {showSuiteForm && (
              <div className="bg-ivory border-l-2 border-amber p-6 mb-8">
                <h3 className="font-display text-charcoal text-xl mb-6">
                  {editingSuite ? "Edit Property" : "Add New Property"}
                </h3>

                <form onSubmit={handleSuiteSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Property Name</label>
                      <input className="form-input" type="text" placeholder="Nairobi Penthouse Suite" value={suiteForm.name} onChange={handleSuiteFormChange("name")} />
                    </div>
                    <div>
                      <label className="form-label">Location</label>
                      <input className="form-input" type="text" placeholder="Westlands, Nairobi" value={suiteForm.location} onChange={handleSuiteFormChange("location")} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Tagline</label>
                    <input className="form-input" type="text" placeholder="City skyline from 32 floors above." value={suiteForm.tagline} onChange={handleSuiteFormChange("tagline")} />
                  </div>

                  <div>
                    <label className="form-label">Description</label>
                    <textarea className="form-input min-h-24 resize-none" placeholder="Full description of the property..." value={suiteForm.description} onChange={handleSuiteFormChange("description")} />
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <label className="form-label">Price / Night (KSh)</label>
                      <input className="form-input" type="number" placeholder="25000" value={suiteForm.pricePerNight} onChange={handleSuiteFormChange("pricePerNight")} />
                    </div>
                    <div>
                      <label className="form-label">Max Guests</label>
                      <input className="form-input" type="number" placeholder="4" value={suiteForm.maxGuests} onChange={handleSuiteFormChange("maxGuests")} />
                    </div>
                    <div>
                      <label className="form-label">Bedrooms</label>
                      <input className="form-input" type="number" placeholder="2" value={suiteForm.bedrooms} onChange={handleSuiteFormChange("bedrooms")} />
                    </div>
                    <div>
                      <label className="form-label">Bathrooms</label>
                      <input className="form-input" type="number" placeholder="2" value={suiteForm.bathrooms} onChange={handleSuiteFormChange("bathrooms")} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Image URL</label>
                    <input className="form-input" type="text" placeholder="https://images.unsplash.com/..." value={suiteForm.image} onChange={handleSuiteFormChange("image")} />
                  </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Amenities (comma separated)</label>
                      <input className="form-input" type="text" placeholder="Rooftop terrace, Chef's kitchen, Parking" value={suiteForm.amenities} onChange={handleSuiteFormChange("amenities")} />
                    </div>
                    <div>
                      <label className="form-label">Card Size</label>
                      <select className="form-input" value={suiteForm.cardSize} onChange={handleSuiteFormChange("cardSize")}>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="form-label">Rating (0 - 5)</label>
                      <input className="form-input" type="number" step="0.1" min="0" max="5" placeholder="4.8" value={suiteForm.rating} onChange={handleSuiteFormChange("rating")} />
                    </div>
                    <div>
                      <label className="form-label">Review Count</label>
                      <input className="form-input" type="number" min="0" placeholder="124" value={suiteForm.reviewCount} onChange={handleSuiteFormChange("reviewCount")} />
                    </div>
                  </div>

                  {suiteFormError && (
                    <p className="font-body text-xs text-red-500">{suiteFormError}</p>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button type="submit" disabled={suiteFormLoading} className="btn-amber gap-2 disabled:opacity-60">
                      {suiteFormLoading ? "Saving..." : editingSuite ? "Save Changes" : "Add Property"}
                    </button>
                    <button type="button" onClick={() => setShowSuiteForm(false)} className="btn-ghost">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Properties list */}
            {suites.length === 0 ? (
              <div className="py-20 text-center bg-ivory border-l-2 border-amber">
                <p className="font-display italic text-slate text-xl">No properties yet.</p>
                <p className="font-body text-sm text-slate/50 mt-2">Click Add Property to get started.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {suites.map((suite) => (
                  <div key={suite._id} className={"bg-ivory border-l-2 p-5 flex gap-5 items-start " + (suite.isActive ? "border-amber" : "border-charcoal/20 opacity-50")}>
                    <img src={suite.image} alt={suite.name} className="w-24 h-20 object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="card-index mb-1">{suite.id}</p>
                          <h3 className="font-display text-charcoal text-lg font-semibold leading-tight">{suite.name}</h3>
                          <p className="font-body text-xs text-slate mt-0.5">{suite.location}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button onClick={() => openEditForm(suite)} className="font-body text-xs text-slate border border-charcoal/20 px-3 py-1.5 hover:border-charcoal/60 transition-colors flex items-center gap-1.5">
                            <Edit2 size={11} strokeWidth={1.5} />
                            Edit
                          </button>
                          <button onClick={() => handleDeleteSuite(suite._id)} className="font-body text-xs text-red-600 border border-red-200 px-3 py-1.5 hover:bg-red-50 transition-colors flex items-center gap-1.5">
                            <Trash2 size={11} strokeWidth={1.5} />
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-3">
                        <span className="font-body text-sm text-charcoal font-medium">{formatKES(suite.pricePerNight)}<span className="text-slate font-normal"> / night</span></span>
                        <span className="font-body text-xs text-slate">Up to {suite.maxGuests} guests</span>
                        <span className="font-body text-xs text-slate">{suite.bedrooms} bed · {suite.bathrooms} bath</span>
                        {!suite.isActive && <span className="font-body text-xs text-red-500 border border-red-200 px-2 py-0.5">Removed</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}