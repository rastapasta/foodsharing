# 🍴foodsharing app

This is a Proof of Concept to show how [React Native](https://github.com/facebook/react-native) could rock the [foodsharing](https://foodsharing.network) world :smile:

This thingy runs on iOS and Android - one code, one love!


## 🎉 What's implemented?

* Login
  * Full async login / reauthentication / logout flows
  * Auth via email and password
  * Links to web based register & password restore
  * Using device's keychain to store credentials in a secure location
  * Display of the current build version

* Drawer
  * Display of logo and name of user
  * Button for Logout
  * Display of the current build version

* Conversations
  * Send and receive messages
  * Connect to and handle WebSocket chat interface
  * Local Notifications while app runs in the background
  * Touch on Notification directly brings you to corresponding conversation (iOS only for now)
  * Background conversations list pull every 15 minutes (iOS only for now)
  * Display number of unread conversations as icon badge on home screen (iOS and some Android)
  * Persist message drafts (per conversation)
  * Shorten very long messages and display a 'read more' button
  * Group chats (incl. multiple avatars displayed)
  * Named chats
  * Tap on group conversation title -> navigate to list of members
  * Tap on personal conversation title -> navigate to profile page
  * Today -> Yesterday -> $Date labeling in conversation list
  * Today -> Yesterday -> $Date seperators in conversation
  * Detect URLs to foodsharing* in messages and make them clickable

* Profile
  * Fetch and display pickup/fetch-statistics (screen scrapy as no rest interface exists - yet)
  * Image of foodsaver, paralax style
  * Friendship button - signals friendship sent status
  * Send friendship request by touching friendship button
  * Message button -> jump to Conversation scene
  * Report button -> jump to Report scene
  * Banana button -> jump to Bananas scene

* Bananas
  * List of all received bananas and corresponding banana texts

* Report
  * Platform based native picker for report reason
  * Dynamic displaying of nested options
  * Text entry for report text, autoscaling to fullscreen on text entry
  * Hooking into Android's back button & blur event to leave fullscreen

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
  * Full i18n support (so far: German included, see notes below)

* Deployment and CI
  * Fastlane (icon & badge generation, certificates, deploy, ...)

* Tech stack
  * React Native
  * redux / redux-saga for js generator magic :heart:
  * see [package.json](https://github.com/rastapasta/foodsharing/blob/master/package.json) for complete package list

## 🤔 ToDo

* Show blockers
  * Handle offline mode correctly
  * Notifications after background pull / detect new conversations - even pull pull conversations?
  * Handle more than the last 20 messages, logic to fill the gap
  * Handle WebSocket reconnect after long inactivity
  * Actually send abuse report
  * Ask for Chris (or Tobi?) for permission to show user profile

* Should hve
  * Abuse report english translation?
  * Pull conversation again when open and coming from background to make sure its marked as read
  * User Profile -> message button doesn't work for conversations we didn't have yet

* Nice to have
  * Deep linking via apple-app-site-association, needs to be merged to fs master
  * Settings screen to setup background pull / notifications?
  * react-native-hyperlink for general linking support?

## 😢 Why no English version?

It's all ready for it - all string are in an [easy to maintain i18n file](https://github.com/rastapasta/foodsharing/blob/master/assets/translations/en.json). Just the [foorsharing endpoints](https://gitlab.com/foodsharing-dev/foodsharing/tree/master/src/Controller) deserve some love by someone motivated. Things like the profile information and report functionalities are returned by the backend in German only - fix it, and i will adapt the app!