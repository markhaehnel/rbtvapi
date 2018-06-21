module.exports = (req, res, next) => {
    res.header('Content-Type', 'application/json; charset=utf-8');
    next();
}
