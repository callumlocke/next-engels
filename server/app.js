
require('es6-promise').polyfill();

var express = require('express');
var swig = require('swig');
var ft = require('ft-api-client')(process.env.apikey);
var request = require('request');
var parseString = require('xml2js').parseString;
var resize = require('../templates/helpers/resize');
var flags = require('next-feature-flags-client');
var Metrics = require('next-metrics');

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


require('next-wrapper').setup(app, require('next-feature-flags-client'), {
    appname: 'engels'
});

app.set('views', __dirname + '/../templates');

// not for production
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use('/engels', express.static(__dirname + '/../public'));

// Appended to all successful responeses
var responseHeaders = {
    'Cache-Control': 'max-age=120, public'
};

app.get('/__gtg', function(req, res) {
    res.status(200).end();
});

app.get('/', require('./controllers/uk-front'));

app.use(require('next-wrapper/node/raven'));

app.listen(port, function() {
    Metrics.count('express.start');
    console.log("Listening on " + port);
});
