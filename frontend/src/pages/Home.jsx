// src/pages/Home.jsx

import { useEffect, useState, useRef } from "react";
import { carApi } from "../api/carApi";
import CarCard from "../components/CarCard";
import Features from "../components/Features";
import HowItWorks from "../components/HowItWorks";
import CarFilter from "../components/CarFilter";

import { FaCar, FaMapMarkerAlt, FaFilter, FaCompass } from "react-icons/fa";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import "./Home.css";

// Fix Leaflet icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Home = () => {
  const [cars, setCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const carsPerPage = 12;
  const availableCarsRef = useRef(null);

  // Fetch cars
  const fetchCars = async () => {
    try {
      const res = await carApi.getAll();
      const availableCars = res.data.filter((car) => car.available);
      setCars(availableCars);
      setFilteredCars(availableCars);
    } catch (err) {
      console.error("Failed to fetch cars:", err);
      alert("Failed to load cars.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCars();
  }, []);

  // Filter Logic
  const handleFilter = (filters) => {
    let list = [...cars];

    if (filters.search) {
      list = list.filter(
        (car) =>
          car.make.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.model.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.location.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

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

    if (filters.priceMin)
      list = list.filter((car) => car.pricePerDay >= Number(filters.priceMin));

    if (filters.priceMax)
      list = list.filter((car) => car.pricePerDay <= Number(filters.priceMax));

    if (filters.transmission?.length)
      list = list.filter((car) =>
        filters.transmission.includes(car.transmission)
      );

    if (filters.location?.length)
      list = list.filter((car) =>
        filters.location.includes(car.location)
      );

    setFilteredCars(list);
    setPage(1);
  };

  // Pagination
  const indexOfLast = page * carsPerPage;
  const indexOfFirst = indexOfLast - carsPerPage;
  const currentCars = filteredCars.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredCars.length / carsPerPage);

  // Map locations
  const carLocations = filteredCars
    .filter((c) => c.lat && c.lng)
    .map((c) => [c.lat, c.lng, c.make + " " + c.model]);

  const mapCenter =
    carLocations.length > 0
      ? [carLocations[0][0], carLocations[0][1]]
      : [6.9271, 79.8612]; // Colombo default

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3500,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 600, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <div className="home-page-wrapper">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>
              Drive Your <span>Dream Car</span>
            </h1>
            <p>
              Premium vehicles. Easy booking. Trusted service across Sri Lanka.
            </p>

            <div className="hero-buttons">
              <a href="#available-cars" className="primary-btn">
                Browse Cars
              </a>
            </div>

            <div className="hero-stats">
              <div>
                <h2>{cars.length}+</h2>
                <p>Cars Available</p>
              </div>
              <div>
                <h2>100+</h2>
                <p>Locations</p>
              </div>
              <div>
                <h2>500+</h2>
                <p>Happy Clients</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main>
        {/* Featured Cars */}
        <section className="detail-section">
          <h2 className="section-heading">
            <FaCar /> Featured Vehicles
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <Slider {...sliderSettings}>
              {cars.slice(0, 8).map((car) => (
                <div key={car._id}>
                  <CarCard car={car} />
                </div>
              ))}
            </Slider>
          )}
        </section>

        {/* Filter */}
        <section className="detail-section">
          <h2 className="section-heading">
            <FaFilter /> Refine Search
          </h2>
          <CarFilter onFilterChange={handleFilter} />
        </section>

        {/* Map */}
        <section className="detail-section">
          <h2 className="section-heading">
            <FaMapMarkerAlt /> Cars on Map
          </h2>

          <div className="map-container-wrapper">
            <MapContainer
              center={mapCenter}
              zoom={8}
              style={{ height: "400px" }}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {carLocations.map(([lat, lng, title], idx) => (
                <Marker key={idx} position={[lat, lng]}>
                  <Popup>{title}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </section>

        {/* All Cars */}
        <section
          className="detail-section"
          id="available-cars"
          ref={availableCarsRef}
        >
          <h2 className="section-heading">
            <FaCar /> All Vehicles ({filteredCars.length})
          </h2>

          {loading ? (
            <p>Loading...</p>
          ) : currentCars.length === 0 ? (
            <p>No cars found.</p>
          ) : (
            <div className="cars-grid">
              {currentCars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  className={`page-btn ${page === i + 1 ? "active" : ""}`}
                  onClick={() => {
                    setPage(i + 1);
                    availableCarsRef.current?.scrollIntoView({
                      behavior: "smooth",
                    });
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Extra Sections */}
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

export default Home;