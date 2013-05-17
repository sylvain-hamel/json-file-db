json-file-db
=======

What?
------
Very simple file wrapper to GET, PUT and DELETE javascript objects to files to use with Node.JS.

Why?
-------
Good in the first spins of your project when you still don't need a real Db and just want to save docs to a file.

Install
--------
`npm install json-file-db`


API
---


### Save a document

```javascript
var DB = require('json-file-db');
var db = new DB('file.json');

db.put({id=12, data="someData"}, function(err){

});
```

### Get all documents

```javascript
var DB = require('json-file-db');
var db = new DB('file.json');

db.get(function(err, data){
  console.log(data.length);
});
```

### Get documents matching a query (using _.where())

```javascript
var DB = require('json-file-db');
var db = new DB('file.json');

db.get({name:"mike", age:10}, function(err, data){
  console.log(data.length);
});
```

### Get documents matching an Id value

```javascript
var DB = require('json-file-db');
var db = new DB('file.json');

db.get(10, function(err, data){
  console.log(data.length);
});
```

### Get a single document
This is a thin wrapper around get() to avoid checking for data.length before accessing data[0].

```javascript
var DB = require('json-file-db');
var db = new DB('file.json');

db.getSingle(10, function(err, data){
  console.log(data.name);
});
```

### Delete a document

```javascript
var DB = require('json-file-db');
var db = new DB('file.json');

db.delete(10, function(err, data){
  console.log(data.Name);
});
```


What else?
----
- The module is not optimized. Files are read and written completly on each operation.
- It's got unit tests. run `mocha` to run them

Licence
-------
MIT (see licence-mit.txt)




