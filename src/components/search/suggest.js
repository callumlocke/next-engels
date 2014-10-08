var $ = require('jquery-browserify');

function Suggest(el, data){
	this.$el = $(el);
	this.data = data;
	this.$container = null;
	this.$suggestions = null;
	this.minLength = 3;
	this.setup();
	this.addEvents();
}

Suggest.prototype.setup = function setup(){
	var div = $('<div><ul></ul></div>');
	this.$container = div;
	this.$suggestions = div.find('ul');
	this.$el.parent().append(div);
};

Suggest.prototype.addEvents = function addEvents(){
	this.$el.on('keyup', this.onType.bind(this));
};

Suggest.prototype.onType = function onType(){
	var suggest = this;
  	this.$suggestions.empty();
	var suggestions = this.getSuggestions(this.$el.val());
	console.log('suggestions', suggestions);
	suggestions.forEach(function(suggestion){
		suggest.$suggestions.append('<li>' + suggestion + '</li>');
	});
};

Suggest.prototype.getSuggestions = function getSuggestions(text){
	if(text.length < this.minLength){
		return [];
	}
	text = text.toLowerCase();
	return this.data.filter(function(item){
		return item.key.indexOf(text) > -1;
	}).map(function(item){
		return item.value;
	});
};

module.exports = Suggest;
