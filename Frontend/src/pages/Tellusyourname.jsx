import React, { useState } from "react";
import axios from "axios";
import useIsMobile from "../components/useIsMobile";
import cnnct from "../assets/cnnct.png";
import i2 from "../assets/i2.png";
import toast from "react-hot-toast";
import styles from "../pages/Tellusyourname.module.css"; // Import the CSS module
import { useNavigate } from "react-router-dom";

export default function Tellusyourname() {
  const [username, setUsername] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const email = localStorage.getItem("email");
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;

  const categories = [
    { emoji: "🏢", name: "Sales" },
    { emoji: "📚", name: "Education" },
    { emoji: "📥", name: "Finance" },
    { emoji: "⚖️", name: "Government & Politics" },
    { emoji: "💼", name: "Consulting" },
    { emoji: "📄", name: "Recruiting" },
    { emoji: "🖥️", name: "Tech" },
    { emoji: "🚀", name: "Marketing" }
  ];

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    // Validate username and category
    if (!username.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Please select a category.");
      return;
    }

    // If validation passes, save the data (you can replace this with your logic)
    try {
      const response = await axios.post(`${VITE_BACK_URL}/api/tell-us-yourname`, {
        username: username,
        category: selectedCategory,
        email: email,
      });
      if (response.status === 200) {
        toast.success("Data saved successfully!");
        localStorage.setItem("username", username);
        // Redirect or perform other actions
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className={styles.logincontainer1}>
      <div className={styles.ccc1}>
        <img
          style={
            !isMobile
              ? {
                  marginTop: "3%",
                  marginLeft: "3%",
                  width: "15%",
                  height: "7%",
                }
              : {
                  width: "30%",
                  height: "6%",
                }
          }
          src={cnnct}
          alt=""
        />
        <div className={styles.formdiv11}>
          <h1 style={{ marginLeft: "-0.1%" }}>Your Preferences</h1>
          <form className={styles["form-grp11"]} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tell us your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <h4
              style={
                !isMobile
                  ? { textAlign: "left" }
                  : { fontSize: "0.9em", textAlign: "left" }
              }
            >
              Select one category that best describes your CNNCT:
            </h4>
            <div className={styles["catagory-container"]}>
              {categories.map((category, index) => (
                <div
                  key={index}
                  className={`${styles.catagory} ${
                    selectedCategory === category.name ? styles.selected : ""
                  }`}
                  onClick={() => handleCategoryClick(category.name)}
                >
                  {category.emoji}
                  <p style={isMobile ? { fontSize: "0.8em" } : {}}>
                    {category.name}
                  </p>
                </div>
              ))}
            </div>

            <button
              style={
                !isMobile
                  ? {
                      backgroundColor: "#1877F2",
                      border: "none",
                      padding: "2%",
                      color: "white",
                      textAlign: "center",
                      width: "95%",
                      margin: "5% auto",
                      borderRadius: "25px",
                    }
                  : {
                      backgroundColor: "#1877F2",
                      border: "none",
                      padding: "2%",
                      color: "white",
                      textAlign: "center",
                      width: "95%",
                      height: "20%",
                      margin: "0% auto",
                      borderRadius: "25px",
                    }
              }
              type="submit"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
      {!isMobile && (
        <div className={styles.ccc2}>
          <img src={i2} style={{ width: "100%", height: "100%" }} alt="" />
        </div>
      )}
    </div>
  );
}