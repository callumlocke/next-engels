'use strict';

var Search = require('../jobs/search');

var s = new Search();
s.init('page:Front page', 2);

module.exports = function(req, res) {

    res.json(s.stream.items);
    return;

    res.render(layout, {
        stream: { related: [], items: stream.items, meta: [] },
        isFollowable: false,
        defaultHeaderPanel: false 
    });

};
