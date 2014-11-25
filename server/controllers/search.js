'use strict';

var Search = require('../jobs/search');

// Periodically load these searches in to memory
var topStories = new Search();
topStories.init('page:Front page', 10);

var bigRead = new Search();
bigRead.init('page:The Big Read', 5);

var comment = new Search();
comment.init('page:comment', 5);

module.exports = function(req, res) {
    res.render('layout', {
        streams: [
            { related: [], items: topStories.stream.items, meta: [], title: 'Top stories' },
            { related: [], items: bigRead.stream.items, meta: [], title: 'FT Highlights' },
            { related: [], items: comment.stream.items, meta: [], title: 'Comment & columnists' }
        ],
        isFollowable: false,
        isUserPage: false,
        defaultHeaderPanel: true 
    });
};
