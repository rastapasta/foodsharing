import agent from '../agent'
import {
  User,
  Fairteiler,
  ConversationListEntry,
  ConversationDetail,
  WallPosts,
  Profile
} from '../../common/typings'

export const login = (email: string, password: string): Promise<User> =>
  agent('login', {email, password, remember_me: true})

export const logout = (): Promise<void> =>
  agent('logout')

export const getCurrentUser = (): Promise<User> =>
  agent('current')

export const getFairteiler = (id: number): Promise<Fairteiler> =>
  agent('fairteiler', null, {id})

export const getConversations = (): Promise<ConversationListEntry[]> =>
  agent('conversations')

export const getConversation = async (conversationId: number): Promise<ConversationDetail> =>
  await agent('conversation', null, {conversationId})

export const markAsRead = (conversationId: number): Promise<void> =>
  agent('markAsRead', null, {conversationId})

export const getWall = (target: 'foodsaver' | 'fairteiler', targetId: number): Promise<WallPosts> =>
  agent('wall', null, {target, targetId})

export const getCurrentProfile = (): Promise<Profile> =>
  agent('currentProfile')