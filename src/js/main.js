require('next-header');
var search = require('../components/search/search.js');
var header = require('../components/header/main.js');
var $ = require('jquery-browserify');
var swig = require('swig/index');

swig.setFilter('resize', require('./resize'));

var tile = require('../../templates/partials/tile.html');

$.getJSON('/engels/recommended?eid='+document.cookie.match(/_EID=([0-9]+)_/)[1])
	.then(function(data) {
		var el = document.querySelector('.recommended');
		el.innerHTML = '<ul>' + renderAllRecommended(data) + '</ul>';
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
	});


function renderAllRecommended(data) {
	return data.map(function(item) {
		return swig.render(tile, {locals: {article: item, isInList: true, isLarge: false}});
	}).join('');
}

search.init();
