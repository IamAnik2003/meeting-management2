import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Protected({ Components, ...props }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/register");
    }
  }, [token, navigate]); // Added dependency array to prevent infinite re-renders

  return (
    <div>
      <Components {...props} /> {/* Pass down additional props like userName */}
    </div>
  );
}
