const translation = require('../assets/translations/en.json')
require('custom-env').env()

describe('Basket scene', () => {
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

  it('leaving the description field by tapping ouside of field', async () => {
    await element(by.id('basketEdit.picture')).tap()
  })

  it('checkboxes are chooseable and toggle options', async () => {
    await expect(element(by.id('basketEdit.mobile'))).toBeNotVisible()
    await expect(element(by.id('basketEdit.landline'))).toBeNotVisible()

    await element(by.id('basketEdit.by_message')).tapAtPoint({x: 12, y: 15})
    await element(by.id('basketEdit.by_phone')).tap()

    await element(by.id('basketEdit.mobile')).swipe('up')

    await expect(element(by.id('basketEdit.mobile'))).toBeVisible()
    await expect(element(by.id('basketEdit.landline'))).toBeVisible()
  })

  it('mobile text field accepts entry', async () => {
    await element(by.id('basketEdit.mobile')).tap()
    await element(by.id('basketEdit.mobile')).typeText('0171 1234567')
  })

  it('dropbox opens and allows selection', async () => {
    await element(by.id('basketEdit.dropdown')).tap()
    await element(by.id('basketEdit.dropdown')).tap()
    await expect(element(by.label(translation.baskets.until_tomorrow))).toBeVisible()
    await element(by.label(translation.baskets.only_today)).tap()
  })

  it('map is tapable and opens location selector', async () => {
    await element(by.id('basketEdit.map')).tap()
    await expect(element(by.id('locationSelector.scene'))).toBeVisible()
  })

  it('map is moveable and position gets returned back', async () => {
    await element(by.id('locationSelector.map')).swipe('down')
    await element(by.id('locationSelector.map')).swipe('left')
    await element(by.id('header-back')).atIndex(0).tap()
  })

  it('publishing the basket', async () => {
    await element(by.id('basketEdit.submit')).tap()
  })

  it('should get redirected to basket page', async () => {
    await expect(element(by.id('basket.scene'))).toBeVisible()
  })
})
