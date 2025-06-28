import React, { createContext, useContext, useReducer, useEffect } from 'react'

const GameContext = createContext()

const initialState = {
  games: [],
  currentGameIndex: 0,
  likedGames: [],
  dislikedGames: [],
  userProfile: {
    id: 'user_' + Math.random().toString(36).substr(2, 9),
    name: 'Player',
    preferences: {
      genres: [],
      difficulty: 'medium',
      playTime: 'short'
    },
    stats: {
      gamesPlayed: 0,
      gamesLiked: 0,
      totalPlayTime: 0
    }
  },
  analytics: {
    swipeData: [],
    playTimeData: [],
    engagementMetrics: {}
  }
}

const gameReducer = (state, action) => {
  switch (action.type) {
    case 'SET_GAMES':
      return { ...state, games: action.payload }
    
    case 'LIKE_GAME':
      const likedGame = state.games[state.currentGameIndex]
      return {
        ...state,
        likedGames: [...state.likedGames, likedGame],
        currentGameIndex: state.currentGameIndex + 1,
        analytics: {
          ...state.analytics,
          swipeData: [...state.analytics.swipeData, {
            gameId: likedGame.id,
            action: 'like',
            timestamp: Date.now(),
            userId: state.userProfile.id
          }]
        }
      }
    
    case 'DISLIKE_GAME':
      const dislikedGame = state.games[state.currentGameIndex]
      return {
        ...state,
        dislikedGames: [...state.dislikedGames, dislikedGame],
        currentGameIndex: state.currentGameIndex + 1,
        analytics: {
          ...state.analytics,
          swipeData: [...state.analytics.swipeData, {
            gameId: dislikedGame.id,
            action: 'dislike',
            timestamp: Date.now(),
            userId: state.userProfile.id
          }]
        }
      }
    
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        userProfile: { ...state.userProfile, ...action.payload }
      }
    
    case 'RECORD_PLAY_TIME':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          playTimeData: [...state.analytics.playTimeData, {
            gameId: action.payload.gameId,
            playTime: action.payload.playTime,
            timestamp: Date.now(),
            userId: state.userProfile.id
          }]
        }
      }
    
    case 'UPDATE_ENGAGEMENT':
      return {
        ...state,
        analytics: {
          ...state.analytics,
          engagementMetrics: {
            ...state.analytics.engagementMetrics,
            ...action.payload
          }
        }
      }
    
    default:
      return state
  }
}

export const GameProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  // Fetch games from backend API
  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('http://10.0.0.235:3001/api/games')
        if (response.ok) {
          const games = await response.json()
          dispatch({ type: 'SET_GAMES', payload: games })
        } else {
          console.error('Failed to fetch games from backend')
          // Fallback to sample games if API fails
          const fallbackGames = [
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
            }
          ]
          dispatch({ type: 'SET_GAMES', payload: fallbackGames })
        }
      } catch (error) {
        console.error('Error fetching games:', error)
        // Use fallback games if network fails
        const fallbackGames = [
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
          }
        ]
        dispatch({ type: 'SET_GAMES', payload: fallbackGames })
      }
    }

    fetchGames()
  }, [])

  const likeGame = () => dispatch({ type: 'LIKE_GAME' })
  const dislikeGame = () => dispatch({ type: 'DISLIKE_GAME' })
  const updateProfile = (profile) => dispatch({ type: 'UPDATE_USER_PROFILE', payload: profile })
  const recordPlayTime = (gameId, playTime) => dispatch({ type: 'RECORD_PLAY_TIME', payload: { gameId, playTime } })
  const updateEngagement = (metrics) => dispatch({ type: 'UPDATE_ENGAGEMENT', payload: metrics })

  const value = {
    ...state,
    likeGame,
    dislikeGame,
    updateProfile,
    recordPlayTime,
    updateEngagement
  }

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = useContext(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }
  return context
} 