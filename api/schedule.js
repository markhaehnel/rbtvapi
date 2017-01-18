const axios = require('axios');
const crypto = require('crypto');

const client = axios.create({
    baseURL: 'https://api.rocketmgmt.de/schedule/',
    validateStatus: (status) => { return status === 200; }
});

client.interceptors.request.use((config) => {
    config.headers = Object.assign(config.headers, generateAuthHeaders(process.env.RBTVKEY, process.env.RBTVSECRET));
    return config;
});

module.exports.getCurrentShow = () => {
    return client.get('/current');
}

module.exports.getNextNShows = (n) => {
    return client.get(`/next/${n}`);
}

function generateAuthHeaders(user, salt) {
    validateCredentials(user, salt);

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

function rand(num) {
    return Math.random().toString(36).slice(num);
};

function base64encode(str) {
    return new Buffer(str).toString('base64');
};

function sha1hex(str) {
    return crypto.createHash('sha1').update(str).digest('hex');
}

function validateCredentials (...credentials) {
    credentials.forEach((value) => {
        if (! (value && value.trim()) ) {
            throw new Error('Auth credentials need to be set.');
        }
    });
}