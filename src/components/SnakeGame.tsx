import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Trophy, RotateCcw, Sparkles, Square, SquareDashed } from 'lucide-react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 70;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 10 });
  
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  const gameLoopRef = useRef<number | null>(null);
  const speedRef = useRef(INITIAL_SPEED);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
  }, []);

  const resetGame = () => {
    const initialSnake = [{ x: 10, y: 10 }];
    setSnake(initialSnake);
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    setFood(generateFood(initialSnake));
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
    speedRef.current = INITIAL_SPEED;
  };

  const update = useCallback(() => {
    if (!isPlaying || gameOver) return;

    directionRef.current = nextDirectionRef.current;
    
    setSnake(prevSnake => {
      const head = { ...prevSnake[0] };

      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check collisions with walls
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return prevSnake;
      }

      // Check collisions with self
      if (prevSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return prevSnake;
      }

      const newSnake = [head, ...prevSnake];

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          speedRef.current = Math.max(30, INITIAL_SPEED - Math.floor(newScore / 50) * 5);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [isPlaying, gameOver, food, highScore, generateFood]);

  const handleGameOver = () => {
    setGameOver(true);
    setIsPlaying(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ' && !isPlaying && !gameOver) {
        setIsPlaying(true);
        return;
      }

      if (e.key === ' ' && gameOver) {
        resetGame();
        return;
      }

      const currentDir = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, gameOver]);

  useEffect(() => {
    if (isPlaying) {
      const loop = () => {
        update();
        gameLoopRef.current = window.setTimeout(loop, speedRef.current);
      };
      gameLoopRef.current = window.setTimeout(loop, speedRef.current);
    }
    
    return () => {
      if (gameLoopRef.current) clearTimeout(gameLoopRef.current);
    };
  }, [isPlaying, update]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-between w-full max-w-[400px] px-4">
        <div className="flex flex-col">
          <span className="text-cyan-500/70 text-xs font-mono uppercase tracking-widest">Score</span>
          <span className="text-cyan-400 font-mono text-2xl font-bold drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-fuchsia-500/70 text-xs font-mono uppercase tracking-widest flex items-center gap-1">
            <Trophy className="w-3 h-3" /> Best
          </span>
          <span className="text-fuchsia-400 font-mono text-2xl font-bold drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
            {highScore.toString().padStart(4, '0')}
          </span>
        </div>
      </div>

      <div className="relative p-1 rounded-xl bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
        <div 
          className="relative bg-[#050505] rounded-lg overflow-hidden"
          style={{ width: GRID_SIZE * CELL_SIZE, height: GRID_SIZE * CELL_SIZE }}
        >
          {/* Grid lines */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
            backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
          }} />

          {/* Food */}
          <div 
            className="absolute flex items-center justify-center transition-all duration-100"
            style={{ 
              left: food.x * CELL_SIZE, 
              top: food.y * CELL_SIZE,
              width: CELL_SIZE,
              height: CELL_SIZE
            }}
          >
            <Sparkles className="w-5 h-5 text-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,1)] animate-pulse" />
          </div>

          {/* Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            const opacity = Math.max(0.15, 1 - (index / snake.length) * 0.8);
            const glowIntensity = Math.max(2, 12 - index);

            return (
              <div 
                key={`${segment.x}-${segment.y}-${index}`}
                className="absolute flex items-center justify-center transition-all duration-75"
                style={{ 
                  left: segment.x * CELL_SIZE, 
                  top: segment.y * CELL_SIZE,
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  opacity: opacity,
                  zIndex: snake.length - index
                }}
              >
                {isHead ? (
                  <Square className="w-5 h-5 text-cyan-300 fill-cyan-300/40" style={{ filter: `drop-shadow(0 0 ${glowIntensity}px rgba(34,211,238,1))` }} />
                ) : (
                  <SquareDashed className="w-4 h-4 text-cyan-500" style={{ filter: `drop-shadow(0 0 ${glowIntensity}px rgba(6,182,212,0.8))` }} />
                )}
              </div>
            );
          })}
        </div>
        
        {!isPlaying && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg">
            <button 
              onClick={() => setIsPlaying(true)}
              className="px-6 py-3 bg-cyan-500/20 border border-cyan-400 text-cyan-300 rounded-full font-mono font-bold hover:bg-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all uppercase tracking-widest"
            >
              Press Space to Start
            </button>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md rounded-lg gap-6">
            <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 px-8 py-4 rounded-sm shadow-[0_0_20px_rgba(217,70,239,0.5)]">
              <h2 className="text-4xl font-black text-white uppercase tracking-widest drop-shadow-md">
                Game Over
              </h2>
            </div>
            <p className="text-cyan-200 font-mono text-lg">Final Score: {score}</p>
            <button 
              onClick={resetGame}
              className="mt-2 flex items-center gap-2 px-6 py-3 bg-fuchsia-500/20 border border-fuchsia-400 text-fuchsia-300 rounded-full font-mono font-bold hover:bg-fuchsia-500/40 hover:shadow-[0_0_20px_rgba(217,70,239,0.6)] transition-all uppercase tracking-widest"
            >
              <RotateCcw className="w-5 h-5" /> Play Again
            </button>
          </div>
        )}
      </div>
      
      <div className="text-gray-500 font-mono text-xs flex gap-4">
        <span>Use WASD or Arrows to move</span>
        <span>Space to pause/resume</span>
      </div>
    </div>
  );
}
