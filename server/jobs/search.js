'use strict';

GLOBAL.Promise = require('es6-promise').Promise;

var Stream  = require('../models/stream');
var ft      = require('../utils/api').ft;
var raven = require('next-wrapper').raven;

var Search = function () {
    this.stream = new Stream();
};

Search.prototype.fetch = function(q, c) {

    var query = q || 'page:Front page';
    var layout = 'components/stream/article-list';
    var count = c || 10;
    var methodePromise = ft.search(query, { quantity: c});
    var self = this;

    return methodePromise
        .then(function (results) {
            var articles = results.articles ? results.articles : [];
            if (!articles.length) {
                raven.captureMessage('No results returned for ' + q);
            }
            var ids = articles.map(function (article) {
                return article.id;
            });

            return ft.get(ids)
                .then( function (articles) {

                    var stream = new Stream();

                    articles.forEach(function (article) {
                        if (article) {
                            stream.push('methode', article);
                        }
                    });
                    console.log(stream.items.length + ' articles cached for ' + q);
                    self.stream = stream;

                });
        });

};

Search.prototype.init = function (query, count, interval) {
    var self = this;
    var fetch = function () {
        self.fetch(query, count);
    };

    // fetch every 20s and also immediately as the module is initialised
    setInterval(fetch, 20000);
    fetch();
};

module.exports = Search;
