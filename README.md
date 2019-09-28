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
  * Display of current build version

* Conversations
  * Send and receive messages
  * WebSocket for direct push
  * Push Notifications while app runs in the background (on iOS only for now)
  * Persiting message drafts per conversation
  * Group chats (incl. multiple avatars displayed)
  * Named chats
  * Today -> Yesterday -> $Date labeling in list

* Map
  * Embedded map based on system (iOS: Apple Maps, Android: Google Maps)
  * Tracking/centering of the user's current location on demand
  * Prompt for location permission on demand

* Central redux data store
  * Persistence of conversations, messages and user data
  * Full offline read-only capability

* UI / UX
  * Custom fonts / coporate identity respected
  * Full i18n support (so far: English included, namings planned to be equal to current Android's implementation)

* Deployment and CI
  * Fastlane (icon & badge generation, certificates, deploy, ...)

* Tech stack
  * React Native
  * redux / redux-saga for js generator magic :heart:
  * see [package.json](https://github.com/rastapasta/foodsharing/blob/master/package.json) for complete package list

## ToDo

* Today -> Yesterday -> $Date seperators in conversation
* Button for Logout
* Logout logic, deleting data from store
* Background pull as Push Notification replacement
* Notifications after background pull
