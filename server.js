require('newrelic');

const express = require('express');
const compression = require('compression');
const log = require('morgan');
const apicache = require('apicache');
const contentType = require('./middleware/contentType');
const scheduleRouter = require('./router/scheduleRouter');
const streamRouter = require('./router/streamRouter');

const app = express();
const cache = apicache.middleware;

app.disable('x-powered-by');

/* middlewares */
app.use(log('combined')); //Logging
app.use(cache('2 minutes'));
app.use(contentType)
app.use(compression());

/* routing */
app.use('/schedule', scheduleRouter);
app.use('/stream', streamRouter);

/* let's go */
app.listen(process.env.PORT || 8080, () => {
    console.log('RBTV API listening on port %d...', process.env.PORT || 8080);
});