import React, { useEffect, useState } from "react";
import CardStack from "./CardStack";
import SquareKey from "./SquareKey";
import SortationLocation from "./SortationLocation";
import confetti from "canvas-confetti";
const pathUtil = window.require("path");
let keyordermap = {
  "1": 1,
  q: 2,
  a: 3,
  "2": 4,
  z: 5,
  w: 6,
  s: 7,
  "3": 8,
  x: 9,
  e: 10,
  d: 11,
  "4": 12,
  c: 13,
  r: 14,
  f: 15,
  "5": 16,
  v: 17,
  t: 18,
  g: 19,
  "6": 20,
  b: 21,
  y: 22,
  h: 23,
  "7": 24,
  n: 25,
  u: 26,
  j: 27,
  "8": 28,
  m: 29,
  i: 30,
  k: 31,
  "9": 32,
  ",": 33,
  o: 34,
  ",": 35,
  l: 36,
  "0": 37,
  ".": 38,
  p: 39,
  ";": 40,
  "-": 41,
  "/": 42,
  "[": 43,
  "'": 44,
  "=": 45,
  "]": 46,
  "\\": 47,
  "]": 48,
};
const SortingScreen = ({
  undo,
  currentDir,
  stack,
  currentIndex,
  directionSequence,
  setLocation,
  cancel,
  setPossiblePlaces,
  possiblePlaces,
}) => {
  const [buttons, setButtons] = useState({});
  const [halfway, setHalfway] = useState(false);
  const [message, setMessage] = useState(null);
  const [rerender, setRerender] = useState(true);
  const [editingKey, setEditingKey] = useState(false);

  var count = 200;
  var defaults = {
    origin: { y: 0.7 },
  };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  const onKeyDownHandler = (e) => {
    if (
      !e.key.includes("Arrow") &&
      !buttons[e.key] &&
      Object.keys(buttons).length < 6
    ) {
      if (editingKey) {
        let tempbuttons = buttons;
        tempbuttons[e.key] = e.key;
        setButtons(tempbuttons);
        setRerender(!rerender);
        let newPlaces = possiblePlaces;
        newPlaces.push(e.key);
        setPossiblePlaces(possiblePlaces);
      } else {
        let tempbuttons = buttons;
        delete tempbuttons[e.key];
        setButtons(tempbuttons);
        setRerender(!rerender);
        let newPlaces = possiblePlaces;
        newPlaces.push(e.key);
        setPossiblePlaces(possiblePlaces);
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", onKeyDownHandler);
    return function cleanup() {
      document.removeEventListener("keydown", onKeyDownHandler);
    };
  }, []);

  useEffect(() => {
    if ((currentIndex + 1) / stack.length > 0.5 && !halfway) {
      setMessage("Halfway done!");
      setHalfway(true);

      setTimeout(() => {
        setMessage(null);
      }, 2000);

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    }
  }, [currentIndex]);

  return (
    <div className="flex w-full center flex-col justify-center align-center overflow-hidden">
      <h2 className="text-center">
        {"Currently Sorting: /" + currentDir.split(pathUtil.sep).pop()}
      </h2>
      <p className="text-grey-600 text-center text-xs">
        {" (" + currentDir + ")"}
      </p>
      <div className="progressbar my-2">
        <div
          style={{
            width: String(100 * ((currentIndex + 1) / stack.length)) + "%",
          }}
          className="progress"
        ></div>
      </div>
      {message ? (
        <div className="text-center halfway">{message}</div>
      ) : (
        <p className="text-center filecount">
          {"file " + String(currentIndex + 1) + " of " + String(stack.length)}
        </p>
      )}

      <section className="w-full block flex justify-center">
        <CardStack
          stack={stack}
          currentIndex={currentIndex}
          directionSequence={directionSequence}
        />
      </section>
      <section className="absolute m-12 z-0 right-0"></section>
      <div className="flex items-stretch justify-center">
        <div className="cancel-button">
          <SquareKey button={"del"} onPress={cancel} wide={true} />
          <p>Save and Exit</p>
        </div>
        {Object.keys(buttons)
          .sort((a, b) => {
            return (keyordermap[a] || 0) - (keyordermap[b] || 0);
          })
          .map((key) => (
            <SortationLocation
              key={key}
              button={key}
              setLocation={setLocation}
              place={buttons[key]}
              dir={-1.3}
            />
          ))}
        <div>
          <p className="text-sm grey">+ press any button to add a folder</p>
        </div>
        <SortationLocation
          button={"ArrowLeft"}
          setLocation={setLocation}
          place={"Trash"}
          dir={-1}
        />
        <SortationLocation
          button={"ArrowDown"}
          setLocation={undo}
          place={"undo"}
          dir={0}
        />
        <SortationLocation
          button={"ArrowRight"}
          setLocation={setLocation}
          place={"Save"}
          dir={1}
        />
      </div>
    </div>
  );
};

export default SortingScreen;
