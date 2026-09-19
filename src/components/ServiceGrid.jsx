import React from "react";
import { SERVICES } from "../data/mockWorkers";
import { Zap, CheckCircle2, Clock } from "lucide-react";

export default function ServiceGrid({ selectedService, onSelectService, lang }) {
  return (
    <div className="service-grid-section">
      <div className="section-header">
        <div className="section-title-wrapper">
          <h2 className="section-title">
            {lang === "hi"
              ? "सर्विस चुनें (Select Home Service)"
              : lang === "hinglish"
              ? "Kon si Service Chahiye?"
              : "Choose a Home Service"}
          </h2>
          <p className="section-subtitle">
            {lang === "hi"
              ? "अपनी आवश्यकता के अनुसार सर्विस सेलेक्ट करें - तुरंत नजदीकी कारीगर मिलेंगे"
              : "Select a service category to scan nearby available workers live on the map"}
          </p>
        </div>
      </div>

      <div className="services-grid">
        {SERVICES.map((srv) => {
          const isSelected = selectedService === srv.id;
          const srvName = srv.name[lang] || srv.name.en;
          const srvDesc = srv.description[lang] || srv.description.en;

          return (
            <div
              key={srv.id}
              className={`service-card ${isSelected ? "selected" : ""}`}
              onClick={() => onSelectService(srv.id)}
              style={{ "--accent-color": srv.color }}
            >
              <div className="service-card-top">
                <span className="service-emoji-badge">{srv.icon}</span>
                {isSelected && <CheckCircle2 className="service-selected-icon" size={20} />}
                <span className="service-time-tag">
                  <Clock size={12} /> {srv.estTime}
                </span>
              </div>

              <h3 className="service-name">{srvName}</h3>
              <p className="service-description">{srvDesc}</p>

              <div className="service-card-bottom">
                <span className="service-price-starts">
                  Starts at <strong>₹{srv.basePrice}</strong>
                </span>
                <button className={`service-select-btn ${isSelected ? "active" : ""}`}>
                  {isSelected ? (lang === "hi" ? "चयनित" : "Selected") : (lang === "hi" ? "बुक करें" : "Book")}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
