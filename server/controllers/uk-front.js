'use strict';

var Search  = require('../jobs/search');
var Metrics = require('next-metrics');
var Stream = require('../models/stream');

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

    var highlights = Stream.merge(bigRead.stream, lunch.stream, globalInsight.stream);
    console.log(highlights.items);
    res.render('layout', {
        streams: [
            { 
                title: 'Top stories',
                related: [], 
                items: topStories.stream.getTiled(1, 3), 
                meta: [] 
            },
            { 
                title: 'FT Highlights',
                related: [],
                items: highlights.getTiled(1, 3),
                meta: []
            },
            { 
                related: [], 
                items: comment.stream.getTiled(1, 3), 
                meta: [], 
                title: 'Comment & columnists' 
            }
        ]//,
        // secondary: [
        //     // 
        //     
        // ],
        // isFollowable: false,
        // isUserPage: false,
        // defaultHeaderPanel: true 
    });
};
