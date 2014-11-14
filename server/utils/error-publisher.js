module.exports = function (res) {
    return function (err) {
        res.setStatus(500).send('error:' + err);
        if (process.env.NODE_ENV === 'production') {
            setTimeout(function() { throw err; });
        }
    };
};