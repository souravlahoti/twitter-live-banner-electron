
const fetch = (T, url) => {
  return new Promise((resolve, reject) => {
    T.get(url, (err, data, response) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    })
  });
}

const postBanner = (T, base64) => {

  return new Promise((resolve, reject) => {
    T.post('account/update_profile_banner', {
      banner: base64,
    },
      (err, data, response) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      })
  });
}

module.exports = { fetch, postBanner }