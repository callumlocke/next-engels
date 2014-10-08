.PHONY: test
test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './node_modules/*' -o -name '*.min.*' \\)`

build:
	@./node_modules/.bin/node-sass --source-comments normal static/styles.scss static/styles.css; browserify static/js/main.js -o static/js/bundle.js

run: build
	@export apikey=`cat ~/.ftapi` ; nodemon server/app.js
