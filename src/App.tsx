import React from "react";
import EarningsCalendar from "./components/EarningsCalendar";
import "./styles/global.scss";

/**
 * Root application component.
 */
const App: React.FC = () => {
  return (
    <div className="app">
      <h1></h1>
      <EarningsCalendar />
    </div>
  );
};

export default App;
