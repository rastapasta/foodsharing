const detox = require('detox')
    , config = require('../package.json').detox
    , adapter = require('detox/runners/mocha/adapter')

before(async () => {
  await detox.init(config)

  try {
    element(by.label('Allow')).tap()
  } catch(e) {}

  try {
    await element(by.id('navigation.menu')).atIndex(0).tap()
    await element(by.id('drawer.logout')).tap()
  } catch(e) {}

  await device.launchApp({
    languageAndLocale: {
      language: 'en-US',
      locale: 'en-US'
    },
    permissions: {
      location: 'inuse',
      notifications: 'YES',
      camera: 'YES'
    }
  })
})

beforeEach(async function () {
  await adapter.beforeEach(this)
})

afterEach(async function () {
  await adapter.afterEach(this)
})

after(async () => {
  await detox.cleanup()
})
