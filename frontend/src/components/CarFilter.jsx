import React, { useState } from "react";
import { 
  FaSearch, 
  FaFilter, 
  FaEraser, 
  FaCarSide, 
  FaShieldAlt, 
  FaClock,
  FaMapMarkerAlt,
  FaCogs,
  FaUserFriends
} from "react-icons/fa";
import "./CarFilter.css";

const CarFilter = ({ onFilterChange }) => {

  /* -------------------- STATE -------------------- */
  const [filters, setFilters] = useState({
    search: "",
    make: "",
    model: "",
    yearMin: "",
    yearMax: "",
    seats: "",
    priceMin: "",
    priceMax: "",
    transmission: "",
    location: ""
  });

  /* -------------------- OPTIONS -------------------- */
  const seatOptions = [2, 4, 5, 7, 8];
  const transmissionOptions = ["Automatic", "Manual"];
  const locationOptions = [
    "Colombo", "Kandy", "Galle", "Negombo", "Jaffna", 
    "Matara", "Kurunegala", "Gampaha", "Trincomalee"
  ];

  /* -------------------- HANDLERS -------------------- */
  const updateField = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApply = () => {
    // Convert single values to arrays if your parent component expects arrays
    // e.g., if parent needs seats: [4], we convert it here.
    const formattedFilters = {
        ...filters,
        seats: filters.seats ? [parseInt(filters.seats)] : [],
        transmission: filters.transmission ? [filters.transmission] : [],
        location: filters.location ? [filters.location] : []
    };
    onFilterChange(formattedFilters);
  };

  const handleReset = () => {
    const reset = {
      search: "", make: "", model: "",
      yearMin: "", yearMax: "", seats: "",
      priceMin: "", priceMax: "", transmission: "", location: ""
    };
    setFilters(reset);
    onFilterChange({ ...reset, seats: [], transmission: [], location: [] });
  };

  return (
    <div className="filter-marketing-wrapper">

      {/* --- LEFT COLUMN: BRANDING --- */}
      <div className="filter-branding-col">
        <div className="branding-content">
          <h3>Why GoRento?</h3>
          <p className="brand-tagline">
            Experience the ultimate freedom of travel with our premium fleet.
          </p>

          <ul className="brand-features">
            <li>
              <div className="icon-box"><FaCarSide /></div>
              <div className="text-box">
                <strong>Premium Fleet</strong>
                <span>Verified & serviced vehicles.</span>
              </div>
            </li>
            <li>
              <div className="icon-box"><FaShieldAlt /></div>
              <div className="text-box">
                <strong>Secure Booking</strong>
                <span>100% safe payment & data.</span>
              </div>
            </li>
            <li>
              <div className="icon-box"><FaClock /></div>
              <div className="text-box">
                <strong>24/7 Support</strong>
                <span>We are here when you need us.</span>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* --- RIGHT COLUMN: FILTER FORM --- */}
      <div className="filter-form-col">
        
        {/* Header */}
        <div className="filter-header">
          <h4><FaFilter /> Find Your Perfect Ride</h4>
          <button className="reset-btn" onClick={handleReset}>
            <FaEraser /> Reset
          </button>
        </div>

        {/* Search Bar (Full Width) */}
        <div className="form-row full-width">
          <div className="input-wrapper search-wrapper">
            <FaSearch className="field-icon" />
            <input 
              type="text" 
              placeholder="Search by keywords (e.g. Toyota Prius)" 
              value={filters.search}
              onChange={(e) => updateField("search", e.target.value)}
            />
          </div>
        </div>

        {/* Grid Layout for Inputs */}
        <div className="form-grid">
          
          {/* Make & Model */}
          <div className="input-wrapper">
            <label>Make</label>
            <input 
              type="text" 
              placeholder="e.g. Nissan" 
              value={filters.make}
              onChange={(e) => updateField("make", e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label>Model</label>
            <input 
              type="text" 
              placeholder="e.g. Sunny" 
              value={filters.model}
              onChange={(e) => updateField("model", e.target.value)}
            />
          </div>

          {/* Location Dropdown */}
          <div className="input-wrapper">
            <label><FaMapMarkerAlt /> Location</label>
            <select 
              value={filters.location} 
              onChange={(e) => updateField("location", e.target.value)}
            >
              <option value="">Any Location</option>
              {locationOptions.map(loc => <option key={loc} value={loc}>{loc}</option>)}
            </select>
          </div>

          {/* Transmission Dropdown */}
          <div className="input-wrapper">
            <label><FaCogs /> Transmission</label>
            <select 
              value={filters.transmission} 
              onChange={(e) => updateField("transmission", e.target.value)}
            >
              <option value="">Any Type</option>
              {transmissionOptions.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Seats Dropdown */}
          <div className="input-wrapper">
            <label><FaUserFriends /> Seats</label>
            <select 
              value={filters.seats} 
              onChange={(e) => updateField("seats", e.target.value)}
            >
              <option value="">Any Capacity</option>
              {seatOptions.map(s => <option key={s} value={s}>{s} Seats</option>)}
            </select>
          </div>

          {/* Empty div to balance grid if needed, or another field */}
          <div className="input-wrapper">
             {/* Spacer or additional field */}
          </div>

        </div>

        {/* Range Inputs (Year & Price) */}
        <div className="ranges-grid">
          
          <div className="range-group">
            <label>Year Range</label>
            <div className="dual-input">
              <input 
                type="number" 
                placeholder="Min" 
                value={filters.yearMin} 
                onChange={(e) => updateField("yearMin", e.target.value)}
              />
              <span className="separator">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={filters.yearMax} 
                onChange={(e) => updateField("yearMax", e.target.value)}
              />
            </div>
          </div>

          <div className="range-group">
            <label>Price Per Day (LKR)</label>
            <div className="dual-input">
              <input 
                type="number" 
                placeholder="Min" 
                value={filters.priceMin} 
                onChange={(e) => updateField("priceMin", e.target.value)}
              />
              <span className="separator">-</span>
              <input 
                type="number" 
                placeholder="Max" 
                value={filters.priceMax} 
                onChange={(e) => updateField("priceMax", e.target.value)}
              />
            </div>
          </div>

        </div>

        {/* Action Button */}
        <div className="form-actions">
          <button className="apply-btn" onClick={handleApply}>
            Search Available Cars
          </button>
        </div>

      </div>
    </div>
  );
};

export default CarFilter;