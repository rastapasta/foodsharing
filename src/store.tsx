import socketIO from 'socket.io-client'

class Store {
  socket: any

  constructor() {
    this.setupWebSocket()
  }

  setupWebSocket() {
    const socket = socketIO('https://foodsharing.de', {
      transportOptions: {
        polling: {
          extraHeaders: {
            Cookie: 'PHPSESSID=477nrvmg78077o8i1ku38tifet'
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

    this.socket = socket
  }
}

export default new Store()