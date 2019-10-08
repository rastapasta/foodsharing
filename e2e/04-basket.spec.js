require('custom-env').env()

describe('Login scene', () => {
  it('switch to baskets list by tapping bottom navigation', async () => {
    await element(by.id('navigation.basket')).atIndex(0).tap()
    await expect(element(by.id('baskets.scene'))).toBeVisible()
  })

  it('tap plus button to add new basket', async () => {
    await element(by.id('navigation.plus')).tap()
    await expect(element(by.id('basketEdit.scene'))).toBeVisible()
  })

  it('press camera button and expect camera view', async () => {
    await element(by.id('basketEdit.camera')).tap()
    await expect(element(by.id('camera.scene'))).toBeVisible()
  })

  it('take a picture and get redirected back', async () => {
    await element(by.id('camera.action')).tap()
    await expect(element(by.id('basketEdit.scene'))).toBeVisible()
  })

  it('description field is changeable', async () => {
    await element(by.id('basketEdit.description')).tap()
    await element(by.id('basketEdit.description')).typeText('This is a test basket created by the CI')
  })

  it('checkboxes are chooseable and toggle options', async () => {
    await expect(element(by.id('basketEdit.mobile'))).toBeNotVisible()
    await expect(element(by.id('basketEdit.landline'))).toBeNotVisible()

    await element(by.id('basketEdit.by_message')).tapAtPoint({x: 50, y: 15})
    await element(by.id('basketEdit.by_phone')).tap()

    await element(by.id('basketEdit.mobile')).swipe('up')

    await expect(element(by.id('basketEdit.mobile'))).toBeVisible()
    await expect(element(by.id('basketEdit.landline'))).toBeVisible()
  })

  // it('description field is changeable', async () => {
  //   await element(by.id('basketEdit.description')).tap()
  //   await element(by.id('basketEdit.description')).typeText('This is a test basket created by the CI')
  // })

})
