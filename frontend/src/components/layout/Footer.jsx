import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container mt-auto">
      <div className="max-w-container-max mx-auto px-gutter-desktop py-space-2xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-xl">
          {/* Brand Col */}
          <div className="flex flex-col gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <img
                alt="CabGo Brand Logo"
                className="h-7 w-auto object-contain"
                src="/logo.svg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://lh3.googleusercontent.com/aida/AEtjO1UIIT3kRPL1eydxbJPQRUooLDd5EC107tizhB8e4Gsr16tAIULPFFscWPmNTKKrBgnpI7rKrasyVICyfq-1Ee9ffbFiLalwFdtGsuOAIs3OlpKSgT4Y62jrtNW7Zob05alA2skRkOSG3wuaYrpheo8E-4nTcIU0swXopDie8E9duJvwPCeaN30qbitYyjVZEZEuWpPw_ojQEg_RSr0eJlqIxHoZ7tazR6QRNdLdmY3KO4WOpUE0Ea12cn4';
                }}
              />
              <span className="font-headline-sm text-headline-sm text-on-surface">
                Cab<span className="text-primary-container">Go</span>
              </span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Next-generation urban mobility and reliable ride-hailing engineered for frictionless daily transit.
            </p>
            <div className="flex items-center gap-space-xs text-on-surface-variant">
              <a aria-label="Share" className="p-space-xs rounded-full hover:bg-surface-container-low hover:text-on-surface transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">share</span>
              </a>
              <a aria-label="Explore" className="p-space-xs rounded-full hover:bg-surface-container-low hover:text-on-surface transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">travel_explore</span>
              </a>
              <a aria-label="RSS" className="p-space-xs rounded-full hover:bg-surface-container-low hover:text-on-surface transition-colors" href="#">
                <span className="material-symbols-outlined text-[20px]">rss_feed</span>
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-2xs">Company</h4>
            <Link to="/" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              About CabGo
            </Link>
            <Link to="/book-a-cab" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Ride Options & Fares
            </Link>
            <Link to="/register" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Careers & Driver Partners
            </Link>
            <a href="#" className="font-body-sm text-body-sm text-on-surface-variant hover:text-on-surface transition-colors">
              Newsroom & Media
            </a>
          </div>

          {/* Safety Pledge */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-2xs">Ride Safety Pledge</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Every trip is monitored 24/7 with GPS telemetry, background-checked verified captains, and one-tap emergency escalation.
            </p>
            <div className="flex items-center gap-space-xs text-on-surface mt-space-2xs">
              <span className="material-symbols-outlined text-primary-container text-[20px]">verified_user</span>
              <span className="font-label-sm text-label-sm text-on-surface">Zero-Compromise Safety Standard</span>
            </div>
          </div>

          {/* Emergency Hotline */}
          <div className="flex flex-col gap-space-xs">
            <h4 className="font-headline-sm text-headline-sm text-on-surface mb-space-2xs">Emergency Hotline</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              24/7 Priority Emergency & Incident Support
            </p>
            <div className="flex items-center gap-space-xs mt-space-2xs bg-error-container text-on-error-container px-space-md py-space-xs rounded-xl w-fit">
              <span className="material-symbols-outlined text-[20px]">sos</span>
              <span className="font-headline-sm text-headline-sm">+1 (800) 555-CABGO</span>
            </div>
            <span className="font-label-sm text-label-sm text-on-surface-variant mt-space-xs">
              Available round the clock for in-transit riders
            </span>
          </div>
        </div>

        <div className="mt-space-2xl pt-space-lg border-t border-surface-container flex flex-col sm:flex-row items-center justify-between gap-space-md font-body-sm text-body-sm text-on-surface-variant">
          <span>© 2026 CabGo Technologies Inc. All rights reserved.</span>
          <div className="flex items-center gap-space-lg">
            <a className="hover:text-on-surface transition-colors" href="#">Privacy Policy</a>
            <a className="hover:text-on-surface transition-colors" href="#">Terms of Service</a>
            <a className="hover:text-on-surface transition-colors" href="#">Cookie Preferences</a>
          </div>
        </div>
      </div>
    </footer>
  );
}