require('es6-promise').polyfill();
var express = require('express');
var swig = require('swig');
var ft = require('ft-api-client')(process.env.apikey);
var request = require('request');
var parseString = require('xml2js').parseString;
var resize = require('../templates/helpers/resize');
var flags = require('next-feature-flags-client');

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

app.get('/', function(req, res) {

    ft.search('page:Front page', 9)
        .then(function(articles) {
            var ids;
            if (articles[0] instanceof Object) {
                ids = articles.map(function(article) {
                    return article.id;
                });
            } else {
                ids = articles;
            }

            ft
            .get(ids)
            .then(function(articles) {
                res.set(responseHeaders);
                res.render('layout', {
                    articles: articles,
                    themes: [
                        'Scottish Independence',
                        'Falling UK Inflation',
                        'The War Against ISIS',
                        'European Central Bank Rates',
                        'EPA Carbon Ruling',
                        'The Crisis In Ukraine'
                    ],
                });
            }, function(err) {
                res.status(404).end();
            });
        }, function (err) {
            console.log(err);
        }).catch(function (err) {
            console.log(err);
        });
});

app.listen(port, function() {
    console.log("Listening on " + port);
});
