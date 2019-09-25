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

    if (response.status === 500)
      throw(results.SERVER_ERROR)

    if (response.status === 403)
      throw(results.UNAUTHORIZED)


    if (response.status === 403)
      throw(results.FORBIDDEN)

    if (response.status === 404)
      throw(results.NOT_FOUND)

    return response.json()
  })
}


export async function getConversations(): Promise<any> {
  try {
    return await request('conversations')
  } catch(e) {
    return null
  }
}

export async function getCurrentUser(): Promise<any> {
  try {
    return await request('current')
  } catch(e) {
    return null
  }
}

export async function getWall(target: 'foodsaver', targetId: number): Promise<any> {
  try {
    return await request('wall', null, {target, targetId})
  } catch(e) {
    return null
  }
}

export async function getStore(storeId: number): Promise<any> {
  try {
    return await request('store', null, {storeId})
  } catch(e) {
    return null
  }
}

export async function getProfile(): Promise<any> {
  try {
    return await request('profile')
  } catch(e) {
    return null
  }
}

export async function logout(): Promise<any> {
  try {
    return await request('logout')
  } catch(e) {
    return null
  }
}

export async function authenticate(email, password): Promise<{id: number, name: string}> {
  try {
    return await request('login', {email, password})
  } catch(e) {
    return e
  }
}