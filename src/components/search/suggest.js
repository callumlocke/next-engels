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
	var suggest = this;
	this.$el.on('keyup', function(e){
		switch(e.which){
			case 13 : return;
			case 40 :
				suggest.onDownArrow.call(suggest, e);
				break;
			default :
				suggest.onType.call(suggest, e);
				break;
		}
	});
	this.$suggestions.on('keyup', 'a', this.onSuggestionKey.bind(this));
	this.$suggestions.on('click', 'a', this.onSuggestionClick.bind(this));
};

Suggest.prototype.onType = function onType(){
	var suggest = this;
  	this.$suggestions.empty();
	var suggestions = this.getSuggestions(this.$el.val());
	console.log('suggestions', suggestions);
	suggestions.forEach(function(suggestion){
		if(suggestion){
			suggest.$suggestions.append('<li><a href="#">' + suggestion + '</a></li>');
		}
	});
	if(suggestions.length){
		this.$suggestions.show();
	}else{
		this.$suggestions.hide();
	}
};

Suggest.prototype.onDownArrow = function onDownArrow(){
	var $suggestions = this.$suggestions.find('li');
	if($suggestions.length){
		$suggestions.first().find('a')[0].focus();
	}
};

Suggest.prototype.onSuggestionKey = function onSuggestionKey(e){
	if(e.which === 13){ // Enter pressed
		e.preventDefault();
		this.chooseSuggestion($(document.activeElement).text());
		return;
	}

	if(e.which === 40){ // down arrow pressed
		var $li = $(document.activeElement).parent().next('li');
		if($li.length){
			$li.find('a').focus();
		}
		return;
	}

	if(e.which === 38){ // up arrow pressed
		var $li = $(document.activeElement).parent().prev('li');
		if($li.length){
			$li.find('a').focus();
		}
		return;
	}
};

Suggest.prototype.onSuggestionClick = function onSuggestionClick(e){
	e.preventDefault();
	this.chooseSuggestion($(e.target).text());
};

Suggest.prototype.chooseSuggestion = function chooseSuggestion(suggestion){
	this.$el.val(suggestion);
	this.$suggestions.hide();
	this.$el[0].focus();
}


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
