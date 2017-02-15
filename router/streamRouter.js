const express = require('express');
const youtube = require('../api/youtube');

const router = express.Router();

router.get('/', getStreamInfo);

async function getStreamInfo(req, res) {
    let resObject = {
        'videoId': null,
        'viewerCount': null,
        'error': null
    }

    try {
        let videoIdResult = await youtube.getVideoId();
        resObject.videoId = videoIdResult.data.items[0].id.videoId;

        let viewerCountResult = await youtube.getViewerCount(resObject.videoId);
        resObject.viewerCount = viewerCountResult.data.items[0].liveStreamingDetails.concurrentViewers;
    } catch(err) {
        resObject.error = 'Can not get videoId or viewerCount';
    }

    res.status(resObject.error ? 500 : 200).send(resObject);
}

module.exports = router;
