import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { User, Heart, Clock, Trophy, Settings, BarChart3, Gamepad2 } from 'lucide-react'
import { useGame } from '../context/GameContext'

const Profile = () => {
  const { userProfile, likedGames, analytics } = useGame()
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'liked', label: 'Liked Games', icon: Heart },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  const totalPlayTime = analytics.playTimeData.reduce((sum, record) => sum + record.playTime, 0)
  const averagePlayTime = analytics.playTimeData.length > 0 
    ? Math.round(totalPlayTime / analytics.playTimeData.length) 
    : 0

  const renderOverview = () => (
    <div className="space-y-6">
      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/10 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-white">{likedGames.length}</div>
          <div className="text-sm text-gray-300">Games Liked</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/10 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-white">{analytics.playTimeData.length}</div>
          <div className="text-sm text-gray-300">Games Played</div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 rounded-xl p-4 text-center"
        >
          <div className="text-2xl font-bold text-white">{Math.round(totalPlayTime / 60)}m</div>
          <div className="text-sm text-gray-300">Total Time</div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </h3>
        <div className="space-y-3">
          {analytics.playTimeData.slice(-3).reverse().map((record, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <Gamepad2 className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-white font-medium">Game {record.gameId}</div>
                  <div className="text-sm text-gray-300">{record.playTime}s played</div>
                </div>
              </div>
              <div className="text-sm text-gray-400">
                {new Date(record.timestamp).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderLikedGames = () => (
    <div className="space-y-4">
      {likedGames.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">💔</div>
          <h3 className="text-xl font-bold text-white mb-2">No liked games yet</h3>
          <p className="text-gray-300">Start swiping to discover games you love!</p>
        </div>
      ) : (
        likedGames.map((game, index) => (
          <motion.div
            key={game.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/10 rounded-xl p-4 flex items-center gap-4"
          >
            <img 
              src={game.image} 
              alt={game.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white">{game.title}</h3>
              <p className="text-sm text-gray-300">{game.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-1 bg-purple-600 rounded-full text-xs text-white">
                  {game.genre}
                </span>
                <span className="px-2 py-1 bg-blue-600 rounded-full text-xs text-white">
                  {game.difficulty}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-yellow-400">
                <Trophy className="w-4 h-4" />
                <span className="text-sm">{game.rating}</span>
              </div>
            </div>
          </motion.div>
        ))
      )}
    </div>
  )

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Engagement Metrics */}
      <div className="bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Engagement Analytics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-400">
              {analytics.swipeData.filter(d => d.action === 'like').length}
            </div>
            <div className="text-sm text-gray-300">Total Likes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {analytics.swipeData.filter(d => d.action === 'dislike').length}
            </div>
            <div className="text-sm text-gray-300">Total Dislikes</div>
          </div>
        </div>
      </div>

      {/* Play Time Analytics */}
      <div className="bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Play Time Insights</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-300">Average Session:</span>
            <span className="text-white font-medium">{averagePlayTime}s</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Total Sessions:</span>
            <span className="text-white font-medium">{analytics.playTimeData.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Longest Session:</span>
            <span className="text-white font-medium">
              {Math.max(...analytics.playTimeData.map(d => d.playTime), 0)}s
            </span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">User Preferences</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred Difficulty
            </label>
            <select 
              value={userProfile.preferences.difficulty}
              className="w-full bg-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Preferred Play Time
            </label>
            <select 
              value={userProfile.preferences.playTime}
              className="w-full bg-white/10 text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="short">Short (2-5 min)</option>
              <option value="medium">Medium (5-10 min)</option>
              <option value="long">Long (10+ min)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="p-6 bg-white/10 backdrop-blur-lg">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-2xl">
            🎮
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">{userProfile.name}</h1>
            <p className="text-gray-300">Gaming enthusiast</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-white/10">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-purple-400 border-b-2 border-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'liked' && renderLikedGames()}
        {activeTab === 'stats' && renderAnalytics()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  )
}

export default Profile 