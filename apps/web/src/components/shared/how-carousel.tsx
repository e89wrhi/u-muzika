'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';

const STEPS = [
  {
    id: 1,
    title: 'Open Content',
    description:
      'Start by searching for any Artist, Album, or Video and open its dedicated page.',
    image: '/device.png',
  },
  {
    id: 2,
    title: 'Press Talk with AI',
    description:
      'On the content page, look for and click the "Talk with AI" button to start a session.',
    image: '/device.png',
  },
  {
    id: 3,
    title: 'Chat with AI',
    description:
      'Engage in a smart conversation to discover deeper insights or find your next favorite track.',
    image: '/device.png',
  },
  {
    id: 4,
    title: 'Enjoy Your Journey',
    description:
      'Experience a seamless blend of traditional music discovery and cutting-edge AI assistance.',
    image: '/device.png',
  },
];

const textVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1, transition: { duration: 0.6, delay: 0.1 } },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    transition: { duration: 0.4 },
  }),
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const imageVariants: any = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    scale: 0.8,
    opacity: 0,
    rotateY: direction > 0 ? 45 : -45,
  }),
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    rotateY: 0,
    transition: { type: 'spring', stiffness: 200, damping: 25, duration: 0.8 },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    scale: 0.8,
    opacity: 0,
    rotateY: direction > 0 ? 45 : -45,
    transition: { type: 'spring', stiffness: 200, damping: 25, duration: 0.8 },
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

export default function HowCarousel() {
  const [[page, direction], setPage] = useState([0, 0]);
  const imageIndex = Math.abs(page % STEPS.length);

  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center overflow-hidden bg-background"
      style={{ perspective: '1500px' }}
    >
      {/* Navigation Layer */}
      <div className="absolute inset-0 flex items-center justify-between px-4 md:px-12 z-50 pointer-events-none">
        <button
          className="pointer-events-auto bg-background/50 hover:bg-background border shadow-lg border-border w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 text-foreground"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" />
        </button>
        <button
          className="pointer-events-auto bg-background/50 hover:bg-background border shadow-lg border-border w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 text-foreground"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" />
        </button>
      </div>

      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={page}
          custom={direction}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-center p-8 md:p-24"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);
            if (swipe < -swipeConfidenceThreshold) paginate(1);
            else if (swipe > swipeConfidenceThreshold) paginate(-1);
          }}
        >
          {/* Text Content */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex flex-col justify-center px-4 md:pr-16 z-20">
            <motion.div
              variants={textVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
            >
              <h4 className="text-primary font-bold tracking-widest uppercase mb-4 text-sm md:text-base">
                Step 0{STEPS[imageIndex]!.id}
              </h4>
              <h1 className="text-5xl md:text-7xl font-black text-foreground mb-6 leading-tight drop-shadow-sm">
                {STEPS[imageIndex]!.title}
              </h1>
              <p className="text-lg md:text-2xl text-muted-foreground leading-relaxed max-w-xl">
                {STEPS[imageIndex]!.description}
              </p>
            </motion.div>
          </div>

          {/* Image Content */}
          <div className="w-full md:w-1/2 h-1/2 md:h-full flex items-center justify-center relative cursor-grab active:cursor-grabbing">
            <motion.div
              variants={imageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              className="relative w-full max-w-3xl h-full max-h-[70vh] drop-shadow-[0_20px_50px_rgba(0,0,0,0.4)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.05)]"
            >
              <Image
                src={STEPS[imageIndex]!.image}
                alt={STEPS[imageIndex]!.title}
                fill
                className="object-contain hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Pagination dots */}
      <div className="absolute bottom-8 z-50 flex space-x-3">
        {STEPS.map((step, idx) => (
          <button
            key={step.id}
            onClick={() => {
              const dir = idx > imageIndex ? 1 : -1;
              const jumps = Math.abs(idx - imageIndex);
              if (jumps > 0) setPage([page + dir * jumps, dir]);
            }}
            className={`h-2 md:h-3 rounded-full transition-all duration-500 ease-out ${
              idx === imageIndex
                ? 'bg-foreground w-12 md:w-16'
                : 'bg-foreground/20 hover:bg-foreground/40 w-2 md:w-3'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
