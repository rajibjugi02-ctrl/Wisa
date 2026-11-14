const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  isElectron: true,
  setNotchSize: (width, height) => ipcRenderer.send('set-notch-size', { width, height }),
  exitApp: () => ipcRenderer.send('exit-app'),
  openSettings: () => ipcRenderer.send('open-settings-window'),
  onOpenSettings: (callback) => {
    ipcRenderer.on('open-settings', () => callback());
  },
  onToggleMinimalist: (callback) => {
    ipcRenderer.on('toggle-minimalist', () => callback());
  },
});
