import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './HeroCanvas.css';

const FRAME_COUNT = 82;
const FRAME_PREFIX = '/frames/Resin_coaster_floating_in_air_202605081617_';

export default function HeroCanvas() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [playPhase, setPlayPhase] = useState(0); // 0: loading, 1: text1, 2: text2, 3: main

  useEffect(() => {
    const images = [];
    let loadedCount = 0;

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      const numStr = i.toString().padStart(3, '0');
      img.src = `${FRAME_PREFIX}${numStr}.png`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === FRAME_COUNT) {
          setLoaded(true);
        }
      };
      images.push(img);
    }

    if (!loaded) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Resize to fit screen but keep aspect ratio
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    let frame = 0;
    let animationId;
    let lastTime = performance.now();
    const fps = 30;
    const interval = 1000 / fps;

    const drawFrame = (time) => {
      animationId = requestAnimationFrame(drawFrame);
      
      const deltaTime = time - lastTime;
      if (deltaTime > interval) {
        lastTime = time - (deltaTime % interval);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        const img = images[Math.min(frame, FRAME_COUNT - 1)];
        if (img) {
          // Calculate scale to cover canvas (like object-fit: cover)
          const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
          const x = (canvas.width / 2) - (img.width / 2) * scale;
          const y = (canvas.height / 2) - (img.height / 2) * scale;
          ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
        }

        // Particle effects overlay could be added here, but we can do it via CSS/Framer
        
        if (frame < FRAME_COUNT - 1) {
          frame++;
        }
      }
    };
    
    animationId = requestAnimationFrame(drawFrame);

    // Sequence text phases
    setTimeout(() => setPlayPhase(1), 500); // WELCOME TO THE WORLD OF RESIN
    setTimeout(() => setPlayPhase(2), 3500); // Handcrafted with Love
    setTimeout(() => setPlayPhase(3), 6500); // Scroll indicator

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [loaded]);

  return (
    <div className="hero-container">
      {!loaded && (
        <div className="loader">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }} 
            transition={{ repeat: Infinity, duration: 2 }}
          >
            Entering Brindha's Resin Studio...
          </motion.div>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hero-canvas" />
      
      {/* Magical Particles Overlay */}
      <div className="particles-overlay"></div>

      <div className="hero-content">
        <AnimatePresence mode="wait">
          {playPhase === 1 && (
            <motion.h1 
              key="text1"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="hero-title heading-luxury glowing-text"
            >
              WELCOME TO THE WORLD OF RESIN
            </motion.h1>
          )}
          {playPhase === 2 && (
            <motion.h2
              key="text2"
              initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -50, filter: 'blur(10px)' }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              className="hero-subtitle"
            >
              Handcrafted with Love, Preserved Forever
            </motion.h2>
          )}
          {playPhase === 3 && (
            <motion.div
              key="scroll"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="scroll-indicator"
            >
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="scroll-dot"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hero-gradient-bottom"></div>
    </div>
  );
}
