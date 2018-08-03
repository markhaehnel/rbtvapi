const express = require('express')
const schedule = require('../api/schedule')
const CronJob = require('cron').CronJob

const router = express.Router()

let currentShow = {}
let next5Shows = {}

new CronJob({
  cronTime: '*/2 * * * *',
  onTick: async () => {
    try {
      let { data } = await schedule.getCurrentShow()
      currentShow = data
    } catch (err) {
      console.error('Error while updating currentShow', err)
    }
  },
  start: true,
  runOnInit: true
})

new CronJob({
  cronTime: '*/2 * * * *',
  onTick: async () => {
    try {
      let { data } = await schedule.getNextNShows(5)
      next5Shows = data
    } catch (err) {
      console.error('Error while updating next5Shows', err)
    }
  },
  start: true,
  runOnInit: true
})

router.get('/current', (req, res) => res.status(200).send(currentShow))
router.get('/next/5', (req, res) => res.status(200).send(next5Shows))

module.exports = router
