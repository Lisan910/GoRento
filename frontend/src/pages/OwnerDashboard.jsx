// src/pages/OwnerDashboard.jsx
import "./OwnerDashboard.css";
import AddCarForm from "../components/AddCarForm";
import PolicyForm from "../components/PolicyForm";
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { carApi } from "../api/carApi";
import { bookingApi } from "../api/bookingApi";
import CarCard from "../components/CarCard";
import { FaCar, FaShieldAlt, FaListAlt, FaCalendarCheck } from "react-icons/fa"; // Import new icons

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Bookings
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);

  // Policies side panel
  const [showPolicyPanel, setShowPolicyPanel] = useState(false);
  const [policies, setPolicies] = useState({
    insurance: "",
    cancellation: "",
    additionalRules: "",
  });

  // Fetch owner's cars
  const fetchCars = async () => {
    if (!user) return;
    try {
      const res = await carApi.getOwnerCars();
      setCars(res.data);
      applyFilter(res.data, filterType);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      // Using the detailed style for alerts
      // alert("Failed to load your cars. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = (allCars = cars, type = filterType) => {
    let result = allCars;
    if (type === "available") result = allCars.filter(c => c.available);
    else if (type === "rented") result = allCars.filter(c => !c.available);
    setFilteredCars(result);
  };

  // Fetch owner's bookings
  const fetchOwnerBookings = async () => {
    try {
      const res = await bookingApi.getOwnerBookings();
      setBookings(res.data);
    } catch (err) {
      console.error("Failed to fetch owner bookings:", err);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchCars();
    fetchOwnerBookings();
  }, [user]);

  useEffect(() => {
    applyFilter(cars, filterType);
  }, [filterType, cars]);

  const handleCarAdded = (newCar) => setCars(prev => [...prev, newCar]);
  const handleCarUpdated = (updatedCar) => setCars(prev => prev.map(c => c._id === updatedCar._id ? updatedCar : c));
  const handleCarDeleted = (deletedCarId) => setCars(prev => prev.filter(c => c._id !== deletedCarId));

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await bookingApi.updateStatus(bookingId, newStatus);
      setBookings(prev =>
        prev.map(b => b._id === bookingId ? { ...b, status: newStatus } : b)
      );
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update booking status.");
    }
  };

  return (
    <div className="owner-dashboard-wrapper">

      {/* Header Section */}
      <header className="owner-dashboard-header">
        <h1><FaCar className="header-icon" /> Vehicle Host Dashboard</h1>
        <div className="header-actions">
          <button className="dashboard-btn primary-btn" onClick={() => setShowForm(true)}><FaCar /> Add New Vehicle</button>
          <button className="dashboard-btn secondary-btn" onClick={() => setShowPolicyPanel(true)}><FaShieldAlt /> Set Host Policies</button>
        </div>
      </header>

      {/* Policies Side Panel */}
      {showPolicyPanel && (
        <PolicyForm
          userId={user?._id}
          onClose={() => setShowPolicyPanel(false)}
          onSaved={(updatedPolicies) => setPolicies(updatedPolicies)}
        />
      )}

      {/* Main Content: My Vehicles and Bookings */}
      <main className="dashboard-main-content">

        {/* My Vehicles Section */}
        <section className="detail-section my-vehicles-section">
          <h2 className="section-heading"><FaListAlt className="icon-spacer" /> My Active Listings</h2>

          {/* Filter Toggle */}
          <div className="filter-toggle-modern">
            <button onClick={() => setFilterType("all")} className={filterType === "all" ? "active" : ""}>All ({cars.length})</button>
            <button onClick={() => setFilterType("available")} className={filterType === "available" ? "active" : ""}>Available ({cars.filter(c => c.available).length})</button>
            <button onClick={() => setFilterType("rented")} className={filterType === "rented" ? "active" : ""}>Rented ({cars.filter(c => !c.available).length})</button>
          </div>

          {/* Add Car Form Modal/Panel (Assuming it's a modal or separate view) */}
          {showForm && <AddCarForm onClose={() => setShowForm(false)} onCarAdded={handleCarAdded} />}

          {/* Cars Grid */}
          {loading ? (
            <p className="loading-message">Loading vehicle listings...</p>
          ) : filteredCars.length === 0 ? (
            <div className="empty-state">No vehicles found in this category.</div>
          ) : (
            <div className="cars-grid-owner">
              {filteredCars.map(car => (
                <CarCard
                  key={car._id}
                  car={car}
                  onUpdate={handleCarUpdated}
                  onDelete={handleCarDeleted}
                  showOwnerButtons={true}
                />
              ))}
            </div>
          )}
        </section>

        <hr className="section-divider" />

        {/* Bookings Section */}
        <section className="detail-section owner-bookings-section">
          <h2 className="section-heading"><FaCalendarCheck className="icon-spacer" /> Customer Bookings</h2>

          {loadingBookings ? (
            <p className="loading-message">Loading customer bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="empty-state">No bookings have been made yet.</div>
          ) : (
            <div className="table-container">
              <table className="dashboard-table">
                <thead className="table-header">
                  <tr>
                    <th>Car</th>
                    <th>Customer</th>
                    <th>Email/Phone</th>
                    <th>Period</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(b => (
                    <tr key={b._id}>
                      <td>{b.car.make} {b.car.model}</td>
                      <td>{b.user?.name || "N/A"}</td>
                      <td>
                        <small>{b.user?.email || "Email N/A"}</small><br />
                        <small>{b.user?.phone || "Phone N/A"}</small>
                      </td>
                      <td>
                        {new Date(b.startDate).toLocaleDateString()} - {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="status-cell">
                        <select className={`status-select status-${b.status}`} value={b.status} onChange={(e) => handleStatusChange(b._id, e.target.value)}>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="ongoing">Ongoing</option>
                          <option value="completed">Completed</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

      </main>
    </div>
  );
};

export default OwnerDashboard;