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
import Summit360Viewer from './components/Summit360/Summit360Viewer';
import ClimbSummitHUD from './components/Gamification/ClimbSummitHUD';
import SummitCelebrationModal from './components/Gamification/SummitCelebrationModal';
import SummitCertificateModal from './components/Certificate/SummitCertificateModal';

// High-Altitude Mini-Games & Interactive Modules
import MiniGamesHub from './components/MiniGames/MiniGamesHub';
import GlacierSlider from './components/GlacierComparison/GlacierSlider';
import CommunityPoll from './components/CommunityPoll/CommunityPoll';

// Core Navigation & Hero
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import QuickSearchDock from './components/Hero/QuickSearchDock';
import Ticker from './components/Ticker/Ticker';

// Explorers & World Sections
import MountainExplorer from './components/Experiences/MountainExplorer';
import ChooseYourExperience from './components/Experiences/ChooseYourExperience';
import DestinationExplorer from './components/DestinationExplorer/DestinationExplorer';
import DestinationDetailModal from './components/DestinationExplorer/DestinationDetailModal';
import InteractiveMap from './components/InteractiveMap/InteractiveMap';
import PackageExplorer from './components/PackageExplorer/PackageExplorer';
import PackageDetailModal from './components/PackageExplorer/PackageDetailModal';
import MeetOurGuides from './components/Guides/MeetOurGuides';

// Experiences, Offers & Builder
import FamilyOffersSection from './components/FamilyOffers/FamilyOffersSection';
import DiscountsSection from './components/Discounts/DiscountsSection';
import ExpeditionBuilder from './components/ExpeditionBuilder/ExpeditionBuilder';
import ExpeditionTimeline from './components/ExpeditionTimeline/ExpeditionTimeline';

// Media, Guides & Scientific Platforms
import WhyAlpineAscents from './components/WhyUs/WhyAlpineAscents';
import SuccessStories from './components/Stories/SuccessStories';
import DestinationVideo from './components/DestinationVideo/DestinationVideo';
import JournalExplorer from './components/Journal/JournalExplorer';
import GalleryExplorer from './components/Gallery/GalleryExplorer';
import FinalBookingCTA from './components/Common/FinalBookingCTA';
import Footer from './components/Footer/Footer';

// Modals & Floating Utilities
import PlanYourExpeditionModal from './components/Common/PlanYourExpeditionModal';
import LuckyDrawModal from './components/Common/LuckyDrawModal';
import AlpineQuizModal from './components/AlpineQuiz/AlpineQuizModal';
import GlobalSearchModal from './components/Search/GlobalSearchModal';
import ProfileDashboard from './components/UserProfile/ProfileDashboard';
import WishlistModal from './components/Wishlist/WishlistModal';
import TripRequestModal from './components/TripRequest/TripRequestModal';
import ScrollProgress from './components/Common/ScrollProgress';
import BackToTop from './components/Common/BackToTop';
import SherpaBot from './components/SherpaBot/SherpaBot';
import AlpineToolsSuite from './components/Tools/AlpineToolsSuite';
import AltitudeScrollIndicator from './components/Common/AltitudeScrollIndicator';
import KeyboardShortcutModal from './components/Common/KeyboardShortcutModal';
import LostClimberModal from './components/LostClimber404/LostClimberModal';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

