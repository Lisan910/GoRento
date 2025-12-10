// src/pages/Account.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authApi } from "../api/authApi";
import "./Account.css";

const Account = () => {
  const { user, setUser } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    profilePicture: null,
    address: "",
    nicNumber: "",
    birthday: "",
    drivingLicenseNumber: "",
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        profilePicture: null, // file input is always null initially
        address: user.address || "",
        nicNumber: user.nicNumber || "",
        birthday: user.birthday ? user.birthday.slice(0, 10) : "",
        drivingLicenseNumber: user.drivingLicenseNumber || "",
      });
      setPreview(user.profilePicture ? `http://localhost:5000${user.profilePicture}` : "/default-avatar.png");
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      setFormData({ ...formData, [name]: files[0] });
      setPreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (let key in formData) {
      // Only append profilePicture if it's a file
      if (key === "profilePicture" && formData[key] instanceof File) {
        data.append(key, formData[key]);
      } else {
        data.append(key, formData[key] || "");
      }
    }

    try {
      const res = await authApi.updateProfile(data);
      alert(res.data.message);
      setUser(res.data.user); // refresh context
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="account-page">
      <h1>My Account</h1>
      <div className="account-container">
        <div className="account-display">
          <img src={preview} alt="Profile" />
          <h2>{formData.name}</h2>
          <p>Email: {formData.email}</p>
          <p>Phone: {formData.phone}</p>
          <p>Address: {formData.address}</p>
          <p>NIC: {formData.nicNumber}</p>
          <p>Birthday: {formData.birthday}</p>
          <p>Driving License: {formData.drivingLicenseNumber}</p>
        </div>

        <form className="account-form" onSubmit={handleSubmit}>
          <h2>Edit Account Details</h2>

          <label>Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input name="email" type="email" value={formData.email} onChange={handleChange} required />

          <label>Phone</label>
          <input name="phone" value={formData.phone} onChange={handleChange} />

          <label>Address</label>
          <input name="address" value={formData.address} onChange={handleChange} />

          <label>NIC / Passport</label>
          <input name="nicNumber" value={formData.nicNumber} onChange={handleChange} />

          <label>Birthday</label>
          <input name="birthday" type="date" value={formData.birthday} onChange={handleChange} />

          <label>Driving License</label>
          <input name="drivingLicenseNumber" value={formData.drivingLicenseNumber} onChange={handleChange} />

          <label>Profile Picture</label>
          <input name="profilePicture" type="file" accept="image/*" onChange={handleChange} />

          <button type="submit">Update Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Account;
