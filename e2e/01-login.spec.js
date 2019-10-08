require('custom-env').env()

describe('Login scene', () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative()
  // })

  it('should have login screen', async () => {
    await expect(element(by.id('login.scene'))).toBeVisible()
    await device.takeScreenshot('01 - login')
  })

  it('should allow input when tapping email field', async () => {
    await element(by.id('login.email')).tap()
    await element(by.id('login.email')).typeText(process.env.EMAIL || 'userbot@example.com')
  })

  it('should allow input when tapping password field', async () => {
    await element(by.id('login.password')).tap()
    await element(by.id('login.password')).replaceText(process.env.PASSWORD || 'user')
  })

  it('should act when pressing login', async () => {
    await element(by.id('login.login')).tap()
  })
})
