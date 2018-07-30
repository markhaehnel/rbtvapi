const express = require('express')
const youtube = require('../api/youtube')
const twitch = require('../api/twitch')
const cacheManager = require('cache-manager')

const memoryCache = cacheManager.caching({ store: 'memory', max: 1, ttl: 300 })
const router = express.Router()

router.get('/', getStreamInfo)

function getStreamInfo (req, res) {
  memoryCache.wrap('stream_current', () => {
    return getStreamData()
  })
    .then((data) => {
      res.status(200).send(data)
    })
    .catch((e) => {
      let errResult = { 'error': e }
      res.status(500).send(errResult)
    })
}

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
        console.log(element.id.videoId + ' ' + element.snippet.title)
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
