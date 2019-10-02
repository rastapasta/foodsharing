import * as types from './constants'

export const init = (isSimulator: boolean) => ({type: types.INIT, isSimulator})

export const login = () => ({type: types.LOGIN_REQUEST})
export const logout = () => ({type: types.LOGOUT})

export const cookie = (name: string, value: string) => ({type: types.COOKIE, name, value})

export const navigation = (scene: string, sceneId?: number) => ({type: types.NAVIGATION, payload: {scene, sceneId}})

export const fetchConversations = () => ({type: types.CONVERSATIONS_REQUEST})
export const gotConversations = () => ({type: types.CONVERSATIONS_SUCCESS})

export const fetchConversation = (id: number) => ({type: types.CONVERSATION_REQUEST, id})
export const sendMessage = (conversationId: number) => ({type: types.MESSAGE_REQUEST, payload: {conversationId}})

export const fetchMarkers = () => ({type: types.MARKERS_REQUEST})
export const fetchFairteiler = (payload: number) => ({type: types.FAIRTEILER_REQUEST, payload})

export const fetchProfile = (id: number) => ({type: types.PROFILE_REQUEST, payload: id})
export const fetchWall = (target: 'foodsaver' | 'fairteiler', id: number) => ({type: types.WALL_REQUEST, payload: {target, id}})

export const requestFriendship = (id: number) => ({type: types.FRIENDSHIP_REQUEST, payload: id})