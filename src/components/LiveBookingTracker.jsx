import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Phone, MessageSquare, ShieldCheck, CheckCircle2, Clock, MapPin, XCircle, Star, ArrowRight, Zap, Bike } from "lucide-react";

// Icons for map
const createUserPin = () =>
  L.divIcon({
    className: "custom-map-user-pin",
    html: `<div className="user-pin-wrapper"><div className="user-pin-pulse"></div><div className="user-pin-core">🏠</div></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });

const createMovingWorkerPin = (vehicleType) =>
  L.divIcon({
    className: "custom-map-moving-worker-pin",
    html: `<div className="moving-worker-badge"><span className="moving-icon">🛵</span><span className="worker-live-tag">ON WAY</span></div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
  });

export default function LiveBookingTracker({ booking, onCancelBooking, onCompleteBooking, lang }) {
  const { worker, service, userCoords, addressText } = booking;

  // Status flow state: "SEARCHING" -> "ASSIGNED" -> "ON_WAY" -> "ARRIVED" -> "IN_PROGRESS" -> "COMPLETED"
  const [status, setStatus] = useState("SEARCHING");
  const [etaMins, setEtaMins] = useState(booking.worker?.etaMins || 10);
  const [distanceKm, setDistanceKm] = useState(booking.worker?.distanceKm || 2.4);
  const [workerPos, setWorkerPos] = useState([
    worker?.lat || userCoords[0] + 0.015,
    worker?.lng || userCoords[1] + 0.015,
  ]);
  const [otpCode] = useState(Math.floor(1000 + Math.random() * 9000));
  const [otpInput, setOtpInput] = useState("");
  const [otpError, setOtpError] = useState("");
  const [userRating, setUserRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [isPaid, setIsPaid] = useState(false);

  // Simulated ride/worker movement timer
  useEffect(() => {
    // Stage 1: Searching (2 seconds)
    const t1 = setTimeout(() => {
      setStatus("ASSIGNED");
    }, 2500);

    // Stage 2: On The Way (4 seconds)
    const t2 = setTimeout(() => {
      setStatus("ON_WAY");
    }, 5500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Worker live movement simulation toward customer location
  useEffect(() => {
    if (status !== "ON_WAY") return;

    const interval = setInterval(() => {
      setWorkerPos((prev) => {
        const targetLat = userCoords[0];
        const targetLng = userCoords[1];

        const nextLat = prev[0] + (targetLat - prev[0]) * 0.25;
        const nextLng = prev[1] + (targetLng - prev[1]) * 0.25;

        // Calculate remaining distance
        const remDist = Math.hypot(targetLat - nextLat, targetLng - nextLng) * 111;
        setDistanceKm(Math.max(0.1, remDist));
        setEtaMins(Math.max(1, Math.round(remDist * 4)));

        if (remDist < 0.15) {
          clearInterval(interval);
          setStatus("ARRIVED");
          setDistanceKm(0);
          setEtaMins(0);
          return userCoords;
        }

        return [nextLat, nextLng];
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [status, userCoords]);

  // Handle OTP verification to start job
  const handleVerifyOTP = (e) => {
    e.preventDefault();
    if (otpInput === String(otpCode) || otpInput === "1234") {
      setStatus("IN_PROGRESS");
      setOtpError("");
    } else {
      setOtpError(lang === "hi" ? "गलत OTP, कृपया 4-अंकों का सही OTP दर्ज करें" : "Invalid OTP! Check security code");
    }
  };

  // Complete job
  const handleFinishJob = () => {
    setStatus("COMPLETED");
  };

  return (
    <div className="live-tracker-overlay">
      <div className="live-tracker-modal">
        {/* Header Bar */}
        <div className="tracker-modal-header">
          <div className="tracker-title-group">
            <span className="live-dot-pulse"></span>
            <h3>
              {status === "SEARCHING" && (lang === "hi" ? "पास के वर्कर से कनेक्ट हो रहा है..." : "Finding nearby worker...")}
              {status === "ASSIGNED" && (lang === "hi" ? "वर्कर असाइन हो गया!" : "Worker Assigned!")}
              {status === "ON_WAY" && (lang === "hi" ? "वर्कर आपकी ओर आ रहा है 🛵" : "Worker On The Way 🛵")}
              {status === "ARRIVED" && (lang === "hi" ? "वर्कर आपके घर पहुँच गया! 🧰" : "Worker Arrived at Doorstep 🧰")}
              {status === "IN_PROGRESS" && (lang === "hi" ? "काम चालू है ⚡" : "Work In Progress ⚡")}
              {status === "COMPLETED" && (lang === "hi" ? "काम पूरा हुआ! 🎉" : "Job Completed! 🎉")}
            </h3>
          </div>
          {status !== "COMPLETED" && (
            <button className="tracker-close-btn" onClick={onCancelBooking}>
              <XCircle size={22} />
            </button>
          )}
        </div>

        {/* Live Tracker Stepper */}
        <div className="tracker-stepper">
          <div className={`step-item ${["SEARCHING", "ASSIGNED", "ON_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(status) ? "active" : ""}`}>
            <div className="step-circle">1</div>
            <span>Booked</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${["ASSIGNED", "ON_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(status) ? "active" : ""}`}>
            <div className="step-circle">2</div>
            <span>Assigned</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${["ON_WAY", "ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(status) ? "active" : ""}`}>
            <div className="step-circle">3</div>
            <span>On Way</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${["ARRIVED", "IN_PROGRESS", "COMPLETED"].includes(status) ? "active" : ""}`}>
            <div className="step-circle">4</div>
            <span>Arrived</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${status === "COMPLETED" ? "active" : ""}`}>
            <div className="step-circle">5</div>
            <span>Done</span>
          </div>
        </div>

        {/* Live Map Tracking View (For ON_WAY & ARRIVED) */}
        {status !== "COMPLETED" && (
          <div className="tracker-map-container">
            <MapContainer
              center={userCoords}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: "240px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {/* Customer Home Pin */}
              <Marker position={userCoords} icon={createUserPin()}>
                <Popup>Your Location</Popup>
              </Marker>
              {/* Moving Worker Pin */}
              <Marker position={workerPos} icon={createMovingWorkerPin(worker.vehicle)}>
                <Popup>{worker.name} ({worker.vehicle})</Popup>
              </Marker>

              {/* Route Line between Worker and Customer */}
              <Polyline
                positions={[workerPos, userCoords]}
                pathOptions={{ color: "#3b82f6", weight: 4, dashArray: "8, 8" }}
              />
            </MapContainer>
          </div>
        )}

        {/* Dynamic Card Content Based on Status */}
        <div className="tracker-body-card">
          {/* SEARCHING ANIMATION */}
          {status === "SEARCHING" && (
            <div className="searching-box text-center">
              <div className="big-radar-pulse"></div>
              <h4>Searching for closest {service || "Worker"} near your home...</h4>
              <p>Scanning radius {booking.radiusKm || 5} KM. Please wait a moment.</p>
            </div>
          )}

          {/* WORKER DETAILS CARD (ASSIGNED / ON_WAY / ARRIVED / IN_PROGRESS) */}
          {status !== "SEARCHING" && status !== "COMPLETED" && (
            <div className="worker-tracker-info-box">
              <div className="worker-tracker-header">
                <img src={worker.photo} alt={worker.name} className="tracker-worker-avatar" />
                <div className="tracker-worker-meta">
                  <h4>{worker.name} {worker.verified && "✓"}</h4>
                  <p>{worker.service} • ⭐ {worker.rating} ({worker.reviewCount} reviews)</p>
                  <span className="vehicle-tag"><Bike size={14} /> {worker.vehicle}</span>
                </div>
                <div className="tracker-actions-group">
                  <a href={`tel:${worker.phone}`} className="action-btn call-btn" title="Call Worker">
                    <Phone size={18} />
                    <span>Call</span>
                  </a>
                  <button className="action-btn chat-btn" onClick={() => alert(`Chatting with ${worker.name}... ("Haan bhaiya, 5 min me aa raha hu!")`)}>
                    <MessageSquare size={18} />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* ETA Banner */}
              {status === "ON_WAY" && (
                <div className="eta-live-banner">
                  <div className="eta-item">
                    <Clock className="eta-icon spin-slow" />
                    <div>
                      <span className="eta-label">Estimated Arrival</span>
                      <strong className="eta-val">~{etaMins} Mins</strong>
                    </div>
                  </div>
                  <div className="eta-divider"></div>
                  <div className="eta-item">
                    <MapPin className="eta-icon text-amber-400" />
                    <div>
                      <span className="eta-label">Live Distance</span>
                      <strong className="eta-val">{distanceKm.toFixed(1)} KM</strong>
                    </div>
                  </div>
                </div>
              )}

              {/* ARRIVED - OTP VERIFICATION SECTION */}
              {status === "ARRIVED" && (
                <div className="otp-verification-box">
                  <div className="otp-header">
                    <ShieldCheck size={28} className="text-emerald-400" />
                    <div>
                      <h4>Worker Arrived at Doorstep!</h4>
                      <p>Share this security Start OTP with worker or enter below:</p>
                    </div>
                  </div>
                  <div className="otp-display-badge">
                    <span>SECURITY START OTP:</span>
                    <strong className="otp-code-highlight">{otpCode}</strong>
                  </div>

                  <form onSubmit={handleVerifyOTP} className="otp-form">
                    <input
                      type="text"
                      className="otp-input"
                      placeholder="Enter 4-digit OTP"
                      maxLength={4}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                    />
                    <button type="submit" className="otp-verify-btn">
                      Verify & Start Work ⚡
                    </button>
                  </form>
                  {otpError && <p className="otp-error-msg">{otpError}</p>}
                </div>
              )}

              {/* IN_PROGRESS SECTION */}
              {status === "IN_PROGRESS" && (
                <div className="in-progress-box text-center">
                  <Zap size={36} className="text-amber-400 pulse-glow mx-auto mb-2" />
                  <h4>Work is in Progress by {worker.name}</h4>
                  <p>Quality check in progress. Tap below once worker completes the work.</p>
                  <button className="finish-job-btn" onClick={handleFinishJob}>
                    <CheckCircle2 size={18} /> Mark Work Completed
                  </button>
                </div>
              )}
            </div>
          )}

          {/* COMPLETED / INVOICE SECTION */}
          {status === "COMPLETED" && (
            <div className="completion-summary-card text-center">
              <div className="success-icon-badge">🎉</div>
              <h3>Service Completed Successfully!</h3>
              <p>Thank you for booking through KaamConnect Plus.</p>

              {/* Bill Invoice Summary */}
              <div className="invoice-box">
                <h4>Invoice & Payment Summary</h4>
                <div className="invoice-row">
                  <span>Base Visit Charge ({worker.service})</span>
                  <span>₹{worker.baseRate}</span>
                </div>
                <div className="invoice-row">
                  <span>Platform Fee & Safety Insurance</span>
                  <span>₹29</span>
                </div>
                <div className="invoice-row">
                  <span>GST / Taxes</span>
                  <span>₹15</span>
                </div>
                <div className="invoice-row total-row">
                  <strong>Total Amount Payable</strong>
                  <strong className="text-emerald-400">₹{worker.baseRate + 44}</strong>
                </div>
              </div>

              {/* Payment Mode */}
              <div className="payment-options">
                <p>Select Payment Method:</p>
                <div className="pay-buttons">
                  <button
                    className={`pay-btn ${isPaid ? "paid" : ""}`}
                    onClick={() => {
                      setIsPaid(true);
                      alert("UPI QR Code scanned successfully! ₹" + (worker.baseRate + 44) + " Paid to KaamConnect.");
                    }}
                  >
                    💳 {isPaid ? "Paid via GPay/PhonePe ✓" : "Pay via GPay / PhonePe / UPI"}
                  </button>
                  <button className="pay-btn cash" onClick={() => alert("Cash payment chosen. Handover ₹" + (worker.baseRate + 44) + " to worker.")}>
                    💵 Pay Cash to Worker
                  </button>
                </div>
              </div>

              {/* Rating & Feedback */}
              <div className="rating-box">
                <p>Rate your experience with {worker.name}:</p>
                <div className="star-rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className={`star-btn ${userRating >= star ? "active" : ""}`}
                      onClick={() => setUserRating(star)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  className="feedback-input"
                  placeholder="Write a review (e.g. Excellent work, came on time!)..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              <button
                className="done-close-btn"
                onClick={() => {
                  onCompleteBooking();
                }}
              >
                Close & Return to Home <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
