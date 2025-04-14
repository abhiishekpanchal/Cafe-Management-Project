import { io } from 'socket.io-client'

const socket = io(window.location.origin, {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  timeout: 20000,
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
