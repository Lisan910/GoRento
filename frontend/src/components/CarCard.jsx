import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { carApi } from "../api/carApi";
import { authApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import ReactDOM from "react-dom";
import {
  FaHeart,
  FaRegHeart,
  FaMapMarkerAlt,
  FaChair,
  FaTachometerAlt,
  FaCogs,
  FaDollarSign,
  FaTimes,
  FaEdit,
  FaTrashAlt
} from "react-icons/fa";
import "./CarCard.css";

/* Leaflet */
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Fix marker icon */
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});


// =========================
// Map Marker Component
// =========================
const LocationMarker = ({ position, setPosition }) => {
  useMapEvents({
    dragend(e) {
      const marker = e.target;
      const newPos = marker.getLatLng();
      setPosition([newPos.lat, newPos.lng]);
    }
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const newPos = e.target.getLatLng();
          setPosition([newPos.lat, newPos.lng]);
        }
      }}
    />
  );
};

// --------------------------------
// MAIN COMPONENT
// --------------------------------
const CarCard = ({ car, onUpdate, onDelete, onWishlistToggle }) => {
  const { user, setUser } = useAuth();
  const [currentImage, setCurrentImage] = useState(0);

  const [editing, setEditing] = useState(false);

  // Wishlist
  const [liked, setLiked] = useState(false);

  // FORM DATA — will load only when opening modal
  const [formData, setFormData] = useState(null);

  // Map position (lat, lng)
  const [mapPos, setMapPos] = useState([6.9271, 79.8612]); // default Colombo


  /* Load wishlist status */
  useEffect(() => {
    if (user?.favorites && Array.isArray(user.favorites)) {
      setLiked(user.favorites.includes(car._id));
    }
  }, [user, car._id]);

  const ownerId = typeof car.owner === "string" ? car.owner : car.owner?._id;
  const userId = user?._id || user?.id;
  const isOwner = userId === ownerId;


  // Open modal → Load fresh form data
  const openEditModal = () => {
    const locationArray = car.location?.split(",").map(x => parseFloat(x.trim()));

    setFormData({
      make: car.make,
      model: car.model,
      year: car.year,
      pricePerDay: car.pricePerDay,
      seats: car.seats,
      location: car.location,
      numOfKm: car.numOfKm,
      transmission: car.transmission,
      features: car.features || [],
      available: car.available
    });

    // Set map location from car data
    if (locationArray?.length === 2 && !isNaN(locationArray[0])) {
      setMapPos(locationArray);
    }

    setEditing(true);
  };


  // Wishlist toggle
  const handleToggleFavorite = async () => {
    if (!user) return alert("You must be logged in to add favorites.");

    try {
      const res = await authApi.toggleFavorite(car._id);

      const newLiked = !liked;
      setLiked(newLiked);

      setUser(prev => ({ ...prev, favorites: res.data.favorites || [] }));

      if (onWishlistToggle) {
        onWishlistToggle(car._id, newLiked);
      }
    } catch {
      alert("Could not update wishlist.");
    }
  };


  // Submit edited data
  const handleSubmit = async e => {
    e.preventDefault();

    const updatedPayload = {
      ...formData,
      location: `${mapPos[0]}, ${mapPos[1]}`,
    };

    try {
      const res = await carApi.update(car._id, updatedPayload);
      onUpdate(res.data);
      setEditing(false);
    } catch (err) {
      console.error(err);
      alert("Update failed.");
    }
  };


  const handleDelete = async () => {
    if (!window.confirm("Are you sure?")) return;

    try {
      await carApi.remove(car._id);
      onDelete(car._id);
    } catch {
      alert("Delete failed");
    }
  };


  const Modal = ({ children, onClose }) => {
    return ReactDOM.createPortal(
      <div className="modal-backdrop-professional" onClick={onClose}>
        <div className="modal-box-professional" onClick={e => e.stopPropagation()}>
          {children}
        </div>
      </div>,
      document.body
    );
  };


  const images = car.images?.length ? car.images : ["https://via.placeholder.com/400x250"];

  const getImageUrl = img =>
    img.startsWith("http") ? img : `http://localhost:5000${img}`;


  return (
    <div className="car-listing-card">

      {/* IMAGE SECTION */}
      <div className="car-visual-wrapper">
        <img
          src={getImageUrl(images[currentImage])}
          alt=""
          className="car-photo"
        />

        {images.length > 1 && (
          <>
            <button className="carousel-control prev"
              onClick={() =>
                setCurrentImage(prev => (prev === 0 ? images.length - 1 : prev - 1))
              }
            >‹</button>

            <button className="carousel-control next"
              onClick={() =>
                setCurrentImage(prev => (prev === images.length - 1 ? 0 : prev + 1))
              }
            >›</button>
          </>
        )}

        <span className="price-tag-professional">
          <span>Rs. </span> {car.pricePerDay}/day
        </span>

        {isOwner && (
          <span className={`availability-status ${car.available ? "is-available" : "is-rented"}`}>
            {car.available ? "🟢 AVAILABLE" : "🔴 RENTED"}
          </span>
        )}

        {!isOwner && user && (
          <button className="wishlist-btn" onClick={handleToggleFavorite}>
            {liked ? <FaHeart className="heart-icon liked" /> : <FaRegHeart className="heart-icon" />}
          </button>
        )}
      </div>

      {/* INFO */}
      <div className="car-details-panel">
        <h3 className="car-title-heading">
          {car.make} {car.model} <span className="car-year">{car.year}</span>
        </h3>

        <div className="car-spec-icons">
          {car.location && <span className="spec-badge"><FaMapMarkerAlt /> {car.location}</span>}
          {car.seats && <span className="spec-badge"><FaChair /> {car.seats} Seats</span>}
          {car.numOfKm && <span className="spec-badge"><FaTachometerAlt /> {car.numOfKm} km</span>}
          {car.transmission && <span className="spec-badge"><FaCogs /> {car.transmission}</span>}
        </div>

        <Link to={`/cars/${car._id}`} className="cta-view-details">
          View Details
        </Link>

        {isOwner && (
          <div className="owner-tools-bar">
            <button className="tool-edit-btn" onClick={openEditModal}>
              <FaEdit /> Edit
            </button>
            <button className="tool-delete-btn" onClick={handleDelete}>
              <FaTrashAlt /> Delete
            </button>
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && formData && (
        <Modal onClose={() => setEditing(false)}>
          <button className="modal-close-icon" onClick={() => setEditing(false)}>
            <FaTimes />
          </button>

          <h4 className="modal-title-professional">Edit Vehicle Details</h4>

          <form className="car-edit-form" onSubmit={handleSubmit}>
            <input name="make" value={formData.make}
              onChange={e => setFormData({ ...formData, make: e.target.value })}
              placeholder="Make" />

            <input name="model" value={formData.model}
              onChange={e => setFormData({ ...formData, model: e.target.value })}
              placeholder="Model" />

            <input name="year" type="number" value={formData.year}
              onChange={e => setFormData({ ...formData, year: e.target.value })}
              placeholder="Year" />

            <input name="pricePerDay" type="number" value={formData.pricePerDay}
              onChange={e => setFormData({ ...formData, pricePerDay: e.target.value })}
              placeholder="Price/day" />

            <input name="seats" type="number" value={formData.seats}
              onChange={e => setFormData({ ...formData, seats: e.target.value })}
              placeholder="Seats" />

            <input name="numOfKm" value={formData.numOfKm}
              onChange={e => setFormData({ ...formData, numOfKm: e.target.value })}
              placeholder="Number of KM" />

            <select name="transmission" value={formData.transmission}
              onChange={e => setFormData({ ...formData, transmission: e.target.value })}>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
            </select>

            <select name="available"
              value={formData.available}
              onChange={e => setFormData({ ...formData, available: e.target.value === "true" })}
            >
              <option value="true">Available</option>
              <option value="false">Rented</option>
            </select>

            <input
              name="features"
              value={formData.features.join(", ")}
              onChange={e =>
                setFormData({
                  ...formData,
                  features: e.target.value.split(",").map(f => f.trim())
                })}
              placeholder="Features (comma separated)"
            />

            {/* MAP FOR LOCATION PICKER */}
            <div style={{ height: "250px", marginTop: "15px", borderRadius: "8px", overflow: "hidden" }}>
              <MapContainer
                center={mapPos}
                zoom={13}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationMarker position={mapPos} setPosition={setMapPos} />
              </MapContainer>
            </div>

            <div className="form-action-buttons">
              <button type="submit" className="form-save-btn">Save Changes</button>
              <button type="button" className="form-cancel-btn" onClick={() => setEditing(false)}>
                Cancel
              </button>
            </div>

          </form>
        </Modal>
      )}
    </div>
  );
};

export default CarCard;
