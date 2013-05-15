"use strict";
var assert = require('assert');
var fs = require('fs');
var DB = require('../index.js');
var dbfile = './test/test.json';

describe('json-file-db', function () {

  var db;
  beforeEach(function () {
    db = new DB(dbfile);
  })

  afterEach(function () {
    if (fs.existsSync(dbfile)) {
      fs.unlinkSync(dbfile);
    }
  });

  describe('when file does not exists', function () {

    it('get() return empty list', function (done) {

      db.get(function (err, data) {
        assert.equal(err, undefined);
        assert.equal(data.length, 0);
        done();
      });

    });

    it('put() creates file and stores data', function (done) {

      db.put({id: 10}, function (err) {
        assert.equal(err, undefined);
        assert.equal(true, fs.existsSync(dbfile));
        assert.equal('[\n {\n  \"id\": 10\n }\n]', fs.readFileSync(dbfile, 'utf-8'));
        done();
      });

    });

    it('delete() does not fail', function (done) {

      db.delete({id: 10}, function (err) {
        assert.equal(err, undefined);
        done();
      });

    });

  });

  describe('when file is empty', function () {

    beforeEach(function () {
      fs.writeFileSync(dbfile, '', 'utf-8');
    });

    it('get() return empty list', function (done) {

      db.get(function (err, data) {
        assert.equal(err, undefined);
        assert.equal(data.length, 0);
        done();
      });

    });

  });

  describe('when file contain an empty array', function () {

    beforeEach(function () {
      fs.writeFileSync(dbfile, '[]', 'utf-8');
    });

    it('get() return empty list', function (done) {

      db.get(function (err, data) {
        assert.equal(err, undefined);
        assert.equal(data.length, 0);
        done();
      });

    });

  });

  describe('when file has docs', function () {

    beforeEach(function () {
      fs.writeFileSync(dbfile, '[{"id":10},{"id":11}]', 'utf-8');
    });

    it('get() return all docs', function (done) {

      db.get(function (err, data) {
        assert.equal(err, undefined);
        assert.equal(data.length, 2);
        assert.equal(data[0].id, 10);
        assert.equal(data[1].id, 11);
        done();
      });

    });

    it('delete() delete matching docs', function (done) {

      db.delete(10, function (err) {
        assert.equal(err, undefined);
        assert.equal(true, fs.existsSync(dbfile));
        assert.equal('[\n {\n  \"id\": 11\n }\n]', fs.readFileSync(dbfile, 'utf-8'));
        done();
      });

    });

    it('delete() does not fail if doc not found', function (done) {

      db.delete({id: 100}, function (err) {
        assert.equal(err, undefined);
        done();
      });

    });

    it('put() updates existing doc and leaves other unchanged', function (done) {

      db.put({id: 10, attr1: 100}, function (err) {
        assert.equal(err, undefined);
        assert.equal(true, fs.existsSync(dbfile));
        assert.equal('[\n {\n  \"id\": 10,\n  \"attr1\": 100\n },\n {\n  \"id\": 11\n }\n]', fs.readFileSync(dbfile, 'utf-8'));
        done();
      });

    });

  });

});