json-file-db
=======

Very simple file wrapper to GET, PUT, POST and DELETE javascript objects to files.

WHY?
-------
Good in the first spins of you project when you still dont need a real Db and just wnat to save doc to file.


API
---
```javascript
var db = require('jsong-file-db');
var allDocs = db.get("file.json");
db.put("file.json", {id=12, data="someData"});
db.delete("file.json", {id=12});
```


What else?
----
- The module is not optimized at all. Files are read and written completly on each operation.


Licence
-------
MIT




