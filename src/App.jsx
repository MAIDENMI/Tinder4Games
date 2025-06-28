import React from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { GameProvider } from './context/GameContext'
import SwipeInterface from './components/SwipeInterface'
import DemoPage from './components/DemoPage'

function App() {
  const location = useLocation()

  return (
    <GameProvider>
      <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <main className="flex-1 overflow-hidden">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<SwipeInterface />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/game/:gameId" element={
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <h1>Game Room</h1>
                  <p>Coming soon...</p>
                </div>
              </div>
            } />
            <Route path="/profile" element={
              <div className="h-full flex items-center justify-center">
                <div className="text-center text-white">
                  <h1>Profile</h1>
                  <p>Coming soon...</p>
                </div>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </GameProvider>
  )
}

export default App 