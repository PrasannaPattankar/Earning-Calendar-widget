import React from "react";
import EarningsCard from "./EarningsCard";
import Loader from "./Loader";
import { useEarnings } from "../hooks/useEarnings";
import "../styles/EarningsCalendar.scss";

/**
 * Component that displays a list of earnings reports.
 */
const EarningsCalendar: React.FC = () => {
  const { earnings, logos, loading } = useEarnings();

  // Show loading indicator while fetching data
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="earnings-calendar">
      {earnings.map((earning) => (
        <EarningsCard key={earning.ticker} earning={earning} logo={logos[earning.ticker]} />
      ))}
    </div>
  );
};

export default EarningsCalendar;
