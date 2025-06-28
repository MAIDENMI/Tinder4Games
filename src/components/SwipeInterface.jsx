import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, X, Star, Play, Users, Zap, Trophy } from 'lucide-react'
import { useGame } from '../context/GameContext'
import { useNavigate } from 'react-router-dom'

const SwipeInterface = () => {
  const { games, currentGameIndex, likeGame, dislikeGame } = useGame()
  const [swipeDirection, setSwipeDirection] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [imageError, setImageError] = useState(false)
  const navigate = useNavigate()

  // Loading state
  if (!games || games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-white text-xl font-bold mt-20 animate-pulse">Loading games...</div>
      </div>
    )
  }

  // No more games state
  if (currentGameIndex >= games.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="text-white text-xl font-bold mt-20">No more games! 🎉</div>
      </div>
    )
  }

  // Use a fallback game if games array is empty (shouldn't happen now)
  const currentGame = games[currentGameIndex] || {
    id: 'demo_1',
    title: 'Pixel Runner',
    description: 'An endless runner with retro pixel art graphics',
    genre: 'arcade',
    difficulty: 'easy',
    estimatedTime: '2-5 min',
    image: 'https://picsum.photos/300/400?random=1',
    tags: ['retro', 'pixel-art', 'endless-runner'],
    multiplayer: true,
    rating: 4.2
  }

  const handleSwipe = (direction) => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setSwipeDirection(direction)
    
    setTimeout(() => {
      if (direction === 'right') {
        likeGame()
      } else {
        dislikeGame()
      }
      setSwipeDirection(null)
      setIsAnimating(false)
    }, 300)
  }

  const handlePlayGame = () => {
    navigate(`/game/${currentGame.id}`)
  }

  const handleImageError = () => {
    setImageError(true)
  }

  // Emoji mapping for different elements
  const getGenreEmoji = (genre) => {
    const emojiMap = {
      'arcade': '🕹️',
      'puzzle': '🧩',
      'action': '⚡',
      'adventure': '🗺️',
      'strategy': '🎯',
      'rpg': '⚔️',
      'sports': '⚽',
      'racing': '🏎️',
      'shooter': '🎯',
      'simulation': '🏗️',
      'casual': '😊',
      'indie': '🌟'
    }
    return emojiMap[genre.toLowerCase()] || '🎮'
  }

  const getDifficultyEmoji = (difficulty) => {
    const emojiMap = {
      'easy': '😊',
      'medium': '😐',
      'hard': '😰',
      'expert': '😱'
    }
    return emojiMap[difficulty.toLowerCase()] || '😊'
  }

  // Animated Game Scene Component
  const AnimatedGameScene = ({ game }) => {
    const genre = game.genre?.toLowerCase() || 'arcade'
    
    const renderGameScene = () => {
      switch (genre) {
        case 'arcade':
          return (
            <div className="relative w-full h-full bg-gradient-to-b from-purple-900 to-black overflow-hidden">
              {/* Arcade Cabinet */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-32 h-40 bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg border-2 border-yellow-400">
                <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-24 h-16 bg-black rounded border border-yellow-400">
                  {/* Screen Content */}
                  <div className="w-full h-full bg-green-900 relative overflow-hidden">
                    {/* Moving Pixels */}
                    <motion.div
                      className="absolute w-2 h-2 bg-green-400 rounded-full"
                      animate={{
                        x: [0, 80, 0],
                        y: [0, 40, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                    <motion.div
                      className="absolute w-1 h-1 bg-green-300 rounded-full"
                      animate={{
                        x: [20, 60, 20],
                        y: [20, 60, 20],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  </div>
                </div>
                {/* Joystick */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-6 h-6 bg-red-500 rounded-full border-2 border-red-600">
                  <motion.div
                    className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-300 rounded-full"
                    animate={{
                      x: [-2, 2, -2],
                      y: [-2, 2, -2],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
              </div>
              
              {/* Floating Game Elements */}
              <motion.div
                className="absolute top-8 left-8 text-4xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                🕹️
              </motion.div>
              <motion.div
                className="absolute top-16 right-8 text-3xl"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⭐
              </motion.div>
            </div>
          )
          
        case 'puzzle':
          return (
            <div className="relative w-full h-full bg-gradient-to-b from-blue-900 to-indigo-900 overflow-hidden">
              {/* Puzzle Grid */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 grid grid-cols-3 gap-1">
                {[...Array(9)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded border border-blue-300"
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.1,
                      repeat: Infinity,
                    }}
                  />
                ))}
              </div>
              
              {/* Floating Puzzle Pieces */}
              <motion.div
                className="absolute top-8 left-8 text-4xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🧩
              </motion.div>
              <motion.div
                className="absolute bottom-8 right-8 text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                🎯
              </motion.div>
            </div>
          )
          
        case 'action':
          return (
            <div className="relative w-full h-full bg-gradient-to-b from-red-900 to-orange-900 overflow-hidden">
              {/* Action Scene */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full">
                {/* Character */}
                <motion.div
                  className="absolute bottom-0 left-8 text-4xl"
                  animate={{
                    y: [0, -20, 0],
                    x: [0, 10, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🦸‍♂️
                </motion.div>
                
                {/* Projectiles */}
                <motion.div
                  className="absolute bottom-8 left-16 text-2xl"
                  animate={{
                    x: [0, 200],
                    opacity: [1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: 0.5,
                  }}
                >
                  ⚡
                </motion.div>
                
                {/* Enemies */}
                <motion.div
                  className="absolute bottom-4 right-8 text-3xl"
                  animate={{
                    x: [0, -10, 0],
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.2,
                    repeat: Infinity,
                  }}
                >
                  👾
                </motion.div>
              </div>
              
              {/* Background Effects */}
              <motion.div
                className="absolute top-4 left-1/2 transform -translate-x-1/2 text-2xl"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                💥
              </motion.div>
            </div>
          )
          
        case 'racing':
          return (
            <div className="relative w-full h-full bg-gradient-to-b from-green-900 to-blue-900 overflow-hidden">
              {/* Road */}
              <div className="absolute bottom-0 left-0 w-full h-16 bg-gray-800">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-yellow-400 animate-pulse"></div>
              </div>
              
              {/* Car */}
              <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-4xl"
                animate={{
                  x: [-20, 20, -20],
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                🏎️
              </motion.div>
              
              {/* Speed Lines */}
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-8 left-0 w-2 h-1 bg-white opacity-60"
                  animate={{
                    x: [0, 300],
                    opacity: [0.6, 0],
                  }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.1,
                    repeat: Infinity,
                  }}
                  style={{ top: `${20 + i * 8}%` }}
                />
              ))}
              
              {/* Checkered Flag */}
              <motion.div
                className="absolute top-4 right-4 text-3xl"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🏁
              </motion.div>
            </div>
          )
          
        default:
          return (
            <div className="relative w-full h-full bg-gradient-to-b from-purple-900 to-pink-900 overflow-hidden">
              {/* Default Game Scene */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl">
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  🎮
                </motion.div>
              </div>
              
              {/* Floating Elements */}
              <motion.div
                className="absolute top-8 left-8 text-2xl"
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ⭐
              </motion.div>
              <motion.div
                className="absolute bottom-8 right-8 text-2xl"
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
              >
                💎
              </motion.div>
              <motion.div
                className="absolute top-1/2 right-8 text-2xl"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🔥
              </motion.div>
            </div>
          )
      }
    }

    return (
      <div className="w-full h-full rounded-2xl overflow-hidden border-2 border-purple-400 shadow-2xl">
        {renderGameScene()}
        
        {/* Game Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="text-white">
            <h3 className="text-lg font-bold mb-1">{game.title}</h3>
            <div className="flex items-center gap-2 text-sm">
              <span>{getGenreEmoji(game.genre)} {game.genre}</span>
              <span>•</span>
              <span>{getDifficultyEmoji(game.difficulty)} {game.difficulty}</span>
              {game.multiplayer && (
                <>
                  <span>•</span>
                  <span>👥 Multiplayer</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(game.rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-400'}`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-300">({game.rating})</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Arcade Header */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative p-4 text-center border-b-4 border-purple-500 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600"
      >
        {/* Arcade Border Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-yellow-400 opacity-20 animate-pulse"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="w-6 h-6 text-yellow-300 animate-bounce" />
            <h1 className="text-2xl font-bold text-white tracking-wider arcade-text">
              🎮 TINDER FOR GAMES 🎮
            </h1>
            <Zap className="w-6 h-6 text-yellow-300 animate-bounce" />
          </div>
          <p className="text-sm text-purple-200 retro-text">🔍 DISCOVER • 👆 SWIPE • 🚀 PLAY</p>
        </div>
        
        {/* Arcade Corner Decorations */}
        <div className="absolute top-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 left-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-2 right-2 w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        {/* Game Card */}
        <div className="relative w-full max-w-sm mb-8 flex justify-center" style={{ minHeight: 400 }}>
          <motion.div
            key={currentGame.id}
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ 
              scale: 1, 
              opacity: 1, 
              y: 0,
              rotate: swipeDirection === 'right' ? 20 : swipeDirection === 'left' ? -20 : 0,
              x: swipeDirection === 'right' ? 200 : swipeDirection === 'left' ? -200 : 0
            }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="game-card relative overflow-hidden w-full max-w-sm"
            style={{ height: 400 }}
          >
            <AnimatedGameScene game={currentGame} />
          </motion.div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-6 mb-6">
          <motion.button
            onClick={() => handleSwipe('left')}
            disabled={isAnimating}
            className="action-button action-nope relative overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
            <X className="w-8 h-8 relative z-10" />
            <span className="absolute -bottom-6 text-xs text-red-400">❌</span>
          </motion.button>
          
          <motion.button
            onClick={handlePlayGame}
            className="game-button flex items-center gap-2 relative overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-full"></div>
            <Play className="w-5 h-5 relative z-10" />
            <span className="relative z-10 font-bold">🚀 PLAY NOW</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleSwipe('right')}
            disabled={isAnimating}
            className="action-button action-like relative overflow-hidden"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
            <Heart className="w-8 h-8 relative z-10" />
            <span className="absolute -bottom-6 text-xs text-green-400">❤️</span>
          </motion.button>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-300 font-mono">
            🎯 GAME {currentGameIndex + 1} OF {Math.max(games.length, 1)}
          </div>
          <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden border border-gray-600">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${((currentGameIndex + 1) / Math.max(games.length, 1)) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-1">
            <span>🎮</span>
            <span>Games Available</span>
          </div>
          <div className="flex items-center gap-1">
            <span>🔥</span>
            <span>Hot Picks</span>
          </div>
          <div className="flex items-center gap-1">
            <span>⚡</span>
            <span>Instant Play</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwipeInterface 