const axios = require('axios');

const client = axios.create({
    baseURL: 'https://api.twitch.tv/kraken/',
    validateStatus: (status) => { return status === 200; },
    headers: {
        'Accept': 'application/vnd.twitchtv.v5+json',
        'Client-ID': process.env.TWITCHCLIENTID
    }
});

module.exports.getViewerCount = () => {
    return client.get(`/streams/${process.env.TWITCHUSERID}`);
}
