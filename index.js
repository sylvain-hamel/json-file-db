var fs = require('fs');
var _ = require('underscore');
var idAttr = 'id';



module.exports = {
  get : function (file, cb) {
    if ( !fs.existsSync(file))
    {
      cb(null, []);
      return;
    }

    fs.readFile(file, 'utf-8', function (err, data) {
      if ( err ) {
        cb(err);
        return;
      }

      if ( !data || data === '' ){
        cb(null, []);
        return;
      }

      try{
        var docs = JSON.parse(data);
        cb(null, docs);
      }
      catch (err){
        cb(err);
      }
    });


  },

  put : function (file, newDoc, cb) {

    this.get(file, function (err, docs) {

      if ( err ){
        cb(err);
        return;
      }

      var match = _.filter(docs, function (doc) {
        return doc[idAttr] === newDoc[idAttr];
      });
      if (match.length >= 1)
      {
        _.extend(match[0], newDoc);
      }
      else
      {
        docs.push(newDoc);
      }

      fs.writeFile(file, JSON.stringify(docs, null, " "), 'utf-8', cb)

    });
  },

  post : this.put,

  delete : function (file, key, cb) {
    if ( !fs.existsSync(file))
    {
      cb(null);
      return;
    }

    this.get(file, function (err, docs) {

      if ( err ){
        cb(err);
        return;
      }

      var keep = _.filter(docs, function (doc) {
        return doc[idAttr] !== key;
      });

      fs.writeFile(file, JSON.stringify(keep, null, " "), 'utf-8', cb)

    });

  }

}
