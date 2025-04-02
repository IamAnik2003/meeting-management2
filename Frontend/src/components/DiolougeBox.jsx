import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../components/DiolougeBox.module.css";
import avatar from "../assets/avater.png";
import toast from "react-hot-toast";
import useIsMobile from "../components/useIsMobile";


export default function DiolougeBox({ setIsDiolougeOpen, editingEvent }) {
  const userEmail = localStorage.getItem("email");
  const userId = localStorage.getItem("userID");
  const VITE_BACK_URL = import.meta.env.VITE_BACK_URL;
  const isMobile = useIsMobile();
  
  const [userAvailability, setUserAvailability] = useState(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Fetch user availability on component mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get(`${VITE_BACK_URL}/api/users/${userId}/availability`);
        setUserAvailability(response.data);
      } catch (error) {
        console.error("Error fetching availability:", error);
      }
    };

    if (userId) {
      fetchAvailability();
    }
  }, [userId, VITE_BACK_URL]);

  function formatTimeForInput(dateTime) {
    if (!dateTime) return "02:38";
    const date = new Date(dateTime);
    const hours = date.getHours() % 12 || 12;
    const minutes = date.getMinutes();
    return `${hours}:${minutes.toString().padStart(2, '0')}`;
  }

  const [formData, setFormData] = useState(editingEvent ? {
    eventTopic: editingEvent.eventTopic || "",
    password: editingEvent.password || "",
    hostName: editingEvent.hostName || "",
    description: editingEvent.description || "",
    date: editingEvent.dateTime ? editingEvent.dateTime.split('T')[0] : "",
    time: editingEvent.dateTime ? formatTimeForInput(editingEvent.dateTime) : "02:38",
    ampm: editingEvent.dateTime ? (new Date(editingEvent.dateTime).getHours() >= 12 ? 'pm' : 'am') : "pm",
    timezone: editingEvent.timezone || "UTC+5:00",
    duration: editingEvent.duration ? editingEvent.duration.toString() : "1",
    bannerColor: editingEvent.bannerColor || "#342B26",
    link: editingEvent.meetingLink || "",
    emails: editingEvent.participants 
      ? editingEvent.participants.map(p => p.email).join(', ')
      : userEmail || "",
    teamName: editingEvent.teamName || "Team A Meeting-1"
  } : {
    eventTopic: "",
    password: "",
    hostName: "",
    description: "",
    date: "",
    time: "02:38",
    ampm: "pm",
    timezone: "UTC+5:00",
    duration: "1",
    bannerColor: "#342B26",
    link: "",
    emails: userEmail || "",
    teamName: "Team A Meeting-1"
  });

  const [onFirstSave, setOnFirstSave] = useState(false);
  const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditingTeamName, setIsEditingTeamName] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTeamNameChange = (e) => {
    setFormData(prev => ({ ...prev, teamName: e.target.value }));
  };

  // Helper function to check if the selected date and time are in the past
  const isDateTimeInPast = () => {
    if (!formData.date || !formData.time) return false; // If date or time is not set, let other validations handle it

    const [hours, minutes] = formData.time.split(':').map(Number);
    let adjustedHours = hours;
    if (formData.ampm === 'pm' && hours < 12) adjustedHours += 12;
    if (formData.ampm === 'am' && hours === 12) adjustedHours = 0;

    const selectedDateTime = new Date(formData.date);
    selectedDateTime.setHours(adjustedHours, minutes, 0, 0);

    const now = new Date();
    return selectedDateTime < now;
  };

  const checkTimeSlotAvailability = () => {
    if (!userAvailability || !userAvailability.weeklyHours || !formData.date || !formData.time) {
      return true; // No availability data or incomplete form data
    }

    const selectedDate = new Date(formData.date);
    const dayOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][selectedDate.getDay()];
    const dayAvailability = userAvailability.weeklyHours.find(d => d.day === dayOfWeek);

    if (!dayAvailability || !dayAvailability.available) {
      return false;
    }

    const [hours, minutes] = formData.time.split(':').map(Number);
    let startHour = hours;
    if (formData.ampm === 'pm' && hours < 12) startHour += 12;
    if (formData.ampm === 'am' && hours === 12) startHour = 0;

    const endHour = startHour + parseInt(formData.duration);
    const eventStartMinutes = startHour * 60 + minutes;
    const eventEndMinutes = endHour * 60 + minutes;

    // Check if any availability slot covers the event time
    return dayAvailability.timings.some(timing => {
      const [fromHour, fromMinute] = timing.from.split(':').map(Number);
      const [toHour, toMinute] = timing.to.split(':').map(Number);
      
      const availableStart = fromHour * 60 + fromMinute;
      const availableEnd = toHour * 60 + toMinute;

      return eventStartMinutes >= availableStart && eventEndMinutes <= availableEnd;
    });
  };

  const handleSubmitSave1 = (e) => {
    e.preventDefault();
    
    // Validate that the date and time are not in the past
    if (isDateTimeInPast()) {
      toast.error("You cannot create or edit an event with a past date or time. Please select a future date and time.");
      return;
    }

    // Check availability before proceeding to second form
    if (userAvailability && formData.date && formData.time) {
      const isAvailable = checkTimeSlotAvailability();
      if (!isAvailable) {
        toast.error("You're not available at the selected time. Please choose another time.");
        return;
      }
    }
    
    setOnFirstSave(true);
  };

  const handleSubmitSave2 = async (e) => {
    e.preventDefault();
    setIsLoading(true);
  
    try {
      if (!userId) throw new Error("User not authenticated");
      if (!userEmail) throw new Error("Host email not found");

      // Validate that the date and time are not in the past
      if (isDateTimeInPast()) {
        throw new Error("You cannot create or edit an event with a past date or time. Please select a future date and time.");
      }

      // Validate required fields
      const requiredFields = {
        eventTopic: formData.eventTopic,
        hostName: formData.hostName,
        date: formData.date,
        time: formData.time,
        link: formData.link,
        emails: formData.emails
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => !value)
        .map(([key]) => key);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Final availability check before submission
      if (userAvailability && !checkTimeSlotAvailability()) {
        throw new Error("You're not available at the selected time. Please choose another time.");
      }

      // Convert date and time to ISO format
      const [hours, minutes] = formData.time.split(':').map(Number);
      let adjustedHours = hours;
      if (formData.ampm === 'pm' && hours < 12) adjustedHours += 12;
      if (formData.ampm === 'am' && hours === 12) adjustedHours = 0;
      
      const isoDateTime = `${formData.date}T${adjustedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

      // Process participant emails
      const allEmails = formData.emails
        .split(',')
        .map(email => email.trim())
        .filter(email => {
          const isValid = email.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
          if (!isValid && email.length > 0) {
            toast.error(`Invalid email: ${email}`);
          }
          return isValid;
        });

      if (!allEmails.includes(userEmail)) {
        allEmails.unshift(userEmail);
      }

      const participants = allEmails.map(email => ({
        email,
        isHost: email === userEmail
      }));

      const eventData = {
        userId,
        eventTopic: formData.eventTopic,
        hostName: formData.hostName,
        description: formData.description,
        date: formData.date,
        time: formData.time,
        ampm: formData.ampm,
        timezone: formData.timezone,
        duration: Number(formData.duration),
        bannerColor: formData.bannerColor,
        meetingLink: formData.link,
        participants,
        password: formData.password,
        teamName: formData.teamName,
        dateTime: isoDateTime,
        createdBy: userId
      };

      const isUpdating = Boolean(editingEvent);
      const response = await axios({
        method: isUpdating ? 'put' : 'post',
        url: isUpdating 
          ? `${VITE_BACK_URL}/api/events/${editingEvent._id}`
          : `${VITE_BACK_URL}/api/events`,
        data: eventData,
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast.success(isUpdating ? 'Event updated!' : 'Event created!');
      setIsDiolougeOpen(false);
      
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.response?.data?.message || err.message || 
                 (editingEvent ? 'Update failed' : 'Creation failed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorSelection = (color) => {
    setFormData(prev => ({ ...prev, bannerColor: color }));
    setIsColorPickerVisible(false);
  };

  return (
    <div className={styles.diolouge}>
      <h3>{editingEvent ? "Edit Event" : "Add Event"}</h3>
      <div style={{ width: "98%", height: "0.4%", background: "#B6B6B6", position: "absolute", top: "15%" }}></div>
      
      {!onFirstSave ? (
        <form onSubmit={handleSubmitSave1}>
          <div className={styles.firstparent}>
            <div className={styles.labelsContainer}>
              <label htmlFor="eventTopic">
                Event Topic <span style={{ color: "#D92C2C" }}>*</span>
              </label>
              <label style={{ marginLeft: "-6%" }} htmlFor="password">Password</label>
              <label htmlFor="hostName">
                Host name <span style={{ color: "#D92C2C" }}>*</span>
              </label>
              <label style={{ marginLeft: "-2%" }} htmlFor="description">Description</label>
            </div>
            <div className={styles.inputsContainer}>
              <input
                placeholder="Set a conference topic before it starts"
                className={styles.inputs}
                type="text"
                id="eventTopic"
                name="eventTopic"
                value={formData.eventTopic}
                onChange={handleChange}
                required
              />
              <input
                placeholder="Password"
                className={styles.inputs}
                type="text"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
              <input
                className={styles.inputs}
                type="text"
                id="hostName"
                name="hostName"
                value={formData.hostName}
                onChange={handleChange}
                required
              />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div style={{ width: "100%", height: "0.4%", background: "#B6B6B6", marginTop: "1%" }}></div>
          
          <div className={styles.secondparent}>
            <div className={styles.labelsContainer2}>
              <label style={{ marginLeft: "8%" }} htmlFor="date">
                Date and time <span style={{ color: "#D92C2C" }}>*</span>
              </label>
              <label htmlFor="duration">Set duration</label>
            </div>
            <div className={styles.inputsContainer2}>
              <input
                type="date"
                className={styles.date}
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
              <input
                type="time"
                className={styles.time}
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
              />
              <select
                className={styles.ampm}
                id="ampm"
                name="ampm"
                value={formData.ampm}
                onChange={handleChange}
              >
                <option value="am">AM</option>
                <option value="pm">PM</option>
              </select>
              <select
                className={styles.timezone}
                id="timezone"
                name="timezone"
                value={formData.timezone}
                onChange={handleChange}
              >
                <option value="UTC+5:00">(UTC+5:00) Delhi</option>
                <option value="UTC+0:00">(UTC+0:00) London</option>
                <option value="UTC-5:00">(UTC-5:00) New York</option>
              </select>
              <select
                className={styles.duration}
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
              </select>
            </div>
            {!isMobile?(  <div style={{position:"absolute",top:"90%",left:"35%",display:"flex",width:"40%",height:"8%"}}>
              <button 
                type="button"
                className={styles.cancel} 
                onClick={() => setIsDiolougeOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.save} 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>):  <div style={{position:"absolute",top:"90%",left:"35%",display:"flex",width:"50%",height:"8%"}}>
              <button 
                type="button"
                className={styles.cancel} 
                onClick={() => setIsDiolougeOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.save} 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>}
          </div>
        </form>
      ) : (
        <form onSubmit={handleSubmitSave2}>
          <h3 style={{
            width: "100%",
            textAlign: "left",
            marginTop: "0%",
            color: "black",
            fontSize: "1.4em",
            fontWeight: "600",
          }}>
            Banner
          </h3>
          <div className={styles.bannerContainer}>
            <div
              className={styles.banner}
              style={{ backgroundColor: formData.bannerColor }}
            >
              <div className={styles.profileOnBanner}>
                <img src={avatar} alt="Profile" />
              </div>
              {isEditingTeamName ? (
                <input
                  type="text"
                  value={formData.teamName}
                  onChange={handleTeamNameChange}
                  onBlur={() => setIsEditingTeamName(false)}
                  autoFocus
                  style={{
                    background: "transparent",
                    border: "none",
                    borderBottom: "1px solid white",
                    color: "white",
                    fontSize: "1.2em",
                    outline: "none",
                    textAlign: "center"
                  }}
                />
              ) : (
                <h3 onClick={() => setIsEditingTeamName(true)}>
                  {formData.teamName} ✎
                </h3>
              )}
            </div>
            
            <div className={styles.colorDiv}>
              <p style={{ fontSize: "0.8em",width:"100%"}}>Custom Background Color</p>
              <div className={styles.colors}>
                <div
                  className={`${styles.colorCircle} ${styles.colorPic1}`}
                  onClick={() => handleColorSelection("#EF6500")}
                ></div>
                <div
                  className={`${styles.colorCircle} ${styles.colorPic2}`}
                  onClick={() => handleColorSelection("#ffffff")}
                ></div>
                <div
                  className={`${styles.colorCircle} ${styles.colorPic3}`}
                  onClick={() => handleColorSelection("#000000")}
                ></div>
              </div>
              <div className={styles.colorPickerContainer}>
                <div
                  className={styles.demoColorDiv}
                  style={{ backgroundColor: formData.bannerColor }}
                ></div>
                <input
                  type="color"
                  id="color-input"
                  name="bannerColor"
                  value={formData.bannerColor}
                  onChange={(e) => handleColorSelection(e.target.value)}
                  style={{ display: isColorPickerVisible ? "block" : "none" }}
                />
                <label
                  htmlFor="color-input"
                  className={styles.colorPicker}
                  onClick={() => setIsColorPickerVisible(!isColorPickerVisible)}
                >
                  <p>{formData.bannerColor}</p>
                </label>
              </div>
            </div>
            
            <div style={{
              width: "220%",
              height: "1.5%",
              background: "#B6B6B6",
              marginTop: "19%",
              marginLeft: "-6%",
            }}></div>
            
            <div className={styles.thirdparent}>
              <div className={styles.labelsContainer3}>
                <label htmlFor="link">
                  Add link <span style={{ color: "#D92C2C" }}>*</span>
                </label>
                <label style={{ marginLeft: "-6%" }} htmlFor="emails">
                  Add Email <span style={{ color: "#D92C2C" }}>*</span>
                </label>
              </div>
              <div className={styles.inputsContainer3}>
                <input
                  placeholder="Enter URL Here"
                  className={styles.inputs2}
                  type="url"
                  id="link"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                  required
                />
                <input
                  placeholder="Add member Emails (comma separated)"
                  className={styles.inputs2}
                  type="text"
                  id="emails"
                  name="emails"
                  value={formData.emails}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            {!isMobile?(  <div className={styles.btncon2}>
              <button 
                type="button"
                className={styles.cancel2} 
                onClick={() => setIsDiolougeOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.save2} 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>):  <div style={{position:"relative",top:"40%",left:"30%"}}>
              <button 
                type="button"
                className={styles.cancel2} 
                onClick={() => setIsDiolougeOpen(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.save2} 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </button>
            </div>}
          
          </div>
        </form>
      )}
    </div>
  );
}