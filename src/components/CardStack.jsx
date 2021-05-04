import React, { useEffect, useState } from "react";
import { useSprings, animated, interpolate } from "react-spring";
import LoadingScreen from "./LoadingScreen";
import Mousetrap from "mousetrap";
import "./../styles/main.css";
import FileCard from "./FileCard";

const { ipcRenderer } = window.require("electron");

const CardStack = ({ stack, currentIndex, directionSequence }) => {
  const [springs, set] = useSprings(stack.length, (i) => ({
    from: { aniVal: 3 },
    aniVal: i - currentIndex,
  }));

  useEffect(() => {
    set((i) => ({
      aniVal: i - currentIndex,
      config: { friction: 50, tension: i == currentIndex ? 500 : 200 },
    }));
    ipcRenderer.send("closeQL");

    Mousetrap.bind("space", onKeyDownHandler, "keydown");

    return function cleanup() {
      Mousetrap.unbind("space");
    };
  }, [currentIndex]);

  const onKeyDownHandler = () => {
    console.log("keyhandlercalled");
    ipcRenderer.send("openQL", { path: stack[currentIndex].path });
  };

  //takes in file stack, displays cards
  const len = stack.length - currentIndex;
  return (
    <div className="filestack">
      {springs.map((a, dex) => {
        return (
          dex - currentIndex >= -2 &&
          dex - currentIndex <= 2 && (
            <animated.div
              key={stack[dex].id}
              className="card"
              style={{
                zIndex: -1 * dex,
                opacity: a.aniVal.interpolate({
                  range: [-1, 0, 1, 3],
                  output: [0, 1, 1, 0],
                }),
                marginTop: a.aniVal
                  .interpolate({
                    range: [-1, 3],
                    output: [-30, 10],
                  })
                  .interpolate((x) => `${x}px`),
                transform: a.aniVal
                  .interpolate({
                    range: [-1, 0, 1],
                    output: [-100 * -1 * directionSequence[dex], 0, 0],
                  })
                  .interpolate(
                    (x) => `translate3d(${x}vw,${Math.abs(x)}vh,${
                      x / 3
                    }px) rotateY(${x / 2}deg) rotateZ(${x / 2}deg)
            `
                  ),
              }}
            >
              <FileCard key={stack[dex].id} file={stack[dex]} />
            </animated.div>
          )
        );
      })}
    </div>
  );
};

export default CardStack;
