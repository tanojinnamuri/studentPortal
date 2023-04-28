import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const Star = ({ filled }) => {
  if (filled) {
    return <FaStar />;
  } else {
    return <FaRegStar />;
  }
};

const HalfStar = () => {
  return <FaStarHalfAlt />;
};

const StarRating = ({ value, size = 20, displayHalf = false, activeColor = '#ffd700' }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(value)) {
      stars.push(<Star key={i} filled={true} />);
    } else if (i === Math.ceil(value) && displayHalf) {
      stars.push(<HalfStar key={i} />);
    } else {
      stars.push(<Star key={i} filled={false} />);
    }
  }
  return (
    <div style={{ color: activeColor, fontSize: size }}>
      {stars}
    </div>
  );
};

export default StarRating;
