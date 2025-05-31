
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
      {/* Hero Background - Style Nike */}
      <div className="absolute inset-0">
        <div className="relative w-full h-full bg-gradient-to-br from-purple-900/90 via-pink-600/80 to-blue-500/70">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 800'%3E%3Cdefs%3E%3ClinearGradient id='heroGrad' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23667eea;stop-opacity:1' /%3E%3Cstop offset='50%25' style='stop-color:%23764ba2;stop-opacity:1' /%3E%3Cstop offset='100%25' style='stop-color:%23f093fb;stop-opacity:1' /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='1200' height='800' fill='url(%23heroGrad)'/%3E%3Ccircle cx='300' cy='200' r='120' fill='%23ffffff' opacity='0.1'/%3E%3Ccircle cx='900' cy='600' r='80' fill='%23ffffff' opacity='0.15'/%3E%3Cpolygon points='600,100 800,300 400,300' fill='%23ffffff' opacity='0.05'/%3E%3C/svg%3E")`,
            }}
          />
        </div>
      </div>

      {/* Hero Content - Layout Nike style */}
      <div className="relative z-10 flex flex-col justify-center h-full max-w-7xl mx-auto px-6">
        <div className="max-w-2xl">
          <XDoseLogo size="lg" className="mb-8" animated={true} />

          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight">
            CRÉATEURS DE
            <br />
            <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              CONTENU
            </span>
            <br />
            EXCLUSIF
          </h1>

          <p className="text-xl text-white/90 mb-8 max-w-lg">
            Découvre du contenu premium créé par les meilleurs talents. Rejoins une communauté qui
            valorise la créativité.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={onLogin}
              className="group bg-white text-black px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Commencer maintenant</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/tendances')}
              className="border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Explorer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-scroll-pulse"></div>
        </div>
      </div>
    </div>
  );
};
