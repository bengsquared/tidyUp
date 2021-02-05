import React, { useEffect, useState } from "react";

const FileInfo = ({ file }) => {
  let size = file.size;
  let suff = "bytes";
  let adjsize = size;
  if (size > 1000000000) {
    suff = "GB";
    adjsize = Math.round(size / 100000000) / 10;
  } else if (size > 1000000) {
    suff = "MB";
    adjsize = Math.round(size / 100000) / 10;
  } else if (size > 1000) {
    suff = "kB";
    adjsize = Math.round(size / 100) / 10;
  }

  if (file.isdir) {
    return (
      <div className="fileinfo">
        <h3>{file.name}</h3>
        <p>Folder</p>
        <p>
          <i>{file.path}</i>
        </p>
      </div>
    );
  } else {
    return (
      <table className="fileinfo">
        <caption>
          <h4 className="text-center text-lg">{file.name}</h4>
          <br />
        </caption>
        <tbody className="divide-y divide-gray-400 px-2">
          <tr>
            <td>type</td>
            <td className="text-right">{file.filetype.toLowerCase()}</td>
          </tr>
          <tr>
            <td>size</td>
            <td className="text-right">{adjsize + suff}</td>
          </tr>
          <tr>
            <td>Last Opened</td>
            <td className="text-right">{file.atime.toDateString()}</td>
          </tr>
          <tr>
            <td>Created</td>
            <td className="text-right">{file.ctime.toDateString()}</td>
          </tr>
        </tbody>
      </table>
    );
  }
};
export default FileInfo;
