import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { WishlistProvider } from './context/WishlistContext';
import { UserProfileProvider } from './context/UserProfileContext';
import { LanguageProvider } from './context/LanguageContext';
import { ToastProvider } from './context/ToastContext';
import { GamificationProvider } from './context/GamificationContext';

// Animation & Interactive Atmosphere Components
import CinematicLoader from './components/Common/CinematicLoader';
import AlpineCursor from './components/Common/AlpineCursor';
import MountainParallaxScene from './components/Landscape/MountainParallaxScene';
import Summit360Viewer from './components/Summit360/Summit360Viewer';
import ClimbSummitHUD from './components/Gamification/ClimbSummitHUD';
import SummitCelebrationModal from './components/Gamification/SummitCelebrationModal';
import SummitCertificateModal from './components/Certificate/SummitCertificateModal';

// High-Altitude Mini-Games & Interactive Modules
import MiniGamesHub from './components/MiniGames/MiniGamesHub';
import GlacierSlider from './components/GlacierComparison/GlacierSlider';
import CommunityPoll from './components/CommunityPoll/CommunityPoll';

// Core Components
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import Ticker from './components/Ticker/Ticker';
import PlacesExplorer from './components/Places/PlacesExplorer';
import PackageExplorer from './components/PackageExplorer/PackageExplorer';
import PackageDetailModal from './components/PackageExplorer/PackageDetailModal';
import DestinationExplorer from './components/DestinationExplorer/DestinationExplorer';
import DestinationDetailModal from './components/DestinationExplorer/DestinationDetailModal';
import GilgitBaltistanSection from './components/GilgitBaltistan/GilgitBaltistanSection';
import MountainFinder from './components/MountainFinder/MountainFinder';
import MountainViewer3D from './components/Mountain3D/MountainViewer3D';
import ElevationChart from './components/ElevationChart/ElevationChart';
import LiveWeatherWidget from './components/WeatherWidget/LiveWeatherWidget';
import AccommodationExplorer from './components/Accommodation/AccommodationExplorer';
import FoodExperience from './components/FoodAndTransport/FoodExperience';
import TransportExperience from './components/FoodAndTransport/TransportExperience';
import ExpeditionBuilder from './components/ExpeditionBuilder/ExpeditionBuilder';
import ExpeditionAdvisor from './components/ExpeditionAdvisor/ExpeditionAdvisor';
import GuideDirectory from './components/Guides/GuideDirectory';
import InteractiveMap from './components/InteractiveMap/InteractiveMap';
import MountaineeringKnowledge from './components/MountaineeringKnowledge/MountaineeringKnowledge';
import ClubExplorer from './components/Clubs/ClubExplorer';
import LatestDevelopments from './components/Developments/LatestDevelopments';
import SuccessStories from './components/Stories/SuccessStories';
import DestinationVideo from './components/DestinationVideo/DestinationVideo';
import JournalExplorer from './components/Journal/JournalExplorer';
import EquipmentChecklist from './components/EquipmentChecklist/EquipmentChecklist';
import DiscountsSection from './components/Discounts/DiscountsSection';
import GalleryExplorer from './components/Gallery/GalleryExplorer';
import TestimonialsCarousel from './components/Testimonials/TestimonialsCarousel';
import FAQSection from './components/FAQSection/FAQSection';

// Modals & Floating Utilities
import AlpineQuizModal from './components/AlpineQuiz/AlpineQuizModal';
import GlobalSearchModal from './components/Search/GlobalSearchModal';
import ProfileDashboard from './components/UserProfile/ProfileDashboard';
import WishlistModal from './components/Wishlist/WishlistModal';
import TripRequestModal from './components/TripRequest/TripRequestModal';
import ScrollProgress from './components/Common/ScrollProgress';
import BackToTop from './components/Common/BackToTop';
import Footer from './components/Footer/Footer';

