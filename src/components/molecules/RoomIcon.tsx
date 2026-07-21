/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { IRoom, RoomHubService } from '../../core/hub/RoomHubService';

interface RoomIconProps {
  room: IRoom;
  radius: number;
  isHovered: boolean;
  isSelected: boolean;
  isAnySelected: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
  onClick: () => void;
}

export const RoomIcon: React.FC<RoomIconProps> = ({
  room,
  radius,
  isHovered,
  isSelected,
  isAnySelected,
  onHoverStart,
  onHoverEnd,
  onClick,
}) => {
  // Get natural ring layout coordinate offsets
  const { x, y } = RoomHubService.getCoordinates(room.angle, radius);

  // Animation variants
  const variants = {
    initial: {
      x,
      y,
      opacity: 1,
      scale: 1,
    },
    hover: {
      scale: 1.06,
      filter: 'brightness(1.05)',
      boxShadow: 'var(--shadows-medium)',
      borderColor: 'var(--color-text-accent)',
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    selected: {
      x: 0,
      y: 0,
      scale: 1.15,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
    hidden: {
      opacity: 0,
      scale: 0.8,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const getAnimationState = () => {
    if (isSelected) return 'selected';
    if (isAnySelected) return 'hidden';
    return isHovered ? 'hover' : 'initial';
  };

  return (
    <motion.button
      id={`passio-room-icon-${room.id}`}
      variants={variants}
      animate={getAnimationState()}
      whileHover={!isAnySelected ? 'hover' : undefined}
      onHoverStart={!isAnySelected ? onHoverStart : undefined}
      onHoverEnd={!isAnySelected ? onHoverEnd : undefined}
      onClick={!isAnySelected ? onClick : undefined}
      className="absolute w-20 h-20 rounded-full flex flex-col items-center justify-center cursor-pointer border select-none transition-all duration-200"
      style={{
        backgroundColor: 'var(--color-bg-surface)',
        borderColor: 'var(--color-border-subtle)',
        boxShadow: 'var(--shadows-subtle)',
        transformOrigin: 'center center',
      }}
    >
      {/* Emoji room representation with clean alignment */}
      <span className="text-2xl filter drop-shadow-sm pointer-events-none mb-1">
        {room.emoji}
      </span>
      
      {/* Tiny indicator bar or accent */}
      <div 
        className="w-1.5 h-1.5 rounded-full mt-0.5 transition-all duration-300"
        style={{
          backgroundColor: isHovered ? 'var(--color-text-accent)' : 'transparent',
        }}
      />
    </motion.button>
  );
};

export default RoomIcon;
