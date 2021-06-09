const auth = require('oauth-electron-twitter');
const config = require("./config.json");

const loginForTwitter = async (window) => {
    let err = null;
    let info = {
        key: config.CONSUMER_KEY,
        secret: config.CONSUMER_SECRET
    }
    try {
        let response = await auth.login(info, window)
        return [err, response];
    } catch (err) {
        console.log(err);
        return [err, null];
    }
}

module.exports = loginForTwitter;