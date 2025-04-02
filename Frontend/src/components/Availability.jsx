import React, { useState, useEffect, useCallback } from "react";
import styles from "../components/Availability.module.css";
import avai from "../assets/avai.png";
import cal from "../assets/cal.png";
import copy from "../assets/copy.png";
import search from "../assets/search1.png";
import axios from "axios";
import toast from "react-hot-toast";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import useIsMobile from "../components/useIsMobile";

// Setup moment as the localizer for react-big-calendar
const localizer = momentLocalizer(moment);

export default function AnalyticsComponent() {
  const [activeTab, setActiveTab] = useState("availability");
  const isMobile = useIsMobile();
  const [isLoading, setIsLoading] = useState(true);
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;
  const [availabilityData, setAvailabilityData] = useState(() => {
    const savedData = localStorage.getItem("availabilityData");
    return savedData
      ? JSON.parse(savedData)
      : {
          Sun: { available: false, timings: [] },
          Mon: { available: true, timings: [{ from: "09:00", to: "17:00" }] },
          Tue: { available: true, timings: [{ from: "09:00", to: "17:00" }] },
          Wed: { available: true, timings: [{ from: "09:00", to: "17:00" }] },
          Thu: { available: true, timings: [{ from: "09:00", to: "17:00" }] },
          Fri: { available: true, timings: [{ from: "09:00", to: "17:00" }] },
          Sat: { available: true, timings: [] },
        };
  });

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]); // For search results
  const [searchQuery, setSearchQuery] = useState(""); // Search input state
  const [calendarView, setCalendarView] = useState("week"); // Default to week view
  const [calendarDate, setCalendarDate] = useState(new Date()); // Current date for navigation

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const timezone = "Indian Time Standard";

  // Convert availabilityData to backend format
  const toBackendFormat = (data) => ({
    weeklyHours: days.map((day) => ({
      day,
      available: data[day].available,
      timings: data[day].timings,
    })),
    timezone,
  });

  // Convert backend format to availabilityData
  const fromBackendFormat = (backendData) => {
    const result = {};
    days.forEach((day) => {
      const dayData = backendData.weeklyHours.find((d) => d.day === day) || {
        available: false,
        timings: [],
      };
      result[day] = {
        available: dayData.available,
        timings: dayData.timings || [],
      };
    });
    return result;
  };

  // Fetch availability data from backend
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          toast.error("User not logged in");
          setIsLoading(false);
          return;
        }

        const response = await axios.get(
          `${VITE_BACK_URL}/api/users/${userId}/availability`
        );
        if (response.data && response.data.weeklyHours) {
          setAvailabilityData(fromBackendFormat(response.data));
        }
      } catch (error) {
        console.error("Failed to fetch availability:", error);
        const savedData = localStorage.getItem("availabilityData");
        if (savedData) {
          setAvailabilityData(JSON.parse(savedData));
        }
        toast.error("Failed to fetch availability");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [VITE_BACK_URL]);

  // Fetch events for the calendar
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          toast.error("User not logged in");
          return;
        }

        const response = await axios.get(
          `${VITE_BACK_URL}/api/users/${userId}/bookingevents`
        );
        const { hostedEvents, participantEvents } = response.data;
        const now = new Date();

        // Categorize events
        const upcoming = [
          ...hostedEvents.filter(
            (event) =>
              new Date(event.dateTime) > now && event.status !== "canceled"
          ),
          ...participantEvents.filter(
            (event) =>
              event.participationStatus === "accepted" &&
              new Date(event.dateTime) > now
          ),
        ];

        const past = [
          ...hostedEvents.filter(
            (event) =>
              new Date(event.dateTime) <= now && event.status !== "canceled"
          ),
          ...participantEvents.filter(
            (event) =>
              new Date(event.dateTime) <= now &&
              event.participationStatus === "accepted"
          ),
        ];

        const rejected = [
          ...hostedEvents.filter((event) => event.status === "canceled"),
          ...participantEvents.filter(
            (event) =>
              event.participationStatus === "rejected" ||
              (event.participationStatus === "pending" &&
                new Date(event.dateTime) <= now)
          ),
        ];

        // Convert events to react-big-calendar format
        const calendarEvents = [
          ...upcoming.map((event) => ({
            id: event._id,
            title: event.eventTopic,
            start: new Date(event.dateTime),
            end: new Date(
              new Date(event.dateTime).getTime() +
                event.duration * 60 * 60 * 1000
            ),
            type: "upcoming",
          })),
          ...past.map((event) => ({
            id: event._id,
            title: event.eventTopic,
            start: new Date(event.dateTime),
            end: new Date(
              new Date(event.dateTime).getTime() +
                event.duration * 60 * 60 * 1000
            ),
            type: "past",
          })),
          ...rejected.map((event) => ({
            id: event._id,
            title: event.eventTopic,
            start: new Date(event.dateTime),
            end: new Date(
              new Date(event.dateTime).getTime() +
                event.duration * 60 * 60 * 1000
            ),
            type: "rejected",
          })),
        ];

        setCalendarEvents(calendarEvents);
        setFilteredEvents(calendarEvents); // Initialize filtered events
      } catch (error) {
        console.error("Failed to fetch events:", error);
        toast.error("Failed to fetch events");
      }
    };

    if (activeTab === "calenderView") {
      fetchEvents();
    }
  }, [activeTab, VITE_BACK_URL]);

  // Filter events based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredEvents(calendarEvents);
    } else {
      const filtered = calendarEvents.filter((event) =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredEvents(filtered);
    }
  }, [searchQuery, calendarEvents]);

  // Debounced save function
  const saveAvailability = useCallback(async () => {
    const userId = localStorage.getItem("userID");
    if (!userId) {
      toast.error("User not logged in");
      return;
    }

    try {
      const backendData = toBackendFormat(availabilityData);
      const response = await axios.put(
        `${VITE_BACK_URL}/api/users/${userId}/availability`,
        backendData
      );
      localStorage.setItem(
        "availabilityData",
        JSON.stringify(availabilityData)
      );
      if (
        JSON.stringify(response.data.weeklyHours) !==
          JSON.stringify(backendData.weeklyHours) ||
        response.data.timezone !== backendData.timezone
      ) {
        console.warn("Backend data does not match sent data:", response.data);
        toast.error("Availability saved, but data mismatch detected");
        const refetchResponse = await axios.get(
          `${VITE_BACK_URL}/api/users/${userId}/availability`
        );
        setAvailabilityData(fromBackendFormat(refetchResponse.data));
      } else {
        toast.success("Availability saved successfully");
      }
    } catch (error) {
      console.error("Failed to save availability:", error);
      toast.error(
        `Failed to save availability: ${
          error.response?.data?.error || error.message
        }`
      );
    }
  }, [availabilityData, VITE_BACK_URL]);

  // Save to backend with debounce
  useEffect(() => {
    if (isLoading) return;

    const debounceSave = setTimeout(() => {
      saveAvailability();
    }, 1000);

    return () => clearTimeout(debounceSave);
  }, [availabilityData, isLoading, saveAvailability]);

  const handleDayAvailabilityChange = (day) => {
    setAvailabilityData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day].available,
        timings: !prev[day].available ? [{ from: "09:00", to: "17:00" }] : [],
      },
    }));
  };

  const handleAddTiming = (day) => {
    setAvailabilityData((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        timings: [...prev[day].timings, { from: "09:00", to: "17:00" }],
      },
    }));
  };

  const handleRemoveTiming = (day, index) => {
    setAvailabilityData((prev) => {
      const newTimings = [...prev[day].timings];
      newTimings.splice(index, 1);
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timings: newTimings,
        },
      };
    });
  };

  const handleTimeChange = (day, index, field, value) => {
    setAvailabilityData((prev) => {
      const newTimings = [...prev[day].timings];
      newTimings[index] = { ...newTimings[index], [field]: value };
      return {
        ...prev,
        [day]: {
          ...prev[day],
          timings: newTimings,
        },
      };
    });
  };

  const handleCopyPreviousDay = (currentDay) => {
    const prevDayIndex = (days.indexOf(currentDay) - 1 + 7) % 7;
    const prevDay = days[prevDayIndex];

    setAvailabilityData((prev) => ({
      ...prev,
      [currentDay]: {
        ...prev[currentDay],
        timings: [...prev[prevDay].timings],
      },
    }));
  };

  // Custom event styling for react-big-calendar
  const eventStyleGetter = (event) => {
    let backgroundColor;
    switch (event.type) {
      case "upcoming":
        backgroundColor = "#90EE90"; // Green for upcoming
        break;
      case "past":
        backgroundColor = "#ADD8E6"; // Blue for past
        break;
      case "rejected":
        backgroundColor = "#D3D3D3"; // Grey for rejected
        break;
      default:
        backgroundColor = "#3174ad"; // Default color
    }
    return {
      style: {
        backgroundColor,
        borderRadius: "5px",
        opacity: 0.8,
        color: "black",
        border: "0px",
        display: "block",
      },
    };
  };

  // Custom time slot wrapper to show hours on both sides
  const TimeSlotWrapper = ({ children }) => {
    return <div style={{ position: "relative" }}>{children}</div>;
  };

  // Custom date header to match the screenshot
  const CustomDateHeader = ({ label, date }) => {
    const dayName = moment(date).format("ddd").toUpperCase();
    const dayNumber = moment(date).format("D");
    return (
      <div style={{ textAlign: "center", padding: "5px 0" }}>
        <div style={{ fontSize: "12px", color: "#666", marginBottom: "2px" }}>
          {dayName}
        </div>
        <div style={{ fontSize: "16px", fontWeight: "bold", color: "#000" }}>
          {dayNumber}
        </div>
      </div>
    );
  };

  // Handle calendar view change
  const handleViewChange = (view) => {
    setCalendarView(view);
  };

  // Handle date navigation
  const handleNavigate = (newDate) => {
    setCalendarDate(newDate);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) {
    return <div>Loading availability...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        <div
          className={`${styles.tab1} ${
            activeTab === "availability" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("availability")}
        >
          <img src={avai} alt="Availability" />
          <p>Availability</p>
        </div>
        <div
          className={`${styles.tab2} ${
            activeTab === "calenderView" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("calenderView")}
        >
          <img src={cal} alt="Calendar View" />
          <p>Calendar View</p>
        </div>
      </div>

      {activeTab === "availability" && (
        <div className={styles.availability}>
          <div className={styles.p11}>
            <div className={styles.activityCon1}>
              <p className={styles.activity1}>Activity</p>
              <p className={styles.eventType1}>Event type</p>
            </div>
            <div className={styles.activityCon2}>
              <p className={styles.activity2}>Time Zone</p>
              <p className={styles.eventType2}>Indian Time Standard</p>
            </div>
          </div>
          <div className={styles.line}></div>
          <h4>Weekly hours</h4>
          <div className={styles.availableCon}>
            {days.map((day) => (
              <div key={day} className={styles.timingCon}>
                <div style={{ display: "flex", columnGap: "4%", width: "35%" }}>
                  <input
                    style={{ height: "20px", width: "20px" }}
                    type="checkbox"
                    checked={availabilityData[day].available}
                    onChange={() => handleDayAvailabilityChange(day)}
                  />
                  <p>{day}</p>
                  <p style={{ marginLeft: "5%" }}>
                    {availabilityData[day].available
                      ? "Available"
                      : "Unavailable"}
                  </p>
                </div>

                {availabilityData[day].available && (
                  <>
                    <div className={styles.setTimingCon}>
                      {availabilityData[day].timings.map((timing, index) => (
                        <React.Fragment key={index}>
                          <input
                            type="time"
                            value={timing.from}
                            onChange={(e) =>
                              handleTimeChange(
                                day,
                                index,
                                "from",
                                e.target.value
                              )
                            }
                            className={styles.setFromTiming}
                            style={index > 0 ? { marginLeft: "6%" } : {}}
                          />
                          <p style={{ fontSize: "1.2em", color: "grey" }}>-</p>
                          <input
                            type="time"
                            value={timing.to}
                            onChange={(e) =>
                              handleTimeChange(day, index, "to", e.target.value)
                            }
                            className={styles.setToTiming}
                            style={index > 0 ? { marginLeft: "" } : {}}
                          />
                          {index > 0 && (
                            <p
                              style={{
                                fontSize: "1.2em",
                                color: "grey",
                                cursor: "pointer",
                              }}
                              onClick={() => handleRemoveTiming(day, index)}
                            >
                              ×
                            </p>
                          )}
                        </React.Fragment>
                      ))}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        width: "10%",
                        justifyContent: "center",
                        columnGap: "12%",
                      }}
                    >
                      <span
                        style={{
                          color: "grey",
                          fontSize: "2em",
                          height: "20px",
                          width: "50%",
                          marginTop: "-25%",
                          cursor: "pointer",
                        }}
                        onClick={() => handleAddTiming(day)}
                      >
                        +
                      </span>
                      <img
                        style={{
                          width: "50%",
                          height: "20px",
                          cursor: "pointer",
                        }}
                        src={copy}
                        alt="Copy previous day"
                        onClick={() => handleCopyPreviousDay(day)}
                      />
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "calenderView" && (
        <div className={styles.calenderView}>
          <div className={styles.p1}>
            <div className={styles.activityCon}>
              <p className={styles.activity}>Activity</p>
              <p className={styles.eventType}>Event type</p>
            </div>
            <div className={styles.activityCon}>
              <p className={styles.activity}>Time Zone</p>
              <p className={styles.eventType}>Indian Time Standard</p>
            </div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.allCon}>
            <button
              style={{
                width: "10%",
                background: calendarView === "day" ? "#007bff" : "transparent",
                color: calendarView === "day" ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleViewChange("day")}
            >
              Day
            </button>
            <button
              style={{
                width: "15%",
                background: calendarView === "week" ? "#007bff" : "transparent",
                color: calendarView === "week" ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleViewChange("week")}
            >
              Week
            </button>
            <button
              style={{
                width: "15%",
                background:
                  calendarView === "month" ? "#007bff" : "transparent",
                color: calendarView === "month" ? "white" : "black",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
              onClick={() => handleViewChange("month")}
            >
              Month
            </button>
            <div className={styles.searchCon}>
              <img
                style={{ width: "15%", height: "90%" }}
                src={search}
                alt=""
              />
              <input
                style={{
                  border: "none",
                  background: "transparent",
                  padding: "0.5%",
                  outline: "none",
                  boxShadow: "none",
                  appearance: "none",
                  width: "100%",
                }}
                placeholder="Search by event topic"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
          </div>
          <div
            style={{
              height: "2000px",
              width: "100%",
              overflowX: "auto",
              overflowY: "auto",
            }}
          >
            <style>
              {`
                /* Increase the height of each time slot row */
                .rbc-timeslot-group {
                  min-height: 7em !important;
                  height: 7em !important;
                }

                /* Ensure the time slot itself matches the height */
                .rbc-time-slot {
                  height: 7em !important; /* Changed from 7em to 80px for consistency */
                  
                }

                /* Adjust the event height to fit the larger rows */
                .rbc-event {
                  padding:2px;
                  font-size: 0.8em;
                  
                  width:10em;
                }

                /* Ensure the time gutter (left side) aligns with the increased row height */
                .rbc-time-gutter .rbc-timeslot-group {
                  border-right: 1px solid #ddd;
                }

                /* Style the time labels to align properly */
                .rbc-label {
                  font-size: 12px;
                  color: #666;
                  padding-top: 30px; /* Adjusted to center in 80px row */
                }

                /* Style the calendar container */
                .rbc-calendar {
                  font-family: inherit;
                }

                /* Style the day headers */
                .rbc-header {
                  background: #f9f9f9;
                  border-bottom: 1px solid #ddd;
                  padding: 5px 0;
                  font-size: 0.9em;
                  min-height: 50px !important;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
            
                }

                /* Style the toolbar */
                .rbc-toolbar {
              
                  background: transparent;
                  
                }

                /* Ensure the calendar grid cells have proper borders */
                .rbc-time-content > * + * > * {
                  border-left: 1px solid #ddd;
                  
                   
                }

                /* Style the time slot background */

                .rbc-timeslot-group {
                
                  background: #fff;
                 
                }
              `}
            </style>
            <Calendar
              localizer={localizer}
              events={filteredEvents} // Use filtered events for display
              startAccessor="start"
              endAccessor="end"
              style={{
                height: "100%",
                width: isMobile ? "200%" : "100%",
                marginTop: "-0.6%",
              }}
              view={calendarView}
              onView={handleViewChange}
              date={calendarDate}
              onNavigate={handleNavigate}
              eventPropGetter={eventStyleGetter}
              components={{
                timeSlotWrapper: TimeSlotWrapper,
                dateCellWrapper: ({ children }) => (
                  <div style={{ position: "relative" }}>{children}</div>
                ),
                timeGutterHeader: () => null, // Hide default time gutter header
                toolbar: ({ onNavigate, label }) => (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "0.7%",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <button
                        onClick={() => onNavigate("PREV")}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "1em",
                        }}
                      >
                        &lt;
                      </button>
                      <span style={{ fontSize: "1em" }}>{label}</span>
                      <button
                        onClick={() => onNavigate("NEXT")}
                        style={{
                          border: "none",
                          background: "transparent",
                          cursor: "pointer",
                          fontSize: "1em",
                        }}
                      >
                        &gt;
                      </button>
                    </div>
                    <button
                      onClick={() => onNavigate("TODAY")}
                      style={{
                        border: "1px solid #ccc",
                        background: "transparent",
                        borderRadius: "5px",
                        padding: "5px 10px",
                        cursor: "pointer",
                        fontSize: "1em",
                      }}
                    >
                      Today
                    </button>
                  </div>
                ),
                week: {
                  header: CustomDateHeader,
                },
              }}
              formats={{
                timeGutterFormat: (date, culture, localizer) =>
                  localizer.format(date, "h A", culture), // e.g., "9 AM"
              }}
              step={60} // 1-hour steps
              timeslots={1} // 1 slot per hour
              min={new Date(0, 0, 0, 0, 0)} // Start at 12 AM
              max={new Date(0, 0, 0, 23, 59)} // End at 11:59 PM
              showMultiDayTimes
            />
          </div>
        </div>
      )}
    </div>
  );
}
