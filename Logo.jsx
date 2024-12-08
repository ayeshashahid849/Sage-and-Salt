import React from 'react';
import logoImage from '../../assets/logo.jpeg';

const Logo = ({ className = '' }) => (
  <img 
    src={logoImage} 
    alt="Sage and Salt Logo" 
    className={`rounded-full object-cover ${className}`}
  />
);

export default Logo;

