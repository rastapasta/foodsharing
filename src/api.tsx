import setCookie from 'set-cookie-parser'

const host = 'https://foodsharing.de'
    , endpoints = {
        login: {
          uri: '/api/user/login',
          method: 'POST'
        },
        logout: {
          uri: '/api/user/logout',
          method: 'GET'
        },
        current: {
          uri: '/api/user/current',
          method: 'GET'
        },

        profile: {
          uri: '/api/profile/current',
          method: 'GET'
        },

        wall: {
          uri: '/api/wall/{target}/{targetId}',
          method: 'GET'
        },

        store: {
          uri: '/api/stores/{storeId}',
          method: 'GET'
        },

        conversations: {
          uri: '/api/conversations',
          method: 'GET'
        }
      }
    , cookies = {}

export enum results {
  UNAUTHORIZED,
  FORBIDDEN,
  CONNECTION_ERROR,
  SERVER_ERROR,
  NOT_FOUND,

  LOGIN_SUCCESSFUL,
  LOGIN_FAILED
}

const handleCookies = cookieString =>
  setCookie
  .parse(cookieString.split(/, /))
  .forEach(cookie => cookies[cookie.name] = cookie.value)

function request(
  endpoint: 'login' | 'current' | 'logout' | 'profile' | 'wall' | 'store' | 'conversations',
  data?: any,
  options?: any,
  returnRaw?: boolean
): any {
  console.log('cookies', cookies)
  const { method, uri } = endpoints[endpoint]
      , opts = options || {}
      , url = host + Object.keys(opts)
                      .reduce((u, key) =>
                        u.replace('{' + key +'}', opts[key]),
                        uri
                      )

  return fetch(url, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      // Cookie: Object.keys(cookies).map(name => name + '=' + cookies[name]).join('; '),
      ...(cookies['CSRF_TOKEN'] ? {'X-CSRF-Token': cookies['CSRF_TOKEN']} : {})
    },
    method,
    credentials: 'same-origin',
    ...(method === 'POST' ? {body: JSON.stringify(data)} : {})
  }).then(response => {

    if (response.headers.has('set-cookie'))
      handleCookies(response.headers.get('set-cookie'))

    console.log(response)
    switch (response.status) {
      case 500: throw(results.SERVER_ERROR)

      case 401: throw(results.FORBIDDEN)
      case 403: throw(results.UNAUTHORIZED)
      case 404: throw(results.NOT_FOUND)

      case 200: return response.json()

      default: throw(results.SERVER_ERROR)
    }
  })
}

export async function getConversations(): Promise<any> {
  return await request('conversations')
}

export async function getCurrentUser(): Promise<{id: number, name: string}> {
  return await request('current')
}

export async function getWall(target: 'foodsaver', targetId: number): Promise<any> {
  return await request('wall', null, {target, targetId})
}

export async function getStore(storeId: number): Promise<any> {
  return await request('store', null, {storeId})
}

export async function getProfile(): Promise<any> {
  return await request('profile')
}

export async function logout(): Promise<any> {
  return await request('logout')
}

export async function authenticate(email, password): Promise<{id: number, name: string}> {
  return await request('login', {email, password})
}