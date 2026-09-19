import React from "react";
import { XCircle, CheckCircle, Clock, MapPin, Calendar, Star, RotateCcw } from "lucide-react";

export default function BookingHistoryModal({ bookings, onClose, onRebook, lang }) {
  return (
    <div className="history-modal-overlay">
      <div className="history-modal-content">
        <div className="history-modal-header">
          <h3>📜 {lang === "hi" ? "आपकी बुकिंग हिस्ट्री (Past Bookings)" : "Your Booking History"}</h3>
          <button className="close-modal-btn" onClick={onClose}>
            <XCircle size={22} />
          </button>
        </div>

        <div className="history-list">
          {bookings.length === 0 ? (
            <div className="empty-history text-center">
              <Clock size={40} className="text-gray-400 mx-auto mb-2" />
              <p>{lang === "hi" ? "अभी तक कोई बुकिंग नहीं की गई है।" : "No past bookings found."}</p>
            </div>
          ) : (
            bookings.map((item) => (
              <div key={item.id} className="history-card">
                <div className="history-card-top">
                  <div className="history-worker-info">
                    <img src={item.worker.photo} alt={item.worker.name} className="history-avatar" />
                    <div>
                      <h4>{item.worker.name}</h4>
                      <span className="history-service-badge">{item.worker.service}</span>
                    </div>
                  </div>
                  <div className="history-status-price">
                    <span className="history-price">₹{item.worker.baseRate + 44}</span>
                    <span className="history-status-tag">
                      <CheckCircle size={14} className="inline mr-1" /> Completed
                    </span>
                  </div>
                </div>

                <div className="history-details-row">
                  <span><Calendar size={14} /> {item.date}</span>
                  <span><MapPin size={14} /> {item.addressText?.substring(0, 30)}...</span>
                </div>

                <div className="history-card-bottom">
                  <span className="history-rating">⭐ Rated: 5.0</span>
                  <button className="rebook-btn" onClick={() => onRebook(item.worker)}>
                    <RotateCcw size={14} /> {lang === "hi" ? "फिर से बुक करें" : "Re-book Worker"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
