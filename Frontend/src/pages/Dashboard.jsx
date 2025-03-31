import React, { useState } from "react";
import styles from "../pages/Dashboard.module.css"; // Import the CSS module
import cnnct from "../assets/cnnct.png"
import events from "../assets/events.png"
import booking from "../assets/booking.png"
import availability from "../assets/availability.png"
import settings from "../assets/settings.png";
import avater from "../assets/avater1.png";
import signout from "../assets/signout.png";
import { useNavigate } from "react-router-dom";
import LinkComponent from "../components/Events";
import AppearanceComponent from "../components/Booking";
import AnalyticsComponent from "../components/AnalyticsComponent";
import SettingsComponent from "../components/SettingsComponent";
import Header from "../components/Header";
import useIsMobile from "../components/useIsMobile";

export default function Dashboard({ VITE_URL }) {
  const fullname = localStorage.getItem("fullname");
  const [showSignOut, setShowSignOut] = useState(false);
  const [showSignOutPopup, setShowSignOutPopup] = useState(false);
  const [activeMenu, setActiveMenu] = useState("links");
  const userID = localStorage.getItem("userID");
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  // Shared state for LinkComponent and AppearanceComponent
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || avater
  );
  const [username, setUsername] = useState(
    localStorage.getItem("username") || "YourUsername"
  );
  const [bio, setBio] = useState(localStorage.getItem("bio") || "Bio");
  const [savedAddLinks, setSavedAddLinks] = useState(
    JSON.parse(localStorage.getItem("savedAddLinks")) || []
  );
  const [savedShopLinks, setSavedShopLinks] = useState(
    JSON.parse(localStorage.getItem("savedShopLinks"))
  );
  const [isLink, setIsLink] = useState(true);
  const [selectedColor, setSelectedColor] = useState(
    localStorage.getItem("selectedColor") || "#342B26"
  );

  // Handle sign-out logic
  const handleSignOut = () => {
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

    navigate("/");

    setShowSignOutPopup(false);
    setShowSignOut(false);
  };

  // Render component based on active menu
  const renderComponent = () => {
    switch (activeMenu) {
      case "links":
        return (
          <LinkComponent
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            username={username}
            setUsername={setUsername}
            bio={bio}
            setBio={setBio}
            savedAddLinks={savedAddLinks}
            setSavedAddLinks={setSavedAddLinks}
            savedShopLinks={savedShopLinks}
            setSavedShopLinks={setSavedShopLinks}
            isLink={isLink}
            setIsLink={setIsLink}
            profileImage={profileImage}
            setProfileImage={setProfileImage}
            VITE_URL={VITE_URL}
          />
        );
      case "appearance":
        return (
          <AppearanceComponent
            selectedColor={selectedColor}
            username={username}
            savedAddLinks={savedAddLinks}
            savedShopLinks={savedShopLinks}
            isLink={isLink}
            profileImage={profileImage}
            VITE_URL={VITE_URL}
          />
        );
      case "analytics":
        return <AnalyticsComponent />;
      case "settings":
        return <SettingsComponent />;
      default:
        return <LinkComponent />;
    }
  };

  return (
    <div className={styles["dashboard-container"]}>
      {!isMobile ? (
        <div className={styles["ch1"]}>
          <img
            style={{ marginTop: "6%", alignSelf: "center" }}
            src={cnnct}
            alt="Logo"
          />

          {/* Links Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "links" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("links")}
          >
            <img src={events} alt="Links Icon" />
            <p>Events</p>
          </div>

          {/* Appearance Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "appearance" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("appearance")}
          >
            <img src={booking} alt="Appearance Icon" />
            <p>Booking</p>
          </div>

          {/* Analytics Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "analytics" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("analytics")}
          >
            <img src={availability} alt="Analytics Icon" />
            <p>Availability</p>
          </div>

          {/* Settings Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "settings" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("settings")}
          >
            <img src={settings} alt="Settings Icon" />
            <p>Settings</p>
          </div>

          {/* Toggle Sign Out Box */}
          {showSignOut && (
            <div
              onClick={() => setShowSignOutPopup(true)}
              className={styles["signout"]}
            >
              <img src={signout} alt="Sign Out Icon" />
              <p>Sign out</p>
            </div>
          )}

          {/* Toggle showSignOut on click */}
          <div
            onClick={() => setShowSignOut(!showSignOut)}
            className={styles["username"]}
          >
            <div className={styles["img1"]}>
              <img style={{width:"100%",height:"100%",borderRadius:"50%"}} src={avater} alt="User Avatar" />
            </div>
            <p>{fullname}</p>
          </div>
        </div>
      ) : (
        <div className={styles["ch2"]}>
          {!isMobile ? (
            <Header
              fullname={fullname}
              VITE_URL={VITE_URL}
              profileImage={profileImage}
            
            />
          ) : (
            <div className={styles["head-container1"]}>
              <img src={img1} alt="profile" />
              <div
                onClick={() => setShowSignOut(!showSignOut)}
                style={{ height: "100%", width: "13%" }}
                className={styles["profile1"]}
              >
                <img src={profileImage} alt="profile" />
              </div>
              {showSignOut && (
                <div
                  onClick={() => setShowSignOutPopup(true)}
                  className={styles["signout"]}
                >
                  <img src={signout} alt="Sign Out Icon" />
                  <p>Sign out</p>
                </div>
              )}
            </div>
          )}
          {renderComponent()}
        </div>
      )}

      {/* Popup for confirmation */}
      {showSignOutPopup && (
        <div className={styles["popup-overlay"]}>
          <div className={styles["popup-content"]}>
            <p>Are you sure you want to sign out?</p>
            <div className={styles["popup-buttons"]}>
              <button
                onClick={handleSignOut}
                className={`${styles["popup-button"]} ${styles["yes"]}`}
              >
                Yes
              </button>
              <button
                onClick={() => setShowSignOutPopup(false)}
                className={`${styles["popup-button"]} ${styles["no"]}`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ch2 Section for Active Component */}
      {!isMobile ? (
        <div className={styles["ch2"]}>
          <Header fullname={fullname} VITE_URL={VITE_URL}   activeMenu={activeMenu} />
          {renderComponent()}
        </div>
      ) : (
        <div className={styles["ch1"]}>
          {!isMobile && (
            <img
              style={{ marginTop: "6%", alignSelf: "center" }}
              src={img1}
              alt="Logo"
            />
          )}

          {/* Links Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "links" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("links")}
          >
            <img src={links} alt="Links Icon" />
            <p>Links</p>
          </div>

          {/* Appearance Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "appearance" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("appearance")}
          >
            <img src={appearance} alt="Appearance Icon" />
            <p>Appearance</p>
          </div>

          {/* Analytics Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "analytics" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("analytics")}
          >
            <img src={analytics} alt="Analytics Icon" />
            <p>Analytics</p>
          </div>

          {/* Settings Menu */}
          <div
            className={`${styles["menu"]} ${
              activeMenu === "settings" ? styles["active"] : ""
            }`}
            onClick={() => setActiveMenu("settings")}
          >
            <img src={settings} alt="Settings Icon" />
            <p>Settings</p>
          </div>
        </div>
      )}
    </div>
  );
}