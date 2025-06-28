const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const cors = require('cors')
const helmet = require('helmet')
const compression = require('compression')
const morgan = require('morgan')

const app = express()
const server = http.createServer(app)
const io = socketIo(server, {
  cors: {
    origin: ["http://localhost:3000", "http://10.0.0.235:3000"],
    methods: ["GET", "POST"]
  }
})

// Middleware
app.use(helmet())
app.use(compression())
app.use(morgan('combined'))
app.use(cors({
  origin: ['http://localhost:3000', 'http://10.0.0.235:3000'],
  credentials: true
}))
app.use(express.json())

// Game rooms and analytics storage
const gameRooms = new Map()
const analytics = {
  swipeData: [],
  playTimeData: [],
  engagementMetrics: {},
  activeUsers: new Set()
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`)
  analytics.activeUsers.add(socket.id)

  // Join a game room
  socket.on('joinGame', ({ gameId, player }) => {
    console.log(`Player ${player.name} joining game ${gameId}`)
    
    if (!gameRooms.has(gameId)) {
      gameRooms.set(gameId, {
        id: gameId,
        players: [],
        gameState: 'waiting',
        startTime: null,
        scores: {}
      })
    }
    
    const room = gameRooms.get(gameId)
    const playerData = {
      id: socket.id,
      name: player.name,
      avatar: player.avatar,
      joinedAt: Date.now()
    }
    
    room.players.push(playerData)
    socket.join(gameId)
    
    // Notify room about new player
    socket.to(gameId).emit('playerJoined', playerData)
    
    // Send room data to joining player
    socket.emit('roomJoined', {
      roomId: gameId,
      players: room.players,
      gameState: room.gameState
    })
    
    console.log(`Room ${gameId} now has ${room.players.length} players`)
  })

  // Handle game actions
  socket.on('gameAction', (action) => {
    const gameId = Array.from(socket.rooms)[1] // First room is socket.id, second is gameId
    if (!gameId || !gameRooms.has(gameId)) return
    
    const room = gameRooms.get(gameId)
    console.log(`Game action in ${gameId}:`, action)
    
    // Broadcast action to other players
    socket.to(gameId).emit('gameUpdate', {
      playerId: socket.id,
      action: action
    })
    
    // Update room state based on action
    if (action.type === 'startGame') {
      room.gameState = 'playing'
      room.startTime = Date.now()
      io.to(gameId).emit('gameStateChanged', { state: 'playing' })
    } else if (action.type === 'endGame') {
      room.gameState = 'finished'
      if (action.score) {
        room.scores[socket.id] = action.score
      }
      io.to(gameId).emit('gameStateChanged', { 
        state: 'finished',
        scores: room.scores
      })
    }
  })

  // Handle chat messages
  socket.on('chatMessage', (message) => {
    const gameId = Array.from(socket.rooms)[1]
    if (!gameId) return
    
    const room = gameRooms.get(gameId)
    const player = room?.players.find(p => p.id === socket.id)
    
    if (player) {
      const chatMessage = {
        text: message.text,
        sender: player.name,
        timestamp: Date.now(),
        playerId: socket.id
      }
      
      // Broadcast to all players in room
      io.to(gameId).emit('chatMessage', chatMessage)
    }
  })

  // Handle analytics data
  socket.on('analytics', (data) => {
    console.log('Analytics data received:', data)
    
    if (data.type === 'swipe') {
      analytics.swipeData.push({
        ...data,
        timestamp: Date.now(),
        userId: socket.id
      })
    } else if (data.type === 'playTime') {
      analytics.playTimeData.push({
        ...data,
        timestamp: Date.now(),
        userId: socket.id
      })
    } else if (data.type === 'engagement') {
      analytics.engagementMetrics[socket.id] = {
        ...analytics.engagementMetrics[socket.id],
        ...data,
        lastUpdated: Date.now()
      }
    }
  })

  // Leave game room
  socket.on('leaveGame', () => {
    const gameId = Array.from(socket.rooms)[1]
    if (gameId && gameRooms.has(gameId)) {
      const room = gameRooms.get(gameId)
      room.players = room.players.filter(p => p.id !== socket.id)
      
      // Notify other players
      socket.to(gameId).emit('playerLeft', socket.id)
      
      // Clean up empty rooms
      if (room.players.length === 0) {
        gameRooms.delete(gameId)
        console.log(`Room ${gameId} deleted (empty)`)
      }
      
      socket.leave(gameId)
      console.log(`Player ${socket.id} left game ${gameId}`)
    }
  })

  // Disconnect handling
  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`)
    analytics.activeUsers.delete(socket.id)
    
    // Remove player from all rooms
    gameRooms.forEach((room, gameId) => {
      const playerIndex = room.players.findIndex(p => p.id === socket.id)
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1)
        socket.to(gameId).emit('playerLeft', socket.id)
        
        if (room.players.length === 0) {
          gameRooms.delete(gameId)
          console.log(`Room ${gameId} deleted (empty after disconnect)`)
        }
      }
    })
  })
})

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    activeUsers: analytics.activeUsers.size,
    activeRooms: gameRooms.size
  })
})

