import React, { useState } from 'react';
import { useUserProfile } from '../../context/UserProfileContext';
import { useWishlist } from '../../context/WishlistContext';
import { User, Settings, Compass, Heart, CheckSquare, Clock, Sparkles, X, Trash2, MapPin, Calendar, Award, ShieldCheck, TrendingUp, AlertTriangle, Mountain, Lock, Download, Printer, Stamp, FileCheck } from 'lucide-react';
import equipmentData from '../../data/equipment.json';
import profileOptionsData from '../../data/profileOptions.json';
import './ProfileDashboard.css';

export default function ProfileDashboard({ isOpen, onClose, onSelectPackage, onSelectDestination }) {
  const { profile, updateProfile, savedTrips, deleteTrip, recentlyViewed, checklist, toggleChecklistItem, getRecommendations, unlockedBadges = [], isBadgeUnlocked = () => false, allBadges = [] } = useUserProfile();
  const { wishlist, removeFromWishlist } = useWishlist();
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [collectedStamps, setCollectedStamps] = useState(['stamp-hunza', 'stamp-skardu', 'stamp-gilgit', 'stamp-k2', 'stamp-everest']);

  if (!isOpen) return null;

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(formData);
    setEditMode(false);
  };

  const completedChecklistCount = Object.values(checklist).filter(Boolean).length;
  const checklistPercentage = Math.round((completedChecklistCount / equipmentData.length) * 100);

  const recommendations = getRecommendations();

  // Calculate Explorer Level
  const explorerScore = Math.min(100, Math.round(
    (unlockedBadges.length * 12) +
    (completedChecklistCount * 3) +
    (collectedStamps.length * 5) +
    (savedTrips.length * 8) +
    (wishlist.length * 3)
  ));

  const currentLevel = [...profileOptionsData.explorerLevels]
    .reverse()
    .find(lvl => explorerScore >= lvl.minScore) || profileOptionsData.explorerLevels[0];

  const nextLevel = profileOptionsData.explorerLevels.find(lvl => lvl.level === currentLevel.level + 1);

  const toggleStamp = (stampId) => {
    if (collectedStamps.includes(stampId)) {
      setCollectedStamps(collectedStamps.filter(id => id !== stampId));
    } else {
      setCollectedStamps([...collectedStamps, stampId]);
    }
  };

  const handleExportJSON = () => {
    const exportData = {
      platform: "Alpine Ascents International Expeditions",
      generatedAt: new Date().toISOString(),
      user: {
        ...profile,
        explorerLevel: currentLevel.title,
        explorerScore: `${explorerScore}/100`,
        perk: currentLevel.perk
      },
      savedTrips,
      wishlist,
      collectedPassportStamps: profileOptionsData.passportStamps.filter(s => collectedStamps.includes(s.id)),
      gearChecklistProgress: `${checklistPercentage}% Completed (${completedChecklistCount}/${equipmentData.length} items verified)`
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `alpine-ascents-plan-${profile.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dashboard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="dashboard-header">
          <div className="dashboard-user-hero">
            <img src={profile.avatar} alt={profile.name} className="dashboard-avatar" />
            <div className="dashboard-user-details">
              <span className="hud-tag" style={{ marginBottom: '0.25rem' }}>
                Tier {currentLevel.level}: {currentLevel.title}
              </span>
              <h3>{profile.name}</h3>
              <p>{profile.email} · Preferred Style: {profile.preferredStyle}</p>
            </div>
          </div>

          <div className="dashboard-header-actions">
            <button
              type="button"
              className="export-btn-outline"
              onClick={handleExportJSON}
              title="Download your expedition plan as JSON"
            >
              <Download size={14} />
              <span>Export JSON</span>
            </button>
            <button
              type="button"
              className="export-btn-outline"
              onClick={handlePrintPDF}
              title="Print formatted planning summary"
            >
              <Printer size={14} />
              <span>Print Plan</span>
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close profile">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-nav-tabs" role="tablist">
          <button
            className={`dashboard-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
            role="tab"
          >
            <User size={15} />
            <span>My Profile</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'passport' ? 'active' : ''}`}
            onClick={() => setActiveTab('passport')}
            role="tab"
          >
            <Stamp size={15} />
            <span>Climber Passport ({collectedStamps.length}/11)</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'trips' ? 'active' : ''}`}
            onClick={() => setActiveTab('trips')}
            role="tab"
          >
            <Compass size={15} />
            <span>My Trips ({savedTrips.length})</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'wishlist' ? 'active' : ''}`}
            onClick={() => setActiveTab('wishlist')}
            role="tab"
          >
            <Heart size={15} />
            <span>Wishlist ({wishlist.length})</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
            onClick={() => setActiveTab('checklist')}
            role="tab"
          >
            <CheckSquare size={15} />
            <span>Gear Checklist ({checklistPercentage}%)</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'recommendations' ? 'active' : ''}`}
            onClick={() => setActiveTab('recommendations')}
            role="tab"
          >
            <Sparkles size={15} />
            <span>Recommendations</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'badges' ? 'active' : ''}`}
            onClick={() => setActiveTab('badges')}
            role="tab"
          >
            <Award size={15} />
            <span>Badges ({unlockedBadges.length}/{allBadges.length || 6})</span>
          </button>
          <button
            className={`dashboard-tab-btn ${activeTab === 'recent' ? 'active' : ''}`}
            onClick={() => setActiveTab('recent')}
            role="tab"
          >
            <Clock size={15} />
            <span>Recently Viewed ({recentlyViewed.length})</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="dashboard-body">
          {/* TAB 1: MY PROFILE & PREFERENCES */}
          {activeTab === 'profile' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.15rem' }}>Traveler Credentials & Preferences</h4>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  <Settings size={14} />
                  <span>{editMode ? 'Cancel Edit' : 'Edit Preferences'}</span>
                </button>
              </div>

              {editMode ? (
                <form onSubmit={handleSaveProfile}>
                  <div className="dashboard-grid-2">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Climbing Level</label>
                      <select
                        className="form-control"
                        value={formData.climbingExperience}
                        onChange={(e) => setFormData({ ...formData, climbingExperience: e.target.value })}
                      >
                        <option value="Trekker & Scrambler">Trekker & Scrambler</option>
                        <option value="Intermediate Alpinist">Intermediate Alpinist</option>
                        <option value="Advanced / High-Altitude Alpinist">Advanced / High-Altitude Alpinist</option>
                        <option value="Technical Big-Wall Climber">Technical Big-Wall Climber</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Preferred Travel Style</label>
                      <select
                        className="form-control"
                        value={formData.preferredStyle}
                        onChange={(e) => setFormData({ ...formData, preferredStyle: e.target.value })}
                      >
                        <option value="Explorer">Explorer (Active Adventure)</option>
                        <option value="Comfort">Comfort (Cozy Lodges & Paced Day Hikes)</option>
                        <option value="Premium">Premium (Luxury Heritage & Concierge)</option>
                        <option value="Expedition Pro">Expedition Pro (High Glacial Siege)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Favorite Mountain Region</label>
                      <select
                        className="form-control"
                        value={formData.favoriteRegion}
                        onChange={(e) => setFormData({ ...formData, favoriteRegion: e.target.value })}
                      >
                        <option value="Gilgit-Baltistan">Gilgit-Baltistan (Karakoram & Western Himalaya)</option>
                        <option value="Khumbu Himal">Himalayas (Nepal / Tibet)</option>
                        <option value="Alps">European Alps (Mont Blanc / Matterhorn)</option>
                        <option value="Patagonia">Patagonia (Andes)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Ideal Duration (Days)</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.preferredDuration}
                        onChange={(e) => setFormData({ ...formData, preferredDuration: parseInt(e.target.value, 10) || 7 })}
                        min="3"
                        max="60"
                      />
                    </div>
                  </div>
                  <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem' }}>
                    <button type="submit" className="btn btn-primary">Save Preferences</button>
                    <button type="button" className="btn btn-outline" onClick={() => setEditMode(false)}>Cancel</button>
                  </div>
                </form>
              ) : (
                <div className="dashboard-grid-2">
                  <div className="pref-card">
                    <div className="section-eyebrow">CLIMBING PROFILE</div>
                    <p><strong>Experience Level:</strong> {profile.climbingExperience}</p>
                    <p style={{ marginTop: '0.5rem' }}><strong>Preferred Style:</strong> {profile.preferredStyle}</p>
                    <p style={{ marginTop: '0.5rem' }}><strong>Group Size:</strong> {profile.groupSize}</p>
                  </div>
                  <div className="pref-card">
                    <div className="section-eyebrow">REGIONAL FOCUS</div>
                    <p><strong>Favorite Region:</strong> {profile.favoriteRegion}</p>
                    <p style={{ marginTop: '0.5rem' }}><strong>Preferred Duration:</strong> ~{profile.preferredDuration} Days</p>
                    <p style={{ marginTop: '0.5rem' }}><strong>Persistence Mode:</strong> Local Browser Storage (Zero Tracking)</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CLIMBER PASSPORT & VIRTUAL STAMPS */}
          {activeTab === 'passport' && (
            <div>
              {/* Explorer Level Progress Banner */}
              <div className="passport-level-banner">
                <div className="passport-level-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <Award size={18} color="var(--accent)" />
                    <span className="hud-tag" style={{ color: 'var(--accent)' }}>
                      EXPLORER LEVEL {currentLevel.level} OF 5
                    </span>
                  </div>
                  <h4>{currentLevel.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {currentLevel.perk}
                  </p>
                </div>

                <div className="passport-level-progress-wrap">
                  <div className="passport-progress-labels">
                    <span>EXPLORATION SCORE: {explorerScore}/100</span>
                    <span>{nextLevel ? `NEXT: ${nextLevel.title} (${nextLevel.minScore} pts)` : 'MAX RANK ACHIEVED'}</span>
                  </div>
                  <div className="passport-progress-track">
                    <div className="passport-progress-fill" style={{ width: `${explorerScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Virtual Exploration Stamps Grid */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem', marginBottom: '0.2rem' }}>Official Alpine Exploration Stamps</h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: 0 }}>
                    Earn stamps by exploring hub regions, testing high-altitude gear, and checking summits. Click any stamp to toggle your field verification.
                  </p>
                </div>
                <span className="hud-tag" style={{ color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  Verified: {collectedStamps.length} / {profileOptionsData.passportStamps.length}
                </span>
              </div>

              <div className="passport-stamps-grid">
                {profileOptionsData.passportStamps.map(stamp => {
                  const isStamped = collectedStamps.includes(stamp.id);

                  return (
                    <div
                      key={stamp.id}
                      className={`passport-stamp-card ${isStamped ? 'stamped' : ''}`}
                      onClick={() => toggleStamp(stamp.id)}
                      title={isStamped ? "Stamp Verified! Click to toggle." : "Click to mark as visited & verified"}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="stamp-seal-circle">
                        <Stamp size={24} />
                      </div>
                      <div className="stamp-location-name">{stamp.location}</div>
                      <div className="stamp-region-text">{stamp.region}</div>
                      <div className="stamp-elevation-tag">Elev: {stamp.elevation}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '8px', fontStyle: 'italic' }}>
                        "{stamp.tag}"
                      </div>
                      <span className={`stamp-status-tag ${isStamped ? 'verified' : 'pending'}`}>
                        {isStamped ? '✓ VERIFIED STAMP' : 'UNSTAMPED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: MY TRIPS & SAVED EXPEDITIONS */}
          {activeTab === 'trips' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Saved & Requested Expeditions</h4>
              {savedTrips.length === 0 ? (
                <div className="search-empty-state">
                  <Compass size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h4>No expeditions saved yet</h4>
                  <p>Use the <strong>"Build Your Expedition"</strong> tool on the homepage to configure custom dates, styles, and generate demo estimates.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {savedTrips.map(trip => (
                    <div key={trip.id} className="trip-card-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span className="hud-tag" style={{ marginBottom: '0.4rem' }}>{trip.travelStyle || 'Custom'} · {trip.durationDays || trip.duration || '7'} Days</span>
                          <h4 style={{ fontSize: '1.1rem' }}>{trip.destinationName || trip.destination || 'Karakoram Expedition'}</h4>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Group: {trip.groupSize || 'Solo'} · Accommodation: {trip.accommodation || 'Standard'} · Guide: {trip.guide || 'Included'}
                          </p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent)' }}>
                            ${trip.estimatedTotal || trip.price || 890}
                          </div>
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Estimated Demo Total</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Saved on {new Date(trip.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => deleteTrip(trip.id)}
                          style={{ color: '#f43f5e', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                        >
                          <Trash2 size={13} />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: WISHLIST */}
          {activeTab === 'wishlist' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Saved Destinations, Mountains & Packages</h4>
              {wishlist.length === 0 ? (
                <div className="search-empty-state">
                  <Heart size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h4>Your wishlist is empty</h4>
                  <p>Click the ♡ icon on any destination, mountain, guide, or package to bookmark it here.</p>
                </div>
              ) : (
                <div className="dashboard-grid-2">
                  {wishlist.map(item => (
                    <div key={item.id} className="trip-card-item">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <span className="hud-tag" style={{ textTransform: 'uppercase', marginBottom: '0.35rem' }}>{item.itemType || 'Saved'}</span>
                          <h5>{item.name || item.title}</h5>
                          <p style={{ fontSize: '0.82rem' }}>{item.region || item.country || item.range || 'Alpine Experience'}</p>
                        </div>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="btn-save active"
                          title="Remove from wishlist"
                          aria-label="Remove"
                        >
                          <Heart size={16} fill="#f43f5e" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: GEAR PREPARATION CHECKLIST */}
          {activeTab === 'checklist' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem' }}>Equipment & Preparation Progress</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Check off gear as you inspect, pack, or rent for your expedition.
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent)' }}>
                    {checklistPercentage}%
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{completedChecklistCount} of {equipmentData.length} Packed</span>
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ width: '100%', height: '8px', background: 'var(--bg-tertiary)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem', border: '1px solid var(--border)' }}>
                <div style={{ width: `${checklistPercentage}%`, height: '100%', background: 'var(--accent)', transition: 'width 0.3s ease' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '350px', overflowY: 'auto' }}>
                {equipmentData.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 1rem',
                      borderRadius: '6px',
                      background: checklist[item.id] ? 'var(--accent-subtle)' : 'var(--bg-tertiary)',
                      border: '1px solid var(--border)',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={!!checklist[item.id]}
                      onChange={() => toggleChecklistItem(item.id)}
                      style={{ accentColor: 'var(--accent)', width: '16px', height: '16px' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 600, textDecoration: checklist[item.id] ? 'line-through' : 'none', color: checklist[item.id] ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.category} · {item.importance}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: RECOMMENDATIONS */}
          {activeTab === 'recommendations' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Personalized Expedition Matches</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Computed deterministically from your preferred style (<strong>{profile.preferredStyle}</strong>) and region (<strong>{profile.favoriteRegion}</strong>).
              </p>

              <div className="dashboard-grid-2">
                {recommendations.packages.map(pkg => (
                  <div key={pkg.id} className="trip-card-item">
                    <span className="hud-tag" style={{ marginBottom: '0.35rem' }}>{pkg.type} · {pkg.duration}</span>
                    <h5>{pkg.name}</h5>
                    <p style={{ fontSize: '0.82rem' }}>{pkg.destinationName}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.75rem' }}>
                      <span style={{ fontWeight: 800, color: 'var(--accent)' }}>${pkg.price}</span>
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          onClose();
                          onSelectPackage && onSelectPackage(pkg);
                        }}
                      >
                        View Package
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: RECENTLY VIEWED */}
          {activeTab === 'recent' && (
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem' }}>Recently Explored</h4>
              {recentlyViewed.length === 0 ? (
                <div className="search-empty-state">
                  <Clock size={40} color="var(--text-muted)" style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                  <h4>No exploration history yet</h4>
                  <p>As you browse destinations, mountains, and guides, your recently viewed trails will appear here.</p>
                </div>
              ) : (
                <div className="dashboard-grid-2">
                  {recentlyViewed.map((item, idx) => (
                    <div key={`${item.id}-${idx}`} className="trip-card-item">
                      <span className="hud-tag">{item.itemType}</span>
                      <h5>{item.name || item.title}</h5>
                      <p style={{ fontSize: '0.8rem' }}>{item.region || item.country || item.range || ''}</p>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        Viewed {new Date(item.viewedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: BADGES & ACHIEVEMENTS */}
          {activeTab === 'badges' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.15rem' }}>Alpine Badges & Accreditations</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Earn accreditation by testing your safety knowledge, preparing gear, configuring expeditions, and inspecting routes.
                  </p>
                </div>
                <span className="hud-tag" style={{ background: 'var(--accent-glow)', borderColor: 'var(--accent-gold)', color: 'var(--accent-gold)' }}>
                  Unlocked: {unlockedBadges.length} of {allBadges.length}
                </span>
              </div>

              <div className="dashboard-grid-2">
                {allBadges.map((badge) => {
                  const isUnlocked = isBadgeUnlocked(badge.id);
                  const IconComp = badge.icon === 'Award' ? Award :
                    badge.icon === 'ShieldCheck' ? ShieldCheck :
                    badge.icon === 'Compass' ? Compass :
                    badge.icon === 'TrendingUp' ? TrendingUp :
                    badge.icon === 'AlertTriangle' ? AlertTriangle : Mountain;

                  return (
                    <div
                      key={badge.id}
                      className="pref-card"
                      style={{
                        position: 'relative',
                        border: isUnlocked ? '1px solid var(--accent-gold)' : '1px dashed var(--border-color)',
                        background: isUnlocked ? 'rgba(212, 175, 55, 0.05)' : 'var(--bg-secondary)',
                        opacity: isUnlocked ? 1 : 0.65
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                        <div style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: isUnlocked ? 'var(--accent-gold)' : 'var(--bg-tertiary)',
                          color: isUnlocked ? '#000' : 'var(--text-muted)'
                        }}>
                          {isUnlocked ? <IconComp size={22} /> : <Lock size={20} />}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span className="hud-tag" style={{ fontSize: '0.65rem' }}>{badge.tier} · {badge.category}</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: isUnlocked ? '#10b981' : 'var(--text-muted)' }}>
                              {isUnlocked ? '✓ UNLOCKED' : 'LOCKED'}
                            </span>
                          </div>
                          <h5 style={{ margin: '0.2rem 0 0', fontSize: '1rem' }}>{badge.name}</h5>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                        {badge.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
