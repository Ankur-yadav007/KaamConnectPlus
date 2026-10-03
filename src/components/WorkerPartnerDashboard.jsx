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
} from "lucide-react";

export default function WorkerPartnerDashboard({
  currentUser,
  lang = "hinglish",
  currentCity = { name: "Jhansi", state: "Uttar Pradesh" },
  onUpdateCurrentUser,
}) {
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "history" | "reviews" | "profile" | "wallet"
  const [isOnline, setIsOnline] = useState(true);
  const [incomingJob, setIncomingJob] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [activeJob, setActiveJob] = useState(null);

  // Financial & Job stats
  const [todayEarnings, setTodayEarnings] = useState(1450);
  const [walletBalance, setWalletBalance] = useState(4820);
  const [jobsDoneCount, setJobsDoneCount] = useState(4);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState("");

  // Job Completion Modal State
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completedJobReview, setCompletedJobReview] = useState({
    rating: 5,
    comment: "Excellent service! Arrived in under 10 minutes, fixed the issue cleanly and very polite.",
    paymentMode: "UPI / Online Paid",
  });

  // Profile Edit State
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser?.name || "Ajit Yadav",
    phone: currentUser?.phone || "+91 98381 23456",
    email: currentUser?.email || "worker@kaamconnect.com",
    service: currentUser?.service || "Electrician",
    experience: currentUser?.experience || "10 Years",
    vehicle: currentUser?.vehicle || "Hero Splendor 🛵",
    location: currentUser?.location || currentCity?.name || "Gorakhpur",
    baseRate: 199,
    hourlyRate: 250,
    languages: "Hindi, English, Bhojpuri",
    bio: "Certified professional with 10+ years experience in domestic and commercial electrical repairs, smart home wiring, and appliance servicing.",
  });
  const [profileSaveSuccess, setProfileSaveSuccess] = useState(false);

  // Initial Job History Data
  const [jobHistory, setJobHistory] = useState([
    {
      id: "jh-101",
      date: "Today, 11:20 AM",
      customerName: "Sharma Family",
      service: "Electrician",
      address: "Flat 304, Green Heights, " + (currentCity?.name || "Jhansi"),
      fare: 349,
      paymentMode: "Online UPI",
      status: "Completed",
      rating: 5,
      review: "Very fast response! Repaired the main MCB problem in 15 minutes.",
    },
    {
      id: "jh-102",
      date: "Today, 09:45 AM",
      customerName: "Vikram Malhotra",
      service: "Electrician",
      address: "Civil Lines, Near Circuit House",
      fare: 299,
      paymentMode: "Cash Collected",
      status: "Completed",
      rating: 5,
      review: "Clean work and reasonable visiting charges. Highly recommended.",
    },
    {
      id: "jh-103",
      date: "Yesterday, 04:30 PM",
      customerName: "Dr. Ananya Sen",
      service: "Electrician",
      address: "Sadar Bazar, Cantt Road",
      fare: 450,
      paymentMode: "Online UPI",
      status: "Completed",
      rating: 4.8,
      review: "Replaced 3 switchboards and ceiling fan regulator smoothly.",
    },
    {
      id: "jh-104",
      date: "Yesterday, 01:15 PM",
      customerName: "Pooja Verma",
      service: "Electrician",
      address: "Elite Chouraha, Commercial Complex",
      fare: 350,
      paymentMode: "Online UPI",
      status: "Completed",
      rating: 5,
      review: "Arrived within 10 minutes of booking. Very polite professional.",
    },
  ]);

  // Initial Customer Reviews List
  const [reviewsList, setReviewsList] = useState([
    {
      id: "rev-1",
      customerName: "Sunita Gupta",
      rating: 5,
      date: "2 hours ago",
      service: "Electrician",
      comment: "Arrived in 8 mins! Fixed our power outage issue quickly. Very professional.",
      badge: "On-time Pro",
    },
    {
      id: "rev-2",
      customerName: "Vikram Malhotra",
      rating: 5,
      date: "Today, morning",
      service: "Electrician",
      comment: "Best service partner! Came with complete toolkit and spare MCBs.",
      badge: "Expert Diagnosis",
    },
    {
      id: "rev-3",
      customerName: "Dr. Ananya Sen",
      rating: 4.9,
      date: "Yesterday",
      service: "Electrician",
      comment: "Polite demeanor and wore shoe covers. High quality electrical wiring.",
      badge: "Neat & Clean",
    },
    {
      id: "rev-4",
      customerName: "Rakesh Agarwal",
      rating: 5,
      date: "3 days ago",
      service: "Electrician",
      comment: "Fair rates, no bargaining required. App payment was seamless.",
      badge: "Fair Price",
    },
  ]);

  // Sync profile form when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setProfileForm((prev) => ({
        ...prev,
        name: currentUser.name || prev.name,
        phone: currentUser.phone || prev.phone,
        email: currentUser.email || prev.email,
        service: currentUser.service || prev.service,
        experience: currentUser.experience || prev.experience,
        vehicle: currentUser.vehicle || prev.vehicle,
        location: currentUser.location || currentCity?.name || prev.location,
      }));
    }
  }, [currentUser, currentCity]);

  // Simulate an incoming job request after 7 seconds if online and idle
  useEffect(() => {
    if (!isOnline || activeJob || incomingJob) return;

    const timer = setTimeout(() => {
      setIncomingJob({
        id: "req-" + Date.now(),
        customerName: "Amitabh Singhal",
        service: profileForm.service || "Electrician",
        address: "House 12B, Officers Colony, " + (currentCity?.name || profileForm.location),
        distanceKm: 1.4,
        etaMins: 6,
        fare: 299,
        issueDescription: "Main MCB tripping repeatedly & light sparking in kitchen board",
        customerPhone: "+91 98765 43210",
        requestedTime: "Just now",
      });
      setCountdown(15);
    }, 7000);

    return () => clearTimeout(timer);
  }, [isOnline, activeJob, incomingJob, currentCity, profileForm]);

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
    setActiveJob(incomingJob);
    setIncomingJob(null);
  };

  const handleDeclineJob = () => {
    setIncomingJob(null);
  };

  const handleOpenCompleteModal = () => {
    setShowCompleteModal(true);
  };

  const handleConfirmCompletion = () => {
    if (!activeJob) return;

    // 1. Update stats
    setTodayEarnings((prev) => prev + activeJob.fare);
    setWalletBalance((prev) => prev + activeJob.fare);
    setJobsDoneCount((prev) => prev + 1);

    // 2. Add to Job History
    const newHistoryEntry = {
      id: "jh-" + Date.now(),
      date: "Just now",
      customerName: activeJob.customerName,
      service: activeJob.service,
      address: activeJob.address,
      fare: activeJob.fare,
      paymentMode: completedJobReview.paymentMode,
      status: "Completed",
      rating: completedJobReview.rating,
      review: completedJobReview.comment,
    };
    setJobHistory((prev) => [newHistoryEntry, ...prev]);

    // 3. Add to Ratings & Reviews
    const newReviewEntry = {
      id: "rev-" + Date.now(),
      customerName: activeJob.customerName,
      rating: completedJobReview.rating,
      date: "Just now",
      service: activeJob.service,
      comment: completedJobReview.comment,
      badge: "5★ Customer Verified",
    };
    setReviewsList((prev) => [newReviewEntry, ...prev]);

    // 4. Reset active job and modal
    setShowCompleteModal(false);
    setActiveJob(null);
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

  return (
    <div className="partner-dashboard-card">
      {/* HEADER BANNER */}
      <div className="partner-dashboard-header">
        <div className="partner-profile-meta">
          <img
            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
            alt="Worker Profile"
            className="partner-avatar"
          />
          <div>
            <div className="partner-name-row">
              <h3>
                {profileForm.name}{" "}
                <ShieldCheck className="verified-shield-icon" size={20} title="Aadhaar & Police Verified Pro" />
              </h3>
              <span className="badge-verified">✓ Verified Kaamdar Pro</span>
            </div>
            <p className="partner-sub">
              Master {profileForm.service} • {profileForm.experience} Exp • {profileForm.location}
            </p>
          </div>
        </div>

        {/* DUTY ON/OFF TOGGLE */}
        <div className="partner-online-toggle">
          <div className="status-label-group">
            <span className={`status-pill ${isOnline ? "online" : "offline"}`}>
              <span className="pulsing-status-dot"></span>
              {isOnline ? "ONLINE (ON DUTY)" : "OFFLINE"}
            </span>
            <small className="status-hint">
              {isOnline ? "Receiving on-demand customer requests" : "Duty paused"}
            </small>
          </div>

          <button
            className={`power-switch-btn ${isOnline ? "active" : ""}`}
            onClick={() => setIsOnline(!isOnline)}
            title="Toggle Duty Status"
          >
            <Power size={22} />
          </button>
        </div>
      </div>

      {/* DASHBOARD TABS NAVIGATION */}
      <div className="partner-tabs-bar">
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
          className={`partner-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => setActiveTab("reviews")}
        >
          <Star size={16} /> Ratings & Reviews ({reviewsList.length})
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

      {/* ================= TAB 1: OVERVIEW & LIVE RADAR ================= */}
      {activeTab === "overview" && (
        <div className="tab-pane-content">
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
                <small className="stat-micro text-blue-400">100% Acceptance</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-amber-500/20 text-amber-400">
                <Star size={24} />
              </div>
              <div>
                <span className="stat-label">Customer Rating</span>
                <h4 className="stat-value text-amber-400">⭐ 4.95 / 5</h4>
                <small className="stat-micro">({reviewsList.length} verified reviews)</small>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon-wrapper bg-purple-500/20 text-purple-400">
                <Bike size={24} />
              </div>
              <div>
                <span className="stat-label">Assigned Vehicle</span>
                <h4 className="stat-value text-purple-300">{profileForm.vehicle.split(" ")[0]}</h4>
                <small className="stat-micro">Ready for Rapid Dispatch</small>
              </div>
            </div>
          </div>

          {/* INCOMING RIDE / JOB ALERT (RAPIDO / UBER STYLE) */}
          {incomingJob && (
            <div className="job-alert-modal pulse-glow-amber">
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
                  <span>🛵 Distance: <strong>{incomingJob.distanceKm} km away</strong></span>
                  <span>⏱️ ETA: <strong>~{incomingJob.etaMins} mins</strong></span>
                  <span>💰 Payment: <strong>Cash / UPI at doorstep</strong></span>
                </div>

                <div className="job-issue-box">
                  <p><strong>Customer Note:</strong> {incomingJob.issueDescription}</p>
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

          {/* ACTIVE JOB IN PROGRESS */}
          {activeJob && (
            <div className="active-partner-job-card">
              <div className="active-job-top-bar">
                <div className="active-job-badge">⚡ ACTIVE JOB IN PROGRESS</div>
                <div className="active-job-fare">Pay: ₹{activeJob.fare}</div>
              </div>

              <div className="active-job-content">
                <div className="active-customer-info">
                  <h4>Customer: {activeJob.customerName}</h4>
                  <p className="address">
                    <MapPin size={15} className="inline mr-1 text-red-500" /> {activeJob.address}
                  </p>
                  <p className="issue">
                    <strong>Issue:</strong> {activeJob.issueDescription}
                  </p>
                </div>

                <div className="active-otp-box">
                  <span>Safety PIN / OTP: <strong>4892</strong></span>
                  <small>Verify with customer upon arrival</small>
                </div>

                <div className="active-job-actions">
                  <a href={`tel:${activeJob.customerPhone}`} className="call-customer-btn">
                    <Phone size={16} /> Call Customer ({activeJob.customerPhone})
                  </a>
                  <button className="complete-partner-job-btn" onClick={handleOpenCompleteModal}>
                    <CheckCircle size={18} /> Mark Work Completed (Collect ₹{activeJob.fare})
                  </button>
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
                <p>Scanning for nearby homeowners requiring {profileForm.service} services... A loud chime will sound when a request arrives!</p>
              </div>
            </div>
          )}

          {/* OFFLINE BANNER */}
          {!isOnline && (
            <div className="offline-banner text-center">
              <Power size={36} className="mx-auto mb-2 text-gray-400" />
              <h4>You are currently Offline</h4>
              <p>Turn duty switch ON in the top right to receive instant booking alerts and start earning.</p>
            </div>
          )}

          {/* RECENT JOBS SNAPSHOT */}
          <div className="dashboard-section-block">
            <div className="section-title-row">
              <h4>Today's Activity</h4>
              <button className="view-all-link-btn" onClick={() => setActiveTab("history")}>
                View All History <ChevronRight size={14} />
              </button>
            </div>
            <div className="snapshot-jobs-list">
              {jobHistory.slice(0, 2).map((item) => (
                <div key={item.id} className="snapshot-job-row">
                  <div className="snapshot-left">
                    <span className="check-badge">✓</span>
                    <div>
                      <strong>{item.customerName}</strong>
                      <p>{item.service} • {item.address}</p>
                    </div>
                  </div>
                  <div className="snapshot-right">
                    <span className="snapshot-fare">+₹{item.fare}</span>
                    <span className="snapshot-time">{item.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: JOB HISTORY ================= */}
      {activeTab === "history" && (
        <div className="tab-pane-content">
          <div className="section-title-row">
            <div>
              <h3>Completed Jobs History</h3>
              <p className="subtitle-text">Record of all past work orders, addresses, and customer payments.</p>
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
                      <span>{"⭐".repeat(Math.round(item.rating))}</span>
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

      {/* ================= TAB 3: RATINGS & REVIEWS ================= */}
      {activeTab === "reviews" && (
        <div className="tab-pane-content">
          {/* RATINGS OVERVIEW CARD */}
          <div className="rating-overview-card">
            <div className="rating-score-box">
              <span className="big-rating-number">4.95</span>
              <div className="stars-cluster">⭐⭐⭐⭐⭐</div>
              <p className="total-ratings-count">Based on {reviewsList.length + 86} customer reviews</p>
              <span className="top-pro-tag">🏆 Top 1% Kaamdar Partner</span>
            </div>

            <div className="rating-bars-breakdown">
              <div className="bar-row">
                <span>5 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "92%" }}></div></div>
                <span>92%</span>
              </div>
              <div className="bar-row">
                <span>4 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "7%" }}></div></div>
                <span>7%</span>
              </div>
              <div className="bar-row">
                <span>3 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "1%" }}></div></div>
                <span>1%</span>
              </div>
              <div className="bar-row">
                <span>2 Star</span>
                <div className="bar-track"><div className="bar-fill" style={{ width: "0%" }}></div></div>
                <span>0%</span>
              </div>
            </div>

            <div className="praise-badges-box">
              <p className="praise-title">Customer Compliments:</p>
              <div className="praise-chips-wrap">
                <span className="praise-chip">⚡ On-Time Arrival (99%)</span>
                <span className="praise-chip">🧰 Expert Diagnosis (98%)</span>
                <span className="praise-chip">🧼 Neat & Clean Work (96%)</span>
                <span className="praise-chip">🤝 Polite & Respectful (100%)</span>
              </div>
            </div>
          </div>

          {/* INDIVIDUAL REVIEWS LIST */}
          <h4 className="reviews-section-heading">Recent Customer Testimonials</h4>
          <div className="reviews-cards-list">
            {reviewsList.map((rev) => (
              <div key={rev.id} className="review-item-card">
                <div className="review-item-top">
                  <div className="reviewer-info">
                    <div className="reviewer-avatar">{rev.customerName.charAt(0)}</div>
                    <div>
                      <strong>{rev.customerName}</strong>
                      <span className="review-date-text">{rev.date} • {rev.service}</span>
                    </div>
                  </div>
                  <div className="rating-badge-pill">
                    {"⭐".repeat(Math.round(rev.rating))} <strong>{rev.rating}</strong>
                  </div>
                </div>

                <p className="review-comment-text">"{rev.comment}"</p>

                {rev.badge && (
                  <span className="review-verified-badge">
                    <ThumbsUp size={12} className="inline mr-1" /> {rev.badge}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: PROFESSIONAL PROFILE ================= */}
      {activeTab === "profile" && (
        <div className="tab-pane-content">
          {profileSaveSuccess && (
            <div className="profile-saved-toast">
              ✓ Profile information updated and saved successfully!
            </div>
          )}

          <div className="profile-card-container">
            {/* PROFILE HEADER CARD */}
            <div className="profile-hero-card">
              <div className="profile-hero-left">
                <img
                  src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
                  alt="Worker"
                  className="profile-large-avatar"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h2>{profileForm.name}</h2>
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
                {isEditingProfile ? "Cancel Editing" : <><Edit3 size={16} /> Edit Profile</>}
              </button>
            </div>

            {/* VERIFICATION BADGES ROW */}
            <div className="verification-badges-grid">
              <div className="verification-badge-item active">
                <span className="badge-icon">✓</span>
                <div>
                  <strong>Aadhaar KYC Verified</strong>
                  <p>Government ID authenticated</p>
                </div>
              </div>
              <div className="verification-badge-item active">
                <span className="badge-icon">✓</span>
                <div>
                  <strong>Skill Certification</strong>
                  <p>Trade tested & approved</p>
                </div>
              </div>
              <div className="verification-badge-item active">
                <span className="badge-icon">✓</span>
                <div>
                  <strong>Police Background Clear</strong>
                  <p>Clean background checked</p>
                </div>
              </div>
            </div>

            {/* PROFILE DETAILS OR EDIT FORM */}
            {!isEditingProfile ? (
              <div className="profile-details-grid">
                <div className="detail-item">
                  <span className="detail-label">Mobile Number</span>
                  <span className="detail-value">{profileForm.phone}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Email Address</span>
                  <span className="detail-value">{profileForm.email}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Experience</span>
                  <span className="detail-value">{profileForm.experience}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Assigned Vehicle</span>
                  <span className="detail-value">{profileForm.vehicle}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Visiting / Base Charge</span>
                  <span className="detail-value text-emerald-600 font-bold">₹{profileForm.baseRate}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Hourly Rate</span>
                  <span className="detail-value text-emerald-600 font-bold">₹{profileForm.hourlyRate}/hour</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Working Hours</span>
                  <span className="detail-value">8:00 AM - 8:30 PM (Mon - Sun)</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Languages Known</span>
                  <span className="detail-value">{profileForm.languages}</span>
                </div>
                <div className="detail-item full-span">
                  <span className="detail-label">Professional Bio</span>
                  <p className="detail-bio">{profileForm.bio}</p>
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
                      required
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Mobile Number</label>
                    <input
                      type="text"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Service Category</label>
                    <select
                      value={profileForm.service}
                      onChange={(e) => setProfileForm({ ...profileForm, service: e.target.value })}
                    >
                      <option value="Electrician">Electrician</option>
                      <option value="Plumber">Plumber</option>
                      <option value="Carpenter">Carpenter</option>
                      <option value="Painter">Painter</option>
                      <option value="AC & Appliance">AC & Appliance</option>
                      <option value="Cleaning">Cleaning</option>
                      <option value="Mason">Mason</option>
                      <option value="Mechanic">Mechanic</option>
                    </select>
                  </div>
                  <div className="form-field-group">
                    <label>Experience</label>
                    <input
                      type="text"
                      value={profileForm.experience}
                      onChange={(e) => setProfileForm({ ...profileForm, experience: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Vehicle</label>
                    <input
                      type="text"
                      value={profileForm.vehicle}
                      onChange={(e) => setProfileForm({ ...profileForm, vehicle: e.target.value })}
                    />
                  </div>
                  <div className="form-field-group">
                    <label>City / Location</label>
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
                  <div className="form-field-group">
                    <label>Hourly Rate (₹)</label>
                    <input
                      type="number"
                      value={profileForm.hourlyRate}
                      onChange={(e) => setProfileForm({ ...profileForm, hourlyRate: Number(e.target.value) })}
                    />
                  </div>
                  <div className="form-field-group full-span">
                    <label>Professional Bio</label>
                    <textarea
                      rows="3"
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                    ></textarea>
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

      {/* ================= TAB 5: WALLET & EARNINGS ================= */}
      {activeTab === "wallet" && (
        <div className="tab-pane-content">
          {withdrawalSuccess && (
            <div className="profile-saved-toast">
              ✓ {withdrawalSuccess}
            </div>
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
                <span>Linked Bank: <strong>State Bank of India (A/C: ****4892)</strong></span>
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
              <button className="modal-close-x" onClick={() => setShowCompleteModal(false)}>✕</button>
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
                onChange={(e) => setCompletedJobReview({ ...completedJobReview, paymentMode: e.target.value })}
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
                    ⭐
                  </button>
                ))}
                <span className="selected-star-count">{completedJobReview.rating} Stars</span>
              </div>

              <label className="mt-3">Customer Feedback / Review:</label>
              <textarea
                className="modal-textarea"
                rows="3"
                value={completedJobReview.comment}
                onChange={(e) => setCompletedJobReview({ ...completedJobReview, comment: e.target.value })}
              ></textarea>
            </div>

            <div className="modal-actions-row">
              <button className="modal-cancel-btn" onClick={() => setShowCompleteModal(false)}>
                Back
              </button>
              <button className="modal-submit-btn" onClick={handleConfirmCompletion}>
                <Check size={18} /> Confirm & Collect ₹{activeJob.fare}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
