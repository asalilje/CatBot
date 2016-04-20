"use strict";

var TwitterClient = require("twitter");

class Twitter {

    constructor() {
        this.client = new TwitterClient({
            consumer_key: 'yourkeyhere',
            consumer_secret: 'yourkeyhere',
            access_token_key: 'yourkeyhere',
            access_token_secret: 'yourkeyhere',
        });
    }

    tweet(catClip) {
        const tweet = "Cat time! " + catClip.title + ": " + catClip.url;
        this.client.post('statuses/update', {status: tweet}, function () {
            console.log("Posted tweet: ", tweet);
        });
    };

};

module.exports = Twitter;
