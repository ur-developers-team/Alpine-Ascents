import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Globe, Compass, Navigation } from 'lucide-react';
import destinationsData from '../../data/destinations.json';
import './EarthGlobe3D.css';

import globeData from '../../data/globeData.json';

const REGIONS = globeData.regions;
const GLOBE_MARKERS = globeData.globeMarkers;

// Helper: Convert Lat/Lon to 3D Vector3 on a sphere of radius R
function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}

export default function EarthGlobe3D({ onSelectDestination }) {
  const mountRef = useRef(null);
  const [activeRegion, setActiveRegion] = useState('KARAKORAM');
  const [selectedMarker, setSelectedMarker] = useState(GLOBE_MARKERS[0]);
  const [autoRotate, setAutoRotate] = useState(true);

  const globeStateRef = useRef({
    scene: null,
    camera: null,
    renderer: null,
    globeGroup: null,
    targetRotationY: 0,
    targetRotationX: 0,
    isDragging: false,
    prevX: 0,
    prevY: 0,
    radius: 5
  });

  // Rotate to specific region coordinates
  const focusRegion = (region) => {
    setActiveRegion(region.id);
    if (!globeStateRef.current.globeGroup) return;

    // Convert region center to spherical angles
    const targetY = -(region.lon * Math.PI / 180) + Math.PI / 2;
    const targetX = (region.lat * Math.PI / 180) - 0.2;

    globeStateRef.current.targetRotationY = targetY;
    globeStateRef.current.targetRotationX = targetX;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0f172a, 0.04);

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const radius = 5;

    // Sphere Geometry & Material
    const sphereGeo = new THREE.SphereGeometry(radius, 64, 64);

    // Procedural Topographic Grid Texture for High-Tech Mountain Globe
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Gradient deep alpine ocean
    const gradient = ctx.createLinearGradient(0, 0, 0, 1024);
    gradient.addColorStop(0, '#0c1a2d');
    gradient.addColorStop(0.5, '#122540');
    gradient.addColorStop(1, '#0c1a2d');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 1024);

    // Draw stylized longitude/latitude grid lines
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.14)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 2048; i += 64) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 1024);
      ctx.stroke();
    }
    for (let j = 0; j < 1024; j += 64) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(2048, j);
      ctx.stroke();
    }

    // Stylized continent outlines
    ctx.fillStyle = 'rgba(56, 189, 248, 0.22)';
    // Eurasian / Himalayan landmass blob
    ctx.beginPath();
    ctx.ellipse(1400, 360, 240, 140, 0, 0, Math.PI * 2);
    ctx.fill();
    // South Asia / Pakistan
    ctx.beginPath();
    ctx.ellipse(1450, 420, 140, 110, 0.4, 0, Math.PI * 2);
    ctx.fill();
    // European Alps
    ctx.beginPath();
    ctx.ellipse(1060, 320, 100, 70, 0, 0, Math.PI * 2);
    ctx.fill();
    // Africa
    ctx.beginPath();
    ctx.ellipse(1120, 560, 140, 180, 0, 0, Math.PI * 2);
    ctx.fill();
    // Americas
    ctx.beginPath();
    ctx.ellipse(500, 380, 140, 180, -0.2, 0, Math.PI * 2);
    ctx.fill();

    const globeTexture = new THREE.CanvasTexture(canvas);

    const globeMat = new THREE.MeshStandardMaterial({
      map: globeTexture,
      roughness: 0.7,
      metalness: 0.15,
      bumpScale: 0.05
    });

    const globeMesh = new THREE.Mesh(sphereGeo, globeMat);
    globeGroup.add(globeMesh);

    // Glowing Atmosphere Ring
    const atmosphereGeo = new THREE.SphereGeometry(radius * 1.03, 48, 48);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.12,
      side: THREE.BackSide
    });
    const atmosphere = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    globeGroup.add(atmosphere);

    // Place 3D Markers on the Globe
    const markerGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const markerGroup = new THREE.Group();
    globeGroup.add(markerGroup);

    GLOBE_MARKERS.forEach((m) => {
      const pos = latLonToVector3(m.lat, m.lon, radius * 1.01);

      // Marker pin head
      const markerMat = new THREE.MeshBasicMaterial({
        color: m.id === 'k2' ? 0xd4af37 : 0x38bdf8
      });
      const markerMesh = new THREE.Mesh(markerGeometry, markerMat);
      markerMesh.position.copy(pos);
      markerMesh.userData = m;
      markerGroup.add(markerMesh);

      // Glowing pulse ring
      const ringGeo = new THREE.RingGeometry(0.12, 0.22, 16);
      const ringMat = new THREE.MeshBasicMaterial({
        color: m.id === 'k2' ? 0xd4af37 : 0x38bdf8,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(0, 0, 0);
      markerGroup.add(ringMesh);
    });

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
    sunLight.position.set(10, 10, 10);
    scene.add(sunLight);

    const blueLight = new THREE.DirectionalLight(0x0284c7, 1.2);
    blueLight.position.set(-10, -5, -10);
    scene.add(blueLight);

    // Save refs
    globeStateRef.current = {
      scene,
      camera,
      renderer,
      globeGroup,
      targetRotationY: 1.2,
      targetRotationX: 0.35,
      isDragging: false,
      prevX: 0,
      prevY: 0,
      radius
    };

    // Initial position focus on Karakoram
    const defaultRegion = REGIONS[0];
    const initialY = -(defaultRegion.lon * Math.PI / 180) + Math.PI / 2;
    const initialX = (defaultRegion.lat * Math.PI / 180) - 0.2;
    globeGroup.rotation.y = initialY;
    globeGroup.rotation.x = initialX;
    globeStateRef.current.targetRotationY = initialY;
    globeStateRef.current.targetRotationX = initialX;

    // Raycaster for interactive marker clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e) => {
      globeStateRef.current.isDragging = true;
      globeStateRef.current.prevX = e.clientX;
      globeStateRef.current.prevY = e.clientY;
    };

    const handlePointerMove = (e) => {
      if (globeStateRef.current.isDragging) {
        const deltaX = e.clientX - globeStateRef.current.prevX;
        const deltaY = e.clientY - globeStateRef.current.prevY;
        globeStateRef.current.targetRotationY += deltaX * 0.005;
        globeStateRef.current.targetRotationX += deltaY * 0.005;
        // Clamp latitude rotation to avoid flipping
        globeStateRef.current.targetRotationX = Math.max(-1.2, Math.min(1.2, globeStateRef.current.targetRotationX));
        globeStateRef.current.prevX = e.clientX;
        globeStateRef.current.prevY = e.clientY;
      }
    };

    const handlePointerUp = (e) => {
      globeStateRef.current.isDragging = false;

      // Check click on marker
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerGroup.children);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        if (hit.userData && hit.userData.id) {
          setSelectedMarker(hit.userData);
        }
      }
    };

    container.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    // Animation Loop
    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      if (autoRotate && !globeStateRef.current.isDragging) {
        globeStateRef.current.targetRotationY += 0.0008;
      }

      // Smooth interpolation toward target rotation
      globeGroup.rotation.y += (globeStateRef.current.targetRotationY - globeGroup.rotation.y) * 0.08;
      globeGroup.rotation.x += (globeStateRef.current.targetRotationX - globeGroup.rotation.x) * 0.08;

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
      cancelAnimationFrame(animId);
      container.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [autoRotate]);

  return (
    <section id="interactive-globe" className="globe-section" aria-label="3D Earth & Mountain Explorer">
      <div className="site-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <Globe size={14} />
            <span>GLOBAL TOPOGRAPHIC TELEMETRY</span>
          </div>
          <h2 className="section-title">EXPLORE THE WORLD IN 3D</h2>
          <p className="section-subtitle">
            Interactive WebGL Geographic Earth. Select high-mountain ranges across Pakistan and the globe to inspect summits, base camps, and expedition routes.
          </p>
        </div>

        {/* Region Selector Pills */}
        <div className="globe-region-pills" role="tablist">
          {REGIONS.map(r => (
            <button
              key={r.id}
              className={`globe-region-btn ${activeRegion === r.id ? 'active' : ''}`}
              onClick={() => focusRegion(r)}
              role="tab"
              aria-selected={activeRegion === r.id}
            >
              <Compass size={14} />
              <span>{r.label}</span>
            </button>
          ))}
        </div>

        {/* Main 3D Canvas & Info Card Container */}
        <div className="globe-stage-container">
          <div ref={mountRef} className="globe-canvas-wrap" />

          {/* Floating Selected Marker Info HUD */}
          {selectedMarker && (
            <div className="globe-marker-card animate-fade-in">
              <div className="marker-card-badge-row">
                <span className="marker-region-badge">{selectedMarker.region}</span>
                <span className="marker-alt-badge">{selectedMarker.alt}</span>
              </div>
              <h3 className="marker-card-title">{selectedMarker.name}</h3>
              <p className="marker-card-desc">{selectedMarker.desc}</p>
              <div className="marker-card-coords">
                <Navigation size={12} color="var(--accent)" />
                <span>{selectedMarker.lat.toFixed(2)}° N, {selectedMarker.lon.toFixed(2)}° E</span>
              </div>

              <div className="marker-card-actions">
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => {
                    if (onSelectDestination && selectedMarker.destId) {
                      const found = destinationsData.find(d => d.id === selectedMarker.destId);
                      if (found) {
                        onSelectDestination(found);
                        return;
                      }
                    }
                    const el = document.querySelector('#destinations') || document.querySelector('#expeditions');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <span>Explore Destination Dossier</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}

          {/* Globe Controls */}
          <div className="globe-telemetry-controls">
            <button
              className={`globe-ctrl-btn ${autoRotate ? 'active' : ''}`}
              onClick={() => setAutoRotate(prev => !prev)}
              title={autoRotate ? 'Pause Rotation' : 'Resume Auto Rotation'}
            >
              <span>{autoRotate ? 'Rotation ON' : 'Rotation PAUSED'}</span>
            </button>
            <div className="globe-instruction-hint">
              <span>*Drag to rotate • Click pulsing 3D markers to inspect peaks</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
