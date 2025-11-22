'use strict';

var expect = require('chai').expect;

describe(require('../package.json').name, function () {

  var mod;

  var TEST_KEY = 'key'
    , TEST_VAL = 'val'
    , TEST_EXP = 5000;

  beforeEach(function () {
    mod = require('../expeditious-memory-engine')();
  });

  describe('#set', function () {
    it('should set a key in memory', function (done) {
      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, function () {
        // Need to wrap in anonymous fn for nyc to work...
        done();
      });
    });

    it('should set a key and delete it after a timeout', function (done) {
      mod.set(TEST_KEY, TEST_VAL, 100, function () {
        setTimeout(function () {
          mod.get(TEST_KEY, function (err, res) {
            expect(err).to.be.null;
            expect(res).to.be.null;

            done();
          });
        }, 150);
      });
    });
  });

  describe('#get', function () {
    it('should get a key from memory', function (done) {

      function onSet (err) {
        expect(err).to.be.null;

        mod.get(TEST_KEY, function (err, res) {
          expect(err).to.be.null;
          expect(res).to.equal(TEST_VAL);
          done();
        });
      }

      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, onSet);
    });
  });

  describe('#del', function () {
    it('should delete a key in memory', function (done) {
      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, function () {
        mod.del(TEST_KEY, function (err) {
          expect(err).to.be.null;

          mod.get(TEST_KEY, function (err, res) {
            expect(err).to.be.null;
            expect(res).to.be.null;
            done();
          });
        });
      });
    });
  });

  describe('#keys', function () {
    it('should get a list of keys in memory', function (done) {
      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, function () {
        mod.keys(function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.an('array');
          expect(res).to.have.length(1);

          expect(res[0]).to.equal(TEST_KEY);

          done();
        });
      });
    });
  });

  describe('#ttl', function () {
    it('should get the ttl for a key in memory', function (done) {
      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, function () {
        mod.ttl(TEST_KEY, function (err, res) {
          expect(err).to.be.null;
          expect(res).to.be.a('number');
          expect(res).to.be.above(4000);

          done();
        });
      });
    });

    it('should return null as ttl for a key not in memory', function (done) {
      mod.ttl('nope', function (err, res) {
        expect(err).to.be.null;
        expect(res).to.be.null;

        done();
      });
    });
  });

  describe('#flush', function () {
    it('should remove all keys in memory', function (done) {
      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, function () {
        mod.flush(function (err) {
          expect(err).to.be.null;

          mod.keys(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.be.an('array');
            expect(res).to.have.length(0);

            done();
          });
        });
      });
    });

    it('should handle new (ns, callback) signature', function (done) {
      mod.set(TEST_KEY, TEST_VAL, TEST_EXP, function () {
        mod.flush('ns', function (err) {
          expect(err).to.be.null;

          mod.keys(function (err, res) {
            expect(err).to.be.null;
            expect(res).to.be.an('array');
            expect(res).to.have.length(0);

            done();
          });
        });
      });
    });
  });


});
