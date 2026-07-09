import React from 'react';
import {
  Activity,
  Utensils,
  Droplets,
  Moon,
  Wind,
  ClipboardList,
  Stethoscope,
  Leaf,
  Dumbbell
} from 'lucide-react-native';

export const getMissionIcon = (missionType: string, color: string = '#1C2E21', size: number = 24) => {
  const typeStr = (missionType || '').toLowerCase();
  
  if (typeStr.includes('exercise') || typeStr.includes('activity')) {
    return <Dumbbell color={color} size={size} />;
  }
  if (typeStr.includes('diet') || typeStr.includes('food')) {
    return <Utensils color={color} size={size} />;
  }
  if (typeStr.includes('hydration')) {
    return <Droplets color={color} size={size} />;
  }
  if (typeStr.includes('sleep')) {
    return <Moon color={color} size={size} />;
  }
  if (typeStr.includes('stress')) {
    return <Wind color={color} size={size} />;
  }
  if (typeStr.includes('habit')) {
    return <ClipboardList color={color} size={size} />;
  }
  if (typeStr.includes('checkup_followup') || typeStr.includes('checkup')) {
    return <Stethoscope color={color} size={size} />;
  }

  // Default fallback
  return <Leaf color={color} size={size} />;
};
