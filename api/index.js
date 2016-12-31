const rest = require('rest');
const mime = require('rest/interceptor/mime');
const pathPrefix = require('rest/interceptor/pathPrefix');
const crypto = require('crypto');

const rbtvClient = rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://api.rocketmgmt.de' });
const youtubeClient = rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://www.googleapis.com/youtube/v3' });
//https://www.googleapis.com/youtube/v3/search?key=" . $apiKey . "&channelId=" . $channelId . "&part=snippet&order=date&eventType=live&type=video&maxResults=1
let _rbtvKey;
let _rbtvSecret;
let _youtubeKey;

module.exports.setAuthCredentials = (rbtvKey, rbtvSecret, youtubeKey) => {
    validateCredentials(...[rbtvKey, rbtvSecret, youtubeKey]);
    _rbtvKey = rbtvKey;
    _rbtvSecret = rbtvSecret;
    _youtubeKey = youtubeKey;
}

module.exports.get = (endpoint) => {
    return rbtvClient({
        path: endpoint,
        headers: generateAuthHeader(_rbtvKey, _rbtvSecret)
    });
}

module.exports.getVideoUrl = () => {
    return youtubeClient({
        path: "search",
        params: {
            "key": _youtubeKey,
            "channelId": "***REMOVED***",
            "part": "snippet",
            "order": "date",
            "eventType": "live",
            "type": "video",
            "maxResults": 1
        }
    });
}

const generateAuthHeader = (user, salt) => {
    let id = '00000000-0000-0000-0000-000000000000';
    let created = new Date().toISOString();
    let nonce = id + created + rand(10).trim();
    let sha1 = sha1hex(nonce + created + salt);

    const authHeaders = {
        'Accept': 'application/json',
        'Authorization': 'WSSE profile="UsernameToken"',
        'X-WSSE': `UsernameToken Username="${user}", PasswordDigest="${base64encode(sha1)}", Nonce="${base64encode(nonce)}", Created="${created}"`
    };

    return authHeaders;
}

const rand = function(num) {
    return Math.random().toString(36).slice(num);
};

const base64encode = function(str) {
    return new Buffer(str).toString('base64');
};

const sha1hex = (str) => {
    return crypto.createHash('sha1').update(str).digest('hex');
}

const validateCredentials = (...credentials) => {
    credentials.forEach((value) => {
        if (! (value && value.trim()) ) {
            throw new Error('Auth credentials need to be set.');
        }
    });
}
