# Create DB in indexed db

# About openDB function from idb
The basic usage is
```TS
import { openDB } from "idb";

const db = await openDB("my-app-db", 1);
```
The above sample code means, open the indexedDB database called my-app-db, using the database version 1. If the DB does not exist, the browser creates it, if it already exists, the browser opens it

openDB() returns a Promise so we have to await to get the DB connection, since we awaited in the above code snippet, the db is our DB connection

The third argument is the most interesting part of openDB(),
The three arguments are
```TS
openDB(name, version, options)
```

To create an indexed db we can use the idb npm package and use the following code in db.ts

```TS
import { openDB } from "idb";

export const dbPromise = openDB("my-app-db", 1, {
// This upgrade runs when the DB is first created or upgraded
// This means create an object store called users and use each object's id as the primary key
  upgrade(db) {
    db.createObjectStore("users", {
      keyPath: "id",
    });
  },
});
// Creates a DB named my-app-db, with DB version 1,
```
The DB version number is important and should be updated every time any change is done in the DB

# Adding data to the DB
```TS
export async function addUser(user: {
  id: number;
  name: string;
  email: string;
}) {
  const db = await dbPromise;

  await db.put("users", user);
}

await db.add("users", user); // Adds a new record and if the key exists then fails
await db.put("users", user); // Adds or replaces the record, if the key already exists

await db.put("users", {
  id: 1,
  name: "John Updated",
}); // Here the existing record with id=1 is replaced
```

# Getting a record from the DB
```TS
const db = await dbPromise;

const user = await db.get("users", 1);

console.log(user);
```

# Creating an index
