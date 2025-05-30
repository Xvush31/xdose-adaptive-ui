import React from 'react';

interface XDoseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animated?: boolean;
  hideInHeader?: boolean;
  neuroStyles?: {
    primaryGradient?: string;
    textColor?: string;
    animationSpeed?: number;
  } | null;
  triggerMicroReward?: (type: string) => void;
}

export const XDoseLogo: React.FC<XDoseLogoProps> = ({
  size = 'md',
  className = '',
  animated = false,
  hideInHeader = false,
  neuroStyles = null,
  triggerMicroReward = () => {},
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const [colorIndex, setColorIndex] = React.useState(0);

  const colors = neuroStyles?.primaryGradient
    ? [neuroStyles.primaryGradient]
    : [
        'from-purple-500 to-pink-500',
        'from-blue-500 to-teal-400',
        'from-amber-500 to-pink-500',
        'from-green-400 to-blue-500',
        'from-pink-500 to-orange-400',
      ];

  const sizes = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl',
    xl: 'text-7xl',
  };

  React.useEffect(() => {
    if (isHovered && !neuroStyles?.animationSpeed) {
      const interval = setInterval(() => {
        setColorIndex((prev) => (prev + 1) % colors.length);
      }, 700);
      return () => clearInterval(interval);
    }
    if (!isHovered && !neuroStyles?.animationSpeed) {
      setColorIndex(0);
    }
  }, [isHovered, colors.length, neuroStyles?.animationSpeed]);

  const handleHover = () => {
    setIsHovered(true);
    triggerMicroReward('creative');
  };

  if (hideInHeader && className.includes('header')) {
    return null;
  }

  return (
    <div
      className={`inline-block cursor-pointer ${className}`}
      onMouseEnter={handleHover}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className={`font-bold ${sizes[size]} transition-all duration-300 ${isHovered ? 'scale-105' : 'scale-100'}`}
      >
        <span
          className={`bg-gradient-to-r ${neuroStyles?.primaryGradient || colors[colorIndex]} bg-clip-text text-transparent ${
            animated ? 'animate-pulse' : ''
          } transition-all duration-700`}
          style={{ WebkitTextStroke: '1px rgba(0,0,0,0.1)' }}
        >
          X
        </span>
        <span className={neuroStyles?.textColor || 'text-gray-800'}>Dose</span>
      </div>

      <div
        className={`h-1 bg-gradient-to-r ${neuroStyles?.primaryGradient || colors[colorIndex]} rounded-full mt-1 transition-all duration-500 ${
          isHovered ? 'w-full' : animated ? 'w-2/5' : 'w-0'
        }`}
      />
    </div>
  );
};
