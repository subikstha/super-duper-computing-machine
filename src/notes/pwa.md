# What is PWA?
A PWA is essentially a web application enhanced with browser capabilities that make it behave more like an installable, resilient application.

You start with a Next.js application and then progressively add capabilities. 
Next.js
   │
   ├── Web App Manifest
   │
   ├── Service Worker
   │
   ├── HTTPS
   │
   ├── Offline/caching strategy
   │
   ├── Optional IndexedDB
   │
   ├── Install experience
   │
   └── Optional push notifications

A useful mental model is

                    Next.js Application
                           │
              ┌────────────┴────────────┐
              │                         │
          Normal Web App             PWA Layer
              │                         │
         React / Next.js          ┌─────┴─────┐
         API calls                │           │
         Routing              Manifest    Service Worker
         UI                        │           │
                                   │      Cache / Network
                                   │           │
                                   └─────┬─────┘
                                         │
                                    IndexedDB

So PWA = Web application + browser capabilities + appropriate caching/offline architecture. Not every PWA needs every capability.

# Service Worker
The service worker is a JavaScript program that runs separately from your web page and can intercept network requests.
Browser
   │
   │ request /dashboard
   ▼
Service Worker
   │
   ├── Cache?
   │      │
   │      └── YES → return cached response
   │
   └── NO → Network

The service worker sits between your application and the network

## Service worker is NOT your React application

React
   ↓
UI

and

Service Worker
   ↓
Network / caching

These two are seperate environments

Service worker like 
```TS
self.addEventListener("fetch", event => {
   // ...
});
```
runs in the service worker context and does not have access to window, document, React State, DOM etc

# Web App Manifest

This is essentially metadata telling the browser "This website can behave like an installed application", an example manifest file
```TS
{
  "name": "My Application",
  "short_name": "My App",
  "start_url": "/",
  "display": "standalone",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```
The manifest describes things like
Application name
Application icon
Starting URL
Display mode
Theme
Background
Icons

Manifest answers "What should this web app look like when installed?"

Service worker answers "How should this web app behave with network requests?"

Manifest
   ↓
Identity / installation / appearance

Service Worker
   ↓
Caching / offline / background behavior

# IndexedDB is the third thing
Which answers "Where should I persist structured application data inside the browser?"
So we have
PWA
│
├── Manifest
│      └── installation / identity
│
├── Service Worker
│      └── network interception / caching
│
└── IndexedDB
       └── application data

# The process of converting Next.js into a PWA - Stage1

1. Make application installable
          ↓
2. Add manifest
          ↓
3. Add service worker
          ↓
4. Decide what to cache
          ↓
5. Decide how network requests behave
          ↓
6. Add persistent data if needed
          ↓
7. Add advanced capabilities

# Stage 2 - Add the manifest

In modern Next.js app router you can create a manifest.ts file inside app/ directory
```TS
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "My Application",
    short_name: "My App",
    description: "My Progressive Web Application",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
```
Next.js will expose the manifest appropriately and we can also use a static like public/manifest.json

# Stage 3 - Create/register a service worker
You need a service worker file, traditionally:
public/
    sw.js

    because files in public are served from the site root

public/sw.js becomes https://example.com/sw.js, Then we register it from a client-side component as an example
```TS
"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
```
Then include that component somewhere appropriate, such as your root layout

During registration, the browser does
React application
       │
       │ register("/sw.js")
       ▼
Browser
       │
       ▼
Download sw.js
       │
       ▼
Install Service Worker
       │
       ▼
Activate Service Worker

Once active, it can participate in requests for its scope

# Service worker lifecycle
A service worker has a lifecycle:
                 register
                    │
                    ▼
                Download
                    │
                    ▼
                  Install
                    │
                    ▼
                  Waiting
                    │
                    ▼
                  Activate
                    │
                    ▼
                  Active


The main events are
```TS
self.addEventListener("install", ...);

self.addEventListener("activate", ...);

self.addEventListener("fetch", ...);
```

# Install
During installation, you might cache application resources.
```TS
const CACHE_NAME = "my-app-v1";

const APP_SHELL = [
  "/",
  "/offline",
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
});
```
Conceptually this is
Service Worker installed
        ↓
Open cache
        ↓
Cache application resources
The Cache API is particularly useful for storing HTTP Request/Response pairs for example
Request:
GET /styles.css

Response:
200 OK
...CSS...
The service worker can cache that response.

# IndexedDB vs Cache API

Cache API
    ↓
HTTP resources

"/"
"/app.js"
"/styles.css"
"/logo.png"

