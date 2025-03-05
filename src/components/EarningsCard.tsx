import React from "react";
import { EarningsData } from "../hooks/useEarnings";
import "../styles/EarningsCard.scss";

/**
 * Props interface for EarningsCard component.
 */
interface EarningsCardProps {
  earning: EarningsData;
  logo?: string;
}

/**
 * Component that displays earnings details for a company.
 * Clicking the card redirects the user to the Benzinga quote page.
 */
const EarningsCard: React.FC<EarningsCardProps> = ({ earning, logo }) => {
  /**
   * Redirects the user to the company's Benzinga quote page.
   */
  const redirectToQuote = () => {
    window.open(`https://www.benzinga.com/quote/${earning.ticker.toLowerCase()}`, "_blank");
  };

  return (
    <div className="earnings-card" onClick={redirectToQuote}>
      {logo ? <img src={logo} alt={earning.ticker} className="company-logo" /> : <div className="placeholder-logo">{earning.ticker}</div>}
      <div className="earnings-info">
        <span className="ticker">{earning.ticker}</span>
        <span className="eps">EPS: {earning.epsActual || "N/A"} (Est: {earning.epsEstimate || "N/A"})</span>
        <span className="date">{earning.date}</span>
      </div>
    </div>
  );
};

export default EarningsCard;
