import React, { useState, useEffect, useRef } from 'react';
import './App.css'; // Import styles specific to App

// Constants
const BIRD_WIDTH = 30;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 60;
const PIPE_HEIGHT = 300;
const PIPE_SPACING = 200;
const GRAVITY = 0.6;
const FLAP_STRENGTH = -15;
const PIPE_SPEED = 2;

const App = () => {
  const [birdY, setBirdY] = useState(250);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState([{ top: 100, bottom: 300 }]);
  const [isGameOver, setIsGameOver] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isGameOver) return;

    const interval = setInterval(() => {
      if (canvasRef.current) {
        const ctx = canvasRef.current.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          drawBird(ctx);
          updateBirdPosition();
          updatePipes();
          checkCollisions();
          drawPipes(ctx);
        }
      }
    }, 1000 / 60); // 60 FPS

    return () => clearInterval(interval);
  }, [birdY, pipes, birdVelocity, isGameOver]);

  // Bird flapping
  const handleFlap = () => {
    if (isGameOver) return;
    setBirdVelocity(FLAP_STRENGTH);
  };

  // Update bird's position and velocity
  const updateBirdPosition = () => {
    setBirdY((prev) => prev + birdVelocity);
    setBirdVelocity((prev) => prev + GRAVITY);
  };

  // Draw the bird on canvas
  const drawBird = (ctx) => {
    ctx.fillStyle = 'yellow';
    ctx.fillRect(50, birdY, BIRD_WIDTH, BIRD_HEIGHT);
  };

  // Generate pipes
  const updatePipes = () => {
    const newPipes = pipes
      .map((pipe) => ({ ...pipe, top: pipe.top - PIPE_SPEED, bottom: pipe.bottom - PIPE_SPEED }))
      .filter((pipe) => pipe.top > -PIPE_HEIGHT); // Remove pipes that are off-screen

    if (newPipes.length === 0 || newPipes[newPipes.length - 1].top < canvasRef.current?.height - PIPE_SPACING) {
      const newPipeTop = Math.floor(Math.random() * (canvasRef.current?.height - PIPE_SPACING));
      const newPipeBottom = newPipeTop + PIPE_SPACING;
      newPipes.push({ top: canvasRef.current?.height - newPipeTop, bottom: newPipeBottom });
    }

    setPipes(newPipes);
  };

  // Check for collisions
  const checkCollisions = () => {
    if (birdY < 0 || birdY + BIRD_HEIGHT > canvasRef.current?.height) {
      setIsGameOver(true);
      return;
    }

    pipes.forEach((pipe) => {
      if (
        50 + BIRD_WIDTH > 0 &&
        50 < PIPE_WIDTH &&
        (birdY < pipe.top || birdY + BIRD_HEIGHT > pipe.bottom)
      ) {
        setIsGameOver(true);
      }
    });
  };

  // Draw pipes on canvas
  const drawPipes = (ctx) => {
    pipes.forEach((pipe) => {
      ctx.fillStyle = 'green';
      ctx.fillRect(300, pipe.top, PIPE_WIDTH, canvasRef.current.height - pipe.top);
      ctx.fillRect(300, 0, PIPE_WIDTH, pipe.bottom);
    });
  };

  return (
    <div>
      <h1>Sigma Bird</h1>
      <canvas
        ref={canvasRef}
        width={400}
        height={600}
        onClick={handleFlap}
        style={{ border: '1px solid black' }}
      />
      {isGameOver && <h2>Game Over</h2>}
    </div>
  );
};

export default App;
