import React from "react";
import EarningsCard from "./EarningsCard";
import Loader from "./Loader";
import { useEarnings } from "../hooks/useEarnings";
import "../styles/EarningsCalendar.scss";

/**
 * Component that displays a structured earnings calendar.
 */
const EarningsCalendar: React.FC = () => {
  const { earningsByDay, logos, loading } = useEarnings(); // ✅ Fix: No 'earnings' here

  if (loading) {
    return <Loader />;
  }
  return (
    <div className="earnings-container">
      <h1 className="title">Most Anticipated Earnings Releases</h1>
      <p className="subtitle">For the week beginning February 03, 2025</p>
      
      <div className="earnings-calendar">
        {Object.entries(earningsByDay).map(([day, { beforeOpen, afterClose }]) => (
          <div key={day} className="day-section">
            {/* Day Title - Outside Border */}
            <h2 className="day-title">{day}</h2>
  
            {/* Labels - Before Open (Left) & After Close (Right) */}
            <div className="labels">
              <h3 className="before-open-label">Before Open</h3>
              <h3 className="after-close-label">After Close</h3>
            </div>
  
            {/* Bordered Section for Earnings Data */}
            <div className="day-box">
              {/* Before Open - Show "No Data" if empty */}
              <div className="section before-open">
                {beforeOpen.length > 0 ? (
                  beforeOpen.map((earning) => (
                    <EarningsCard key={earning.ticker} earning={earning} logo={logos[earning.ticker]} />
                  ))
                ) : (
                  <p className="no-data">No Data</p>
                )}
              </div>
  
              {/* After Close - Show the actual data */}
              <div className="section after-close">
                {afterClose.length > 0 ? (
                  afterClose.map((earning) => (
                    <EarningsCard key={earning.ticker} earning={earning} logo={logos[earning.ticker]} />
                  ))
                ) : (
                  <p className="no-data">No Data</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  
      
  
};

export default EarningsCalendar;
