const translation = require('../assets/translations/en.json')
require('custom-env').env()

const editedDescription = 'This is an edited basket created by the CI'

describe('Basket edit scene', () => {
  it('should navigate user to profile when tapping person', async () => {
    await element(by.id('basket.creator')).tap()
    await expect(element(by.id('profile.scene'))).toBeVisible()
  })

  it('should navigate back to basket when tapping back', async () => {
    await element(by.id('navigation.back')).tap()
    await expect(element(by.id('basket.scene'))).toBeVisible()
  })

  it('should navigate to edit basket when tapping edit button', async () => {
    await element(by.id('basket.edit')).tap()
    await expect(element(by.id('basketEdit.scene'))).toBeVisible()
  })

  it('should be able to edit description text', async () => {
    await element(by.id('basketEdit.description')).tap()
    await element(by.id('basketEdit.description')).replaceText('')
    await element(by.id('basketEdit.description')).typeText(editedDescription)
    await element(by.id('basketEdit.map')).tap()
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

  it('should be able to save and get redirecte to basket', async () => {
    await element(by.id('basketEdit.submit')).tap()
    await expect(element(by.id('basket.scene'))).toBeVisible()
  })

  it('should display the new basket description', async () => {
    await expect(element(by.id('basket.description'))).toHaveText(editedDescription)
  })

  it('should delete basket when tapping delete', async () => {
    await element(by.id('basket.delete')).tap()
  })

  it('should navigate back after deletion', async () => {
    await expect(element(by.id('baskets.scene'))).toBeVisible()
  })

  it('should be an empty basket list again', async () => {
    await expect(element(by.id('baskets.0'))).toNotExist()
  })
})
