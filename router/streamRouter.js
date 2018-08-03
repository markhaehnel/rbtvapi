const express = require('express')
const youtube = require('../api/youtube')
const twitch = require('../api/twitch')
const CronJob = require('cron').CronJob

const router = express.Router()

let stream = {}

router.get('/', (req, res) => res.status(200).send(stream))

let jobStream = new CronJob({
  cronTime: '*/2 * * * *',
  onTick: async () => {
    try {
      stream = await getStreamData()
    } catch (err) {
      console.error('Error while updating stream info', err)
    }
  },
  runOnInit: true
})
jobStream.start()

function getStreamData () {
  return new Promise(async (resolve, reject) => {
    try {
      let result = {
        cameras: [],
        error: null
      }

      let videoIdsResult = await youtube.getCameras()

      videoIdsResult.data.items.forEach((element) => {
        result.cameras.push(element.id.videoId)
      })

      let [youtubeViewerResult, twitchViewerResult] = await Promise.all([
        await youtube.getViewerCount(result.cameras[0]),
        await twitch.getViewerCount()
      ])

      let ytViewerCount = youtubeViewerResult.data.items[0].liveStreamingDetails.concurrentViewers
      let twitchViewerCount = twitchViewerResult.data.stream.viewers

      result.viewerCount = parseInt(ytViewerCount) + parseInt(twitchViewerCount)

      // for versions 3.7.3 and earlier
      result.videoId = result.cameras[0]

      resolve(result)
    } catch (err) {
      reject(new Error('Can not get videoId or viewerCount'))
    }
  })
}

module.exports = router
