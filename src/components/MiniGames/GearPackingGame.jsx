import React, { useState } from 'react';
import gearData from '../../data/gearGame.json';
import { useGamification } from '../../context/GamificationContext';
import { Briefcase, Check, AlertTriangle, RefreshCw, Info, Sparkles } from 'lucide-react';
import './GearPackingGame.css';

export default function GearPackingGame() {
  const { completeMiniGame } = useGamification();
  const [packedIds, setPackedIds] = useState([]);
  const [feedback, setFeedback] = useState({ text: 'Drag items or tap to pack your 8,000m rucksack.', type: 'info' });
  const [isDone, setIsDone] = useState(false);

  const MAX_CAPACITY_KG = 9.5;

  const packedItems = gearData.filter(item => packedIds.includes(item.id));
  const totalWeight = parseFloat(packedItems.reduce((sum, item) => sum + item.weightKg, 0).toFixed(2));
  const essentialCount = gearData.filter(item => item.isEssential).length;
  const packedEssentialCount = packedItems.filter(item => item.isEssential).length;
  const deadWeightCount = packedItems.filter(item => !item.isEssential).length;

  const handleToggleItem = (item) => {
    if (packedIds.includes(item.id)) {
      // Unpack
      setPackedIds(prev => prev.filter(id => id !== item.id));
      setFeedback({ text: `Removed "${item.name}" from rucksack.`, type: 'info' });
    } else {
      // Check weight
      if (totalWeight + item.weightKg > MAX_CAPACITY_KG + 2) {
        setFeedback({ text: '⚠ Capacity exceeded! Unpack non-essential items first.', type: 'warning' });
        return;
      }

      setPackedIds(prev => [...prev, item.id]);

      if (item.isEssential) {
        setFeedback({
          text: `✓ Good choice! ${item.educationalNote}`,
          type: 'success'
        });
      } else {
        setFeedback({
          text: `⚠ Think about this item! ${item.educationalNote}`,
          type: 'warning'
        });
      }
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    const item = gearData.find(g => g.id === itemId);
    if (item && !packedIds.includes(item.id)) {
      handleToggleItem(item);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleVerifyPack = () => {
    if (deadWeightCount > 0) {
      setFeedback({
        text: `⚠ You are carrying ${deadWeightCount} useless dead-weight items! Remove them before summit launch.`,
        type: 'warning'
      });
      return;
    }

    if (packedEssentialCount < essentialCount) {
      setFeedback({
        text: `⚠ Incomplete gear! You are missing ${essentialCount - packedEssentialCount} life-saving items.`,
        type: 'warning'
      });
      return;
    }

    // Success!
    setIsDone(true);
    setFeedback({
      text: '🎉 Flawless Expedition Rigging! All essential gear packed with zero dead weight.',
      type: 'success'
    });
    completeMiniGame('gear', 'gear_specialist');
  };

  const handleReset = () => {
    setPackedIds([]);
    setIsDone(false);
    setFeedback({ text: 'Rucksack emptied. Select your essential alpine gear.', type: 'info' });
  };

  return (
    <div className="gear-game-container">
      <div className="gear-game-header">
        <div>
          <h3>🎒 Pack Your Expedition Rucksack</h3>
          <p>Drag or tap essential gear items into your high-altitude pack. Avoid dangerous dead weight.</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={handleReset} title="Reset pack">
          <RefreshCw size={14} />
          <span>Reset</span>
        </button>
      </div>

      {/* Real-time Status / Feedback Banner */}
      <div className={`gear-feedback-bar ${feedback.type}`}>
        {feedback.type === 'success' && <Check size={16} />}
        {feedback.type === 'warning' && <AlertTriangle size={16} />}
        {feedback.type === 'info' && <Info size={16} />}
        <span>{feedback.text}</span>
      </div>

      <div className="gear-game-main-layout">
        {/* Available Equipment Locker */}
        <div className="gear-locker-panel">
          <div className="gear-panel-title">
            <span>EXPEDITION EQUIPMENT DEPOT</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted, #475569)' }}>Tap or drag to pack</span>
          </div>

          <div className="gear-items-grid">
            {gearData.map(item => {
              const isPacked = packedIds.includes(item.id);
              return (
                <div
                  key={item.id}
                  className={`gear-item-card ${isPacked ? 'packed' : ''}`}
                  draggable={!isPacked}
                  onDragStart={(e) => e.dataTransfer.setData('text/plain', item.id)}
                  onClick={() => handleToggleItem(item)}
                >
                  <div className="gear-item-header">
                    <span className="gear-category-badge">{item.category}</span>
                    <span className="gear-weight-badge">{item.weightKg} kg</span>
                  </div>
                  <strong className="gear-item-name">{item.name}</strong>
                  <p className="gear-item-hint">{item.hint}</p>
                  <div className="gear-item-footer">
                    <span>{isPacked ? '✓ Packed in Rucksack' : '+ Pack Item'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Expedition Rucksack Drop Zone */}
        <div
          className="gear-rucksack-dropzone"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="rucksack-visual-header">
            <div className="rucksack-icon-box">
              <Briefcase size={28} color="var(--accent, #0284c7)" />
            </div>
            <div>
              <h4>Expedition 85L Pack</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #475569)' }}>
                Target Capacity: {MAX_CAPACITY_KG} kg Max
              </span>
            </div>
          </div>

          {/* Weight & Essential Progress Meters */}
          <div className="rucksack-telemetry">
            <div className="telemetry-bar-row">
              <span>Total Weight:</span>
              <strong>{totalWeight} / {MAX_CAPACITY_KG} kg</strong>
            </div>
            <div className="meter-track">
              <div
                className={`meter-fill ${totalWeight > MAX_CAPACITY_KG ? 'danger' : ''}`}
                style={{ width: `${Math.min((totalWeight / MAX_CAPACITY_KG) * 100, 100)}%` }}
              />
            </div>

            <div className="telemetry-bar-row" style={{ marginTop: '0.5rem' }}>
              <span>Essential Gear:</span>
              <strong>{packedEssentialCount} / {essentialCount}</strong>
            </div>
            <div className="meter-track">
              <div
                className="meter-fill success"
                style={{ width: `${(packedEssentialCount / essentialCount) * 100}%` }}
              />
            </div>
          </div>

          {/* Packed Items List in Bag */}
          <div className="packed-items-scroll">
            {packedItems.length === 0 ? (
              <div className="rucksack-empty-hint">
                <p>Pack is currently empty.</p>
                <span>Click items in the depot or drag them here.</span>
              </div>
            ) : (
              packedItems.map(item => (
                <div key={item.id} className="packed-pill">
                  <span>{item.name} ({item.weightKg}kg)</span>
                  <button
                    className="packed-remove-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleItem(item);
                    }}
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>

          <div className="rucksack-actions">
            <button
              className="btn btn-primary btn-block"
              onClick={handleVerifyPack}
              disabled={packedIds.length === 0 || isDone}
            >
              {isDone ? (
                <>
                  <Sparkles size={16} />
                  <span>Verified & Approved</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Verify Pack & Weight</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
