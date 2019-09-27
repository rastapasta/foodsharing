# 🍴foodsharing app

This is a Proof of Concept to show how [React Native](https://github.com/facebook/react-native) could rock the [foodsharing](https://foodsharing.de) world :smile:

This thingy runs on iOS and Android - one code, one love!


## 🎉 What's implemented?

* Login
  * Auth via email and password
  * Links to web based register & password restore
  * Using device's keychain to store credentials in a secure location

* Conversations
  * Send and receive messages
  * WebSocket for direct push
  * Conversation list
  * Group chats (multiple avatars displayed)
  * Named chats

* Custom fonts
* Full i18n support (so far: English included)

* Deployment and CI
  * Fastlane (icon & badge generation, certificates, deploy, ...)

* Tech stack
  * React Native
  * redux / redux-saga for js generator magic
  * see [package.json](https://github.com/rastapasta/foodsharing/blob/master/package.json) for complete package list

## ToDo

* Drawer
* Login / Logout
* Data store and persitence
* Background pull as Push Notification replacement
* Notifications after background pull
* Storing session cookie
* Today / Yesterday / Date seperators in conversations list
