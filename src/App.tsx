import React from "react";
import EarningsCalendar from "./components/EarningsCalendar";
import "./styles/global.scss";

/**
 * Root application component.
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Earnings Calendar Widget</h1>
      <EarningsCalendar />
    </div>
  );
};

export default App;
