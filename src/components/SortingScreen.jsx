import React, { useEffect, useState } from "react";
import CardStack from "./CardStack";
import SquareKey from "./SquareKey";
import confetti from "canvas-confetti";
const pathUtil = window.require("path");

const SortingScreen = ({
  undo,
  currentDir,
  stack,
  currentIndex,
  directionSequence,
  setLocation,
  cancel,
}) => {
  const [buttons, setButtons] = useState([{ button: "ArrowLeft" }, {}, {}]);
  const [halfway, setHalfway] = useState(false);
  const [message, setMessage] = useState(null);

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
      <div className="flex items-stretch justify-center">
        <div className="cancel-button">
          <SquareKey
            button={"del"}
            place={"Save and Exit"}
            func={cancel}
            wide={true}
            dir={0}
          />
        </div>
        <SquareKey
          button={"ArrowLeft"}
          func={setLocation}
          place={"Trash"}
          dir={-1}
        />
        <SquareKey button={"ArrowDown"} func={undo} place={"undo"} dir={0} />
        <SquareKey
          button={"ArrowRight"}
          func={setLocation}
          place={"Save"}
          dir={1}
        />
      </div>
    </div>
  );
};

export default SortingScreen;
