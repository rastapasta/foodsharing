const detox = require('detox')
    , config = require('../package.json').detox
    , adapter = require('detox/runners/mocha/adapter')

before(async () => {
  await detox.init(config)
  await device.launchApp({ permissions: { location: 'inuse', notifications: 'YES', camera: 'YES' }})
})

beforeEach(async function () {
  await adapter.beforeEach(this)
})

afterEach(async function () {
  await adapter.afterEach(this)
})

after(async () => {
  await detox.cleanup()
});
