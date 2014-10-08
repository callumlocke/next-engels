var $ = require('jquery-browserify'),
	Suggest = require('./suggest.js');

function getData(){
	return $.getJSON('engels/pagesmap.json');
}

function parseData(d){
	var titles = Object.keys(d.data.titles),
		result = [];
	titles.forEach(function(title){
		result.push({key:title.toLowerCase(), value:title});
	});

	return result;
}

function setupAutocomplete(data){
	var suggest = new Suggest(document.querySelector('.search input[type="search"]'), data);
}

function fail(e){
	console.error(e);
	throw "Failed :(";
}

function init(){
	getData().then(function(data){
		setupAutocomplete(parseData(data));
	}, fail);
}

exports.init = init;

