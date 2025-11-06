'use client';

import React, { useState, useEffect } from 'react';

interface CarouselProps {
  items: {
    id: string;
    title: string;
    preview: string;
    date: string;
    onClick: () => void;
  }[];
  autoPlay?: boolean;
  interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ items, autoPlay = true, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!autoPlay || items.length === 0) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearInterval(timer);
  }, [autoPlay, interval, items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (items.length === 0) {
    return (
      <div className="bg-gradient-to-r from-pastel-pink to-pastel-purple rounded-3xl p-12 text-center border-2 border-dashed border-pink-300 shadow-pastel">
        <div className="text-6xl mb-4 animate-float">&#128221;</div>
        <p className="text-gray-600 text-lg font-semibold">No recent notes</p>
        <p className="text-gray-500 text-sm mt-2">Start writing a new note</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div className="relative h-64 overflow-hidden rounded-3xl shadow-pastel-hover bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 p-1">
        <div className="h-full glass-effect rounded-2xl overflow-hidden">
          <div
            className="h-full flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="min-w-full h-full p-8 cursor-pointer hover:bg-pastel-pink hover:bg-opacity-30 transition-all flex flex-col justify-between"
                onClick={item.onClick}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 truncate flex-1">
                      {item.title}
                    </h3>
                    <span className="ml-4 px-3 py-1 bg-gradient-to-r from-pink-100 to-purple-100 text-pink-700 rounded-full text-sm font-semibold whitespace-nowrap shadow-sm">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-4 text-lg leading-relaxed">
                    {item.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-pink-600 font-bold mt-4">
                  <span>View Note</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 glass-effect hover:shadow-pastel text-pink-600 rounded-full p-3 shadow-pastel opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {items.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 glass-effect hover:shadow-pastel text-pink-600 rounded-full p-3 shadow-pastel opacity-0 group-hover:opacity-100 transition-all duration-300 transform hover:scale-110"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 w-8 h-2.5 shadow-lg'
                  : 'bg-white/70 hover:bg-white w-2.5 h-2.5'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
