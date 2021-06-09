const TwitterV2 = require("twitter-v2");
const TwitterV1 = require("twitter");
const log = require('electron-log');
const get = require('node-fetch');
const fs = require('fs');
const config = require("./config.json");
const { postIt } = require("./post");
const { mergeFollowerImages } = require("./create-banner");
const { fetch } = require("./fetch");
const { getStoreData } = require("./store");


let clientV2;
let clientV1;

const main = async () => {
    try {
        credentials = {
            consumer_key: config.CONSUMER_KEY,
            consumer_secret: config.CONSUMER_SECRET,
            access_token_key: getStoreData('AUTH_TOKEN').token,
            access_token_secret: getStoreData('AUTH_TOKEN').tokenSecret,
        };

        log.info('Credentials formed for client: ', credentials);

        clientV2 = new TwitterV2(credentials);
        clientV1 = new TwitterV1(credentials);

        if (!getStoreData("TWITTER_HANDLE")) {
            try {
                let data = await fetch(clientV1, 'account/verify_credentials');
                console.log(data.screen_name, data.name, data.followers_count);
                setStoreData('TWITTER_HANDLE', data.screen_name);
                setStoreData('NAME', data.name);
                setStoreData('FOLLOWERS', data.followers_count);
            } catch (e) {
                console.log(e);
            }
        }

        try {
            let data = await fetch(clientV1, 'followers/list');
            let followers = data.users.slice(0, 3);

            await Promise.all(followers.map(async (follower, i) => {
                await downloadImage(follower.profile_image_url_https, `${i}.png`);
            }));

            await mergeFollowerImages();

        } catch (e) {
            console.log(e);
        }
        setTimeout(() => { postIt(clientV1) }, 4000);
        setInterval(() => {
            main();
            log.info('Started polling data ....')
        }, 60000);
    } catch (err) {
        log.error("Error caught in initialize: ", err);
    }
}

async function downloadImage(url, fileName) {
    const response = await get(url);
    const buffer = await response.buffer();
    fs.writeFileSync(fileName, buffer);
}

module.exports = { main }