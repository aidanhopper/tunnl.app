import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { update } from './update'
import axios from 'axios'
import { execSync, spawn, ChildProcess } from 'child_process'
import Store from 'electron-store'
import dotenv from 'dotenv'
import crypto from 'crypto'
import fs from 'fs'

const store = new Store();
const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer

process.env.APP_ROOT = path.join(__dirname, '../..')

dotenv.config({
    path: path.resolve(process.cwd(), "../.env")
});

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
    ? path.join(process.env.APP_ROOT, 'public')
    : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

if (process.defaultApp) {
    if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient("tunnl", process.execPath, [path.resolve(process.argv[1])])
    }
} else {
    app.setAsDefaultProtocolClient("tunnl")
}

const gotTheLock = app.requestSingleInstanceLock()

const handleDeeplink = (url: string) => {
    if (win) {
        const decodedUrl = decodeURI(url);
        const urlObj = new URL(decodedUrl);
        const params = new URLSearchParams(urlObj.search);
        const messageParam = params.get("message");
        if (messageParam) {
            const message = JSON.parse(decodeURIComponent(messageParam));
            if (message.type === 'login')
                win.webContents.send("login-event", message.data);
        }
    }
}

async function createWindow() {
    win = new BrowserWindow({
        title: 'Main window',
        icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
        webPreferences: {
            preload,
            // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
            // nodeIntegration: true,

            // Consider using contextBridge.exposeInMainWorld
            // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
            // contextIsolation: false,
        },
    })

    if (VITE_DEV_SERVER_URL) { // #298
        win.loadURL(VITE_DEV_SERVER_URL)
        // Open devTool if the app is not packaged
        win.webContents.openDevTools()
    } else {
        win.loadFile(indexHtml)
    }

    // Test actively push message to the Electron-Renderer
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })

    // Auto update
    update(win)
}

if (!gotTheLock) {
    app.quit()
} else {
    app.whenReady().then(() => {
        createWindow()
    })
}

app.on('second-instance', (event, commandLine, workingDirectory) => {
    // Someone tried to run a second instance, we should focus our window.
    if (win) {
        if (win.isMinimized()) win.restore()
        win.focus()
    }
    // the commandLine is array of strings in which last element is deep link url

    if (process.platform !== 'darwin') {
        const url: string | undefined = commandLine.pop();
        if (url)
            handleDeeplink(url);
    }

})

app.on('open-url', (_, url) => {
    handleDeeplink(url);
})

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
    const childWindow = new BrowserWindow({
        webPreferences: {
            preload,
            nodeIntegration: true,
            contextIsolation: false,
        },
    })

    if (VITE_DEV_SERVER_URL) {
        childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
    } else {
        childWindow.loadFile(indexHtml, { hash: arg })
    }
})

ipcMain.handle('request', async (_, axios_request) => {
    const result = await axios(axios_request)
    return { data: result.data, status: result.status }
})

ipcMain.handle('openLinkInBrowser', async (_, url) => shell.openExternal(url));

ipcMain.handle('store:set', async (_, key: string, object: any) => {
    (store as any).set(key, object);
})

ipcMain.handle('store:get', async (_, key: string) => {
    return (store as any).get(key);
})

ipcMain.handle('store:delete', async (_, key: string) => {
    return (store as any).delete(key);
})

const getDeviceID = () => {
    let id = "";
    if (process.platform === "darwin") {
        id = execSync(`
            ioreg -rd1 -c IOPlatformExpertDevice | grep -E "IOPlatformUUID" | awk '{ print $3 }' | sed 's/\"//g'
        `).toString().trim();
    } else if (process.platform === "win32") {
        id = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Cryptography" /v MachineGuid')
            .toString().split('REG_SZ')[1]
            .trim();
    } else if (process.platform === "linux") {
        if (fs.existsSync('/etc/machine-id')) {
            id = fs.readFileSync('/etc/machine-id', 'utf8').trim();
        } else if (fs.existsSync('/var/lib/dbus/machine-id')) {
            id = fs.readFileSync('/var/lib/dbus/machine-id', 'utf8').trim();
        }
    }

    const hash = crypto.hash("sha256", id);

    return hash;
}

ipcMain.handle('getDeviceID', (_) => getDeviceID());

const getHostname = () => {
    return os.hostname();
}

ipcMain.handle('getHostname', (_) => getHostname());

let tunneler: ChildProcess | null = null;

const startZitiEdgeTunneler = () => {
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
        stdio: ["ignore", "pipe", "pipe"],
    });

    tunneler.stderr?.on("data", (data) => {
        console.error(`CLI Error: ${data.toString()}`);
    });

    tunneler.stdout?.on("data", (data) => {
        console.log(`CLI Output: ${data.toString()}`);
    });

    tunneler.on("error", (err) => {
        console.error(`Failed to start CLI process: ${err}`);
    });
}

startZitiEdgeTunneler()
