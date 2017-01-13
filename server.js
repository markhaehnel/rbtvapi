/* dependencies, dependencies, dependencies  */
const express = require('express');
const compression = require('compression');
const log = require('./middleware/log');
const contentType = require('./middleware/contentType');
const streamRouter = require('./router/streamRouter');
const scheduleRouter = require('./router/scheduleRouter');

const app = express();

/* middlewares */
app.use(log);
app.use(contentType)
app.use(compression());

/* routing */
app.use('/schedule', scheduleRouter);
app.use('/stream', streamRouter);

/* let's go */
app.listen(process.env.PORT || 8080, () => {
    console.log('RBTV API listening on port %d...', process.env.PORT || 8080);
});