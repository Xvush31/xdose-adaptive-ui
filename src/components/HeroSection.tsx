import React from 'react';
import { XDoseLogo } from './XDoseLogo';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeroSectionProps {
  onLogin: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Image de fond avec overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-pink-600/70 to-blue-500/60">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='heroGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f093fb;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23heroGrad)'/%3E%3Ccircle cx='300' cy='200' r='120' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='900' cy='600' r='80' fill='%23ffffff' opacity='0.15'/%3E%3Cpolygon points='600,100 800,300 400,300' fill='%23ffffff' opacity='0.05'/%3E%3C/svg%3E"
          alt="Hero Background"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Contenu Hero */}
      <div className="relative z-10 flex flex-col justify-center items-center h-full text-center px-6">
        <XDoseLogo size="xl" className="mb-8" animated={true} />

        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight animate-fade-in">
          CRÉATEURS DE
          <br />
          <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            CONTENU EXCLUSIF
          </span>
        </h1>

        <p className="text-xl text-white/90 mb-12 max-w-2xl animate-fade-in-up">
          Découvre du contenu premium créé par les meilleurs talents. Rejoins une communauté qui
          valorise la créativité.
        </p>

        <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up delay-200">
          <button
            onClick={onLogin}
            className="group bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:bg-gradient-to-r hover:from-purple-500 hover:to-pink-500 hover:text-white transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <span>Commencer maintenant</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => navigate('/explore')}
            className="group border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all duration-300 backdrop-blur-sm flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Explorer</span>
          </button>
        </div>
      </div>

      {/* Scroll indicator with improved animation */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center relative overflow-hidden">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-scroll-pulse"></div>
        </div>
      </div>
    </div>
  );
};
