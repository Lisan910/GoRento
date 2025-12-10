import { useState } from "react";
import { carApi } from "../api/carApi";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./AddCarForm.css";

// Fix Leaflet default icon
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Select location by clicking map
const LocationMarker = ({ setLatLng }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLatLng(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
};

const AddCarForm = ({ onClose, onCarAdded }) => {
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    pricePerDay: "",
    location: "", // text name
    seats: 4,
    numOfKm: "",
    transmission: "",
    features: [],
  });

  const [images, setImages] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [latLng, setLatLng] = useState(null);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleImageChange = (e) => setImages([...e.target.files]);

  const handleAddFeature = () => {
    const f = featureInput.trim();
    if (f && !formData.features.includes(f)) {
      setFormData((prev) => ({ ...prev, features: [...prev.features, f] }));
    }
    setFeatureInput("");
  };

  const handleRemoveFeature = (feat) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feat),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latLng) {
      alert("Please click a location on the map.");
      return;
    }

    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key === "features") {
        value.forEach((f) => data.append("features", f));
      } else {
        data.append(key, value);
      }
    });

    data.append("lat", latLng.lat);
    data.append("lng", latLng.lng);

    images.forEach((file) => data.append("images", file));

    try {
      const res = await carApi.create(data);
      onCarAdded(res.data);
      onClose();
    } catch (err) {
      console.error("Create failed", err);
      alert("Failed to create car.");
    }
  };

  return (
    <div className="slide-panel">
      <div className="panel-header">
        <h2>Add New Car</h2>
        <button className="close-btn" onClick={onClose}>×</button>
      </div>

      <form onSubmit={handleSubmit} className="panel-form">
        <div className="form-grid">
          <input name="make" placeholder="Make" onChange={handleChange} required />
          <input name="model" placeholder="Model" onChange={handleChange} required />
          <input name="year" type="number" placeholder="Year" onChange={handleChange} />
          <input name="pricePerDay" type="number" placeholder="Price per day" onChange={handleChange} required />
          <input name="location" placeholder="Location name (optional)" onChange={handleChange} />
          <input name="seats" type="number" placeholder="Seats" onChange={handleChange} />
          <input name="numOfKm" placeholder="Number of KM" onChange={handleChange} />
          <select name="transmission" onChange={handleChange}>
            <option value="">Select Transmission</option>
            <option value="Automatic">Automatic</option>
            <option value="Manual">Manual</option>
          </select>
        </div>

        <div className="features-input">
          <label>Add Features</label>
          <div className="feature-row">
            <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)} placeholder="Enter feature"/>
            <button type="button" onClick={handleAddFeature}>Add</button>
          </div>
          <div className="feature-list">
            {formData.features.map((feat) => (
              <span key={feat} className="feature-chip">
                {feat} <button type="button" onClick={() => handleRemoveFeature(feat)}>×</button>
              </span>
            ))}
          </div>
        </div>

        <label>Select Location on Map</label>
        <MapContainer center={[6.9271, 79.8612]} zoom={13} style={{ height: "300px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
          <LocationMarker setLatLng={setLatLng} />
        </MapContainer>

        <label>Upload Images</label>
        <input type="file" multiple onChange={handleImageChange} />

        <button type="submit" className="submit-btn">Add Car</button>
      </form>
    </div>
  );
};

export default AddCarForm;
