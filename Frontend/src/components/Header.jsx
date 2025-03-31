import React from "react";
import styles from "../components/Header.module.css"; // Import the CSS module
import share from "../assets/share.png";
import toast from "react-hot-toast";

export default function Header({ fullname, VITE_URL, activeMenu }) {
  console.log(activeMenu)
  const userID = localStorage.getItem("userID");

  // Function to handle share button click
  const handleShare = () => {
    const shareLink = `${VITE_URL}/profile/${userID}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => toast.success("Profile copied to clipboard"))
      .catch((err) => console.error("Failed to copy link:", err));
  };
  const getHeaderTitle = () => {
    switch(activeMenu) {
      case "links": return "Create Event";
      case "appearance": return "Booking Page";
      case "analytics": return "Availability";
      case "settings": return "Profile";
      default: return "Create Event";
    }
  };
  const getHeader2 = () => {
    switch(activeMenu) {
      case "links": return "Create events to share for people to book on your calendar.New";
      case "appearance": return "See upcoming and past events booked through your event type links.";
      case "analytics": return "Configure times when you are available for bookings";
      case "settings": return "Manage settings for your profile";
      default: return "Create events to share for people to book on your calendar.New";
    }
  };
  return (
    <>
      <header>
        <div className={styles["head-container"]}>
          <p style={{ fontWeight: "bold", fontSize: "1.5em" }}>
            {getHeaderTitle()}
          </p>
          <p>{getHeader2()}</p>
          <div className={styles["share-container"]} onClick={handleShare}>
            <p>+ Add New Event </p>
          </div>
        </div>
      </header>
    </>
  );
}
