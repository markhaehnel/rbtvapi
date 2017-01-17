const express = require('express')
const schedule = require('../api/schedule')

const router = express.Router();

router.get('/current', (req, res) => {
    handleApiResult(schedule.getCurrentShow(), res);
});

router.get('/next/:count', (req, res) => {
    handleApiResult(schedule.getNextNShows(req.params.count), res);
});

const handleApiResult = (apiCall, res) => {
    apiCall.then((result) => {
        if (result.status.code === 200) {
            res.status(200).send(result.entity);
        } else {
            doError(result.status.code);
        }
    })
    .catch(() => {
        doError(500, res);
    });
};

const doError = (errorCode, res) => {
    res.status(errorCode).send({
        'videoId': null,
        'viewerCount': null,
        'error': 'Can\'t get video id or viewer count'
    });
};

module.exports = router;
