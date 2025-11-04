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
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-12 text-center border-2 border-dashed border-blue-200">
        <div className="text-6xl mb-4">📝</div>
        <p className="text-gray-500 text-lg">최근 메모가 없습니다</p>
        <p className="text-gray-400 text-sm mt-2">새로운 메모를 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="relative group">
      {/* 캐러셀 컨테이너 */}
      <div className="relative h-64 overflow-hidden rounded-2xl shadow-xl bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-1">
        <div className="h-full bg-white rounded-xl overflow-hidden">
          {/* 슬라이드 */}
          <div
            className="h-full flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="min-w-full h-full p-8 cursor-pointer hover:bg-gray-50 transition-colors flex flex-col justify-between"
                onClick={item.onClick}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-800 truncate flex-1">
                      {item.title}
                    </h3>
                    <span className="ml-4 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium whitespace-nowrap">
                      {item.date}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-4 text-lg leading-relaxed">
                    {item.preview}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-blue-600 font-medium mt-4">
                  <span>메모 보기</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 이전 버튼 */}
      {items.length > 1 && (
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* 다음 버튼 */}
      {items.length > 1 && (
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-sm"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {/* 인디케이터 */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-8 shadow-lg'
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;

