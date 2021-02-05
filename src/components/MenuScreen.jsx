import React, { useEffect, useState, useRef } from "react";
import Mousetrap from "mousetrap";
import LoadingShuffle from "./LoadingShuffle";
import folder from ".././images/folder.svg";
import plusfolder from ".././images/plusfolder.svg";
import cabinet from ".././images/cabinet.png";
import SquareKey from "./SquareKey";

const MenuScreen = ({ mode, locations, loadPath, newPath }) => {
  const topFive = locations ? locations.slice(0, 6) : [];
  const [focusTracker, setFocus] = useState(0);
  const focusRef = useRef();

  const selectCurrentLocation = () => {
    focusTracker === 0 ? newPath() : loadPath(topFive[focusTracker - 1].path);
  };

  useEffect(() => {
    Mousetrap.bind("enter", selectCurrentLocation, "keydown");
    Mousetrap.bind(
      "up",
      () => {
        focusHandler("up");
      },
      "keydown"
    );
    Mousetrap.bind(
      "down",
      () => {
        focusHandler("down");
      },
      "keydown"
    );
    Mousetrap.bind(
      "tab",
      () => {
        focusHandler("down");
      },
      "keydown"
    );
    Mousetrap.bind(
      "shift+tab",
      () => {
        focusHandler("up");
      },
      "keydown"
    );

    return function cleanup() {
      Mousetrap.unbind("up");
      Mousetrap.unbind("down");
      Mousetrap.unbind("tab");
      Mousetrap.unbind("shift+tab");
    };
  });

  useEffect(() => {
    focusRef.current.focus();
  }, [focusTracker]);

  const focusHandler = (direction) => {
    let newFocus = 0;
    let len = topFive.length;

    if (direction === "up") {
      newFocus = (focusTracker + len) % (len + 1);
      setFocus(newFocus);
    } else if (direction === "down") {
      newFocus = (focusTracker + len + 2) % (len + 1);
      setFocus(newFocus);
    }
  };

  return (
    <div className="grid tenGridContainer">
      <div className="gi" style={{ gridArea: "3/3/4/9" }}>
        <h1>Welcome to tidyUp</h1>
      </div>
      <div className="gi" style={{ gridArea: "4/3/5/9" }}>
        {mode === "newSession" ? (
          <h1>Where should we start?</h1>
        ) : (
          <h1>All done!</h1>
        )}
      </div>
      <div className="gi" style={{ gridArea: "5/3/6/9" }}>
        <div className="m-3">
          <button
            className="loc-button"
            onClick={newPath}
            ref={focusTracker === 0 ? focusRef : null}
          >
            <img
              className="inline h-6 px-4 self-center flex-none"
              src={plusfolder}
            />
            <p className="self-center loc-button-inner">New Location </p>
            <div
              className={
                focusTracker === 0
                  ? "miniSelectButton"
                  : "invisible miniSelectButton"
              }
            >
              enter
            </div>
          </button>
        </div>
      </div>
      <div className="gi" style={{ gridArea: "6/3/10/9" }}>
        <p className="text-sm">Recent Locations:</p>
        <ul className="m-3 pt-2 overflow-scroll">
          {locations &&
            locations != [] &&
            topFive.map((loc, i) => {
              return (
                <li key={loc.path} className="w-full">
                  <button
                    className="loc-button"
                    onClick={() => {
                      loadPath(loc.path);
                    }}
                    ref={focusTracker === i + 1 ? focusRef : null}
                  >
                    <img
                      className="inline h-6 px-4 self-center flex-none"
                      src={folder}
                    />
                    <p className="self-center loc-button-inner">{loc.name}</p>
                    <div
                      className={
                        focusTracker === i + 1
                          ? "miniSelectButton"
                          : "invisible miniSelectButton"
                      }
                    >
                      enter
                    </div>
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default MenuScreen;
