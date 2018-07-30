const axios = require('axios')

const client = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  validateStatus: (status) => { return status === 200 },
  params: {
    'key': process.env.YOUTUBEKEY,
    'channelId': process.env.YOUTUBECHANNELID
  }
})

module.exports.getCameras = () => {
  return client.get('/search', {
    params: {
      'part': 'snippet',
      'order': 'viewCount',
      'eventType': 'live',
      'type': 'video',
      'maxResults': '25'
    }
  })
}

module.exports.getViewerCount = (videoId) => {
  return client.get('/videos', {
    params: {
      'part': 'liveStreamingDetails',
      'id': videoId,
      'maxResults': 1
    }
  })
}
