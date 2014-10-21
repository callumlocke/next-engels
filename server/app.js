require('es6-promise').polyfill();
var express = require('express');
var swig = require('swig');
var ft = require('ft-api-client')(process.env.apikey);
var request = require('request');
var parseString = require('xml2js').parseString;
var resize = require('../src/js/resize');

var port = process.env.PORT || 3001;
var app = module.exports = express();
app.use(raven.middleware.express(process.env.RAVEN_URL));

function allIgnoreRejects(promises) {
	var neverFail = function(promise) {
		return new Promise(function(res, rej) {
			promise.then(res, function() {
				res();
			});
		});
	};
	return Promise.all(promises.map(neverFail));
}

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/../templates');

// not for production
app.set('view cache', false);
swig.setDefaults({ cache: false });

swig.setFilter('resize', resize);

app.use('/engels', express.static(__dirname + '/../static'));

// Appended to all successful responeses
var responseHeaders = {
    'Cache-Control': 'max-age=120, public'
};
app.get('/__gtg', function(req, res) {
	res.status(200).end();
});

app.get('/', function(req, res) {
	ft.search('page:Front page', 9)
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
					articles: articles,
					themes: [
						'Scottish Independence',
						'Falling UK Inflation',
						'The War Against ISIS',
						'European Central Bank Rates',
						'EPA Carbon Ruling',
						'The Crisis In Ukraine'
					]
				});
			}, function(err) {
				res.status(404).end();
			});
		});
});

app.use('/engels/recommended', function(req, res) {
	res.set(responseHeaders);
	if (req.query && req.query.eid) {
		request('http://79.125.2.81/focus/api?method=getrec&uid='+req.query.eid, function(error, resp, body) {
			parseString(body, function(err, result) {
				var ids = result.rsp.item.map(function(item) {
					return item.$.id;
				});
				allIgnoreRejects(ids.map(function(id) {
					return ft.get(id);
				}))
					.then(function(recommended) {
						recommended = recommended.filter(function(item) {
							var daysOld = (Date.now() - (new Date(item.raw.item.lifecycle.lastPublishDateTime)).getTime())/1000/60/60/24;
							return item !== undefined && daysOld <= 7;
						});
						recommended = recommended.map(function(item) {
							return {
								id: item.id,
								headline: item.raw.item && item.raw.item.title && item.raw.item.title.title,
								largestImage: { url: item.largestImage && item.largestImage.url },
								primarySection: {
									name: item.raw.item && item.raw.item.metadata && item.raw.item.metadata.primarySection && item.raw.item.metadata.primarySection.term && item.raw.item.metadata.primarySection.term.name
								},
								lastPublishDateTime: item.raw.item.lifecycle.lastPublishDateTime
							};
						});
						res.json(recommended);
					});
			});
		});
	} else {
		res.json([]);
	}
});

app.listen(port, function() {
	console.log("Listening on " + port);
});
