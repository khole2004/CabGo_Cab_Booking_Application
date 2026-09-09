import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, isDriver } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface-container-lowest/90 backdrop-blur-xl border-b border-surface-container">
      <div className="h-20 max-w-container-max mx-auto px-gutter-desktop flex items-center justify-between gap-space-md">
        {/* Brand & Left Nav */}
        <div className="flex items-center gap-space-lg">
          <Link to="/" className="flex items-center gap-space-xs focus:outline-none">
            <img
              alt="CabGo Brand Logo"
              className="h-8 w-auto object-contain"
              src="/logo.svg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://lh3.googleusercontent.com/aida/AEtjO1UIIT3kRPL1eydxbJPQRUooLDd5EC107tizhB8e4Gsr16tAIULPFFscWPmNTKKrBgnpI7rKrasyVICyfq-1Ee9ffbFiLalwFdtGsuOAIs3OlpKSgT4Y62jrtNW7Zob05alA2skRkOSG3wuaYrpheo8E-4nTcIU0swXopDie8E9duJvwPCeaN30qbitYyjVZEZEuWpPw_ojQEg_RSr0eJlqIxHoZ7tazR6QRNdLdmY3KO4WOpUE0Ea12cn4';
              }}
            />
            <span className="font-headline-md text-headline-md text-on-surface tracking-tight">
              Cab<span className="text-primary-container">Go</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-space-xs">
            <Link
              to="/"
              className={`px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg ${
                isActive('/')
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Home
            </Link>
            <Link
              to="/book-a-cab"
              className={`px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg ${
                isActive('/book-a-cab')
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Book a Cab
            </Link>
            <Link
              to="/my-bookings"
              className={`px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg ${
                isActive('/my-bookings')
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              My Bookings
            </Link>
            <Link
              to="/tracking/CG-849201"
              className={`px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg ${
                location.pathname.startsWith('/tracking')
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
              }`}
            >
              Track Ride
            </Link>
            {isDriver ? (
              <Link
                to="/driver"
                className={`px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg ${
                  isActive('/driver')
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Driver Console
              </Link>
            ) : (
              <Link
                to="/hub"
                className={`px-space-sm py-space-xs transition-colors rounded-lg font-label-lg text-label-lg ${
                  isActive('/hub')
                    ? 'bg-surface-container-high text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                }`}
              >
                Passenger Hub
              </Link>
            )}
          </nav>
        </div>

        {/* Right Nav Action Area */}
        <div className="flex items-center gap-space-sm sm:gap-space-md">
          {isAuthenticated ? (
            <>
              <Link
                to="/book-a-cab"
                className="hidden sm:flex items-center gap-space-xs bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-lg text-label-lg px-space-md py-space-xs rounded-full shadow-[0_4px_20px_-2px_rgba(15,23,42,0.05)] transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                <span>Quick Ride</span>
              </Link>

              <button
                aria-label="Notifications"
                className="relative p-space-xs rounded-full text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low transition-colors"
                type="button"
              >
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-primary-container"></span>
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-space-xs pl-space-xs focus:outline-none cursor-pointer"
                >
                  <img
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-surface-container"
                    src={
                      user?.avatarUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwFqZF72JxhjJ08j7W6V6Pc3TPexzy3AmvJg2rKzayewadm7MrF_V1wR0ui5d1WmLCFoNmGHKxRP-3mgxqh0T0Es_Gpuig3up84ccVIITHmU_RiSvf6kNETZSrPuUGKPKpyhF6cUV1wkDHtUX1ibuPngoXRZB48Svha7EarUeNxvj-PHOWOj7h__4CdiJIh-vExE4SK0qno0SOSFWgUyMJAHn24nYcXjXTTVmpFnkdNO41eGQJpv_d'
                    }
                  />
                  <div className="hidden md:flex flex-col text-left leading-tight">
                    <span className="font-label-sm text-label-sm text-on-surface font-semibold">
                      {user?.fullName || 'My Account'}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                      {isDriver ? 'Driver Partner' : 'Passenger'}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                    expand_more
                  </span>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container py-2 z-50">
                    <div className="px-4 py-2 border-b border-surface-container">
                      <p className="font-label-md text-label-md text-on-surface font-bold">{user?.fullName}</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant truncate">{user?.email}</p>
                      {user?.walletBalance !== undefined && (
                        <p className="font-label-sm text-label-sm text-primary font-bold mt-1">
                          Wallet: ₹{Number(user.walletBalance).toFixed(2)}
                        </p>
                      )}
                    </div>
                    {isDriver ? (
                      <Link
                        to="/driver"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">dashboard</span>
                        Driver Dashboard
                      </Link>
                    ) : (
                      <Link
                        to="/hub"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        Passenger Hub
                      </Link>
                    )}
                    <Link
                      to="/my-bookings"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 font-label-md text-on-surface hover:bg-surface-container-low transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">history</span>
                      My Bookings
                    </Link>
                    <div className="my-1 border-t border-surface-container"></div>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2 px-4 py-2 font-label-md text-error hover:bg-error-container/20 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-space-xs">
              <Link
                to="/login"
                className="font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low px-space-sm py-space-xs rounded-lg transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="font-label-lg text-label-lg bg-surface-container hover:bg-surface-container-high text-on-surface px-space-md py-space-xs rounded-full transition-colors"
              >
                Register
              </Link>
              <Link
                to="/book-a-cab"
                className="hidden sm:flex items-center gap-space-xs bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-lg text-label-lg px-space-md py-space-xs rounded-full shadow-sm ml-2 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                <span>Quick Ride</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}