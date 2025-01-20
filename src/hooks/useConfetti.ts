import { useCallback } from 'react';
import confetti from 'canvas-confetti';

export default function useConfetti() {
  const triggerConfetti = useCallback(() => {
    const duration = 4 * 1000;
    const animationEnd = Date.now() + duration;

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    function makeShot() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return;

      const particleCount = 50 * (timeLeft / duration);

      // Party poppers from corners
      confetti({
        particleCount: particleCount * 0.5,
        angle: 45,
        spread: 60,
        origin: { x: 0, y: 0.8 },
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
      });

      confetti({
        particleCount: particleCount * 0.5,
        angle: 135,
        spread: 60,
        origin: { x: 1, y: 0.8 },
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
      });

      // Rain confetti from top
      confetti({
        particleCount: particleCount * 0.3,
        spread: 100,
        origin: { x: randomInRange(0.1, 0.3), y: 0 },
        gravity: 0.8,
        scalar: 1.5,
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
      });

      confetti({
        particleCount: particleCount * 0.3,
        spread: 100,
        origin: { x: randomInRange(0.7, 0.9), y: 0 },
        gravity: 0.8,
        scalar: 1.5,
        colors: ['#ff0000', '#ffa500', '#ffff00', '#008000', '#0000ff', '#4b0082', '#ee82ee']
      });
    }

    // Initial burst
    makeShot();

    // Continuous shots
    const interval = setInterval(makeShot, 200);

    // Cleanup
    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  }, []);

  return { triggerConfetti };
}