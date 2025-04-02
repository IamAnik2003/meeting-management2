import React from "react";
import styles from "../components/Header.module.css"; // Import the CSS module
import share from "../assets/share.png";
import toast from "react-hot-toast";

export default function Header({ fullname, VITE_URL, activeMenu }) {
  
  const userID = localStorage.getItem("userID");
  const getHeaderTitle = () => {
    switch(activeMenu) {
      case "events": return "Create Event";
      case "booking": return "Booking Page";
      case "availability": return "Availability";
      case "settings": return "Profile";
      default: return "Create Event";
    }
  };
  const getHeader2 = () => {
    switch(activeMenu) {
      case "events": return "Create events to share for people to book on your calendar.New";
      case "booking": return "See upcoming and past events booked through your event type links.";
      case "availability": return "Configure times when you are available for bookings";
      case "settings": return "Manage settings for your profile";
      default: return "Create events to share for people to book on your calendar.New";
    }
  };
  return (
    <>
      <header>
        <div className={styles["head-container"]}>
          <p style={{ fontWeight: "bold", fontSize: "1.3em" }}>
            {getHeaderTitle()}
          </p>
          <p>{getHeader2()}</p>
        </div>
      </header>
    </>
  );
}
