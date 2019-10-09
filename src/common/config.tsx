const PRODUCTION = true
    , DOCKER_HOST = 'localhost'

export default {
  host: PRODUCTION ? 'https://beta.foodsharing.de' : `http://${DOCKER_HOST}:18080/`,
  websocketHost: PRODUCTION ? 'https://foodsharing.de' : `http://${DOCKER_HOST}:18080/`,

  credentials: PRODUCTION ? {} : {email: 'userbot@example.com', password: 'user'},

  endpoints: {
    login: {uri: '/api/user/login', method: 'POST'},
    logout: {uri: '/api/user/logout', method: 'POST'},
    current: {uri: '/api/user/current', method: 'GET'},
    profile: {uri: '/profile/{id}', method: 'GET'},
    currentProfile: {uri: '/api/profile/current', method: 'GET'},
    wall: {uri: '/api/wall/{target}/{targetId}', method: 'GET'},
    store: {uri: '/api/stores/{storeId}', method: 'GET'},
    conversations: {uri: '/api/conversations?offset={offset}&limit={limit}', method: 'GET'},
    conversation: {uri: '/api/conversations/{conversationId}?messagesOffset={offset}&messagesLimit={limit}', method: 'GET'},
    basket: {uri: '/api/baskets/{id}', method: 'GET'},
    baskets: {uri: '/api/baskets?type={type}', method: 'GET'},
    nearbyBaskets: {uri: '/api/baskets/nearby?distance={distance}', method: 'GET'},
    addBasket: {uri: '/api/baskets', method: 'POST'},
    uploadBasket: {uri: '/api/baskets/{id}/picture', method: 'PUT'},
    updateBasket: {uri: '/api/baskets/{id}', method: 'PUT'},
    deleteBasket: {uri: '/api/baskets/{id}', method: 'DELETE'},
    message: {uri: '/xhrapp.php?app=msg&m=sendmsg', method: 'POST'},
    friendship: {uri: '/xhrapp.php?app=buddy&m=request&app=buddy&id={userId}', method: 'GET'},
    user2conv: {uri: '/xhrapp.php?app=msg&m=user2conv&fsid={userId}', method: 'GET'},
    report: {uri: '/xhrapp.php?app=report&m=betriebReport&fsid={userId}&bid=0&reason_id={reasonId}&reason={reason}&msg={message}', method: 'GET'},

    fairteiler: {uri: '/api/fairSharePoints/{id}', method: 'GET'},
    marker: {uri: '/xhr.php?f=loadMarker&types[]=fairteiler&types[]=baskets', method: 'GET'},

    regionMembers: {uri: '/?page=bezirk&bid={id}&sub=members', method: 'GET'},
  },

  notificationsOnlyInBackground: true,

  initialMapRegion: {
    longitude: 10.60117067,
    latitude: 50.34470266,
    longitudeDelta: 13.894483079,
    latitudeDelta: 12.61906546
  }
}