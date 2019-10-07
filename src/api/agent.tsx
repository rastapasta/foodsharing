import { Platform } from 'react-native'
import CookieManager from 'react-native-cookies'
import cheerio from 'react-native-cheerio'

import { Results } from '../common/typings'
import config from '../common/config'

// TODO: This is suboptimal and leads to a recursive import
// solution: refactor agent to generator to be called from sagas
import { store } from '../common/store'
import { REQUEST_ERROR } from '../common/constants'

let cookies = {} as any

export const syncCookies = async () => {
  // Pull our cookies from the native side of things
  cookies = await CookieManager.get(config.host)

  // Sync session cookie between beta and production endpoints
  if (config.host !== config.websocketHost)
    await (Platform.OS === 'android' ?
      CookieManager.setFromResponse(
        config.websocketHost,
        `PHPSESSID=${cookies.PHPSESSID}; path=/; Thu, 1 Jan 2030 00:00:00 -0000; secure`
      ) :
      CookieManager.set({
        name: 'PHPSESSID',
        value: cookies['PHPSESSID'] || '',
        domain: config.websocketHost.replace(/https{0,1}:\/\//, ''),
        origin: config.websocketHost.replace(/https{0,1}:\/\//, ''),
        path: '/',
        version: '1',
        expiration: '2030-01-01T00:00:00.00-00:00'
      })
    )
}

export const getSession = (): {session: string, token: string} => ({
  session: cookies['PHPSESSID'],
  token: cookies['CSRF_TOKEN']
})

export const setSession = ({session, token}) => {
  cookies['PHPSESSID'] = session
  cookies['CSRF_TOKEN'] = token
}

export default (
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
    'marker' |
    'addBasket' |
    'regionMembers' |
    'friendship' |
    'report' |
    'basket' |
    'baskets' |
    'nearbyBaskets' |
    'updateBasket' |
    'deleteBasket',
  data?: any,
  options?: any
): Promise<any> => {
  const { method, uri } = config.endpoints[endpoint]
      , opts = options || {}
      , url = config.host + Object.keys(opts)
                      .reduce((u, key) => u.replace('{' + key +'}', encodeURIComponent(opts[key])), uri)
      , handleAsHTML = url.startsWith(config.host + '/?page=') || url.startsWith(config.host + '/profile')
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
  }).catch(e => {
    const error = typeof e === 'object' ? Results.CONNECTION_ERROR : e
    // console.log('agent error', url, data, opts, error)

    store.dispatch({type: REQUEST_ERROR, payload: error})

    throw error
  })
}