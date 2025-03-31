import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import share1 from "../assets/share1.png";
import youtube from "../assets/youtube.png";
import instagram from "../assets/instagram.png";
import facebook from "../assets/facebook.png";
import twitter from "../assets/twitter.png";
import fire from "../assets/fire.png";
import styles from "../pages/Profile.module.css";
import avater from "../assets/avater.png";
import shop from "../assets/pngwing.com (1).png";
import special1 from "../assets/special1.png";
import special2 from "../assets/special2.png";

export default function Profile({ VITE_URL }) {
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;
  const navigate = useNavigate();
  const { userID } = useParams();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLink, setIsLink] = useState(true);
  const [clickDetails, setClickDetails] = useState([]);

  const [clickCounts, setClickCounts] = useState({
    linkClicks: 0,
    shopClicks: 0,
    getConnectedClicks: 0,
    facebookClicks: 0,
    instagramClicks: 0,
    youtubeClicks: 0,
    otherClicks: 0,
  });

  // Function to detect the platform using the User-Agent string
  const getPlatform = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Win")) return "Windows";
    else if (userAgent.includes("Mac")) return "Mac";
    else if (userAgent.includes("Android")) return "Android";
    else if (userAgent.includes("iPhone") || userAgent.includes("iPad"))
      return "iOS";
      else if (userAgent.includes("Linux")) return "Linux";
    else return "Unknown";
  };

  // Function to detect the browser using the User-Agent string
  const getBrowser = () => {
    const userAgent = navigator.userAgent;
    if (userAgent.includes("Firefox")) return "Firefox";
    else if (userAgent.includes("Edg")) return "Edge";
    else if (userAgent.includes("Chrome")) return "Chrome";
    else if (userAgent.includes("Safari")) return "Safari";
    else return "Unknown";
  };

  const getData = async () => {
    try {
      const response = await axios.get(`${VITE_BACK_URL}/api/getUserProfile/${userID}`);
      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (error) {
      setError(error.response ? error.response.data : error.message);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClickCounts = async () => {
    try {
      const response = await axios.get(`${VITE_BACK_URL}/api/getCounts`, {
        params: { email: userData?.email },
      });
      if (response.status === 200) {
        const counts = response.data;
        setClickCounts({
          linkClicks: counts.linkClicks || 0,
          shopClicks: counts.shopClicks || 0,
          getConnectedClicks: counts.getConnectedClicks || 0,
          facebookClicks: counts.facebookClicks || 0,
          instagramClicks: counts.instagramClicks || 0,
          youtubeClicks: counts.youtubeClicks || 0,
          otherClicks: counts.otherClicks || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching click counts:", error);
    }
  };

  const fetchClickDetails = async () => {
    try {
      const response = await axios.get(`${VITE_BACK_URL}/api/getClickDetails/${userID}`);
      if (response.status === 200) {
        setClickDetails(response.data.clicks);
      }
    } catch (error) {
      console.error("Error fetching click details:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [userID]);

  useEffect(() => {
    if (userData) {
      fetchClickCounts();
      fetchClickDetails();
    }
  }, [userData]);

  const updateClickCount = async (type, app = null, url = null, linkId = null) => {
    const platform = getPlatform(); // Get the platform (e.g., Android, iOS, Windows)
    const browser = getBrowser(); // Get the browser (e.g., Chrome, Firefox)

    setClickCounts((prev) => {
      const newCounts = { ...prev };
      switch (type) {
        case "link":
          newCounts.linkClicks += 1;
          if (app) {
            switch (app) {
              case "facebook":
                newCounts.facebookClicks += 1;
                break;
              case "instagram":
                newCounts.instagramClicks += 1;
                break;
              case "youtube":
                newCounts.youtubeClicks += 1;
                break;
              default:
                newCounts.otherClicks += 1;
                break;
            }
          }
          break;
        case "shop":
          newCounts.shopClicks += 1;
          break;
        case "getConnected":
          newCounts.getConnectedClicks += 1;
          break;
        default:
          break;
      }
      return newCounts;
    });

    try {
      const response = await axios.post(`${VITE_BACK_URL}/api/setCounts`, {
        userID,
        type,
        app,
        platform,
        browser,
        url,
        linkId,
      });
      if (response.status === 200) {
        fetchClickDetails();
      }
    } catch (err) {
      console.error("Error tracking click:", err);
    }
  };

  const handleItemClick = (type, app, url, linkId, event) => {
    event.preventDefault();
    updateClickCount(type, app, url, linkId);
    window.open(url, "_blank");
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!userData) return <div>No profile data available</div>;

  const {
    username,
    selectedTheme,
    savedAddLinks,
    savedShopLinks,
    selectedColor,
    selectedLayout,
    selectedButtonStyle,
    buttonColor,
    buttonFontColor,
    selectedFont,
    profileImage,
  } = userData;

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
        return youtube;
    }
  };

  const handleShare = () => {
    const shareLink = `${VITE_URL}/profile/${userID}`;
    navigator.clipboard
      .writeText(shareLink)
      .then(() => alert("Profile link copied to clipboard!"))
      .catch((err) => console.error("Failed to copy link:", err));
  };

  const getLayoutClass = () => {
    switch (selectedLayout) {
      case "stack":
        return styles["link-item-contain"];
      case "grid":
        return styles["link-item-grid"];
      case "carousel":
        return styles["link-item-carousel"];
      default:
        return styles["link-item-contain"];
    }
  };

  const getLinkItemStyle = () => {
    switch (selectedButtonStyle) {
      case "fill1":
        return {
          backgroundColor: buttonColor || "black",
          border: "none",
          borderRadius: "0px",
          color: buttonFontColor || "white",
        };
      case "fill2":
        return {
          backgroundColor: buttonColor || "black",
          borderRadius: "8px",
          border: "none",
          color: buttonFontColor || "white",
        };
      case "fill3":
        return {
          backgroundColor: buttonColor || "black",
          borderRadius: "35px",
          border: "4px solid white",
          color: buttonFontColor || "white",
        };
      case "outline1":
        return {
          backgroundColor: "transparent",
          border: `2px solid ${buttonColor || "black"}`,
          borderRadius: "0px",
          color: buttonFontColor || "black",
        };
      case "outline2":
        return {
          backgroundColor: "transparent",
          borderRadius: "8px",
          border: `2px solid ${buttonColor || "black"}`,
          color: buttonFontColor || "black",
        };
      case "outline3":
        return {
          backgroundColor: "transparent",
          borderRadius: "35px",
          border: `2px solid ${buttonColor || "black"}`,
          color: buttonFontColor || "black",
        };
      case "hardShadow1":
        return {
          backgroundColor: buttonColor || "#C9C9C9",
          boxShadow: "5px 5px 0px black",
          borderRadius: "0px",
          color: buttonFontColor || "black",
        };
      case "hardShadow2":
        return {
          backgroundColor: buttonColor || "#C9C9C9",
          borderRadius: "8px",
          boxShadow: "5px 5px 0px black",
          color: buttonFontColor || "black",
        };
      case "hardShadow3":
        return {
          backgroundColor: buttonColor || "#C9C9C9",
          borderRadius: "35px",
          boxShadow: "5px 5px 0px black",
          color: buttonFontColor || "black",
        };
      case "softShadow1":
        return {
          backgroundColor: buttonColor || "white",
          boxShadow: "0 4px 8px #212529",
          border: "none",
          borderRadius: "0px",
          color: buttonFontColor || "black",
        };
      case "softShadow2":
        return {
          backgroundColor: buttonColor || "white",
          borderRadius: "8px",
          boxShadow: "0 4px 8px #212529",
          border: "none",
          color: buttonFontColor || "black",
        };
      case "softShadow3":
        return {
          backgroundColor: buttonColor || "white",
          borderRadius: "25px",
          boxShadow: "0 4px 8px #212529",
          border: "none",
          color: buttonFontColor || "black",
        };
      case "special1":
        return {
          backgroundImage: `url(${special1})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          border: "none",
          color: buttonFontColor || "black",
        };
      case "special2":
        return {
          backgroundImage: `url(${special2})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          border: "none",
          color: buttonFontColor || "black",
        };
      default:
        return {
          backgroundColor: buttonColor || "#C9C9C9",
          color: buttonFontColor || "black",
        };
    }
  };

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
        return { backgroundColor: "white", border: "none" };
    }
  };

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
        return { background: "white", borderRadius: "8px" };
    }
  };

  const getCombinedStyles = () => {
    const themeStyle = getThemeStyle();
    const buttonStyle = getLinkItemStyle();
    return { ...themeStyle, ...buttonStyle };
  };

  const getFontClass = () => {
    switch (selectedFont) {
      case "Poppins":
        return styles["poppins-font"];
      case "Roboto":
        return styles["roboto-font"];
      case "Open-Sans":
        return styles["open-sans-font"];
      case "Lato":
        return styles["lato-font"];
      case "Montserrat":
        return styles["montserrat-font"];
      default:
        return styles["poppins-font"];
    }
  };

  return (
    <div className={styles["center-container"]}>
      <div
        className={`${styles["phone-container"]} ${getFontClass()}`}
        style={{ backgroundColor: getThemeStyle().backgroundColor }}
      >
        <div
          style={{ background: selectedColor || "#342B26" }}
          className={styles["profile-info"]}
        >
          <button onClick={handleShare} className={styles["share-btn"]}>
            <img src={share1} alt="Share" />
          </button>
          <div className={styles["profile-photo"]}>
            <img src={profileImage || avater} alt="Profile" />
          </div>
          <p className={`${styles[getFontClass()]}`}>@{username}</p>
        </div>

        <div className={styles["button-contain"]}>
          <button
            className={`${styles["link-btn"]} ${
              isLink ? styles["active"] : ""
            }`}
            onClick={() => setIsLink(true)}
            style={{
              backgroundColor: isLink ? "#28A263" : "#F3F3F1",
              color: isLink ? "white" : "#6C6C6C",
            }}
          >
            Link
          </button>
          <button
            className={`${styles["shop-btn"]} ${
              !isLink ? styles["active"] : ""
            }`}
            onClick={() => setIsLink(false)}
            style={{
              backgroundColor: !isLink ? "#28A263" : "#F3F3F1",
              color: !isLink ? "white" : "#6C6C6C",
            }}
          >
            Shop
          </button>
        </div>

        <div
          className={getLayoutClass()}
          style={{ backgroundColor: getThemeStyle().backgroundColor }}
        >
          {Array.isArray(isLink ? savedAddLinks : savedShopLinks) &&
          (isLink ? savedAddLinks : savedShopLinks).length > 0 ? (
            (isLink ? savedAddLinks : savedShopLinks).map((item, index) => (
              <a
                key={index}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) =>
                  handleItemClick(
                    isLink ? "link" : "shop",
                    item.app,
                    item.url,
                    item._id,
                    e
                  )
                }
                className={
                  selectedLayout === "stack"
                    ? styles["link-item-div"]
                    : selectedLayout === "grid"
                    ? styles["link-item-div-grid"]
                    : selectedLayout === "carousel"
                    ? styles["link-item-div-carousel"]
                    : styles["link-item-div"] 
                }
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  ...getInnerDivStyle(),
                  ...getCombinedStyles(),
                }}
              >
                <div
                  className={
                    selectedLayout === "grid"
                      ? styles["icon-link-grid"]
                      : selectedLayout === "carousel"
                      ? styles["icon-link-carousel"]
                      : styles["icon-link"]
                  }
                >
                  <img
                    src={isLink ? getIcon(item.app) : item.image || shop}
                    alt={isLink ? item.app : "Shop"}
                  />
                </div>
                <div
                  className={
                    selectedLayout === "stack"
                      ? styles["link-text"]
                      : selectedLayout === "grid"
                      ? styles["link-text-grid"]
                      : styles["link-text"]
                  }
                  style={{ color: buttonFontColor || "inherit" }}
                >
                  <p>{item.title}</p>
                </div>
              </a>
            ))
          ) : (
            <p className={styles["no-links"]}>No links available</p>
          )}
        </div>

        <button
          onClick={() => {
            navigate("/");
            updateClickCount("getConnected");
          }}
          className={styles["get-connected"]}
        >
          Get connected
        </button>

        <div className={styles["logo-mobile"]}>
          <img src={fire} alt="Spark logo" />
          SPARK™
        </div>
      </div>
    </div>
  );
}