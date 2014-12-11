PORT := 3002
app := ft-next-engels
OBT := $(shell which origami-build-tools)
ROUTER := $(shell which next-router)
API_KEY := $(@shell cat ~/.ftapi)

.PHONY: test

install:
ifeq ($(OBT),)
	@echo "You need to install origami build tools first!  See docs here: http://origami.ft.com/docs/developer-guide/building-modules/"
	exit 1
endif
ifeq ($(ROUTER),)
	@echo "You need to install the next router first!  See docs here: https://github.com/Financial-Times/next-router"
	exit 1
endif
ifeq ($(API_KEY),)
	@echo "You need an api key!  Speak to one of the next team to get one"
	exit 1
endif
	origami-build-tools install


test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './tmp/*' -o -path './node-v0.10.32-linux-x64/*' -o -path './node_modules/*' -o -name '*.min.*' -o -path './bower_components/*' -o -path './public/*' \\)`
	# Run all tests except for smoke tests
	export HOSTEDGRAPHITE_APIKEY=123; export ENVIRONMENT=production; ./node_modules/.bin/mocha --reporter spec -i -g 'smoke tests' tests/server/

smoke-test:
	export HOSTEDGRAPHITE_APIKEY=123; export ENVIRONMENT=production; ./node_modules/.bin/mocha --reporter spec -g 'smoke tests' tests/server/

test-debug:
	./node_modules/.bin/mocha --debug-brk --reporter spec -i tests/server/ 

run:
	$(MAKE) _run -j2

_run: run-local run-router

run-local:
	export HOSTEDGRAPHITE_APIKEY=123; export apikey=${API_KEY} ; export ENVIRONMENT=development; export PORT=${PORT}; nodemon --watch server server/app.js;

run-router:
	export engels=${PORT}; export PORT=5050; export DEBUG=proxy ; next-router

debug:
	export apikey=${API_KEY} ; export PORT=${PORT}; node --debug-brk server/app.js

build:
	export ENVIRONMENT=development; ./node_modules/.bin/gulp

build-production:
	@./node_modules/.bin/bower install
	@./node_modules/.bin/gulp

watch:
	export ENVIRONMENT=development; ./node_modules/.bin/gulp watch

clean:
	# Clean+install dependencies
	git clean -fxd
	$(MAKE) install

deploy:

	# Pre-deploy clean
	npm prune --production

	# Package+deploy
	@./node_modules/.bin/haikro build deploy \
		--app $(app) \
		--heroku-token $(HEROKU_AUTH_TOKEN) \
		--commit `git rev-parse HEAD` \
		--verbose

clean-deploy: clean deploy
