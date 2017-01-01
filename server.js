/* dependencies, dependencies, dependencies  */
const express = require('express');
const compression = require('compression');
const logger = require('./log');
const api = require('./api');

const app = express();

/* app configuration */
const port = process.env.PORT || 8080;
app.set('port', port);
app.use(logger);
app.use(compression());

api.setAuthCredentials(process.env.RBTVKEY, process.env.RBTVSECRET, process.env.YOUTUBEKEY);

/* routing */
app.get('/schedule/current', (req, res) => {
    api.get(req.path).then((response) => {
        res.send(response.entity);
    });
});

/* let's go' */
app.listen(port, () => {
    console.log('rbtv-api listening on port %d...', port);
});