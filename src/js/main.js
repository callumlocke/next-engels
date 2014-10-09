var search = require('../components/search/search.js');
var header = require('../components/header/main.js');
var splash = require('../components/splash/main.js');
var $ = require('jquery-browserify');

$.getJSON('http://ft-next-engels.herokuapp.com/engels/recommended')
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
