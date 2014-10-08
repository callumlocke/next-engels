require('es6-promise').polyfill();
var express = require('express');
var swig = require('swig');
var ft = require('ft-api-client')(process.env.apikey);

var port = process.env.PORT || 3001;
var app = module.exports = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../lib/templates');

// not for production
app.set('view cache', false);
swig.setDefaults({ cache: false });

swig.setFilter('resize', function(input, width, height) {
	return 'http://image.webservices.ft.com/v1/images/raw/' + encodeURIComponent(input) + '?width=' + width + '&height=' + height + '&source=docs&fit=cover';
});

app.use('/engels', express.static(__dirname + '/../src'));

// Appended to all successful responeses
var responseHeaders = {
    'Cache-Control': 'max-age=120, public'
};

app.get('/__gtg', function(req, res) {
	res.status(200).end();
});

app.get('/', function(req, res) {
	ft.search('page:Front page', 10)
		.then(function(articles) {
		    var ids;
		    if (articles[0] instanceof Object) {
			ids = articles.map(function(article) {
			    return article.id;
			});
		    } else {
			ids = articles;
		    }

		    ft
			.get(ids)
			.then(function(articles) {
				res.set(responseHeaders);
				res.render('base', {
					articles: articles
				});
			}, function(err) {
				res.status(404).end();
			});
		});
});

app.listen(port, function() {
	console.log("Listening on " + port);
});
