const fs = require("fs");
const pathUtil = require("path");
const filetypes = require("./filetypes");
const appicon = require("osx-fileicon");

const makepreviews = async (stack) => {
  let cnt = { count: 1 }; //needs to be an object to pass by reference
  let len = stack.length;
  stack.forEach((item, i) => {
    appicon(item.path, (pngData) => {
      stack[i].preview = "data:image/png;base64, " + pngData.toString("base64");
      cnt.count += 1;

      if (cnt.count === len) {
        return true;
      }
    });
  });
  return stack;
};

module.exports = makepreviews;
