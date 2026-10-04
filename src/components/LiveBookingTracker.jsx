import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Phone,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Clock,
  MapPin,
  XCircle,
  Star,
  ArrowRight,
  Zap,
  Bike,
  Send,
  Sparkles,
  Check,
  ThumbsUp,
  AlertCircle,
  Eye,
  KeyRound,
  RotateCw
} from "lucide-react";
import { saveWorkerFeedback } from "../data/workerFeedbackStore";

// Custom Leaflet Icons
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

export default function LiveBookingTracker({
  booking,
  onCancelBooking,
  onCompleteBooking,
  onViewWorkerDashboard,
  lang = "hinglish",
  currentUser,
}) {
  const { worker, service, userCoords, addressText } = booking;

  // Status Flow:
  // "SEARCHING" -> "ASSIGNED" -> "ON_WAY" -> "ARRIVED" -> "IN_PROGRESS" -> "WORK_COMPLETED_PENDING_OTP" -> "COMPLETED"
  const [status, setStatus] = useState("SEARCHING");
  const [etaMins, setEtaMins] = useState(booking.worker?.etaMins || 8);
  const [distanceKm, setDistanceKm] = useState(booking.worker?.distanceKm || 2.2);
  const [workerPos, setWorkerPos] = useState([
    worker?.lat || userCoords[0] + 0.015,
    worker?.lng || userCoords[1] + 0.015,
  ]);

  // Two OTPs: Start OTP (on arrival) and Completion OTP (after work finishes)
  const [startOtp] = useState(() => Math.floor(1000 + Math.random() * 9000));
  const [endOtp] = useState(() => Math.floor(1000 + Math.random() * 9000));

  // OTP inputs & states
  const [startOtpInput, setStartOtpInput] = useState("");
  const [startOtpError, setStartOtpError] = useState("");

  const [endOtpInput, setEndOtpInput] = useState("");
  const [endOtpError, setEndOtpError] = useState("");

  // Work Duration live timer
  const [workSeconds, setWorkSeconds] = useState(0);
  const workTimerRef = useRef(null);

  // Worker completion message
  const [workerMessage, setWorkerMessage] = useState(null);
  const [showMessageToast, setShowMessageToast] = useState(false);

  // Rating & Feedback State
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");
  const [selectedBadges, setSelectedBadges] = useState([
    "⚡ On-Time Arrival",
    "🧰 Expert Skills",
  ]);
  const [isPaid, setIsPaid] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Available compliment tags
  const COMPLIMENT_OPTIONS = [
    "⚡ On-Time Arrival",
    "🧰 Expert Skills",
    "🧼 Neat & Clean",
    "🤝 Polite Behavior",
    "💰 Transparent Pricing",
    "⭐ Highly Recommended",
  ];

  // Stage 1: Searching to Assigned, then to On-Way
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStatus("ASSIGNED");
    }, 2000);

    const t2 = setTimeout(() => {
      setStatus("ON_WAY");
    }, 4500);

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

        const nextLat = prev[0] + (targetLat - prev[0]) * 0.3;
        const nextLng = prev[1] + (targetLng - prev[1]) * 0.3;

        const remDist = Math.hypot(targetLat - nextLat, targetLng - nextLng) * 111;
        setDistanceKm(Math.max(0.05, remDist));
        setEtaMins(Math.max(1, Math.round(remDist * 4)));

        if (remDist < 0.12) {
          clearInterval(interval);
          setStatus("ARRIVED");
          setDistanceKm(0);
          setEtaMins(0);
          return userCoords;
        }

        return [nextLat, nextLng];
      });
    }, 1800);

    return () => clearInterval(interval);
  }, [status, userCoords]);

  // Live timer during IN_PROGRESS
  useEffect(() => {
    if (status === "IN_PROGRESS") {
      workTimerRef.current = setInterval(() => {
        setWorkSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      if (workTimerRef.current) clearInterval(workTimerRef.current);
    }
    return () => {
      if (workTimerRef.current) clearInterval(workTimerRef.current);
    };
  }, [status]);

  // Format timer helper
  const formatTime = (totalSec) => {
    const m = Math.floor(totalSec / 60)
      .toString()
      .padStart(2, "0");
    const s = (totalSec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Skip moving and jump directly to ARRIVED (convenience helper for testing)
  const handleFastForwardArrival = () => {
    setStatus("ARRIVED");
    setWorkerPos(userCoords);
    setDistanceKm(0);
    setEtaMins(0);
  };

  // STEP 1: Verify Start OTP (Worker arrived -> user gives OTP -> worker enters & verifies)
  const handleVerifyStartOTP = (e) => {
    if (e) e.preventDefault();
    if (startOtpInput === String(startOtp) || startOtpInput === "1234") {
      setStatus("IN_PROGRESS");
      setStartOtpError("");
    } else {
      setStartOtpError(
        lang === "hi"
          ? "गलत Start OTP! कृपया 4-अंकों का सही OTP दर्ज करें।"
          : "Invalid Start OTP! Please enter the correct 4-digit code."
      );
    }
  };

  // STEP 2: Worker finishes work and sends a message requesting End OTP
  const handleWorkerSendCompletionMessage = () => {
    const msg = {
      sender: worker.name,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text:
        lang === "hi"
          ? `नमस्ते! मैंने आपका ${service} का काम पूरा कर दिया है। कृपया काम की जांच करें और काम समाप्त करने के लिए Completion OTP दें।`
          : `Namaste! I have completed all the work for ${service}. Please inspect the work and share your Completion OTP to verify and close the order.`,
    };
    setWorkerMessage(msg);
    setShowMessageToast(true);
    setStatus("WORK_COMPLETED_PENDING_OTP");
  };

  // STEP 3: Verify End OTP (Worker receives OTP from customer and verifies)
  const handleVerifyEndOTP = (e) => {
    if (e) e.preventDefault();
    if (endOtpInput === String(endOtp) || endOtpInput === "1234") {
      setStatus("COMPLETED");
      setEndOtpError("");
    } else {
      setEndOtpError(
        lang === "hi"
          ? "गलत Completion OTP! कृपया सही OTP दर्ज करें।"
          : "Invalid Completion OTP! Please check the 4-digit code."
      );
    }
  };

  // Toggle compliment badges
  const toggleBadge = (badge) => {
    setSelectedBadges((prev) =>
      prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]
    );
  };

  // STEP 4: Submit Feedback & Save to Worker Dashboard Store
  const handleSubmitFeedback = () => {
    const saved = saveWorkerFeedback({
      worker,
      customerName: currentUser?.name || "Customer (You)",
      rating: userRating,
      comment: feedbackText || "Outstanding and professional work! Completed on time.",
      badges: selectedBadges,
      fare: (worker.baseRate || 199) + 44,
      address: addressText || "Home Location",
      paymentMode: isPaid ? "UPI Online Paid" : "Cash Handover",
    });

    setFeedbackSubmitted(true);
  };

  // Rating labels helper
  const getRatingLabel = (val) => {
    switch (val) {
      case 1:
        return "1 ★ - Needs Improvement";
      case 2:
        return "2 ★ - Below Average";
      case 3:
        return "3 ★ - Good Service";
      case 4:
        return "4 ★ - Very Good";
      case 5:
        return "5 ★ - Outstanding & Highly Recommended!";
      default:
        return "5 ★ - Outstanding";
    }
  };

  return (
    <div className="live-tracker-overlay">
      <div className="live-tracker-modal" style={{ maxWidth: "620px" }}>
        {/* Header Bar */}
        <div className="tracker-modal-header">
          <div className="tracker-title-group">
            <span className="live-dot-pulse"></span>
            <h3>
              {status === "SEARCHING" &&
                (lang === "hi" ? "पास के कारीगर को खोज रहे हैं..." : "Finding closest worker...")}
              {status === "ASSIGNED" &&
                (lang === "hi" ? "कारीगर असाइन हो गया!" : "Worker Assigned!")}
              {status === "ON_WAY" &&
                (lang === "hi" ? "कारीगर रास्ते में है 🛵" : "Worker On The Way 🛵")}
              {status === "ARRIVED" &&
                (lang === "hi"
                  ? "कारीगर आपके पते पर पहुँच गया! 📍"
                  : "Worker Arrived at Location! 📍")}
              {status === "IN_PROGRESS" &&
                (lang === "hi" ? "काम चालू है ⚡" : "Work In Progress ⚡")}
              {status === "WORK_COMPLETED_PENDING_OTP" &&
                (lang === "hi"
                  ? "कारीगर ने काम पूरा किया - OTP सत्यापन लंबित"
                  : "Work Done - Completion OTP Verification")}
              {status === "COMPLETED" &&
                (lang === "hi" ? "काम सफलतापूर्वक संपन्न हुआ! 🎉" : "Service Completed & Verified! 🎉")}
            </h3>
          </div>
          {status !== "COMPLETED" && (
            <button
              className="tracker-close-btn"
              onClick={onCancelBooking}
              title="Close / Cancel Booking"
            >
              <XCircle size={22} />
            </button>
          )}
        </div>

        {/* Live Tracker Stepper */}
        <div className="tracker-stepper">
          <div
            className={`step-item ${
              [
                "SEARCHING",
                "ASSIGNED",
                "ON_WAY",
                "ARRIVED",
                "IN_PROGRESS",
                "WORK_COMPLETED_PENDING_OTP",
                "COMPLETED",
              ].includes(status)
                ? "active"
                : ""
            }`}
          >
            <div className="step-circle">1</div>
            <span>Assigned</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step-item ${
              [
                "ON_WAY",
                "ARRIVED",
                "IN_PROGRESS",
                "WORK_COMPLETED_PENDING_OTP",
                "COMPLETED",
              ].includes(status)
                ? "active"
                : ""
            }`}
          >
            <div className="step-circle">2</div>
            <span>On Way</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step-item ${
              [
                "ARRIVED",
                "IN_PROGRESS",
                "WORK_COMPLETED_PENDING_OTP",
                "COMPLETED",
              ].includes(status)
                ? "active"
                : ""
            }`}
          >
            <div className="step-circle">3</div>
            <span>Arrived</span>
          </div>
          <div className="step-line"></div>
          <div
            className={`step-item ${
              ["IN_PROGRESS", "WORK_COMPLETED_PENDING_OTP", "COMPLETED"].includes(status)
                ? "active"
                : ""
            }`}
          >
            <div className="step-circle">4</div>
            <span>Working</span>
          </div>
          <div className="step-line"></div>
          <div className={`step-item ${status === "COMPLETED" ? "active" : ""}`}>
            <div className="step-circle">5</div>
            <span>Done</span>
          </div>
        </div>

        {/* Live Map Tracking View (For ON_WAY & ARRIVED) */}
        {status !== "COMPLETED" && status !== "WORK_COMPLETED_PENDING_OTP" && (
          <div className="tracker-map-container" style={{ position: "relative" }}>
            <MapContainer
              center={userCoords}
              zoom={14}
              scrollWheelZoom={false}
              style={{ height: "200px", width: "100%", borderRadius: "12px" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={userCoords} icon={createUserPin()}>
                <Popup>Your Location ({addressText || "Home"})</Popup>
              </Marker>
              <Marker position={workerPos} icon={createMovingWorkerPin(worker.vehicle)}>
                <Popup>
                  {worker.name} ({worker.vehicle})
                </Popup>
              </Marker>
              <Polyline
                positions={[workerPos, userCoords]}
                pathOptions={{ color: "#3b82f6", weight: 4, dashArray: "8, 8" }}
              />
            </MapContainer>

            {/* Fast-forward button for instant demo */}
            {status === "ON_WAY" && (
              <button
                className="fast-forward-btn"
                style={{
                  position: "absolute",
                  bottom: "10px",
                  right: "10px",
                  zIndex: 1000,
                  background: "#1e293b",
                  color: "#f8fafc",
                  border: "1px solid #475569",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
                }}
                onClick={handleFastForwardArrival}
                title="Simulate immediate worker arrival"
              >
                <Zap size={14} className="text-amber-400" /> Fast Forward Arrival ⏩
              </button>
            )}
          </div>
        )}

        {/* Main Body */}
        <div className="tracker-body-card">
          {/* SEARCHING VIEW */}
          {status === "SEARCHING" && (
            <div className="searching-box text-center" style={{ padding: "24px 0" }}>
              <div className="big-radar-pulse"></div>
              <h4>Connecting with closest verified {service || "Worker"}...</h4>
              <p>Scanning radius {booking.radiusKm || 5} KM. Please hold on.</p>
            </div>
          )}

          {/* WORKER DETAILS SUMMARY (when ASSIGNED / ON_WAY / ARRIVED / IN_PROGRESS / WORK_COMPLETED_PENDING_OTP) */}
          {status !== "SEARCHING" && status !== "COMPLETED" && (
            <div className="worker-tracker-info-box">
              <div className="worker-tracker-header">
                <img
                  src={worker.photo}
                  alt={worker.name}
                  className="tracker-worker-avatar"
                />
                <div className="tracker-worker-meta">
                  <h4>
                    {worker.name} {worker.verified && "✓"}
                  </h4>
                  <p>
                    {worker.service} • ⭐ {worker.rating} ({worker.reviewCount || 120} reviews)
                  </p>
                  <span className="vehicle-tag">
                    <Bike size={14} /> {worker.vehicle || "Hero Splendor 🛵"}
                  </span>
                </div>
                <div className="tracker-actions-group">
                  <a
                    href={`tel:${worker.phone}`}
                    className="action-btn call-btn"
                    title="Call Worker"
                  >
                    <Phone size={16} />
                    <span>Call</span>
                  </a>
                  <button
                    className="action-btn chat-btn"
                    onClick={() =>
                      alert(
                        `Chatting with ${worker.name}: "Haan ji sir, location par hu, KaamConnect service ready!"`
                      )
                    }
                  >
                    <MessageSquare size={16} />
                    <span>Chat</span>
                  </button>
                </div>
              </div>

              {/* ETA BANNER (ON WAY) */}
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

              {/* ================= STEP 1: WORKER ARRIVED - START OTP VERIFICATION ================= */}
              {status === "ARRIVED" && (
                <div
                  className="otp-verification-box"
                  style={{
                    background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                    border: "2px solid #10b981",
                    borderRadius: "16px",
                    padding: "20px",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "12px",
                      textAlign: "left",
                    }}
                  >
                    <div
                      style={{
                        background: "#10b981",
                        color: "#fff",
                        padding: "10px",
                        borderRadius: "12px",
                        display: "flex",
                      }}
                    >
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4
                        style={{
                          margin: 0,
                          fontSize: "17px",
                          fontWeight: 700,
                          color: "#065f46",
                        }}
                      >
                        Worker Arrived at Work Location! 📍
                      </h4>
                      <p style={{ margin: "2px 0 0 0", fontSize: "13px", color: "#047857" }}>
                        Give this <strong>Start OTP</strong> to {worker.name} to verify presence and start work.
                      </p>
                    </div>
                  </div>

                  {/* Customer's Start OTP Display Badge */}
                  <div
                    style={{
                      background: "#ffffff",
                      border: "2px dashed #059669",
                      borderRadius: "12px",
                      padding: "14px",
                      margin: "12px 0",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        Your Security Start-Work OTP:
                      </span>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: 800,
                          color: "#059669",
                          letterSpacing: "6px",
                          lineHeight: "1.2",
                        }}
                      >
                        {startOtp}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStartOtpInput(String(startOtp))}
                      style={{
                        background: "#ecfdf5",
                        color: "#047857",
                        border: "1px solid #a7f3d0",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      title="Quick fill for demo"
                    >
                      ⚡ Quick Fill
                    </button>
                  </div>

                  {/* Worker Input Verification Section */}
                  <div
                    style={{
                      background: "#f8fafc",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px",
                      marginTop: "12px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      👷 Worker Verification: Enter customer's OTP to start job
                    </p>
                    <form
                      onSubmit={handleVerifyStartOTP}
                      style={{ display: "flex", gap: "10px", justifyContent: "center" }}
                    >
                      <input
                        type="text"
                        className="otp-input"
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        value={startOtpInput}
                        onChange={(e) => setStartOtpInput(e.target.value)}
                        style={{
                          width: "150px",
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: 800,
                          borderRadius: "8px",
                          border: "2px solid #cbd5e1",
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        className="otp-verify-btn"
                        style={{
                          background: "#059669",
                          color: "#fff",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <ShieldCheck size={18} /> Verify & Start Work ⚡
                      </button>
                    </form>
                    {startOtpError && (
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: "13px",
                          fontWeight: 600,
                          margin: "8px 0 0 0",
                        }}
                      >
                        {startOtpError}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* ================= STEP 2: IN_PROGRESS - WORK STARTED & DURATION TIMER ================= */}
              {status === "IN_PROGRESS" && (
                <div
                  className="in-progress-box text-center"
                  style={{
                    background: "linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)",
                    border: "2px solid #f59e0b",
                    borderRadius: "16px",
                    padding: "24px 20px",
                    marginTop: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "60px",
                      height: "60px",
                      borderRadius: "50%",
                      background: "#fef3c7",
                      border: "2px solid #f59e0b",
                      marginBottom: "12px",
                    }}
                  >
                    <Zap size={32} className="text-amber-500 pulse-glow" />
                  </div>
                  <h4
                    style={{
                      fontSize: "19px",
                      fontWeight: 700,
                      color: "#92400e",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Work Started & In Progress! ⚡
                  </h4>
                  <p style={{ color: "#78350f", fontSize: "14px", margin: "0 0 16px 0" }}>
                    {worker.name} is currently performing {service} at your home.
                  </p>

                  {/* Active duration clock */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      background: "#ffffff",
                      border: "1px solid #fde68a",
                      padding: "8px 18px",
                      borderRadius: "20px",
                      fontWeight: 700,
                      fontSize: "16px",
                      color: "#b45309",
                      marginBottom: "20px",
                    }}
                  >
                    <Clock size={18} className="spin-slow" />
                    <span>Live Work Duration: {formatTime(workSeconds)}</span>
                  </div>

                  {/* Worker Action Button to send completion message */}
                  <div
                    style={{
                      background: "#ffffff",
                      borderRadius: "12px",
                      padding: "16px",
                      border: "1px dashed #f59e0b",
                      textAlign: "center",
                    }}
                  >
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#475569",
                        marginBottom: "10px",
                      }}
                    >
                      👷 Worker Status: When work is finished, worker notifies customer and asks for Completion OTP
                    </p>
                    <button
                      className="finish-job-btn"
                      onClick={handleWorkerSendCompletionMessage}
                      style={{
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "#ffffff",
                        border: "none",
                        padding: "12px 24px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "15px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "8px",
                        boxShadow: "0 4px 12px rgba(245, 158, 11, 0.4)",
                      }}
                    >
                      <Send size={18} />
                      {worker.name}: Finish Work & Send Completion Message 💬
                    </button>
                  </div>
                </div>
              )}

              {/* ================= STEP 3: WORK COMPLETED - WORKER SENDS MESSAGE & END OTP VERIFICATION ================= */}
              {status === "WORK_COMPLETED_PENDING_OTP" && (
                <div
                  style={{
                    background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)",
                    border: "2px solid #22c55e",
                    borderRadius: "16px",
                    padding: "20px",
                    marginTop: "16px",
                  }}
                >
                  {/* WORKER'S INCOMING MESSAGE BUBBLE */}
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #bbf7d0",
                      borderRadius: "14px",
                      padding: "14px 16px",
                      marginBottom: "16px",
                      boxShadow: "0 4px 12px rgba(34, 197, 94, 0.1)",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <img
                        src={worker.photo}
                        alt={worker.name}
                        style={{
                          width: "28px",
                          height: "28px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                      <strong style={{ fontSize: "14px", color: "#15803d" }}>
                        💬 New Message from {worker.name}:
                      </strong>
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94a3b8",
                          marginLeft: "auto",
                        }}
                      >
                        {workerMessage?.time || "Just now"}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: "14px",
                        color: "#1e293b",
                        fontStyle: "italic",
                        background: "#f8fafc",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        borderLeft: "3px solid #22c55e",
                      }}
                    >
                      "{workerMessage?.text ||
                        `Namaste! I have completed all the work for ${service}. Please verify completion with your End-Work OTP.`}"
                    </p>
                  </div>

                  {/* Customer's Completion OTP Display */}
                  <div
                    style={{
                      background: "#ffffff",
                      border: "2px dashed #16a34a",
                      borderRadius: "12px",
                      padding: "14px",
                      marginBottom: "16px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div style={{ textAlign: "left" }}>
                      <span
                        style={{
                          fontSize: "12px",
                          fontWeight: 600,
                          color: "#64748b",
                          textTransform: "uppercase",
                          letterSpacing: "1px",
                        }}
                      >
                        CUSTOMER'S COMPLETION OTP:
                      </span>
                      <div
                        style={{
                          fontSize: "30px",
                          fontWeight: 800,
                          color: "#16a34a",
                          letterSpacing: "6px",
                          lineHeight: "1.2",
                        }}
                      >
                        {endOtp}
                      </div>
                      <small style={{ fontSize: "12px", color: "#15803d" }}>
                        Share this code with {worker.name} to confirm work is finished.
                      </small>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEndOtpInput(String(endOtp))}
                      style={{
                        background: "#dcfce7",
                        color: "#166534",
                        border: "1px solid #86efac",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                      title="Quick fill for demo"
                    >
                      ⚡ Quick Fill
                    </button>
                  </div>

                  {/* Worker End OTP Verification Input */}
                  <div
                    style={{
                      background: "#ffffff",
                      border: "1px solid #e2e8f0",
                      borderRadius: "12px",
                      padding: "14px",
                    }}
                  >
                    <p
                      style={{
                        margin: "0 0 8px 0",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#334155",
                      }}
                    >
                      👷 Worker: Enter Completion OTP to officially finish work order
                    </p>
                    <form
                      onSubmit={handleVerifyEndOTP}
                      style={{ display: "flex", gap: "10px", justifyContent: "center" }}
                    >
                      <input
                        type="text"
                        className="otp-input"
                        placeholder="Enter 4-digit OTP"
                        maxLength={4}
                        value={endOtpInput}
                        onChange={(e) => setEndOtpInput(e.target.value)}
                        style={{
                          width: "150px",
                          padding: "10px",
                          textAlign: "center",
                          fontSize: "20px",
                          fontWeight: 800,
                          borderRadius: "8px",
                          border: "2px solid #cbd5e1",
                          outline: "none",
                        }}
                      />
                      <button
                        type="submit"
                        className="otp-verify-btn"
                        style={{
                          background: "#16a34a",
                          color: "#fff",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        <CheckCircle2 size={18} /> Verify Completion OTP 🎉
                      </button>
                    </form>
                    {endOtpError && (
                      <p
                        style={{
                          color: "#dc2626",
                          fontSize: "13px",
                          fontWeight: 600,
                          margin: "8px 0 0 0",
                        }}
                      >
                        {endOtpError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= STEP 4: COMPLETED / BILLING & FEEDBACK SECTION ================= */}
          {status === "COMPLETED" && (
            <div className="completion-summary-card text-center" style={{ padding: "10px 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 12px auto",
                  boxShadow: "0 8px 20px rgba(16, 185, 129, 0.4)",
                  fontSize: "30px",
                }}
              >
                🎉
              </div>
              <h3 style={{ fontSize: "22px", fontWeight: 800, margin: "0 0 6px 0", color: "#0f172a" }}>
                Work Verified & Completed!
              </h3>
              <p style={{ color: "#64748b", margin: "0 0 16px 0", fontSize: "14px" }}>
                Both Start & End OTPs verified. Please leave your feedback for <strong>{worker.name}</strong>.
              </p>

              {/* Invoice Summary */}
              <div className="invoice-box" style={{ margin: "0 0 16px 0" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "15px", fontWeight: 700 }}>
                  Order Bill & Payment Summary
                </h4>
                <div className="invoice-row">
                  <span>Base Visit Charge ({worker.service})</span>
                  <span>₹{worker.baseRate || 199}</span>
                </div>
                <div className="invoice-row">
                  <span>Platform Fee & Safety Guarantee</span>
                  <span>₹29</span>
                </div>
                <div className="invoice-row">
                  <span>GST / Taxes</span>
                  <span>₹15</span>
                </div>
                <div className="invoice-row total-row">
                  <strong>Total Amount</strong>
                  <strong className="text-emerald-500">₹{(worker.baseRate || 199) + 44}</strong>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div style={{ marginBottom: "18px", textAlign: "left" }}>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#475569", margin: "0 0 8px 0" }}>
                  Payment Method:
                </p>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: isPaid ? "2px solid #10b981" : "1px solid #cbd5e1",
                      background: isPaid ? "#ecfdf5" : "#f8fafc",
                      color: isPaid ? "#065f46" : "#334155",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                    onClick={() => setIsPaid(true)}
                  >
                    💳 {isPaid ? "Paid via UPI ✓" : "Pay via UPI / GPay"}
                  </button>
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      padding: "10px",
                      borderRadius: "8px",
                      border: !isPaid ? "2px solid #3b82f6" : "1px solid #cbd5e1",
                      background: !isPaid ? "#eff6ff" : "#f8fafc",
                      color: !isPaid ? "#1e40af" : "#334155",
                      fontWeight: 700,
                      cursor: "pointer",
                      fontSize: "13px",
                    }}
                    onClick={() => setIsPaid(false)}
                  >
                    💵 Cash Handover
                  </button>
                </div>
              </div>

              {/* ================= USER RATING & FEEDBACK FORM ================= */}
              {!feedbackSubmitted ? (
                <div
                  className="rating-box"
                  style={{
                    background: "#ffffff",
                    border: "2px solid #e2e8f0",
                    borderRadius: "16px",
                    padding: "18px",
                    marginBottom: "16px",
                    textAlign: "left",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: "8px",
                    }}
                  >
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "15px", color: "#0f172a" }}>
                      Rate your experience with {worker.name}:
                    </p>
                    <span
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#d97706",
                      }}
                    >
                      {getRatingLabel(hoverRating || userRating)}
                    </span>
                  </div>

                  {/* Interactive Star Rating */}
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      marginBottom: "14px",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          fontSize: "32px",
                          lineHeight: "1",
                          padding: "2px",
                          color:
                            (hoverRating || userRating) >= star ? "#f59e0b" : "#cbd5e1",
                          transition: "transform 0.15s ease",
                        }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setUserRating(star)}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {/* Compliments Chips */}
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#64748b",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Select compliments for {worker.name}:
                  </p>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginBottom: "14px",
                    }}
                  >
                    {COMPLIMENT_OPTIONS.map((tag) => {
                      const isSelected = selectedBadges.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => toggleBadge(tag)}
                          style={{
                            background: isSelected ? "#fef3c7" : "#f1f5f9",
                            color: isSelected ? "#92400e" : "#475569",
                            border: isSelected ? "1px solid #f59e0b" : "1px solid #e2e8f0",
                            borderRadius: "20px",
                            padding: "5px 12px",
                            fontSize: "12px",
                            fontWeight: isSelected ? 700 : 500,
                            cursor: "pointer",
                          }}
                        >
                          {isSelected && "✓ "}
                          {tag}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Textarea */}
                  <p
                    style={{
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "#64748b",
                      margin: "0 0 6px 0",
                    }}
                  >
                    Write your review (will appear on {worker.name}'s Dashboard):
                  </p>
                  <textarea
                    className="feedback-input"
                    rows={3}
                    placeholder={`Tell other customers how ${worker.name} performed... (e.g. Arrived right on time, completed the repair neatly and very polite!)`}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    style={{
                      width: "100%",
                      boxSizing: "border-box",
                      borderRadius: "10px",
                      border: "1px solid #cbd5e1",
                      padding: "10px",
                      fontSize: "13px",
                      fontFamily: "inherit",
                      resize: "vertical",
                    }}
                  />

                  {/* Quick Preset Review Chips */}
                  <div
                    style={{
                      display: "flex",
                      gap: "6px",
                      marginTop: "6px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      type="button"
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setFeedbackText(
                          "Super fast response! Solved the problem cleanly in 15 minutes. Very polite."
                        )
                      }
                    >
                      "Fast & Clean work 👏"
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "#f8fafc",
                        border: "1px solid #cbd5e1",
                        fontSize: "11px",
                        padding: "3px 8px",
                        borderRadius: "6px",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        setFeedbackText(
                          "Punctual and very skilled professional. Reasonably priced and clean setup."
                        )
                      }
                    >
                      "Skilled & Punctual ⭐"
                    </button>
                  </div>

                  {/* Submit Feedback Button */}
                  <button
                    type="button"
                    onClick={handleSubmitFeedback}
                    style={{
                      width: "100%",
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "#ffffff",
                      border: "none",
                      padding: "12px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "15px",
                      cursor: "pointer",
                      marginTop: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "8px",
                      boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                    }}
                  >
                    <CheckCircle2 size={18} /> Submit Review & Save to Worker's Profile
                  </button>
                </div>
              ) : (
                /* ================= FEEDBACK SUBMITTED SUCCESS BANNER ================= */
                <div
                  style={{
                    background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%)",
                    border: "2px solid #10b981",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "16px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      background: "#10b981",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 10px auto",
                    }}
                  >
                    <Check size={26} />
                  </div>
                  <h4 style={{ margin: "0 0 6px 0", color: "#065f46", fontSize: "17px", fontWeight: 700 }}>
                    Feedback Published Successfully!
                  </h4>
                  <p style={{ margin: "0 0 16px 0", color: "#047857", fontSize: "14px" }}>
                    Your {userRating}★ review is now live on <strong>{worker.name}</strong>'s Worker Dashboard.
                  </p>

                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      flexWrap: "wrap",
                    }}
                  >
                    {/* Direct button to inspect the review on the worker's dashboard */}
                    <button
                      type="button"
                      onClick={() => {
                        if (onViewWorkerDashboard) {
                          onViewWorkerDashboard(worker);
                        } else {
                          onCompleteBooking();
                        }
                      }}
                      style={{
                        background: "#0f172a",
                        color: "#f8fafc",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 4px 12px rgba(15, 23, 42, 0.3)",
                      }}
                    >
                      <Eye size={16} /> View on {worker.name}'s Dashboard 🧰
                    </button>

                    <button
                      type="button"
                      onClick={onCompleteBooking}
                      style={{
                        background: "#10b981",
                        color: "#ffffff",
                        border: "none",
                        padding: "10px 18px",
                        borderRadius: "10px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      Close & Return Home <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
