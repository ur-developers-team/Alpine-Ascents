import React, { createContext, useContext, useState, useEffect } from 'react';
import mountainsData from '../data/mountains.json';
import destinationsData from '../data/destinations.json';
import packagesData from '../data/packages.json';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('alpine_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('alpine_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.warn('Failed to persist wishlist to localStorage', e);
    }
  }, [wishlist]);

  // Hydrate shared wishlist from URL hash (e.g. #wishlist=k2:mountain,hunza:destination)
  useEffect(() => {
    try {
      const hash = window.location.hash;
      if (hash && hash.includes('wishlist=')) {
        const query = decodeURIComponent(hash.split('wishlist=')[1]);
        const pairs = query.split(',');
        const importedItems = [];

        pairs.forEach(pair => {
          const [id, type] = pair.split(':');
          if (!id) return;

          let found = null;
          if (type === 'mountain') found = mountainsData.find(m => m.id === id);
          else if (type === 'destination') found = destinationsData.find(d => d.id === id);
          else if (type === 'package') found = packagesData.find(p => p.id === id);

          if (found) {
            importedItems.push({ ...found, itemType: type || 'item', savedAt: new Date().toISOString() });
          }
        });

        if (importedItems.length > 0) {
          setWishlist(prev => {
            const existingIds = new Set(prev.map(i => i.id));
            const newToAdd = importedItems.filter(i => !existingIds.has(i.id));
            if (newToAdd.length > 0) {
              window.dispatchEvent(new CustomEvent('alpine-toast', {
                detail: { message: `📥 Imported ${newToAdd.length} shared expedition items!`, type: 'trip' }
              }));
              return [...prev, ...newToAdd];
            }
            return prev;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to parse shared wishlist hash', e);
    }
  }, []);

  const toggleWishlist = (item, type = 'destination') => {
    setWishlist(prev => {
      const exists = prev.some(i => i.id === item.id);
      const itemName = item.name || item.title || 'Expedition';
      if (exists) {
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: { message: `Removed "${itemName}" from wishlist`, type: 'wishlist-remove' }
        }));
        return prev.filter(i => i.id !== item.id);
      } else {
        window.dispatchEvent(new CustomEvent('alpine-toast', {
          detail: { message: `Saved "${itemName}" to wishlist`, type: 'wishlist-add' }
        }));
        return [...prev, { ...item, itemType: type, savedAt: new Date().toISOString() }];
      }
    });
  };

  const isWishlisted = (id) => {
    return wishlist.some(item => item.id === id);
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(item => item.id !== id));
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider value={{
      wishlist,
      wishlistCount: wishlist.length,
      toggleWishlist,
      isWishlisted,
      removeFromWishlist,
      clearWishlist
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
