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

    socket.on('connection', () => alert('established'))
    socket.on('')
    socket.on('connect', () => {
      socket.emit('register')
      console.log('socket open')
    })

    socket.on('error', (message) => {
      console.log('error', message)
    })
    socket.on('conv', data => {
      console.log(data)
    })

    socket.on('connect_error', (message) => {
      console.log('connect_error', message)
    })

    socket.on('disconnect', () => {
      console.log('socket closed')
      // connection closed
    })

    this.socket = socket
  }
}

export default new Store()