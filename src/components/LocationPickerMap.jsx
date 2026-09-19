import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation, Search, Filter, Compass, Zap } from "lucide-react";

// Custom Leaflet Markers using L.divIcon
const createUserIcon = () =>
  L.divIcon({
    className: "custom-map-user-pin",
    html: `
      <div className="user-pin-wrapper">
        <div className="user-pin-pulse"></div>
        <div className="user-pin-core">📍</div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createWorkerIcon = (serviceIcon, isSelected) =>
  L.divIcon({
    className: `custom-map-worker-pin ${isSelected ? "selected" : ""}`,
    html: `
      <div className="worker-pin-badge ${isSelected ? "highlight" : ""}">
        <span className="worker-emoji">${serviceIcon || "🧰"}</span>
        <span className="worker-eta">🛵 Live</span>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });

// Map View Recenter Controller
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.setView(center, zoom || 13, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

// Map Click Listener Component
function MapClickListener({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

export default function LocationPickerMap({
  userCoords,
  setUserCoords,
  addressText,
  setAddressText,
  workers,
  selectedWorker,
  onSelectWorker,
  radiusKm,
  setRadiusKm,
  selectedService,
  lang
}) {
  const [searchInput, setSearchInput] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  // Handle address geocoding via OpenStreetMap Nominatim API
  const handleAddressSearch = async (e) => {
    e?.preventDefault();
    if (!searchInput.trim()) return;
    setIsSearching(true);
    setSearchError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchInput + ", India"
        )}`
      );
      const data = await res.json();
      if (data && data.length > 0) {
        const top = data[0];
        const newCoords = [parseFloat(top.lat), parseFloat(top.lon)];
        setUserCoords(newCoords);
        setAddressText(top.display_name);
        setSearchInput(top.display_name.split(",")[0]);
      } else {
        setSearchError(lang === "hi" ? "लोकेशन नहीं मिली, कृपया दूसरा नाम लिखें" : "Location not found in India");
      }
    } catch (err) {
      setSearchError("Failed to search location");
    } finally {
      setIsSearching(false);
    }
  };

  // Handle GPS location click
  const handleGPSDetect = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setUserCoords(coords);
        setAddressText(`Live GPS (${coords[0].toFixed(4)}, ${coords[1].toFixed(4)})`);
        setIsSearching(false);
      },
      (err) => {
        setIsSearching(false);
        alert("GPS detection failed or permission denied. Defaulting to city center.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Helper function to calculate distance between coordinates in KM
  const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of Earth in KM
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  return (
    <div className="map-picker-card">
      {/* Map Control Bar Top */}
      <div className="map-control-bar">
        <form onSubmit={handleAddressSearch} className="map-search-form">
          <div className="search-input-group">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="map-search-input"
              placeholder={
                lang === "hi"
                  ? "अपनी लोकेशन या मोहल्ला सर्च करें (जैसे Civil Lines, Elite Jhansi, Gomti Nagar)..."
                  : "Search area, colony or landmark in India..."
              }
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit" className="search-submit-btn" disabled={isSearching}>
            {isSearching ? "..." : lang === "hi" ? "खोजें" : "Search"}
          </button>
        </form>

        <button className="gps-btn" onClick={handleGPSDetect} disabled={isSearching}>
          <Navigation size={16} className="gps-nav-icon" />
          <span>{lang === "hi" ? "मेरी लाइव लोकेशन" : "Use GPS"}</span>
        </button>
      </div>

      {searchError && <div className="map-error-banner">{searchError}</div>}

      {/* Selected Location Address Banner */}
      <div className="selected-address-banner">
        <MapPin size={18} className="text-amber-500" />
        <div className="address-text-container">
          <span className="address-title">
            {lang === "hi" ? "चयनित सर्विस लोकेशन (Tap on map to change):" : "Service Pickup Location:"}
          </span>
          <span className="address-detail">{addressText || "Click on map to select pickup point"}</span>
        </div>
        <div className="radius-selector">
          <Filter size={14} />
          <span>{lang === "hi" ? "दायरा:" : "Radius:"}</span>
          <select
            value={radiusKm}
            onChange={(e) => setRadiusKm(Number(e.target.value))}
            className="radius-select"
          >
            <option value={2}>2 KM</option>
            <option value={5}>5 KM</option>
            <option value={10}>10 KM</option>
            <option value={25}>25 KM</option>
          </select>
        </div>
      </div>

      {/* Interactive Map View */}
      <div className="leaflet-wrapper">
        <MapContainer
          center={userCoords}
          zoom={13}
          scrollWheelZoom={true}
          style={{ height: "420px", width: "100%", borderRadius: "16px" }}
        >
          <ChangeView center={userCoords} zoom={13} />
          <MapClickListener
            onMapClick={(newCoords) => {
              setUserCoords(newCoords);
              setAddressText(`Custom Pin Location (${newCoords[0].toFixed(4)}, ${newCoords[1].toFixed(4)})`);
            }}
          />

          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User Location Pin */}
          <Marker position={userCoords} icon={createUserIcon()}>
            <Popup>
              <div className="map-popup-card">
                <strong>📍 Your Service Pickup Point</strong>
                <p>{addressText}</p>
              </div>
            </Popup>
          </Marker>

          {/* Radius Circle */}
          <Circle
            center={userCoords}
            radius={radiusKm * 1000}
            pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.1, weight: 2, dashArray: "6, 6" }}
          />

          {/* Workers Nearby Pins */}
          {workers.map((worker) => {
            const dist = calculateDistanceKm(userCoords[0], userCoords[1], worker.lat, worker.lng);
            const etaMins = Math.max(5, Math.round(dist * 4 + 3));
            const isSelected = selectedWorker?.id === worker.id;

            return (
              <Marker
                key={worker.id}
                position={[worker.lat, worker.lng]}
                icon={createWorkerIcon(worker.service === "Electrician" ? "⚡" : worker.service === "Plumber" ? "🔧" : "🧰", isSelected)}
                eventHandlers={{
                  click: () => onSelectWorker(worker),
                }}
              >
                <Popup>
                  <div className="worker-map-popup">
                    <div className="worker-popup-header">
                      <img src={worker.photo} alt={worker.name} className="worker-popup-photo" />
                      <div>
                        <h4 className="worker-popup-name">{worker.name} {worker.verified && "✓"}</h4>
                        <p className="worker-popup-service">{worker.service} • ⭐ {worker.rating}</p>
                      </div>
                    </div>
                    <div className="worker-popup-details">
                      <span>🛵 Distance: <strong>{dist.toFixed(1)} km</strong></span>
                      <span>⏱️ ETA: <strong>~{etaMins} mins</strong></span>
                      <span>💰 Charge: <strong>₹{worker.baseRate}</strong></span>
                    </div>
                    <button
                      className="worker-popup-book-btn"
                      onClick={() => onSelectWorker(worker)}
                    >
                      {lang === "hi" ? "बुकिंग हेतु चुनें ⚡" : "Select Worker ⚡"}
                    </button>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
