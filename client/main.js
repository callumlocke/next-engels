/*global FixedSticky*/
'use strict';

require('ft-next-wrapper');
require('next-header');
require('next-article-card-component');
var flags = require('next-feature-flags-client');
var $ = require('jquery');

flags.init()
	.then(function() {
		if (flags.get('ads').isSwitchedOn) {
			//Fixed position ads:
			window.jQuery = require('jquery');
			require('filament-fixed');
			require('filament-sticky');
			//Display ads: fixed-sticky plugin
			FixedSticky.tests.sticky = false;
			var ads = document.querySelectorAll('[data-display-ad]');
			for (var i = 0; i < ads.length; i++) {
				$(ads[i]).fixedsticky();
			}
		}
	});
