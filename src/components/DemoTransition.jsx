import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DemoTransition = () => {
  const [currentStep, setCurrentStep] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const steps = [
    {
      id: 'loading',
      title: 'iPhone Loading Screen',
      duration: 3000,
      component: <LoadingScreen />
    },
    {
      id: 'appstore',
      title: 'App Store Screens',
      duration: 4000,
      component: <AppStoreScreens />
    }
  ]

  useEffect(() => {
    if (!isPlaying) return

    const timer = setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsPlaying(false)
        setCurrentStep(0)
      }
    }, steps[currentStep].duration)

    return () => clearTimeout(timer)
  }, [currentStep, isPlaying, steps])

  const startDemo = () => {
    setCurrentStep(0)
    setIsPlaying(true)
  }

  const resetDemo = () => {
    setIsPlaying(false)
    setCurrentStep(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 font-['Press_Start_2P']">
          Demo: App Discovery Problem
        </h1>
        <p className="text-xl text-blue-200 max-w-2xl">
          See how users struggle to find games in the App Store
        </p>
      </div>

      {/* Controls */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={startDemo}
          disabled={isPlaying}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
        >
          {isPlaying ? 'Playing...' : 'Start Demo'}
        </button>
        <button
          onClick={resetDemo}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
        >
          Reset
        </button>
      </div>

      {/* Progress */}
      <div className="w-full max-w-md mb-8">
        <div className="flex justify-between text-white mb-2">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{steps[currentStep]?.title}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-blue-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: isPlaying ? '100%' : 0 }}
            transition={{ duration: steps[currentStep]?.duration / 1000, ease: 'linear' }}
          />
        </div>
      </div>

      {/* Demo Container */}
      <div className="relative w-full max-w-sm mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            {steps[currentStep]?.component}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step Indicators */}
      <div className="flex gap-2 mt-8">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentStep ? 'bg-blue-500' : 'bg-gray-600'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

const LoadingScreen = () => (
  <div className="bg-black rounded-[3rem] p-2 shadow-2xl">
    <div className="w-full h-[600px] bg-black rounded-[2.5rem] flex flex-col items-center justify-center relative overflow-hidden">
      {/* iPhone Frame */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black rounded-full border border-gray-800"></div>
      
      {/* Loading Animation */}
      <div className="flex flex-col items-center space-y-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-2">iPhone</h2>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    </div>
  </div>
)

const AppStoreScreens = () => (
  <div className="bg-black rounded-[3rem] p-2 shadow-2xl">
    <div className="w-full h-[600px] bg-white rounded-[2.5rem] flex flex-col relative overflow-hidden">
      {/* Status Bar */}
      <div className="bg-white h-12 flex items-center justify-between px-6 pt-2">
        <span className="text-black font-semibold">9:41</span>
        <div className="flex items-center space-x-1">
          <div className="w-6 h-3 border-2 border-black rounded-sm"></div>
          <div className="w-1 h-3 bg-black rounded-sm"></div>
          <div className="w-1 h-3 bg-black rounded-sm"></div>
          <div className="w-1 h-3 bg-black rounded-sm"></div>
        </div>
      </div>

      {/* App Store Header */}
      <div className="bg-blue-500 text-white p-4">
        <h1 className="text-xl font-bold">App Store</h1>
        <p className="text-blue-100">Games</p>
      </div>

      {/* App Grid */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-gray-200 rounded-xl p-2 text-center"
            >
              <div className="w-full h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-2"></div>
              <div className="text-xs text-gray-600 font-medium">
                Game {i + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="bg-gray-100 h-16 flex items-center justify-around border-t border-gray-200">
        <div className="text-center">
          <div className="w-6 h-6 bg-blue-500 rounded-lg mx-auto mb-1"></div>
          <span className="text-xs text-blue-500 font-medium">Today</span>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 bg-gray-400 rounded-lg mx-auto mb-1"></div>
          <span className="text-xs text-gray-500">Games</span>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 bg-gray-400 rounded-lg mx-auto mb-1"></div>
          <span className="text-xs text-gray-500">Apps</span>
        </div>
        <div className="text-center">
          <div className="w-6 h-6 bg-gray-400 rounded-lg mx-auto mb-1"></div>
          <span className="text-xs text-gray-500">Search</span>
        </div>
      </div>
    </div>
  </div>
)

export default DemoTransition 