import React, { useState, useEffect } from "react";
import { ShieldCheck, Power, Navigation, Phone, MapPin, CheckCircle, XCircle, DollarSign, Clock, User, Award, Bell } from "lucide-react";

export default function WorkerPartnerDashboard({ lang, currentCity }) {
  const [isOnline, setIsOnline] = useState(true);
  const [incomingJob, setIncomingJob] = useState(null);
  const [countdown, setCountdown] = useState(15);
  const [activeJob, setActiveJob] = useState(null);
  const [todayEarnings, setTodayEarnings] = useState(1450);
  const [jobsDoneCount, setJobsDoneCount] = useState(4);

  // Simulate an incoming job request after 6 seconds if worker is online and has no active job
  useEffect(() => {
    if (!isOnline || activeJob || incomingJob) return;

    const timer = setTimeout(() => {
      setIncomingJob({
        id: "req-" + Date.now(),
        customerName: "Sharma Family",
        service: "Electrician",
        address: "Flat 304, Green Heights, " + (currentCity?.name || "Jhansi"),
        distanceKm: 1.8,
        etaMins: 7,
        fare: 299,
        issueDescription: "Main MCB tripping repeatedly & bedroom light flickering",
        customerPhone: "+91 98765 43210",
      });
      setCountdown(15);
    }, 6000);

    return () => clearTimeout(timer);
  }, [isOnline, activeJob, incomingJob, currentCity]);

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

  const handleCompleteActiveJob = () => {
    if (activeJob) {
      setTodayEarnings((prev) => prev + activeJob.fare);
      setJobsDoneCount((prev) => prev + 1);
      setActiveJob(null);
      alert("Job marked completed! ₹" + activeJob.fare + " added to your KaamConnect Wallet!");
    }
  };

  return (
    <div className="partner-dashboard-card">
      {/* Header Banner */}
      <div className="partner-dashboard-header">
        <div className="partner-profile-meta">
          <img
            src="https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"
            alt="Worker Profile"
            className="partner-avatar"
          />
          <div>
            <div className="partner-name-row">
              <h3>Rajesh Sahu <ShieldCheck className="text-emerald-400 inline ml-1" size={18} /></h3>
              <span className="badge-verified">Verified Kaamdar</span>
            </div>
            <p className="partner-sub">Master Electrician • {currentCity?.name || "Jhansi"}</p>
          </div>
        </div>

        {/* Online / Offline Toggle */}
        <div className="partner-online-toggle">
          <span className={`status-pill ${isOnline ? "online" : "offline"}`}>
            {isOnline ? (lang === "hi" ? "ऑनलाइन (ड्यूटी पर)" : "ONLINE (On Duty)") : (lang === "hi" ? "ऑफलाइन" : "OFFLINE")}
          </span>
          <button
            className={`power-switch-btn ${isOnline ? "active" : ""}`}
            onClick={() => setIsOnline(!isOnline)}
            title="Toggle Duty Status"
          >
            <Power size={20} />
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="partner-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-emerald-500/20 text-emerald-400">
            <DollarSign size={24} />
          </div>
          <div>
            <span className="stat-label">{lang === "hi" ? "आज की कमाई (Earnings)" : "Today's Earnings"}</span>
            <h4 className="stat-value text-emerald-400">₹{todayEarnings}</h4>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-blue-500/20 text-blue-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <span className="stat-label">{lang === "hi" ? "पूरे हुए काम" : "Completed Jobs"}</span>
            <h4 className="stat-value">{jobsDoneCount} Jobs</h4>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber-500/20 text-amber-400">
            <Award size={24} />
          </div>
          <div>
            <span className="stat-label">{lang === "hi" ? "आपकी रेटिंग" : "Rating"}</span>
            <h4 className="stat-value">⭐ 4.9 / 5</h4>
          </div>
        </div>
      </div>

      {/* INCOMING RIDE / JOB ALERT POPUP (Rapido Captain Style) */}
      {incomingJob && (
        <div className="job-alert-modal pulse-glow-amber">
          <div className="job-alert-header">
            <div className="job-alert-title">
              <Bell className="bell-ring text-amber-400" size={24} />
              <h4>New Booking Request Received! ⚡</h4>
            </div>
            <div className="countdown-ring">{countdown}s</div>
          </div>

          <div className="job-alert-details">
            <div className="job-customer-row">
              <User size={18} className="text-blue-400" />
              <div>
                <strong>{incomingJob.customerName}</strong>
                <p className="service-tag">{incomingJob.service} Service</p>
              </div>
              <div className="job-fare-badge">₹{incomingJob.fare}</div>
            </div>

            <div className="job-address-line">
              <MapPin size={16} className="text-amber-400 shrink-0" />
              <span>{incomingJob.address}</span>
            </div>

            <div className="job-meta-chips">
              <span>🛵 Pickup: <strong>{incomingJob.distanceKm} km away</strong></span>
              <span>⏱️ Pickup Time: <strong>~{incomingJob.etaMins} mins</strong></span>
            </div>

            <div className="job-issue-box">
              <p><strong>Issue Note:</strong> {incomingJob.issueDescription}</p>
            </div>
          </div>

          <div className="job-alert-actions">
            <button className="decline-job-btn" onClick={handleDeclineJob}>
              <XCircle size={18} /> {lang === "hi" ? "अस्वीकार करें" : "Decline"}
            </button>
            <button className="accept-job-btn" onClick={handleAcceptJob}>
              <CheckCircle size={18} /> {lang === "hi" ? "स्वीकार करें (Accept Job)" : "Accept Job Now ⚡"}
            </button>
          </div>
        </div>
      )}

      {/* ACTIVE JOB IN PROGRESS FOR WORKER */}
      {activeJob && (
        <div className="active-partner-job-card">
          <div className="active-job-badge">ACTIVE JOB IN PROGRESS</div>
          <div className="active-job-content">
            <h4>Customer: {activeJob.customerName}</h4>
            <p className="address"><MapPin size={14} className="inline mr-1" /> {activeJob.address}</p>
            <p className="issue">Issue: {activeJob.issueDescription}</p>

            <div className="active-job-actions">
              <a href={`tel:${activeJob.customerPhone}`} className="call-customer-btn">
                <Phone size={16} /> Call Customer ({activeJob.customerPhone})
              </a>
              <button className="complete-partner-job-btn" onClick={handleCompleteActiveJob}>
                <CheckCircle size={16} /> Mark Job Completed (Collect ₹{activeJob.fare})
              </button>
            </div>
          </div>
        </div>
      )}

      {!incomingJob && !activeJob && isOnline && (
        <div className="waiting-job-banner">
          <div className="radar-sweep-small"></div>
          <p>
            {lang === "hi"
              ? "आपकी लोकेशन पर ग्राहक खोजा जा रहा है... नई बुकिंग आने पर बीप बजेगी!"
              : "Waiting for nearby customer booking requests... You will be notified instantly!"}
          </p>
        </div>
      )}

      {!isOnline && (
        <div className="offline-banner text-center">
          <Power size={32} className="mx-auto mb-2 text-gray-500" />
          <p>
            {lang === "hi"
              ? "आप अभी ऑफ़लाइन हैं। काम की बुकिंग पाने के लिए ऊपर दिए स्विच को ऑन करें।"
              : "You are currently offline. Switch duty ON to start receiving bookings near you."}
          </p>
        </div>
      )}
    </div>
  );
}
