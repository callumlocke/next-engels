'use strict';

require('es6-promise').polyfill();

var expect  = require('chai').expect;
var sinon   = require('sinon');
var app     = require('../../server/app');
var nock = require('nock');
var request = require('request');
var server;

var article = require('fs').readFileSync('node_modules/ft-api-client/test/fixtures/03b49444-16c9-11e3-bced-00144feabdc0', { encoding: 'utf8' });
var recommends = require('fs').readFileSync('tests/fixtures/recommends.xml', { encoding: 'utf8' });
var page = require('fs').readFileSync('node_modules/ft-api-client/test/fixtures/page_front-page', { encoding: 'utf8' });
        

describe('smoke tests for the app', function () {

    it('Should serve a good to go page', function(done) {
        request
        .get('http://localhost:3001/__gtg', function (req, res) {
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('Should serve a main.js file', function(done) {
        request
        .get('http://localhost:3001/engels/main.js', function (req, res) {
            expect(res.headers['content-type']).to.match(/application\/javascript/);
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('Should serve a main.css file', function(done) {
        request
        .get('http://localhost:3001/engels/main.css', function (req, res) {
            expect(res.headers['content-type']).to.match(/text\/css/);
            expect(res.statusCode).to.equal(200);
            done();
        });
    });

    it('Should serve an index page', function(done) {
 
        nock('http://api.ft.com')
            .filteringPath(/pages\/.*\/main-content/, 'pages/XXX/main-content')
            .get('/site/v1/pages/XXX/main-content?apiKey=')
            .reply(200, page);

        nock('http://api.ft.com')
            .filteringPath(/v1\/.*\?/, 'v1/XXX?')
            .get('/content/items/v1/XXX?apiKey=')
            .times(20)
            .reply(200, article);

        request
        .get('http://localhost:3001/', function (req, res) {
            expect(res.headers['content-type']).to.match(/text\/html/);
            expect(res.statusCode).to.equal(200);
            done();
        }, function (err) {
            console.log(err);
        });
    });

    it('Should serve a recommendations json', function(done) {

        nock('http://79.125.2.81')
            .filteringPath(/pages\/.*\/main-content/, 'pages/XXX/main-content')
            .get('/focus/api?method=getrec&uid=123')
            .reply(200, recommends);

        nock('http://api.ft.com')
            .filteringPath(/v1\/.*\?/, 'v1/XXX?')
            .get('/content/items/v1/XXX?apiKey=')
            .times(20)
            .reply(200, article);

        request
        .get('http://localhost:3001/engels/recommended?eid=123', function (req, res) {
            expect(res.statusCode).to.equal(200);
            expect(res.headers['content-type']).to.match(/application\/json/);
            expect(function () {
                JSON.parse(res.body);
            }).to.not.throw();
            done();
        }, function (err) {
            console.log(err);
        });
    });
    
});