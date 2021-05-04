import React, { useEffect, useState } from "react";
import "./../styles/main.css";
import Mousetrap from "mousetrap";
import left from "./../images/leftarrow.svg";
import right from "./../images/rightarrow.svg";
import folder from "./../images/folder.svg";
import arrow from "./../images/arrow.svg";
import down from "./../images/downarrow.svg";
import undo from "./../images/undo.png";
import trash from "./../images/trash.svg";

const SquareKey = ({ button, onPress, wide }) => {
  const [pressed, setPressed] = useState(false);
  let keyname = button;
  let r = 0;
  if (
    [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Meta",
      "Alt",
      "Control",
    ].includes(button)
  ) {
    let keymap = {
      ArrowUp: "up",
      ArrowDown: "down",
      ArrowLeft: "left",
      ArrowRight: "right",
      Meta: "meta",
      Alt: "alt",
      Control: "ctrl",
    };
    let rmap = {
      ArrowDown: 180,
      ArrowLeft: -90,
      ArrowRight: 90,
    };
    keyname = "";
    r = rmap[button];
    button = keymap[button];
  }

  const onKeyDownHandler = (e) => {
    setPressed(true);
    onPress();
    e.preventDefault();
  };

  const onKeyUpHandler = (e) => {
    setPressed(false);
    e.preventDefault();
  };

  useEffect(() => {
    let b = button;
    if (button == "del" || button == "backspace") {
      b = ["del", "backspace"];
    } else if (button == "enter" || button == "return") {
      b = ["enter", "return"];
    }
    Mousetrap.bind(b, onKeyDownHandler, "keydown");
    Mousetrap.bind(b, onKeyUpHandler, "keyup");
    return function cleanup() {
      Mousetrap.unbind(b);
    };
  });
  return (
    <button
      className={
        (pressed ? "sel-button-down " : "") +
        (wide ? "sel-button-wide" : "sel-button")
      }
      onMouseDown={onKeyDownHandler}
      onMouseUp={onKeyUpHandler}
    >
      <div className={button}>
        {keyname == "" ? (
          <img
            className="buttonimg"
            alt={button}
            src={arrow}
            style={{ transform: `rotate(${r}deg)` }}
          />
        ) : (
          keyname
        )}
      </div>
    </button>
  );
};

export default SquareKey;
