'use strict';

GLOBAL.Promise = require('es6-promise').Promise;

var Stream  = require('../models/stream');
var ft      = require('../utils/api').ft;

var Search = function () {
    this.stream = new Stream();
};

Search.prototype.fetch = function(q, c) {
    
    var query = q || 'page:Front page'; 
    var layout = 'components/stream/article-list';
    var count = c || 10;
    var methodePromise = ft.search(query, count);
    var stream = new Stream();
    var self = this;

    return new Promise(function(resolve, reject) {
        methodePromise
        .then(function (results) {
            var articles = results.articles ? results.articles : [];
            
            if (!articles.length){
                reject(404);
                return;
            }
            
            var ids = articles.map(function (article) {
                return article.id;
            });

            ft.get(ids)
                .then( function (articles) {
                    console.log(q, articles);
                    var stream = new Stream();

                    articles.forEach(function (article) {
                        if(article) {
                            stream.push('methode', article);
                        }
                    });
                   
                    self.stream = stream;
                    resolve();

            }, function(err) {
                console.log('rhys', err);
                reject(err);
            }).catch(function (err) {
                console.log(err);
                reject(err);
            });
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
