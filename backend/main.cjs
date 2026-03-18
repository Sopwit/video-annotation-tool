const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const path = require("path");
const fs = require("fs");
const fsp = require("fs/promises");

let mainWindow;
const approvedReadPaths = new Set();
const approvedWritePaths = new Set();
const MAX_READ_FILE_SIZE_BYTES = 1024 * 1024 * 1024; // 1GB

// Development mode check
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;
const shouldOpenDevTools = process.env.OPEN_DEVTOOLS === "true";

const normalizePath = (filePath) => path.resolve(String(filePath || ""));

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: "#0f172a",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
      webSecurity: true,
    },
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    icon: path.join(__dirname, "../public/icon.png"),
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    if (shouldOpenDevTools) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.webContents.setWindowOpenHandler(() => ({ action: "deny" }));
  mainWindow.webContents.on("console-message", (event, level, message, line, sourceId) => {
    const isKnownDevToolsAutofillNoise =
      sourceId.startsWith("devtools://") &&
      message.includes("Autofill.") &&
      message.includes("wasn't found");

    if (isKnownDevToolsAutofillNoise) {
      event.preventDefault();
    }
  });

  mainWindow.on("closed", () => {
    approvedReadPaths.clear();
    approvedWritePaths.clear();
    mainWindow = null;
  });
}

// App lifecycle
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle("dialog:openFile", async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters: [
      {
        name: "Videos",
        extensions: ["mp4", "webm", "ogg", "mov", "avi", "mkv"],
      },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const selectedPath = normalizePath(result.filePaths[0]);
    approvedReadPaths.add(selectedPath);
    return selectedPath;
  }
  return null;
});

ipcMain.handle("file:read", async (event, filePath) => {
  try {
    const resolvedPath = normalizePath(filePath);
    if (!approvedReadPaths.has(resolvedPath)) {
      throw new Error("File path is not approved");
    }
    const stat = await fsp.stat(resolvedPath);
    if (stat.size > MAX_READ_FILE_SIZE_BYTES) {
      throw new Error("File is too large to read");
    }
    const data = await fsp.readFile(resolvedPath);
    return {
      success: true,
      data: data.toString("base64"),
      path: resolvedPath,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
});

ipcMain.handle("dialog:saveFile", async (event, options) => {
  const normalizedOptions = options && typeof options === "object" ? options : {};
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: normalizedOptions.defaultPath || "annotations.json",
    filters: [
      { name: "JSON Files", extensions: ["json"] },
      { name: "All Files", extensions: ["*"] },
    ],
  });

  if (!result.canceled && result.filePath) {
    const selectedPath = normalizePath(result.filePath);
    approvedWritePaths.add(selectedPath);
    return selectedPath;
  }
  return null;
});

ipcMain.handle("file:write", async (event, filePath, content) => {
  try {
    const resolvedPath = normalizePath(filePath);
    if (!approvedWritePaths.has(resolvedPath)) {
      throw new Error("File path is not approved");
    }
    await fsp.writeFile(resolvedPath, content);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});
