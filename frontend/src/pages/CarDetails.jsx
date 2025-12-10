import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { carApi } from "../api/carApi";
import { bookingApi } from "../api/bookingApi";
import { authApi } from "../api/authApi";
import ReactDOM from "react-dom";
import { 
  FaTimes, FaMapMarkerAlt, FaCar, FaCogs, FaTachometerAlt, FaDollarSign, 
  FaShieldAlt, FaCalendarTimes, FaClipboardList, FaUserAlt 
} from "react-icons/fa";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./CarDetails.css";
import CarCard from "../components/CarCard";

// Leaflet marker fix
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Image modal
const ImageModal = ({ src, onClose }) =>
  ReactDOM.createPortal(
    <div className="image-modal-overlay" onClick={onClose}>
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="image-modal-close" onClick={onClose}><FaTimes /></button>
        <img src={src} alt="Full view" />
      </div>
    </div>,
    document.body
  );

export const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [owner, setOwner] = useState(null);
  const [policies, setPolicies] = useState({});
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [relatedCars, setRelatedCars] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await authApi.getMe();
        setUser(res.data);
      } catch {
        console.log("No user logged in");
      }
    };
    fetchUser();
  }, []);

  // Fetch car details
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data } = await carApi.get(id);
        setCar(data);

        if (data.owner && data.owner._id) {
          try {
            const res = await authApi.getUserById(data.owner._id);
            setOwner(res.data);
            setPolicies(res.data?.policies || {
              insurance: "Not specified.",
              cancellation: "Not specified.",
              additionalRules: "Not specified.",
            });
          } catch (err) {
            console.error("Failed to fetch owner policies:", err);
          }
        }
      } catch (err) {
        console.error("Failed to fetch car:", err);
        setMessage("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // Fetch related cars
  useEffect(() => {
    if (!car) return;
    const fetchRelated = async () => {
      try {
        const res = await carApi.getRelated(id);
        setRelatedCars(res.data);
      } catch (err) {
        console.error("Failed to fetch related cars:", err);
      }
    };
    fetchRelated();
  }, [car, id]);

  const handleBooking = async () => {
    if (!startDate || !endDate) return setMessage("Please select both start and end dates.");
    try {
      await bookingApi.create({ carId: id, startDate, endDate });
      setMessage("Booking successful!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed");
    }
  };

  const carLocation = car?.lat && car?.lng ? [car.lat, car.lng] : [6.9271, 79.8612];

  if (loading) return <p className="text-center mt-10">Loading car details...</p>;
  if (!car) return <p className="text-center mt-10">Car not found.</p>;

  return (
    <div className="car-details-page-wrapper">
      <header className="car-details-header">
        <h1>{car.make} {car.model} ({car.year})</h1>
        <p className="car-location"><FaMapMarkerAlt /> {car.location || "Location not specified"}</p>
      </header>

      <main className="car-details-main-content">
        {/* Left Column */}
        <div className="left-column">

          {/* Car Images */}
          <section className="detail-section image-gallery-section">
            <h2 className="section-heading">Vehicle Imagery</h2>
            {car.images?.length ? (
              <div className="car-image-gallery">
                {car.images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img.startsWith("http") ? img : `http://localhost:5000${img}`}
                    alt={`${car.make} ${car.model} view ${idx + 1}`}
                    onClick={() => setPreviewImage(img.startsWith("http") ? img : `http://localhost:5000${img}`)}
                  />
                ))}
              </div>
            ) : (
              <div className="no-image-placeholder">No images available.</div>
            )}
            {previewImage && <ImageModal src={previewImage} onClose={() => setPreviewImage(null)} />}
          </section>

          <hr className="section-divider" />

          {/* Map */}
          <section className="detail-section location-section">
            <h2 className="section-heading"><FaMapMarkerAlt className="icon-spacer" /> Vehicle Location</h2>
            <div className="map-container-wrapper">
              <MapContainer center={carLocation} zoom={13} style={{ height: "400px", borderRadius: "12px" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />
                <Marker position={carLocation}><Popup>{car.make} {car.model}</Popup></Marker>
              </MapContainer>
            </div>
          </section>

          <hr className="section-divider" />

          {/* Owner Policies */}
          <section className="detail-section policies-section">
            <h2 className="section-heading"><FaShieldAlt className="icon-spacer" /> Owner Policies & Terms</h2>
            <div className="policies-grid">
              <div className="policy-card">
                <h4><FaShieldAlt /> Insurance</h4>
                <p>{policies.insurance}</p>
              </div>
              <div className="policy-card">
                <h4><FaCalendarTimes /> Cancellation</h4>
                <p>{policies.cancellation}</p>
              </div>
              <div className="policy-card full-width">
                <h4><FaClipboardList /> Additional Rules</h4>
                <p>{policies.additionalRules}</p>
              </div>
            </div>
          </section>

          {/* Owner Details */}
          {owner && (
            <section className="detail-section owner-section">
              <h2 className="section-heading"><FaUserAlt className="icon-spacer" /> Vehicle Host Details</h2>
              <div className="owner-info-box">
                <p><strong>Name:</strong> {owner.name}</p>
                <p><strong>Email:</strong> {owner.email}</p>
                <p><strong>Phone:</strong> {owner.phone || "Not provided"}</p>
              </div>
            </section>
          )}

        </div>

        {/* Right Column */}
        <div className="right-column sticky-booking-details">
          {/* Car Information */}
          <section className="detail-section info-cards-section">
            <h2 className="section-heading">Vehicle Specification</h2>
            <div className="car-info-data-grid">
              <div className="data-card">
                <p className="card-value">{car.pricePerDay || "N/A"}</p>
                <p className="card-label"><span>Rs. </span> Price / Day</p>
              </div>
              <div className="data-card">
                <p className="card-value">{car.seats || "N/A"}</p>
                <p className="card-label"><FaCar /> Seating Capacity</p>
              </div>
              <div className="data-card">
                <p className="card-value">{car.transmission || "N/A"}</p>
                <p className="card-label"><FaCogs /> Transmission</p>
              </div>
              <div className="data-card">
                <p className="card-value">{car.numOfKm ? `${car.numOfKm} km` : "N/A"}</p>
                <p className="card-label"><FaTachometerAlt /> Mileage</p>
              </div>
            </div>
          </section>

          {/* Features */}
          {car.features?.length > 0 && (
            <section className="detail-section features-section">
              <h2 className="section-heading">Key Features</h2>
              <div className="features-list">
                {car.features.map((f, idx) => (
                  <span key={idx} className="feature-tag">{f}</span>
                ))}
              </div>
            </section>
          )}

          {/* Booking */}
          <section className="detail-section booking-module">
            <h2 className="section-heading">Reserve This Vehicle</h2>
            <div className="booking-form-modern">
              <div className="date-input-group">
                <label htmlFor="startDate">Start Date</label>
                <input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
              </div>
              <div className="date-input-group">
                <label htmlFor="endDate">End Date</label>
                <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
              </div>
              <button className="book-now-button" onClick={handleBooking}>Proceed to Booking</button>
              {message && <p className={`booking-status-message ${message.includes("successful") ? 'success' : 'error'}`}>{message}</p>}
            </div>
          </section>
        </div>
      </main>

      {/* Related Cars */}
      {relatedCars?.length > 0 && (
        <section className="detail-section related-cars-section">
          <h2 className="section-heading">Other Vehicles by This Host</h2>
          <div className="related-cars-grid">
            {relatedCars.map((rcar) => (
              <CarCard key={rcar._id} car={rcar} onClick={() => navigate(`/cars/${rcar._id}`)} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
