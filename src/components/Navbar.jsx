import React from "react";
import { MapPin, ShieldCheck, UserCheck, Wrench, Globe, Clock, Smartphone, ChevronDown } from "lucide-react";
import { CITIES } from "../data/mockWorkers";

const translations = {
  en: {
    tagline: "Instant Home Services near you like Uber & Rapido",
    customerMode: "Customer Mode",
    partnerMode: "Kaamdar Partner Mode",
    activeBooking: "Active Booking",
    changeCity: "Select Location",
  },
  hi: {
    tagline: "रेपिडो और उबर की तरह आपके पास मिस्त्री व कारीगर",
    customerMode: "ग्राहक मोड",
    partnerMode: "कामदार (कारीगर) मोड",
    activeBooking: "सक्रिय बुकिंग",
    changeCity: "लोकेशन चुनें",
  },
  hinglish: {
    tagline: "Uber & Rapido ki tarah nearby worker booking",
    customerMode: "Customer Mode",
    partnerMode: "Worker Partner Mode",
    activeBooking: "Active Booking",
    changeCity: "Location Select Karein",
  }
};

export default function Navbar({
  currentCity,
  onCityChange,
  userMode,
  setUserMode,
  lang,
  setLang,
  activeBooking,
  onOpenActiveBooking,
  onDetectGPS
}) {
  const t = translations[lang] || translations.en;

  return (
    <header className="navbar-container">
      <div className="navbar-content">
        {/* Logo & Brand */}
        <div className="brand-section">
          <div className="logo-badge">
            <Wrench className="logo-icon" />
          </div>
          <div>
            <div className="brand-title">
              KaamConnect<span className="brand-plus">Plus</span>
              <span className="live-badge">LIVE 🛵</span>
            </div>
            <p className="brand-tagline">{t.tagline}</p>
          </div>
        </div>

        {/* Location Picker pill */}
        <div className="location-pill-group">
          <button className="gps-quick-btn" onClick={onDetectGPS} title="Auto-detect my GPS Location">
            <MapPin className="gps-icon pulse-animation" />
          </button>
          <div className="city-select-wrapper">
            <span className="location-label">{t.changeCity}:</span>
            <select
              className="city-select"
              value={currentCity.name}
              onChange={(e) => {
                const found = CITIES.find((c) => c.name === e.target.value);
                if (found) onCityChange(found);
              }}
            >
              {CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  📍 {city.name}, {city.state}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Booking Floating Chip (If any) */}
        {activeBooking && (
          <button className="active-booking-chip pulse-glow" onClick={onOpenActiveBooking}>
            <Clock className="spin-slow" size={16} />
            <span>{t.activeBooking}: <strong>{activeBooking.status}</strong></span>
          </button>
        )}

        {/* Controls: Mode & Language */}
        <div className="navbar-controls">
          {/* Language Switcher */}
          <div className="lang-switcher">
            <Globe size={16} className="lang-icon" />
            <select value={lang} onChange={(e) => setLang(e.target.value)} className="lang-select">
              <option value="hinglish">Hinglish</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="en">English</option>
            </select>
          </div>

          {/* Mode Switcher (Customer vs Worker Partner) */}
          <div className="mode-toggle-group">
            <button
              className={`mode-btn ${userMode === "customer" ? "active" : ""}`}
              onClick={() => setUserMode("customer")}
            >
              <UserCheck size={16} />
              <span>{t.customerMode}</span>
            </button>
            <button
              className={`mode-btn ${userMode === "partner" ? "active-partner" : ""}`}
              onClick={() => setUserMode("partner")}
            >
              <ShieldCheck size={16} />
              <span>{t.partnerMode}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
