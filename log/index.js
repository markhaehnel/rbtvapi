/* huge module for request logging */
module.exports = (req, res, next) => {
    console.log(new Date().toISOString(), req.method, req.path);
    next();
}