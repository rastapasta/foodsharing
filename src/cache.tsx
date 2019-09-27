import socketIO from 'socket.io-client'
import { getConversations } from './api'
import Conversation from './scenes/Conversation'

interface Storage {
  conversations: {},
  mailbox: number[],
}

class Store {
  data: {
    conversations: {},
    conversation: {},
  }
  socket: socketIO
  subscriptions: any[]

  constructor() {
    this.socket = this.connect('477nrvmg78077o8i1ku38tifet')
  }

  set(store: string, data: any) {
    this.data[store] = data
  }

  subscribe(store: string, id?: number) {
    return this.subscriptions.push({store, id})
  }


  unsubsribe(subsciption: any) {
    this.subscriptions = this.subscriptions.filter(sub => sub !== subsciption)
  }


  async updateConversations() {
    const conversations = await getConversations()

    conversations.forEach(conversation => {
      const { id } = conversation
          , state = {
            ...(this.data.conversations[id] || {}),
            conversation
          }

      this.data.conversations[id] = state
    })

    this.set('mailbox', conversations.map(({id}) => this.data.conversations[id]))
  }

  connect(session: string): socketIO {
    const socket = socketIO('https://beta.foodsharing.de', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Cookie: 'PHPSESSID=' + session
          }
        }
      },
      path: '/chat/socket.io/',
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: Infinity,
      jsonp: false
    })

    socket.on('connect', () => socket.emit('register'))
    socket.on('error', console.error)
    socket.on('connect_error', console.error)


    socket.on('conv', ({m, o}: {m: string, o: string}) => {
      if (m === 'push') {
        const data = JSON.parse(o)

        console.log(data)
      }
    })

    return socket
  }
}

export default new Store()