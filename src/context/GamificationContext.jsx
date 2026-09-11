import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import achievementsData from '../data/achievements.json';

const GamificationContext = createContext();

const STORAGE_KEY = 'alpine_gamification_state';

const STAGES = [
  { minPct: 0, maxPct: 19, name: 'Askole & Base Camp', altitude: '5,150m', desc: 'Acclimatizing on Godwin-Austen moraine.' },
  { minPct: 20, maxPct: 39, name: 'Camp 1 (Lower Slopes)', altitude: '6,050m', desc: 'Ascending fixed lines above the bergschrund.' },
  { minPct: 40, maxPct: 59, name: 'Camp 2 (House\'s Chimney)', altitude: '6,700m', desc: 'Overcoming technical 100ft vertical rock fractures.' },
  { minPct: 60, maxPct: 79, name: 'Camp 3 (The Black Pyramid)', altitude: '7,300m', desc: 'Scaling ice sheets on the upper pyramid.' },
  { minPct: 80, maxPct: 99, name: 'Camp 4 (The Shoulder)', altitude: '7,900m', desc: 'Poised on the lip of the Death Zone under the Bottleneck.' },
  { minPct: 100, maxPct: 100, name: 'K2 SUMMIT APEX', altitude: '8,611m', desc: 'Above the clouds on the roof of the Karakoram!' }
];

export function GamificationProvider({ children }) {
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return {
      visitedSections: ['hero', 'places'],
      viewedMountains: [],
      viewedDestinations: [],
      watchedVideos: [],
      completedGames: {
        gear: false,
        oxygen: false,
        hazard: false,
        route: false
      },
      quizScore: 0,
      unlockedBadges: ['route_scout'],
      celebratedSummit: false,
      climberName: 'Alpinist'
    };
  });

  const [showCelebration, setShowCelebration] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Persist state to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save gamification state', e);
    }
  }, [state]);

  // Unlock achievement helper
  const unlockAchievement = useCallback((badgeId) => {
    setState((prev) => {
      if (prev.unlockedBadges.includes(badgeId)) return prev;

      const badge = achievementsData.find(b => b.id === badgeId);
      if (badge) {
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: {
            message: `🏆 Achievement Unlocked: ${badge.name}!`,
            type: 'trip'
          }
        }));
      }

      return {
        ...prev,
        unlockedBadges: [...prev.unlockedBadges, badgeId]
      };
    });
  }, []);

  // Exploration recording helpers
  const recordSectionVisit = useCallback((sectionId) => {
    if (!sectionId) return;
    setState((prev) => {
      if (prev.visitedSections.includes(sectionId)) return prev;
      return {
        ...prev,
        visitedSections: [...prev.visitedSections, sectionId]
      };
    });
  }, []);

  const recordMountainView = useCallback((mountainId) => {
    if (!mountainId) return;
    setState((prev) => {
      if (prev.viewedMountains.includes(mountainId)) return prev;
      return {
        ...prev,
        viewedMountains: [...prev.viewedMountains, mountainId]
      };
    });
  }, []);

  const recordDestinationView = useCallback((destId) => {
    if (!destId) return;
    setState((prev) => {
      if (prev.viewedDestinations.includes(destId)) return prev;
      return {
        ...prev,
        viewedDestinations: [...prev.viewedDestinations, destId]
      };
    });
  }, []);

  const recordVideoWatch = useCallback((videoId) => {
    if (!videoId) return;
    setState((prev) => {
      if (prev.watchedVideos.includes(videoId)) return prev;
      return {
        ...prev,
        watchedVideos: [...prev.watchedVideos, videoId]
      };
    });
  }, []);

  const completeMiniGame = useCallback((gameId, badgeToUnlock) => {
    setState((prev) => ({
      ...prev,
      completedGames: {
        ...prev.completedGames,
        [gameId]: true
      }
    }));

    if (badgeToUnlock) {
      unlockAchievement(badgeToUnlock);
    }
  }, [unlockAchievement]);

  const setClimberName = useCallback((name) => {
    setState((prev) => ({ ...prev, climberName: name }));
  }, []);

  // Calculate Summit Progress (0 - 100)
  const progressStats = useMemo(() => {
    let score = 0;

    // Sections (up to 30 pts: 3 pts each, cap 30)
    score += Math.min(state.visitedSections.length * 3, 30);

    // Mountains & Destinations (up to 20 pts)
    score += Math.min(state.viewedMountains.length * 4 + state.viewedDestinations.length * 3, 20);

    // Mini-games (10 pts each = up to 40 pts)
    if (state.completedGames.gear) score += 10;
    if (state.completedGames.oxygen) score += 10;
    if (state.completedGames.hazard) score += 10;
    if (state.completedGames.route) score += 10;

    // Videos & Quiz (up to 10 pts)
    score += Math.min(state.watchedVideos.length * 3, 6);
    if (state.quizScore >= 70) score += 4;

    const percentage = Math.min(Math.round(score), 100);

    // Find current stage
    const currentStage = STAGES.find(s => percentage >= s.minPct && percentage <= s.maxPct) || STAGES[0];

    return {
      percentage,
      currentStage,
      isSummit: percentage >= 100
    };
  }, [state]);

  // Trigger celebration once 100% is reached
  useEffect(() => {
    if (progressStats.isSummit && !state.celebratedSummit) {
      setState((prev) => ({ ...prev, celebratedSummit: true }));
      unlockAchievement('summit_champion');
      setShowCelebration(true);
    }
  }, [progressStats.isSummit, state.celebratedSummit, unlockAchievement]);

  return (
    <GamificationContext.Provider value={{
      state,
      progressStats,
      recordSectionVisit,
      recordMountainView,
      recordDestinationView,
      recordVideoWatch,
      completeMiniGame,
      unlockAchievement,
      setClimberName,
      showCelebration,
      setShowCelebration,
      showCertificate,
      setShowCertificate,
      allBadges: achievementsData
    }}>
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
}

export default GamificationContext;