IndexedDB:

Application data

users
tasks
messages
drafts
products

Therefore 

Service Worker
       │
       ▼
Cache API
       │
       └── assets / responses

Application
       │
       ▼
IndexedDB
       │
       └── structured application data


# Stage 4 - The fetch event

This is where PWAs become really interesting

A service worker can listen to network requests
```TS
self.addEventListener("fetch", event => {
  console.log(event.request.url);
});
```
Now imagine the browser requests /app.js, in that case, the service worker sees it

Browser
   │
   │ GET /app.js
   ▼
Service Worker
   │
   ▼
fetch event

and then you can decide what happens next
Conceptually like below:
```TS
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return cachedResponse || fetch(event.request);
    })
  );
});
```
Means - If I already have this response cached, use it. Otherwise, go to the network. This is useful for relatively static assets

fetch(request)
   ↓
success → return response
   ↓
failure → return cache
This is often useful for data where freshness matters

# Stale-while-revalidate

This is another important strategy where we do
Request
   ↓
Return cached response immediately
   ↓
Meanwhile
   ↓
Fetch fresh response
   ↓
Update cache

So the user gets

fast response while the cache gets fresh data.

# Everything should not be cached

Every requests should not be blindly cached, 
For example, blindly caching authenticated/private data can create security and correctness problems.

You need a caching strategy per resource type.

A practical caching architecture might look like this
Request
│
├── Static JS/CSS
│       └── Cache-first
│
├── Images
│       └── Cache-first
│
├── Public API
│       └── Stale-while-revalidate
│
├── User-specific API
│       └── Network-first / carefully persisted
│
├── POST/PUT/DELETE
│       └── Usually network + explicit offline queue
│
└── Authentication
        └── Don't blindly cache

This is much more realistic than simply "make everything offline."

# Stage 5 - Offline page

One simple improvement can be offline fallback
User opens app
      ↓
No internet
      ↓
Service Worker
      ↓
Cannot fetch requested page
      ↓
Show cached offline page

You could have
app/
└── offline/
    └── page.tsx

    and make sure the relevant generated resources are available/cached.

UI can say if you are offline some features may be unavailable

# Offline CRUD architecture

Suppose you have a task manager

Online 
User
 ↓
React
 ↓
API
 ↓
Server
 ↓
PostgreSQL

Offline
User
 ↓
React
 ↓
IndexedDB

Then when connectivity returns
IndexedDB
    │
    │ pending operations
    ▼
Sync engine
    │
    ▼
API
    │
    ▼
PostgreSQL

This is called an offline-first architecture
A PWA does not automatically give this but you have to design it

# Where IndexedDB enters

If tasks are stoed in IndexedDB, we might have
tasks
-------------------------
id
title
completed
updatedAt

and another store might have
syncQueue
-------------------------
id
operation
entity
payload
createdAt

When offline
Create task
     ↓
Save task to IndexedDB
     ↓
Save operation to syncQueue

then the UI can immediately show
Task created even though the server has not received it yet

# Synchronization

When connectivity returns
             Internet unavailable
                     │
                     ▼
              IndexedDB
              ┌────────────┐
              │ tasks      │
              │ syncQueue  │
              └────────────┘
                     │
                     │ online
                     ▼
                Sync engine
                     │
                     ▼
                   API
                     │
                     ▼
                PostgreSQL

Then after successful sync, remove from syncQueue

This is where PWA development becomes much more interesting than simply installing a service worker.

# What about Next.js server components?

The service worker belongs to the browser, so things like
navigator.serviceWorker
indexedDB
window etc all are client-side concepts

# Next.js does not itself become offline

This is another mental model
Suppose your server component does this
```TS
export default async function Page() {
  const data = await fetch("https://api.example.com/data");

  return ...
}
```

If that rendering needs the server and the user is offline, the browser cannot magically execute the server
A PWA instead relies on already available client-side resources/data and service-worker behavior.
So we have to decide the following

What can run offline?
What data is available offline?
What should happen when data isn't available?

# PWA + Next.js rendering

Next.js might have
Server rendering
      ↓
HTML
      ↓
Browser
      ↓
Hydration

Your PWA layer sits primarily on the browser side

Browser
│
├── React
│
├── Service Worker
│
├── Cache API
│
└── IndexedDB

This is why PWA development requires understanding both Next.js architecture and browser architecture

