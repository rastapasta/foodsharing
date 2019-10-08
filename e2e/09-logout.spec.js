describe('Logout', () => {
  it('should be able to open drawer', async () => {
    await element(by.id('navigation.menu')).atIndex(0).tap()
  })

  it('should be able to log user out', async () => {
    await element(by.id('drawer.logout')).tap()
  })

  it('should be back to login page', async () => {
    await expect(element(by.id('login.scene'))).toBeVisible()
  })
})
