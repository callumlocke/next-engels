var express = require('express');
var port = process.env.PORT || 3001;
var app = express();

app.use('/', express.static(__dirname + '/../src'));

app.listen(port, function() {
	console.log("Listening on " + port);
});
