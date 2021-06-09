const Store = require('electron-store');
const store = new Store();


getStoreData = (key) => {
    return store.get(key);
}

setStoreData = (key, value) => {
    store.set(key, value);
}

module.exports = { getStoreData, setStoreData }