'use strict';

GLOBAL.Promise = require('es6-promise').Promise;

var Stream  = require('../models/stream');
var ft      = require('ft-api-client')(process.env.apikey);

var Search = function () {
    this.stream = new Stream();
}

Search.prototype.fetch = function(query, count) {
    
    var query = query || 'page:Front page'; 
    var layout = 'components/stream/article-list';
    var count = count || 10;
    var methodePromise = ft.search(query, count);
    var stream = new Stream();
    var self = this;

    return methodePromise
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
                    var stream = new Stream();
                    articles.forEach(function (article) {
                        if(article) {
                            stream.push('methode', article);
                        }
                    });
                   
                    self.stream = stream;
                    
                    resolve('hello');

                    res.render(layout, {
                        stream: { related: [], items: stream.items, meta: [] },
                        isFollowable: false,
                        defaultHeaderPanel: false 
                    });

            }, function(err) {
                reject(err);
            }).catch(function (err) {
                reject(err);
            });
    });

};

Search.prototype.init = function (query, count, interval) {
    var self = this;
    setInterval(function () {
        console.log('fetching...')
        self.fetch(query, count).then(function () {
            console.log('fetched!', self.stream);
        })
    }, 5000);
}

module.exports = Search;
