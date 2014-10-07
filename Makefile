.PHONY: test
test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './node_modules/*' -o -name '*.min.*' \\)`

build:
	@./node_modules/.bin/node-sass src/styles.scss --stdout > src/styles.css

run:
	@export apikey=`cat ~/.ftapi` ; nodemon server/app.js
