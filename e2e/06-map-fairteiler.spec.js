const translation = require('../assets/translations/en.json')
require('custom-env').env()

const description = 'This is a test basket created by the CI'

describe('Faireiler and Baskets map', () => {

  it('should display the map scene when tapped on tab', async () => {
    await element(by.id('navigation.map-marker')).atIndex(0).tap()
    await expect(element(by.id('map.scene'))).toBeVisible()
  })

  it('should have a button that zooms out', async () => {
    await element(by.id('map.zoomout')).tap()
  })

  it('should have the nothern most fairteiler visible', async () => {
    await element(by.id('marker.fairteiler.904')).tap()
  })

  it('should have navigated to fairteiler scene of Kulturhof- Flensburg', async () => {
    await expect(element(by.id('fairteiler.scene'))).toBeVisible()
    await expect(element(by.id('fairteiler.name'))).toHaveText('Kulturhof- Flensburg')
  })

  it('should be possible to swipe up info text', async () => {
    await element(by.id('fairteiler.information')).swipe('up')
  })

  it('should be able to navigate to the messages tab', async () => {
    await element(by.id('swiper.1')).tap()
    await expect(element(by.id('fairteiler.wall'))).toBeVisible()
  })

  it('should be possible to swipe up messages', async () => {
    await element(by.id('fairteiler.wall')).swipe('up')
  })

  it('should be possible to return to map by pressing back', async () => {
    await element(by.id('header-back')).atIndex(0).tap()
    await expect(element(by.id('map.scene'))).toBeVisible()
  })
})
