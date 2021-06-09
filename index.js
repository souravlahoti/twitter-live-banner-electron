const { ipcMain, app, BrowserWindow, application, Tray, Menu } = require("electron");
const path = require('path');
const url = require('url');
const log = require('electron-log');
const { login } = require('./login');
const { main } = require('./main');
const { getStoreData } = require("./store");
let window;
let appIcon = null;

let contextMenu = Menu.buildFromTemplate([
  {
    label: 'Show App', click: function () {
      window.show()
    }
  },
  {
    label: 'Quit', click: function () {
      app.isQuiting = true
      app.quit()
    }
  }
]);


async function createWindow() {
  window = new BrowserWindow({
    width: 300, height: 300, frame: false,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    }
  });

  if (getStoreData('AUTH_TOKEN')) {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'dashboard.html'),
      protocol: 'file',
      slashes: true
    }));
    window.hide();
    main();
  } else {
    window.loadURL(url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file',
      slashes: true
    }));
  }

  window.on('minimize', function (event) {
    event.preventDefault();
    window.hide();
  });

  window.on('close', function (event) {
    window = null;
  });
}

function createAppMenu() {
  appIcon = new Tray('icon.png');
  appIcon.setContextMenu(contextMenu);

}

app.whenReady().then(() => {
  createWindow();
  createAppMenu();
});

ipcMain.on('twitter-login-initiate', async (event) => {
  await login(window);
});

