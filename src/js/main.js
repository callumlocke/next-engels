var search = require('../components/search/search.js');
var header = require('../components/header/main.js');
var splash = require('../components/splash/main.js');
var $ = require('jquery-browserify');

$.getJSON('/engels/recommended?eid='+document.cookie.match(/_EID=([0-9]+)_/)[1])
	.then(function(data) {
		var el = document.querySelector('.recommended');
		el.innerHTML = '<ul>' + renderAllRecommended(data) + '</ul>';

	});


function renderAllRecommended(data) {
	return data.map(function(item) {
		return '<li><a href="/'+item.id+'">'+item.headline+'</a></li>';
	}).join('');
}

search.init();
