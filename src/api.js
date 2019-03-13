const express = require('express')
const serverless = require('serverless-http')
const axios = require('axios')
const moment = require('moment')

const app = express()

const api = axios.create({
  baseURL: 'https://api.rocketbeans.tv/v1',
  validateStatus: (status) => { return status === 200 }
})

const cacheControl = (req, res, next) => {
  res.header('Cache-Control', 'public, max-age=300')
  next()
}

const router = express.Router()

router.get('/stream', async (req, res) => {
  const { data } = await api.get('/frontend/init')
  res.status(200).json({
    cameras: [ data.data.streamInfo.youtubeToken ],
    error: null,
    viewerCount: data.data.streamInfo.info.viewers.total,
    videoId: data.data.streamInfo.youtubeToken
  })
})

router.get('/schedule/current', async (req, res) => {
  const now = Math.floor(new Date() / 1000)
  const day = 86400
  const { data } = await api.get(`/schedule/normalized?startDay=${now - day}&endDay=${now + day}`)

  let allElements = []
  data.data.forEach(day => {
    allElements = allElements.concat(day.elements)
  })

  const currentShow = allElements.find(show => {
    const start = new Date(show.timeStart) / 1000
    const end = new Date(show.timeEnd) / 1000
    if (start < now && now < end) return true
    return false
  })

  res.status(200).json({
    id: currentShow.id,
    title: currentShow.title,
    topic: currentShow.topic,
    show: currentShow.title,
    timeStart: moment(currentShow.timeStart).format('YYYY-MM-DD[T]HH:mm:ssZ'),
    timeEnd: moment(currentShow.timeEnd).format('YYYY-MM-DD[T]HH:mm:ssZ'),
    length: currentShow.duration,
    type: currentShow.type,
    game: currentShow.game
  })
})

router.get('/schedule/next/5', async (req, res) => {
  const now = Math.floor(new Date() / 1000)
  const day = 86400
  const { data } = await api.get(`/schedule/normalized?startDay=${now - day}&endDay=${now + day}`)

  let allElements = []
  data.data.forEach(day => {
    allElements = allElements.concat(day.elements)
  })

  const currentShowIndex = allElements.findIndex(show => {
    const start = new Date(show.timeStart) / 1000
    const end = new Date(show.timeEnd) / 1000
    if (start < now && now < end) return true
    return false
  })

  let upcomingShows = []
  for (let i = currentShowIndex; i <= (currentShowIndex + 4); i++) {
    upcomingShows.push({
      id: allElements[i].id,
      title: allElements[i].title,
      topic: allElements[i].topic,
      show: allElements[i].title,
      timeStart: moment(allElements[i].timeStart).format('YYYY-MM-DD[T]HH:mm:ssZ'),
      timeEnd: moment(allElements[i].timeEnd).format('YYYY-MM-DD[T]HH:mm:ssZ'),
      length: allElements[i].duration,
      type: allElements[i].type,
      game: allElements[i].game
    })
  }

  res.status(200).json({ schedule: upcomingShows })
})

app.use(cacheControl)
app.use('/.netlify/functions/api', router)

module.exports = app
module.exports.handler = serverless(app)
