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
        
var servesGoodHTML = function (url, done) {
    console.log(url);
    request
    .get(url, function (req, res) {
        console.log(res, res.statusCode, res.headers['content-type']);
        expect(res.headers['content-type']).to.match(/text\/html/);
        expect(res.statusCode).to.equal(200);
        done();
    }, function (err) {
        console.log(err);
    })
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
    
});
