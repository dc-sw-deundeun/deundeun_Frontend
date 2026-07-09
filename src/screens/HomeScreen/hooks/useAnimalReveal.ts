import { useState, useRef, useEffect } from 'react';
import { Animated } from 'react-native';

// 신규 동물 해금 연출(선물상자 흔들기 -> 공개) 애니메이션 및 큐를 담당하는 훅
export const useAnimalReveal = () => {
  // Unlock Modal Queue State
  const [unlockQueue, setUnlockQueue] = useState<string[]>([]);
  const [currentRevealAnimal, setCurrentRevealAnimal] = useState<string | null>('frog');
  const [revealStep, setRevealStep] = useState<'idle' | 'shaking' | 'revealed'>('idle');

  // Animation values for Reveal
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  // Loop wiggle animation values
  const idleWiggleAnim = useRef(new Animated.Value(0)).current;
  const wiggleLoopRef = useRef<Animated.CompositeAnimation | null>(null);

  // 선물 상자 대기 상태(idle)일 때 자동으로 부들부들 떠는 애니메이션 실행
  useEffect(() => {
    if (currentRevealAnimal !== null && revealStep === 'idle') {
      idleWiggleAnim.setValue(0);
      wiggleLoopRef.current = Animated.loop(
        Animated.sequence([
          Animated.timing(idleWiggleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: -1, duration: 100, useNativeDriver: true }),
          Animated.timing(idleWiggleAnim, { toValue: 0, duration: 800, useNativeDriver: true }), // 쉬는 구간
        ])
      );
      wiggleLoopRef.current.start();
    } else {
      if (wiggleLoopRef.current) {
        wiggleLoopRef.current.stop();
      }
      idleWiggleAnim.setValue(0);
    }
    return () => {
      if (wiggleLoopRef.current) {
        wiggleLoopRef.current.stop();
      }
    };
  }, [currentRevealAnimal, revealStep]);

  // Shake animation sequence: left, right, left, right, center
  const startShake = () => {
    if (wiggleLoopRef.current) {
      wiggleLoopRef.current.stop();
    }
    idleWiggleAnim.setValue(0);

    setRevealStep('shaking');
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -15, duration: 60, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 60, useNativeDriver: true }),
    ]).start(() => {
      triggerReveal();
    });
  };

  // Fade in and scale up the animal sprite
  const triggerReveal = () => {
    setRevealStep('revealed');
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1.2,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const triggerUnlockReveal = (newlyUnlocked: string[]) => {
    const first = newlyUnlocked[0];
    const rest = newlyUnlocked.slice(1);
    setUnlockQueue(rest);
    setCurrentRevealAnimal(first);
    setRevealStep('idle');
  };

  const handleConfirmReveal = () => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.5);
    shakeAnim.setValue(0);

    if (unlockQueue.length > 0) {
      const nextAnimal = unlockQueue[0];
      setUnlockQueue(unlockQueue.slice(1));
      setCurrentRevealAnimal(nextAnimal);
      setRevealStep('idle');
    } else {
      setCurrentRevealAnimal(null);
      setRevealStep('idle');
    }
  };

  const interpolatedWiggle = idleWiggleAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-4deg', '4deg'],
  });

  const interpolatedShake = shakeAnim.interpolate({
    inputRange: [-15, 15],
    outputRange: ['-15deg', '15deg'],
  });

  const shakeStyle = {
    transform: [
      { rotate: interpolatedWiggle },
      { rotate: interpolatedShake }
    ],
  };

  const closeReveal = () => {
    setCurrentRevealAnimal(null);
  };

  return {
    currentRevealAnimal,
    revealStep,
    fadeAnim,
    scaleAnim,
    shakeStyle,
    startShake,
    triggerUnlockReveal,
    handleConfirmReveal,
    closeReveal,
  };
};

export default useAnimalReveal;
