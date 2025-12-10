import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { carApi } from "../api/carApi";
import CarCard from "../components/CarCard";
import CarFilter from "../components/CarFilter";
// Assuming Features and HowItWorks components are correctly styled
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";

// Icon imports for a cleaner look
import { FaCar, FaMapMarkerAlt, FaUserCheck, FaFilter } from "react-icons/fa";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CustomerDashboard.css"; // Ensure this path is correct

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const carsPerPage = 12;

  const fetchCars = async () => {
    try {
      const res = await carApi.getAll();
      const availableCars = res.data.filter((car) => car.available);
      setCars(availableCars);
      setFilteredCars(availableCars);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      // Using the new message class for error/status display
      // A proper state management for general dashboard messages might be needed here
      // For now, keeping the alert
      alert("Failed to load cars. Please login again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, [user]);

  // --- Filter Logic (Unchanged) ---
  const handleFilter = (filters) => {
    let list = [...cars];

    if (filters.search)
      list = list.filter((car) =>
        car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.model.toLowerCase().includes(filters.search.toLowerCase()) ||
        car.location.toLowerCase().includes(filters.search.toLowerCase())
      );

    if (filters.make)
      list = list.filter((car) =>
        car.make.toLowerCase().includes(filters.make.toLowerCase())
      );

    if (filters.model)
      list = list.filter((car) =>
        car.model.toLowerCase().includes(filters.model.toLowerCase())
      );

    if (filters.yearMin)
      list = list.filter((car) => car.year >= Number(filters.yearMin));

    if (filters.yearMax)
      list = list.filter((car) => car.year <= Number(filters.yearMax));

    if (filters.seats.length)
      list = list.filter((car) => filters.seats.includes(car.seats));

    if (filters.priceMin)
      list = list.filter((car) => car.pricePerDay >= Number(filters.priceMin));

    if (filters.priceMax)
      list = list.filter((car) => car.pricePerDay <= Number(filters.priceMax));

    if (filters.transmission.length)
      list = list.filter((car) => filters.transmission.includes(car.transmission));

    if (filters.location.length)
      list = list.filter((car) => filters.location.includes(car.location));

    setFilteredCars(list);
    setPage(1); // Reset to first page
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1, // Changed to 1 for better feature visibility
    autoplay: true, // Added for dynamic view
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 992, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 600, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // Pagination
  const indexOfLast = page * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  return (
    <div className="customer-dashboard-page-wrapper">

      {/* Header/Hero Section - Updated with consistent class names */}
      <header className="hero-section car-details-header">
        <div className="hero-content">
          <h1>Find Your Next Adventure</h1>
          <p>Explore our curated selection of verified vehicles for your next journey. **Simple Booking. Great Rides.**</p>
          <div className="hero-stats car-info-data-grid">
            <div className="data-card stat-card">
              <h2 className="card-value">{cars.length}</h2>
              <p className="card-label"><FaCar /> Available Cars</p>
            </div>
            <div className="data-card stat-card">
              <h2 className="card-value">100+</h2>
              <p className="card-label"><FaMapMarkerAlt /> Locations Covered</p>
            </div>
            <div className="data-card stat-card">
              <h2 className="card-value">500+</h2>
              <p className="card-label"><FaUserCheck /> Happy Customers</p>
            </div>
          </div>
        </div>
      </header>

      <main className="customer-dashboard-main-content">

        {/* Filter Section */}
        <section className="detail-section filter-section">
          <h2 className="section-heading"><FaFilter className="icon-spacer" /> Refine Your Search</h2>
          <CarFilter onFilterChange={handleFilter} />
        </section>
        <hr className="section-divider" />

        {/* Featured Cars Carousel */}
        <section className="detail-section featured-cars-section">
          <h2 className="section-heading"><FaCar className="icon-spacer" /> Featured & Recommended Vehicles</h2>
          {loading ? (
            <p>Loading featured cars...</p>
          ) : (
            <div className="featured-carousel-wrapper">
              <Slider {...sliderSettings}>
                {/* Ensure CarCard renders correctly inside the slider */}
                {cars.slice(0, 8).map((car) => (
                  <div key={car._id} className="car-card-slide-item">
                    <CarCard car={car} onUpdate={() => { }} onDelete={() => { }} />
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </section>

        <hr className="section-divider" />

        {/* Available Cars with Pagination */}
        <section className="detail-section available-cars-section">
          <h2 className="section-heading"><FaCar className="icon-spacer" /> All Available Vehicles ({filteredCars.length})</h2>
          {loading ? (
            <p className="text-center">Loading all cars...</p>
          ) : currentCars.length === 0 ? (
            <p className="booking-status-message error text-center">No cars found matching your search criteria.</p>
          ) : (
            <div className="cars-grid">
              {currentCars.map((car) => (
                <CarCard key={car._id} car={car} onUpdate={() => { }} onDelete={() => { }} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => setPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        <hr className="section-divider" />

        {/* Features & HowItWorks - Wrapped in sections */}
        <section className="detail-section">
          <Features />
        </section>
        <section className="detail-section">
          <HowItWorks />
        </section>

      </main>
    </div>
  );
};

export default CustomerDashboard;