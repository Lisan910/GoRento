import React from "react";
import "./HowItWorks.css";
import {
  FiUserPlus,
  FiSearch,
  FiCalendar,
  FiCreditCard,
  FiKey,
  FiStar,
} from "react-icons/fi";

export default function HowItWorks() {
  const steps = [
    { icon: <FiUserPlus size={26} />, title: "Create Account", description: "Sign up as a customer or car owner" },
    { icon: <FiSearch size={26} />, title: "Search & Select", description: "Browse available cars and choose your perfect match" },
    { icon: <FiCalendar size={26} />, title: "Book Dates", description: "Select your rental period and confirm availability" },
    { icon: <FiCreditCard size={26} />, title: "Pay Securely", description: "Complete payment with our secure payment gateway" },
    { icon: <FiKey size={26} />, title: "Pick Up Car", description: "Meet the owner and start your journey" },
    { icon: <FiStar size={26} />, title: "Leave Review", description: "Share your experience after the rental" },
  ];

  return (
    <section className="how-section">
      <div className="how-header">
        <h2>How It Works</h2>
        <p>Rent a car in 6 simple steps</p>
      </div>

      <div className="how-grid">
        {steps.map((step, index) => (
          <div key={index} className="how-card">
            <div className="how-number">{index + 1}</div>

            <div className="how-icon">{step.icon}</div>

            <h3 className="how-title">{step.title}</h3>
            <p className="how-description">{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
