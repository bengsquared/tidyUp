const fs = require("fs");
const { workerData, parentPort } = require("worker_threads");
const filetypes = require("./filetypes");
const pathUtil = require("path");

const loadstack = async ({ path, opt }) => {
  const dir = fs.readdirSync(path, { withFileTypes: true });
  let stack = [];
  for (const dirent of dir) {
    dirent.path = pathUtil.join(path, dirent.name);
    if (
      dirent.isDirectory() &&
      !dirent.name.startsWith(".") &&
      opt.scanSubfolders
    ) {
      let substack = await loadstack({
        path: dirent.path,
        opt: opt,
      });
      Array.prototype.concat(stack, substack);
    } else if (
      !dirent.name.startsWith(".") &&
      (!dirent.isDirectory() || opt.includeFolders)
    ) {
      let stat = await fs.statSync(dirent.path);
      let filetype =
        filetypes.filetypes[pathUtil.extname(dirent.name).toUpperCase()] ||
        pathUtil.extname(dirent.name).substring(1);
      let newFile = {
        id: stat.ino,
        filetype: filetype,
        name: dirent.name,
        path: dirent.path,
        ...stat,
      };
      stack.push(newFile);
    }
  }
  return stack;
};

loadstack(workerData).then((stack) => {
  parentPort.postMessage(stack);
});
