import React, { useState } from "react";
import LoadingShuffle from "./LoadingShuffle";
const { ipcRenderer } = window.require("electron");

const LoadingScreen = ({ mode }) => {
  const [loadStatus, setLoadStatus] = useState("started");

  ipcRenderer.on("loadUpdate", (e, a) => {
    setLoadStatus(a.status);
  });

  let message = "loading";
  switch (mode) {
    case "finishingUp":
      message = "finishing up...";
      break;
    case "loading":
      message = "Loading files, hang on a sec";
      break;
  }
  return (
    <div className="grid tenGridContainer">
      <div className="gi" style={{ gridArea: "3/3/4/9" }}>
        <h2 className="text-center">{message}</h2>
        <h2 className="text-center">{loadStatus}</h2>
      </div>
      <div className="gi" style={{ gridArea: "5/5/6/7" }}>
        <div className="center">
          <LoadingShuffle />
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
