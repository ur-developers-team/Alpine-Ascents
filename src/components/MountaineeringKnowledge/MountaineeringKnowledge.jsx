import React, { useState } from 'react';
import { BookOpen, Clock, Compass, Shield, Home, AlertTriangle, Trophy, CheckSquare } from 'lucide-react';
import HistoryTimeline from './HistoryTimeline';
import InteractiveHistoryTimeline from '../HistoryTimeline/InteractiveHistoryTimeline';
import StylesComparison from './StylesComparison';
import TechniquesViewer from './TechniquesViewer';
import ShelteringExplorer from './ShelteringExplorer';
import HazardsViewer from './HazardsViewer';
import RecordsExplorer from './RecordsExplorer';
import GuidelinesAccordion from './GuidelinesAccordion';
import './MountaineeringKnowledge.css';

export default function MountaineeringKnowledge() {
  const [activeTab, setActiveTab] = useState('history');
  const [timelineView, setTimelineView] = useState('interactive'); // 'interactive' or 'chronicle'

  const tabs = [
    { id: 'history', label: 'HISTORY', icon: <Clock size={14} /> },
    { id: 'styles', label: 'TYPES & STYLES', icon: <Compass size={14} /> },
    { id: 'techniques', label: 'TECHNIQUES', icon: <Shield size={14} /> },
    { id: 'sheltering', label: 'SHELTERING', icon: <Home size={14} /> },
    { id: 'hazards', label: 'HAZARDS & MEDICINE', icon: <AlertTriangle size={14} /> },
    { id: 'records', label: 'WORLD RECORDS', icon: <Trophy size={14} /> },
    { id: 'guidelines', label: 'GUIDELINES & LNT', icon: <CheckSquare size={14} /> }
  ];

  return (
    <section id="knowledge" className="section knowledge-section">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            <BookOpen size={14} />
            <span>SRS CORE FOUNDATIONS</span>
          </div>
          <h2 className="section-title">MOUNTAINEERING KNOWLEDGE</h2>
          <p className="section-subtitle">
            An encyclopedic repository of alpine history, technical ropecraft, physiological hazards, high-altitude sheltering, and ethical stewardship.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="knowledge-tab-bar" role="tablist" aria-label="Mountaineering Disciplines">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`btn btn-sm ${activeTab === tab.id ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dynamic Tab Panes */}
        <div>
          {activeTab === 'history' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginBottom: '1rem' }}>
                <button
                  className={`btn btn-sm ${timelineView === 'interactive' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTimelineView('interactive')}
                >
                  Interactive Horizontal Track
                </button>
                <button
                  className={`btn btn-sm ${timelineView === 'chronicle' ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setTimelineView('chronicle')}
                >
                  Classic Chronicle
                </button>
              </div>
              {timelineView === 'interactive' ? <InteractiveHistoryTimeline /> : <HistoryTimeline />}
            </div>
          )}
          {activeTab === 'styles' && <StylesComparison />}
          {activeTab === 'techniques' && <TechniquesViewer />}
          {activeTab === 'sheltering' && <ShelteringExplorer />}
          {activeTab === 'hazards' && <HazardsViewer />}
          {activeTab === 'records' && <RecordsExplorer />}
          {activeTab === 'guidelines' && <GuidelinesAccordion />}
        </div>
      </div>
    </section>
  );
}
