import React, { useEffect, useState } from "react";
import "./../styles/main.css";
import Mousetrap from "mousetrap";
import SquareKey from "./SquareKey";

import folder from "./../images/folder.svg";
import trash from "./../images/trash.svg";
import undo from "./../images/undo.png";

const SortationLocation = ({
  button,
  setLocation,
  place,
  dir,
  wide,
  hideFolder,
}) => {
  return (
    <div className="col-3">
      {["enter", "return", "del", "backspace"].includes(button) &&
      hideFolder ? (
        <div>
          <br />
          <br />
        </div>
      ) : (
        <img
          src={place == "Trash" ? trash : place == "undo" ? undo : folder}
          className="button-icon"
        ></img>
      )}
      <h3 className="over">{place}</h3>
      <SquareKey
        onPress={() => setLocation(place, dir)}
        button={button}
        wide={false}
      />
    </div>
  );
};

export default SortationLocation;
