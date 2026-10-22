const { app, BrowserWindow, shell, Menu } = require('electron');
const path = require('path');

// Permite reproducción fluida de síntesis de audio Web Audio sin restricciones de gesto de usuario previo
app.commandLine.appendSwitch('autoplay-policy', 'no-user-gesture-required');

let mainWindow = null;

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
      // Si el servidor Vite no estuviera activo, fallback al dist local
      mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    });
  } else {
    // Modo producción empaquetado o previsualización de dist
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  // Mostrar suavemente cuando el contenido esté listo
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Abrir enlaces externos en el navegador predeterminado del sistema (no dentro de la app)
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
