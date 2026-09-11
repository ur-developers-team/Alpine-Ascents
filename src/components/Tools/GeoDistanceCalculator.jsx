import React, { useState } from 'react';
import { Compass, MapPin, Navigation, Plane, Truck, Footprints, AlertCircle, Check } from 'lucide-react';
import mountainsData from '../../data/mountains.json';
import destinationsData from '../../data/destinations.json';

const GLOBAL_ORIGINS = [
  { name: 'Islamabad, Pakistan', lat: 33.6844, lng: 73.0479 },
  { name: 'Geneva, Switzerland (Alps HQ)', lat: 46.2044, lng: 6.1432 },
  { name: 'London, United Kingdom', lat: 51.5074, lng: -0.1278 },
  { name: 'Dubai, UAE', lat: 25.2048, lng: 55.2708 },
  { name: 'New York City, USA', lat: 40.7128, lng: -74.0060 },
  { name: 'Tokyo, Japan', lat: 35.6762, lng: 139.6503 }
];

// Target Alpine summits and regional hubs
const ALPINE_TARGETS = [
  { name: 'K2 (8,611m)', lat: 35.8825, lng: 76.5133, type: 'Mountain', region: 'Karakoram' },
  { name: 'Mount Everest (8,848m)', lat: 27.9881, lng: 86.9250, type: 'Mountain', region: 'Himalayas' },
  { name: 'Nanga Parbat (8,126m)', lat: 35.2372, lng: 74.5892, type: 'Mountain', region: 'Himalayas' },
  { name: 'Broad Peak (8,051m)', lat: 35.8117, lng: 76.5678, type: 'Mountain', region: 'Karakoram' },
  { name: 'Mont Blanc (4,808m)', lat: 45.8326, lng: 6.8652, type: 'Mountain', region: 'Alps' },
  { name: 'Hunza Valley (Karimabad)', lat: 36.3167, lng: 74.6500, type: 'Hub', region: 'Gilgit-Baltistan' },
  { name: 'Skardu Gateway Hub', lat: 35.2971, lng: 75.6333, type: 'Hub', region: 'Gilgit-Baltistan' },
  { name: 'Fairy Meadows', lat: 35.3853, lng: 74.5778, type: 'Hub', region: 'Gilgit-Baltistan' }
];

// Haversine Great Circle Distance Formula
function calculateHaversine(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in kilometers
}

// Initial Bearing Azimuth Formula
function calculateBearing(lat1, lon1, lat2, lon2) {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const θ = Math.atan2(y, x);
  const brng = ((θ * 180) / Math.PI + 360) % 360;
  return Math.round(brng);
}

function getCardinalDirection(angle) {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(angle / 22.5) % 16;
  return directions[index];
}

