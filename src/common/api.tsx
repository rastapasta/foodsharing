import { Platform } from 'react-native'
import {
  User,
  Results,
  Fairteiler,
  Marker,
  ConversationDetail,
  ConversationListEntry,
  WallPosts,
  Message,
  Profile,
  Region
} from './typings'
import CookieManager from 'react-native-cookies'
import cheerio from 'react-native-cheerio'
import { AllHtmlEntities } from 'html-entities'

const entities = new AllHtmlEntities()

const host = 'https://beta.foodsharing.de'
    , endpoints = {
        login: {uri: '/api/user/login', method: 'POST'},
        logout: {uri: '/api/user/logout', method: 'POST'},
        current: {uri: '/api/user/current', method: 'GET'},
        profile: {uri: '/profile/{id}', method: 'GET'},
        currentProfile: {uri: '/api/profile/current', method: 'GET'},
        wall: {uri: '/api/wall/{target}/{targetId}', method: 'GET'},
        store: {uri: '/api/stores/{storeId}', method: 'GET'},
        conversations: {uri: '/api/conversations', method: 'GET'},
        conversation: {uri: '/api/conversations/{conversationId}', method: 'GET'},
        markAsRead: {uri: '/api/conversations/{conversationId}?limit=0', method: 'GET'},

        message: {uri: '/xhrapp.php?app=msg&m=sendmsg', method: 'POST'},
        user2conv: {uri: '/xhrapp.php?app=msg&m=user2conv&fsid={userId}', method: 'GET'},

        fairteiler: {uri: '/api/fairSharePoints/{id}', method: 'GET'},
        fairteilerMarker: {uri: '/xhr.php?f=loadMarker&types[]=fairteiler', method: 'GET'},

        regionMembers: {uri: '/?page=bezirk&bid={id}&sub=members', method: 'GET'},

        // TODO:
        baskets: {uri: '/xhr.php?f=loadMarker&types[]=baskets', method: 'GET'},
        shops: {uri: '/xhr.php?f=loadMarker&types[]=betriebe&options[]=needhelp&options[]=needhelpinstant', method: 'GET'}
      }

let cookies = {} as any

export const syncCookies = async () => {
  // Pull our cookies from the native side of things
  cookies = await CookieManager.get(host)

  // Sync session cookie between beta and production endpoints
  await (Platform.OS === 'android' ?
    CookieManager.setFromResponse(
      'https://foodsharing.de/',
      `PHPSESSID=${cookies.PHPSESSID}; path=/; Thu, 1 Jan 2030 00:00:00 -0000; secure`
    ) :
    CookieManager.set({
      name: 'PHPSESSID',
      value: cookies['PHPSESSID'] || '',
      domain: 'foodsharing.de',
      origin: 'foodsharing.de',
      path: '/',
      version: '1',
      expiration: '2030-01-01T00:00:00.00-00:00'
    })
  )
}

