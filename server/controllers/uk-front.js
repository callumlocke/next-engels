'use strict';

var Search  = require('../jobs/search');
var Metrics = require('next-metrics');
var Stream = require('../models/stream');

// Periodically load these searches in to memory
var topStories = new Search().init('page:Front page', 10);

var bigRead = new Search().init('page:The Big Read', 5);

var comment = new Search().init('page:comment', 5);

var lunch = new Search().init('brand:Lunch with the FT', 5);

var globalInsight = new Search().init('brand:Global Insight', 5);

module.exports = function(req, res) {
    Metrics.instrument(res, { as: 'express.http.res' });

    var highlights = Stream.merge(bigRead.stream, lunch.stream, globalInsight.stream);
    
    require('../utils/cache-control')(res);

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
                title: 'Comment & columnists' ,
                related: [], 
                items: comment.stream.getTiled(1, 3), 
                meta: []
            }
        ]
    });
};
