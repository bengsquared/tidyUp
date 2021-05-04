import React, { useEffect, useState } from "react";
import "./../styles/main.css";
import ToolBar from "./ToolBar";
import LoadingScreen from "./LoadingScreen";
import MenuScreen from "./MenuScreen";
import SortingScreen from "./SortingScreen";
import ConfirmationScreen from "./ConfirmationScreen";
import Sidebar from "./Sidebar";
import LoadingShuffle from "./LoadingShuffle";
import { TransitionGroup, CSSTransition } from "react-transition-group";

const { ipcRenderer, shell } = window.require("electron");
const fs = window.require("fs");
const pathUtil = window.require("path");

const App = () => {
  const [stack, setStack] = useState(null);
  const [currentDir, setCurrentDir] = useState(null);
  const [mode, setMode] = useState("newSession");
  const [sortedFiles, setSortedFiles] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [moveSequence, setMoveSequence] = useState(null);
  const [directionSequence, setDirectionSequence] = useState(null);
  const [locations, setLocations] = useState(null);
  const [possiblePlaces, setPossiblePlaces] = useState([]);
  const [rr, reset] = useState(false);
  useEffect(() => {
    if (!locations) {
      setLocations([]);
      ipcRenderer.send("get-locations");
    }

    ipcRenderer.on("locations", locationHandler);

    ipcRenderer.on("cancel", cancel);

    ipcRenderer.on("stack", stackHandler);

    ipcRenderer.on("filesProcessed", filesProcessedHandler);

    return function cleanup() {
      ipcRenderer.removeListener("locations", locationHandler);

      ipcRenderer.removeListener("cancel", cancel);

      ipcRenderer.removeListener("stack", stackHandler);

      ipcRenderer.removeListener("filesProcessed", filesProcessedHandler);
    };
  }, []);

  const loadPath = (path) => {
    setMode("loading");
    ipcRenderer.send("load-path", { path: path });
  };

  const newPath = () => {
    setMode("loading");
    ipcRenderer.send("new-path");
  };

  const finishUp = () => {
    setMode("finishingUp");
    console.log("finishing up");
    let stackpaths = [];
    stack.forEach((item, i) => {
      stackpaths.push({
        path: item.path,
        name: item.name,
      });
    });
    let final = {
      path: currentDir,
      stack: stackpaths,
      placename: currentDir.split(pathUtil.sep).pop(),
      sequence: moveSequence,
    };
    console.log("sending execute");
    ipcRenderer.send("execute", final);
  };

  const cancel = () => {
    setMode("newSession");
    setStack(null);
    setCurrentDir(null);
    setSortedFiles(null);
    setCurrentIndex(null);
    setMoveSequence(null);
    setDirectionSequence(null);
  };

  const Reorder = ({ newStack, newMoveSequence }) => {
    console.log(newMoveSequence);
    console.log(newStack);

    setMoveSequence(newMoveSequence);
    setStack(newStack);
    reset(!rr);
  };

  const SaveAndEnd = () => {
    if (currentIndex === 0) {
      cancel();
    } else {
      let newStack = stack.slice(0, currentIndex);
      let newMoves = moveSequence.slice(0, currentIndex);
      setMoveSequence(newMoves);
      setStack(newStack);
    }
  };

  const setLocation = (newLocation, dir) => {
    if (newLocation === "Save") {
      newLocation = currentDir.split(pathUtil.sep).pop();
    }
    let ci = currentIndex;
    let seq = moveSequence;
    let dseq = directionSequence;
    dseq[ci] = dir;
    seq[ci] = newLocation;
    ci = ci + 1;
    setMoveSequence(seq);
    setDirectionSequence(dseq);
    setCurrentIndex(ci);
  };

  const undo = () => {
    if (currentIndex > 0) {
      let ci = currentIndex - 1;
      let seq = moveSequence;
      let dseq = directionSequence;
      seq[ci] = null;
      setMoveSequence(seq);
      setCurrentIndex(ci);
    }
  };
  const locationHandler = (e, a) => {
    let loc = a.locations;
    loc.sort((pathone, pathtwo) => {
      return pathtwo.ts - pathone.ts;
    });
    setLocations(loc);
  };
  const stackHandler = (e, a) => {
    ipcRenderer.send("get-locations");
    setPossiblePlaces(["Trash", a.dir.split(pathUtil.sep).pop()]);
    setStack(a.stack);
    setCurrentIndex(0);
    setMoveSequence([]);
    setDirectionSequence([]);
    setCurrentDir(a.dir);
    setMode("sorting");
  };

  const filesProcessedHandler = (e, a) => {
    setStack(null);
    setCurrentDir(null);
    setMode("done");
    setSortedFiles(null);
    setCurrentIndex(null);
    setMoveSequence(null);
    setDirectionSequence(null);
  };

  let content = <div></div>;

  if (mode === "newSession" || mode === "done") {
    content = (
      <MenuScreen
        mode={mode}
        locations={locations}
        loadPath={loadPath}
        newPath={newPath}
      />
    );
  } else if (mode === "sorting" && currentIndex < stack.length) {
    content = (
      <SortingScreen
        undo={undo}
        currentDir={currentDir}
        stack={stack}
        currentIndex={currentIndex}
        directionSequence={directionSequence}
        setLocation={setLocation}
        cancel={SaveAndEnd}
        setPossiblePlaces={setPossiblePlaces}
        possiblePlaces={possiblePlaces}
      />
    );
  } else if (mode === "sorting" && currentIndex === stack.length) {
    content = (
      <ConfirmationScreen
        finishUp={finishUp}
        cancel={cancel}
        stack={stack}
        moveSequence={moveSequence}
        Reorder={Reorder}
        rr={rr}
        possiblePlaces={possiblePlaces}
      />
    );
  } else if (mode === "finishingUp" || mode === "loading") {
    content = <LoadingScreen mode={mode} />;
  }
  return (
    <div className="min-w-full min-h-screen flex justify-center">
      <ToolBar />
      {content}
    </div>
  );
};

export default App;
