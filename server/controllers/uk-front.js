'use strict';

var Search = require('../jobs/search');
var Topic = require('../jobs/topic');
var Metrics = require('next-metrics');
var Stream = require('../models/stream');
var cacheControl = require('../utils/cache-control');

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
	var segments = [
		{
			title: 'Top stories',
			items: topStories.getTiled(1, 3)
		},
		{
			title: 'FT Highlights',
			items: highlights.getTiled(1, 3)
		},
		{
			title: 'Comment & columnists' ,
			items: comment.stream.getTiled(1, 3)
		}
	];


	if (res.locals.flags && res.locals.flags.homePageThemes && res.locals.flags.homePageThemes.isSwitchedOn) {
		segments.push({
			title: 'FT New Themes',
			isCuratedTopic: true,
			items: topics.map(function(topic) {
				return {
					title: topic.name,
					articles: topic.articles.slice(0, 3)
				};
			})
		});
	}

	res.set(cacheControl);
	res.render('layout', {
		segments: segments,
		defaultHeaderPanel: 'search'
	});
};
