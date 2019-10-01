# 🍴foodsharing app

This is a Proof of Concept to show how [React Native](https://github.com/facebook/react-native) could rock the [foodsharing](https://foodsharing.network) world :smile:

This thingy runs on iOS and Android - one code, one love!


## 🎉 What's implemented?

* Login
  * Auth via email and password
  * Links to web based register & password restore
  * Using device's keychain to store credentials in a secure location
  * Display of current build version

* Drawer
  * Display of logo and name of user
  * Button for Logout
  * Display of current build version

* Conversations
  * Send and receive messages
  * Connect to and handle WebSocket chat interface
  * Local Notifications while app runs in the background
  * Touch on Notification directly brings you to corresponding conversation (iOS only for now)
  * Background conversations list pull every 15 minutes (iOS only for now)
  * Display number of unread conversations as icon badge on home screen (iOS and some Android)
  * Persist message drafts (per conversation)
  * Group chats (incl. multiple avatars displayed)
  * Named chats
  * Today -> Yesterday -> $Date labeling in conversation list
  * Today -> Yesterday -> $Date seperators in conversation
  * Detect URLs to foodsharing* in messages and make them clickable

* Map
  * Embedded map based on system (iOS: Apple Maps, Android: Google Maps)
  * Clustering of markers
  * Tracking/centering of the user's current location on demand
  * Button to zoom back to initial region
  * Prompt for location permission on demand
  * Reusing marker icons from Android version

* Central redux/data store
  * Persistence of conversations, messages and user data
  * Caching of downloaded images
  * Full reset on logout
  * Full offline read-only capability

* UI / UX
  * Custom fonts / 'foodsharing identity'
  * Full i18n support (so far: English included, namings planned to be equal to current Android's implementation)

* Deployment and CI
  * Fastlane (icon & badge generation, certificates, deploy, ...)

* Tech stack
  * React Native
  * redux / redux-saga for js generator magic :heart:
  * see [package.json](https://github.com/rastapasta/foodsharing/blob/master/package.json) for complete package list

## ToDo
* Handle offline mode correctly
* Notifications after background pull / detect new conversations - even pull pull conversations?
* Handle more than the last 20 messages, logic to fill the gap
* Settings screen to setup background pull / notifications?
* Handle WebSocket reconnect after long inactivity
