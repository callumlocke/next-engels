module.exports = function(input, width, height) {
	return 'http://image.webservices.ft.com/v1/images/raw/' + encodeURIComponent(input) + '?width=' + width + '&height=' + height + '&source=docs&fit=cover';
};
