import React, { useState, useRef } from 'react';
import timelineData from '../../data/timeline.json';
import { ChevronLeft, ChevronRight, Mountain, User, Flag, Award, Calendar } from 'lucide-react';
import './InteractiveHistoryTimeline.css';

export default function InteractiveHistoryTimeline() {
  const [selectedEra, setSelectedEra] = useState('ALL');
  const scrollContainerRef = useRef(null);

  const eras = ['ALL', '1780s', '1860s', '1920s', '1950s', '1970s', '1980s', '2020s'];

  const filteredMilestones = timelineData.filter((m) => {
    return selectedEra === 'ALL' || m.era === selectedEra;
  });

  const scroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="interactive-timeline-wrap">
      {/* Era Selection Bar */}
      <div className="timeline-era-pills" role="tablist" aria-label="Timeline Eras">
        {eras.map((era) => (
          <button
            key={era}
            className={`timeline-era-btn ${selectedEra === era ? 'active' : ''}`}
            onClick={() => setSelectedEra(era)}
            role="tab"
            aria-selected={selectedEra === era}
          >
            {era === 'ALL' ? 'ALL ERAS' : era}
          </button>
        ))}
      </div>

      {/* Top Bar with count and scroll buttons */}
      <div className="timeline-controls-bar">
        <span className="timeline-count-meta">
          DISPLAYING {filteredMilestones.length} HISTORIC MILESTONES · 1786 TO 2024
        </span>
        <div className="timeline-nav-arrows">
          <button
            className="timeline-arrow-btn"
            onClick={() => scroll('left')}
            aria-label="Scroll left in history timeline"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="timeline-arrow-btn"
            onClick={() => scroll('right')}
            aria-label="Scroll right in history timeline"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Draggable Horizontal Timeline Track */}
      <div className="timeline-horizontal-scroll" ref={scrollContainerRef}>
        {filteredMilestones.map((item) => (
          <div key={item.id} className="milestone-horizontal-card">
            <div className="milestone-img-wrap">
              <img src={item.image} alt={item.title} className="milestone-card-img" />
              <span className="milestone-year-badge">{item.year}</span>
              <span className="milestone-type-pill">{item.milestoneType}</span>
            </div>

            <div className="milestone-card-body">
              <h4 className="milestone-card-title">{item.title}</h4>

              <div className="milestone-card-pioneers">
                <User size={13} />
                <span>{item.climbers}</span>
              </div>

              <div className="milestone-card-geo">
                {item.region} · Elevation: {item.elevation}
              </div>

              <p className="milestone-card-summary">
                {item.summary}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
