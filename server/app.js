require('es6-promise').polyfill();

var express = require('express');
var swig = require('swig');
var ft = require('ft-api-client')(process.env.apikey);
var request = require('request');
var parseString = require('xml2js').parseString;
var resize = require('../templates/helpers/resize');
var flags = require('next-feature-flags-client');
var Metrics = require('next-metrics');
var errorMiddleware = require('express-errors-handler').middleware;

Metrics.init({ app: 'engels', flushEvery: 30000 });

flags.init();

var port = process.env.PORT || 3001;
var app = module.exports = express();

function allIgnoreRejects(promises) {
    var neverFail = function(promise) {
        return new Promise(function(res, rej) {
            promise.then(res, function() {
                res();
            });
        });
    };
    return Promise.all(promises.map(neverFail));
}


require('ft-next-wrapper').setup(app, flags, {
    appname: 'engels'
});

app.set('views', __dirname + '/../templates');

app.set('view cache', false);
swig.setDefaults({ cache: false });

var assets = express.Router();
assets.use('/', express.static(require('path').join(__dirname, '../public'), { 
    maxAge: 120000 // 2 minutes 
}));

app.use('/engels', assets);

// Appended to all successful responeses
var responseHeaders = {
    'Cache-Control': 'max-age=120, public'
};

app.get('/__gtg', function(req, res) {
    res.status(200).end();
});

app.get('/', flags.middleware, require('./controllers/uk-front'));

app.use(errorMiddleware);

app.listen(port, function() {
    Metrics.count('express.start');
    console.log("Listening on " + port);
});
