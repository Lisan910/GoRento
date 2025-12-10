import React from "react";
import { Link, useLocation } from "react-router-dom"; // Import useLocation
import { useAuth } from "../hooks/useAuth";
import { FiHome, FiUser, FiLogOut, FiLogIn, FiUserPlus, FiBookOpen, FiStar } from "react-icons/fi"; // Added FiStar for Wishlist
import "./Navbar.css";

// Helper function to determine if a link is "selected" (active)
const getLinkClass = (currentPath, targetPath) => {
  return currentPath === targetPath ? "nav-link selected" : "nav-link";
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation(); // Get current path for 'selected' state

  // Define links based on authentication status and role
  const navLinks = user
    ? [
        {
          name: "Dashboard",
          path: user.role === "owner" ? "/owner/dashboard" : "/customer/dashboard",
          icon: <FiHome className="link-icon" />,
        },
        user.role === "customer" && {
          name: "Bookings",
          path: "/customer/bookings",
          icon: <FiBookOpen className="link-icon" />,
        },
        user.role === "customer" && {
          name: "Wishlist",
          path: "/wishlist",
          icon: <FiStar className="link-icon" />,
        },
        { name: "Account", path: "/account", icon: <FiUser className="link-icon" /> },
      ].filter(Boolean) // Filter out false values for customer-specific links
    : [
        { name: "Sign In", path: "/login", icon: <FiLogIn className="link-icon" /> },
        { name: "Sign Up", path: "/register", icon: <FiUserPlus className="link-icon" /> },
      ];

  return (
    <nav className="app-navbar-container">
      <div className="navbar-pill-wrapper">
        {/* Brand Text/Link (Minimal) */}
        <Link to="/" className="navbar-brand-text">
          GoRento
        </Link>
        
        {/* Links Container */}
        <div className="navbar-links-group">
          {user && (
             <span className="user-welcome-text">Welcome, {user.name}</span>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={getLinkClass(location.pathname, link.path)}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}

          {/* Logout Button (if logged in) */}
          {user && (
            <button onClick={logout} className="nav-link logout-link">
              <FiLogOut className="link-icon" />
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;