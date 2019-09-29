import setCookie from 'set-cookie-parser'

const host = 'https://beta.foodsharing.de'
    , endpoints = {
        login: {uri: '/api/user/login', method: 'POST'},
        logout: {uri: '/api/user/logout', method: 'POST'},
        current: {uri: '/api/user/current', method: 'GET'},
        profile: {uri: '/api/profile/current', method: 'GET'},
        wall: {uri: '/api/wall/{target}/{targetId}', method: 'GET'},
        store: {uri: '/api/stores/{storeId}', method: 'GET'},
        conversations: {uri: '/api/conversations', method: 'GET'},
        conversation: {uri: '/api/conversations/{conversationId}', method: 'GET'},
        message: {uri: '/xhrapp.php?app=msg&m=sendmsg', method: 'POST'},
        user2conv: {uri: '/xhrapp.php?app=msg&m=user2conv&fsid={userId}', method: 'GET'},

        fairteiler: {uri: '/api/fairSharePoints/{id}', method: 'GET'},
        fairteilerMarker: {uri: '/xhr.php?f=loadMarker&types[]=fairteiler', method: 'GET'},

        // TODO:
        baskets: {uri: '/xhr.php?f=loadMarker&types[]=baskets', method: 'GET'},
        shops: {uri: '/xhr.php?f=loadMarker&types[]=betriebe&options[]=needhelp&options[]=needhelpinstant', method: 'GET'}
      }
    , cookies = {} as any

export enum results {
  AUTHORIZED,
  UNAUTHORIZED,
  FORBIDDEN,
  CONNECTION_ERROR,
  SERVER_ERROR,
  NOT_FOUND
}

export interface ConversationListEntry {
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

export interface ConversationDetail {
  members: User[],
  messages: Message[],
  name: string
}

export interface Message {
  body: string,
  fs_id: number,
  fs_name: string,
  fs_photo: string,
  id: number,
  is_htmlentity_encoded: number,
  time: string
}

export interface Profile {
  id: number,
  name: string,
  lastname: string,
  address: string,
  city: string,
  postcode: string,
  lat: string,
  lon: string,
  email: string,
  landline: string,
  mobile: string
}

export interface Marker {
  id: string,
  lat: string,
  lon: string,
  bid: string
}

export interface User {
  id: number,
  name: string,
  avatar: string,
  sleepStatus: boolean
}

export interface Fairteiler {
  id: number,
  regionId: number,
  name: string,
  description: string,
  address: string,
  city: string,
  postcode: string,
  lat: number,
  lon: number,
  createdAt: string,
  picture: string
}

const handleCookies = cookieString =>
  setCookie
  .parse(cookieString.split(/, /))
  .forEach(cookie => {
    cookies[cookie.name] = cookie.value
    // store.dispatch(reduxActions.cookie(cookie.name, cookie.value))
  })

function request(
  endpoint:
    'login' |
    'current' |
    'logout' |
    'profile' |
    'wall' |
    'store' |
    'conversations' |
    'conversation' |
    'message' |
    'user2conv' |
    'fairteiler' |
    'fairteilerMarker',
  data?: any,
  options?: any
): Promise<any> {
  const { method, uri } = endpoints[endpoint]
      , opts = options || {}
      , url = host + Object.keys(opts)
                      .reduce((u, key) => u.replace('{' + key +'}', opts[key]), uri)
      , sendAsJSON = !url.match(/xhrapp/)

  console.log(cookies)
  return fetch(url, {
    headers: {
      Accept: 'application/json',
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
  }).then(response => {
    if (response.headers.has('set-cookie'))
      handleCookies(response.headers.get('set-cookie'))

    if (response.status === 200)
      return response.json()

    // console.warn('request error', endpoint, data, options, response)
    switch (response.status) {
      case 400: throw results.AUTHORIZED
      case 401: throw results.FORBIDDEN
      case 403: throw results.UNAUTHORIZED
      case 404: throw results.NOT_FOUND
      case 500: throw results.SERVER_ERROR

      default: throw results.SERVER_ERROR
    }
  })
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

export const getConversation = (conversationId: number): Promise<ConversationDetail> =>
  request('conversation', null, {conversationId})

export const getWall = (target: 'foodsaver', targetId: number): Promise<any> =>
  request('wall', null, {target, targetId})

export const sendMessage = async (conversationId: number, text: string): Promise<Message> =>
  (await request('message', {c: conversationId, b: text})).data.msg

export const userToConversationId = async (userId: number): Promise<number> =>
  parseInt((await request('user2conv', null, {userId})).data.cid)

export const getProfile = (): Promise<Profile> =>
  request('profile')


export const getSession = (): {session: string, token: string} => ({
  session: cookies['PHPSESSID'],
  token: cookies['CSRF_TOKEN']
})

export const setSession = ({session, token}) => {
  cookies.PHPSESSID = session
  cookies.CSRF_TOKEN = token
}


// TODO: backend returns 500
// export const getStore = (storeId: number): Promise<any> =>
// //   request('store', {storeId})
