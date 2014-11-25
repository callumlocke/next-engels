'use strict';

var Search = require('../jobs/search');

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
    var highlights = [].concat(bigRead.stream.items, lunch.stream.items, globalInsight.stream.items);
    res.render('layout', {
        topStories: [
            { related: [], items: topStories.stream.items.slice(0, 5), meta: [] },
            { related: [], items: topStories.stream.items.slice(6, 11), meta: [] }
        ],
        secondary: [
                { related: [], items: highlights, meta: [], title: 'FT Highlights' },
                { related: [], items: comment.stream.items, meta: [], title: 'Comment & columnists' }
        ],
        isFollowable: false,
        isUserPage: false,
        defaultHeaderPanel: true 
    });
};
