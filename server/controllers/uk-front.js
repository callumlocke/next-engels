'use strict';

var Search  = require('../jobs/search');
var Topic  = require('../jobs/topic');
var Metrics = require('next-metrics');
var Stream = require('../models/stream');

// Periodically load these searches in to memory
var topStories = new Search().init('page:Front page', 10);

var bigRead = new Search().init('page:The Big Read', 5);

var comment = new Search().init('page:comment', 10);

var lunch = new Search().init('brand:Lunch with the FT', 5);

var globalInsight = new Search().init('brand:Global Insight', 5);

var topics = [
    'Living With Cheaper Oil',
    'Crisis in Ukraine',
    'Britain and the Cuts',
    'Syria Crisis', 
    'Climate change', 
    'Cyber warfare'
].map(function (topic) {
    return new Topic().init(topic);
});


module.exports = function(req, res) {
    Metrics.instrument(res, { as: 'express.http.res' });

    var highlights = Stream.merge(bigRead.stream, lunch.stream, globalInsight.stream);

    res.render('layout', {
        segments: [
            { 
                title: 'Top stories',
                type: 'tiled-article-stream',
                related: [], 
                items: topStories.stream.getTiled(1, 3), 
                meta: [] 
            },
            { 
                title: 'FT Highlights',
                type: 'tiled-article-stream',
                related: [],
                items: highlights.getTiled(1, 3),
                meta: []
            },
            { 
                title: 'Comment & columnists' ,
                type: 'tiled-article-stream',
                related: [], 
                items: comment.stream.getTiled(1, 3), 
                meta: []
            },
            { 
                title: 'FT New Themes' ,
                type: 'curated-topics',
                items: topics.map(function (topic) {
                    return {
                        title: topic.name,
                        primaryTheme: topic.primaryTheme,
                        articles: topic.articles.slice(0, 3)
                    };
                }), 
                meta: []
            }

        ]
    });
};