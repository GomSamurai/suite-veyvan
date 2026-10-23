const { contextBridge, ipcRenderer } = require('electron');

// 1. API para la Suite Veyvan
contextBridge.exposeInMainWorld('suiteAPI', {
  isElectron: true,
  launchHorocrono: (options = {}) => ipcRenderer.invoke('suite:launch-horocrono', options),
  openExternal: (url) => ipcRenderer.send('suite:open-external', url)
});

// 2. API nativa para el módulo de Horocrono (control de ventanas, Always-on-Top, opacidad)
contextBridge.exposeInMainWorld('horocronoAPI', {
  isElectron: true,
  openMiniHud: () => ipcRenderer.send('horocrono:open-mini-hud'),
  closeMiniHud: () => ipcRenderer.send('horocrono:close-mini-hud'),
  toggleAlwaysOnTop: () => ipcRenderer.invoke('horocrono:toggle-always-on-top'),
  setAlwaysOnTop: (flag) => ipcRenderer.invoke('horocrono:set-always-on-top', flag),
  isAlwaysOnTop: () => ipcRenderer.invoke('horocrono:is-always-on-top'),
  setOpacity: (opacity) => ipcRenderer.send('horocrono:set-opacity', opacity),
  focusMainWindow: () => ipcRenderer.send('horocrono:focus-main'),
  minimizeWindow: () => ipcRenderer.send('horocrono:minimize'),
  closeWindow: () => ipcRenderer.send('horocrono:close')
});
