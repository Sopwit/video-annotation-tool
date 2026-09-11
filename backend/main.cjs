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
const shouldRunUiSmokeTest = process.env.ELECTRON_UI_SMOKE_TEST === "true";
const uiSmokeResultPath = process.env.ELECTRON_UI_SMOKE_RESULT;

const appRoot = app.getAppPath();
const rendererEntry = path.join(appRoot, "dist", "index.html");
const windowIcon = app.isPackaged
  ? path.join(process.resourcesPath, "icon.png")
  : path.join(appRoot, "public", "icon.png");

const normalizePath = (filePath) => path.resolve(String(filePath || ""));

function installRendererDiagnostics(window) {
  window.webContents.on("did-fail-load", (_event, errorCode, errorDescription, validatedURL) => {
    console.error("Renderer failed to load:", { errorCode, errorDescription, validatedURL });
  });

  window.webContents.on("render-process-gone", (_event, details) => {
    console.error("Renderer process exited:", details);
  });

  if (!shouldRunUiSmokeTest) return;

  window.webContents.on("did-finish-load", async () => {
    const deadline = Date.now() + 15_000;

    while (Date.now() < deadline) {
      try {
        const state = await window.webContents.executeJavaScript(`(() => {
          const root = document.getElementById('root');
          const firstElement = root?.firstElementChild;
          const bounds = firstElement?.getBoundingClientRect();
          return {
            childCount: root?.childElementCount ?? 0,
            textLength: document.body.innerText.trim().length,
            width: bounds?.width ?? 0,
            height: bounds?.height ?? 0,
          };
        })()`);

        if (
          state.childCount > 0 &&
          state.textLength > 20 &&
          state.width > 100 &&
          state.height > 100
        ) {
          console.log("UI_SMOKE_TEST_PASS", state);
          if (uiSmokeResultPath) {
            fs.writeFileSync(uiSmokeResultPath, JSON.stringify(state));
          }
          app.exit(0);
          return;
        }
      } catch (error) {
        console.error("UI smoke probe failed:", error);
      }

      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    console.error("UI_SMOKE_TEST_FAIL: renderer did not produce visible application content");
    app.exit(1);
  });
}

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
      preload: path.join(__dirname, "preload.cjs"),
      webSecurity: true,
    },
    titleBarStyle: "hiddenInset",
    trafficLightPosition: { x: 15, y: 15 },
    icon: windowIcon,
  });

  installRendererDiagnostics(mainWindow);

  // Load the app
  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
    if (shouldOpenDevTools) {
      mainWindow.webContents.openDevTools({ mode: "detach" });
    }
  } else {
    mainWindow.loadFile(rendererEntry);
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
