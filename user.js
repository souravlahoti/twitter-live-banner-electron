
const { getStoreData } = require('./store');

const user = {
    "name" : getStoreData('NAME'),
    "screen_name" :"@" + getStoreData('TWITTER_HANDLE'),
    "followers_count" :  getStoreData('FOLLOWERS')
}

module.exports = user;