const express = require('express');
const apicache = require('apicache');
const youtube = require('../api/youtube');

const router = express.Router();
const cache = apicache.middleware;

router.get('/', cache('2 minutes'), (req, res) => {
    
    Promise.all([youtube.getVideoId(), youtube.getViewerCount()])
    .then((results) => 
    {
        res.status(200).send({
            'videoId': results[0].items[0].id.videoId,
            'viewerCount': results[1].items[0].liveStreamingDetails.concurrentViewers,
            'error': null
        });
    })
    .catch(() => {
        res.status(500).send({
            'videoId': null,
            'viewerCount': null,
            'error': 'Can not get video id or viewer count'
        });
    });
});

module.exports = router;
