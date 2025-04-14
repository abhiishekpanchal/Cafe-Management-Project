import { io } from 'socket.io-client'

const isSecure = window.location.protocol === 'https:'
const wsProtocol = isSecure ? 'wss://' : 'ws://'
const httpProtocol = isSecure ? 'https://' : 'http://'

const socket = io(window.location.origin, {
  secure: isSecure,
  rejectUnauthorized: false,
  transports: ['websocket', 'polling'],
})

socket.on('connect', () => {
  console.log('Socket connected successfully with ID:', socket.id)
})

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error)
})

socket.on('disconnect', (reason) => {
  console.log('Socket disconnected:', reason)
})

export default socket
