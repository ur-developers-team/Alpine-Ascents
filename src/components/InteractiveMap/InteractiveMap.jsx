import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import mountainsData from '../../data/mountains.json';
import destinationsData from '../../data/destinations.json';
import clubsData from '../../data/clubs.json';
import { MapPin, Mountain, Navigation, Compass, Shield, ExternalLink } from 'lucide-react';
import './InteractiveMap.css';

// Fix Leaflet's default marker icons in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Haversine distance helper (km)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export default function InteractiveMap({ onSelectDestination }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('ALL');
  const [selectedDrawerItem, setSelectedDrawerItem] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceToK2, setDistanceToK2] = useState(null);
  const [distanceToMontBlanc, setDistanceToMontBlanc] = useState(null);

  // Acquire user geolocation
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lon = pos.coords.longitude;
          setUserLocation({ lat, lon });
          setDistanceToK2(calculateDistance(lat, lon, 35.8825, 76.5133));
          setDistanceToMontBlanc(calculateDistance(lat, lon, 45.8326, 6.8652));
        },
        () => {
          // Default fallback distance from Islamabad
          setUserLocation({ lat: 33.6844, lon: 73.0479 });
          setDistanceToK2(calculateDistance(33.6844, 73.0479, 35.8825, 76.5133));
          setDistanceToMontBlanc(calculateDistance(33.6844, 73.0479, 45.8326, 6.8652));
        }
      );
    }
  }, []);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Center on Karakoram / Northern Pakistan
    const map = L.map(mapContainerRef.current, {
      center: [35.8, 75.2],
      zoom: 7,
      scrollWheelZoom: false,
      zoomControl: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerRef.current = markersGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers based on active filter
  useEffect(() => {
    if (!markersLayerRef.current || !mapInstanceRef.current) return;
    markersLayerRef.current.clearLayers();

    // 1. Mountain markers
    if (activeFilter === 'ALL' || activeFilter === 'MOUNTAINS') {
      mountainsData.forEach(m => {
        if (!m.coordinates) return;
        const mountainIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background:#0284c7;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.5);font-size:12px;font-weight:bold;cursor:pointer;">▲</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(m.coordinates, { icon: mountainIcon });
        marker.on('click', () => {
          setSelectedDrawerItem({
            type: 'mountain',
            data: m,
            name: m.name,
            sub: `${m.range} • ${m.location}`,
            altitude: m.altitudeFormatted || `${m.altitude}m`,
            difficulty: m.difficulty,
            season: m.bestSeason,
            image: m.image,
            desc: m.description || m.summary
          });
        });
        markersLayerRef.current.addLayer(marker);
      });
    }

    // 2. Destination markers (Hunza, Skardu, Gilgit, K2, Nanga Parbat, Fairy Meadows, Deosai, Naltar)
    if (activeFilter === 'ALL' || activeFilter === 'DESTINATIONS') {
      destinationsData.forEach(d => {
        if (!d.coordinates) return;
        const destIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background:#10b981;color:#fff;border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.5);font-size:13px;font-weight:bold;cursor:pointer;">📍</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker(d.coordinates, { icon: destIcon });
        marker.on('click', () => {
          setSelectedDrawerItem({
            type: 'destination',
            data: d,
            name: d.name,
            sub: `${d.region} • ${d.country}`,
            altitude: d.altitude,
            difficulty: d.difficulty,
            season: d.bestSeason,
            price: `$${d.startingPrice}`,
            image: d.image,
            desc: d.overview
          });
        });
        markersLayerRef.current.addLayer(marker);
      });
    }

    // 3. Clubs markers
    if (activeFilter === 'ALL' || activeFilter === 'CLUBS') {
      clubsData.forEach(c => {
        if (!c.coordinates) return;
        const clubIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background:#d97706;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 3px 10px rgba(0,0,0,0.5);font-size:11px;font-weight:bold;cursor:pointer;">★</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(c.coordinates, { icon: clubIcon });
        marker.on('click', () => {
          setSelectedDrawerItem({
            type: 'club',
            data: c,
            name: c.name,
            sub: `Alpine Organization • Founded ${c.founded}`,
            altitude: c.city,
            desc: c.description || `Leading alpine organisation based in ${c.city}.`,
            link: c.website
          });
        });
        markersLayerRef.current.addLayer(marker);
      });
    }
  }, [activeFilter]);

  useEffect(() => {
    const handleSelectDestEvent = (e) => {
      const destId = e.detail;
      const found = destinationsData.find(d => d.id === destId);
      if (found && onSelectDestination) {
        onSelectDestination(found);
      }
    };
    window.addEventListener('alpine-select-dest', handleSelectDestEvent);
    return () => window.removeEventListener('alpine-select-dest', handleSelectDestEvent);
  }, [onSelectDestination]);

  return (
    <section id="map" className="section map-section" aria-label="Explore The Mountain Region Interactive Map">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>TOPOGRAPHY & TELEMETRY</span>
          </div>
          <h2 className="section-title">EXPLORE THE MOUNTAIN REGION</h2>
          <p className="section-subtitle">
            Interactive high-altitude geographic telemetry across the Karakoram, Western Himalaya, and Hindu Kush. Select any marker (Hunza, Skardu, Gilgit, K2, Nanga Parbat, Fairy Meadows, Deosai, Naltar) to inspect live telemetry and valley dossiers.
          </p>
        </div>

        {/* Map Container */}
        <div className="map-container-wrapper" style={{ position: 'relative', height: '600px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

          {/* Map Controls Filter Overlay */}
          <div className="map-controls-overlay">
            <div className="map-filter-pills" role="tablist">
              {[
                { label: 'ALL PINS', key: 'ALL' },
                { label: 'MOUNTAINS', key: 'MOUNTAINS' },
                { label: 'DESTINATIONS', key: 'DESTINATIONS' },
                { label: 'CLUBS', key: 'CLUBS' }
              ].map(f => (
                <button
                  key={f.key}
                  className={`btn btn-sm ${activeFilter === f.key ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setActiveFilter(f.key)}
                  style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Compact Marker Telemetry Drawer Overlay */}
          {selectedDrawerItem && (
            <div className="map-compact-drawer animate-fade-in" style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              width: '320px',
              maxWidth: 'calc(100% - 2rem)',
              background: 'var(--bg-card-solid, #ffffff)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
              boxShadow: '0 12px 32px rgba(15, 23, 42, 0.18)',
              zIndex: 1000,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {selectedDrawerItem.image && (
                <div style={{ height: '140px', width: '100%', position: 'relative' }}>
                  <img
                    src={selectedDrawerItem.image}
                    alt={selectedDrawerItem.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => setSelectedDrawerItem(null)}
                    style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      background: 'rgba(15, 23, 42, 0.7)',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '26px',
                      height: '26px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px'
                    }}
                    aria-label="Close drawer"
                  >
                    ✕
                  </button>
                </div>
              )}

              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {!selectedDrawerItem.image && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent)' }}>
                      {selectedDrawerItem.type.toUpperCase()}
                    </span>
                    <button
                      onClick={() => setSelectedDrawerItem(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {selectedDrawerItem.sub}
                </div>
                <h4 style={{ margin: 0, fontSize: '1.15rem', color: 'var(--text-primary)', fontWeight: 800 }}>
                  {selectedDrawerItem.name}
                </h4>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', margin: '0.25rem 0' }}>
                  {selectedDrawerItem.altitude && (
                    <span style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      ⛰ {selectedDrawerItem.altitude}
                    </span>
                  )}
                  {selectedDrawerItem.season && (
                    <span style={{ fontSize: '0.72rem', background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 600 }}>
                      📅 {selectedDrawerItem.season}
                    </span>
                  )}
                  {selectedDrawerItem.difficulty && (
                    <span style={{ fontSize: '0.72rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--accent)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>
                      {selectedDrawerItem.difficulty}
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.45, margin: '0.25rem 0 0.5rem 0' }}>
                  {selectedDrawerItem.desc ? `${selectedDrawerItem.desc.slice(0, 140)}...` : ''}
                </p>

                {selectedDrawerItem.type === 'destination' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      if (onSelectDestination) onSelectDestination(selectedDrawerItem.data);
                    }}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>Explore Full Dossier</span>
                    <ExternalLink size={13} />
                  </button>
                )}

                {selectedDrawerItem.type === 'mountain' && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      const el = document.querySelector('#mountains');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <span>View Peak Profile</span>
                    <Mountain size={13} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SRS Geolocation Telemetry Overlay */}
          <div className="map-geo-panel">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
              <Navigation size={14} color="var(--accent)" />
              <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'var(--accent)', fontWeight: 700 }}>
                GEOLOCATION TELEMETRY
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div>
                Distance to K2 Summit: <strong>{distanceToK2 ? `${distanceToK2.toLocaleString()} km` : 'Computing...'}</strong>
              </div>
              <div>
                Distance to Mont Blanc: <strong>{distanceToMontBlanc ? `${distanceToMontBlanc.toLocaleString()} km` : 'Computing...'}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
