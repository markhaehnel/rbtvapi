const rest = require('rest');
const mime = require('rest/interceptor/mime');
const pathPrefix = require('rest/interceptor/pathPrefix');
const crypto = require('crypto');

const client = rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://api.rocketmgmt.de' });

let _user;
let _salt;

module.exports.setAuthCredentials = (user, salt) => {
    validateCredentials(user, salt);
    _user = user;
    _salt = salt;
}

module.exports.get = (endpoint) => {
    return client({
        path: endpoint,
        headers: generateAuthHeader(_user, _salt)
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

const validateCredentials = (user, salt) => {
    if (!(user && user.trim() && salt && salt.trim())) {
        throw new Error('Auth credentials need to be set.');
    }
}
