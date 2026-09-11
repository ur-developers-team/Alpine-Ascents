import React, { useState } from 'react';
import { MapPin, Navigation, Compass, Plane, Mountain, ArrowRight, Heart, X, Check, Shield } from 'lucide-react';
import placesData from '../../data/places.json';
import cityPackagesData from '../../data/cityPackages.json';
import { useWishlist } from '../../context/WishlistContext';
import { useLanguage } from '../../context/LanguageContext';
import './PlacesExplorer.css';

export default function PlacesExplorer({ onRequestTrip }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedPlace, setSelectedPlace] = useState(null);
  const { isWishlisted, addToWishlist, removeFromWishlist } = useWishlist();
  const { t, language } = useLanguage();

  const filteredPlaces = placesData.filter(place => {
    if (selectedCategory === 'ALL') return true;
    return place.category === selectedCategory;
  });

  const handleWishlistToggle = (e, place) => {
    e.stopPropagation();
    if (isWishlisted(place.id)) {
      removeFromWishlist(place.id);
    } else {
      addToWishlist({
        id: place.id,
        name: place.name,
        type: 'place',
        region: place.region,
        country: place.country,
        image: place.image,
        altitude: place.altitude
      });
    }
  };

  return (
    <section id="places" className="places-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <Compass size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            {t('places', 'badge')}
          </span>
          <h2 className="section-title">{t('places', 'title')}</h2>
          <p className="section-subtitle">{t('places', 'subtitle')}</p>
        </div>

        {/* Filter Navigation */}
        <div className="places-filter-bar">
          <button
            className={`places-filter-btn ${selectedCategory === 'ALL' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('ALL')}
          >
            <Compass size={15} />
            {t('places', 'tabAll')} ({placesData.length})
          </button>
          <button
            className={`places-filter-btn ${selectedCategory === 'PAKISTAN_CITIES' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('PAKISTAN_CITIES')}
          >
            <MapPin size={15} />
            {t('places', 'tabPakistan')}
          </button>
          <button
            className={`places-filter-btn ${selectedCategory === 'GILGIT_BALTISTAN' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('GILGIT_BALTISTAN')}
          >
            <Mountain size={15} />
            {t('places', 'tabGB')}
          </button>
          <button
            className={`places-filter-btn ${selectedCategory === 'GLOBAL_RANGES' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('GLOBAL_RANGES')}
          >
            <Navigation size={15} />
            {t('places', 'tabGlobal')}
          </button>
          <button
            className={`places-filter-btn ${selectedCategory === 'CITY_PACKAGES' ? 'active' : ''}`}
            onClick={() => setSelectedCategory('CITY_PACKAGES')}
          >
            <Plane size={15} />
            {t('cityPackages', 'title')} ({cityPackagesData.length})
          </button>
        </div>

        {/* Display Places or City Packages */}
        {selectedCategory === 'CITY_PACKAGES' ? (
          <div className="city-packages-grid">
            {cityPackagesData.map((pkg) => (
              <div key={pkg.id} className="city-pkg-card">
                <div className="city-pkg-header">
                  <span className="city-pkg-origin-tag">
                    {pkg.originCity} Departure
                  </span>
                  <div className="city-pkg-price">
                    <span>{t('common', 'basePrice')}</span>
                    <strong>${pkg.startingPrice}</strong>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>{pkg.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', fontWeight: 600 }}>
                  <MapPin size={14} style={{ display: 'inline', marginRight: '0.3rem' }} />
                  {pkg.destination} · {pkg.duration}
                </p>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                  {pkg.description}
                </p>

                <div className="city-pkg-features">
                  <div className="city-pkg-feature-row">
                    <Plane size={15} />
                    <span>{pkg.transport}</span>
                  </div>
                  <div className="city-pkg-feature-row">
                    <Shield size={15} />
                    <span>{pkg.accommodation}</span>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ flex: 1 }}
                    onClick={() => onRequestTrip && onRequestTrip(pkg.title)}
                  >
                    {t('common', 'bookNow')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="places-grid">
            {filteredPlaces.map((place) => {
              const wishlisted = isWishlisted(place.id);
              return (
                <div
                  key={place.id}
                  className="place-card"
                  onClick={() => setSelectedPlace(place)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="place-card-img-wrap">
                    <img src={place.image} alt={place.name} loading="lazy" />
                    <div className="place-badge-overlay">
                      <span className="badge badge-subtle">
                        {place.country}
                      </span>
                    </div>
                    <span className="place-altitude-tag">{place.altitude}</span>
                  </div>

                  <div className="place-card-content">
                    <h3>{place.name}</h3>
                    <div className="place-role">
                      <Compass size={14} />
                      {place.role}
                    </div>

                    <p>{place.overview}</p>

                    <div className="place-highlights-list">
                      {place.highlights?.slice(0, 3).map((item, idx) => (
                        <span key={idx} className="place-highlight-chip">
                          {item}
                        </span>
                      ))}
                    </div>

                    <div className="place-card-actions">
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ flex: 1 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedPlace(place);
                        }}
                      >
                        {t('places', 'viewDetails')} <ArrowRight size={14} />
                      </button>
                      <button
                        className={`btn btn-icon btn-sm ${wishlisted ? 'btn-primary' : 'btn-outline'}`}
                        onClick={(e) => handleWishlistToggle(e, place)}
                        title={wishlisted ? t('common', 'saved') : t('common', 'saveWishlist')}
                        aria-label="Wishlist toggle"
                      >
                        <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Detailed Modal */}
        {selectedPlace && (
          <div className="modal-overlay" onClick={() => setSelectedPlace(null)} role="dialog" aria-modal="true">
            <div className="place-detail-modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close-btn"
                onClick={() => setSelectedPlace(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <img src={selectedPlace.image} alt={selectedPlace.name} className="place-modal-img" />

              <div className="place-modal-body">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <span className="section-eyebrow">{selectedPlace.region} · {selectedPlace.country}</span>
                    <h2 style={{ fontSize: '1.75rem', margin: '0.25rem 0' }}>{selectedPlace.name}</h2>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>{selectedPlace.role}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span className="hud-tag">Elevation: {selectedPlace.altitude}</span>
                    {selectedPlace.coordinates && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                        {selectedPlace.coordinates[0].toFixed(4)}°N, {selectedPlace.coordinates[1].toFixed(4)}°E
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ margin: '1.25rem 0' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Strategic Expedition Role</h4>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, fontSize: '0.92rem' }}>
                    {selectedPlace.overview}
                  </p>
                </div>

                {selectedPlace.transitToNorth && (
                  <div style={{ background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', margin: '1.25rem 0' }}>
                    <h5 style={{ fontSize: '0.9rem', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                      <Navigation size={15} />
                      Transit & Expedition Connectivity
                    </h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
                      {selectedPlace.transitToNorth}
                    </p>
                  </div>
                )}

                <div style={{ margin: '1.25rem 0' }}>
                  <h4 style={{ fontSize: '1rem', marginBottom: '0.75rem' }}>Key Highlights & Landmarks</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {selectedPlace.highlights?.map((h, i) => (
                      <span key={i} className="badge badge-subtle" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Check size={13} color="var(--accent-gold)" />
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
                  <button
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    onClick={() => {
                      setSelectedPlace(null);
                      if (onRequestTrip) onRequestTrip(`Expedition via ${selectedPlace.name}`);
                    }}
                  >
                    Plan Expedition From Here
                  </button>
                  <button
                    className="btn btn-outline"
                    onClick={() => setSelectedPlace(null)}
                  >
                    {t('common', 'close')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
