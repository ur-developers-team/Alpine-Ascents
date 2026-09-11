import React, { useState, useEffect } from 'react';
import { Clock, Calendar, MapPin, Radio, Compass } from 'lucide-react';
import './Ticker.css';

export default function Ticker() {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [locationStatus, setLocationStatus] = useState('Acquiring Telemetry...');
  const [locationCoords, setLocationCoords] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const requestGeolocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('K2 Basecamp (35.88° N, 76.51° E)');
      return;
    }

    setLocationStatus('Locating Position...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(2);
        const lon = pos.coords.longitude.toFixed(2);
        setLocationCoords({ lat, lon });
        setLocationStatus(`${lat}° N, ${lon}° E (Client Geolocation)`);
      },
      (err) => {
        console.info('Geolocation notice: using high-altitude basecamp default.', err.message);
        setLocationStatus('Gilgit-Baltistan Telemetry (35°52\' N, 76°30\' E)');
      },
      { timeout: 8000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    requestGeolocation();
  }, []);

  // Format date: "FRI, 11 SEP 2026"
  const formattedDate = currentDateTime.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();

  // Format time: "10:45:20"
  const formattedTime = currentDateTime.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <footer className="ticker-bar" role="status" aria-label="Alpine Expedition Telemetry">
      <div className="container ticker-inner">
        <div className="ticker-items">
          {/* Live Status Beacon */}
          <div className="ticker-item">
            <span className="ticker-status-beacon" />
            <span className="ticker-label-lead" style={{ color: 'var(--accent)', fontWeight: 700 }}>ALPINE:</span>
            <span className="ticker-status-text">EXPEDITION NETWORK</span>
          </div>

          {/* Current Date */}
          <div className="ticker-item ticker-item-date">
            <Calendar size={13} color="var(--accent)" />
            <span>DATE: <strong>{formattedDate}</strong></span>
          </div>

          {/* Current Time */}
          <div className="ticker-item ticker-item-time">
            <Clock size={13} color="var(--accent)" />
            <span>TIME: <strong>{formattedTime}</strong></span>
          </div>
        </div>

        {/* Current Geolocation */}
        <div className="ticker-items ticker-gps-group">
          <div className="ticker-item">
            <MapPin size={13} color="var(--accent)" />
            <span>GPS: <strong>{locationStatus}</strong></span>
            <button
              className="ticker-geo-btn"
              onClick={requestGeolocation}
              title="Refresh GPS Coordinates"
              aria-label="Refresh GPS"
            >
              <Compass size={11} />
              <span className="ticker-sync-text">SYNC</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
