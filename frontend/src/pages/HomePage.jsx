import React from 'react';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import './HomePage.css'; // The main CSS file for both components

function HomePage() {
  return (
    <div className="homepage-container">
      <HeroSection />
      <AboutSection />
    </div>
  );
}

export default HomePage;