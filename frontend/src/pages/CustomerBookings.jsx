import { useState, useEffect } from "react";
import { bookingApi } from "../api/bookingApi";
import {
  FaCar,
  FaCalendarAlt,
  FaDollarSign,
  FaTimes,
  FaCheckCircle,
  FaHourglassHalf,
  FaRoad,
  FaFlagCheckered,
} from "react-icons/fa";
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    try {
      await bookingApi.updateStatus(bookingId, "cancelled");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "cancelled" } : b
        )
      );
    } catch (err) {
      console.error("Error cancelling booking:", err);
      alert("Failed to cancel booking.");
    }
  };

  // ✅ Status icons (FULL)
  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <FaHourglassHalf />;
      case "confirmed":
        return <FaCheckCircle />;
      case "ongoing":
        return <FaRoad />;
      case "completed":
        return <FaFlagCheckered />;
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
          <p>Book a vehicle to get started.</p>
        </div>
      ) : (
        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b._id} className="booking-card">
              <div className="card-header">
                <h3>
                  <FaCar /> {b.car.make} {b.car.model} ({b.car.year})
                </h3>
                <span className={`status-badge status-${b.status}`}>
                  {getStatusIcon(b.status)} {b.status.toUpperCase()}
                </span>
              </div>

              <div className="booking-info-group">
                <div className="info-item">
                  <FaCalendarAlt />
                  <p>
                    {new Date(b.startDate).toLocaleDateString()} →{" "}
                    {new Date(b.endDate).toLocaleDateString()}
                  </p>
                </div>

                <div className="info-item">
                  <FaDollarSign />
                  <p>${b.totalPrice?.toFixed(2) || "N/A"}</p>
                </div>
              </div>

              <div className="card-actions">
                {b.status === "pending" && (
                  <>
                    <button onClick={() => handleCancel(b._id)} className="cancel-btn">
                      <FaTimes /> Cancel
                    </button>
                  </>
                )}

                {(b.status === "confirmed" ||
                  b.status === "ongoing" ||
                  b.status === "completed") && (
                  <button
                    className="download-btn"
                    onClick={() => generateInvoicePDF(b)}
                  >
                    💾 Download Invoice
                  </button>
                )}

                {b.status === "cancelled" && (
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
