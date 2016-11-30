const rest = require('rest');
const mime = require('rest/interceptor/mime');
const pathPrefix = require('rest/interceptor/pathPrefix');
const crypto = require('crypto');

const client = rest.wrap(mime).wrap(pathPrefix, { prefix: 'https://api.rocketmgmt.de' });

let _user;
let _salt;

module.exports = (user, salt) => {
    _user = user;
    _salt = salt;
}

module.exports.get = (endpoint) => {
    return client({
        path: endpoint,
        headers: authHeader(_user, _salt)
    });
}

const authHeader = (user, salt) => {
    let id = '00000000-0000-0000-0000-000000000000';
    let created = new Date().toISOString();
    let nonce = id + created + rand(10).trim();
    let sha1 = sha1hex(nonce + created + salt);

    return {
        'Accept': 'application/json',
        'Authorization': 'WSSE profile="UsernameToken"',
        'X-WSSE': 'UsernameToken Username="' + user + '", PasswordDigest="' + base64encode(sha1) + '", Nonce="' + base64encode(nonce) + '", Created="' + created + '"'
    };
}

const rand = function(num) {
    return Math.random().toString(36).slice(num);
};

const base64encode = function(str) {
    return new Buffer(str).toString('base64');
};

const sha1hex = (str) => {
    return crypto.createHash('sha1').update(str).digest('hex')
}