function request(
  endpoint:
    'login' |
    'current' |
    'logout' |
    'profile' |
    'currentProfile' |
    'wall' |
    'store' |
    'conversations' |
    'conversation' |
    'message' |
    'user2conv' |
    'fairteiler' |
    'fairteilerMarker' |
    'markAsRead' |
    'regionMembers',

  data?: any,
  options?: any
): Promise<any> {
  const { method, uri } = endpoints[endpoint]
      , opts = options || {}
      , url = host + Object.keys(opts)
                      .reduce((u, key) => u.replace('{' + key +'}', opts[key]), uri)
      , handleAsHTML = !!url.match('/?page=') || !!url.match(/\.de\/profile\//)
      , sendAsJSON = !!url.match(/\/api\//)

  return fetch(url, {
    headers: {
      Accept: handleAsHTML ? 'text/html' : 'application/json',
      ...(cookies['CSRF_TOKEN'] ? {'X-CSRF-Token': cookies['CSRF_TOKEN']} : {}),
      ...(data ? {'Content-Type': sendAsJSON ? 'application/json' : 'application/x-www-form-urlencoded'} : {})
    },
    method,
    credentials: 'same-origin',
    ...(data ? {
      body: sendAsJSON ?
        JSON.stringify(data) :
        Object.keys(data).map(k => k + '=' + encodeURIComponent(data[k])).join('&')
    } : {})
  }).then(async response => {
    if (response.headers.has('set-cookie'))
      syncCookies()

    // If we got what we needed, return it either as JSON or Cheerio object for dirty style parsing
    if (response.status === 200)
      return handleAsHTML ? cheerio.load(await response.text()) : response.json()

    // Translate any error case to one of our error cases
    switch (response.status) {
      case 400: throw Results.MALFORMED
      case 401: throw Results.FORBIDDEN
      case 403: throw Results.UNAUTHORIZED
      case 404: throw Results.NOT_FOUND
      case 500: throw Results.SERVER_ERROR

      default: throw Results.SERVER_ERROR
    }
  })
}

export const getSession = (): {session: string, token: string} => ({
  session: cookies['PHPSESSID'],
  token: cookies['CSRF_TOKEN']
})

export const setSession = ({session, token}) => {
  cookies['PHPSESSID'] = session
  cookies['CSRF_TOKEN'] = token
}

export const login = (email: string, password: string): Promise<User> =>
  request('login', {email, password, remember_me: true})

export const logout = (): Promise<void> =>
  request('logout')

export const getCurrentUser = (): Promise<User> =>
  request('current')

export const getFairteiler = (id: number): Promise<Fairteiler> =>
  request('fairteiler', null, {id})

export const getFairteilerMarker = async (): Promise<Marker[]> =>
  (await request('fairteilerMarker')).fairteiler

export const getConversations = (): Promise<ConversationListEntry[]> =>
  request('conversations')

export const getConversation = async (conversationId: number): Promise<ConversationDetail> =>
  await request('conversation', null, {conversationId})

export const markAsRead = (conversationId: number): Promise<void> =>
  request('markAsRead', null, {conversationId})

export const getWall = (target: 'foodsaver' | 'fairteiler', targetId: number): Promise<WallPosts> =>
  request('wall', null, {target, targetId})

export const sendMessage = async (conversationId: number, text: string): Promise<Message> =>
  (await request('message', {c: conversationId, b: text})).data.msg

export const userToConversationId = async (userId: number): Promise<number> =>
  parseInt((await request('user2conv', null, {userId})).data.cid)

export const getCurrentProfile = (): Promise<Profile> =>
  request('currentProfile')

// ... from here on it gets kinda screenscrapy dirty ... :)


// TODO: port this to a REST endpoint instead of screenscraping
export const getProfile = async (id: number): Promise<{id: number, isOnline: boolean, isFriend: boolean, stats: any, bananas: any}> => {
  const $ = await request('profile', null, {id})
      , stats = [
        'basketcount',
        'bananacount',
        'postcount',
        'fetchcount',
        'fetchweight'
      ]
  return {
    id,

    isOnline: $('.msg-inside.info').length === 1,

    isFriend: $('.buddyRequest').length === 0,

    stats:
      stats.reduce((stats, id) => {
        stats[id] = parseInt($(`.stat_${id} .val`).text().replace(/\D/g, '') || 0)
        return stats
      }, {}),

    bananas:
      $('#bananas tr')
      .map(
        ({}, e) => ({
          fs_photo: $(e).find('img').attr('src').replace(/\/im(ages\/[^_]+_[^_]+_|g\/.+|age\/.+)/, ''),
          fs_id: $(e).find('a').attr('href').match(/\d+/g)[0],
          body: $(e).find('.msg').text().trim(),
          time: $(e).find('.time').text().split(/ (von|by) /)[0].split(/, /)[1],
          fs_name: $(e).find('.time').text().split(/ (von|by) /)[2]
        })
      ).get()
  }
}

// TODO: port this to a REST endpoint instead of screenscraping
export const getRegionMembers = async (id: number): Promise<Region> => {
  const $ = await request('regionMembers', null, {id})
  return {
    ...JSON.parse(
      entities.decode(
        $('div#vue-memberlist')
        .attr('data-vue-props')
      )
    ),
    admins:
      $('#admin-list li a')
      .map(({}, el) => parseInt($(el).attr('href').replace(/\D/g, '')))
      .get(),

    stats:
      $('.welcome_quick_link').text().match(/\d+/g).map(num => parseInt(num)),

    saved:
      $('.user_display_name').text().match(/\d+/g).map(num => parseInt(num))
  }
}

// TODO: backend returns 500
// export const getStore = (storeId: number): Promise<any> =>
// //   request('store', {storeId})
