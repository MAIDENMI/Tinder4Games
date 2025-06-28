import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Users, Clock, Trophy, MessageCircle, Send } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useSocket } from '../context/SocketContext'

const GameRoom = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const { games, recordPlayTime, updateEngagement } = useGame()
  const { joinGameRoom, leaveGameRoom, onlinePlayers, isConnected, sendChatMessage } = useSocket()
  
  const [gameState, setGameState] = useState('waiting') // waiting, playing, finished
  const [playTime, setPlayTime] = useState(0)
  const [score, setScore] = useState(0)
  const [chatMessages, setChatMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [startTime, setStartTime] = useState(null)

  const game = games.find(g => g.id === gameId)

  useEffect(() => {
    if (game && isConnected) {
      joinGameRoom(gameId, {
        id: 'user_' + Math.random().toString(36).substr(2, 9),
        name: 'Player',
        avatar: '🎮'
      })
    }

    return () => {
      if (isConnected) {
        leaveGameRoom()
      }
    }
  }, [gameId, game, isConnected])

  useEffect(() => {
    let interval
    if (gameState === 'playing' && startTime) {
      interval = setInterval(() => {
        setPlayTime(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState, startTime])

  const startGame = () => {
    setGameState('playing')
    setStartTime(Date.now())
    setScore(0)
    updateEngagement({ gameStarted: true, gameId })
  }

  const endGame = () => {
    setGameState('finished')
    if (startTime) {
      const totalPlayTime = Math.floor((Date.now() - startTime) / 1000)
      recordPlayTime(gameId, totalPlayTime)
      updateEngagement({ 
        gameCompleted: true, 
        finalScore: score, 
        playTime: totalPlayTime,
        gameId 
      })
    }
  }

  const sendMessage = () => {
    if (newMessage.trim() && isConnected) {
      sendChatMessage({
        text: newMessage,
        sender: 'You',
        timestamp: Date.now()
      })
      setChatMessages(prev => [...prev, {
        text: newMessage,
        sender: 'You',
        timestamp: Date.now()
      }])
      setNewMessage('')
    }
  }

  if (!game) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-white mb-2">Game not found</h2>
          <button 
            onClick={() => navigate('/')}
            className="game-button"
          >
            Back to Discover
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/10 backdrop-blur-lg">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-white hover:text-purple-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        
        <div className="text-center">
          <h1 className="text-xl font-bold text-white">{game.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{onlinePlayers.length + 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{playTime}s</span>
            </div>
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4" />
              <span>{score}</span>
            </div>
          </div>
        </div>
        
        <div className="w-20"></div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex">
        {/* Main Game Canvas */}
        <div className="flex-1 p-4">
          <div className="h-full bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
            {gameState === 'waiting' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🎮</div>
                <h2 className="text-2xl font-bold text-white mb-4">Ready to play?</h2>
                <p className="text-gray-300 mb-6">{game.description}</p>
                <button
                  onClick={startGame}
                  className="game-button"
                >
                  Start Game
                </button>
              </motion.div>
            )}
            
            {gameState === 'playing' && (
              <div className="text-center">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-2">Game in Progress</h3>
                <p className="text-gray-300">Score: {score}</p>
                <button
                  onClick={endGame}
                  className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  End Game
                </button>
              </div>
            )}
            
            {gameState === 'finished' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="text-2xl font-bold text-white mb-2">Game Complete!</h2>
                <p className="text-gray-300 mb-4">Final Score: {score}</p>
                <p className="text-gray-300 mb-6">Play Time: {playTime} seconds</p>
                <button
                  onClick={() => navigate('/')}
                  className="game-button"
                >
                  Back to Discover
                </button>
              </motion.div>
            )}
          </div>
        </div>

        {/* Chat Sidebar */}
        {game.multiplayer && (
          <div className="w-80 bg-white/5 border-l border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Chat
              </h3>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <div key={index} className="mb-3">
                  <div className="text-sm text-purple-400 font-medium">{msg.sender}</div>
                  <div className="text-white bg-white/10 rounded-lg p-2 mt-1">
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 bg-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={sendMessage}
                  className="px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default GameRoom 