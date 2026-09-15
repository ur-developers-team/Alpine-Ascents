import React from 'react';

/**
 * Lightweight Alpine Ascents Error Boundary
 * Catches unhandled runtime exceptions in React components to prevent silent white screens
 * and provides safe recovery controls for the user.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Alpine Ascents ErrorBoundary caught an exception]:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleHardReset = () => {
    // Clear legacy service worker registrations and cache storages if present
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const reg of registrations) {
          reg.unregister();
        }
      });
    }
    if ('caches' in window) {
      caches.keys().then((keys) => {
        for (const key of keys) {
          caches.delete(key);
        }
      });
    }
    // Navigate cleanly to base URL with cache bypass
    window.location.href = window.location.origin + '/?reset=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            width: '100%',
            backgroundColor: '#070c12',
            color: '#e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Outfit', 'Plus Jakarta Sans', system-ui, sans-serif",
            padding: '24px',
            boxSizing: 'border-box'
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'linear-gradient(145deg, rgba(16, 24, 38, 0.95), rgba(8, 14, 23, 0.98))',
              border: '1px solid rgba(212, 175, 55, 0.3)',
              borderRadius: '16px',
              padding: '36px 32px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(212, 175, 55, 0.1)'
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px'
              }}
            >
              🏔️
            </div>

            <h1
              style={{
                fontFamily: "'Cinzel', Georgia, serif",
                fontSize: '24px',
                fontWeight: 700,
                color: '#f8fafc',
                margin: '0 0 12px',
                letterSpacing: '0.04em'
              }}
            >
              Base Camp Signal Interrupted
            </h1>

            <p
              style={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#94a3b8',
                margin: '0 0 28px'
              }}
            >
              An unexpected condition interrupted the expedition interface. You can reload the page or perform a clean cache reset to resume.
            </p>

            <div
              style={{
                display: 'flex',
                gap: '12px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '20px'
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #aa820a 100%)',
                  color: '#070c12',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 600,
                  fontSize: '14px',
                  cursor: 'pointer',
                  letterSpacing: '0.03em',
                  boxShadow: '0 4px 14px rgba(212, 175, 55, 0.35)'
                }}
              >
                Reload Expedition
              </button>

              <button
                type="button"
                onClick={this.handleHardReset}
                style={{
                  background: 'transparent',
                  color: '#cbd5e1',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '12px 20px',
                  borderRadius: '8px',
                  fontWeight: 500,
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Purge Cache & Reload
              </button>
            </div>

            {this.state.error && (
              <details
                style={{
                  textAlign: 'left',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  fontSize: '12px',
                  color: '#ef4444',
                  fontFamily: 'monospace',
                  overflowX: 'auto'
                }}
              >
                <summary style={{ cursor: 'pointer', color: '#94a3b8', marginBottom: '6px' }}>
                  Diagnostics Information
                </summary>
                {this.state.error.toString()}
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
