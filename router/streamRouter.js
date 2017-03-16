const express = require('express');
const youtube = require('../api/youtube');
const cacheManager = require('cache-manager');

const memoryCache = cacheManager.caching({ store: 'memory', max: 1, ttl: 300 });
const router = express.Router();

router.get('/', getStreamInfo);

function getStreamInfo(req, res) {
    memoryCache.wrap('stream_current', () => {
        return getStreamData();
    })
    .then((data) => {
        res.status(200).send(data);
    })
    .catch((e) => {
        let errResult = { 'error': e };
        res.status(500).send(errResult);
    });
}

function getStreamData() {
    return new Promise(async (resolve, reject) => {
        try {
            let result = {};

            let videoIdResult = await youtube.getVideoId();
            result.videoId = videoIdResult.data.items[0].id.videoId;

            let viewerCountResult = await youtube.getViewerCount(result.videoId);
            result.viewerCount = viewerCountResult.data.items[0].liveStreamingDetails.concurrentViewers;

            result.error = null;

            resolve(result);
        } catch(err) {
            reject('Can not get videoId or viewerCount');
        }
    });
}

module.exports = router;
