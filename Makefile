.PHONY: test
test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './node_modules/*' -o -name '*.min.*' \\)`

run:
	@export apikey=`cat ~/.ftapi` ; nodemon server/app.js
