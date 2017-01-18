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
        res.status(200).send(result.data);
    })
    .catch((err) => {
        res.status(500).send({
            'error': 'Can not get schedule'
        });
    });
};

module.exports = router;
