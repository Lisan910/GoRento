import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { GoogleLogin } from "@react-oauth/google";
import "./Login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(email, password);

      if (res.user?.role === "owner") navigate("/owner");
      else navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const { credential } = credentialResponse;
      const res = await fetch("http://localhost:5000/api/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credential }),
      }).then((r) => r.json());

      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res.user));

      if (res.user.role === "owner") navigate("/owner");
      else navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  return (
    <div className="auth-page-premium">
      <div className="login-card-luxury">
        <h1 className="login-header-premium">Welcome Back</h1>
        <p className="login-subtitle">Access your premium vehicle rental account.</p>

        <form className="login-form-group" onSubmit={handleSubmit}>
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required className="input-field-premium" />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="input-field-premium" />
          <button type="submit" className="cta-login-btn">Secure Login</button>
        </form>

        <div className="login-divider-text">OR</div>

        <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => alert("Google Login Failed")} />

        <div className="login-link-footer">
          Don't have an account? <Link to="/register" className="register-link">Create Account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
