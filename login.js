const log = require('electron-log');
const { BrowserWindow } = require("electron");
const { setStoreData } = require("./store");
const loginForTwitter = require("./auth");
const { main } = require("./main");
const url = require('url');
const path = require('path');

const login = async (window) => {
    let err, response;
    let authorizationwindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: false,
            enableRemoteModule: true
        }
    });
    log.info(' twitterLogin() Called for login');
    [err, response] = await loginForTwitter(authorizationwindow);
    if (err)
        log.error("Error During Authentication: ", err);
    if (response) {
        log.info("Response From Authentication: ", response);
        setStoreData('AUTH_TOKEN', response);
        authorizationwindow.close();
        openDashboard(window);
    }
}

function openDashboard(window){
  window.loadURL(url.format({
    pathname: path.join(__dirname, 'dashboard.html'),
    protocol: 'file',
    slashes: true
  }));
  window.hide();
  main();
}

module.exports = { login };