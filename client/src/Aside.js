import React from "react";
import excel from "./assets/excel_logo.png";
import pulse from "./assets/pulse_burned.png";
import "./App.css";

class Aside extends React.Component {
  render() {
    return (
      <div className="sticky-sidebar">
        <img src={excel} alt="Excel logo" className="excel" />
        <img src={pulse} alt="Pulse 2018" className="pulse" />
      </div>
    );
  }
}

export default Aside;