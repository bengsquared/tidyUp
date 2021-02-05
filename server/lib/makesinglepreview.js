const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");
const pathUtil = require("path");
const filetypes = require("./filetypes");
const appicon = require("osx-fileicon");

const makeSinglePreview = ({ path, callback }) => {
  let data = "";
  appicon(path, (pngData) => {
    let preview = "data:image/png;base64, " + pngData.toString("base64");
    callback(data);
  });
};

makeSinglePreview({ ...workerData, callback: parentPort.postMessage });