# A practical Next.js PWA architecture

                     Next.js
                        │
             ┌──────────┴──────────┐
             │                     │
           Server               Browser
             │                     │
       API / Database         React application
                                   │
                    ┌──────────────┼──────────────┐
                    │              │              │
              Service Worker   IndexedDB      TanStack Query
                    │              │              │
               Cache API      Local data       Server cache
                    │              │              │
                    └──────────────┼──────────────┘
                                   │
                                Network
                                   │
                                   ▼
                              Next.js API

# You donot have to write the service worker manually

In fact, for a production Next.js application, you will often use a library/tooling approach rather than hand-writing every caching rule.

One common ecosystem option is next-pwa/Workbox-based tooling, although the exact package you choose should depend on your Next.js version and App Router setup.

The important thing is to understand what the generated service worker is doing.

Don't start with:
npm install some-pwa-package and copy a configuration

It is better to understand
Service Worker
Cache API
Manifest
Caching strategies
Offline behavior

and then tooling makes much more sense

# Workbox

You will probably encounter Workbox when studying PWAs.
Workbox is a collection of libraries/tools for service workers.
Instead of manually implementing:
```TS
caches.open(...)
caches.match(...)
fetch(...)
```

we can use abstractions for common strategies, conceptually
Your Next.js app
       ↓
PWA tooling
       ↓
Workbox
       ↓
Generated service worker
       ↓
Browser

This is one reason the service-worker ecosystem can feel more complicated than expected.

# Push notifications

This is another feature often associated with PWAs.
The architecture looks roughly like:

Your server
     │
     │ push message
     ▼
Push service
     │
     ▼
Browser
     │
     ▼
Service Worker
     │
     ▼
Notification

The service worker can receive push events even when your webpage isn't currently open in the normal way. For example

Server
  │
  │ "New assignment available"
  ▼
Push service
  │
  ▼
Browser
  │
  ▼
Service Worker
  │
  ▼
Notification

This is different from:

React -> toast notification

Because the latter generally requires your page/application to be running

# Background Synchronization

Another advanced capability is Background Sync
Imagine:
User
 ↓
Create task
 ↓
Offline

Instead of losing the operation:
IndexedDB
 ↓
pending operation

When connectivity becomes available:
Browser
 ↓
Service Worker
 ↓
sync
 ↓
API

Again, browser support and platform behavior vary, so you should treat advanced background features as progressive enhancements rather than assumptions.

# HTTPS
PWAs generally require a secure context. so when deploying PWA,
Next.js
   ↓
HTTPS
   ↓
Browser
   ↓
Service Worker

# Installation
Once your application has the appropriate manifest and meets the browser/platform's installability requirements, the browser can offer installation.
The user might see something like:
Install My App

After installation:
Operating System
       │
       ▼
My App
       │
       ▼
PWA
       │
       ├── React
       ├── Service Worker
       ├── Cache
       └── IndexedDB

But installation behavior differs across browsers and OS

# What happens when the user opens the installed PWA?

Imagine
User clicks PWA icon
        ↓
Browser launches app
        ↓
start_url
        ↓
Service Worker
        ↓
Cache / Network
        ↓
Next.js application

If you are offline

Network -> fresh data

If offline

Cache / IndexedDB → available data

# Updating a PWA

This is one of the trickiest parts
Imagine you deploy
PWA v1

and the user's service worker has cached:
app.js v1

Then you deploy:
PWA v2

Then the browser does not necessarily throw away the old service worker immediately, the lifecycle might be
Old SW
   ↓
New SW downloaded
   ↓
New SW installed
   ↓
Waiting
   ↓
Old SW still controlling page
   ↓
New SW activated

This is why service-workder updates can sometimes surprise developers

# Cache Versioning

You commonly version your caches
```TS
const CACHE_NAME = "my-app-v2";
```

when you release a new version:
my-app-v1 becomes my-app-v2, 
during activation, you can remove old caches

Conceptually
Cache
├── my-app-v1
├── my-app-v2
└── ...

Then 

activate -> delete old caches

This prevents users from being stuck with obsolete assets

# A very important PWA problem: stale data

If the application caches /api/products and the user opens the app tomorrow, the cache might say
Product price = $100
but the server says
Product price = $120

The PWA needs a policy
For example cache first might prioritize speed whereas
Network first prioritizes freshness
So PWA development is fundamentally about making these tradeoffs intentionally.

# A useful way to think about caching

For every resource, ask these questions
Does it need to work offline? - Yes/no
How fresh must it be? - seconds, minutes, hours, days etc
Can stale data be shown ? - Yes/no
Is it public or user-specific? - public/private
Is it read-only or mutable? - Get / POST/PUT/DELETE

Answers to these questions determine your caching/sync strategy

