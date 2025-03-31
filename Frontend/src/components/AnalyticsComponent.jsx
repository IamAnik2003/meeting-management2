import React, { useState, useEffect } from "react";
import styles from "../components/Analytics.module.css"; // Import CSS Module

export default function AnalyticsComponent() {
  
  return (
    <div className={styles["container"]}>
      <div className={styles.availability}>
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
      </div>
     
    </div>
  );
}