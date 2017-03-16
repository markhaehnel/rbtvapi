const express = require('express');
const schedule = require('../api/schedule');
const cacheManager = require('cache-manager');

const memoryCache = cacheManager.caching({ store: 'memory', max: 1, ttl: 120 });
const router = express.Router();

router.get('/current', getCurrentShow);
router.get('/next/:count', (req, res) => getNextNShows(res, req.params.count));

function getCurrentShow(req, res) {
    memoryCache.wrap('schedule_current', () => {
        return schedule.getCurrentShow();
    })
    .then((result) => {
        res.status(200).send(result.data);
    })
    .catch(() => {
        res.status(500).send({ 'error': 'Can not get current show' });
    }); 
} 

function getNextNShows(res, count) {
    memoryCache.wrap(`schedule_next_${count}`, () => {
        return schedule.getNextNShows(count);
    })
    .then((result) => {
        res.status(200).send(result.data);
    })
    .catch(() => {
        res.status(500).send({ 'error': `Can not get next ${count} show(s)` });
    });
}

module.exports = router;
