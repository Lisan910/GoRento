// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { CarDetails } from "./pages/CarDetails.jsx";
import Wishlist from "./pages/Wishlist.jsx";

import OwnerDashboard from "./pages/OwnerDashboard.jsx";
import CustomerDashboard from "./pages/CustomerDashboard.jsx";
import CustomerBookings from "./pages/CustomerBookings.jsx";
import OwnerRoute from "./components/OwnerRoute.jsx";
import Account from "./pages/Account.jsx";
import ScrollToTop from "./components/ScrollToTop";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cars/:id" element={<CarDetails />} />
        <Route path="/account" element={<Account />} />

        <Route path="/owner/dashboard" element={<OwnerDashboard />} />
        <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />

        {/* Customer dashboard */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
        <Route path="/customer/bookings" element={<CustomerBookings />} />

        <Route path="/dashboard" element={<Navigate to="/customer/dashboard" replace />} />

        <Route path="/wishlist" element={<Wishlist />} />

      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
