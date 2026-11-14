const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  setNotchSize: (width, height, isSettings = false) =>
    ipcRenderer.send('set-notch-size', { width, height, isSettings }),
  setIgnoreMouseEvents: (ignore, options) =>
    ipcRenderer.send('set-ignore-mouse-events', ignore, options),
  exitApp: () => ipcRenderer.send('exit-app'),
  openSettings: () => ipcRenderer.send('open-settings-window'),
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', () => callback());
  },
  onToggleMinimalist: (callback) => {
    ipcRenderer.on('toggle-minimalist', () => callback());
  },
});
