var fs = require('fs');
var _ = require('underscore');

/**
 * Creates a DB instance that is a simple wapper around the given file.
 * @param file File path
 * @param idAttribute Name of the attribut to use as the id. Used to identify
 * an existing document by the put and delete methods. Default value is 'id'
 * @constructor
 */
var DB = function (file, idAttribute) {
  this.idAttr = idAttribute || 'id';
  this.file = file;
  if (!this.file) {
    throw new Error("DB: file name is required");
  }
}

DB.prototype = {

  /**
   * Gets all docs in the database
   * @param cb Callback returning data
   */
  get: function (cb) {
    if (!fs.existsSync(this.file)) {
      cb(null, []);
      return;
    }

    fs.readFile(this.file, 'utf-8', function (err, data) {
      if (err) {
        cb(err);
        return;
      }

      if (!data || data === '') {
        cb(null, []);
        return;
      }

      try {
        var docs = JSON.parse(data);
        cb(null, docs);
      }
      catch (err) {
        cb(err);
      }
    });

  },

  /**
   * Inserts or updates a doc in the database. If no doc is found
   * with the same id attribute, a new other is created, otherwise
   * the existing doc is replaced with the given doc.
   * @param newDoc The doc
   * @param cb Callback for result
   */
  put: function (newDoc, cb) {

    var self = this;

    this.get(function (err, docs) {

      if (err) {
        cb(err);
        return;
      }

      var match = _.filter(docs, function (doc) {
        return doc[self.idAttr] === newDoc[self.idAttr];
      });
      if (match.length >= 1) {
        _.extend(match[0], newDoc);
      }
      else {
        docs.push(newDoc);
      }

      fs.writeFile(self.file, JSON.stringify(docs, null, " "), 'utf-8', cb)

    });
  },

  /**
   * Deletes a document with the given id value
   * @param id Id value of the doc to delete
   * @param cb Callback for result
   */
  delete: function (id, cb) {
    if (!fs.existsSync(this.file)) {
      cb(null);
      return;
    }
    var self = this;

    this.get(function (err, docs) {

      if (err) {
        cb(err);
        return;
      }

      var keep = _.filter(docs, function (doc) {
        return doc[self.idAttr] !== id;
      });

      fs.writeFile(self.file, JSON.stringify(keep, null, " "), 'utf-8', cb)

    });

  }

}

module.exports = DB;
