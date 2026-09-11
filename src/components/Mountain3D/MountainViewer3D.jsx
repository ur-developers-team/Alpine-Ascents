import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Eye, RotateCw, Layers, Compass } from 'lucide-react';
import { useUserProfile } from '../../context/UserProfileContext';
import { useLanguage } from '../../context/LanguageContext';
import './MountainViewer3D.css';

export default function MountainViewer3D() {
  const mountRef = useRef(null);
  const [wireframe, setWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const { unlockBadge } = useUserProfile();
  const { t } = useLanguage();

  const sceneStateRef = useRef({
    renderer: null,
    scene: null,
    camera: null,
    mesh: null,
    wireframeMesh: null,
    particles: null,
    isDragging: false,
    prevMouseX: 0,
    prevMouseY: 0,
    rotationY: 0,
    rotationX: 0.2
  });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // Scene & Camera
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070c14, 0.035);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 13);
    camera.lookAt(0, 1.5, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xd4af37, 0.4);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff2d4, 1.6);
    sunLight.position.set(8, 12, 6);
    scene.add(sunLight);

    const blueRimLight = new THREE.DirectionalLight(0x38bdf8, 0.9);
    blueRimLight.position.set(-8, 4, -6);
    scene.add(blueRimLight);

    // Procedural Mountain Peak Geometry
    const segments = 64;
    const geometry = new THREE.PlaneGeometry(16, 16, segments, segments);
    const pos = geometry.attributes.position;

    // Displace vertices to form a central K2-like pyramidal apex
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const distFromCenter = Math.sqrt(x * x + y * y);

      // Radial decay with sharp alpine ridges
      const baseHeight = Math.max(0, 4.8 - distFromCenter * 0.72);
      const ridge1 = Math.cos(Math.atan2(y, x) * 4) * 0.6 * (1 - distFromCenter / 7);
      const noise = Math.sin(x * 1.8) * Math.cos(y * 1.8) * 0.35 +
                    Math.sin(x * 3.6 + y * 2.2) * 0.15;

      const z = Math.max(0, baseHeight + ridge1 + noise);
      pos.setZ(i, z);
    }
    geometry.computeVertexNormals();

    // Mountain Material
    const material = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.85,
      metalness: 0.15,
      flatShading: true
    });

    const mountainMesh = new THREE.Mesh(geometry, material);
    mountainMesh.rotation.x = -Math.PI / 2.2;
    mountainMesh.position.y = -1;
    scene.add(mountainMesh);

    // Topographic wireframe contour mesh overlay
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    wireframeMesh.rotation.x = -Math.PI / 2.2;
    wireframeMesh.position.y = -0.99;
    wireframeMesh.visible = wireframe;
    scene.add(wireframeMesh);

    // Snow particle system
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const particleCoords = new Float32Array(particleCount * 3);

    for (let p = 0; p < particleCount * 3; p += 3) {
      particleCoords[p] = (Math.random() - 0.5) * 16;
      particleCoords[p + 1] = Math.random() * 8;
      particleCoords[p + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particleCoords, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.055,
      transparent: true,
      opacity: 0.75
    });
    const snowParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(snowParticles);

    sceneStateRef.current = {
      renderer,
      scene,
      camera,
      mesh: mountainMesh,
      wireframeMesh,
      particles: snowParticles,
      isDragging: false,
      prevMouseX: 0,
      prevMouseY: 0,
      rotationY: 0,
      rotationX: 0.2
    };

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !sceneStateRef.current.isDragging) {
        sceneStateRef.current.rotationY += 0.003;
      }

      mountainMesh.rotation.z = sceneStateRef.current.rotationY;
      wireframeMesh.rotation.z = sceneStateRef.current.rotationY;

      // Snow particle drifting
      const positions = snowParticles.geometry.attributes.position.array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] -= 0.015;
        if (positions[i] < -2) positions[i] = 7;
      }
      snowParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };
    animate();

    // Mouse Drag Rotation
    const handlePointerDown = (e) => {
      sceneStateRef.current.isDragging = true;
      sceneStateRef.current.prevMouseX = e.clientX;
      sceneStateRef.current.prevMouseY = e.clientY;
      unlockBadge('route_scout');
    };

    const handlePointerMove = (e) => {
      if (!sceneStateRef.current.isDragging) return;
      const deltaX = e.clientX - sceneStateRef.current.prevMouseX;
      sceneStateRef.current.rotationY += deltaX * 0.008;
      sceneStateRef.current.prevMouseX = e.clientX;
      sceneStateRef.current.prevMouseY = e.clientY;
    };

    const handlePointerUp = () => {
      sceneStateRef.current.isDragging = false;
    };

    const handleWheel = (e) => {
      e.preventDefault();
      camera.position.z = Math.max(7, Math.min(18, camera.position.z + e.deltaY * 0.01));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

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
      domElement.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      wireframeMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (domElement.parentElement) {
        domElement.parentElement.removeChild(domElement);
      }
    };
  }, [autoRotate]);

  // Wireframe toggle effect
  useEffect(() => {
    if (sceneStateRef.current.wireframeMesh) {
      sceneStateRef.current.wireframeMesh.visible = wireframe;
    }
  }, [wireframe]);

  return (
    <section id="mountain3d" className="mountain-3d-section">
      <div className="site-container">
        <div className="section-header">
          <span className="section-eyebrow">
            <Compass size={14} style={{ display: 'inline', marginRight: '0.4rem' }} />
            {t('routes3d', 'badge')}
          </span>
          <h2 className="section-title">{t('routes3d', 'title')}</h2>
          <p className="section-subtitle">{t('routes3d', 'subtitle')}</p>
        </div>

        <div className="mountain-3d-container" ref={mountRef}>
          {/* Topographic HUD */}
          <div className="mountain-3d-hud">
            <span className="hud-tag" style={{ marginBottom: '0.4rem' }}>
              SIMULATED TELEMETRY · KARAKORAM PYRAMIDAL PEAK
            </span>
            <h3 style={{ fontSize: '1.4rem', margin: 0, textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}>
              K2 Savage Apex Model (8,611m)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
              Abruzzi Spur Ridge · North Pillar · Bottleneck Serac
            </p>
          </div>

          {/* Controls */}
          <div className="mountain-3d-controls">
            <button
              className={autoRotate ? 'active' : ''}
              onClick={() => setAutoRotate(!autoRotate)}
              title="Toggle continuous rotation"
            >
              <RotateCw size={13} style={{ display: 'inline', marginRight: '0.35rem' }} />
              {autoRotate ? 'Auto-Orbit: ON' : 'Auto-Orbit: OFF'}
            </button>
            <button
              className={wireframe ? 'active' : ''}
              onClick={() => setWireframe(!wireframe)}
              title="Toggle topographic wireframe contours"
            >
              <Layers size={13} style={{ display: 'inline', marginRight: '0.35rem' }} />
              Contours: {wireframe ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* Legend */}
          <div className="mountain-3d-legend">
            <span>INTERACTION</span>
            <strong>Click & Drag to Orbit · Scroll to Zoom</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
