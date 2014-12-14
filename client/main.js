require('ft-next-wrapper');
require('next-article-card-component');

document.querySelector('[data-o-component="o-header"]').setAttribute('data-panel', 'search');
var $ = require('jquery');

var tile = require('../templates/components/tile.html');

if (FT.flags.ads.isSwitchedOn) {
    //Fixed position ads:
    window.jQuery = require('jquery');
    var filamentFixed = require('filament-fixed');
    var filamentSticky = require('filament-sticky');
    //Display ads: fixed-sticky plugin
    FixedSticky.tests.sticky = false;
    var ads = document.querySelectorAll('[data-display-ad]');
    for(var i = 0; i < ads.length; i++){
        $(ads[i]).fixedsticky();
    }    
}