// Ultimate Master Upgrade Components
import SherpaBot from './components/SherpaBot/SherpaBot';
import AlpineToolsSuite from './components/Tools/AlpineToolsSuite';
import AltitudeScrollIndicator from './components/Common/AltitudeScrollIndicator';
import KeyboardShortcutModal from './components/Common/KeyboardShortcutModal';
import LostClimberModal from './components/LostClimber404/LostClimberModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  // Modal states
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [tripRequestModalOpen, setTripRequestModalOpen] = useState(false);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [lostClimberModalOpen, setLostClimberModalOpen] = useState(false);
  const [selectedDestinationModal, setSelectedDestinationModal] = useState(null);
  const [selectedPackageModal, setSelectedPackageModal] = useState(null);
  const [activeTripForRequest, setActiveTripForRequest] = useState(null);

  // Global Alpine Keyboard Shortcuts
  useKeyboardShortcuts({
    onOpenSearch: () => setSearchModalOpen(true),
    onOpenProfile: () => setProfileModalOpen(true),
    onOpenWishlist: () => setWishlistModalOpen(true),
    onOpenHelp: () => setHelpModalOpen(true),
    onOpenLostClimber: () => setLostClimberModalOpen(true),
    onCloseAll: () => {
      setSearchModalOpen(false);
      setProfileModalOpen(false);
      setWishlistModalOpen(false);
      setQuizModalOpen(false);
      setHelpModalOpen(false);
      setLostClimberModalOpen(false);
      setSelectedDestinationModal(null);
      setSelectedPackageModal(null);
      setTripRequestModalOpen(false);
    }
  });

  // Active section for navbar underline
  const [activeSection, setActiveSection] = useState('expeditions');

  // Listen for Ctrl+K shortcut globally
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  // Scroll Reveal Observer (SRS Requirement 4)
  useEffect(() => {
    const elements = document.querySelectorAll('.reveal-on-scroll, .section-header');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleOpenTripBuilder = (destId) => {
    const builderEl = document.querySelector('#trip-builder');
    if (builderEl) {
      builderEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleRequestExpedition = (tripManifest) => {
    setActiveTripForRequest(tripManifest);
    setTripRequestModalOpen(true);
  };

  const handleSearchSelectItem = (type, item) => {
    if (type === 'destination') {
      setSelectedDestinationModal(item);
    } else if (type === 'package') {
      setSelectedPackageModal(item);
    } else if (type === 'mountain') {
      const el = document.querySelector('#mountain-finder');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'guide') {
      const el = document.querySelector('#guides');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'article') {
      const el = document.querySelector('#journal');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <LanguageProvider>
      <ThemeProvider>
        <WishlistProvider>
          <UserProfileProvider>
            <ToastProvider>
              <GamificationProvider>
                {/* Cinematic First-Load Sequence (SRS Requirement 9) */}
                <CinematicLoader />

                {/* Desktop Cursor Snow & Fog Particle System (SRS Requirement 3 & 8) */}
                <AlpineCursor />

                {/* Scroll progress indicator line (SRS Requirement 10) */}
                <ScrollProgress />

                {/* Vertical Altitude & Expedition Camps Scroll Indicator */}
                <AltitudeScrollIndicator />

                {/* Sticky Navigation Header with ambient audio, voice navigation & complete logo (SRS Requirement 33, 34, 40) */}
                <Navbar
                  onOpenSearch={() => setSearchModalOpen(true)}
                  onOpenWishlist={() => setWishlistModalOpen(true)}
                  onOpenProfile={() => setProfileModalOpen(true)}
                  onOpenTripBuilder={() => handleOpenTripBuilder()}
                  onOpenQuiz={() => setQuizModalOpen(true)}
                  activeSection={activeSection}
                />

                {/* Interactive Summit Climb Progress HUD (SRS Requirement 3) */}
                <ClimbSummitHUD
                  onOpenGames={() => {
                    const el = document.querySelector('#mini-games-hub');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                <main>
                  {/* Cinematic Hero with Parallax & Animated Mountain Drawing (SRS Requirement 1, 5, 6, 49) */}
                  <Hero
                    onOpenTripBuilder={() => handleOpenTripBuilder()}
                    onExploreClick={() => {
                      const el = document.querySelector('#places');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* Interactive Animated Mountain & Glacial River Scene (SRS Requirement 2, 14, 15) */}
                  <MountainParallaxScene />

                  {/* Dedicated Places Ecosystem (Pakistan Hubs, GB, Global Ranges & City Packages) */}
                  <PlacesExplorer
                    onRequestTrip={(title) => {
                      handleRequestExpedition({
                        name: title,
                        destinationName: 'Northern Pakistan Hub',
                        duration: 'Custom Itinerary',
                        travelStyle: 'Comfort',
                        guide: 'Lead Alpine Sirdar',
                        price: 1250
                      });
                    }}
                  />

                  {/* Featured Expeditions & Packages */}
                  <PackageExplorer
                    onSelectPackage={(pkg) => setSelectedPackageModal(pkg)}
                    onOpenTripBuilder={(pkg) => handleOpenTripBuilder(pkg?.destinationId)}
                  />

                  {/* Live Mountain Weather & Sunrise/Sunset (Open-Meteo REST API) (SRS Requirement 16) */}
                  <LiveWeatherWidget />

                  {/* 3D Topographic Mountain Simulation (Three.js WebGL) */}
                  <MountainViewer3D />

                  {/* Interactive 360° Summit Panorama Viewer (SRS Requirement 21) */}
                  <Summit360Viewer />

                  {/* Interactive Route Elevation Profile (SVG Chart) */}
                  <ElevationChart />

                  {/* Destination Discovery */}
                  <DestinationExplorer
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                    onOpenTripBuilder={(destId) => handleOpenTripBuilder(destId)}
                  />

                  {/* Gilgit-Baltistan Flagship Experience */}
                  <GilgitBaltistanSection
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                    onOpenTripBuilder={() => handleOpenTripBuilder('hunza-valley')}
                  />

                  {/* Mountain Finder & Orographic Database */}
                  <MountainFinder />

                  {/* Scientific Expedition Instrumentation: Radar Matrix, Altitude Hypoxia & Geo-Distance */}
                  <AlpineToolsSuite />

                  {/* Experiences: Accommodation, Food & Transport */}
                  <section id="experiences" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
                    <div className="site-container">
                      <AccommodationExplorer />
                      <FoodExperience />
                      <TransportExperience />
                    </div>
                  </section>

                  {/* Flagship: Build Your Own Expedition */}
                  <ExpeditionBuilder
                    onRequestExpedition={handleRequestExpedition}
                  />

                  {/* Interactive Recommendation Engine: Not Sure Where To Go? */}
                  <ExpeditionAdvisor
                    onSelectPackage={(pkg) => setSelectedPackageModal(pkg)}
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                  />

                  {/* High-Altitude Mini-Games Hub (Pack Your Gear, Oxygen Pace, Avalanche Reflex, Route Odyssey) */}
                  <MiniGamesHub />

                  {/* Mountain Experts & Guides */}
                  <GuideDirectory
                    onRequestGuide={(guide) => {
                      handleRequestExpedition({
                        name: `Guide Guided Expedition with ${guide.name}`,
                        destinationName: guide.region,
                        duration: 'Custom Duration',
                        travelStyle: 'Expedition Pro',
                        guide: guide.name,
                        price: 1850
                      });
                    }}
                  />

                  {/* Interactive Global Topography Map */}
                  <InteractiveMap
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                  />

                  {/* Mountaineering Knowledge Platform (SRS Educational Foundations) */}
                  <MountaineeringKnowledge />

                  {/* Environmental Glaciology: Before / After Comparison Slider (SRS Requirement 12) */}
                  <GlacierSlider />

                  {/* Institutional Alpine Clubs */}
                  <ClubExplorer />

                  {/* Latest in the Mountains */}
                  <LatestDevelopments />

                  {/* Expedition Success Stories */}
                  <SuccessStories />

                  {/* Detailed Video Cinema & Archives (SRS Requirement 16, 17, 18) */}
                  <DestinationVideo />

                  {/* The Alpine Journal */}
                  <JournalExplorer />

                  {/* Equipment Readiness Checklist */}
                  <EquipmentChecklist />

                  {/* Seasonal Privileges & Offers */}
                  <DiscountsSection />

                  {/* High-Resolution Photography Gallery with Overhauled Lightbox (SRS Requirement 12 & 13) */}
                  <GalleryExplorer />

                  {/* Testimonials Memoir Carousel */}
                  <TestimonialsCarousel />

                  {/* Community Summit Poll: Which Mountain Would You Climb Next? (SRS Requirement 13) */}
                  <CommunityPoll />

                  {/* Comprehensive FAQ Section */}
                  <FAQSection />
                </main>

                {/* Multi-column Footer */}
                <Footer
                  onOpenProfile={() => setProfileModalOpen(true)}
                  onOpenWishlist={() => setWishlistModalOpen(true)}
                  onOpenTripBuilder={() => handleOpenTripBuilder()}
                />

                {/* Continuous Bottom Ticker (Date, Time, Geolocation Telemetry) */}
                <Ticker />

                {/* Smooth Back to Top */}
                <BackToTop />

                {/* Alpine Safety Quiz Modal */}
                <AlpineQuizModal
                  isOpen={quizModalOpen}
                  onClose={() => {
                    setQuizModalOpen(false);
                    setProfileModalOpen(true);
                  }}
                />

                {/* Summit 100% Celebration Modal (SRS Requirement 4) */}
                <SummitCelebrationModal />

                {/* Personalized Virtual Certificate Generator Modal (SRS Requirement 14) */}
                <SummitCertificateModal />

                {/* Global Overlays & Modals */}
                <GlobalSearchModal
                  isOpen={searchModalOpen}
                  onClose={() => setSearchModalOpen(false)}
                  onSelectItem={handleSearchSelectItem}
                />

                <ProfileDashboard
                  isOpen={profileModalOpen}
                  onClose={() => setProfileModalOpen(false)}
                  onSelectPackage={(pkg) => setSelectedPackageModal(pkg)}
                  onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                />

                <WishlistModal
                  isOpen={wishlistModalOpen}
                  onClose={() => setWishlistModalOpen(false)}
                  onSelectItem={handleSearchSelectItem}
                />

                <DestinationDetailModal
                  destination={selectedDestinationModal}
                  isOpen={!!selectedDestinationModal}
                  onClose={() => setSelectedDestinationModal(null)}
                  onOpenTripBuilder={(destId) => {
                    setSelectedDestinationModal(null);
                    handleOpenTripBuilder(destId);
                  }}
                />

                <PackageDetailModal
                  pkg={selectedPackageModal}
                  isOpen={!!selectedPackageModal}
                  onClose={() => setSelectedPackageModal(null)}
                  onRequestExpedition={(pkg) => {
                    setSelectedPackageModal(null);
                    handleRequestExpedition(pkg);
                  }}
                />

                <TripRequestModal
                  initialTrip={activeTripForRequest}
                  isOpen={tripRequestModalOpen}
                  onClose={() => setTripRequestModalOpen(false)}
                />

                {/* Keyboard Shortcuts Help Modal */}
                <KeyboardShortcutModal
                  isOpen={helpModalOpen}
                  onClose={() => setHelpModalOpen(false)}
                />

                {/* Lost Climber 404 Rescue Mini-Game Modal */}
                <LostClimberModal
                  isOpen={lostClimberModalOpen}
                  onClose={() => setLostClimberModalOpen(false)}
                  onReturnHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />

                {/* Interactive Thematic Assistant & Intent Engine */}
                <SherpaBot />
              </GamificationProvider>
            </ToastProvider>
          </UserProfileProvider>
        </WishlistProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
