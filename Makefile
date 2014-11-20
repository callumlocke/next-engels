PORT := 3002
app := ft-next-engels

.PHONY: test

install:
ifeq ($(BUNDLER_EXISTS),)
	@echo "Install Bundler globally"
	@sudo gem install bundler
endif
	@echo "\nInstalling Ruby gems…"
	@bundle install
	@echo "\nInstalling Node modules. This might take a while…"
	@npm install --silent
	@echo "\nInstalling Bower components…"
	@./node_modules/.bin/bower install --silent
	@echo "\nBuilding project assets…"
	@$(MAKE) build
	@echo "\nRunning smoke tests…"
	@$(MAKE) smoke-test
	@echo "\nYou're good to go!\nType 'make run' and open http://localhost:5050"


test:
	./node_modules/.bin/jshint `find . \\( -name '*.js' -o -name '*.json' \\) ! \\( -path './tmp/*' -o -path './node-v0.10.32-linux-x64/*' -o -path './node_modules/*' -o -name '*.min.*' -o -path './bower_components/*' -o -path './public/*' \\)`
	# Run all tests except for smoke tests
	export ENVIRONMENT=production; ./node_modules/.bin/mocha --reporter spec -i -g 'smoke tests' tests/server/

smoke-test:
	export ENVIRONMENT=production; ./node_modules/.bin/mocha --reporter spec -g 'smoke tests' tests/server/

test-debug:
	./node_modules/.bin/mocha --debug-brk --reporter spec -i tests/server/ 

run:
	$(MAKE) _run -j2

_run: run-local run-router

run-local:
	export apikey=`cat ~/.ftapi` ; export ENVIRONMENT=development; export PORT=${PORT}; nodemon --watch server server/app.js;

run-router:
	export engels=${PORT}; export PORT=5050; export DEBUG=proxy ; next-router

debug:
	export apikey=`cat ~/.ftapi` ; export PORT=${PORT}; node --debug-brk server/app.js

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
		--token $(HEROKU_AUTH_TOKEN) \
		--commit `git rev-parse HEAD` \
		--verbose

clean-deploy: clean deploy
