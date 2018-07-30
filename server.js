if (process.env.NODE_ENV !== 'development') {
  require('newrelic')
}

const express = require('express')
const log = require('morgan')
const contentType = require('./middleware/contentType')
const cacheControl = require('./middleware/cacheControl')
const scheduleRouter = require('./router/scheduleRouter')
const streamRouter = require('./router/streamRouter')

const app = express()

app.disable('x-powered-by')

/* middlewares */
app.use(log('combined'))
app.use(contentType)
app.use(cacheControl)

/* routing */
app.use('/schedule', scheduleRouter)
app.use('/stream', streamRouter)
app.use('*', (res, req) => {
  req.status(404).send({
    error: 'Endpoint not found.'
  })
})

/* let's go */
app.listen(process.env.PORT || 8080, () => {
  console.log('RBTV API listening on port %d...', process.env.PORT || 8080)
})
