import React, { useEffect, useState } from "react";
import FileInfo from "./FileInfo";
import DefaultFile from ".././images/fileicon.png";
const { ipcRenderer } = window.require("electron");

const FileCard = ({ file }) => {
  const [src, setSrc] = useState(false);

  const previewhandler = (e, a) => {
    if (a.path == file.path) {
      setSrc(a.imgsrc);
      console.log("recieve png data");
    }
  };

  useEffect(() => {
    if (!src) {
      setSrc(DefaultFile);
      console.log("send");
      console.log(file.path);
      ipcRenderer.send("get-preview", { path: file.path });
    }

    ipcRenderer.on("preview", previewhandler);

    return function cleanup() {
      ipcRenderer.removeListener("open-file-reply", previewhandler);
    };
  }, [file]);

  // a card representing a file - shows a preview and info about the file
  return (
    <div className="card-wrapper">
      <img
        onClick={() => {
          ipcRenderer.send("openQL", { path: file.path });
        }}
        className="file-preview"
        src={src || DefaultFile}
      />
      <FileInfo file={file} />
    </div>
  );
};

export default FileCard;
