module.exports = (req, res, next) => {
  res.header('Cache-Control', 'public, max-age=120')
  next()
}
