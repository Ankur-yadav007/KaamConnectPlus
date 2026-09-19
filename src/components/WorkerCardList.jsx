import React from "react";
import { Star, ShieldCheck, MapPin, Bike, Phone, Clock, Award, Zap, ChevronRight, Check } from "lucide-react";

export default function WorkerCardList({
  workers,
  selectedService,
  userCoords,
  selectedWorker,
  onSelectWorker,
  onInstantBookFastest,
  lang,
  radiusKm
}) {
  // Distance calculator helper
  const getDistanceKm = (lat, lng) => {
    if (!userCoords || !userCoords[0]) return 2.5;
    const R = 6371;
    const dLat = ((lat - userCoords[0]) * Math.PI) / 180;
    const dLon = ((lng - userCoords[1]) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userCoords[0] * Math.PI) / 180) *
        Math.cos((lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Sort workers by distance
  const sortedWorkers = [...workers].map((w) => {
    const dist = getDistanceKm(w.lat, w.lng);
    const eta = Math.max(5, Math.round(dist * 4 + 3));
    return { ...w, distanceKm: dist, etaMins: eta };
  }).sort((a, b) => a.distanceKm - b.distanceKm);

  const fastestWorker = sortedWorkers[0];

  return (
    <div className="worker-list-section">
      {/* Radar scanning header bar */}
      <div className="radar-banner">
        <div className="radar-animation-box">
          <div className="radar-sweep"></div>
          <Zap className="radar-icon text-amber-400" size={24} />
        </div>
        <div className="radar-info">
          <h3>
            {lang === "hi"
              ? `आपकी लोकेशन के पास ${sortedWorkers.length} कारीगर मिले!`
              : `Found ${sortedWorkers.length} available workers near your location`}
          </h3>
          <p>
            {selectedService ? `Category: ${selectedService}` : "All Services"} • Within {radiusKm} KM radius
          </p>
        </div>

        {fastestWorker && (
          <button className="instant-book-fastest-btn" onClick={() => onInstantBookFastest(fastestWorker)}>
            <Zap className="btn-zap-icon" size={18} />
            <span>
              {lang === "hi"
                ? `फास्टेस्ट वर्कर बुक करें (~${fastestWorker.etaMins} मिनट)`
                : `Instant Book Nearest (${fastestWorker.etaMins}m away)`}
            </span>
          </button>
        )}
      </div>

      {/* Workers Grid */}
      {sortedWorkers.length === 0 ? (
        <div className="no-workers-box">
          <MapPin size={40} className="text-gray-400 mb-2" />
          <h3>
            {lang === "hi"
              ? "इस लोकेशन/दायरे में कोई वर्कर उपलब्ध नहीं है"
              : "No workers available in this radius"}
          </h3>
          <p>
            {lang === "hi"
              ? "कृपया मैप पर रेडियस (Radius) बढ़ाएं या सर्विस श्रेणी बदलें।"
              : "Try increasing the search radius on the map or select a different service."}
          </p>
        </div>
      ) : (
        <div className="workers-cards-grid">
          {sortedWorkers.map((worker) => {
            const isSelected = selectedWorker?.id === worker.id;

            return (
              <div
                key={worker.id}
                className={`worker-card ${isSelected ? "selected-card" : ""}`}
                onClick={() => onSelectWorker(worker)}
              >
                {/* Top Badge */}
                <div className="worker-card-header">
                  <div className="worker-avatar-container">
                    <img src={worker.photo} alt={worker.name} className="worker-avatar-img" />
                    {worker.verified && (
                      <span className="verified-badge-icon" title="Verified KaamConnect Worker">
                        ✓
                      </span>
                    )}
                  </div>
                  <div className="worker-main-info">
                    <div className="worker-name-row">
                      <h4 className="worker-name">{worker.name}</h4>
                      <span className="worker-rating-badge">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        <strong>{worker.rating}</strong> ({worker.reviewCount})
                      </span>
                    </div>

                    <div className="worker-meta-line">
                      <span className="worker-experience">
                        <Award size={14} /> {worker.experience} Exp
                      </span>
                      <span className="worker-vehicle">
                        <Bike size={14} /> {worker.vehicle}
                      </span>
                    </div>

                    <div className="worker-location-tag">
                      <MapPin size={14} className="text-blue-400" />
                      <span>{worker.address}</span>
                    </div>
                  </div>
                </div>

                {/* Skills tags */}
                <div className="worker-skills-list">
                  {worker.skills.map((skill, idx) => (
                    <span key={idx} className="skill-chip">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Distance & Pricing Footer */}
                <div className="worker-card-footer">
                  <div className="eta-dist-group">
                    <span className="eta-badge">
                      <Clock size={14} /> ~{worker.etaMins} mins away
                    </span>
                    <span className="dist-text">{worker.distanceKm.toFixed(1)} km away</span>
                  </div>

                  <div className="price-booking-group">
                    <div className="price-display">
                      <span className="visit-charge">Visit ₹{worker.baseRate}</span>
                      <span className="hourly-charge">₹{worker.hourlyRate}/hr</span>
                    </div>
                    <button className={`book-worker-btn ${isSelected ? "selected-btn" : ""}`}>
                      {isSelected ? (
                        <>
                          <Check size={16} /> {lang === "hi" ? "चयनित" : "Selected"}
                        </>
                      ) : (
                        <>
                          {lang === "hi" ? "बुक करें" : "Book"} <ChevronRight size={16} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
