json-file-db
=======

What?
------
Very simple file wrapper to GET, PUT and DELETE javascript objects to files.

Why?
-------
Good in the first spins of you project when you still don't need a real Db and just want to save docs to a file.


API
---

The API supports 3 things:

```javascript
var DB = require('jsong-file-db');
var db = new DB('file.json');

// 1 - insert a doc
db.put({id=12, data="someData"}, function(err){

  // 2 - get all docs
  db.get(function(err, alldocs){

    // 3 - delete a doc
    db.delete(12, function(err){

    });

  });

});

```

What else?
----
- The module is not optimized at all. Files are read and written completly on each operation.
- It has a dependency on underscore because I'm too lazy to take it out.
- It's got unit tests

Licence
-------
MIT




