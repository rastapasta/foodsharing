const PRODUCTION = true

export default {
  host: PRODUCTION ? 'https://beta.foodsharing.de' : 'http://localhost:18080/',
  websocketHost: PRODUCTION ? 'https://foodsharing.de' : 'http://localhost:18080/',

  credentials: PRODUCTION ? {} : {email: 'userbot@example.com', password: 'user'},

  endpoints: {
    login: {uri: '/api/user/login', method: 'POST'},
    logout: {uri: '/api/user/logout', method: 'POST'},
    current: {uri: '/api/user/current', method: 'GET'},
    profile: {uri: '/profile/{id}', method: 'GET'},
    currentProfile: {uri: '/api/profile/current', method: 'GET'},
    wall: {uri: '/api/wall/{target}/{targetId}', method: 'GET'},
    store: {uri: '/api/stores/{storeId}', method: 'GET'},
    conversations: {uri: '/api/conversations', method: 'GET'},
    conversation: {uri: '/api/conversations/{conversationId}?messagesOffset={offset}&messagesLimit={limit}', method: 'GET'},
    markAsRead: {uri: '/api/conversations/{conversationId}?limit=0', method: 'GET'},

    message: {uri: '/xhrapp.php?app=msg&m=sendmsg', method: 'POST'},
    friendship: {uri: '/xhrapp.php?app=buddy&m=request&app=buddy&id={userId}', method: 'GET'},
    user2conv: {uri: '/xhrapp.php?app=msg&m=user2conv&fsid={userId}', method: 'GET'},
    report: {uri: '/xhrapp.php?app=report&m=betriebReport&fsid={userId}&bid=0&reason_id={reasonId}&reason={reason}&msg={message}', method: 'GET'},

    fairteiler: {uri: '/api/fairSharePoints/{id}', method: 'GET'},
    fairteilerMarker: {uri: '/xhr.php?f=loadMarker&types[]=fairteiler', method: 'GET'},

    regionMembers: {uri: '/?page=bezirk&bid={id}&sub=members', method: 'GET'},

    // TODO:
    baskets: {uri: '/xhr.php?f=loadMarker&types[]=baskets', method: 'GET'},
    shops: {uri: '/xhr.php?f=loadMarker&types[]=betriebe&options[]=needhelp&options[]=needhelpinstant', method: 'GET'}
  },

  notificationsOnlyInBackground: true
}