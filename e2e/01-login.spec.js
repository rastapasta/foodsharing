describe('Login scene', () => {
  // beforeEach(async () => {
  //   await device.reloadReactNative()
  // })

  it('should have login screen', async () => {
    await expect(element(by.id('login.scene'))).toBeVisible()
  });

  it('should allow input when tapping email field', async () => {
    await element(by.id('login.email')).tap()
    await element(by.id('login.email')).typeText('m.strassburger@gmail.com')
  })

  it('should allow input when tapping password field', async () => {
    await element(by.id('login.password')).tap()
    await element(by.id('login.password')).typeText('testtest')
  })

  it('should act when pressing login', async () => {
    await element(by.id('login.login')).tap()
  })
})
