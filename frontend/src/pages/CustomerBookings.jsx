// src/pages/CustomerBookings.jsx
import { useState, useEffect } from "react";
import { bookingApi } from "../api/bookingApi";
import { FaCar, FaCalendarAlt, FaDollarSign, FaTimes, FaCheckCircle, FaHourglassHalf } from "react-icons/fa"; // Added Check and Hourglass icons
import "./CustomerBookings.css";
import { generateInvoicePDF } from "../utils/generateInvoicePDF";

const CustomerBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getUserBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      // Removed alert for cleaner UX, rely on console error and empty state
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking? This action cannot be undone.")) return;

    try {
      await bookingApi.updateStatus(bookingId, "cancelled");
      setBookings((prev) =>
        prev.map((b) => (b._id === bookingId ? { ...b, status: "cancelled" } : b))
      );
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking. Try again later.");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Helper function to render status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <FaCheckCircle />;
      case "pending":
        return <FaHourglassHalf />;
      case "cancelled":
        return <FaTimes />;
      default:
        return null;
    }
  };

  return (
    <div className="customer-bookings-page">
      <h1 className="page-title">🚗 My Bookings</h1>
      <p className="page-subtitle">Track your vehicle rental reservations.</p>

      {loading ? (
        <div className="loading-state">
          <FaCar className="loading-icon" />
          <p>Loading your bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="empty-state">
          <h2>No Reservations Found</h2>
          <p>It looks like you haven't booked a vehicle yet. Start exploring our listings!</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <div className="card-header">
                <h3 className="car-details">
                  <FaCar className="icon-main" /> {b.car.make} {b.car.model} <span>({b.car.year})</span>
                </h3>
                {/* Status Badge */}
                <span className={`status-badge status-${b.status}`}>
                  {getStatusIcon(b.status)} {b.status.toUpperCase()}
                </span>
              </div>

              <div className="booking-info-group">
                <div className="info-item">
                  <FaCalendarAlt className="info-icon" />
                  <p className="info-label">Rental Period</p>
                  <p className="info-value">
                    {new Date(b.startDate).toLocaleDateString()} to{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="info-item">
                  <FaDollarSign className="info-icon" />
                  <p className="info-label">Total Cost</p>
                  <p className="info-value">
                    ${b.totalPrice ? b.totalPrice.toFixed(2) : "N/A"}
                  </p>
                </div>
              </div>

              <div className="card-actions">
                {b.status === "pending" ? (
                  <>
                    <button className="cancel-btn" onClick={() => handleCancel(b._id)}>
                      <FaTimes /> Cancel Booking
                    </button>

                    <button className="download-btn" onClick={() => generateInvoicePDF(b)}>
                      💾 Download Invoice
                    </button>
                  </>
                ) : b.status === "confirmed" ? (
                  <>
                    <button className="cancel-btn disabled" disabled>
                      Confirmed
                    </button>

                    <button className="download-btn" onClick={() => generateInvoicePDF(b)}>
                      💾 Download Invoice
                    </button>
                  </>
                ) : (
                  <button className="cancel-btn disabled" disabled>
                    Cancelled
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;