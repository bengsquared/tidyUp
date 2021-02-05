const {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  dialog,
  Menu,
  TouchBar,
} = require("electron");
const {
  Worker,
  isMainThread,
  parentPort,
  workerData,
} = require("worker_threads");
const pathUtil = require("path");
const filetypes = require("./lib/filetypes");
const { is } = require("electron-util");
const fs = require("fs-extra");
const appicon = require("osx-fileicon");
const Store = require("electron-store");
let mainWindow;
const storage = new Store();

async function loadstack(workerData) {
  return new Promise((resolve, reject) => {
    const worker = new Worker(`${__dirname}/lib/loadstack.js`, {
      workerData,
    });
    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0)
        reject(new Error(`Worker stopped with exit code ${code}`));
    });
  });
}

const createWindow = () => {
  mainWindow = new BrowserWindow({
    backgroundColor: "#F7F7F7",
    minWidth: 800,
    minHeight: 700,
    show: false,
    height: 860,
    width: 900,
    enableRemoteModule: false,
    webPreferences: {
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
    },
  });

  if (is.development) {
    mainWindow.webContents.openDevTools({ mode: "detach" });
    mainWindow.loadURL("http://localhost:3000");
  } else {
    mainWindow.loadURL(`file:///${__dirname}/../build/index.html`);
  }

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();

    ipcMain.on("open-external-window", (event, arg) => {
      shell.openExternal(arg);
    });
  });
};

generateMenu = () => {
  const template = [
    {
      label: "File",
      submenu: [{ role: "about" }, { role: "quit" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "pasteandmatchstyle" },
        { role: "delete" },
        { role: "selectall" },
      ],
    },
    {
      label: "View",
      submenu: [
        { type: "separator" },
        { role: "resetzoom" },
        { role: "zoomin" },
        { role: "zoomout" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      role: "window",
      submenu: [{ role: "minimize" }, { role: "close" }],
    },
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
};

app.on("ready", () => {
  createWindow();
  generateMenu();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", () => {
  ipcMain.removeAllListeners();
});

app.on("window-all-closed", () => {
  //  if (process.platform !== "darwin") {
  app.quit();
  //  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on("load-page", (event, arg) => {
  mainWindow.loadURL(arg);
});

ipcMain.on("load-path", async (event, arg) => {
  event.reply("loadUpdate", { status: "stored path" });
  let p = arg.path;
  if (fs.existsSync(p)) {
    storage.set(p, {
      name: p.split(pathUtil.sep).pop(),
      path: p,
      ts: Date.now(),
    });
    let stack = await loadstack({ path: arg.path, opt: false });
    console.log("stack");
    event.reply("stack", { stack: stack, dir: arg.path });
  } else event.reply("cancel");
});

ipcMain.on("new-path", async (event, arg) => {
  let path = await dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  if (path.filePaths[0]) {
    let p = path.filePaths[0];
    event.reply("loadUpdate", { status: p });
    storage.set(p, {
      name: p.split(pathUtil.sep).pop(),
      path: p,
      ts: Date.now(),
    });

    event.reply("loadUpdate", { status: "stored path" });

    let stack = await loadstack({ path: p, opt: false });
    event.reply("loadUpdate", { status: "got files" });

    event.reply("stack", {
      stack: stack,
      dir: p,
    });
  } else event.reply("cancel");
});

ipcMain.on("get-preview", (event, arg) => {
  appicon(arg.path, (pngData) => {
    event.reply("preview", {
      path: arg.path,
      imgsrc: "data:image/png;base64, " + pngData.toString("base64"),
    });
  });
});

ipcMain.on("get-locations", async (event, arg) => {
  let locations = [];
  let invalidLocations = [];
  for (let [key, val] of storage) {
    if (fs.existsSync(val.path)) {
      locations.push(val);
    } else {
      invalidLocations.push(key);
    }
  }
  invalidLocations.forEach((item, i) => {
    storage.delete(item);
  });

  event.reply("locations", { locations: locations });
});

ipcMain.on("execute", async (event, arg) => {
  for (let dex in arg.sequence) {
    if (arg.sequence[dex] == "Trash") {
      shell.moveItemToTrash(arg.stack[dex].path, false);
    } else if (
      arg.sequence[dex] != arg.placename &&
      arg.sequence[dex] != "Save"
    ) {
      if (fs.existsSync(pathUtil.join(arg.path, arg.sequence[dex]))) {
        fs.moveSync(
          arg.stack[dex].path,
          pathUtil.join(arg.path, arg.sequence[dex], arg.stack[dex].name)
        );
      } else {
        fs.mkdirSync(pathUtil.join(arg.path, arg.sequence[dex]));
        fs.moveSync(
          arg.stack[dex].path,
          pathUtil.join(arg.path, arg.sequence[dex], arg.stack[dex].name)
        );
      }
    }
  }
  event.reply("filesProcessed");
});

ipcMain.on("openQL", async (event, arg) => {
  console.log(arg.path);
  mainWindow.closeFilePreview();
  mainWindow.previewFile(arg.path);
});

ipcMain.on("closeQL", async (event, arg) => {
  console.log("closed");
  mainWindow.closeFilePreview();
});
