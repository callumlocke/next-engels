require('next-header');
var $ = require('jquery-browserify');
var swig = require('swig/index');
//Fixed position ads:
var filamentFixed = require('filament-fixed');
var filamentSticky = require('filament-sticky');

swig.setFilter('resize', require('../templates/helpers/resize'));

var tile = require('../templates/components/tile.html');
try {
$.getJSON('/engels/recommended?eid='+document.cookie.match(/_EID=([0-9]+)_/)[1])
	.then(function(data) {
		var el = document.querySelector('.recommended');
		el.innerHTML = '<ul>' + renderAllRecommended(data) + '</ul>';
		document.dispatchEvent(new CustomEvent('o.DOMContentLoaded'));
	});
} catch (e) {}

function renderAllRecommended(data) {
	return data.map(function(item) {
		return swig.render(tile, {locals: {article: item, isInList: true, isLarge: false}});
	}).join('');
}

//Display ads: fixed-sticky plugin
FixedSticky.tests.sticky = false;
var ads = document.querySelectorAll('[data-display-ad]');
for(var i = 0; i < ads.length; i++){
	$(ads[i]).fixedsticky();
}

search.init();
