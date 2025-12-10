// src/components/OwnerRoute.jsx
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

const OwnerRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <p>Loading...</p>;
  if (user.role !== "owner") return <Navigate to="/" />;
  return children;
};

export default OwnerRoute;
