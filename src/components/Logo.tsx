
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <svg className="h-10 w-10 text-primary" viewBox="0 0 120 120" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M101.25 15.937C114.375 25.312 118.125 48.75 105 66.562C91.875 84.375 61.875 96.562 36.562 90C11.25 83.437 -9.375 58.125 3.75 38.437C16.875 18.75 63.75 5.625 82.5 7.5C92.812 8.437 96.562 12.187 101.25 15.937Z" />
      </svg>
      <span className="ml-2 text-xl font-bold">beembyte</span>
    </Link>
  );
};

export default Logo;
