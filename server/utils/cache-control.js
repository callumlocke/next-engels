'use strict';

module.exports = function (res) {
    if(!res.get('Cache-Control')) {
        res.set({
            'Cache-Control': 'max-age=60, public, stale-while-revalidate=86400, stale-if-error=86400'
        });
    }
};
