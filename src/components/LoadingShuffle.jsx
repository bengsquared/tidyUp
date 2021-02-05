import React, { useState } from "react";
import "./../styles/shuffle.css";
const { ipcRenderer } = window.require("electron");

const LoadingShuffle = () => {
  return (
    <div className="shuffleContainer">
      <div className="shuffleCard" id="front"></div>
      <div className="shuffleCard" id="mid"></div>
      <div className="shuffleCard" id="back"></div>
    </div>
  );
};

export default LoadingShuffle;
