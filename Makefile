PORT := 3002
app := ft-next-engels

.PHONY: test

test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './tmp/*' -o -path './node-v0.10.32-linux-x64/*' -o -path './node_modules/*' -o -name '*.min.*' -o -path './bower_components/*' -o -path './public/*' \\)`
	# Run all tests except for smoke tests
	export ENVIRONMENT=production; ./node_modules/.bin/mocha --reporter spec -i -g 'smoke tests' tests/server/

smoke-test:
	export ENVIRONMENT=production; ./node_modules/.bin/mocha --reporter spec -g 'smoke tests' tests/server/

run:
	$(MAKE) _run -j2

_run: run-local run-router

run-local:
	export apikey=`cat ~/.ftapi` ; export ENVIRONMENT=development; export PORT=${PORT}; nodemon --watch server server/app.js;

run-router:
	export engels=${PORT}; export PORT=5050; export DEBUG=proxy ; next-router

build:
	export ENVIRONMENT=development; ./node_modules/.bin/gulp

build-production:
	./node_modules/.bin/gulp
	$(make) smoke-test 

watch:
	export ENVIRONMENT=development; ./node_modules/.bin/gulp watch

deploy:
	# Clean+install dependencies
	git clean -fxd
	npm install
	$(MAKE) deploy-without-clean-and-install

deploy-without-clean-and-install:
	./node_modules/.bin/bower install

	# Build steps
	$(MAKE) build-production

	# Pre-deploy clean
	npm prune --production

	# Package+deploy
	@./node_modules/.bin/haikro build deploy \
		--app $(app) \
		--token $(HEROKU_AUTH_TOKEN) \
		--commit `git rev-parse HEAD`