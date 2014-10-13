PORT := 3002

.PHONY: test
test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './node_modules/*' -o -name '*.min.*' -o -name 'bundle.js' \\)`

run:
	$(MAKE) _run -j2

_run: run-local run-router

run-local: build
	export apikey=`cat ~/.ftapi` ; export PORT=${PORT}; nodemon server/app.js

run-router:
	export homepage=${PORT}; export engels=${PORT}; export PORT=5050; export DEBUG=proxy ; next-router

build:
	@./node_modules/.bin/node-sass --source-comments normal src/scss/styles.scss > static/styles.css;
	@./node_modules/.bin/browserify src/js/main.js > static/bundle.js
