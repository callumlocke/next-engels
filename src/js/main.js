var $ = require('jquery-browserify');
var search = require('../components/search/search.js');

function getData(){
	return $.getJSON('engels/recommended');
}

$.getJSON('/engels/recommended')
	.then(function(data) {
		var el = document.querySelector('.recommended');
		el.innerHTML = '<h3>Recommended reads</h3><ul>' + renderAllRecommended(data) + '</ul>';

	});


function renderAllRecommended(data) {
	return data.map(function(item) {
		return '<li><a href="/'+item.id+'">'+item.headline+'</a></li>';
	}).join('');
}

search.init();
