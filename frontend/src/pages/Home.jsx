// src/pages/Home.jsx
import { useEffect, useState, useRef } from "react";
import { carApi } from "../api/carApi";
import CarCard from "../components/CarCard";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CarFilter from "../components/CarFilter";

// Icon imports
import { FaCar, FaMapMarkerAlt, FaUserCheck, FaFilter, FaCompass } from "react-icons/fa";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./Home.css";

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

// Import video
import heroVideo from "../assets/4281252-hd_1920_1080_24fps.mp4";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const carsPerPage = 12;

  const mainContentRef = useRef(null);

  // Fetch cars from API
  const fetchCars = async () => {
    try {
      const res = await carApi.getAll();
      const availableCars = res.data.filter((car) => car.available);
      setCars(availableCars);
      setFilteredCars(availableCars);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      alert("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );

    if (mainContentRef.current) {
      const animatedSections = mainContentRef.current.querySelectorAll(".animated-section");
      animatedSections.forEach((section) => observer.observe(section));
    }

    return () => observer.disconnect();
  }, [cars]);

  // Filter Logic
  const handleFilter = (filters) => {
    let list = [...cars];

    if (filters.search)
      list = list.filter(
        (car) =>
          car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.model.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.location.toLowerCase().includes(filters.search.toLowerCase())
      );

    if (filters.make) list = list.filter((car) => car.make.toLowerCase().includes(filters.make.toLowerCase()));
    if (filters.model) list = list.filter((car) => car.model.toLowerCase().includes(filters.model.toLowerCase()));
    if (filters.yearMin) list = list.filter((car) => car.year >= Number(filters.yearMin));
    if (filters.yearMax) list = list.filter((car) => car.year <= Number(filters.yearMax));
    if (filters.seats?.length) list = list.filter((car) => filters.seats.includes(car.seats));
    if (filters.priceMin) list = list.filter((car) => car.pricePerDay >= Number(filters.priceMin));
    if (filters.priceMax) list = list.filter((car) => car.pricePerDay <= Number(filters.priceMax));
    if (filters.transmission?.length) list = list.filter((car) => filters.transmission.includes(car.transmission));
    if (filters.location?.length) list = list.filter((car) => filters.location.includes(car.location));

    setFilteredCars(list);
    setPage(1);
  };

  // Slider Settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
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

  // Map bounds
  const carLocations = filteredCars
    .filter((c) => c.lat && c.lng)
    .map((c) => [c.lat, c.lng, c.make + " " + c.model]);

  const mapCenter =
    carLocations.length > 0
      ? [carLocations[0][0], carLocations[0][1]]
      : [6.9271, 79.8612]; // Default to Colombo

  return (
    <div className="home-page-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Drive Your Dream Car Today</h1>
          <p>Fast booking, verified cars, and multiple locations. Find your perfect ride in seconds.</p>
          <div className="hero-stats">
            <div>
              <h2>{cars.length}</h2>
              <p>Cars Available</p>
            </div>
            <div>
              <h2>100+</h2>
              <p>Locations Covered</p>
            </div>
            <div>
              <h2>500+</h2>
              <p>Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="home-main-content" ref={mainContentRef}>
        {/* Dropping Text Section */}
        <section className="dropping-text-section modern-layout animated-section">
          <div className="text-content-wrapper">
            <h2 className="drop-heading">
              The Perfect Ride.
              <span className="drop-heading-secondary">Tailored For...</span>
            </h2>
            <div className="dropping-texts-container">
              <ul className="dropping-texts">
                <li>Travelers</li>
                <li>Families</li>
                <li>Business Trips</li>
                <li>Any Adventure</li>
              </ul>
            </div>
          </div>
        </section>



        <hr className="section-divider" />

        {/* Featured Cars Carousel */}
        <section className="detail-section featured-cars-section animated-section">
          <h2 className="section-heading"><FaCar className="icon-spacer" /> Featured & Recommended Vehicles</h2>
          {loading ? (
            <p className="text-center">Loading featured cars...</p>
          ) : (
            <Slider {...sliderSettings}>
              {cars.slice(0, 8).map((car) => (
                <div key={car._id} className="car-card-slide-item">
                  <CarCard car={car} onUpdate={() => { }} onDelete={() => { }} />
                </div>
              ))}
            </Slider>
          )}
        </section>

        <hr className="section-divider" />

        {/* Filter Section */}
        <section className="detail-section filter-section animated-section">
          <h2 className="section-heading"><FaFilter className="icon-spacer" /> Refine Your Search</h2>
          <CarFilter onFilterChange={handleFilter} />
        </section>

        {/* Map Section Above Available Cars */}
        <section className="detail-section available-cars-map-section animated-section">
          <h2 className="section-heading"><FaMapMarkerAlt className="icon-spacer" /> Cars on Map</h2>
          <div className="map-container-wrapper">
            <MapContainer center={mapCenter} zoom={8} style={{ height: "400px", borderRadius: "12px" }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {carLocations.map(([lat, lng, title], idx) => (
                <Marker key={idx} position={[lat, lng]}>
                  <Popup>{title}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>

        {/* Available Cars */}
        <section className="detail-section available-cars-section" id="available-cars">
          <h2 className="section-heading animated-section"><FaCar className="icon-spacer" /> All Available Vehicles ({filteredCars.length})</h2>
          {loading ? (
            <p className="text-center">Loading all cars...</p>
          ) : currentCars.length === 0 ? (
            <p className="booking-status-message error text-center animated-section">No cars found matching your search criteria.</p>
          ) : (
            <div className="cars-grid animated-section">
              {currentCars.map((car) => (
                <div key={car._id} className="car-card-wrapper">
                  <CarCard car={car} onUpdate={() => { }} onDelete={() => { }} />
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="pagination animated-section">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => {
                    setPage(i + 1);
                    document.getElementById("available-cars").scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        <hr className="section-divider" />
        {/* Popular Locations */}
        <section className="detail-section popular-locations-section animated-section">
          <h2 className="section-heading"><FaCompass className="icon-spacer" /> Explore Popular Destinations</h2>
          <div className="locations-grid">
            {["colombo", "kandy", "galle", "negombo"].map((loc) => (
              <div key={loc} className="location-card">
                <div className="location-img-container">
                  <div className={`location-img ${loc}`}></div>
                </div>
                <p className="location-name">{loc.charAt(0).toUpperCase() + loc.slice(1)}</p>
              </div>
            ))}
          </div>
        </section>
        <hr className="section-divider" />
        {/* Features & HowItWorks */}
        <section className="detail-section animated-section">
          <Features />
        </section>
        <section className="detail-section animated-section">
          <HowItWorks />
        </section>
      </main>
    </div>
  );
};

export default Home;
