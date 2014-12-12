# Next Engels [![Codeship Status for Financial-Times/next-engels](https://codeship.com/projects/97825450-6419-0132-c840-164ea2c5352e/status)](https://codeship.com/projects/52501)

Engels is apparently a vintage aircraft of some kind. It's also the application which delivers the home page for next.ft.com


## Installation

```
git clone https://github.com/Financial-Times/next-engels.git
npm install
```

## Dependencies

Please install `next-router` globally.

## Run

Just run engels on its own (localhost:3002):

```
make run-local
```

Run engels through the router (localhost:5050):

```
make run
```

## Troubleshooting

Note origami-build-tools isn't compatible with all versions of SASS.  If you are getting errors (particularly with SASS 3.4) try running `bundle install` within this directory and prefixing all commands with `bundle exec`, e.g. `bundle exec make build`.
