import React, { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [roomData, setRoomData] = useState(null)
  const [onlinePlayers, setOnlinePlayers] = useState([])
  const [connectionError, setConnectionError] = useState(null)

  useEffect(() => {
    try {
      // Initialize socket connection - use network IP for mobile access
      const newSocket = io('http://10.0.0.235:3001', {
        transports: ['websocket', 'polling'],
        autoConnect: true,
        timeout: 5000
      })

      newSocket.on('connect', () => {
        console.log('Connected to server')
        setIsConnected(true)
        setConnectionError(null)
      })

      newSocket.on('disconnect', () => {
        console.log('Disconnected from server')
        setIsConnected(false)
      })

      newSocket.on('connect_error', (error) => {
        console.log('Connection error:', error)
        setConnectionError(error.message)
        setIsConnected(false)
      })

      newSocket.on('roomJoined', (data) => {
        setRoomData(data)
        console.log('Joined room:', data)
      })

      newSocket.on('playerJoined', (player) => {
        setOnlinePlayers(prev => [...prev, player])
        console.log('Player joined:', player)
      })

      newSocket.on('playerLeft', (playerId) => {
        setOnlinePlayers(prev => prev.filter(p => p.id !== playerId))
        console.log('Player left:', playerId)
      })

      newSocket.on('gameUpdate', (update) => {
        console.log('Game update:', update)
        // Handle game state updates
      })

      newSocket.on('chatMessage', (message) => {
        console.log('Chat message:', message)
        // Handle chat messages
      })

      setSocket(newSocket)

      return () => {
        newSocket.close()
      }
    } catch (error) {
      console.error('Socket initialization error:', error)
      setConnectionError(error.message)
    }
  }, [])

  const joinGameRoom = (gameId, playerData) => {
    if (socket && isConnected) {
      socket.emit('joinGame', { gameId, player: playerData })
    } else {
      console.log('Socket not connected, cannot join game room')
    }
  }

  const leaveGameRoom = () => {
    if (socket && isConnected) {
      socket.emit('leaveGame')
      setRoomData(null)
      setOnlinePlayers([])
    }
  }

  const sendGameAction = (action) => {
    if (socket && isConnected) {
      socket.emit('gameAction', action)
    } else {
      console.log('Socket not connected, cannot send game action')
    }
  }

  const sendChatMessage = (message) => {
    if (socket && isConnected) {
      socket.emit('chatMessage', message)
    } else {
      console.log('Socket not connected, cannot send chat message')
    }
  }

  const value = {
    socket,
    isConnected,
    roomData,
    onlinePlayers,
    connectionError,
    joinGameRoom,
    leaveGameRoom,
    sendGameAction,
    sendChatMessage
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
} 