app.get('/api/analytics', (req, res) => {
  res.json({
    activeUsers: analytics.activeUsers.size,
    activeRooms: gameRooms.size,
    totalSwipes: analytics.swipeData.length,
    totalPlaySessions: analytics.playTimeData.length,
    engagementMetrics: Object.keys(analytics.engagementMetrics).length
  })
})

app.get('/api/games', (req, res) => {
  const games = [
    {
      id: 'game_1',
      title: 'Pixel Runner',
      description: 'An endless runner with retro pixel art graphics',
      genre: 'arcade',
      difficulty: 'easy',
      estimatedTime: '2-5 min',
      image: 'https://picsum.photos/300/400?random=1',
      tags: ['retro', 'pixel-art', 'endless-runner'],
      multiplayer: true,
      rating: 4.2
    },
    {
      id: 'game_2',
      title: 'Quantum Puzzle',
      description: 'Mind-bending physics puzzles in a quantum world',
      genre: 'puzzle',
      difficulty: 'hard',
      estimatedTime: '10-15 min',
      image: 'https://picsum.photos/300/400?random=2',
      tags: ['puzzle', 'physics', 'quantum'],
      multiplayer: false,
      rating: 4.8
    },
    {
      id: 'game_3',
      title: 'Space Warriors',
      description: 'Epic space battles with stunning visuals',
      genre: 'action',
      difficulty: 'medium',
      estimatedTime: '5-8 min',
      image: 'https://picsum.photos/300/400?random=3',
      tags: ['space', 'action', 'battle'],
      multiplayer: true,
      rating: 4.5
    },
    {
      id: 'game_4',
      title: 'Zen Garden',
      description: 'Relaxing garden design with peaceful music',
      genre: 'casual',
      difficulty: 'easy',
      estimatedTime: '3-7 min',
      image: 'https://picsum.photos/300/400?random=4',
      tags: ['relaxing', 'design', 'zen'],
      multiplayer: false,
      rating: 4.0
    },
    {
      id: 'game_5',
      title: 'Neon Racing',
      description: 'High-speed racing through neon-lit cityscapes',
      genre: 'racing',
      difficulty: 'medium',
      estimatedTime: '4-6 min',
      image: 'https://picsum.photos/300/400?random=5',
      tags: ['racing', 'neon', 'speed'],
      multiplayer: true,
      rating: 4.3
    },
    {
      id: 'game_6',
      title: 'Dragon Quest',
      description: 'Epic RPG adventure in a fantasy world',
      genre: 'rpg',
      difficulty: 'hard',
      estimatedTime: '15-20 min',
      image: 'https://picsum.photos/300/400?random=6',
      tags: ['rpg', 'fantasy', 'adventure'],
      multiplayer: true,
      rating: 4.7
    },
    {
      id: 'game_7',
      title: 'Soccer Stars',
      description: 'Fast-paced soccer matches with realistic physics',
      genre: 'sports',
      difficulty: 'medium',
      estimatedTime: '6-10 min',
      image: 'https://picsum.photos/300/400?random=7',
      tags: ['soccer', 'sports', 'physics'],
      multiplayer: true,
      rating: 4.1
    },
    {
      id: 'game_8',
      title: 'Indie Adventure',
      description: 'Charming indie game with unique art style',
      genre: 'indie',
      difficulty: 'easy',
      estimatedTime: '8-12 min',
      image: 'https://picsum.photos/300/400?random=8',
      tags: ['indie', 'adventure', 'charming'],
      multiplayer: false,
      rating: 4.6
    }
  ]
  
  res.json(games)
})

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' })
})

const PORT = process.env.PORT || 3001
const HOST = '0.0.0.0' // Listen on all network interfaces

server.listen(PORT, HOST, () => {
  console.log(`🚀 Tinder for Games server running on ${HOST}:${PORT}`)
  console.log(`📊 Analytics endpoint: http://${HOST}:${PORT}/api/analytics`)
  console.log(`🎮 Games endpoint: http://${HOST}:${PORT}/api/games`)
  console.log(`🔌 WebSocket endpoint: ws://${HOST}:${PORT}`)
  console.log(`📱 Mobile access: http://10.0.0.235:${PORT}`)
}) 