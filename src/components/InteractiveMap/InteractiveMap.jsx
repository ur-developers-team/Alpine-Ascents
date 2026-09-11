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
    if (mapInstanceRef.current) return; // Prevent double init

    // Center on Karakoram / Northern Pakistan
    const map = L.map(mapContainerRef.current, {
      center: [36.0, 75.0],
      zoom: 6,
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
          html: `<div style="background:#0284c7;color:#fff;border-radius:50%;width:26px;height:26px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.6);font-size:12px;font-weight:bold;">▲</div>`,
          iconSize: [26, 26],
          iconAnchor: [13, 13]
        });

        const marker = L.marker(m.coordinates, { icon: mountainIcon });
        marker.bindPopup(`
          <div style="min-width: 180px; font-family: Outfit, sans-serif;">
            <div style="font-size:10px;font-family:Space Mono,monospace;color:#38bdf8;text-transform:uppercase;">${m.range}</div>
            <h4 style="margin:2px 0 4px;font-size:14px;color:#fff;">${m.name}</h4>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">Elev: <strong>${m.altitudeFormatted}</strong></div>
            <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">${m.difficulty}</div>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      });
    }

    // 2. Destination markers
    if (activeFilter === 'ALL' || activeFilter === 'DESTINATIONS') {
      destinationsData.forEach(d => {
        if (!d.coordinates) return;
        const destIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background:#10b981;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.6);font-size:11px;font-weight:bold;">●</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(d.coordinates, { icon: destIcon });
        marker.bindPopup(`
          <div style="min-width: 180px; font-family: Outfit, sans-serif;">
            <div style="font-size:10px;font-family:Space Mono,monospace;color:#34d399;text-transform:uppercase;">${d.region}</div>
            <h4 style="margin:2px 0 4px;font-size:14px;color:#fff;">${d.name}</h4>
            <div style="font-size:12px;color:#94a3b8;margin-bottom:6px;">Alt: <strong>${d.altitude}</strong></div>
            <div style="font-size:11px;color:#cbd5e1;line-height:1.4;">Window: ${d.bestSeason}</div>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      });
    }

    // 3. Clubs markers
    if (activeFilter === 'ALL' || activeFilter === 'CLUBS') {
      clubsData.forEach(c => {
        if (!c.coordinates) return;
        const clubIcon = L.divIcon({
          className: 'custom-map-marker',
          html: `<div style="background:#d97706;color:#fff;border-radius:50%;width:24px;height:24px;display:flex;align-items:center;justify-content:center;border:2px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.6);font-size:11px;font-weight:bold;">★</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const marker = L.marker(c.coordinates, { icon: clubIcon });
        marker.bindPopup(`
          <div style="min-width: 180px; font-family: Outfit, sans-serif;">
            <div style="font-size:10px;font-family:Space Mono,monospace;color:#fbbf24;text-transform:uppercase;">Alpine Organization</div>
            <h4 style="margin:2px 0 4px;font-size:13px;color:#fff;">${c.name}</h4>
            <div style="font-size:11px;color:#94a3b8;margin-bottom:6px;">Founded ${c.founded} · ${c.city}</div>
            <a href="${c.website}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#38bdf8;text-decoration:underline;">Visit Official Portal</a>
          </div>
        `);
        markersLayerRef.current.addLayer(marker);
      });
    }
  }, [activeFilter]);

  return (
    <section id="map" className="section map-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Compass size={14} />
            <span>GLOBAL TOPOGRAPHY & TELEMETRY</span>
          </div>
          <h2 className="section-title">INTERACTIVE EXPEDITION MAP</h2>
          <p className="section-subtitle">
            Explore 8,000-meter pinnacles, historic staging camps, and international alpine clubs. Features live geolocation distance telemetry.
          </p>
        </div>

        {/* Map Container */}
        <div className="map-container-wrapper">
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
                  style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

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
