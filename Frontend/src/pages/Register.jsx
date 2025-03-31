import React, { useState } from "react";
import useIsMobile from "../components/useIsMobile";
import styles from "../pages/Register.module.css"; // Import CSS Module
import cnnct from "../assets/cnnct.png";
import i2 from "../assets/i2.png";
import { Link } from "react-router-dom";
import img2 from "../assets/Frame (1).png";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChecked, setIsChecked] = useState(false); // State for checkbox
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;


  const validate = () => {
    let newErrors = {};

    if (!firstname.trim()) newErrors.firstname = "First name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email))
      newErrors.email = "Invalid email format";
    if (!password.trim()) newErrors.password = "Password is required";
    else if (password.length < 8)
      newErrors.password = "Password must be at least 8 characters long";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password))
      newErrors.password =
        "Password must include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*)";
    if (!confirmPassword.trim())
      newErrors.confirmPassword = "Please confirm your password";
    else if (confirmPassword !== password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!isChecked)
      newErrors.checkbox = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setIsChecked(checked);
      if (checked) delete errors.checkbox; // Remove checkbox error if checked
    } else {
      if (id === "firstname") {
        setFirstname(value);
        if (value.trim()) delete errors.firstname; // Remove firstname error if filled
      } else if (id === "lastname") {
        setLastname(value);
        // No validation for lastname
      } else if (id === "email") {
        setEmail(value);
        if (value.trim() && /\S+@\S+\.\S+/.test(value)) delete errors.email; // Remove email error if valid
      } else if (id === "password") {
        setPassword(value);
        if (
          value.trim() &&
          value.length >= 8 &&
          /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(value)
        )
          delete errors.password; // Remove password error if valid
      } else if (id === "confirmPassword") {
        setConfirmPassword(value);
        if (value.trim() && value === password) delete errors.confirmPassword; // Remove confirmPassword error if valid
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validate(); // Perform full validation
    if (!isValid) {
      toast.error("Please full fill required fields.");
      return; // Stop the function if validation fails
    }

    try {
      // Send form data to the backend
      const response = await axios.post(`${VITE_BACK_URL}/api/register`, {
        firstname,
        lastname,
        email,
        password,
      });

      if (response.status === 201) {
        // ✅ Correct status check
        toast.success("Registered successfully!");
        setFirstname("");
        setLastname("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsChecked(false);
        setErrors({});
        localStorage.removeItem("token");
        localStorage.removeItem("fullname");
        localStorage.removeItem("bio");
        localStorage.removeItem("email");
        localStorage.removeItem("username");
        localStorage.removeItem("tempUserName");
        localStorage.removeItem("notes");
        localStorage.removeItem("selected");
        localStorage.removeItem("user");
        localStorage.removeItem("selectedColor");
        localStorage.removeItem("selectedLayout");
        localStorage.removeItem("selectedButtonStyle");
        localStorage.removeItem("buttonColor");
        localStorage.removeItem("buttonFontColor");
        localStorage.removeItem("selectedTheme");
        localStorage.removeItem("selectedFont");
        localStorage.removeItem("selectedFontColor");
        localStorage.removeItem("savedAddLinks");
        localStorage.removeItem("savedShopLinks");
        localStorage.removeItem("userID");
        localStorage.removeItem("profileImage");
        navigate("/login"); // ✅ Navigate immediately
      } else if (
        response.status === 400 &&
        response.message === "User already exists"
      ) {
        toast.error("User already exists"); // ✅ Show error to user
      }
    } catch (error) {
      console.error(
        "Error:",
        error.response ? error.response.data : error.message
      );
      toast.error(error.response?.data?.message || "Registration failed"); // ✅ Show error to user
    }
  };

  // Check if any field has a value and the checkbox is checked
  const isAnyFieldFilled =
    firstname || lastname || email || password || confirmPassword;

  return (
    <div className={styles.container}>
      <div className={styles.c1}>
        <img
          className={isMobile ? styles.mobileLogo : styles.desktopLogo}
          src={cnnct}
          alt="Logo"
        />
        <div className={styles.formDiv}>
          <h1>Sign up to your Spark</h1>
          <div className={styles.formHeader}>
            <h4>Create an account</h4>
            <Link to="/login">Sign in instead</Link>
          </div>
          <form onSubmit={handleSubmit} method="POST">
            <div className={styles.inputGroup}>
              <label style={{textAlign:"left"}} htmlFor="firstname">First name</label>
              <input
                type="text"
                id="firstname"
                value={firstname}
                onChange={handleChange}
              />
              {errors.firstname && <p className={styles.error}>{errors.firstname}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label style={{textAlign:"left"}} htmlFor="lastname">Last name</label>
              <input
                type="text"
                id="lastname"
                value={lastname}
                onChange={handleChange}
              />
            </div>

            <div className={styles.inputGroup}>
              <label style={{textAlign:"left"}} htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleChange}
              />
              {errors.email && <p className={styles.error}>{errors.email}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label style={{textAlign:"left"}} htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handleChange}
              />
              {errors.password && <p className={styles.error}>{errors.password}</p>}
            </div>

            <div className={styles.inputGroup}>
              <label style={{textAlign:"left"}} htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className={styles.error}>{errors.confirmPassword}</p>
              )}
            </div>

            <div className={styles.checkboxGroup}>
              <input
                type="checkbox"
                id="t&c"
                checked={isChecked}
                onChange={handleChange}
              />
              <label htmlFor="t&c">
                By creating an account, I agree to our{" "}
                <Link to="">terms of use</Link> and{" "}
                <Link to="">privacy policy</Link>
              </label>
              {errors.checkbox && <p className={styles.error}>{errors.checkbox}</p>}
            </div>

            <button
              className={`${styles.submitButton} ${
                isAnyFieldFilled && isChecked ? styles.activeButton : styles.inactiveButton
              }`}
              type="submit"
            >
              Create an account
            </button>
            {!isMobile && (
              <p className={styles.footerText}>
                This site is protected by reCAPTCHA and the{" "}
                <Link>Google Privacy Policy</Link> and{" "}
                <Link>Terms of Service</Link> apply.
              </p>
            )}
          </form>
        </div>
      </div>
      {!isMobile && (
        <div className={styles.c2}>
          <img src={i2} alt="Banner" />
        </div>
      )}
    </div>
  );
}