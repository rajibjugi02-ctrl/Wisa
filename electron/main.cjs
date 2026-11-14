const { app, BrowserWindow, screen, ipcMain, Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let mainWindow = null;
let tray = null;

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
      mainWindow.webContents.send('open-settings');
    }
  });

  app.whenReady().then(() => {
    createWindow();
    createTray();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth } = primaryDisplay.workAreaSize;

  const width = 640;
  const height = 280;
  const x = Math.round((screenWidth - width) / 2);
  const y = 0;

  mainWindow = new BrowserWindow({
    width,
    height,
    x,
    y,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    hasShadow: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  const isDev = process.env.NODE_ENV === 'development';
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173/?notch=true');
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'), {
      query: { notch: 'true' },
    });
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, '..', 'src-tauri', 'icons', '32x32.png');
  const icon = nativeImage.createFromPath(iconPath);
  tray = new Tray(icon);

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Wisa Settings',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('open-settings');
        }
      },
    },
    {
      label: 'Toggle Minimalist Mode',
      click: () => {
        if (mainWindow && !mainWindow.isDestroyed()) {
          mainWindow.webContents.send('toggle-minimalist');
        }
      },
    },
    { type: 'separator' },
    {
      label: 'Restart Wisa',
      click: () => {
        app.relaunch();
        app.exit(0);
      },
    },
    {
      label: 'Quit Wisa',
      click: () => {
        app.quit();
      },
    },
  ]);

  tray.setToolTip('Wisa Smart Notch');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('open-settings');
    }
  });
}

// IPC Handlers
ipcMain.on('set-notch-size', (event, { width, height, isSettings }) => {
  if (mainWindow && !mainWindow.isDestroyed()) {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;

    if (isSettings) {
      // When Settings modal opens, expand window to roomy dimensions and center it
      const targetW = 880;
      const targetH = 640;
      const targetX = Math.round((screenWidth - targetW) / 2);
      const targetY = Math.round((screenHeight - targetH) / 2);
      mainWindow.setBounds({
        x: targetX,
        y: targetY,
        width: targetW,
        height: targetH,
      });
      mainWindow.setIgnoreMouseEvents(false);
    } else {
      // Normal notch mode: top-center on display
      const targetW = Math.round(width || 640);
      const targetH = Math.round(height || 280);
      const targetX = Math.round((screenWidth - targetW) / 2);
      mainWindow.setBounds({
        x: targetX,
        y: 0,
        width: targetW,
        height: targetH,
      });
    }
  }
});

ipcMain.on('set-ignore-mouse-events', (event, ignore, options) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win && !win.isDestroyed()) {
    win.setIgnoreMouseEvents(ignore, options || { forward: true });
  }
});

ipcMain.on('exit-app', () => {
  app.quit();
});
