'use strict';

var Stream  = require('../models/stream');
var ft      = require('../utils/api').ft;
var raven = require('next-wrapper').raven;


var Topic = function () {
    this.articles = [];
};

Topic.prototype.fetch = function(topicName) {
    var query = 'page:' + topicName;
    var methodePromise = ft.search(query);
    var self = this;
    return methodePromise
        .then(function (results) {
            var articles = results.articles ? results.articles : [];
            if (!articles.length) {
                raven.captureMessage('No results returned for topic ' + topicName);
            }
            console.log(articles.length + ' articles cached for topic ' + topicName);
            self.articles = articles.map(function (article) {
                return {
                    id: article.id,
                    headline: article.headline
                };
            });
            self.primaryTheme = articles[0].primaryTheme;
        });

};

Topic.prototype.init = function (topicName) {
    this.name = topicName;
    var self = this;
    var fetch = function () {
        self.fetch(topicName);
    };

    // fetch every 20s and also immediately as the module is initialised
    setInterval(fetch, 20000);
    fetch();
    return this;
};

module.exports = Topic;
