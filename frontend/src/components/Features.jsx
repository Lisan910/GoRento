import React from "react";
import "./Features.css";
import {
  FiSearch,
  FiShield,
  FiCalendar,
  FiCreditCard,
  FiStar,
  FiHeadphones,
} from "react-icons/fi";

export default function Features() {
  const features = [
    {
      icon: <FiSearch size={28} />,
      title: "Smart Search & Filter",
      description:
        "Instantly find the perfect vehicle by location, type, price, and advanced features.",
    },
    {
      icon: <FiShield size={28} />,
      title: "Owner Verification",
      description:
        "All vehicle listings and owners undergo a stringent verification process for maximum user safety.",
    },
    {
      icon: <FiCalendar size={28} />,
      title: "Instant Booking Confirmation",
      description:
        "Enjoy a seamless, real-time booking process with immediate reservation confirmation.",
    },
    {
      icon: <FiCreditCard size={28} />,
      title: "Encrypted Transactions",
      description:
        "Process payments securely using industry-leading encryption and diverse payment gateways.",
    },
    {
      icon: <FiStar size={28} />,
      title: "Transparent Feedback Loop",
      description:
        "Make informed decisions using verified reviews and ratings from our community of previous renters.",
    },
    {
      icon: <FiHeadphones size={28} />,
      title: "Dedicated Client Support",
      description:
        "Access responsive, dedicated customer support available round the clock for all your needs.",
    },
  ];

  return (
    <section className="premium-features-section">
      <div className="features-inner-container">
        {/* Header Updated for Formal Tone */}
        <div className="features-title-header">
          <p className="subtitle-tag">THE CARRENT PRO ADVANTAGE</p>
          <h2>Experience **Unparalleled Rental Service**</h2>
        </div>

        {/* Grid Container */}
        <div className="features-pro-grid">
          {features.map((feature, index) => (
            <div key={index} className="pro-feature-card">
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="pro-feature-title">{feature.title}</h3>
              <p className="pro-feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}