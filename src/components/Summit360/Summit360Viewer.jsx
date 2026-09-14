import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, ZoomIn, ZoomOut, Compass, Mountain, Maximize2 } from 'lucide-react';
import './Summit360Viewer.css';

import summitViewsData from '../../data/summitViews.json';

const SUMMIT_VIEWS = summitViewsData;

export default function Summit360Viewer() {
  const mountRef = useRef(null);
  const [selectedSummit, setSelectedSummit] = useState(SUMMIT_VIEWS[0]);
  const [autoRotate, setAutoRotate] = useState(true);
  const [azimuth, setAzimuth] = useState(180);

  const stateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    sphere: null,
    texture: null,
    lon: 180,
    lat: 0,
    phi: 0,
    theta: 0,
    isUserInteracting: false,
    onPointerDownPointerX: 0,
    onPointerDownPointerY: 0,
    onPointerDownLon: 0,
    onPointerDownLat: 0
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 540;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(70, width / height, 1, 1100);
    camera.target = new THREE.Vector3(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    // Inverted Sphere for 360 equirectangular projection
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const loader = new THREE.TextureLoader();
    const texture = loader.load(selectedSummit.textureUrl);
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    stateRef.current.renderer = renderer;
    stateRef.current.scene = scene;
    stateRef.current.camera = camera;
    stateRef.current.sphere = sphere;
    stateRef.current.texture = texture;

    // Interaction Events
    const onPointerDown = (e) => {
      stateRef.current.isUserInteracting = true;
      stateRef.current.onPointerDownPointerX = e.clientX;
      stateRef.current.onPointerDownPointerY = e.clientY;
      stateRef.current.onPointerDownLon = stateRef.current.lon;
      stateRef.current.onPointerDownLat = stateRef.current.lat;
    };

    const onPointerMove = (e) => {
      if (!stateRef.current.isUserInteracting) return;
      stateRef.current.lon = (stateRef.current.onPointerDownPointerX - e.clientX) * 0.15 + stateRef.current.onPointerDownLon;
      stateRef.current.lat = (e.clientY - stateRef.current.onPointerDownPointerY) * 0.15 + stateRef.current.onPointerDownLat;
    };

    const onPointerUp = () => {
      stateRef.current.isUserInteracting = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      camera.fov = Math.max(35, Math.min(85, camera.fov + e.deltaY * 0.05));
      camera.updateProjectionMatrix();
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    domElement.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !stateRef.current.isUserInteracting) {
        stateRef.current.lon += 0.08;
      }

      stateRef.current.lat = Math.max(-85, Math.min(85, stateRef.current.lat));
      stateRef.current.phi = THREE.MathUtils.degToRad(90 - stateRef.current.lat);
      stateRef.current.theta = THREE.MathUtils.degToRad(stateRef.current.lon);

      const targetX = 500 * Math.sin(stateRef.current.phi) * Math.cos(stateRef.current.theta);
      const targetY = 500 * Math.cos(stateRef.current.phi);
      const targetZ = 500 * Math.sin(stateRef.current.phi) * Math.sin(stateRef.current.theta);

      camera.lookAt(targetX, targetY, targetZ);

      // Update bearing angle
      const bearing = Math.round((stateRef.current.lon % 360 + 360) % 360);
      setAzimuth(bearing);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      domElement.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [selectedSummit, autoRotate]);

  const handleZoom = (delta) => {
    if (stateRef.current.camera) {
      stateRef.current.camera.fov = Math.max(35, Math.min(85, stateRef.current.camera.fov + delta));
      stateRef.current.camera.updateProjectionMatrix();
    }
  };

  return (
    <section id="summit360" className="summit-360-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <Eye size={13} style={{ display: 'inline', marginRight: '0.4rem' }} />
            IMMERSIVE HIGH-ALTITUDE SPHERE
          </span>
          <h2 className="section-title">360° Summit Panorama Experience</h2>
          <p className="section-subtitle">
            Stand virtually on the apex crest. Click and drag in full 360 degrees to inspect surrounding peaks, glacial passes, and weather windows.
          </p>
        </div>

        <div className="summit-360-container">
          {/* Canvas Box */}
          <div ref={mountRef} className="summit-360-canvas-box" />

          {/* Top HUD Telemetry */}
          <div className="summit-360-hud-top">
            <span className="hud-tag" style={{ marginBottom: '0.35rem' }}>
              SUMMIT CREST PANORAMA · {selectedSummit.elevation}
            </span>
            <h3 style={{ fontSize: '1.35rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              {selectedSummit.name}
            </h3>
            <div style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '0.2rem', fontFamily: 'var(--font-mono)' }}>
              Azimuth Bearing: {azimuth}° · {selectedSummit.range}
            </div>
          </div>

          {/* Summit Selector Bar */}
          <div className="summit-360-selector-bar">
            {SUMMIT_VIEWS.map(view => (
              <button
                key={view.id}
                className={`summit-360-btn ${selectedSummit.id === view.id ? 'active' : ''}`}
                onClick={() => setSelectedSummit(view)}
              >
                {view.name.split(' ')[0]} ({view.elevation})
              </button>
            ))}
          </div>

          {/* Bottom Controls */}
          <div className="summit-360-controls-bottom">
            <button
              className={`summit-360-control-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle Auto-Panorama"
              aria-label="Toggle Auto-Panorama"
            >
              <RotateCw size={15} />
            </button>
            <button
              className="summit-360-control-btn"
              onClick={() => handleZoom(-10)}
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn size={15} />
            </button>
            <button
              className="summit-360-control-btn"
              onClick={() => handleZoom(10)}
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut size={15} />
            </button>
          </div>

          {/* Legend Hint */}
          <div className="summit-360-legend">
            <span>EXPLORATION MODE</span>
            <strong>Click & Drag to Look Around · Scroll to Zoom</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
