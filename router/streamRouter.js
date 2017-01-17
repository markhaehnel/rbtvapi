const express = require('express');
const apicache = require('apicache');
const youtube = require('../api/youtube');


const router = express.Router();
const cache = apicache.middleware;

router.get('/', cache('2 minutes', req => req.statusCode === 200), (req, res) => {
    Promise.all([youtube.getVideoId(), youtube.getViewerCount()])
    .then((results) => 
    {
        if (results.filter((x) => { x.status.code !== 200 }).length === 0) {
            res.status(200).send({
                'videoId': results[0].items[0].id.videoId,
                'viewerCount': results[1].items[0].liveStreamingDetails.concurrentViewers,
                'error': null
            });
        } else {
            doError(404, res);
        }
    })
    .catch(() => {
        doError(500, res);
    });
});

const doError = (errorCode, res) => {
    res.status(errorCode).send({
        'videoId': null,
        'viewerCount': null,
        'error': 'Can\'t get video id or viewer count'
    });
};

module.exports = router;
