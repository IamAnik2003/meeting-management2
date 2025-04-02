import React, { useState } from "react";
import styles from "../components/Settings.module.css"; // Import the CSS module
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function SettingsComponent() {
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;
  const navigate = useNavigate();
  // State for form inputs
  const email = localStorage.getItem("email");
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  // State for validation errors
  const [errors, setErrors] = useState({});

  // Validation function
  const validate = () => {
    let newErrors = {};

    // First name validation
    if (!firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    // Last name validation
    if (!lastname.trim()) {
      newErrors.lastname = "Last name is required";
    }

    // Email validation
    if (!newEmail.trim()) {
      newErrors.newEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(newEmail)) {
      newErrors.newEmail = "Invalid email format";
    }

    // Password validation
    if (!password.trim()) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)
    ) {
      newErrors.password =
        "Password must include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*)";
    }

    // Confirm password validation
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Perform validation
    const isValid = validate();
    if (!isValid) {
      toast.error("Please fix the errors in the form.");
      return; // Stop submission if validation fails
    }

    // Optionally, save the data to localStorage or send it to a backend API
    try {
      const response = await axios.patch(`${VITE_BACK_URL}/api/updateprofile`, {
        firstname,
        lastname,
        password,
        email,
        newEmail,
      });
      if (response.status === 200) {
        localStorage.setItem("email", newEmail);
        toast.success("Profile updated successfully!");
        navigate("/login");
        toast.success("Please login again!");
      }
    } catch (error) {
      console.error("Error:", error.response ? error.response.data : error.message);
      toast.error("Failed to update the profile");
    }

    // Clear the form after submission
    setFirstName("");
    setLastName("");
    setNewEmail("");
    setPassword("");
    setConfirmPassword("");
    setErrors({});
  };

  return (
    <>
      <div className={styles["settings-container"]}>
        <p>Edit Profile</p>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <label htmlFor="firstname">First Name</label>
          <input
            type="text"
            id="firstname"
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          {errors.firstname && <p className={styles["error"]}>{errors.firstname}</p>}

          {/* Last Name */}
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          {errors.lastname && <p className={styles["error"]}>{errors.lastname}</p>}

          {/* Email */}
          <label htmlFor="newEmail">Email</label>
          <input
            type="email"
            id="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          {errors.newEmail && <p className={styles["error"]}>{errors.newEmail}</p>}

          {/* Password */}
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errors.password && <p className={styles["error"]}>{errors.password}</p>}

          {/* Confirm Password */}
          <label htmlFor="confirmpassword">Confirm Password</label>
          <input
            type="password"
            id="confirmpassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          {errors.confirmPassword && (
            <p className={styles["error"]}>{errors.confirmPassword}</p>
          )}

          {/* Submit Button */}
          <button type="submit">
            <p>Save</p>
          </button>
        </form>
      </div>
    </>
  );
}