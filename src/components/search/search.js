var $ = require('jquery-browserify'),
	Suggest = require('./suggest.js');

function getData(){
	return $.getJSON('engels/pagesmap.json');
}

function parseData(d){
	var result = [];

}

function setupAutocomplete(data){
	var suggest = new Suggest(document.querySelector('.search input[type="search"]'), data);
}

function fail(e){
	console.error(e);
	throw "Failed :(";
}

function init(){
	getData().then(setupAutocomplete, fail);
}

exports.init = init;

