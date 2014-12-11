'use strict';

var Search  = require('../jobs/search');
var Metrics = require('next-metrics');

// Periodically load these searches in to memory
var topStories = new Search();
topStories.init('page:Front page', 10);

var bigRead = new Search();
bigRead.init('page:The Big Read', 2);

var comment = new Search();
comment.init('page:comment', 5);

var lunch = new Search();
lunch.init('brand:Lunch with the FT', 1);

var globalInsight = new Search();
globalInsight.init('brand:Global Insight', 2);

module.exports = function(req, res) {
    Metrics.instrument(res, { as: 'express.http.res' });

    var highlights = [].concat(bigRead.stream.texturedItems, lunch.stream.texturedItems, globalInsight.stream.texturedItems);
    
    res.render('layout', {
        topStories: { related: [], items: topStories.stream.getTiled(1, 3), meta: [] }//,
        // secondary: [
        //     // { related: [], items: highlights, meta: [], title: 'FT Highlights' },
        //     { related: [], items: comment.stream.texturedItems, meta: [], title: 'Comment & columnists' }
        // ],
        // isFollowable: false,
        // isUserPage: false,
        // defaultHeaderPanel: true 
    });
};
