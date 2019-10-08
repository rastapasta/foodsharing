const translation = require('../assets/translations/en.json')
require('custom-env').env()

const editedDescription = 'This is an edited basket created by the CI'

describe('Basket edit scene', () => {
  it('tapping on person leads to profile', async () => {
    await element(by.id('basket.creator')).tap()
    await expect(element(by.id('profile.scene'))).toBeVisible()
    await element(by.id('navigation.back')).tap()
  })

  it('tapping on edit leads to the edit basket page', async () => {
    await element(by.id('basket.edit')).tap()
    await expect(element(by.id('basketEdit.scene'))).toBeVisible()
  })

  it('updating the description works as expected', async () => {
    await element(by.id('basketEdit.description')).tap()
    await element(by.id('basketEdit.description')).replaceText('')
    await element(by.id('basketEdit.description')).typeText(editedDescription)
  })

  it('tapping the mini map loads the location selector', async () => {
    await element(by.id('basketEdit.map')).tap()
    await element(by.id('basketEdit.map')).tap()
    await expect(element(by.id('locationSelector.scene'))).toBeVisible()
  })

  it('map is moveable and position gets returned back', async () => {
    await element(by.id('locationSelector.map')).swipe('down')
    await element(by.id('locationSelector.map')).swipe('left')
    await element(by.id('header-back')).atIndex(0).tap()
  })

  it('changes are saveable, redirect happens and changes get displayed', async () => {
    await element(by.id('basketEdit.submit')).tap()
    await expect(element(by.id('basket.scene'))).toBeVisible()
    await expect(element(by.id('basket.description'))).toHaveText(editedDescription)
  })

  it('delete basket and get navigated back to baskets', async () => {
    await element(by.id('basket.delete')).tap()
    await expect(element(by.id('baskets.scene'))).toBeVisible()
  })

  it('baskets list should be empty again', async () => {
    await expect(element(by.id('baskets.0'))).toNotExist()
  })
})
