"use strict";

const YoutubeNode = require("youtube-node");
const Twitter = require("./twitter.js");

class Youtube {
    constructor() {
        this.youTube = new YoutubeNode();
        this.youTube.setKey('yourkeyhere');
        this.youTube.addParam('order', 'viewCount');
        this.youTube.addParam('safeSearch', 'strict');
        this.clipList = [];
        this.twitter = new Twitter();
        this.search();
    }

    postClip() {
        const clip = this.getClip();
        this.twitter.tweet(clip);
    };

    getClip() {
        let clip;
        for (let i = 0; i < this.clipList.length; i++) {
            if (!this.clipList[i].posted) {
                this.clipList[i].posted = true;
                clip = this.clipList[i];
                this.getRelated(clip.id);
                break;
            }
        }
        return clip;
    };

    handleResult(jsonResult) {
        for (let i = 0; i < jsonResult.items.length; i++) {
            const item = this.createClip(jsonResult.items[i]);
            if (this.clipList.indexOf(item) == -1)
                this.clipList.push(item);
        }
    };

    search() {
        this.youTube.search('funny cat', 20, function (error, result) {
            if (error) {
                console.log(error);
            }
            else {
                this.handleResult(result);
            }
        }.bind(this));
    };

    getRelated(id) {
        this.youTube.related(id, 5, function (error, result) {
            if (error) {
                console.log(error);
            }
            else {
                this.handleResult(result);
            }
        }.bind(this));
    }

    createClip(item) {
        const clip = {
            'id': item.id.videoId,
            'url': 'https://www.youtube.com/watch?v=' + item.id.videoId,
            'title': item.snippet.title,
            'posted': false,
        }
        return clip;
    };

}

module.exports = Youtube;
