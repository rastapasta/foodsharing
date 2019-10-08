const translation = require('../assets/translations/en.json')
require('custom-env').env()

const description = 'This is a test basket created by the CI'

describe('Baskets list and creation', () => {

  it('should navigate to baskets when pressing navigation tab icon', async () => {
    await element(by.id('navigation.basket')).atIndex(0).tap()
    await expect(element(by.id('baskets.scene'))).toBeVisible()
  })

  it('should navigate to offer basket scene when tapping plus button', async () => {
    await element(by.id('navigation.plus')).tap()
    await expect(element(by.id('basketEdit.scene'))).toBeVisible()
  })

  it('should open the camera view when pressing the camera icon', async () => {
    await element(by.id('basketEdit.camera')).tap()
    await expect(element(by.id('camera.scene'))).toBeVisible()
  })

  it('should take a picture and navigate back to basket when pressing action button', async () => {
    await element(by.id('camera.action')).tap()
    await expect(element(by.id('basketEdit.scene'))).toBeVisible()
  })

  it('should be possible to enter text into description field', async () => {
    await element(by.id('basketEdit.description')).tap()
    await element(by.id('basketEdit.description')).typeText(description)
  })

  it('sould be possible to leave the field by tapping the picture', async () => {
    await element(by.id('basketEdit.picture')).tap()
  })

  it('should not display dynamic content until checkboxes toggled', async () => {
    await expect(element(by.id('basketEdit.mobile'))).toBeNotVisible()
    await expect(element(by.id('basketEdit.landline'))).toBeNotVisible()
  })

  it('should be possible to toggle the checkboxes', async () => {
    await element(by.id('basketEdit.by_message')).tapAtPoint({x: 12, y: 15})
    await element(by.id('basketEdit.by_phone')).tap()
  })

  it('should display dynamic fields after toggle', async () => {
    await element(by.id('basketEdit.mobile')).swipe('up')

    await expect(element(by.id('basketEdit.mobile'))).toBeVisible()
    await expect(element(by.id('basketEdit.landline'))).toBeVisible()
  })

  it('should be possible to enter mobile number', async () => {
    await element(by.id('basketEdit.mobile')).tap()
    await element(by.id('basketEdit.mobile')).typeText('0171 1234567')
  })

  it('shoule possible to open dropbox', async () => {
    await element(by.id('basketEdit.dropdown')).tap()
    await element(by.id('basketEdit.dropdown')).tap()
    await expect(element(by.label(translation.baskets.until_tomorrow))).toBeVisible()
  })

  it('should be possible to select dropbox item', async () => {
    await element(by.label(translation.baskets.only_today)).tap()
  })

  it('should navigate to location selector when tapping map', async () => {
    await element(by.id('basketEdit.map')).tap()
    await expect(element(by.id('locationSelector.scene'))).toBeVisible()
  })

  it('should be able to swipe map and get result back to basket', async () => {
    await element(by.id('locationSelector.map')).swipe('down')
    await element(by.id('locationSelector.map')).swipe('left')
    await element(by.id('header-back')).atIndex(0).tap()
  })

  it('should publish basket when tapping publish button', async () => {
    await element(by.id('basketEdit.submit')).tap()
  })

  it('should navigate to basket page with fresh basket', async () => {
    await expect(element(by.id('basket.scene'))).toBeVisible()
    await expect(element(by.id('basket.description'))).toHaveText(description)
  })

  it('should navigate to baskets overview when tapping back', async () => {
    await element(by.id('header-back')).atIndex(0).tap()
    await expect(element(by.id('baskets.scene'))).toBeVisible()
  })

  it('should show new basket in overview', async () => {
    await expect(element(by.id('baskets.label.0'))).toHaveText(description)
  })

  it('should bring you back to basket when tapping on it', async () => {
    await element(by.id('baskets.0')).tap()
    await expect(element(by.id('basket.scene'))).toBeVisible()
    await expect(element(by.id('basket.description'))).toHaveText(description)
  })
})
