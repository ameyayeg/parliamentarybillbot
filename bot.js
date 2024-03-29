require('dotenv').config();
const { TwitThread } = require("twit-thread");

const t = new TwitThread({
    consumer_key: process.env.TWITTER_API_KEY,
    consumer_secret: process.env.TWITTER_API_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

const tweetThread = (message) => {    
    return new Promise((resolve, reject) => {
        t.tweetThread([{text: message}])
        }, (error, data, response) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log(data);
                resolve(data);
            }
        });
    };

module.exports = { tweetThread };