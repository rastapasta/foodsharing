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
        }
      }
    , cookies = {}

export enum results {
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
  endpoint: 'login' | 'current' | 'logout',
  data?: any,
  returnRaw?: boolean
): any {
  return fetch(host + endpoints[endpoint].uri, {
    method: endpoints[endpoint].method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Cookie: Object.keys(cookies).map(name => name + '=' + cookies[name]).join('; ')
    },
    body: JSON.stringify(data)
  }).then(response => {
    if (response.headers.has('set-cookie'))
      handleCookies(response.headers.get('set-cookie'))
    console.log(response)

    if (response.status === 500)
      throw(results.SERVER_ERROR)

    if (response.status === 404)
      throw(results.NOT_FOUND)

    return returnRaw ? response : response.json()
  })
}


export async function getCurrentUser(): Promise<any> {
  try {
    return await request('current')
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


export async function authenticate(email, password): Promise<results> {
  try {
    const data  = await request('login', {email, password})
    console.log(data)
    switch(data.code) {
      case 401:
        return results.LOGIN_FAILED

      default:
        return results.SERVER_ERROR
    }
  } catch(e) {
    console.log(e)

    return results.CONNECTION_ERROR
  }
}