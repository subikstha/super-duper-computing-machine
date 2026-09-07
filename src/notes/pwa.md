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

# The process of converting Next.js into a PWA

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