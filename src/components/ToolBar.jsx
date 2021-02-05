import React, { useEffect, useState } from "react";
import Mousetrap from "mousetrap";

const { shell } = window.require("electron");

const ToolBar = () => {
  const showInfo = () => {
    shell.openExternal("https://manilafile.co/tidyUp");
  };

  useEffect(() => {
    Mousetrap.bind("i", showInfo, "keydown");
    return function cleanup() {
      Mousetrap.unbind("i");
    };
  });

  return (
    <button className="info" onClick={showInfo}>
      i
    </button>
  );
};

export default ToolBar;
