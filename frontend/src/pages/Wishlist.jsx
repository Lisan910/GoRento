import { useEffect, useState } from "react";
import { authApi } from "../api/authApi";
import CarCard from "../components/CarCard";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const res = await authApi.getFavorites();
      setWishlist(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setWishlist([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  // 🔹 Update wishlist instantly when heart is toggled
  const handleToggleFromCard = (carId, added) => {
    setWishlist(prev =>
      added
        ? [...prev, { _id: carId }] // Add placeholder; backend updates data
        : prev.filter(car => car._id !== carId)
    );
  };

  if (loading) return <p>Loading wishlist...</p>;
  if (!wishlist.length) return <p>Your wishlist is empty.</p>;

  return (
    <div className="wishlist-page-wrapper">
      <div className="wishlist-header">
        <h1>My Wishlist</h1>
      </div>

      <div className="wishlist-container">
        {wishlist.map(car => (
          <CarCard
            key={car._id}
            car={car}
            onWishlistToggle={handleToggleFromCard} // pass callback
          />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
