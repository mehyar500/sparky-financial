import React from 'react';

const POSES = {
  waving: 'https://media.base44.com/images/public/6a3e8d5fbe86b90f64d9452b/d44a16ad4_generated_image.png',
  thinking: 'https://media.base44.com/images/public/6a3e8d5fbe86b90f64d9452b/8c4e2f72a_generated_image.png',
  excited: 'https://media.base44.com/images/public/6a3e8d5fbe86b90f64d9452b/6c78d516d_generated_image.png',
  teaching: 'https://media.base44.com/images/public/6a3e8d5fbe86b90f64d9452b/bbe9ce1ee_generated_image.png',
};

export default function SparkyImage({ pose = 'waving', size = 140, className = '' }) {
  return (
    <img
      src={POSES[pose] || POSES.waving}
      alt="Sparky the robot"
      style={{ width: size, height: size }}
      className={`object-contain rounded-2xl ${className}`}
    />
  );
}