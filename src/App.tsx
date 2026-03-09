/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Gamepad2 } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-fuchsia-500/30 overflow-hidden relative flex flex-col">
      {/* Background ambient glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-fuchsia-600/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-600/10 blur-[120px] pointer-events-none" />
      
      {/* Header */}
      <header className="w-full p-6 flex items-center justify-center relative z-10">
        <div className="flex items-center gap-3">
          <Gamepad2 className="w-8 h-8 text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          <div className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 px-6 py-2 rounded-sm shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <h1 className="text-3xl font-black tracking-tighter uppercase text-white drop-shadow-md">
              Neon Snake & Beats
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 p-6 z-10 w-full max-w-6xl mx-auto">
        
        {/* Left/Top: Music Player */}
        <div className="w-full lg:w-1/3 flex justify-center lg:justify-end order-2 lg:order-1">
          <MusicPlayer />
        </div>

        {/* Center/Right: Game */}
        <div className="w-full lg:w-2/3 flex justify-center lg:justify-start order-1 lg:order-2">
          <SnakeGame />
        </div>

      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-gray-600 font-mono text-xs z-10">
        <p>© {new Date().getFullYear()} AI Studio. All systems operational.</p>
      </footer>
    </div>
  );
}
