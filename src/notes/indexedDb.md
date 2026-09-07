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

The upgrade() function is where we can define the DB schema, this can be thought of as like an SQL migration
```TS
openDB("my-app-db", 1, {
  upgrade(db) {
    db.createObjectStore("users", {
      keyPath: "id",
    });
  },
});
```
This above createObjectStore is equivalent to some thing like this below in SQL
```SQL
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT
);
```

# When does the upgrade() run?
This is where the version number becomes important
When the app runs for the first time, and there is no DB yet, the browser does
Database doesn't exist
        ↓
Create database
        ↓
Version 1
        ↓
upgrade()
        ↓
Create users store

# What happens when the app runs again?
```TS
openDB("my-app-db", 1, ...)
```
Suppose the DB already exists, then 
Existing DB
version 1
    ↓
Requested version 1
    ↓
Same version
    ↓
Open database

the upgrade() function will not run again
It does not recreate the object store every time the application starts

# What happens when you increase the version?

If you initially had
```TS
openDB("my-app-db", 1, {
  upgrade(db) {
    db.createObjectStore("users", {
      keyPath: "id",
    });
  },
});
```
And later, you decide you need a tasks store, then you change the version:
```TS
openDB("my-app-db", 2, {
  upgrade(db) {
    db.createObjectStore("users", {
      keyPath: "id",
    });

    db.createObjectStore("tasks", {
      keyPath: "id",
    });
  },
});
```

# But there is an important problem with that example
We should not write like below when upgrading from v1 to v2
WHY? Because users already exists, and you would get an error trying to create it again
```TS
upgrade(db) {
  db.createObjectStore("users");
  db.createObjectStore("tasks");
}
```

Instead if we do
```TS
openDB("my-app-db", 2, {
  upgrade(db, oldVersion) {
    if (oldVersion < 1) {
      db.createObjectStore("users", {
        keyPath: "id",
      });
    }

    if (oldVersion < 2) {
      db.createObjectStore("tasks", {
        keyPath: "id",
      });
    }
  },
});
```
We now have a migration system

# Think of oldversion

The upgrade() can receive
upgrade(db, oldVersion, newVersion, transaction)

If someone has DB version 1 and the application now requires DB version 3, then you can migrate through the changes like
```TS
upgrade(db, oldVersion) {
  if (oldVersion < 1) {
    // create users
  }

  if (oldVersion < 2) {
    // create tasks
  }

  if (oldVersion < 3) {
    // create products
  }
}
```
This is very similar to DB migrations on the backend

To create an indexed db we can use the idb npm package and use the following code in db.ts

# The overall lifecycle
                    openDB()
                       │
                       ▼
             Does database exist?
                 /           \
               NO             YES
               │               │
               ▼               ▼
          Create DB       Check version
               │               │
               │        ┌──────┴──────┐
               │        │             │
               │      Same         Higher?
               │      version         │
               │        │             ▼
               │        │         upgrade()
               │        │             │
               └────────┴─────────────┘
                            │
                            ▼
                       DB connection
                            │
                ┌───────────┼───────────┐
                ▼           ▼           ▼
               get         put        delete

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
