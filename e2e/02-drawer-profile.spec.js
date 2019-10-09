describe('Drawer and profile view', () => {
  it('should be able to open drawer', async () => {
    await element(by.id('navigation.menu')).atIndex(0).tap()
    await expect(element(by.id('drawer'))).toBeVisible()
  })

  it('should display current username', async () => {
    await expect(element(by.id('drawer.user'))).toHaveText('Michael')
  })

  it('should navigate to own profile when tapping button', async () => {
    await element(by.id('drawer.profile')).tap()
    await expect(element(by.id('profile.scene'))).toBeVisible()
    await expect(element(by.id('profile.name'))).toHaveText('Michael')
  })

  it('should show whole profile when swiping up', async () => {
    await element(by.id('profile.scene')).swipe('up')
  })

  it('should be possible to navigate back to by tapping button', async () => {
    await element(by.id('navigation.back')).tap()
  })
})
