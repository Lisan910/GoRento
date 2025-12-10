import { useState } from "react";
import { authApi } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import "./Register.css";
import { GoogleLogin } from "@react-oauth/google";
import { FaCar, FaUser } from "react-icons/fa";

const Register = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "customer" });
  const [message, setMessage] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!acceptedTerms) {
      setMessage("You must accept the Terms & Conditions.");
      return;
    }

    try {
      await authApi.register(form);
      // FIXED: Pass separate email & password arguments
      await login(form.email, form.password);

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        window.location.href = form.role === "owner" ? "/owner" : "/dashboard";
      }, 1000);
    } catch (err) {
      console.error("Registration failed:", err);
      setMessage(err.response?.data?.message || "Error registering user.");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await authApi.googleLogin({ token: credential });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = res.data.user.role === "owner" ? "/owner" : "/dashboard";
    } catch (err) {
      console.error("Google login error:", err);
      alert("Google login failed");
    }
  };

  return (
    <div className="auth-page-premium">
      <div className="register-card-luxury">
        <h2 className="register-header-premium">Create a New Account</h2>
        <p className="register-subtitle">Join us as a renter or a vehicle owner.</p>

        {message && <p className={`register-message ${message.includes("successful") ? "success" : "error"}`}>{message}</p>}

        <form onSubmit={handleSubmit} className="register-form-group">
          <div className="role-selector-group">
            <label className={`role-chip ${form.role === 'customer' ? 'selected' : ''}`} onClick={() => setForm({ ...form, role: 'customer' })}>
              <FaUser /> Renter
            </label>
            <label className={`role-chip ${form.role === 'owner' ? 'selected' : ''}`} onClick={() => setForm({ ...form, role: 'owner' })}>
              <FaCar /> Vehicle Owner
            </label>
            <input type="hidden" name="role" value={form.role} />
          </div>

          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className="input-field-premium" />
          <input name="email" placeholder="Email Address" type="email" value={form.email} onChange={handleChange} required className="input-field-premium" />
          <input name="password" placeholder="Password (Min. 8 characters)" type="password" value={form.password} onChange={handleChange} required className="input-field-premium" />

          <div className="terms-policy-container">
            <input type="checkbox" id="terms" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} className="checkbox-custom" />
            <label htmlFor="terms" className="terms-label">
              I have read and agree to the{" "}
              <span className="terms-link-premium" onClick={() => alert("Show Terms & Conditions here")}>
                Terms & Conditions
              </span>
            </label>
          </div>

          <button className="cta-register-btn" type="submit">Create Account</button>
          <div className="register-divider-text">OR</div>
          <div className="google-login-wrapper">
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => alert("Google Login Failed")} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
