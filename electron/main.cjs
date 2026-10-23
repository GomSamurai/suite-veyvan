const { app, BrowserWindow, shell, Menu, ipcMain } = require('electron');
const path = require('path');

// Permite reproducción fluida de síntesis de audio Web Audio sin restricciones de gesto de usuario previo
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;
let horocronoWindow = null;
let miniHudWindow = null;

function createWindow() {
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'Suite Veyvan — Glosario Transversal & Atlas de Lore',
    backgroundColor: '#020617', // Previene cualquier destello blanco inicial (slate-950)
    autoHideMenuBar: true,
    show: false, // Espera a estar listo para mostrarse limpiamente
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: true,
      spellcheck: false,
    },
  });

  // Eliminar barra de menú nativa para apariencia de terminal de datos pura
  Menu.setApplicationMenu(null);

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else if (isDev && !app.isPackaged && !process.env.ELECTRON_LOAD_DIST) {
    // Modo dev conectando a Vite local
    mainWindow.loadURL('http://localhost:5173').catch(() => {
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    // Modo producción empaquetado o previsualización de dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createHorocronoWindow() {
  if (horocronoWindow) {
    if (horocronoWindow.isMinimized()) horocronoWindow.restore();
    horocronoWindow.focus();
    return;
  }

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  horocronoWindow = new BrowserWindow({
    width: 1280,
    height: 880,
    minWidth: 800,
    minHeight: 600,
    backgroundColor: '#07090e',
    title: 'Horocrono // Cronosistema Canónico de Estación Humanidad',
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    horocronoWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}?view=horocrono#horocrono`);
  } else if (isDev && !app.isPackaged && !process.env.ELECTRON_LOAD_DIST) {
    horocronoWindow.loadURL('http://localhost:5173?view=horocrono#horocrono').catch(() => {
      horocronoWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { view: 'horocrono' }, hash: 'horocrono' });
    });
  } else {
    horocronoWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { view: 'horocrono' }, hash: 'horocrono' });
  }

  horocronoWindow.on('closed', () => {
    horocronoWindow = null;
  });
}

function createMiniHudWindow() {
  if (miniHudWindow) {
    if (miniHudWindow.isMinimized()) miniHudWindow.restore();
    miniHudWindow.focus();
    return;
  }

  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

  miniHudWindow = new BrowserWindow({
    width: 480,
    height: 400,
    minWidth: 360,
    minHeight: 240,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    alwaysOnTop: true,
    resizable: true,
    title: 'Horocrono // Mini-HUD Flotante',
    icon: path.join(__dirname, 'assets', process.platform === 'win32' ? 'icon.ico' : 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  miniHudWindow.setAlwaysOnTop(true, 'screen-saver');

  if (isDev && process.env.VITE_DEV_SERVER_URL) {
    miniHudWindow.loadURL(`${process.env.VITE_DEV_SERVER_URL}?view=minihud#minihud`);
  } else if (isDev && !app.isPackaged && !process.env.ELECTRON_LOAD_DIST) {
    miniHudWindow.loadURL('http://localhost:5173?view=minihud#minihud').catch(() => {
      miniHudWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { view: 'minihud' }, hash: 'minihud' });
    });
  } else {
    miniHudWindow.loadFile(path.join(__dirname, '../dist/index.html'), { query: { view: 'minihud' }, hash: 'minihud' });
  }

  miniHudWindow.on('closed', () => {
    miniHudWindow = null;
  });
}

// Limitar a una sola instancia de la aplicación
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  // =========================================================================
  // IPC HANDLERS PARA HOROCRONO NATIVO Y MINI-HUD EN SUITE VEYVAN
  // =========================================================================
  ipcMain.handle('suite:launch-horocrono', async (event, options = {}) => {
    if (options.view === 'minihud') {
      createMiniHudWindow();
      return { success: true, mode: 'internal-minihud' };
    } else {
      createHorocronoWindow();
      return { success: true, mode: 'internal-horocrono' };
    }
  });

  ipcMain.on('horocrono:open-mini-hud', () => {
    createMiniHudWindow();
  });

  ipcMain.on('horocrono:close-mini-hud', () => {
    if (miniHudWindow) miniHudWindow.close();
  });

  ipcMain.handle('horocrono:toggle-always-on-top', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return false;
    const isAlways = win.isAlwaysOnTop();
    const next = !isAlways;
    win.setAlwaysOnTop(next, next ? 'screen-saver' : 'normal');
    return next;
  });

  ipcMain.handle('horocrono:set-always-on-top', (event, flag) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (!win) return false;
    win.setAlwaysOnTop(flag, flag ? 'screen-saver' : 'normal');
    return flag;
  });

  ipcMain.handle('horocrono:is-always-on-top', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    return win ? win.isAlwaysOnTop() : false;
  });

  ipcMain.on('horocrono:set-opacity', (event, opacity) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win && typeof opacity === 'number') {
      win.setOpacity(Math.max(0.2, Math.min(1.0, opacity)));
    }
  });

  ipcMain.on('horocrono:focus-main', () => {
    if (!horocronoWindow) {
      createHorocronoWindow();
    } else {
      if (horocronoWindow.isMinimized()) horocronoWindow.restore();
      horocronoWindow.focus();
    }
  });

  ipcMain.on('horocrono:minimize', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.minimize();
  });

  ipcMain.on('horocrono:close', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) win.close();
  });

  ipcMain.on('suite:open-external', (event, url) => {
    if (url && (url.startsWith('http:') || url.startsWith('https:'))) {
      shell.openExternal(url);
    }
  });

  app.whenReady().then(createWindow);

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
}
