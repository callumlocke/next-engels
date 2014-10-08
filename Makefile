.PHONY: test
test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './node_modules/*' -o -name '*.min.*' \\)`

build:
	@./node_modules/.bin/node-sass --source-comments normal src/styles.scss > static/styles.css;
	@browserify src/js/main.js -o static/bundle.js

run: build
	@export apikey=`cat ~/.ftapi` ; nodemon server/app.js
