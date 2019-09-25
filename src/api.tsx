import setCookie from 'set-cookie-parser'

const host = 'https://foodsharing.de'
    , endpoints = {
        login: {uri: '/api/user/login', method: 'POST'},
        logout: {uri: '/api/user/logout', method: 'GET'},
        current: {uri: '/api/user/current', method: 'GET'},
        profile: {uri: '/api/profile/current', method: 'GET'},
        wall: {uri: '/api/wall/{target}/{targetId}', method: 'GET'},
        store: {uri: '/api/stores/{storeId}', method: 'GET'},
        conversations: {uri: '/api/conversations', method: 'GET'}
      }
    , cookies = {}

export enum results {
  UNAUTHORIZED,
  FORBIDDEN,
  CONNECTION_ERROR,
  SERVER_ERROR,
  NOT_FOUND
}


export interface Conversation {
  id: string,
  last: string,
  last_foodsaver_id: string,
  last_message: string,
  last_message_is_htmlentity_encoded: string,
  last_ts: string,
  name: string,
  unread: string,
  member: ConversationMember[]
}

export interface ConversationMember {
  id: string,
  name: string,
  photo: string,
  email: string,
  geschlecht: string,
  infomail_message: string
}

interface User {
  id: number,
  name: string
}

const handleCookies = cookieString =>
  setCookie
  .parse(cookieString.split(/, /))
  .forEach(cookie => cookies[cookie.name] = cookie.value)

function request(
  endpoint: 'login' | 'current' | 'logout' | 'profile' | 'wall' | 'store' | 'conversations',
  data?: any,
  options?: any
): Promise<any> {
  console.log('cookies', cookies)
  const { method, uri } = endpoints[endpoint]
      , opts = options || {}
      , url = host + Object.keys(opts)
                      .reduce((u, key) => u.replace('{' + key +'}', opts[key]), uri)

  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(cookies['CSRF_TOKEN'] ? {'X-CSRF-Token': cookies['CSRF_TOKEN']} : {})
    },
    method,
    credentials: 'same-origin',
    body: JSON.stringify(data)
  }).then(response => {
    if (response.headers.has('set-cookie'))
      handleCookies(response.headers.get('set-cookie'))

    switch (response.status) {
      case 200: return response.json()

      case 401: throw results.FORBIDDEN
      case 403: throw results.UNAUTHORIZED
      case 404: throw results.NOT_FOUND
      case 500: throw results.SERVER_ERROR

      default: throw results.SERVER_ERROR
    }
  })
}

export const login = (email: string, password: string): Promise<User> =>
  request('login', {email, password})

export const logout = (): Promise<void> =>
  request('logout')

export const getCurrentUser = (): Promise<User> =>
  request('current')

export const getConversations = (): Promise<Conversation[]> =>
  request('conversations')

export const getWall = (target: 'foodsaver', targetId: number): Promise<any> =>
  request('wall', {target, targetId})


// TODO: backend returns 500
// export const getStore = (storeId: number): Promise<any> =>
//   request('store', {storeId})
// export const getProfile = (): Promise<any> =>
//   request('profile')
