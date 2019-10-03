import { Message } from '../../common/typings'
import agent from '../agent'

export const userToConversationId = async (userId: number): Promise<number> =>
  parseInt((await agent('user2conv', null, {userId})).data.cid)

export const sendMessage = async (conversationId: number, text: string): Promise<Message> =>
  (await agent('message', {c: conversationId, b: text})).data.msg

export const requestFriendship = async (userId: number): Promise<boolean> =>
  (await agent('friendship', null, {userId})).status === 1

export const report = async (userId: number, reasonId: number, reason: string, message: string): Promise<boolean> =>
  (await agent('report', null, {userId, reasonId, reason, message})).status === 1
