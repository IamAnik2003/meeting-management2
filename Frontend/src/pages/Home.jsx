import React from "react";
import Navbar from "../components/Navbar";
import useIsMobile from "../components/useIsMobile";
import styles from "./Home.module.css"; // Import the CSS module
import i1 from "../assets/i1.png";
import audiomack from "../assets/Audiomack.png";
import bandsintown from "../assets/Bandsintown.png";
import bonfire from "../assets/Bonfire.png";
import books from "../assets/Books.png";
import bmg from "../assets/bmg.png";
import cameo from "../assets/Cameo.png";
import clubhouse from "../assets/Clubhouse.png";
import community from "../assets/Community.png";
import contactDetails from "../assets/ContactDetails.png";
import autoLayoutHorizontal from "../assets/Auto Layout Horizontal.png";
import { useNavigate } from "react-router-dom";
import screen1 from "../assets/screen1.png";

export default function Home() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const platformsData = [
    {
      src: audiomack,
      title: "Audiomack",
      description: "Add an Audiomack player to your Linktree",
    },
    {
      src: bandsintown,
      title: "Bandsintown",
      description: "Drive ticket sales by listing your events",
    },
    {
      src: bonfire,
      title: "Bonfire",
      description: "Display and sell your custom merch",
    },
    {
      src: books,
      title: "Books",
      description: "Promote books on your Linktree",
    },
    {
      src: bmg,
      title: "Buy Me A Gift",
      description: "Let visitors support you with a small gift",
    },
    {
      src: cameo,
      title: "Cameo",
      description: "Make impossible fan connections possible",
    },
    {
      src: clubhouse,
      title: "Clubhouse",
      description: "Let your community in on the conversation",
    },
    {
      src: community,
      title: "Community",
      description: "Build an SMS subscriber list",
    },
    {
      src: contactDetails,
      title: "Contact Details",
      description: "Easily share downloadable contact details",
    },
  ];

  const testimonials = [
    {
      quote: "Amazing tool! Saved me months",
      description:
        "This is a placeholder for your testimonials and what your client has to say, put them here and make sure its 100% true and meaningful.",
      name: "John Master",
      role: "Director, Spark.com",
    },
    // Add more testimonials as needed
  ];

  const footerLinks = [
    "About Spark",
    "Careers",
    "Terms and Conditions",
    "Blog",
    "Getting Started",
    "Privacy Policy",
    "Press",
    "Features and How-Tos",
    "Cookie Notice",
    "Social Good",
    "FAQs",
    "Trust Center",
    "Contact",
    "Report a Violation",
  ];

  return (
    <>
      <div className={styles.home}>
        <Navbar />
        <div className={styles.flexitems}>
          <h1>CNNC–Easy Scheduling Ahead</h1>
          <button className={styles.btnsign1} onClick={() => navigate("/register")}>
            Sign up free
          </button>
          <img className={styles.screen1} src={screen1} alt="Scheduling Interface" />
          <h3>Simplified scheduling for you and your team</h3>
          <p>
            CNNCT eliminates the back-and-forth of scheduling meetings so you can focus on what matters. Set your availability, share your link, and let others book time with you instantly.
          </p>
          <div className={styles.child7}>
            <p style={isMobile ? { width: "100%", fontSize: "1.5em" } : {}}>
              Here's what our <span style={{ color: "#1877F2" }}>customer </span>
              has to say
            </p>
            {!isMobile && (
              <div style={{ width: "26vw", display: "flex", height: "12vh" }}>
                <img
                  style={{ width: "10%", height: "38%", alignSelf: "center" }}
                  src={i1}
                  alt="Customer Icon"
                />
                <p style={{ fontSize: "1.2em", height: "100%", width: "100%" }}>
                  [short description goes in here] lorem ipsum is a placeholder text
                  to demonstrate.
                </p>
              </div>
            )}
            <button
              className={styles.readStoriesBtn}
              style={
                !isMobile
                  ? {
                      width: "15%",
                      height: "22%",
                      borderRadius: "25px",
                      marginTop: "-5%",
                      fontSize: "0.8em",
                      background: "transparent",
                      border: "2px solid #1877F2",
                      color: "#1877F2",
                      marginLeft: "3%",
                    }
                  : {
                      width: "50%",
                      height: "25%",
                      borderRadius: "25px",
                      marginTop: "-5%",
                      fontSize: "0.8em",
                      background: "transparent",
                      border: "2px solid #1877F2",
                      color: "#1DA35E",
                      marginLeft: "25%",
                    }
              }
            >
              Read customer stories
            </button>
            </div>
          <div className={styles.flex4}>
            <div className={styles.child8}>
              <p style={{fontSize:"1.2em"}}>Amazing tool! Saved me months</p>
              <p style={{fontSize:"0.8em"}}>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "12vw",
                  height: "8vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                  
                } : {display:"none"}}
              >
                <div
                  style={{
                    backgroundColor: "#1877F2",
                    width: "26%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                <p style={{ marginTop: "-35%",marginLeft:"20%" }}>John Master</p>
                <p style={{ marginLeft: "25%", marginTop: "-19%",fontSize:"0.8em" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
            <div className={styles.child9}>
            <p style={{fontSize:"1.2em"}}>Amazing tool! Saved me months</p>
            <p style={{fontSize:"0.8em"}}>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "12vw",
                  height: "8vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "65vw",
                  height: "20vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1877F2",
                    width: "23%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
               <p style={{ marginTop: "-35%",marginLeft:"20%" }}>John Master</p>
               <p style={{ marginLeft: "25%", marginTop: "-19%",fontSize:"0.8em" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
            <div className={styles.child9}>
            <p style={{fontSize:"1.2em"}}>Amazing tool! Saved me months</p>
            <p style={{fontSize:"0.8em"}}>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "12vw",
                  height: "8vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "53vw",
                  height: "18vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1877F2",
                    width: "30%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                 <p style={{ marginTop: "-35%",marginLeft:"24%" }}>John Master</p>
                 <p style={{ marginLeft: "32%", marginTop: "-19%",fontSize:"0.8em" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
            <div className={styles.child8}>
              <p style={{fontSize:"1.2em"}}>Amazing tool! Saved me months</p>
              <p style={{fontSize:"0.8em"}}>
                This is a placeholder for your testimonials and what your client has
                to say, put them here and make sure its 100% true and meaningful.
              </p>
              <div
                style={!isMobile ? {
                  width: "12vw",
                  height: "8vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                } : {
                  width: "65vw",
                  height: "15vh",
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  rowGap: "10%",
                  columnGap: "6%",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#1877F2",
                    width: "23%",
                    height: "75%",
                    borderRadius: "50%",
                  }}
                ></div>
                <p style={{ marginTop: "-35%",marginLeft:"20%" }}>John Master</p>
                <p style={{ marginLeft: "25%", marginTop: "-19%",fontSize:"0.8em" }}>
                  Director, Spark.com
                </p>
              </div>
            </div>
          </div>
          <div>
           
          </div>
          
            <h3 style={isMobile ? { fontSize: "1.6em" } : {}}>
              All Link Apps and Integrations
            </h3>
          
          <div className={styles.child10}>
            {platformsData.map((platform, index) => (
              <div className={styles.inchild} key={index}>
                <img
                  style={{ width: "17%", height: "60%", alignSelf: "center" }}
                  src={platform.src}
                  alt={platform.title}
                />
                <h4 style={{marginTop:"2%"}}>{platform.title}</h4>
                <p style={{ marginLeft: "17%", marginTop: "-12%" ,fontSize:"0.65em"}}>
                  {platform.description}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.flex5}>
            <div className={styles.child11}>
              <button
                className={styles.loginBtn}
                onClick={() => navigate("/login")}
              >
                {!isMobile ? "Log in" : "Admin"}
              </button>
              <button
                className={styles.signupbtn2}
                onClick={() => navigate("/register")}
              >
                Sign up free
              </button>
              <div className={styles.inchild2}>
                {footerLinks.map((link, index) => (
                  <p key={index} style={isMobile ? { fontSize: "0.8em", width: "100%", marginTop: "-8%" } : {}}>
                    {link}
                  </p>
                ))}
              </div>
              {!isMobile && (
                <p className={styles.inchild3}>
                  We acknowledge the Traditional Custodians of the land on which our
                  office stands, The Wurundjeri people of the Kulin Nation, and pay
                  our respects to Elders past, present and emerging.
                </p>
              )}
              <img
                className={styles.footerLogo}
                src={autoLayoutHorizontal}
                alt="Footer Logo"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}