import { Message } from '../../common/typings'
import agent from '../agent'

export const userToConversationId = async (userId: number): Promise<number> =>
  parseInt((await agent('user2conv', null, {userId})).data.cid)

export const sendMessage = async (conversationId: number, text: string): Promise<Message> =>
  (await agent('message', {c: conversationId, b: text})).data.msg