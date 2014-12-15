/*jshint node:true*/
'use strict';

var express = require('ft-next-express');
var Metrics = require('next-metrics');

Metrics.init({ app: 'engels', flushEvery: 30000 });

var port = process.env.PORT || 3001;
var app = module.exports = express();

app.get('/__gtg', function(req, res) {
	res.status(200).end();
});

app.get('/', require('./controllers/uk-front'));

app.listen(port, function() {
	Metrics.count('express.start');
	console.log("Listening on " + port);
});
