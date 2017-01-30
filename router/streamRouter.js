const express = require('express');
const youtube = require('../api/youtube');

const router = express.Router();

router.get('/', (req, res) => {
    
    let resObject = {
        'videoId': null,
        'viewerCount': null,
        'error': null
    }

    youtube.getVideoId()
    .then((result) => {
        resObject.videoId = result.data.items[0].id.videoId;
        
        youtube.getViewerCount(resObject.videoId)
        .then((result) => {
            resObject.viewerCount = result.data.items[0].liveStreamingDetails.concurrentViewers;
            sendResponse(res, resObject);
        })
        .catch(() => {
            resObject.error = "Can not get viewer count";
            sendResponse(res, resObject);
            
        });
    })
    .catch(() => {
        resObject.error = "Can not get video id";
        sendResponse(res, resObject);
    });

});

function sendResponse(res, resObject) {
    res.status(resObject.error ? 500 : 200).send(resObject);
}

module.exports = router;
