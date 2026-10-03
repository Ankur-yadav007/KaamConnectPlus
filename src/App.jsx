import { useState, useEffect, useRef } from "react";
import logo from "./assets/logo.png";
import "./App.css";

import LocationPickerMap from "./components/LocationPickerMap";
import LiveBookingTracker from "./components/LiveBookingTracker";
import WorkerPartnerDashboard from "./components/WorkerPartnerDashboard";
import BookingHistoryModal from "./components/BookingHistoryModal";
import { CITIES, MOCK_WORKERS } from "./data/mockWorkers";

function App() {
  const [page, setPage] = useState("home"); // "home" | "login" | "register" | "workers" | "partner"
  const [userType, setUserType] = useState("customer");
  const [lang, setLang] = useState("hinglish"); // "hinglish" | "hi" | "en"

  const [selectedService, setSelectedService] = useState("");
  const [serviceSearchQuery, setServiceSearchQuery] = useState("");
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);

  const [location, setLocation] = useState("Jhansi");
  const [userCoords, setUserCoords] = useState([25.4484, 78.5685]); // Jhansi coords default
  const [addressText, setAddressText] = useState("Elite Chouraha, Jhansi, UP");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const [selectedWorker, setSelectedWorker] = useState(null);
  const [radiusKm, setRadiusKm] = useState(5);

  const [bookingMessage, setBookingMessage] = useState("");
  const [searchMessage, setSearchMessage] = useState("");
  const [activeNav, setActiveNav] = useState("home");

  const [activeBooking, setActiveBooking] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showMapView, setShowMapView] = useState(true);

  const serviceDropdownRef = useRef(null);
  const locationDropdownRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (serviceDropdownRef.current && !serviceDropdownRef.current.contains(e.target)) {
        setShowServiceDropdown(false);
      }
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) {
        setShowLocationDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= SERVICES ================= */

  const services = [
    {
      icon: "⚡",
      name: "Electrician",
      description: "Wiring, switchboard, fan repair & light fitting",
      basePrice: 199,
    },
    {
      icon: "🔧",
      name: "Plumber",
      description: "Pipe leakage, tap, tank repair & bathroom fittings",
      basePrice: 249,
    },
    {
      icon: "🪚",
      name: "Carpenter",
      description: "Door locks, furniture repair, cabinets & woodwork",
      basePrice: 299,
    },
    {
      icon: "🎨",
      name: "Painter",
      description: "Wall touch-up, full house painting & waterproofing",
      basePrice: 399,
    },
    {
      icon: "❄️",
      name: "AC & Appliance",
      description: "AC service, fridge & washing machine repair",
      basePrice: 349,
    },
    {
      icon: "🧹",
      name: "Cleaning",
      description: "Deep home cleaning, sofa, carpet & bathroom cleaning",
      basePrice: 299,
    },
    {
      icon: "🧱",
      name: "Mason",
      description: "Tile fitting, wall plaster, cement work & renovation",
      basePrice: 449,
    },
    {
      icon: "🛵",
      name: "Mechanic",
      description: "Bike/Car breakdown, puncture repair & oil change",
      basePrice: 199,
    },
  ];

  /* ================= WORKERS DATA ================= */

  const workers = {
    Electrician: [
      { name: "Ajit Yadav", experience: "10 Years", rating: "4.9", location: "gorakhpur", phone: "+91 98381 23456", baseRate: 199, vehicle: "Hero Splendor 🛵", lat: 26.7620, lng: 83.3750, photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80" },
      { name: "Amit Verma", experience: "4 Years", rating: "4.7", location: "kushinagar", phone: "+91 94500 87654", baseRate: 199, vehicle: "Honda Activa 🛵", lat: 26.7400, lng: 83.8900, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Suresh Yadav", experience: "7 Years", rating: "4.9", location: "gonda", phone: "+91 91255 43210", baseRate: 249, vehicle: "TVS XL100 🛵", lat: 27.1300, lng: 81.9600, photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
      { name: "Rohit Sharma", experience: "6 Years", rating: "4.8", location: "Lucknow", phone: "+91 94150 99887", baseRate: 199, vehicle: "Honda Shine 🛵", lat: 26.8480, lng: 80.9450, photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80" },
      { name: "Vivek Kumar", experience: "5 Years", rating: "4.7", location: "gorakhpur", phone: "+91 93050 44332", baseRate: 199, vehicle: "Yamaha FZ 🏍️", lat: 26.7550, lng: 83.3650, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
    ],

    Plumber: [
      { name: "Rakesh Kumar", experience: "6 Years", rating: "4.8", location: "gorakhpur", phone: "+91 98381 23456", baseRate: 249, vehicle: "Hero Splendor 🛵", lat: 26.7650, lng: 83.3800, photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80" },
      { name: "Vikas Sharma", experience: "3 Years", rating: "4.6", location: "maharajganj", phone: "+91 94500 87654", baseRate: 249, vehicle: "Honda Activa 🛵", lat: 27.1400, lng: 83.5600, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
      { name: "Sanjay Gupta", experience: "7 Years", rating: "4.8", location: "lucknow", phone: "+91 98890 55443", baseRate: 249, vehicle: "Suzuki Access 🛵", lat: 26.8520, lng: 80.9980, photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    ],

    Carpenter: [
      { name: "Mohan Singh", experience: "8 Years", rating: "4.9", location: "gorakhpur", phone: "+91 97920 11223", baseRate: 299, vehicle: "Bajaj Pulsar 🛵", lat: 26.7580, lng: 83.3710, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80" },
      { name: "Deepak Kumar", experience: "5 Years", rating: "4.7", location: "Lucknow", phone: "+91 94500 87654", baseRate: 299, vehicle: "Honda Activa 🛵", lat: 26.8420, lng: 80.9320, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    ],

    Painter: [
      { name: "Arun Kumar", experience: "6 Years", rating: "4.8", location: "gorakhpur", phone: "+91 98381 23456", baseRate: 399, vehicle: "Hero Splendor 🛵", lat: 26.7630, lng: 83.3760, photo: "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80" },
      { name: "Aakash Verma", experience: "5 Years", rating: "4.8", location: "Lucknow", phone: "+91 97210 66778", baseRate: 399, vehicle: "Royal Enfield 🏍️", lat: 26.8120, lng: 80.9020, photo: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80" },
    ],

    "AC & Appliance": [
      { name: "Rahul Gupta", experience: "7 Years", rating: "4.9", location: "gorakhpur", phone: "+91 93361 77889", baseRate: 349, vehicle: "TVS Jupiter 🛵", lat: 26.7640, lng: 83.3770, photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80" },
      { name: "Karan Singh", experience: "6 Years", rating: "4.8", location: "Lucknow", phone: "+91 93050 44332", baseRate: 349, vehicle: "Yamaha FZ 🏍️", lat: 26.8790, lng: 80.9910, photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80" },
    ],

    Cleaning: [
      { name: "Pooja Kushwaha", experience: "4 Years", rating: "4.8", location: "gorakhpur", phone: "+91 95599 33441", baseRate: 299, vehicle: "Scooty Pep 🛵", lat: 26.7590, lng: 83.3690, photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" },
    ],
    Mason: [
      { name: "Ram Kumar Mistri", experience: "12 Years", rating: "4.9", location: "Lucknow", phone: "+91 97180 33445", baseRate: 499, vehicle: "Hero Passion 🛵", lat: 26.8450, lng: 80.9400, photo: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80" }
    ],
    Mechanic: [
      { name: "Deepak Saini", experience: "6 Years", rating: "4.8", location: "gorakhpur", phone: "+91 91400 99881", baseRate: 199, vehicle: "Mobile Kit Van 🚙", lat: 26.7610, lng: 83.3720, photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=150&auto=format&fit=crop&q=80" }
    ]
  };

  /* ================= ALL WORKERS AGGREGATOR ================= */

  const getAllWorkers = () => {
    const list = [...MOCK_WORKERS];
    Object.keys(workers).forEach((srv) => {
      workers[srv].forEach((w, idx) => {
        if (!list.some((existing) => existing.name.toLowerCase() === w.name.toLowerCase())) {
          list.push({
            id: `w-local-${srv}-${idx}`,
            name: w.name,
            phone: w.phone,
            photo: w.photo,
            rating: parseFloat(w.rating) || 4.8,
            reviewCount: 110,
            experience: w.experience,
            city: w.location,
            address: `${w.location.charAt(0).toUpperCase() + w.location.slice(1)}, UP`,
            lat: w.lat,
            lng: w.lng,
            service: srv,
            baseRate: w.baseRate || 199,
            hourlyRate: 250,
            verified: true,
            vehicle: w.vehicle || "Hero Splendor 🛵",
            skills: ["General Repair", "Inspection & Fix"],
            isOnline: true,
          });
        }
      });
    });
    return list;
  };

  /* ================= GPS AUTO-DETECT ================= */

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setSearchMessage("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    setSearchMessage("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserCoords([latitude, longitude]);
        setIsLocating(false);

        // Find closest known city
        let closestCity = CITIES[0];
        let minDist = Infinity;
        CITIES.forEach((city) => {
          const dist = Math.hypot(city.lat - latitude, city.lng - longitude);
          if (dist < minDist) {
            minDist = dist;
            closestCity = city;
          }
        });

        setLocation(closestCity.name);
        setAddressText(`${closestCity.name}, ${closestCity.state} (Live GPS)`);
        setShowLocationDropdown(false);
      },
      (err) => {
        setIsLocating(false);
        setSearchMessage("Could not retrieve GPS location. Please pick a city.");
      },
      { timeout: 7000 }
    );
  };

  /* ================= NAVIGATION ================= */

  const goHome = (section = "home") => {
    setPage("home");
    setActiveNav(section);

    setTimeout(() => {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  /* ================= SERVICE SELECTION ================= */

  const handleSelectService = (serviceName) => {
    setSelectedService(serviceName);
    setServiceSearchQuery(serviceName);
    setShowServiceDropdown(false);
    setSelectedWorker(null);
    setBookingMessage("");
    setSearchMessage("");
    setActiveNav("home");

    setTimeout(() => {
      const searchBox = document.getElementById("search-box-root");
      if (searchBox) {
        searchBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 50);
  };

  /* ================= FIND SERVICE ================= */

  const handleFindService = () => {
    const enteredLocation = location.trim();

    if (!selectedService) {
      setSearchMessage("⚠️ Please select a service first (e.g. Electrician, Plumber).");
      setShowServiceDropdown(true);
      return;
    }

    if (!enteredLocation) {
      setSearchMessage("⚠️ Please enter or select your location.");
      setShowLocationDropdown(true);
      return;
    }

    // Geocode or match city coordinates if known
    const foundCity = CITIES.find((c) => c.name.toLowerCase() === enteredLocation.toLowerCase());
    if (foundCity) {
      setUserCoords([foundCity.lat, foundCity.lng]);
      setAddressText(`${foundCity.name}, ${foundCity.state}`);
    } else {
      setAddressText(enteredLocation);
    }

    setSelectedWorker(null);
    setBookingMessage("");
    setSearchMessage("");
    setShowServiceDropdown(false);
    setShowLocationDropdown(false);
    setPage("workers");
  };

  /* ================= BOOK SERVICE (UBER/RAPIDO STYLE INSTANT TRACKER) ================= */

  const handleBookService = (workerToBook) => {
    const target = workerToBook || selectedWorker;
    if (!target) return;

    const newBooking = {
      id: "bk-" + Date.now(),
      worker: {
        ...target,
        id: target.id || "w-" + Math.random(),
        service: selectedService || target.service || "Electrician",
        verified: true,
        reviewCount: 120,
        etaMins: 8,
        distanceKm: 1.5,
      },
      service: selectedService || target.service || "Electrician",
      userCoords,
      addressText: location || addressText,
      status: "SEARCHING",
    };

    setActiveBooking(newBooking);
  };

  const handleCompleteBooking = () => {
    if (activeBooking) {
      setBookingHistory((prev) => [
        {
          id: activeBooking.id,
          worker: activeBooking.worker,
          service: activeBooking.service,
          addressText: activeBooking.addressText,
          date: new Date().toLocaleDateString("en-IN"),
        },
        ...prev,
      ]);
    }
    setActiveBooking(null);
    setSelectedWorker(null);
  };

  /* ================= LOGIN PAGE ================= */

  if (page === "login") {
    return (
      <div className="auth-page">
        <div className="auth-card">
          <div className="auth-logo">
            <img src={logo} alt="KAAM CONNECT+" />
          </div>

          <h1>Welcome Back!</h1>
          <p className="auth-subtitle">Login to continue to KAAM CONNECT+</p>

          <div className="user-type">
            <button className={userType === "customer" ? "active" : ""} onClick={() => setUserType("customer")}>
              Customer
            </button>
            <button className={userType === "worker" ? "active" : ""} onClick={() => setUserType("worker")}>
              Service Professional
            </button>
          </div>

          <input className="auth-input" type="email" placeholder="Email Address" />
          <input className="auth-input" type="password" placeholder="Password" />

          <button className="auth-main-btn" onClick={() => goHome("home")}>
            Login
          </button>

          <p className="auth-switch">
            Don't have an account?{" "}
            <button onClick={() => setPage("register")}>Create Account</button>
          </p>

          <button className="back-home" onClick={() => goHome("home")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* ================= REGISTER PAGE ================= */

  if (page === "register") {
    return (
      <div className="auth-page">
        <div className="register-card">
          <div className="auth-logo">
            <img src={logo} alt="KAAM CONNECT+" />
          </div>

          <h1>Create Account</h1>
          <p className="auth-subtitle">Join KAAM CONNECT+</p>

          <div className="user-type">
            <button className={userType === "customer" ? "active" : ""} onClick={() => setUserType("customer")}>
              Customer
            </button>
            <button className={userType === "worker" ? "active" : ""} onClick={() => setUserType("worker")}>
              Service Professional
            </button>
          </div>

          <input className="auth-input" type="text" placeholder="Full Name" />
          <input className="auth-input" type="tel" placeholder="Mobile Number" />
          <input className="auth-input" type="email" placeholder="Email Address" />
          <input className="auth-input" type="password" placeholder="Create Password" />

          {userType === "worker" && (
            <>
              <select className="auth-input">
                <option value="">Select Your Service</option>
                {services.map((service) => (
                  <option key={service.name} value={service.name}>
                    {service.name}
                  </option>
                ))}
              </select>
              <input className="auth-input" type="number" placeholder="Years of Experience" />
            </>
          )}

          <input className="auth-input" type="text" placeholder="Your Location" />

          <button className="auth-main-btn" onClick={() => goHome("home")}>
            Create Account
          </button>

          <p className="auth-switch">
            Already have an account?{" "}
            <button onClick={() => setPage("login")}>Login</button>
          </p>

          <button className="back-home" onClick={() => goHome("home")}>
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  /* ================= WORKER PARTNER MODE PAGE ================= */

  if (page === "partner") {
    return (
      <div className="app">
        {/* ORIGINAL NAVBAR */}
        <nav className="navbar">
          <div className="brand-logo" style={{ cursor: "pointer" }} onClick={() => goHome("home")}>
            <img src={logo} alt="KAAM CONNECT+" />
            <h2>Kaam Connect+</h2>
          </div>

          <div className="nav-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); goHome("home"); }}>Customer Home</a>
            <a href="#partner" className="active-link">Kaamdar Partner</a>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button className="login-btn" onClick={() => setPage("home")}>
              🧑‍💼 Customer Mode
            </button>
          </div>
        </nav>

        <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "0 20px" }}>
          <WorkerPartnerDashboard lang={lang} currentCity={CITIES.find(c => c.name.toLowerCase() === location.toLowerCase()) || CITIES[0]} />
        </div>
      </div>
    );
  }

  /* ================= WORKERS PAGE (MAP & WORKERS LIST) ================= */

  if (page === "workers") {
    const allWorkersList = getAllWorkers();
    const serviceWorkers = allWorkersList.filter(
      (w) => !selectedService || w.service.toLowerCase() === selectedService.toLowerCase()
    );

    const normLoc = location.trim().toLowerCase();
    const exactCityWorkers = serviceWorkers.filter(
      (w) =>
        (w.city && (w.city.toLowerCase().includes(normLoc) || normLoc.includes(w.city.toLowerCase()))) ||
        (w.address && w.address.toLowerCase().includes(normLoc))
    );

    const availableWorkers = exactCityWorkers.length > 0 ? exactCityWorkers : serviceWorkers;
    const isShowingNearby = exactCityWorkers.length === 0 && serviceWorkers.length > 0;

    // Adapt workers for LocationPickerMap
    const mapWorkersList = availableWorkers.map((w, idx) => ({
      id: w.id || "w-map-" + idx,
      name: w.name,
      phone: w.phone || "+91 98381 23456",
      photo: w.photo || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80",
      rating: parseFloat(w.rating) || 4.8,
      reviewCount: w.reviewCount || 110,
      experience: w.experience,
      city: w.city || w.location,
      address: w.address || `${w.city || w.location} Area`,
      lat: w.lat || userCoords[0] + (idx * 0.005 - 0.005),
      lng: w.lng || userCoords[1] + (idx * 0.005 - 0.005),
      service: w.service || selectedService,
      baseRate: w.baseRate || 199,
      hourlyRate: w.hourlyRate || 250,
      verified: true,
      vehicle: w.vehicle || "Hero Splendor 🛵",
      skills: w.skills || ["General Service", "Repair & Fitting"],
    }));

    return (
      <div className="app">
        {/* ORIGINAL NAVBAR */}
        <nav className="navbar">
          <div className="brand-logo" style={{ cursor: "pointer" }} onClick={() => goHome("home")}>
            <img src={logo} alt="KAAM CONNECT+" />
            <h2>Kaam Connect+</h2>
          </div>

          <div className="nav-links">
            <a href="#home" onClick={(e) => { e.preventDefault(); goHome("home"); }}>Home</a>
            <a href="#services" onClick={(e) => { e.preventDefault(); goHome("services"); }}>Services</a>
            <a href="#how-it-works" onClick={(e) => { e.preventDefault(); goHome("how-it-works"); }}>How It Works</a>
            <a href="#about" onClick={(e) => { e.preventDefault(); goHome("about"); }}>About</a>
          </div>

          <button className="login-btn" onClick={() => setPage("login")}>
            <span>♙</span> Login
          </button>
        </nav>

        {/* WORKERS VIEW */}
        <section className="workers-page">
          <div className="workers-header">
            <p className="small-title">AVAILABLE PROFESSIONALS</p>
            <h1>{selectedService || "All"} Workers</h1>
            <p>
              Showing verified professionals near <strong>{location || "your location"}</strong>
            </p>

            {/* QUICK RESPONSIVE FILTER BAR */}
            <div className="workers-filter-bar">
              <div className="workers-filter-group">
                <span className="filter-label">Service:</span>
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="workers-filter-select"
                >
                  {services.map((srv) => (
                    <option key={srv.name} value={srv.name}>
                      {srv.icon} {srv.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="workers-filter-group">
                <span className="filter-label">City:</span>
                <select
                  value={CITIES.some((c) => c.name.toLowerCase() === location.toLowerCase()) ? location : "custom"}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val !== "custom") {
                      const found = CITIES.find((c) => c.name.toLowerCase() === val.toLowerCase());
                      if (found) {
                        setLocation(found.name);
                        setUserCoords([found.lat, found.lng]);
                        setAddressText(`${found.name}, ${found.state}`);
                      }
                    }
                  }}
                  className="workers-filter-select"
                >
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      📍 {c.name}
                    </option>
                  ))}
                  {!CITIES.some((c) => c.name.toLowerCase() === location.toLowerCase()) && (
                    <option value="custom">📍 {location}</option>
                  )}
                </select>
              </div>

              <button
                type="button"
                className="workers-gps-btn"
                onClick={handleDetectGPS}
                title="Detect GPS"
              >
                {isLocating ? "..." : "🎯 Use GPS"}
              </button>
            </div>

            {/* NEARBY NOTICE IF EXACT LOCALITY WAS FALLEN BACK */}
            {isShowingNearby && (
              <div className="nearby-notice-box">
                📍 Showing top verified <strong>{selectedService}</strong> professionals available nearby for on-demand dispatch to <em>"{location}"</em>.
              </div>
            )}

            <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "16px", flexWrap: "wrap" }}>
              <button
                style={{
                  background: showMapView ? "#155eef" : "#f1f5f9",
                  color: showMapView ? "#fff" : "#334155",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                onClick={() => setShowMapView(true)}
              >
                📍 Live Map View (Rapido/Uber style)
              </button>
              <button
                style={{
                  background: !showMapView ? "#155eef" : "#f1f5f9",
                  color: !showMapView ? "#fff" : "#334155",
                  border: "none",
                  padding: "10px 18px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                onClick={() => setShowMapView(false)}
              >
                📋 List View ({availableWorkers.length})
              </button>
            </div>
          </div>

          {/* INTERACTIVE MAP VIEW */}
          {showMapView && (
            <div style={{ maxWidth: "1000px", margin: "0 auto 30px auto", padding: "0 10px" }}>
              <LocationPickerMap
                userCoords={userCoords}
                setUserCoords={setUserCoords}
                addressText={addressText}
                setAddressText={(val) => {
                  setAddressText(val);
                  setLocation(val.split(",")[0]);
                }}
                workers={mapWorkersList}
                selectedWorker={selectedWorker}
                onSelectWorker={(w) => setSelectedWorker(w)}
                radiusKm={radiusKm}
                setRadiusKm={setRadiusKm}
                selectedService={selectedService}
                lang={lang}
              />
            </div>
          )}

          {/* WORKERS GRID VIEW */}
          {availableWorkers.length > 0 ? (
            <div className="workers-grid">
              {availableWorkers.map((worker) => (
                <div
                  className={`worker-card ${selectedWorker?.name === worker.name ? "selected-card" : ""}`}
                  key={worker.id || worker.name}
                  onClick={() => setSelectedWorker(worker)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="worker-card-header-flex">
                    <img
                      src={worker.photo || "https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150&auto=format&fit=crop&q=80"}
                      alt={worker.name}
                      className="worker-card-avatar-img"
                    />
                    <div>
                      <h2>{worker.name}</h2>
                      <span className="worker-verified-pill">✓ Verified Pro</span>
                    </div>
                  </div>

                  <p className="worker-service">{worker.service || selectedService}</p>

                  <div className="worker-info">
                    <p>Experience: <strong>{worker.experience}</strong></p>
                    <p>Rating: <strong>⭐ {worker.rating}</strong> ({worker.reviewCount || 95} reviews)</p>
                    <p>City: <strong>📍 {worker.city || worker.location}</strong></p>
                    {worker.vehicle && (
                      <p>Vehicle: <strong>{worker.vehicle}</strong></p>
                    )}
                    <p>Visiting Charge: <strong style={{ color: "#059669" }}>₹{worker.baseRate}</strong></p>
                  </div>

                  <button
                    className="book-service-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedWorker(worker);
                      handleBookService(worker);
                    }}
                  >
                    Instant Book Service ⚡
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-workers">
              No {selectedService} workers found in "{location}". Try changing location or viewing map above.
            </p>
          )}

          {selectedWorker && !activeBooking && (
            <div className="selected-worker-box" style={{ marginTop: "20px" }}>
              <h3>Selected Worker: {selectedWorker.name}</h3>
              <p>Rating: ⭐ {selectedWorker.rating} • Experience: {selectedWorker.experience}</p>
              <button className="book-service-btn" onClick={() => handleBookService(selectedWorker)}>
                Request Worker Now (Uber/Rapido style) ⚡
              </button>
            </div>
          )}

          <button
            className="back-home workers-back"
            onClick={() => {
              setSelectedWorker(null);
              setPage("home");
              setActiveNav("home");
            }}
          >
            ← Back to Home
          </button>
        </section>

        {/* LIVE TRACKER OVERLAY */}
        {activeBooking && (
          <LiveBookingTracker
            booking={activeBooking}
            onCancelBooking={() => setActiveBooking(null)}
            onCompleteBooking={handleCompleteBooking}
            lang={lang}
          />
        )}
      </div>
    );
  }

  /* ================= HOME PAGE (ORIGINAL LOOK & FEEL) ================= */

  const filteredServices = services.filter((s) => {
    const q = serviceSearchQuery.toLowerCase();
    return s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });

  const filteredCities = CITIES.filter((c) => {
    const q = location.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q);
  });

  return (
    <div className="app">
      {/* ORIGINAL NAVBAR WITH ORIGINAL LOGO */}

      <nav className="navbar">
        <div className="brand-logo" style={{ cursor: "pointer" }} onClick={() => goHome("home")}>
          <img src={logo} alt="KAAM CONNECT+" />
          <h2>Kaam Connect+</h2>
        </div>

        <div className="nav-links">
          <a
            href="#home"
            className={activeNav === "home" ? "active-link" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHome("home");
            }}
          >
            Home
          </a>

          <a
            href="#services"
            className={activeNav === "services" ? "active-link" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHome("services");
            }}
          >
            Services
          </a>

          <a
            href="#how-it-works"
            className={activeNav === "how-it-works" ? "active-link" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHome("how-it-works");
            }}
          >
            How It Works
          </a>

          <a
            href="#about"
            className={activeNav === "about" ? "active-link" : ""}
            onClick={(e) => {
              e.preventDefault();
              goHome("about");
            }}
          >
            About
          </a>
        </div>

        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <button
            className="login-btn"
            style={{ background: "#f59e0b", fontSize: "14px" }}
            onClick={() => setPage("partner")}
            title="Switch to Kaamdar Worker App"
          >
            🧰 Worker Partner Mode
          </button>

          <button className="login-btn" onClick={() => setPage("login")}>
            <span>♙</span> Login
          </button>
        </div>
      </nav>

      {/* ORIGINAL HERO SECTION */}

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="small-title">TRUSTED HOME SERVICES</p>

          <h1>
            Reliable Services,
            <br />
            <span>Right at Your Doorstep</span>
          </h1>

          <p className="hero-text">
            Find trusted professionals for your everyday home service needs like Uber & Rapido.
          </p>

          {/* SEARCH BOX CONTAINER */}
          <div className="search-box-container" id="search-box-root">
            <div className="search-box">
              {/* SERVICE SELECTOR INPUT & DROPDOWN */}
              <div className="search-input-wrapper service-wrapper" ref={serviceDropdownRef}>
                <span className="search-icon">⚡</span>
                <input
                  type="text"
                  placeholder="What service do you need?"
                  value={serviceSearchQuery !== "" ? serviceSearchQuery : selectedService}
                  onFocus={() => {
                    setShowServiceDropdown(true);
                    setShowLocationDropdown(false);
                  }}
                  onChange={(e) => {
                    setServiceSearchQuery(e.target.value);
                    setShowServiceDropdown(true);
                    setSearchMessage("");
                  }}
                />
                {(selectedService || serviceSearchQuery) && (
                  <button
                    type="button"
                    className="clear-input-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedService("");
                      setServiceSearchQuery("");
                    }}
                    title="Clear service"
                  >
                    ✕
                  </button>
                )}

                {/* SERVICE DROPDOWN */}
                {showServiceDropdown && (
                  <div className="search-dropdown-menu service-dropdown">
                    <div className="dropdown-title">Choose or Search a Service</div>
                    <div className="dropdown-items-list">
                      {filteredServices.length > 0 ? (
                        filteredServices.map((srv) => (
                          <div
                            key={srv.name}
                            className={`dropdown-item ${selectedService === srv.name ? "active" : ""}`}
                            onClick={() => {
                              setSelectedService(srv.name);
                              setServiceSearchQuery(srv.name);
                              setShowServiceDropdown(false);
                              setSearchMessage("");
                            }}
                          >
                            <span className="dropdown-item-icon">{srv.icon}</span>
                            <div className="dropdown-item-info">
                              <div className="dropdown-item-title-row">
                                <strong>{srv.name}</strong>
                                <span className="price-pill">From ₹{srv.basePrice}</span>
                              </div>
                              <span className="dropdown-item-desc">{srv.description}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-empty">No matching services found</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* LOCATION SELECTOR INPUT & DROPDOWN */}
              <div className="search-input-wrapper location-wrapper" ref={locationDropdownRef}>
                <span className="location-icon">📍</span>
                <input
                  type="text"
                  placeholder="Enter your location (e.g. Jhansi, Lucknow)"
                  value={location}
                  onFocus={() => {
                    setShowLocationDropdown(true);
                    setShowServiceDropdown(false);
                  }}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setShowLocationDropdown(true);
                    setSearchMessage("");
                  }}
                />
                {location && (
                  <button
                    type="button"
                    className="clear-input-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation("");
                    }}
                    title="Clear location"
                  >
                    ✕
                  </button>
                )}

                {/* GPS QUICK DETECT BUTTON */}
                <button
                  type="button"
                  className={`gps-locate-btn ${isLocating ? "locating" : ""}`}
                  onClick={handleDetectGPS}
                  title="Detect my live GPS location"
                >
                  {isLocating ? "..." : "🎯 GPS"}
                </button>

                {/* LOCATION DROPDOWN */}
                {showLocationDropdown && (
                  <div className="search-dropdown-menu location-dropdown">
                    <div
                      className="dropdown-item gps-option"
                      onClick={() => {
                        handleDetectGPS();
                      }}
                    >
                      <span className="dropdown-item-icon">🎯</span>
                      <div className="dropdown-item-info">
                        <strong>Use Current Location (GPS)</strong>
                        <span className="dropdown-item-desc">Auto-detect your precise locality</span>
                      </div>
                    </div>

                    <div className="dropdown-divider"></div>
                    <div className="dropdown-title">Popular Cities & Areas</div>

                    <div className="dropdown-items-list">
                      {filteredCities.length > 0 ? (
                        filteredCities.map((city) => (
                          <div
                            key={city.name}
                            className={`dropdown-item ${location.toLowerCase() === city.name.toLowerCase() ? "active" : ""}`}
                            onClick={() => {
                              setLocation(city.name);
                              setUserCoords([city.lat, city.lng]);
                              setAddressText(`${city.name}, ${city.state}`);
                              setShowLocationDropdown(false);
                              setSearchMessage("");
                            }}
                          >
                            <span className="dropdown-item-icon">📍</span>
                            <div className="dropdown-item-info">
                              <div className="dropdown-item-title-row">
                                <strong>{city.name}</strong>
                                <span className="state-pill">{city.state}</span>
                              </div>
                              <span className="dropdown-item-desc">Instant dispatch available</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="dropdown-empty">
                          Press "Find Service" to search in <em>"{location}"</em>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* FIND SERVICE BUTTON */}
              <button className="find-btn" onClick={handleFindService}>
                Find Service <span>⚡ →</span>
              </button>
            </div>

            {/* QUICK SERVICE PILLS */}
            <div className="quick-tags-container">
              <span className="quick-tags-label">Popular Services:</span>
              <div className="quick-tags-scroll">
                {services.map((srv) => (
                  <button
                    key={srv.name}
                    type="button"
                    className={`quick-tag-chip ${selectedService === srv.name ? "active" : ""}`}
                    onClick={() => {
                      setSelectedService(srv.name);
                      setServiceSearchQuery(srv.name);
                      setSearchMessage("");
                    }}
                  >
                    <span>{srv.icon}</span> {srv.name}
                  </button>
                ))}
              </div>
            </div>

            {/* QUICK CITY PILLS */}
            <div className="quick-tags-container city-tags">
              <span className="quick-tags-label">Popular Cities:</span>
              <div className="quick-tags-scroll">
                {CITIES.slice(0, 7).map((city) => (
                  <button
                    key={city.name}
                    type="button"
                    className={`quick-tag-chip city-chip ${location.toLowerCase() === city.name.toLowerCase() ? "active" : ""}`}
                    onClick={() => {
                      setLocation(city.name);
                      setUserCoords([city.lat, city.lng]);
                      setAddressText(`${city.name}, ${city.state}`);
                      setSearchMessage("");
                    }}
                  >
                    📍 {city.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {selectedService && (
            <p className="selected-service">
              Selected Service: <strong>{selectedService}</strong>
            </p>
          )}

          {searchMessage && <p className="search-message">{searchMessage}</p>}
        </div>
      </section>

      {/* ORIGINAL SERVICES SECTION */}

      <section className="services" id="services">
        <p className="small-title">OUR SERVICES</p>
        <h2>Popular Home Services</h2>
        <p className="section-text">Choose a service and connect with a professional.</p>

        <div className="service-grid">
          {services.map((service) => (
            <div
              className={`service-card ${selectedService === service.name ? "selected" : ""}`}
              key={service.name}
            >
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <button className="choose-btn" onClick={() => handleSelectService(service.name)}>
                Select Service
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ORIGINAL MATERIAL REQUEST SECTION */}

      <section className="material-section">
        <p className="small-title">OUR SPECIAL FEATURE</p>
        <h2>Worker Material Request</h2>
        <p className="material-description">
          Workers can request required materials directly through KAAM CONNECT+ while working at a customer's location.
        </p>

        <div className="material-flow">
          <span>Worker</span>
          <b>→</b>
          <span>Material Request</span>
          <b>→</b>
          <span>Partner Shop</span>
          <b>→</b>
          <span>Delivery</span>
        </div>
      </section>

      {/* ORIGINAL HOW IT WORKS SECTION */}

      <section className="how-section" id="how-it-works">
        <p className="small-title">SIMPLE PROCESS</p>
        <h2>How It Works</h2>

        <div className="steps">
          <div className="step">
            <div className="number">1</div>
            <h3>Choose Service</h3>
            <p>Select the service you need.</p>
          </div>

          <div className="step">
            <div className="number">2</div>
            <h3>Find Worker</h3>
            <p>Find a suitable professional near your location.</p>
          </div>

          <div className="step">
            <div className="number">3</div>
            <h3>Book Service</h3>
            <p>Instant request or schedule worker.</p>
          </div>

          <div className="step">
            <div className="number">4</div>
            <h3>Get Service</h3>
            <p>Worker completes the job at your doorstep.</p>
          </div>
        </div>
      </section>

      {/* ORIGINAL FOOTER WITH ORIGINAL LOGO */}

      <footer id="about">
        <div className="footer-logo">
          <img src={logo} alt="KAAM CONNECT+" />
        </div>
        <p>Your Trusted Home Service Platform</p>
        <small>© 2026 KAAM CONNECT+. All Rights Reserved.</small>
      </footer>

      {/* LIVE TRACKER OVERLAY IF ANY BOOKING IS ACTIVE */}
      {activeBooking && (
        <LiveBookingTracker
          booking={activeBooking}
          onCancelBooking={() => setActiveBooking(null)}
          onCompleteBooking={handleCompleteBooking}
          lang={lang}
        />
      )}
    </div>
  );
}

export default App;