'use strict';

require('es6-promise').polyfill();

var expect  = require('chai').expect;
var sinon   = require('sinon');
var app     = require('../../server/app');
var nock = require('nock');
var request = require('request');
var server;

var article = require('fs').readFileSync('tests/fixtures/03b49444-16c9-11e3-bced-00144feabdc0', { encoding: 'utf8' });
var recommends = require('fs').readFileSync('tests/fixtures/recommends.xml', { encoding: 'utf8' });
var page = require('fs').readFileSync('tests/fixtures/page_front-page', { encoding: 'utf8' });
        
var host = 'http://localhost:3001';

var servesGoodHTML = function (url, done) {
    request
    .get(host + url, function (req, res) {
        expect(res.headers['content-type']).to.match(/text\/html/);
        expect(res.statusCode).to.equal(200);
        done();
    }, function (err) {
        console.log(err);
    });
};

var servesGoodJSON = function (url, done) {
    request
    .get(host + url, function (req, res) {
        expect(res.statusCode).to.equal(200);
        expect(res.headers['content-type']).to.match(/application\/json/);
        expect(function () {
            JSON.parse(res.body);
        }).to.not.throw();
        done();
    }, function (err) {
        console.log(err);
    });
};

var mockMethode = function (n) {
    nock('http://api.ft.com')
        .filteringPath(/v1\/.*\?apiKey=.*$/, 'v1/XXX?apiKey=YYY')
        .get('/content/items/v1/XXX?apiKey=YYY')
        .times(n || 20)
        .reply(200, article);
    nock('http://api.ft.com')
        .filteringPath(/apiKey=(.*)?$/, 'apiKey=YYY')
        .post('/content/search/v1?apiKey=YYY')
        .reply(200, page);
};

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
        mockMethode();
        servesGoodHTML('/', done);
    });
});
