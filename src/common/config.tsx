const PRODUCTION = true
    , DOCKER_HOST = 'localhost'

export default {
  host: PRODUCTION ? 'https://foodsharing.de' : `http://${DOCKER_HOST}:18080/`,
  websocketHost: PRODUCTION ? 'https://foodsharing.de' : `http://${DOCKER_HOST}:18080/`,

  credentials: PRODUCTION ? {} : {email: 'userbot@example.com', password: 'user'},

  feedbackUser: 338241,

  userAgent: 'Mozilla/5.0 (compatible; FoodsharingReactNative/1.0; +https://github.com/rastapasta/foodsharing)',

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
    bells: {uri: '/xhrapp.php?app=bell&m=infobar', method: 'GET'},
    deleteBell: {uri: '/xhrapp.php?app=bell&m=delbell&id={id}', method: 'GET'},
    markBell: {uri: '/xhrapp.php?app=bell&m=markBellsAsRead&ids=[{id}]', method: 'GET'},

    shopMarker: {uri: '/xhr.php?f=bBubble&id={id}', method: 'GET'}
  },

  notificationIcons: {
    'forum_answer': 'question-answer',
    'blog_new_check': 'newspaper',
    'ft_update': 'alert-circle',
    'store_new': 'store',
    'store_new_request': 'account-question',
    'store_request_accept': 'account-plus',
    'store_request_accept_wait': 'account-multiple-check',
    'store_request_deny': 'account-remove',
    'store_wallpost': 'wall',
    'store_cr_times': 'timetable',
    'fs_sleepmode': 'sleep',
    'new_quiz_comment': 'comment-question',
    'new_foodsaver': 'account',
    'new_foodsaver_verified': 'account-check',
    'betrieb_fetch': 'timetable',
    'sharepoint_activate': 'store',
    'passgen_failed': 'passport',
  },

  notificationsOnlyInBackground: true,

  initialMapRegion: {
    longitude: 10.60117067,
    latitude: 50.34470266,
    longitudeDelta: 13.894483079,
    latitudeDelta: 12.61906546
  }
}