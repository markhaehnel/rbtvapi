/* huge module for request logging */
module.exports = (req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.protocol} ${req.method} ${req.path} (${req.ip})`);
    next();
}