export default function App() {
  // Modal states
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [luckyDrawModalOpen, setLuckyDrawModalOpen] = useState(false);
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
      setPlanModalOpen(false);
      setLuckyDrawModalOpen(false);
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
  const [activeSection, setActiveSection] = useState('destinations');

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

  // Scroll Reveal Observer
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
      const el = document.querySelector('#mountains') || document.querySelector('#experiences');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (type === 'guide') {
      const el = document.querySelector('#why-alpine-ascents') || document.querySelector('#guides');
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
                {/* Cinematic First-Load Sequence */}
                <CinematicLoader />

                {/* Desktop Clean Cursor */}
                <AlpineCursor />

                {/* Scroll progress indicator */}
                <ScrollProgress />

                {/* Vertical Altitude & Expedition Camps Scroll Indicator */}
                <AltitudeScrollIndicator />

                {/* Sticky Navigation Header with PLAN YOUR EXPEDITION CTA */}
                <Navbar
                  onOpenSearch={() => setSearchModalOpen(true)}
                  onOpenWishlist={() => setWishlistModalOpen(true)}
                  onOpenProfile={() => setProfileModalOpen(true)}
                  onOpenTripBuilder={() => setPlanModalOpen(true)}
                  onOpenQuiz={() => setQuizModalOpen(true)}
                  activeSection={activeSection}
                />

                {/* Interactive Summit Climb Progress HUD (Discrete Collapsed Pill) */}
                <ClimbSummitHUD
                  onOpenGames={() => {
                    const el = document.querySelector('#mini-games-hub');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                />

                <main>
                  {/* 1. HERO — Full-Bleed Video Background & Instant Booking CTA */}
                  <Hero
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                    onExploreClick={() => {
                      const el = document.querySelector('#destinations');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* 2. QUICK BOOKING / EXPEDITION SEARCH DOCK */}
                  <QuickSearchDock
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                    onFilterExpeditions={(params) => {
                      const el = document.querySelector('#expeditions');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />

                  {/* 3. DESTINATIONS STRIP / HORIZONTAL SHOWCASE */}
                  <DestinationExplorer
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                    onOpenTripBuilder={(destId) => handleOpenTripBuilder(destId)}
                  />

                  {/* 4. MOUNTAIN VISUAL SHOWCASE (Editorial / Asymmetric) */}
                  <MountainExplorer
                    onSelectMountain={(mountain) => {
                      const el = document.querySelector('#expeditions');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    onSelectPackage={(pkg) => setSelectedPackageModal(pkg)}
                  />

                  {/* 5. CHOOSE YOUR ADVENTURE (Category Strips) */}
                  <ChooseYourExperience
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                    onOpenTripBuilder={(destId) => handleOpenTripBuilder(destId)}
                  />

                  {/* 6. INTERACTIVE MAP (With telemetry & drawer) */}
                  <InteractiveMap
                    onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                  />

                  {/* 7. FAMILY MOUNTAIN ESCAPES (Visual promotional section) */}
                  <FamilyOffersSection
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />

                  {/* 8. SPECIAL EXPEDITION OFFERS (Horizontal offer rows) */}
                  <DiscountsSection
                    onOpenLuckyDraw={() => setLuckyDrawModalOpen(true)}
                  />

                  {/* 9. THE MOUNTAINS IN MOTION (Horizontal video reel + custom video player) */}
                  <DestinationVideo />

                  {/* 10. EXPEDITION PACKAGE EXPLORER (Large expandable rows / accordion style) */}
                  <PackageExplorer
                    onSelectPackage={(pkg) => setSelectedPackageModal(pkg)}
                    onOpenTripBuilder={(destId) => handleOpenTripBuilder(destId)}
                  />

                  {/* 11. CUSTOM EXPEDITION BUILDER (Step-by-step custom flow) */}
                  <ExpeditionBuilder
                    onRequestExpedition={handleRequestExpedition}
                  />

                  {/* 12. MEET YOUR EXPEDITION TEAM (Editorial layout + drawer) */}
                  <MeetOurGuides
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />

                  {/* 13. EXPEDITION TIMELINE (8-phase journey cycle) */}
                  <ExpeditionTimeline
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />

                  {/* 14. FINAL BOOKING CTA SECTION (High-impact conversion strip) */}
                  <FinalBookingCTA
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />

                  {/* Supporting Heritage, Safety & Storytelling Sections */}
                  <WhyAlpineAscents
                    onOpenPlanModal={() => setPlanModalOpen(true)}
                  />
                  <SuccessStories />
                  <JournalExplorer />
                  <GalleryExplorer />
                </main>

                {/* Multi-column Footer */}
                <Footer
                  onOpenProfile={() => setProfileModalOpen(true)}
                  onOpenWishlist={() => setWishlistModalOpen(true)}
                  onOpenTripBuilder={() => setPlanModalOpen(true)}
                />

                {/* Continuous Bottom Telemetry Ticker */}
                <Ticker />

                {/* Smooth Back to Top */}
                <BackToTop />

                {/* MODALS */}
                {/* 1. Dedicated 7-Step Plan Your Expedition Modal */}
                <PlanYourExpeditionModal
                  isOpen={planModalOpen}
                  onClose={() => setPlanModalOpen(false)}
                  onRequestManifest={(manifest) => {
                    setPlanModalOpen(false);
                    handleRequestExpedition(manifest);
                  }}
                  onOpenCustomBuilder={(destId) => {
                    setPlanModalOpen(false);
                    handleOpenTripBuilder(destId);
                  }}
                />

                {/* 2. Interactive Lucky Draw Campaign Modal */}
                <LuckyDrawModal
                  isOpen={luckyDrawModalOpen}
                  onClose={() => setLuckyDrawModalOpen(false)}
                  onApplyReward={(prize) => {
                    setLuckyDrawModalOpen(false);
                    setPlanModalOpen(true);
                  }}
                />

                {/* 3. Destination Detail Modal (With 10 Expandable Accordions) */}
                <DestinationDetailModal
                  destination={selectedDestinationModal}
                  isOpen={!!selectedDestinationModal}
                  onClose={() => setSelectedDestinationModal(null)}
                  onOpenTripBuilder={(destId) => {
                    setSelectedDestinationModal(null);
                    handleOpenTripBuilder(destId);
                  }}
                />

                {/* 4. Package Detail Modal */}
                <PackageDetailModal
                  pkg={selectedPackageModal}
                  isOpen={!!selectedPackageModal}
                  onClose={() => setSelectedPackageModal(null)}
                  onRequestExpedition={(pkg) => {
                    setSelectedPackageModal(null);
                    handleRequestExpedition(pkg);
                  }}
                />

                {/* 5. Official Trip Request Manifest Modal */}
                <TripRequestModal
                  initialTrip={activeTripForRequest}
                  isOpen={tripRequestModalOpen}
                  onClose={() => setTripRequestModalOpen(false)}
                />

                {/* 6. Alpine Safety Quiz Modal */}
                <AlpineQuizModal
                  isOpen={quizModalOpen}
                  onClose={() => {
                    setQuizModalOpen(false);
                    setProfileModalOpen(true);
                  }}
                />

                {/* 7. Summit Celebration Modal & Virtual Certificate */}
                <SummitCelebrationModal />
                <SummitCertificateModal />

                {/* 8. Global Search Modal */}
                <GlobalSearchModal
                  isOpen={searchModalOpen}
                  onClose={() => setSearchModalOpen(false)}
                  onSelectItem={handleSearchSelectItem}
                />

                {/* 9. Profile & Passport Dashboard */}
                <ProfileDashboard
                  isOpen={profileModalOpen}
                  onClose={() => setProfileModalOpen(false)}
                  onSelectPackage={(pkg) => setSelectedPackageModal(pkg)}
                  onSelectDestination={(dest) => setSelectedDestinationModal(dest)}
                />

                {/* 10. Wishlist Modal */}
                <WishlistModal
                  isOpen={wishlistModalOpen}
                  onClose={() => setWishlistModalOpen(false)}
                  onSelectItem={handleSearchSelectItem}
                />

                {/* 11. Keyboard Shortcuts Help Modal */}
                <KeyboardShortcutModal
                  isOpen={helpModalOpen}
                  onClose={() => setHelpModalOpen(false)}
                />

                {/* 12. Lost Climber Modal */}
                <LostClimberModal
                  isOpen={lostClimberModalOpen}
                  onClose={() => setLostClimberModalOpen(false)}
                  onReturnHome={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                />

                {/* Floating Alpine Sherpa — Expedition Assistant */}
                <SherpaBot />
              </GamificationProvider>
            </ToastProvider>
          </UserProfileProvider>
        </WishlistProvider>
      </ThemeProvider>
    </LanguageProvider>
  );
}
