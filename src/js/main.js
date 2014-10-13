var search = require('../components/search/search.js');
var header = require('../components/header/main.js');
var splash = require('../components/splash/main.js');
var resize = require('./resize');
var $ = require('jquery-browserify');

$.getJSON('/engels/recommended?eid='+document.cookie.match(/_EID=([0-9]+)_/)[1])
	.then(function(data) {
		var el = document.querySelector('.recommended');
		el.innerHTML = '<ul>' + renderAllRecommended(data) + '</ul>';
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
	});


function renderAllRecommended(data) {
	return data.map(function(item) {
		return '<li data-o-grid-colspan="6 M6 L3 XL3">'
				+ '<a class="tile tile--small" href="/'+item.id+'">'
					+ (item.largestImage ? '<img class="tile__image" src="' + resize(item.largestImage, 600, 338) + '" />' : '')
					+ '<div class="tile__title">'+item.headline+'</div>'
				+ '</a>'
			+ '</li>';
	}).join('');
}

search.init();
