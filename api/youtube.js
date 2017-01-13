const rest = require('rest');
const mime = require('rest/interceptor/mime');
const pathPrefix = require('rest/interceptor/pathPrefix');

const youtubeClient = rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://www.googleapis.com/youtube/v3' });

let _youtubeKey = process.env.YOUTUBEKEY;
let _youtubeChannelId = process.env.YOUTUBECHANNELID;

module.exports.getVideoId = () => {
    return youtubeClient({
        path: 'search',
        params: {
            'key': _youtubeKey,
            'channelId': _youtubeChannelId,
            'part': 'snippet',
            'order': 'date',
            'eventType': 'live',
            'type': 'video',
            'maxResults': 1
        }
    });
}

module.exports.getViewerCount = () => {
    return youtubeClient({
        path: 'videos',
        params: {
            'key': _youtubeKey,
            'part': 'liveStreamingDetails',
            'channelId': _youtubeChannelId,
            'maxResults': 1
        }
    });
}
