// src/components/PolicyForm.jsx
import { useState, useEffect } from "react";
import { authApi } from "../api/authApi";
import "./PolicyForm.css";

const PolicyForm = ({ userId, onClose, onSaved }) => {
  const [insurance, setInsurance] = useState("");
  const [cancellation, setCancellation] = useState("");
  const [additionalRules, setAdditionalRules] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch current policies
  const fetchPolicies = async () => {
    if (!userId) return;
    try {
      const res = await authApi.getUserById(userId);
      if (res.data.policies) {
        setInsurance(res.data.policies.insurance || "");
        setCancellation(res.data.policies.cancellation || "");
        setAdditionalRules(res.data.policies.additionalRules || "");
      }
    } catch (err) {
      console.error("Failed to fetch policies:", err);
      alert("Failed to load current policies");
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [userId]);

  // Save policies
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) return alert("User ID missing");
    setLoading(true);
    try {
      const res = await authApi.updatePolicies(userId, {
        insurance,
        cancellation,
        additionalRules,
      });
      alert("Policies updated successfully!");
      if (onSaved) onSaved(res.data.policies); // pass updated policies to parent
      onClose();
    } catch (err) {
      console.error("Failed to save policies:", err);
      alert("Failed to save policies");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="policy-form-overlay">
      <div className="policy-form-container">
        <h2>Update Policies</h2>
        <form onSubmit={handleSubmit}>
          <label>Insurance Info</label>
          <textarea value={insurance} onChange={(e) => setInsurance(e.target.value)} />

          <label>Cancellation Policy</label>
          <textarea value={cancellation} onChange={(e) => setCancellation(e.target.value)} />

          <label>Additional Rules</label>
          <textarea value={additionalRules} onChange={(e) => setAdditionalRules(e.target.value)} />

          <button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Policies"}
          </button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default PolicyForm;
