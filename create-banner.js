const fs = require('fs');
const sharp = require('sharp');
const Jimp = require('Jimp');
const { kFormatter } = require('./util');
const user = require('./user');


async function mergeFollowerImages() {
    try {
        let followerCount = (kFormatter(user.followers_count)).toString();
        let userName = (user.name).toString();
        let screenName = (user.screen_name).toString();
        const fontFollower = await Jimp.loadFont(`./font/leaguespartan-bold.ttf.fnt`);
        const fontName = await Jimp.loadFont('./font/leaguespartan-bold.ttf.fnt');
        const fontHAndle = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
        const bgWithFollowers = await Jimp.read(`base_1.png`);
        await bgWithFollowers.print(fontName, 640, 200, userName);
        await bgWithFollowers.print(fontHAndle, 600, 450, screenName);
        await bgWithFollowers.print(fontFollower, 200, 150, followerCount);
        await bgWithFollowers.write(`0_back.png`);
        drawFollowers()
    } catch (e) {
        console.log(e);
    }
}

function drawFollowers() {
    setTimeout(() => {
        fs.readFile(`0_back.png`, 'utf8', async (err, data) => {
            if (err) {
                drawFollowers();
            } else {
                try {
                    for (let i = 0; i < 3; i++) {
                        var image = await Jimp.read(`${i}.png`);
                        var mask = await Jimp.read("mask.png");
                        image.mask(mask, 0, 0).write(`${i}.png`);
                    }
                    for (let i = 0; i < 3; i++) {
                        let j = i;
                        let top = [200, 280, 360];
                        await sharp(`${i}_back.png`)
                            .composite([{ input: `${i}.png`, top: top[i], left: 1400 }])
                            .toFile(`${++j}_back.png`);
                        if (i < 3) {
                            fs.unlinkSync(`${i}.png`);
                            fs.unlinkSync(`${i}_back.png`);
                        }
                    }
                } catch (e) {
                    console.log(e);
                }
            }
        });
    }, 1000)
}


module.exports = { mergeFollowerImages };
