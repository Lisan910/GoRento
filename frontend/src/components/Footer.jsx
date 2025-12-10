import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaLinkedin, FaInstagram, FaCar } from "react-icons/fa";
import "./Footer.css";

const Footer = () => (
  <footer className="rental-footer-premium">
    <div className="footer-content-wrapper">
      
      {/* 1. Brand and Description */}
      <div className="footer-section brand-info">
        <h4 className="footer-logo-title">
          <FaCar className="logo-icon" /> GoRento
        </h4>
        <p>Your premier partner for luxury and performance vehicle rentals. Experience the drive of your dreams with unparalleled service and quality.</p>
        
        <div className="social-links">
          <a href="#" aria-label="Facebook"><FaFacebook /></a>
          <a href="#" aria-label="Twitter"><FaTwitter /></a>
          <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
          <a href="#" aria-label="Instagram"><FaInstagram /></a>
        </div>
      </div>

      {/* 2. Quick Links */}
      <div className="footer-section quick-links">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="/about">About Us</a></li>
          <li><a href="/cars">Our Fleet</a></li>
          <li><a href="/pricing">Pricing & Rates</a></li>
          <li><a href="/faq">FAQ & Support</a></li>
          <li><a href="/terms">Terms & Conditions</a></li>
        </ul>
      </div>

      {/* 3. Contact Information */}
      <div className="footer-section contact-info">
        <h4>Get in Touch</h4>
        <ul>
          <li><FaMapMarkerAlt /> 123 Luxury Drive, Colombo 007</li>
          <li><FaPhone /> +94 11 123 4567</li>
          <li><FaEnvelope /> support@CarRento.lk</li>
        </ul>
      </div>
    </div>

    {/* Copyright Strip */}
    <div className="footer-copyright-strip">
      <p>
        &copy; {new Date().getFullYear()} CarRent Pro. All rights reserved.
      </p>
    </div>
  </footer>
);

export default Footer;