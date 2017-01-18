const axios = require('axios');

const client = axios.create({
    baseURL: 'https://www.googleapis.com/youtube/v3/',
    validateStatus: (status) => { return status === 200; },
    params: {
        'key': process.env.YOUTUBEKEY,
        'channelId': process.env.YOUTUBECHANNELID
    }
});

module.exports.getVideoId = () => {
    return client.get('/search', {
        params: {
            'part': 'snippet',
            'order': 'date',
            'eventType': 'live',
            'type': 'video',
            'maxResults': 1
        }
    });
}

module.exports.getViewerCount = () => {
    return client.get('/videos', {
        params: {
            'part': 'liveStreamingDetails',
            'maxResults': 1
        }
    });
}
