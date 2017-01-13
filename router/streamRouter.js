const express = require('express');
const youtube = require('../api/youtube');

const router = express.Router();

router.get('/', function (req, res) {
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
            doError(res);
        }
    })
    .catch(() => {
        doError(res);  
    });
});

const doError = (res) => {
    res.status(400).send({
        'videoId': null,
        'viewerCount': null,
        'error': 'Can\'t get video id or viewer count'
    });
};

module.exports = router;
