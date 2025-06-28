import React, { useState } from 'react'
import DemoTransition from './DemoTransition'

const DemoPage = () => {
  const [showDemo, setShowDemo] = useState(false)
  const [demoComplete, setDemoComplete] = useState(false)

  const handleStartDemo = () => {
    setShowDemo(true)
  }

  const handleDemoComplete = () => {
    setDemoComplete(true)
    setShowDemo(false)
  }

  const handleReset = () => {
    setShowDemo(false)
    setDemoComplete(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {!showDemo && !demoComplete && (
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">🎮 Tinder for Games Demo</h1>
          <p className="text-xl mb-8 text-gray-300">
            Watch the transition from iPhone home screen → App Store → Tinder for Games
          </p>
          <button
            onClick={handleStartDemo}
            className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:scale-105 transition-transform"
          >
            🚀 Start Demo
          </button>
        </div>
      )}

      {demoComplete && (
        <div className="text-center text-white">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold mb-4">Demo Complete!</h1>
          <p className="text-xl mb-8 text-gray-300">
            Perfect for your video pitch - shows the problem and solution clearly
          </p>
          <button
            onClick={handleReset}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full text-lg font-bold hover:scale-105 transition-transform"
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {showDemo && (
        <DemoTransition onComplete={handleDemoComplete} />
      )}
    </div>
  )
}

export default DemoPage 