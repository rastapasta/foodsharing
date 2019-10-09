const translation = require('../assets/translations/en.json')
    , message = "Detox CI test message - random id " + Math.round(Math.random() * 0xFFFFFFFF)

describe('Feedback & Messages', () => {
  it('should resolve navigate to conversation when tapping feedback', async () => {
    await element(by.id('drawer.feedback')).tap()
    await expect(element(by.id('conversation.scene'))).toBeVisible()
  })

  it('should have resolved to coversation with Michael', async () => {
    await expect(element(by.id('conversation.title.label'))).toHaveText('Michael')
  })

  it('should be possible to navigate to profile by tapping title', async () => {
    await element(by.id('conversation.title')).tap()
    await expect(element(by.id('profile.scene'))).toBeVisible()
    await expect(element(by.id('profile.name'))).toHaveText('Michael')
  })

  it('should be possible to navigate back to profile by tapping back', async () => {
    await element(by.id('navigation.back')).tap()
  })

  it('should be able to swipe way up to trigger pagination', async () => {
    for (let i=0; i<5; i++)
      await element(by.id('conversation.scene')).swipe('down')

    for (let i=0; i<5; i++)
      await element(by.id('conversation.scene')).swipe('up')
  })

  it('should be possible to type a message', async () => {
    await element(by.id('conversation.form')).tap()
    await element(by.id('conversation.form')).typeText(message)
  })

  it('should be possible to send message', async () => {
    await element(by.id('conversation.send')).tap()
    await new Promise(done => setTimeout(done, 2000))
  })

  it('should show new message after successful send', async () => {
    await expect(element(by.label(message)).atIndex(0)).toBeVisible()
  })

  it('should have emptied the input form', async () => {
    await expect(element(by.id('conversation.form'))).toHaveLabel(translation.conversations.write_message)
  })

  it('should be possible to navigate back to previous scene', async () => {
    await element(by.id('header-back')).atIndex(0).tap()
    await expect(element(by.id('drawer'))).toBeVisible()
  })

  it('should be possible to close drawer', async () => {
    await element(by.id('drawer')).tapAtPoint({x: 260, y: 100})
  })
})
