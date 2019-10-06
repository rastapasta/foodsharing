import agent from '../agent'
import uploader from '../uploader'

import {
  User,
  Fairteiler,
  ConversationListEntry,
  ConversationDetail,
  WallPosts,
  Profile,
  BasketPost,
  Basket
} from '../../common/typings'

export const login = (email: string, password: string): Promise<User> =>
  agent('login', {email, password, remember_me: true})

export const logout = (): Promise<void> =>
  agent('logout')

export const getCurrentUser = (): Promise<User> =>
  agent('current')

export const getFairteiler = (id: number): Promise<Fairteiler> =>
  agent('fairteiler', null, {id})

export const getConversations = (offset: number = 0, limit: number = 50): Promise<ConversationListEntry[]> =>
  agent('conversations', null, {offset, limit})

export const getConversation = (conversationId: number, offset: number = 0, limit: number = 30): Promise<ConversationDetail> =>
  agent('conversation', null, {conversationId, offset, limit})

export const markAsRead = (conversationId: number): Promise<ConversationDetail> =>
  getConversation(conversationId, 0, 0)

export const getWall = (target: 'foodsaver' | 'fairteiler', targetId: number): Promise<WallPosts> =>
  agent('wall', null, {target, targetId})

export const getCurrentProfile = (): Promise<Profile> =>
  agent('currentProfile')

export const addBasket = async (fields: BasketPost): Promise<Basket> =>
  (await agent('addBasket', fields)).basket

export const uploadBasket = (id: number, file: string) =>
  uploader('uploadBasket', {id}, file)
