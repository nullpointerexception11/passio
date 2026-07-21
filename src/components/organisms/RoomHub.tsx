/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { PASSIO_ROOMS, IRoom } from '../../core/hub/RoomHubService';
import { RoomIcon } from '../molecules/RoomIcon';
import { useTheme } from '../../core/theme/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const RoomHub: React.FC = () => {
  const navigate = useNavigate();
  const { themeType, toggleTheme } = useTheme();
  const [hoveredRoom, setHoveredRoom] = useState<IRoom | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<IRoom | null>(null);
  const [ringRadius, setRingRadius] = useState<number>(140);

  // Responsive radius calculation
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setRingRadius(110); // Compact radius for mobile screens
      } else if (window.innerWidth < 1024) {
        setRingRadius(130); // Balanced radius for tablets
      } else {
        setRingRadius(150); // Generous spacing for desktop
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleRoomClick = (room: IRoom) => {
    setSelectedRoom(room);
    
    // Play a premium click tick
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = context.createOscillator();
      const gain = context.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, context.currentTime);
      gain.gain.setValueAtTime(0.008, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.00001, context.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(context.destination);
      osc.start();
      osc.stop(context.currentTime + 0.08);
    } catch {
      // Audio context may be blocked initially
    }

    // Trigger smooth transition sequence, then navigate
    setTimeout(() => {
      navigate(room.path);
    }, 700);
  };

  return (
    <div
      id="passio-room-hub-container"
      className="flex flex-col items-center justify-center min-h-screen w-screen relative overflow-hidden select-none"
      style={{
        backgroundColor: 'var(--color-bg-base)',
        color: 'var(--color-text-primary)',
        transition: 'background-color var(--motion-duration-slow) var(--motion-duration-standard)',
      }}
    >
      {/* Subtle branding layer */}
      <div className="absolute top-8 left-8 flex items-center gap-3">
        <div 
          className="w-6 h-6 rounded-full border flex items-center justify-center font-serif text-xs font-semibold"
          style={{
            borderColor: 'var(--color-border-subtle)',
            backgroundColor: 'var(--color-bg-surface)',
            color: 'var(--color-text-accent)'
          }}
        >
          P
        </div>
        <span className="text-[10px] font-serif font-medium tracking-[0.3em] opacity-40 uppercase">
          PASSIO
        </span>
      </div>

      {/* Elegant minimalist Theme Switcher for the Hub */}
      <button
        onClick={toggleTheme}
        className="absolute top-8 right-8 p-2 rounded-full border cursor-pointer transition-colors hover:bg-black/5 dark:hover:bg-white/5"
        style={{
          borderColor: 'var(--color-border-subtle)',
          color: 'var(--color-text-muted)',
        }}
        title="Temayı Değiştir"
      >
        {themeType === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
      </button>

      {/* Main Hub Ring Container */}
      <div className="relative w-[400px] h-[400px] flex items-center justify-center">
        {/* Decorative inner background ring */}
        <div 
          className="absolute rounded-full border transition-all duration-500"
          style={{
            width: `${ringRadius * 2}px`,
            height: `${ringRadius * 2}px`,
            borderColor: 'var(--color-border-subtle)',
            opacity: selectedRoom ? 0 : 0.25,
            borderStyle: 'dashed',
          }}
        />

        {/* Dynamic Center Typography displaying Room name */}
        <div className="absolute w-44 text-center flex flex-col items-center justify-center pointer-events-none">
          <AnimatePresence mode="wait">
            {!selectedRoom && hoveredRoom && (
              <motion.div
                key={hoveredRoom.id}
                initial={{ opacity: 0, y: 4, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center"
              >
                <h2 className="text-xs tracking-[0.25em] font-serif font-medium uppercase text-accent">
                  {hoveredRoom.title}
                </h2>
                <p 
                  className="text-[10px] font-mono leading-relaxed mt-2 opacity-50 max-w-[140px] tracking-wide"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  {hoveredRoom.description}
                </p>
              </motion.div>
            )}

            {!selectedRoom && !hoveredRoom && (
              <motion.div
                key="default-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-[10px] uppercase font-serif tracking-[0.4em] font-light"
              >
                ANA SALON
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Rendering the 4 room icons */}
        {PASSIO_ROOMS.map((room) => (
          <RoomIcon
            key={room.id}
            room={room}
            radius={ringRadius}
            isHovered={hoveredRoom?.id === room.id}
            isSelected={selectedRoom?.id === room.id}
            isAnySelected={selectedRoom !== null}
            onHoverStart={() => setHoveredRoom(room)}
            onHoverEnd={() => setHoveredRoom(null)}
            onClick={() => handleRoomClick(room)}
          />
        ))}
      </div>

      {/* Subtle status label */}
      <div 
        className="absolute bottom-8 text-[9px] font-mono tracking-[0.25em] uppercase opacity-30 transition-opacity duration-500"
        style={{ opacity: selectedRoom ? 0 : 0.3 }}
      >
        SELECT A ROOM TO BEGIN
      </div>
    </div>
  );
};

export default RoomHub;
