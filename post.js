const path = require('path');
const user = require("./user");
const { postBanner } = require("./fetch");
const notifier = require('node-notifier');
const fs = require("fs");
var open = require('open');

async function postIt(T1) {
    try {
        console.log('fetching banner ....');
        let base64 = fs.readFileSync(`3_back.png`, { encoding: 'base64' });
        console.log('posted banner ....');
        await postBanner(T1, base64);
        fs.unlinkSync(`3_back.png`);
        console.log('deleted banner ....');
        notifier.notify(
            {
                title: 'Notification New Banner',
                message: 'Your Banner has been posted ..',
                icon: path.join(__dirname, 'icon.png'),
                sound: true,
                wait: true,
            },
            function (err, response, metadata) {
            }
        );
        notifier.on('click', function (notifyObject, opt) {
            open(`https://twitter.com/${user.screen_name}`);
        });
    } catch (e) {
        console.log(e);
    }
}

module.exports = { postIt };
