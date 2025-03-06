import { app, ipcMain, BrowserWindow, shell } from "electron";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import os from "node:os";
import axios from "axios";
import { execSync, spawn } from "child_process";
import Store from "electron-store";
import dotenv from "dotenv";
import crypto from "crypto";
import fs from "fs";
const { autoUpdater } = createRequire(import.meta.url)("electron-updater");
function update(win2) {
  autoUpdater.autoDownload = false;
  autoUpdater.disableWebInstaller = false;
  autoUpdater.allowDowngrade = false;
  autoUpdater.on("checking-for-update", function() {
  });
  autoUpdater.on("update-available", (arg) => {
    win2.webContents.send("update-can-available", { update: true, version: app.getVersion(), newVersion: arg == null ? void 0 : arg.version });
  });
  autoUpdater.on("update-not-available", (arg) => {
    win2.webContents.send("update-can-available", { update: false, version: app.getVersion(), newVersion: arg == null ? void 0 : arg.version });
  });
  ipcMain.handle("check-update", async () => {
    if (!app.isPackaged) {
      const error = new Error("The update feature is only available after the package.");
      return { message: error.message, error };
    }
    try {
      return await autoUpdater.checkForUpdatesAndNotify();
    } catch (error) {
      return { message: "Network error", error };
    }
  });
  ipcMain.handle("start-download", (event) => {
    startDownload(
      (error, progressInfo) => {
        if (error) {
          event.sender.send("update-error", { message: error.message, error });
        } else {
          event.sender.send("download-progress", progressInfo);
        }
      },
      () => {
        event.sender.send("update-downloaded");
      }
    );
  });
  ipcMain.handle("quit-and-install", () => {
    autoUpdater.quitAndInstall(false, true);
  });
}
function startDownload(callback, complete) {
  autoUpdater.on("download-progress", (info) => callback(null, info));
  autoUpdater.on("error", (error) => callback(error, null));
  autoUpdater.on("update-downloaded", complete);
  autoUpdater.downloadUpdate();
}
const store = new Store();
createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "../..");
dotenv.config({
  path: path.resolve(process.cwd(), "../.env")
});
const MAIN_DIST = path.join(process.env.APP_ROOT, "dist-electron");
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
if (os.release().startsWith("6.1")) app.disableHardwareAcceleration();
if (process.platform === "win32") app.setAppUserModelId(app.getName());
if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}
let win = null;
const preload = path.join(__dirname, "../preload/index.mjs");
const indexHtml = path.join(RENDERER_DIST, "index.html");
if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("tunnl", process.execPath, [path.resolve(process.argv[1])]);
  }
} else {
  app.setAsDefaultProtocolClient("tunnl");
}
const gotTheLock = app.requestSingleInstanceLock();
const handleDeeplink = (url) => {
  if (win) {
    const decodedUrl = decodeURI(url);
    const urlObj = new URL(decodedUrl);
    const params = new URLSearchParams(urlObj.search);
    const messageParam = params.get("message");
    if (messageParam) {
      const message = JSON.parse(decodeURIComponent(messageParam));
      if (message.type === "login")
        win.webContents.send("login-event", message.data);
    }
  }
};
async function createWindow() {
  win = new BrowserWindow({
    title: "Main window",
    icon: path.join(process.env.VITE_PUBLIC, "favicon.ico"),
    webPreferences: {
      preload
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // nodeIntegration: true,
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      // contextIsolation: false,
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(indexHtml);
  }
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });
  update(win);
}
if (!gotTheLock) {
  app.quit();
} else {
  app.whenReady().then(() => {
    createWindow();
  });
}
app.on("second-instance", (event, commandLine, workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
  if (process.platform !== "darwin") {
    const url = commandLine.pop();
    if (url)
      handleDeeplink(url);
  }
});
app.on("open-url", (_, url) => {
  handleDeeplink(url);
});
app.on("window-all-closed", () => {
  win = null;
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
ipcMain.handle("request", async (_, axios_request) => {
  const result = await axios(axios_request);
  return { data: result.data, status: result.status };
});
ipcMain.handle("openLinkInBrowser", async (_, url) => shell.openExternal(url));
ipcMain.handle("store:set", async (_, key, object) => {
  store.set(key, object);
});
ipcMain.handle("store:get", async (_, key) => {
  return store.get(key);
});
ipcMain.handle("store:delete", async (_, key) => {
  return store.delete(key);
});
const getDeviceID = () => {
  let id = "";
  if (process.platform === "darwin") {
    id = execSync(`
            ioreg -rd1 -c IOPlatformExpertDevice | grep -E "IOPlatformUUID" | awk '{ print $3 }' | sed 's/"//g'
        `).toString().trim();
  } else if (process.platform === "win32") {
    id = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid').toString().split("REG_SZ")[1].trim();
  } else if (process.platform === "linux") {
    if (fs.existsSync("/etc/machine-id")) {
      id = fs.readFileSync("/etc/machine-id", "utf8").trim();
    } else if (fs.existsSync("/var/lib/dbus/machine-id")) {
      id = fs.readFileSync("/var/lib/dbus/machine-id", "utf8").trim();
    }
  }
  const hash = crypto.hash("sha256", id);
  return hash;
};
ipcMain.handle("getDeviceID", (_) => getDeviceID());
const getHostname = () => {
  return os.hostname();
};
ipcMain.handle("getHostname", (_) => getHostname());
let tunneler = null;
const startZitiEdgeTunneler = () => {
  var _a, _b;
  if (tunneler) {
    console.log("Ziti Edge Tunneler is already running.");
    return;
  }
  const zitiPath = path.resolve(`${app.getAppPath()}/ziti`);
  const identitiesPath = path.resolve(`${zitiPath}/identities`);
  const binaryPath = path.resolve(`${zitiPath}/ziti-edge-tunnel-darwin`);
  const command = `${binaryPath} run-host -i ${identitiesPath}/tunnelerTester.json`;
  tunneler = spawn(command, {
    detached: false,
    stdio: ["ignore", "pipe", "pipe"]
  });
  (_a = tunneler.stderr) == null ? void 0 : _a.on("data", (data) => {
    console.error(`CLI Error: ${data.toString()}`);
  });
  (_b = tunneler.stdout) == null ? void 0 : _b.on("data", (data) => {
    console.log(`CLI Output: ${data.toString()}`);
  });
  tunneler.on("error", (err) => {
    console.error(`Failed to start CLI process: ${err}`);
  });
};
startZitiEdgeTunneler();
export {
  MAIN_DIST,
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
//# sourceMappingURL=index.js.map
