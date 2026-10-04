// Centralized store for worker reviews, job history and ratings persistence

const DEFAULT_REVIEWS = [
  {
    id: "rev-d1",
    customerName: "Sunita Gupta",
    rating: 5,
    date: "2 hours ago",
    service: "Electrician",
    comment: "Arrived in 8 mins! Fixed our power outage issue quickly. Very professional.",
    badge: "⚡ On-Time Arrival",
  },
  {
    id: "rev-d2",
    customerName: "Vikram Malhotra",
    rating: 5,
    date: "Today, morning",
    service: "Electrician",
    comment: "Best service partner! Came with complete toolkit and spare MCBs.",
    badge: "🧰 Expert Diagnosis",
  },
  {
    id: "rev-d3",
    customerName: "Dr. Ananya Sen",
    rating: 4.9,
    date: "Yesterday",
    service: "Electrician",
    comment: "Polite demeanor and wore shoe covers. High quality electrical wiring.",
    badge: "🧼 Neat & Clean",
  },
  {
    id: "rev-d4",
    customerName: "Rakesh Agarwal",
    rating: 5,
    date: "3 days ago",
    service: "Electrician",
    comment: "Fair rates, no bargaining required. App payment was seamless.",
    badge: "💰 Transparent Pricing",
  },
];

const DEFAULT_HISTORY = [
  {
    id: "jh-101",
    date: "Today, 11:20 AM",
    customerName: "Sharma Family",
    service: "Electrician",
    address: "Flat 304, Green Heights",
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
];

const getKey = (prefix, worker) => {
  if (!worker) return `${prefix}_default`;
  const id = worker.id || worker.name?.toLowerCase().replace(/\s+/g, "_") || "default";
  return `${prefix}_${id}`;
};

export const getWorkerReviews = (worker) => {
  try {
    // Check specific worker reviews first
    if (worker) {
      const specificKey = getKey("kc_reviews", worker);
      const specificData = localStorage.getItem(specificKey);
      if (specificData) {
        return JSON.parse(specificData);
      }
    }
    // Check global partner reviews
    const globalData = localStorage.getItem("kc_partner_reviews");
    if (globalData) {
      return JSON.parse(globalData);
    }
  } catch (e) {
    console.error("Error reading reviews from localStorage", e);
  }
  return DEFAULT_REVIEWS;
};

export const getWorkerHistory = (worker) => {
  try {
    if (worker) {
      const specificKey = getKey("kc_history", worker);
      const specificData = localStorage.getItem(specificKey);
      if (specificData) {
        return JSON.parse(specificData);
      }
    }
    const globalData = localStorage.getItem("kc_partner_history");
    if (globalData) {
      return JSON.parse(globalData);
    }
  } catch (e) {
    console.error("Error reading history from localStorage", e);
  }
  return DEFAULT_HISTORY;
};

export const saveWorkerFeedback = ({ worker, customerName, rating, comment, badges, fare, address, paymentMode }) => {
  try {
    const newReview = {
      id: "rev-" + Date.now(),
      customerName: customerName || "Customer",
      rating: parseFloat(rating) || 5,
      date: "Just now",
      service: worker?.service || "Home Service",
      comment: comment || "Great and polite service! Satisfied with the work.",
      badge: Array.isArray(badges) ? badges.join(" • ") : (badges || "Verified Customer"),
      workerId: worker?.id,
      workerName: worker?.name,
    };

    const newJob = {
      id: "jh-" + Date.now(),
      date: "Just now",
      customerName: customerName || "Customer",
      service: worker?.service || "Home Service",
      address: address || "Customer Address",
      fare: fare || (worker?.baseRate ? worker.baseRate + 44 : 299),
      paymentMode: paymentMode || "Online UPI",
      status: "Completed",
      rating: parseFloat(rating) || 5,
      review: comment || "Great work!",
      workerId: worker?.id,
      workerName: worker?.name,
    };

    // 1. Update worker-specific reviews
    if (worker) {
      const specificKey = getKey("kc_reviews", worker);
      const currentReviews = getWorkerReviews(worker);
      const updatedReviews = [newReview, ...currentReviews];
      localStorage.setItem(specificKey, JSON.stringify(updatedReviews));

      const histKey = getKey("kc_history", worker);
      const currentHist = getWorkerHistory(worker);
      const updatedHist = [newJob, ...currentHist];
      localStorage.setItem(histKey, JSON.stringify(updatedHist));
    }

    // 2. Also update global partner reviews & history
    const globalReviews = getWorkerReviews(null);
    localStorage.setItem("kc_partner_reviews", JSON.stringify([newReview, ...globalReviews]));

    const globalHistory = getWorkerHistory(null);
    localStorage.setItem("kc_partner_history", JSON.stringify([newJob, ...globalHistory]));

    // 3. Update stats (earnings & jobs count)
    const currentEarnings = parseInt(localStorage.getItem("kc_partner_earnings") || "1450", 10);
    const updatedEarnings = currentEarnings + (newJob.fare || 299);
    localStorage.setItem("kc_partner_earnings", String(updatedEarnings));

    const currentCount = parseInt(localStorage.getItem("kc_partner_jobs_count") || "4", 10);
    localStorage.setItem("kc_partner_jobs_count", String(currentCount + 1));

    // Store the last reviewed worker so dashboard can highlight it
    if (worker) {
      localStorage.setItem("kc_last_reviewed_worker", JSON.stringify(worker));
    }

    // 4. Dispatch update event for open tabs / components
    window.dispatchEvent(
      new CustomEvent("worker_feedback_updated", {
        detail: { newReview, newJob, worker },
      })
    );

    return { newReview, newJob };
  } catch (e) {
    console.error("Error saving worker feedback", e);
    return null;
  }
};
