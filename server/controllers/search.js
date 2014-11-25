'use strict';

var Search = require('../jobs/search');

var frontPage = new Search();
frontPage.init('page:Front page', 2);

var bigRead = new Search();
bigRead.init('page:The Big Read', 2);

module.exports = function(req, res) {

    res.json({
        frontPage: frontPage.stream.items,
        bigRead: bigRead.stream.items
    });
    return;

    res.render(layout, {
        stream: { related: [], items: stream.items, meta: [] },
        isFollowable: false,
        defaultHeaderPanel: false 
    });

};
