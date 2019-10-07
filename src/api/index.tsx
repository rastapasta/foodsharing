import { getSession, setSession, syncCookies } from './agent'
import { login, logout, getCurrentUser, getFairteiler, getConversation, getConversations, markAsRead, getWall, getCurrentProfile, addBasket, uploadBasket, getBasket, getNearbyBaskets } from './adapters/rest'
import { getMarker } from './adapters/xhr'
import { userToConversationId, sendMessage, requestFriendship, report } from './adapters/xhrapp'

import getProfile from './adapters/scrapers/profile'
import getRegion from './adapters/scrapers/region'

export {
  getSession,
  setSession,
  syncCookies,

  login,
  logout,
  getCurrentUser,
  getFairteiler,
  getConversation,
  getConversations,
  markAsRead,
  getWall,
  getCurrentProfile,
  getNearbyBaskets,
  getBasket,
  addBasket,
  uploadBasket,

  getMarker,

  userToConversationId,
  sendMessage,
  requestFriendship,
  report,

  getProfile,
  getRegion
}