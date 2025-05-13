
import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <Link to="/" className={`flex items-center ${className}`}>
      <img 
        src="/lovable-uploads/3e525cc9-1316-472b-96c6-99ba1bfc0120.png" 
        alt="beembyte logo" 
        className="h-10 w-auto"
      />
      <span className="ml-2 text-xl font-bold">beembyte</span>
    </Link>
  );
};

export default Logo;
