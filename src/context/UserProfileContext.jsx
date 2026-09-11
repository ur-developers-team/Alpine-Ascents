import React, { createContext, useContext, useState, useEffect } from 'react';
import packagesData from '../data/packages.json';
import destinationsData from '../data/destinations.json';
import achievementsData from '../data/achievements.json';

const UserProfileContext = createContext();

const DEFAULT_PROFILE = {
  name: 'Alex Mercer',
  email: 'climber@alpineascents.org',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  climbingExperience: 'Intermediate Alpinist',
  preferredStyle: 'Comfort',
  preferredDifficulty: 'Moderate',
  favoriteRegion: 'Gilgit-Baltistan',
  preferredDuration: 7,
  groupSize: '2-4 Climbers',
  bio: 'Passionate mountain explorer drawn to high Karakoram peaks and high-altitude photography.'
};

export function UserProfileProvider({ children }) {
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_user_profile');
      return saved ? { ...DEFAULT_PROFILE, ...JSON.parse(saved) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  const [savedTrips, setSavedTrips] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_saved_trips');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [recentlyViewed, setRecentlyViewed] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_recently_viewed');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [checklist, setChecklist] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_checklist');
      return saved ? JSON.parse(saved) : { 'eq-1': true, 'eq-4': true, 'eq-8': true };
    } catch {
      return { 'eq-1': true, 'eq-4': true, 'eq-8': true };
    }
  });

  const [unlockedBadges, setUnlockedBadges] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_unlocked_badges');
      return saved ? JSON.parse(saved) : ['route_scout'];
    } catch {
      return ['route_scout'];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('alpine_unlocked_badges', JSON.stringify(unlockedBadges));
    } catch (e) {
      console.warn('Failed to save badges', e);
    }
  }, [unlockedBadges]);

  useEffect(() => {
    try {
      localStorage.setItem('alpine_user_profile', JSON.stringify(profile));
    } catch (e) {
      console.warn('Failed to save profile', e);
    }
  }, [profile]);

  useEffect(() => {
    try {
      localStorage.setItem('alpine_saved_trips', JSON.stringify(savedTrips));
    } catch (e) {
      console.warn('Failed to save trips', e);
    }
  }, [savedTrips]);

  useEffect(() => {
    try {
      localStorage.setItem('alpine_recently_viewed', JSON.stringify(recentlyViewed));
    } catch (e) {
      console.warn('Failed to save recently viewed', e);
    }
  }, [recentlyViewed]);

  useEffect(() => {
    try {
      localStorage.setItem('alpine_checklist', JSON.stringify(checklist));
    } catch (e) {
      console.warn('Failed to save checklist', e);
    }
  }, [checklist]);

  const updateProfile = (newValues) => {
    setProfile(prev => ({ ...prev, ...newValues }));
    window.dispatchEvent(new CustomEvent('alpine-toast', {
      detail: { message: 'Alpinist preferences successfully updated', type: 'preferences' }
    }));
  };

  const saveTrip = (trip) => {
    const newTrip = {
      ...trip,
      id: trip.id || `custom-trip-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    setSavedTrips(prev => [newTrip, ...prev]);
    window.dispatchEvent(new CustomEvent('alpine-toast', {
      detail: { message: `Trip to "${trip.destinationName || trip.title || 'Expedition'}" saved to planner`, type: 'trip' }
    }));
    return newTrip;
  };

  const deleteTrip = (tripId) => {
    setSavedTrips(prev => prev.filter(t => t.id !== tripId));
  };

  const addRecentlyViewed = (item, type = 'destination') => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(i => i.id !== item.id);
      return [{ ...item, itemType: type, viewedAt: new Date().toISOString() }, ...filtered].slice(0, 10);
    });
  };

  const toggleChecklistItem = (itemId) => {
    setChecklist(prev => {
      const updated = {
        ...prev,
        [itemId]: !prev[itemId]
      };
      const statusText = updated[itemId] ? 'Equipment item packed & checked' : 'Item unchecked from expedition list';
      window.dispatchEvent(new CustomEvent('alpine-toast', {
        detail: { message: statusText, type: 'checklist' }
      }));
      return updated;
    });
  };

  // Deterministic Recommendations matching user preferences
  const getRecommendations = () => {
    const recPackages = packagesData.filter(pkg => {
      const styleMatch = pkg.type.toLowerCase().includes(profile.preferredStyle.toLowerCase());
      const regionMatch = pkg.destinationName.toLowerCase().includes(profile.favoriteRegion.toLowerCase());
      return styleMatch || regionMatch;
    });

    const recDestinations = destinationsData.filter(dest => {
      return dest.region.toLowerCase().includes(profile.favoriteRegion.toLowerCase()) ||
             dest.difficulty.toLowerCase().includes(profile.preferredDifficulty.toLowerCase());
    });

    return {
      packages: recPackages.length > 0 ? recPackages : packagesData.slice(0, 2),
      destinations: recDestinations.length > 0 ? recDestinations : destinationsData.slice(0, 3)
    };
  };

  const unlockBadge = (badgeId) => {
    setUnlockedBadges(prev => {
      if (!prev.includes(badgeId)) {
        return [...prev, badgeId];
      }
      return prev;
    });
  };

  const isBadgeUnlocked = (badgeId) => unlockedBadges.includes(badgeId);

  return (
    <UserProfileContext.Provider value={{
      profile,
      updateProfile,
      savedTrips,
      saveTrip,
      deleteTrip,
      recentlyViewed,
      addRecentlyViewed,
      checklist,
      toggleChecklistItem,
      unlockedBadges,
      unlockBadge,
      isBadgeUnlocked,
      allBadges: achievementsData,
      getRecommendations
    }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
}
