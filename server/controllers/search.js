'use strict';

var Stream = require('../models/stream');

var ft = require('ft-api-client')(process.env.apikey);

var isTaxonomySearch = function(q) {
    return /(.*):(.*)/.test(q);
};

var formatSection = function (s) {
    if(isTaxonomySearch(s)) {
        var a = s.split(':')[1].replace(/"/g, '');
        return a;
    }
    return 'Search results: ' + s;
};

module.exports = function(req, res) {
    
    var query = 'page:Front page'; 
    var layout = req.query.partial ? 'components/stream/article-list' : 'layout';
    var methodePromise = ft.search(query, 6);

    Promise.all([methodePromise])
        .then(function (results) {
   
            var articles = results[0] ? results[0].articles : [];

            if (!articles.length){
                res.sendStatus(404);
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

                    res.render(layout, {
                        stream: { related: [], items: stream.items, meta: [] },
                        isFollowable: false,
                        defaultHeaderPanel: false 
                    });

                }, function(err) {
                    console.log(err);
                    res.sendStatus(404);
                }).catch(function (err) {
                    console.log('error', err); res.sendStatus(404);
                });

    }, function (err) { 
            console.log('ERR', err);
    })
    .catch(function (err) {
        console.log('error', err); res.sendStatus(404);
    });

};
