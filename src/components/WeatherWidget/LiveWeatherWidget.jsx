import React, { useState, useEffect } from 'react';
import { Cloud, Wind, Compass, Gauge, Droplets, RefreshCw, Sunrise, Sunset, SunMedium } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import './LiveWeatherWidget.css';

import weatherPeaksData from '../../data/weatherPeaks.json';

const PEAKS = weatherPeaksData;

const getWeatherDescription = (code) => {
  if (code === 0) return 'Clear Skies & Peak Visibility';
  if (code <= 3) return 'Partly Cloudy · Summit Window Stable';
  if (code <= 48) return 'Freezing Fog & Glacial Mist';
  if (code <= 67) return 'Freezing Rain & High-Altitude Sleet';
  if (code <= 77) return 'Brisk Snowpack Accumulation';
  if (code <= 86) return 'Blizzard & Severe Whiteout Conditions';
  return 'Extreme High-Altitude Storm';
};

export default function LiveWeatherWidget() {
  const [selectedPeak, setSelectedPeak] = useState(PEAKS[0]);
  const [weatherData, setWeatherData] = useState(PEAKS[0].fallback);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { t } = useLanguage();

  const fetchPeakWeather = async (peak) => {
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${peak.lat}&longitude=${peak.lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,wind_direction_10m,weather_code&hourly=temperature_2m,wind_speed_10m&daily=sunrise,sunset&forecast_days=1&timezone=auto`;
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('API response failed');
      const data = await res.json();

      if (data && data.current) {
        let liveSunrise = peak.fallback.sunrise;
        let liveSunset = peak.fallback.sunset;

        if (data.daily && data.daily.sunrise?.[0]) {
          const sr = new Date(data.daily.sunrise[0]);
          liveSunrise = sr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        if (data.daily && data.daily.sunset?.[0]) {
          const ss = new Date(data.daily.sunset[0]);
          liveSunset = ss.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        setWeatherData({
          temp: Math.round(data.current.temperature_2m),
          windSpeed: Math.round(data.current.wind_speed_10m),
          windDir: data.current.wind_direction_10m,
          pressure: Math.round(data.current.surface_pressure),
          humidity: data.current.relative_humidity_2m,
          condition: getWeatherDescription(data.current.weather_code),
          hourly: data.hourly,
          sunrise: liveSunrise,
          sunset: liveSunset
        });
        setIsLive(true);
        setLastUpdated(new Date().toLocaleTimeString());
      } else {
        throw new Error('Invalid format');
      }
    } catch {
      // Fallback from verified static data
      setWeatherData(peak.fallback);
      setIsLive(false);
      setLastUpdated(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPeakWeather(selectedPeak);
  }, [selectedPeak]);

  return (
    <section id="weather" className="weather-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <Cloud size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            {t('weather', 'badge')}
          </span>
          <h2 className="section-title">{t('weather', 'title')}</h2>
          <p className="section-subtitle">{t('weather', 'subtitle')}</p>
        </div>

        <div className="weather-container">
          <div className="weather-header-row">
            {/* Peak Selector */}
            <div className="weather-peak-selector">
              {PEAKS.map(peak => (
                <button
                  key={peak.id}
                  className={`peak-pill-btn ${selectedPeak.id === peak.id ? 'active' : ''}`}
                  onClick={() => setSelectedPeak(peak)}
                >
                  {peak.name.split(' ')[0]} ({peak.elevation})
                </button>
              ))}
            </div>

            {/* Status Telemetry Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className={`weather-telemetry-badge ${isLive ? 'live' : 'fallback'}`}>
                <span className="weather-pulse-dot" />
                {isLive ? `${t('weather', 'liveApi')} · Open-Meteo` : `${t('weather', 'cachedFallback')} · Alpine Base`}
              </div>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => fetchPeakWeather(selectedPeak)}
                disabled={loading}
                title="Refresh meteorological telemetry"
                aria-label="Refresh telemetry"
              >
                <RefreshCw size={14} className={loading ? 'spin' : ''} />
              </button>
            </div>
          </div>

          <div className="weather-main-grid">
            {/* Main Temp & Condition */}
            <div className="weather-card-hero">
              <span className="section-eyebrow">{selectedPeak.range}</span>
              <h3 style={{ fontSize: '1.4rem', margin: '0.25rem 0' }}>{selectedPeak.name}</h3>
              <div className="weather-hero-temp">
                {weatherData.temp > 0 ? `+${weatherData.temp}` : weatherData.temp}°C
              </div>
              <div className="weather-hero-condition">
                {weatherData.condition}
              </div>
              <div className="weather-hero-meta">
                Summit Altitude: {selectedPeak.elevation} · Telemetry: {lastUpdated || 'Current'}
              </div>

              {/* Requirement 16: Live Sunrise & Sunset */}
              <div style={{
                marginTop: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--border-color, rgba(255,255,255,0.1))',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.75rem'
              }}>
                <div style={{
                  background: 'rgba(255, 180, 0, 0.08)',
                  padding: '0.6rem 0.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 180, 0, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <Sunrise size={18} color="#f59e0b" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sunrise</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      {weatherData.sunrise || 'Unavailable'}
                    </div>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(236, 72, 153, 0.08)',
                  padding: '0.6rem 0.5rem',
                  borderRadius: '8px',
                  border: '1px solid rgba(236, 72, 153, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}>
                  <Sunset size={18} color="#ec4899" />
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Sunset</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                      {weatherData.sunset || 'Unavailable'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Atmospheric Metrics & Forecast */}
            <div>
              <div className="weather-metrics-grid">
                <div className="weather-metric-card">
                  <div className="weather-metric-icon">
                    <Wind size={22} />
                  </div>
                  <div className="weather-metric-info">
                    <span>{t('weather', 'wind')}</span>
                    <strong>{weatherData.windSpeed} km/h</strong>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="weather-metric-icon">
                    <Compass size={22} style={{ transform: `rotate(${weatherData.windDir || 0}deg)` }} />
                  </div>
                  <div className="weather-metric-info">
                    <span>{t('weather', 'windDir')}</span>
                    <strong>{weatherData.windDir}° Azimuth</strong>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="weather-metric-icon">
                    <Gauge size={22} />
                  </div>
                  <div className="weather-metric-info">
                    <span>{t('weather', 'pressure')}</span>
                    <strong>{weatherData.pressure} hPa</strong>
                  </div>
                </div>

                <div className="weather-metric-card">
                  <div className="weather-metric-icon">
                    <Droplets size={22} />
                  </div>
                  <div className="weather-metric-info">
                    <span>Relative Humidity</span>
                    <strong>{weatherData.humidity}%</strong>
                  </div>
                </div>
              </div>

              {/* 6-Hour Summit Forecast Strip */}
              <div className="weather-forecast-strip">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Next 6-Hour High-Altitude Profile
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--accent-gold)' }}>
                    Wind & Thermal Velocity
                  </span>
                </div>

                <div className="forecast-hours-row">
                  {[0, 2, 4, 6, 8, 10].map((offset, idx) => {
                    const tempVal = weatherData.hourly?.temperature_2m?.[offset] !== undefined
                      ? Math.round(weatherData.hourly.temperature_2m[offset])
                      : weatherData.temp + (idx % 2 === 0 ? -1 : 1);
                    const windVal = weatherData.hourly?.wind_speed_10m?.[offset] !== undefined
                      ? Math.round(weatherData.hourly.wind_speed_10m[offset])
                      : weatherData.windSpeed + (idx * 2);

                    return (
                      <div key={idx} className="forecast-hour-col">
                        <span>+{offset * 2}h</span>
                        <strong>{tempVal}°C</strong>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
                          {windVal} km/h
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
