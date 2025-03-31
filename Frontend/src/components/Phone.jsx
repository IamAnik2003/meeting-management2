import React, { useState } from "react";
import share1 from "../assets/share1.png";
import phone from "../assets/phone.png";
import styles from "../components/Phone.module.css"; // Import the CSS module
import youtube from "../assets/youtube.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import twitter from "../assets/twitter.png";
import fire from "../assets/fire.png";
import special1 from "../assets/special1.png";
import special2 from "../assets/special2.png";
import avater from "../assets/avater.png";
import "../components/Font.css";
import shop from "../assets/pngwing.com (1).png"; // Default shop image
import linkpng from "../assets/pngwing.com (2).png";
import toast from "react-hot-toast";

export default function Phone({
  selectedColor,
  username,
  savedAddLinks,
  savedShopLinks,
  profileImage,
  selectedLayout,
  selectedButtonStyle,
  buttonColor,
  buttonFontColor,
  selectedTheme,
  selectedFont,
  VITE_URL,
}) {
  const [isLink, setIsLink] = useState(true); // State to manage Link/Shop view
  const userID = localStorage.getItem("userID");

  // Function to get the correct icon based on the selected app
  const getIcon = (app) => {
    switch (app) {
      case "youtube":
        return youtube;
      case "instagram":
        return instagram;
      case "facebook":
        return facebook;
      case "twitter":
        return twitter;
      default:
        return linkpng; // Default icon if no app is specified
    }
  };

  const handleShare = () => {
    const shareLink = `${VITE_URL}/profile/${userID}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => toast.success("Profile link copied to clipboard!"))
      .catch((err) => toast.error("Failed to copy link:", err));
  };

  // Determine the layout class based on selectedLayout
  const getLayoutClass = () => {
    switch (selectedLayout) {
      case "stack":
        return styles["link-item-contain"];
      case "grid":
        return styles["link-item-grid"];
      case "carousel":
        return styles["link-item-carousel"];
      default:
        return styles["link-item-contain"]; // Default to stack layout
    }
  };

  // Determine the button style for link items based on selectedButtonStyle
  const getLinkItemStyle = () => {
    switch (selectedButtonStyle) {
      case "fill1":
        return { backgroundColor: buttonColor || "black", border: "none", borderRadius: "0px", color: buttonFontColor || "white" };
      case "fill2":
        return { backgroundColor: buttonColor || "black", borderRadius: "8px", border: "none", color: buttonFontColor || "white" };
      case "fill3":
        return { backgroundColor: buttonColor || "black", borderRadius: "35px", border: "4px solid white", color: buttonFontColor || "white" };
      case "outline1":
        return { backgroundColor: "transparent", border: `2px solid ${buttonColor || "black"}`, borderRadius: "0px", color: buttonFontColor || "black" };
      case "outline2":
        return { backgroundColor: "transparent", borderRadius: "8px", border: `2px solid ${buttonColor || "black"}`, color: buttonFontColor || "black" };
      case "outline3":
        return { backgroundColor: "transparent", borderRadius: "35px", border: `2px solid ${buttonColor || "black"}`, color: buttonFontColor || "black" };
      case "hardShadow1":
        return { backgroundColor: buttonColor || "#C9C9C9", boxShadow: "5px 5px 0px black", borderRadius: "0px", color: buttonFontColor || "black" };
      case "hardShadow2":
        return { backgroundColor: buttonColor || "#C9C9C9", borderRadius: "8px", boxShadow: "5px 5px 0px black", color: buttonFontColor || "black" };
      case "hardShadow3":
        return { backgroundColor: buttonColor || "#C9C9C9", borderRadius: "35px", boxShadow: "5px 5px 0px black", color: buttonFontColor || "black" };
      case "softShadow1":
        return { backgroundColor: buttonColor || "white", boxShadow: "0 4px 8px #212529", border: "none", borderRadius: "0px", color: buttonFontColor || "black" };
      case "softShadow2":
        return { backgroundColor: buttonColor || "white", borderRadius: "8px", boxShadow: "0 4px 8px #212529", border: "none", color: buttonFontColor || "black" };
      case "softShadow3":
        return { backgroundColor: buttonColor || "white", borderRadius: "25px", boxShadow: "0 4px 8px #212529", border: "none", color: buttonFontColor || "black" };
      case "special1":
        return { backgroundImage: `url(${special1})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center", border: "none", color: buttonFontColor || "black" };
      case "special2":
        return { backgroundImage: `url(${special2})`, backgroundSize: "cover", backgroundRepeat: "no-repeat", backgroundPosition: "center center", border: "none", color: buttonFontColor || "black" };
      case "special3":
        return { backgroundColor: "transparent", borderRadius: "25px", border: `2px solid ${buttonColor || "black"}`, color: buttonFontColor || "black" };
      case "special4":
        return { backgroundColor: buttonColor || "black", borderRadius: "25px", border: "none", color: buttonFontColor || "white" };
      case "special5":
        return { backgroundColor: buttonColor || "black", borderRadius: "25px", border: "none", color: buttonFontColor || "white" };
      case "special6":
        return { backgroundColor: buttonColor || "black", borderRadius: "25px 0px 0px 25px", border: "none", color: buttonFontColor || "white" };
      default:
        return { backgroundColor: buttonColor || "#C9C9C9", color: buttonFontColor || "black" };
    }
  };

  // Function to determine theme-based styles for link items
  const getThemeStyle = () => {
    switch (selectedTheme) {
      case "air-snow":
        return { backgroundColor: "white", border: "2px solid #E0E2D9" };
      case "air-grey":
        return { backgroundColor: "#f0f0f2", border: "2px solid #E0E2D9" };
      case "air-smoke":
        return { backgroundColor: "#212529", border: "none" };
      case "air-black":
        return { backgroundColor: "black", border: "none" };
      case "mineral-blue":
        return { backgroundColor: "#D9EEF9", border: "2px solid #E0E2D9" };
      case "mineral-green":
        return { backgroundColor: "#E6FAF0", border: "2px solid #E0E2D9" };
      case "mineral-orange":
        return { backgroundColor: "#FFEDE2", border: "2px solid #E0E2D9" };
      default:
        return { backgroundColor: "white", border: "none" }; // Default theme
    }
  };

  // Function to determine inner div styles based on selectedTheme
  const getInnerDivStyle = () => {
    switch (selectedTheme) {
      case "air-snow":
        return { background: "black", borderRadius: "8px" };
      case "air-grey":
        return { background: "white", borderRadius: "8px" };
      case "air-smoke":
        return { background: "white", borderRadius: "8px" };
      case "air-black":
        return { background: "#212529", borderRadius: "8px" };
      case "mineral-blue":
        return { background: "transparent", border: "2px solid #cacbc5", borderRadius: "35px" };
      case "mineral-green":
        return { background: "transparent", border: "2px solid #cacbc5", borderRadius: "35px" };
      case "mineral-orange":
        return { background: "transparent", border: "2px solid #cacbc5", borderRadius: "35px" };
      default:
        return { background: "white", borderRadius: "8px" }; // Default inner div style
    }
  };

  // Combine theme and button styles
  const getCombinedStyles = () => {
    const themeStyle = getThemeStyle();
    const buttonStyle = getLinkItemStyle();

    return {
      ...themeStyle, // Apply theme styles first
      ...buttonStyle, // Override with button-specific styles
    };
  };

  // Determine the font class based on selectedFont
  const getFontClass = () => {
    switch (selectedFont) {
      case "Poppins":
        return "poppins-font";
      case "Roboto":
        return "roboto-font";
      case "Open-Sans":
        return "open-sans-font";
      case "Lato":
        return "lato-font";
      case "Montserrat":
        return "montserrat-font";
      default:
        return "poppins-font"; // Default font class
    }
  };

  return (
    <div className={`${styles["phone-container"]} ${getFontClass()}`}>
      {/* Profile Section */}
      <div style={{ background: `${selectedColor}` }} className={`${styles["profile-info"]} ${getFontClass()}`}>
        <div onClick={handleShare} className={styles["share-btn"]}>
          <img src={share1} alt="Share" />
        </div>
        <div className={styles["profile-photo"]}>
          <img src={profileImage || avater} alt="" />
        </div>
        <p className={`${styles[getFontClass()]}`}>@{username}</p>
      </div>

      {/* Link/Shop Buttons */}
      <div className={`${styles["button-contain"]} ${styles[getFontClass()]}`}>
        <button
          className={`${styles["link-btn"]} ${isLink ? styles["active"] : ""} ${getFontClass()}`}
          style={{
            backgroundColor: isLink ? "#28A263" : "#F3F3F1",
            color: isLink ? "white" : "#6C6C6C",
          }}
          onClick={() => setIsLink(true)} // Set isLink to true when clicked
        >
          Link
        </button>
        <button
          className={`${styles["shop-btn"]} ${!isLink ? styles["active"] : ""} ${styles[getFontClass()]}`}
          style={{
            backgroundColor: !isLink ? "#28A263" : "#F3F3F1",
            color: !isLink ? "white" : "#6C6C6C",
          }}
          onClick={() => setIsLink(false)} // Set isLink to false when clicked
        >
          Shop
        </button>
      </div>

      {/* Dynamic Layout Section */}
      <div
        className={`${getLayoutClass()} ${styles[getFontClass()]}`}
        style={{ backgroundColor: getThemeStyle().backgroundColor }} // Apply theme bg color to container
      >
        {(isLink ? savedAddLinks : savedShopLinks).map((item, index) => (
          <a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className={
              selectedLayout === "stack"
                ? `${styles["link-item-div"]} ${styles[getFontClass()]}`
                : selectedLayout === "grid"
                ? `${styles["link-item-div-grid"]} ${styles[getFontClass()]}`
                : `${styles["link-item-div-carousel"]} ${styles[getFontClass()]}`
            }
            style={{
              textDecoration: "none",
              color: "inherit",
              ...getInnerDivStyle(), // Apply inner div styles to the link-item-div
              ...getCombinedStyles(), // Apply combined theme and button styles
            }}
          >
            <div
              className={
                selectedLayout === "stack"
                  ? `${styles["icon-link"]} ${styles[getFontClass()]}`
                  : selectedLayout === "grid"
                  ? `${styles["icon-link-grid"]} ${styles[getFontClass()]}`
                  : `${styles["icon-link-carousel"]} ${styles[getFontClass()]}`
              }
            >
              <img
                src={isLink ? getIcon(item.app) : item.image || shop} // Use default shop image if no image is provided
                alt={isLink ? item.app : "Shop"}
              />
            </div>
            <div
              className={
                selectedLayout === "stack"
                  ? `${styles["link-text"]} ${styles[getFontClass()]}`
                  : selectedLayout === "grid"
                  ? `${styles["link-text-grid"]} ${styles[getFontClass()]}`
                  : `${styles["link-text-carousel"]} ${styles[getFontClass()]}`
              }
              style={{ color: buttonFontColor || "inherit" }}
            >
             <p className={`${styles[getFontClass()]}`}>{item.title}</p>
            </div>
          </a>
        ))}
      </div>

      {/* Get Connected Button */}
      <button className={`${styles["get-connected"]} ${getFontClass()}`}>Get connected</button>

      {/* Logo Section */}
      <div className={`${styles["logo-mobile"]} ${getFontClass()}`}>
        <img src={fire} alt="" />
        SPARK™
      </div>
    </div>
  );
}