export default function GeoDistanceCalculator() {
  const [originName, setOriginName] = useState('Islamabad, Pakistan');
  const [userCoords, setUserCoords] = useState({ lat: 33.6844, lng: 73.0479 });
  const [selectedTargetIndex, setSelectedTargetIndex] = useState(0); // Default to K2
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState(null);

  const target = ALPINE_TARGETS[selectedTargetIndex];

  // Great-circle calculations
  const distanceKm = Math.round(
    calculateHaversine(userCoords.lat, userCoords.lng, target.lat, target.lng)
  );
  const distanceMiles = Math.round(distanceKm * 0.621371);
  const distanceNautical = Math.round(distanceKm * 0.539957);
  const bearing = calculateBearing(userCoords.lat, userCoords.lng, target.lat, target.lng);
  const cardinal = getCardinalDirection(bearing);

  // Travel time estimations
  const flightHours = (distanceKm / 800).toFixed(1);
  const overlandDays = Math.ceil(distanceKm / 400);
  const trekkingDays = Math.ceil(distanceKm / 20);

  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Acquiring high-altitude satellite fix...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setOriginName(`My Current GPS Location (${pos.coords.latitude.toFixed(2)}°, ${pos.coords.longitude.toFixed(2)}°)`);
        setIsLocating(false);
        setLocationStatus('GPS Coordinates Locked!');
        setTimeout(() => setLocationStatus(null), 3500);
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('GPS access denied or timed out. Switched to preset origins.');
        setTimeout(() => setLocationStatus(null), 4000);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectPresetOrigin = (preset) => {
    setOriginName(preset.name);
    setUserCoords({ lat: preset.lat, lng: preset.lng });
    setLocationStatus(null);
  };

  return (
    <div className="geo-distance-card">
      <div className="tool-card-header">
        <div className="tool-header-badge">
          <Navigation size={13} />
          <span>HAVERSINE ORBITAL GEODESY</span>
        </div>
        <h3 className="tool-card-title">Expedition Geo-Distance & Bearing Calculator</h3>
        <p className="tool-card-desc">
          Compute spherical great-circle arc distances, compass azimuths, and multi-modal expedition travel times between your coordinates and iconic massifs.
        </p>
      </div>

      <div className="geo-selectors-grid">
        {/* Origin Selector */}
        <div className="geo-selector-col">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label className="tool-input-label">EXPEDITION ORIGIN</label>
            <button
              type="button"
              className="geo-gps-btn"
              onClick={handleUseGPS}
              disabled={isLocating}
            >
              <Compass size={13} />
              <span>{isLocating ? 'Acquiring...' : 'Use My GPS'}</span>
            </button>
          </div>

          <select
            className="tool-select-field"
            value={originName}
            onChange={(e) => {
              const found = GLOBAL_ORIGINS.find((o) => o.name === e.target.value);
              if (found) handleSelectPresetOrigin(found);
            }}
          >
            {originName.includes('My Current GPS') && (
              <option value={originName}>{originName}</option>
            )}
            {GLOBAL_ORIGINS.map((o) => (
              <option key={o.name} value={o.name}>
                {o.name}
              </option>
            ))}
          </select>

          {locationStatus && (
            <div className="geo-status-banner">
              <AlertCircle size={13} />
              <span>{locationStatus}</span>
            </div>
          )}
        </div>

        {/* Target Mountain/Hub Selector */}
        <div className="geo-selector-col">
          <label className="tool-input-label">DESTINATION MASSIF / ALPINE HUB</label>
          <select
            className="tool-select-field"
            value={selectedTargetIndex}
            onChange={(e) => setSelectedTargetIndex(parseInt(e.target.value, 10))}
          >
            {ALPINE_TARGETS.map((t, idx) => (
              <option key={t.name} value={idx}>
                {t.name} ({t.region} · {t.type})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Distance & Bearing Telemetry Display */}
      <div className="geo-telemetry-hero">
        <div className="geo-compass-visual">
          <div
            className="geo-compass-needle"
            style={{ transform: `rotate(${bearing}deg)` }}
            title={`Bearing: ${bearing}° ${cardinal}`}
          >
            <div className="needle-north" />
            <div className="needle-south" />
          </div>
          <span className="geo-compass-cardinal">{cardinal}</span>
        </div>

        <div className="geo-primary-distance">
          <span className="geo-distance-eyebrow">GREAT CIRCLE DISTANCE</span>
          <div className="geo-distance-value">
            {distanceKm.toLocaleString()} <span className="geo-unit">KM</span>
          </div>
          <div className="geo-secondary-units">
            <span>{distanceMiles.toLocaleString()} Statute Miles</span> · <span>{distanceNautical.toLocaleString()} Nautical Miles</span>
          </div>
        </div>

        <div className="geo-bearing-metric">
          <span className="geo-distance-eyebrow">COMPASS AZIMUTH</span>
          <div className="geo-bearing-val">
            {bearing.toString().padStart(3, '0')}°
          </div>
          <span className="geo-bearing-cardinal">{cardinal} True North</span>
        </div>
      </div>

      {/* Estimated Transit Times */}
      <div className="geo-transit-grid">
        <div className="geo-transit-card">
          <Plane size={18} color="var(--accent)" />
          <div>
            <strong className="transit-val">{flightHours} hrs</strong>
            <span className="transit-label">Jet Aviation (800 km/h)</span>
          </div>
        </div>

        <div className="geo-transit-card">
          <Truck size={18} color="#f59e0b" />
          <div>
            <strong className="transit-val">{overlandDays} days</strong>
            <span className="transit-label">Overland Karakoram Convoy</span>
          </div>
        </div>

        <div className="geo-transit-card">
          <Footprints size={18} color="#10b981" />
          <div>
            <strong className="transit-val">{trekkingDays} days</strong>
            <span className="transit-label">Foot Expedition Staging</span>
          </div>
        </div>
      </div>
    </div>
  );
}
