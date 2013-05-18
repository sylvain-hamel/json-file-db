var fs = require('fs');
var _ = require('underscore');

/**
 * Creates a DB instance that is a simple wapper around the given file.
 * @param file File path
 * @param idAttribute Name of the attribut to use as the id. Used to identify
 * an existing document by the put and delete methods. Default value is 'id'
 */
var open = function (file, idAttribute) {
  var idAttr = idAttribute || 'id';
  var file = file;
  if (!file) {
    throw new Error("DB: file name is required");
  }

  var convertValueToFilter = function (attrs) {
    // if a value was provided instead of an object, use the value as an id
    if (attrs !== undefined && !_.isObject(attrs)) {
      var val = attrs;
      attrs = {};
      attrs[idAttr] = val;
    }
    return attrs;
  }

  /**
   * Gets docs in the database optionally filtering them
   * @attrs optional object used to call _.where()
   * @cb cb Callback returning data
   */
  var get = function (attrs, cb) {

    //predicate is optional
    if (_.isFunction(attrs)) {
      cb = attrs;
      attrs = undefined;
    }
    if (!fs.existsSync(file)) {
      cb(null, []);
      return;
    }

    fs.readFile(file, 'utf-8', function (err, data) {
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
      }
      catch (err) {
        cb(err);
        return;
      }

      attrs = convertValueToFilter(attrs);

      if (attrs) {
        docs = _.where(docs, attrs);
      }
      cb(null, docs);
    });

  };

  /**
   * Gets a single docs that matches 'attrs'. returns undefined if no doc matches.
   * @attrs optional object used to call _.where(). if not an object, used as the key.
   * @cb cb Callback returning data
   */
  var getSingle = function (attrs, cb) {

    get(attrs, function (err, data) {

      if (err) {
        cb(err, null);
        return;
      }
      var selected = (data && data.length > 0) ? data[0] : undefined;
      cb(null, selected);
    });

  };

  /**
   * Inserts or updates a doc in the database. If no doc is found
   * with the same id attribute, a new other is created, otherwise
   * the existing doc is replaced with the given doc.
   * @param newDoc The doc
   * @param cb Callback for result
   */
  var put = function (newDoc, cb) {

    get(function (err, docs) {

      if (err) {
        cb(err);
        return;
      }

      var match = _.filter(docs, function (doc) {
        return doc[idAttr] === newDoc[idAttr];
      });
      if (match.length >= 1) {
        _.extend(match[0], newDoc);
      }
      else {
        docs.push(newDoc);
      }

      fs.writeFile(file, JSON.stringify(docs, null, " "), 'utf-8', cb)

    });
  };

  /**
   * Deletes a document with the given id value
   * @param attrs Object use to find docs to delete
   * @param cb Callback for result
   */
  var del = function (attrs, cb) {
    if (!fs.existsSync(file)) {
      cb(null);
      return;
    }

    get(function (err, docs) {

      if (err) {
        cb(err);
        return;
      }

      attrs = convertValueToFilter(attrs);

      var toDelete = _.where(docs, attrs);
      var toKeep = _.difference(docs, toDelete);

      fs.writeFile(file, JSON.stringify(toKeep, null, " "), 'utf-8', cb)

    })

  };

  return {
    get: get,
    getSingle: getSingle,
    put: put,
    "delete": del
  }

}

module.exports = open;
