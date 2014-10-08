var $ = require('jquery-browserify');

function Suggest(el, data){
	this.$el = $(el);
	this.data = data;
	this.$container = null;
	this.$suggestions = null;
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
	this.$el.on('keydown', this.onKeyDown.bind(this));
};

Suggest.prototype.onKeyDown = function onKeyDown(){
	var suggest = this;
  	this.$suggestions.empty();
	var suggestions = this.getSuggestions(this.$el.val());
	suggestions.forEach(function(suggestion){
		suggest.$suggestions.append('<li>' + suggestion + '</li>');
	});
};

Suggest.prototype.getSuggestions = function getSuggestions(text){
	return this.data.filter(function(item){
		return item.indexOf(text) > -1;
	});
};

module.exports = Suggest;
