const rest = require('rest');
const mime = require('rest/interceptor/mime');
const pathPrefix = require('rest/interceptor/pathPrefix');
const crypto = require('crypto');

const client = rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://api.rocketmgmt.de/schedule' });

let _rbtvKey = process.env.RBTVKEY;
let _rbtvSecret = process.env.RBTVSECRET;

module.exports.getCurrentShow = () => {
    return client({
        path: '/current',
        headers: generateAuthHeader(_rbtvKey, _rbtvSecret)
    });
}

module.exports.getNextNShows = (n) => {
    return client({
        path:`/next/${n}`,
        headers: generateAuthHeader(_rbtvKey, _rbtvSecret)
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
