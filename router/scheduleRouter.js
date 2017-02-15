const express = require('express')
const schedule = require('../api/schedule')

const router = express.Router();

router.get('/current', getCurrentShow);
router.get('/next/:count', (req, res) => getNextNShows(res, req.params.count));

async function getCurrentShow(req, res) {
    try {
        let result = await schedule.getCurrentShow();
        res.status(200).send(result.data);
    } catch (e) {
        res.status(500).send({
            'error': 'Can not get current show'
        });
    }
} 

async function getNextNShows(res, count) {
    try {
        let result = await schedule.getNextNShows(count);
        res.status(200).send(result.data);
    } catch (e) {
        res.status(500).send({
            'error': `Can not get next ${count} show(s)`
        });
    }
}

module.exports = router;
