import { useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import SuitesSection from "./components/SuitesSection";
import AboutSection from "./components/AboutSection";
import Footer from "./components/Footer";
import PinGate from "./components/PinGate";
import AdminDashboard from "./components/AdminDashboard";

function isAdminRoute() {
  return window.location.pathname === "/admin";
}

export default function App() {
  const [adminAuthed, setAdminAuthed] = useState(
    () => sessionStorage.getItem("twiga-admin") === "twiga-admin-session"
  );

  if (isAdminRoute()) {
    if (!adminAuthed) {
      return <PinGate onSuccess={() => setAdminAuthed(true)} />;
    }
    return <AdminDashboard onLogout={() => setAdminAuthed(false)} />;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <SuitesSection />
        <AboutSection />
      </main>
      <Footer />
    </div>
  );
}