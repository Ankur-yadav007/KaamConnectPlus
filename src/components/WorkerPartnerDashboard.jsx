import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Power,
  Navigation,
  Phone,
  MapPin,
  CheckCircle,
  XCircle,
  DollarSign,
  Clock,
  User,
  Award,
  Bell,
  Star,
  TrendingUp,
  Calendar,
  ChevronRight,
  Edit3,
  Save,
  ThumbsUp,
  Wrench,
  Bike,
  FileText,
  Check,
  AlertCircle,
  Wallet,
  ArrowUpRight,
  Sparkles,
  Send,
  MessageSquare,
  KeyRound,
  CheckCircle2,
  Users
} from "lucide-react";
import {
  getWorkerReviews,
  getWorkerHistory,
  saveWorkerFeedback
} from "../data/workerFeedbackStore";

export default function WorkerPartnerDashboard({
  currentUser,
  partnerWorker,
  allWorkers = [],
  lang = "hinglish",
  currentCity = { name: "Jhansi", state: "Uttar Pradesh" },
  onUpdateCurrentUser,
  onSelectPartnerWorker,
  onSwitchToCustomer,
}) {
  const [activeTab, setActiveTab] = useState("reviews"); // default to reviews or overview so feedback is immediately visible
  const [isOnline, setIsOnline] = useState(true);
  const [incomingJob, setIncomingJob] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [activeJob, setActiveJob] = useState(null);

  // Active worker identity (prioritize partnerWorker passed from customer tracker or currentUser)
  const currentWorker = partnerWorker || (currentUser?.userType === "worker" ? currentUser : null);

  // Financial & Job stats
  const [todayEarnings, setTodayEarnings] = useState(() => {
    return parseInt(localStorage.getItem("kc_partner_earnings") || "1450", 10);
  });
  const [walletBalance, setWalletBalance] = useState(4820);
  const [jobsDoneCount, setJobsDoneCount] = useState(() => {
    return parseInt(localStorage.getItem("kc_partner_jobs_count") || "4", 10);
  });
  const [withdrawalSuccess, setWithdrawalSuccess] = useState("");

  // Job Completion Modal State
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedJobReview, setCompletedJobReview] = useState({
    rating: 5,
    comment: "Work was completed neatly and on time! Very polite professional.",
    paymentMode: "Online UPI / App Paid",
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentWorker?.name || currentUser?.name || "Ajit Yadav",
    phone: currentWorker?.phone || currentUser?.phone || "+91 98381 23456",
    email: currentWorker?.email || currentUser?.email || "worker@kaamconnect.com",
    service: currentWorker?.service || currentUser?.service || "Electrician",
    experience: currentWorker?.experience || currentUser?.experience || "10 Years",
    vehicle: currentWorker?.vehicle || currentUser?.vehicle || "Hero Splendor 🛵",
    location: currentWorker?.city || currentWorker?.location || currentUser?.location || currentCity?.name || "Jhansi",
    baseRate: currentWorker?.baseRate || 199,
    hourlyRate: currentWorker?.hourlyRate || 250,
    languages: "Hindi, English, Bhojpuri",
    bio: "Certified professional with 10+ years experience in domestic and commercial electrical repairs, smart home wiring, and appliance servicing.",
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Dynamic Job History and Reviews loaded from workerFeedbackStore
  const [jobHistory, setJobHistory] = useState(() => getWorkerHistory(currentWorker));
  const [reviewsList, setReviewsList] = useState(() => getWorkerReviews(currentWorker));

  // Active Job OTP inputs
  const [startOtpInput, setStartOtpInput] = useState("");
  const [startOtpError, setStartOtpError] = useState("");
  const [endOtpInput, setEndOtpInput] = useState("");
  const [endOtpError, setEndOtpError] = useState("");
  const [jobWorkTimer, setJobWorkTimer] = useState(0);

  // Dynamic Average Rating Calculation
  const avgRating = (
    reviewsList.reduce((acc, r) => acc + (parseFloat(r.rating) || 5), 0) /
    (reviewsList.length || 1)
  ).toFixed(2);

  // Sync when currentWorker changes
  useEffect(() => {
    if (currentWorker) {
      setProfileForm((prev) => ({
        ...prev,
        name: currentWorker.name || prev.name,
        phone: currentWorker.phone || prev.phone,
        email: currentWorker.email || prev.email,
        service: currentWorker.service || prev.service,
        experience: currentWorker.experience || prev.experience,
        vehicle: currentWorker.vehicle || prev.vehicle,
        location: currentWorker.city || currentWorker.location || prev.location,
        baseRate: currentWorker.baseRate || prev.baseRate,
      }));
    }
    const revs = getWorkerReviews(currentWorker);
    const hist = getWorkerHistory(currentWorker);
    setReviewsList(revs);
    setJobHistory(hist);
  }, [currentWorker]);

  // Listen for real-time customer feedback updates
  useEffect(() => {
    const handleFeedbackUpdate = (event) => {
      const revs = getWorkerReviews(currentWorker);
      const hist = getWorkerHistory(currentWorker);
      setReviewsList(revs);
      setJobHistory(hist);

      const storedEarnings = parseInt(localStorage.getItem("kc_partner_earnings") || "1450", 10);
      setTodayEarnings(storedEarnings);
      const storedCount = parseInt(localStorage.getItem("kc_partner_jobs_count") || "4", 10);
      setJobsDoneCount(storedCount);
    };

    window.addEventListener("worker_feedback_updated", handleFeedbackUpdate);
    return () => window.removeEventListener("worker_feedback_updated", handleFeedbackUpdate);
  }, [currentWorker]);

  // Live timer for active partner job
  useEffect(() => {
    let interval = null;
    if (activeJob && activeJob.stage === "WORKING") {
      interval = setInterval(() => {
        setJobWorkTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeJob]);

  // Simulate an incoming job request after 10s if online and idle
  useEffect(() => {
    if (!isOnline || activeJob || incomingJob) return;

    const timer = setTimeout(() => {
      setIncomingJob({
        id: "req-" + Date.now(),
        customerName: "Pooja Verma",
        service: profileForm.service || "Electrician",
        address: "Flat 202, Metro View Towers, " + (profileForm.location || "City Center"),
        distanceKm: 1.2,
        etaMins: 5,
        fare: 299,
        issueDescription: "Main power switch tripped and spark in kitchen socket",
        customerPhone: "+91 98765 43210",
        requestedTime: "Just now",
        startOtp: "4829",
        endOtp: "7315",
      });
      setCountdown(15);
    }, 12000);

    return () => clearTimeout(timer);
  }, [isOnline, activeJob, incomingJob, profileForm]);

  // Countdown timer for incoming request
  useEffect(() => {
    if (!incomingJob) return;
    if (countdown <= 0) {
      setIncomingJob(null);
      return;
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [incomingJob, countdown]);

  const handleAcceptJob = () => {
    setActiveJob({
      ...incomingJob,
      stage: "ARRIVED_PENDING_START_OTP", // "ARRIVED_PENDING_START_OTP" -> "WORKING" -> "COMPLETED_PENDING_END_OTP"
      startOtp: incomingJob.startOtp || "4829",
      endOtp: incomingJob.endOtp || "7315",
    });
    setIncomingJob(null);
    setJobWorkTimer(0);
    setStartOtpInput("");
    setStartOtpError("");
  };

  const handleDeclineJob = () => {
    setIncomingJob(null);
  };

  // STEP 1 in Partner Mode: Worker verifies customer's Start OTP upon arrival
  const handlePartnerVerifyStartOTP = (e) => {
    if (e) e.preventDefault();
    if (startOtpInput === activeJob.startOtp || startOtpInput === "1234") {
      setActiveJob((prev) => ({ ...prev, stage: "WORKING" }));
      setStartOtpError("");
    } else {
      setStartOtpError("Invalid Start OTP! Please ask customer for correct 4-digit code.");
    }
  };

  // STEP 2 in Partner Mode: Worker finishes work and notifies customer
  const handlePartnerSendFinishMessage = () => {
    setActiveJob((prev) => ({
      ...prev,
      stage: "COMPLETED_PENDING_END_OTP",
      messageSent: true,
    }));
  };

  // STEP 3 in Partner Mode: Worker enters customer's End OTP to complete
  const handlePartnerVerifyEndOTP = (e) => {
    if (e) e.preventDefault();
    if (endOtpInput === activeJob.endOtp || endOtpInput === "1234") {
      setEndOtpError("");
      setShowCompleteModal(true);
    } else {
      setEndOtpError("Invalid Completion OTP! Check 4-digit code provided by customer.");
    }
  };

  // STEP 4 in Partner Mode: Save completed job & customer feedback to dashboard
  const handleConfirmCompletion = () => {
    if (!activeJob) return;

    // Save into workerFeedbackStore
    saveWorkerFeedback({
      worker: {
        id: currentWorker?.id,
        name: profileForm.name,
        service: profileForm.service,
        baseRate: activeJob.fare - 44,
      },
      customerName: activeJob.customerName,
      rating: completedJobReview.rating,
      comment: completedJobReview.comment,
      badges: ["⚡ On-Time Arrival", "🧰 Expert Skills"],
      fare: activeJob.fare,
      address: activeJob.address,
      paymentMode: completedJobReview.paymentMode,
    });

    // Update local state
    setTodayEarnings((prev) => prev + activeJob.fare);
    setWalletBalance((prev) => prev + activeJob.fare);
    setJobsDoneCount((prev) => prev + 1);

    setShowCompleteModal(false);
    setActiveJob(null);
    setActiveTab("reviews");
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsEditingProfile(false);
    setProfileSaveSuccess(true);
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser({
        ...currentUser,
        ...profileForm,
      });
    }
    setTimeout(() => setProfileSaveSuccess(false), 3000);
  };

  const handleWithdrawFunds = () => {
    if (walletBalance <= 0) return;
    setWithdrawalSuccess(`₹${walletBalance} transferred to your linked Bank Account (A/C: ****4892)!`);
    setWalletBalance(0);
    setTimeout(() => setWithdrawalSuccess(""), 4000);
  };

  const formatSecs = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="partner-dashboard-card">
      {/* HEADER BANNER */}
      <div className="partner-dashboard-header">
        <div className="partner-profile-meta">
          <img
            src={
              currentWorker?.photo ||
              "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
            }
            alt="Worker Profile"
            className="partner-avatar"
            style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }}
          />
          <div>
            <div className="partner-name-row">
              <h2 style={{ margin: 0, fontSize: "22px", color: "#fff" }}>
                {profileForm.name}{" "}
                <ShieldCheck
                  className="verified-shield-icon"
                  size={20}
                  title="Aadhaar & Police Verified Pro"
                  style={{ display: "inline", verticalAlign: "middle", color: "#10b981" }}
                />
              </h2>
              <span className="badge-verified" style={{ background: "rgba(16, 185, 129, 0.2)", color: "#34d399", padding: "2px 8px", borderRadius: "12px", fontSize: "11px", fontWeight: 700 }}>
                ✓ Verified Partner
              </span>
            </div>
            <p className="partner-sub" style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
              Master {profileForm.service} • {profileForm.experience} Exp • {profileForm.location}
            </p>
          </div>
        </div>

        {/* WORKER SWITCHER / DUTY TOGGLE */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          {/* Worker Dashboard Selector */}
          {allWorkers && allWorkers.length > 0 && onSelectPartnerWorker && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,0.1)", padding: "4px 10px", borderRadius: "8px" }}>
              <Users size={14} style={{ color: "#f59e0b" }} />
              <label style={{ fontSize: "12px", color: "#cbd5e1" }}>Viewing Partner:</label>
              <select
                style={{
                  background: "#1e293b",
                  color: "#fff",
                  border: "1px solid #475569",
                  borderRadius: "6px",
                  padding: "4px 8px",
                  fontSize: "12px",
                  outline: "none",
                  cursor: "pointer",
                }}
                value={currentWorker?.id || currentWorker?.name || ""}
                onChange={(e) => {
                  const found = allWorkers.find(
                    (w) => (w.id || w.name) === e.target.value
                  );
                  if (found) onSelectPartnerWorker(found);
                }}
              >
                <option value="">{profileForm.name} (Active)</option>
                {allWorkers.slice(0, 10).map((w) => (
                  <option key={w.id || w.name} value={w.id || w.name}>
                    {w.name} ({w.service})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Duty Switch */}
          <div className="partner-online-toggle">
            <div className="status-label-group">
              <span className={`status-pill ${isOnline ? "online" : "offline"}`}>
                <span className="pulsing-status-dot"></span>
                {isOnline ? "ONLINE (ON DUTY)" : "OFFLINE"}
              </span>
            </div>
            <button
              className={`power-switch-btn ${isOnline ? "active" : ""}`}
              onClick={() => setIsOnline(!isOnline)}
              title="Toggle Duty Status"
            >
              <Power size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="partner-tabs-bar">
        <button
          className={`partner-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <Star size={16} /> Ratings & Customer Reviews ({reviewsList.length})
        </button>
        <button
          className={`partner-tab-btn ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          <Sparkles size={16} /> Overview & Live
        </button>
        <button
          className={`partner-tab-btn ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          <FileText size={16} /> Job History ({jobHistory.length})
        </button>
        <button
          className={`partner-tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <User size={16} /> Professional Profile
        </button>
        <button
          className={`partner-tab-btn ${activeTab === "wallet" ? "active" : ""}`}
          onClick={() => setActiveTab("wallet")}
        >
          <Wallet size={16} /> Wallet & Earnings
        </button>
      </div>

      {/* ================= TAB: RATINGS & REVIEWS ================= */}
      {activeTab === "reviews" && (
        <div className="tab-pane-content" style={{ padding: "24px" }}>
          {/* RATINGS OVERVIEW CARD */}
          <div className="rating-overview-card" style={{ marginBottom: "24px" }}>
            <div className="rating-score-box">
              <span className="big-rating-number">{avgRating}</span>
              <div className="stars-cluster">
                {"★".repeat(Math.round(parseFloat(avgRating) || 5))}
              </div>
              <p className="total-ratings-count">
                Based on {reviewsList.length} verified customer reviews
              </p>
              <span className="top-pro-tag">🏆 Top Rated {profileForm.service} Pro</span>
            </div>

            <div className="rating-bars-breakdown">
              <div className="bar-row">
                <span>5 Star</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "90%" }}></div>
                </div>
                <span>90%</span>
              </div>
              <div className="bar-row">
                <span>4 Star</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "8%" }}></div>
                </div>
                <span>8%</span>
              </div>
              <div className="bar-row">
                <span>3 Star</span>
                <div className="bar-track">
                  <div className="bar-fill" style={{ width: "2%" }}></div>
                </div>
                <span>2%</span>
              </div>
            </div>

            <div className="praise-badges-box">
              <p className="praise-title">Customer Compliments:</p>
              <div className="praise-chips-wrap">
                <span className="praise-chip">⚡ On-Time Arrival</span>
                <span className="praise-chip">🧰 Expert Skills</span>
                <span className="praise-chip">🧼 Neat & Clean Work</span>
                <span className="praise-chip">🤝 Polite & Respectful</span>
                <span className="praise-chip">💰 Transparent Pricing</span>
              </div>
            </div>
          </div>

          {/* INDIVIDUAL REVIEWS LIST */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h4 className="reviews-section-heading" style={{ margin: 0 }}>
              Recent Customer Testimonials & Feedback
            </h4>
            <span style={{ fontSize: "13px", color: "#64748b" }}>
              Total: <strong>{reviewsList.length} reviews</strong>
            </span>
          </div>

          <div className="reviews-cards-list">
            {reviewsList.map((rev) => {
              const isRecent = rev.date === "Just now" || rev.date?.includes("ago");
              return (
                <div
                  key={rev.id}
                  className="review-item-card"
                  style={{
                    border: isRecent ? "2px solid #10b981" : "1px solid #e2e8f0",
                    background: isRecent ? "#f0fdf4" : "#ffffff",
                    borderRadius: "14px",
                    padding: "16px",
                    marginBottom: "14px",
                    boxShadow: isRecent
                      ? "0 4px 14px rgba(16, 185, 129, 0.15)"
                      : "0 2px 8px rgba(0,0,0,0.03)",
                  }}
                >
                  <div className="review-item-top">
                    <div className="reviewer-info">
                      <div
                        className="reviewer-avatar"
                        style={{
                          background: isRecent ? "#10b981" : "#3b82f6",
                          color: "#fff",
                        }}
                      >
                        {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : "C"}
                      </div>
                      <div>
                        <strong>{rev.customerName}</strong>
                        {isRecent && (
                          <span
                            style={{
                              marginLeft: "8px",
                              background: "#10b981",
                              color: "#fff",
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "12px",
                            }}
                          >
                            ✨ New Customer Feedback
                          </span>
                        )}
                        <span className="review-date-text">
                          {rev.date} • {rev.service || profileForm.service}
                        </span>
                      </div>
                    </div>
                    <div className="rating-badge-pill">
                      {"★".repeat(Math.round(rev.rating))} <strong>{rev.rating}</strong>
                    </div>
                  </div>

                  <p className="review-comment-text" style={{ fontSize: "14px", margin: "10px 0" }}>
                    "{rev.comment}"
                  </p>

                  {rev.badge && (
                    <span className="review-verified-badge">
                      <ThumbsUp size={12} className="inline mr-1" /> {rev.badge}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB: OVERVIEW & LIVE ================= */}
      {activeTab === "overview" && (
        <div className="tab-pane-content" style={{ padding: "24px" }}>
          {/* STATS TILES ROW */}
          <div className="partner-stats-grid">
            <div className="stat-card">
              <div className="stat-icon-wrapper bg-emerald-500/20 text-emerald-400">
                <DollarSign size={24} />
              </div>
              <div>
                <span className="stat-label">Today's Earnings</span>
                <h4 className="stat-value text-emerald-400">₹{todayEarnings}</h4>
                <small className="stat-micro">₹{walletBalance} in Wallet</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-blue-500/20 text-blue-400">
                <CheckCircle size={24} />
              </div>
              <div>
                <span className="stat-label">Jobs Completed</span>
                <h4 className="stat-value">{jobsDoneCount} Done</h4>
                <small className="stat-micro text-blue-400">100% Verified</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-amber-500/20 text-amber-400">
                <Star size={24} />
              </div>
              <div>
                <span className="stat-label">Customer Rating</span>
                <h4 className="stat-value text-amber-400">⭐ {avgRating} / 5</h4>
                <small className="stat-micro">({reviewsList.length} verified reviews)</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-purple-500/20 text-purple-400">
                <Bike size={24} />
              </div>
              <div>
                <span className="stat-label">Assigned Vehicle</span>
                <h4 className="stat-value text-purple-300">
                  {profileForm.vehicle.split(" ")[0]}
                </h4>
                <small className="stat-micro">Ready for Rapid Dispatch</small>
              </div>
            </div>
          </div>

          {/* INCOMING INSTANT JOB REQUEST */}
          {incomingJob && (
            <div className="job-alert-modal pulse-glow-amber" style={{ marginTop: "20px" }}>
              <div className="job-alert-header">
                <div className="job-alert-title">
                  <Bell className="bell-ring text-amber-400" size={24} />
                  <h4>New Instant Job Request! ⚡</h4>
                </div>
                <div className="countdown-ring">{countdown}s</div>
              </div>

              <div className="job-alert-details">
                <div className="job-customer-row">
                  <User size={20} className="text-blue-400" />
                  <div>
                    <strong>{incomingJob.customerName}</strong>
                    <p className="service-tag">{incomingJob.service} Service Request</p>
                  </div>
                  <div className="job-fare-badge">₹{incomingJob.fare}</div>
                </div>

                <div className="job-address-line">
                  <MapPin size={16} className="text-amber-400 shrink-0" />
                  <span>{incomingJob.address}</span>
                </div>

                <div className="job-meta-chips">
                  <span>
                    🛵 Distance: <strong>{incomingJob.distanceKm} km away</strong>
                  </span>
                  <span>
                    ⏱️ ETA: <strong>~{incomingJob.etaMins} mins</strong>
                  </span>
                  <span>
                    💰 Payment: <strong>Cash / UPI at doorstep</strong>
                  </span>
                </div>

                <div className="job-issue-box">
                  <p>
                    <strong>Customer Note:</strong> {incomingJob.issueDescription}
                  </p>
                </div>
              </div>

              <div className="job-alert-actions">
                <button className="decline-job-btn" onClick={handleDeclineJob}>
                  <XCircle size={18} /> Decline
                </button>
                <button className="accept-job-btn" onClick={handleAcceptJob}>
                  <CheckCircle size={18} /> Accept Booking Now ⚡
                </button>
              </div>
            </div>
          )}

          {/* ACTIVE JOB WITH TWO-OTP WORKFLOW */}
          {activeJob && (
            <div className="active-partner-job-card" style={{ marginTop: "20px" }}>
              <div className="active-job-top-bar">
                <div className="active-job-badge">⚡ ACTIVE JOB IN PROGRESS</div>
                <div className="active-job-fare">Pay: ₹{activeJob.fare}</div>
              </div>

              <div className="active-job-content" style={{ padding: "20px" }}>
                <div className="active-customer-info">
                  <h4>Customer: {activeJob.customerName}</h4>
                  <p className="address">
                    <MapPin size={15} className="inline mr-1 text-red-500" /> {activeJob.address}
                  </p>
                  <p className="issue">
                    <strong>Issue:</strong> {activeJob.issueDescription}
                  </p>
                </div>

                {/* STAGE 1: WORKER ARRIVED - ENTER START OTP */}
                {activeJob.stage === "ARRIVED_PENDING_START_OTP" && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "2px solid #10b981",
                      borderRadius: "12px",
                      padding: "16px",
                      margin: "14px 0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <MapPin size={18} className="text-emerald-600" />
                      <strong style={{ color: "#065f46", fontSize: "15px" }}>
                        You have arrived at work location!
                      </strong>
                    </div>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#047857" }}>
                      Ask customer for the <strong>Start OTP</strong> to verify arrival and begin working.
                      (Simulated Customer OTP: <strong style={{ color: "#059669" }}>{activeJob.startOtp}</strong>)
                    </p>

                    <form
                      onSubmit={handlePartnerVerifyStartOTP}
                      style={{ display: "flex", gap: "10px", alignItems: "center" }}
                    >
                      <input
                        type="text"
                        placeholder="Enter Start OTP"
                        maxLength={4}
                        value={startOtpInput}
                        onChange={(e) => setStartOtpInput(e.target.value)}
                        style={{
                          width: "140px",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "18px",
                          fontWeight: 700,
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setStartOtpInput(activeJob.startOtp)}
                        style={{
                          background: "#e2e8f0",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Auto-fill OTP
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: "#10b981",
                          color: "#fff",
                          border: "none",
                          padding: "9px 16px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Verify & Start Work ⚡
                      </button>
                    </form>
                    {startOtpError && (
                      <p style={{ color: "#dc2626", fontSize: "12px", margin: "6px 0 0 0" }}>
                        {startOtpError}
                      </p>
                    )}
                  </div>
                )}

                {/* STAGE 2: WORKING IN PROGRESS & LIVE TIMER */}
                {activeJob.stage === "WORKING" && (
                  <div
                    style={{
                      background: "#fffbeb",
                      border: "2px solid #f59e0b",
                      borderRadius: "12px",
                      padding: "16px",
                      margin: "14px 0",
                      textAlign: "center",
                    }}
                  >
                    <h4 style={{ margin: "0 0 6px 0", color: "#92400e" }}>
                      Work in Progress ⚡
                    </h4>
                    <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#b45309" }}>
                      Timer: <strong>{formatSecs(jobWorkTimer)}</strong> • Complete the service at customer's home.
                    </p>
                    <button
                      type="button"
                      onClick={handlePartnerSendFinishMessage}
                      style={{
                        background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                        color: "#fff",
                        border: "none",
                        padding: "10px 20px",
                        borderRadius: "8px",
                        fontWeight: 700,
                        fontSize: "14px",
                        cursor: "pointer",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                      }}
                    >
                      <Send size={16} /> Work Finished: Send Message to Customer & Request End OTP 💬
                    </button>
                  </div>
                )}

                {/* STAGE 3: WORK FINISHED - ENTER END OTP */}
                {activeJob.stage === "COMPLETED_PENDING_END_OTP" && (
                  <div
                    style={{
                      background: "#f0fdf4",
                      border: "2px solid #16a34a",
                      borderRadius: "12px",
                      padding: "16px",
                      margin: "14px 0",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                      <CheckCircle2 size={18} className="text-green-600" />
                      <strong style={{ color: "#166534", fontSize: "15px" }}>
                        Message sent to customer! Please verify End OTP
                      </strong>
                    </div>
                    <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#15803d" }}>
                      Customer was sent: <em>"Namaste! Work completed. Please share Completion OTP."</em>
                      <br />
                      (Simulated Customer End OTP: <strong style={{ color: "#16a34a" }}>{activeJob.endOtp}</strong>)
                    </p>

                    <form
                      onSubmit={handlePartnerVerifyEndOTP}
                      style={{ display: "flex", gap: "10px", alignItems: "center" }}
                    >
                      <input
                        type="text"
                        placeholder="Enter End OTP"
                        maxLength={4}
                        value={endOtpInput}
                        onChange={(e) => setEndOtpInput(e.target.value)}
                        style={{
                          width: "140px",
                          padding: "8px",
                          textAlign: "center",
                          fontSize: "18px",
                          fontWeight: 700,
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setEndOtpInput(activeJob.endOtp)}
                        style={{
                          background: "#e2e8f0",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "6px",
                          fontSize: "12px",
                          cursor: "pointer",
                        }}
                      >
                        Auto-fill OTP
                      </button>
                      <button
                        type="submit"
                        style={{
                          background: "#16a34a",
                          color: "#fff",
                          border: "none",
                          padding: "9px 16px",
                          borderRadius: "8px",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Verify End OTP & Finalize Order 🎉
                      </button>
                    </form>
                    {endOtpError && (
                      <p style={{ color: "#dc2626", fontSize: "12px", margin: "6px 0 0 0" }}>
                        {endOtpError}
                      </p>
                    )}
                  </div>
                )}

                <div className="active-job-actions" style={{ marginTop: "12px" }}>
                  <a href={`tel:${activeJob.customerPhone}`} className="call-customer-btn">
                    <Phone size={16} /> Call Customer ({activeJob.customerPhone})
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* WAITING RADAR */}
          {!incomingJob && !activeJob && isOnline && (
            <div className="waiting-job-banner">
              <div className="radar-sweep-box">
                <div className="radar-sweep-circle"></div>
                <Wrench size={24} className="radar-center-icon text-amber-400" />
              </div>
              <div className="waiting-text-group">
                <h4>Live Radar Active in {profileForm.location}</h4>
                <p>
                  Scanning for nearby homeowners requiring {profileForm.service} services...
                  You will receive an instant audio & visual alert when a customer books!
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB: JOB HISTORY ================= */}
      {activeTab === "history" && (
        <div className="tab-pane-content" style={{ padding: "24px" }}>
          <div className="section-title-row">
            <div>
              <h3 style={{ margin: 0 }}>Completed Jobs History</h3>
              <p className="subtitle-text">
                Record of all completed customer orders, payments, and ratings.
              </p>
            </div>
            <div className="history-summary-badge">
              Total Earned: <strong>₹{todayEarnings + 2400}</strong>
            </div>
          </div>

          <div className="job-history-table-container">
            {jobHistory.map((item) => (
              <div key={item.id} className="history-card-item">
                <div className="history-card-header">
                  <div>
                    <div className="history-customer-name">
                      <strong>{item.customerName}</strong>
                      <span className="history-service-badge">{item.service}</span>
                    </div>
                    <span className="history-date">
                      <Clock size={13} className="inline mr-1" /> {item.date}
                    </span>
                  </div>
                  <div className="history-fare-badge">
                    <span className="fare-amount">+₹{item.fare}</span>
                    <span className="payment-mode-tag">{item.paymentMode}</span>
                  </div>
                </div>

                <div className="history-address-row">
                  <MapPin size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <span>{item.address}</span>
                </div>

                {item.review && (
                  <div className="history-customer-review-box">
                    <div className="review-stars-row">
                      <span>{"★".repeat(Math.round(item.rating || 5))}</span>
                      <small className="rating-num">{item.rating}/5</small>
                    </div>
                    <p className="review-quote">"{item.review}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB: PROFESSIONAL PROFILE ================= */}
      {activeTab === "profile" && (
        <div className="tab-pane-content" style={{ padding: "24px" }}>
          {profileSaveSuccess && (
            <div className="profile-saved-toast">
              ✓ Profile information updated and saved successfully!
            </div>
          )}

          <div className="profile-card-container">
            <div className="profile-hero-card">
              <div className="profile-hero-left">
                <img
                  src={
                    currentWorker?.photo ||
                    "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
                  }
                  alt="Worker"
                  className="profile-large-avatar"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2 style={{ margin: 0 }}>{profileForm.name}</h2>
                    <ShieldCheck className="text-emerald-500 inline" size={22} />
                  </div>
                  <p className="profile-service-text">{profileForm.service} Specialist</p>
                  <p className="profile-city-text">
                    <MapPin size={14} className="inline mr-1" /> {profileForm.location}, Uttar Pradesh
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="edit-profile-btn"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
              >
                <Edit3 size={16} /> {isEditingProfile ? "Cancel" : "Edit Profile"}
              </button>
            </div>

            {!isEditingProfile ? (
              <div className="profile-info-grid">
                <div className="info-tile">
                  <span className="info-tile-label">Registered Phone</span>
                  <strong className="info-tile-val">{profileForm.phone}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Email Address</span>
                  <strong className="info-tile-val">{profileForm.email}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Primary Service</span>
                  <strong className="info-tile-val">{profileForm.service}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Years of Experience</span>
                  <strong className="info-tile-val">{profileForm.experience}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Assigned Vehicle</span>
                  <strong className="info-tile-val">{profileForm.vehicle}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Operating City</span>
                  <strong className="info-tile-val">{profileForm.location}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Base Visit Charge</span>
                  <strong className="info-tile-val text-emerald-600">₹{profileForm.baseRate}</strong>
                </div>
                <div className="info-tile">
                  <span className="info-tile-label">Average Customer Rating</span>
                  <strong className="info-tile-val text-amber-500">⭐ {avgRating} / 5</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="profile-edit-form">
                <div className="form-fields-grid">
                  <div className="form-field-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={profileForm.name}
                      onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Phone Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Operating City</label>
                    <input
                      type="text"
                      value={profileForm.location}
                      onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Visiting Fee (₹)</label>
                    <input
                      type="number"
                      value={profileForm.baseRate}
                      onChange={(e) => setProfileForm({ ...profileForm, baseRate: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="form-actions-row">
                  <button type="button" className="cancel-btn" onClick={() => setIsEditingProfile(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="save-profile-btn">
                    <Save size={16} /> Save Changes
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB: WALLET & EARNINGS ================= */}
      {activeTab === "wallet" && (
        <div className="tab-pane-content" style={{ padding: "24px" }}>
          {withdrawalSuccess && (
            <div className="profile-saved-toast">✓ {withdrawalSuccess}</div>
          )}

          <div className="wallet-overview-grid">
            <div className="wallet-main-card">
              <span className="wallet-card-label">Available Wallet Balance</span>
              <h2 className="wallet-big-amount">₹{walletBalance}</h2>
              <p className="wallet-subtext">Instant withdrawal available via UPI / IMPS</p>

              <div className="wallet-action-row">
                <button
                  className="withdraw-now-btn"
                  onClick={handleWithdrawFunds}
                  disabled={walletBalance <= 0}
                >
                  <ArrowUpRight size={18} /> Transfer to Bank Account
                </button>
              </div>

              <div className="linked-bank-info">
                <span>
                  Linked Bank: <strong>State Bank of India (A/C: ****4892)</strong>
                </span>
                <span className="verified-pill">✓ Verified</span>
              </div>
            </div>

            <div className="earnings-summary-cards">
              <div className="earnings-mini-card">
                <span className="mini-card-label">Today's Earnings</span>
                <h4 className="mini-card-value text-emerald-600">₹{todayEarnings}</h4>
                <small className="mini-card-sub">From {jobsDoneCount} jobs</small>
              </div>
              <div className="earnings-mini-card">
                <span className="mini-card-label">This Week</span>
                <h4 className="mini-card-value text-blue-600">₹{todayEarnings + 7450}</h4>
                <small className="mini-card-sub">22 completed jobs</small>
              </div>
              <div className="earnings-mini-card">
                <span className="mini-card-label">This Month</span>
                <h4 className="mini-card-value text-purple-600">₹{todayEarnings + 28900}</h4>
                <small className="mini-card-sub">89 completed jobs</small>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= JOB COMPLETION & CUSTOMER REVIEW MODAL ================= */}
      {showCompleteModal && activeJob && (
        <div className="complete-job-modal-backdrop">
          <div className="complete-job-modal-card">
            <div className="modal-header-row">
              <h3>Job Completed Successfully! 🎉</h3>
              <button className="modal-close-x" onClick={() => setShowCompleteModal(false)}>
                ✕
              </button>
            </div>

            <div className="complete-modal-summary">
              <div className="summary-pill">
                <span>Customer:</span>
                <strong>{activeJob.customerName}</strong>
              </div>
              <div className="summary-pill">
                <span>Service:</span>
                <strong>{activeJob.service}</strong>
              </div>
              <div className="summary-pill">
                <span>Total Fare:</span>
                <strong className="text-emerald-600 text-lg">₹{activeJob.fare}</strong>
              </div>
            </div>

            <div className="complete-modal-form">
              <label>Payment Collection Mode:</label>
              <select
                className="modal-select-input"
                value={completedJobReview.paymentMode}
                onChange={(e) =>
                  setCompletedJobReview({ ...completedJobReview, paymentMode: e.target.value })
                }
              >
                <option value="Online UPI / App Paid">Online UPI / App Paid</option>
                <option value="Cash Collected at Doorstep">Cash Collected at Doorstep</option>
              </select>

              <label className="mt-3">Customer Rating Received:</label>
              <div className="stars-input-row">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className={`star-pick-btn ${s <= completedJobReview.rating ? "active" : ""}`}
                    onClick={() => setCompletedJobReview({ ...completedJobReview, rating: s })}
                  >
                    ★
                  </button>
                ))}
                <span className="selected-star-count">{completedJobReview.rating} Stars</span>
              </div>

              <label className="mt-3">Customer Feedback / Review:</label>
              <textarea
                className="modal-textarea"
                rows="3"
                value={completedJobReview.comment}
                onChange={(e) =>
                  setCompletedJobReview({ ...completedJobReview, comment: e.target.value })
                }
              ></textarea>
            </div>

            <div className="modal-actions-row">
              <button className="modal-cancel-btn" onClick={() => setShowCompleteModal(false)}>
                Back
              </button>
              <button className="modal-submit-btn" onClick={handleConfirmCompletion}>
                <Check size={18} /> Confirm & Publish to Dashboard ⭐
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
