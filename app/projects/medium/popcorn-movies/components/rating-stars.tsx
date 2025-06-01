'use client';

import React, { JSX, useCallback, useMemo, useState } from 'react';
import { Star } from 'lucide-react';

interface InteractiveRating {
  initialRating: number;
  onRatingChange: (rating: number) => void;
  maxRating?: number;
}

const InteractiveRating = ({ initialRating, onRatingChange, maxRating = 10 }: InteractiveRating): JSX.Element => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(0);

  // Мемоизируем обработчик клика для предотвращения ненужных ререндеров
  const handleRatingClick = useCallback((selectedRating: number) => {
    setRating(selectedRating);
    onRatingChange(selectedRating);
  }, [onRatingChange]);

  // Мемоизируем обработчики наведения
  const handleMouseEnter = useCallback((ratingValue: number) => {
    setHover(ratingValue);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHover(0);
  }, []);

  // Создаем массив звезд только один раз при изменении maxRating
  const starsArray = useMemo(() => [...Array(maxRating)], [maxRating]);

  // Мемоизируем функцию определения класса для звезды
  const getStarClassName = useCallback((ratingValue: number) => {
    return `w-5 h-5 cursor-pointer ${
      ratingValue <= (hover || rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
    }`;
  }, [hover, rating]);

  return (
    <div className="flex items-center">
      {starsArray.map((_, index) => {
        const ratingValue = index + 1;
        return (
          <Star
            key={index}
            className={getStarClassName(ratingValue)}
            onClick={() => handleRatingClick(ratingValue)}
            onMouseEnter={() => handleMouseEnter(ratingValue)}
            onMouseLeave={handleMouseLeave}
          />
        );
      })}
      <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
    </div>
  );
};

export default React.memo(InteractiveRating);