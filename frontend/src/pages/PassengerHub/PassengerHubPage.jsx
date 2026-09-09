import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { bookingService } from '../../services/bookingService';
import { userService } from '../../services/userService';

export default function PassengerHubPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [savedLocations, setSavedLocations] = useState([]);
  const [quickDestination, setQuickDestination] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [bookingsData, locationsData] = await Promise.all([
          bookingService.getMyBookings(),
          userService.getSavedLocations(),
        ]);
        setBookings(bookingsData);
        setSavedLocations(locationsData);
      } catch (err) {
        console.error('Failed to load hub data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickSearch = (e) => {
    e.preventDefault();
    if (quickDestination.trim()) {
      navigate(`/book-a-cab?dropoff=${encodeURIComponent(quickDestination.trim())}`);
    } else {
      navigate('/book-a-cab');
    }
  };

  const handleBookToLocation = (address) => {
    navigate(`/book-a-cab?dropoff=${encodeURIComponent(address)}`);
  };

  const activeBooking = bookings.find(
    (b) => b.status === 'DRIVER_ARRIVING' || b.status === 'IN_PROGRESS' || b.status === 'DRIVER_ASSIGNED'
  ) || bookings[0];

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
            {/* Left Sidebar (3 cols) */}
            <aside className="lg:col-span-3 flex flex-col gap-space-lg">
              {/* Profile Card */}
              <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col items-center text-center">
                <div className="relative mb-space-xs">
                  <img
                    alt="Passenger Profile"
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-surface-container"
                    src={
                      user?.avatarUrl ||
                      'https://lh3.googleusercontent.com/aida-public/AB6AXuDwFqZF72JxhjJ08j7W6V6Pc3TPexzy3AmvJg2rKzayewadm7MrF_V1wR0ui5d1WmLCFoNmGHKxRP-3mgxqh0T0Es_Gpuig3up84ccVIITHmU_RiSvf6kNETZSrPuUGKPKpyhF6cUV1wkDHtUX1ibuPngoXRZB48Svha7EarUeNxvj-PHOWOj7h__4CdiJIh-vExE4SK0qno0SOSFWgUyMJAHn24nYcXjXTTVmpFnkdNO41eGQJpv_d'
                    }
                  />
                  <span className="absolute bottom-0 right-0 w-5 h-5 rounded-full bg-primary-container border-2 border-surface-container-lowest flex items-center justify-center text-on-primary-container text-[12px]">
                    ★
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  {user?.fullName || 'Ananya Sharma'}
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant">{user?.email || 'ananya@example.com'}</p>
                <div className="flex items-center gap-1.5 mt-2 bg-surface-container-low px-3 py-1 rounded-full text-label-sm font-semibold">
                  <span className="text-primary font-bold">★ {user?.rating || '4.98'}</span>
                  <span className="text-on-surface-variant">• Verified Passenger</span>
                </div>
              </div>

              {/* Navigation Menu */}
              <div className="bg-surface-container-lowest p-space-sm rounded-2xl shadow-sm border border-surface-container flex flex-col gap-1">
                <Link
                  to="/my-bookings"
                  className="flex items-center justify-between px-space-sm py-2.5 rounded-xl hover:bg-surface-container-low transition-colors font-label-lg text-on-surface"
                >
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">calendar_month</span>
                    <span>My Bookings</span>
                  </div>
                  <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-2 py-0.5 rounded-full font-bold">
                    {bookings.length}
                  </span>
                </Link>

                <div className="flex items-center justify-between px-space-sm py-2.5 rounded-xl hover:bg-surface-container-low transition-colors font-label-lg text-on-surface cursor-pointer">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">account_balance_wallet</span>
                    <span>Wallet & Passes</span>
                  </div>
                  <span className="font-label-sm text-primary font-bold">
                    ₹{Number(user?.walletBalance || 1250).toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between px-space-sm py-2.5 rounded-xl hover:bg-surface-container-low transition-colors font-label-lg text-on-surface cursor-pointer">
                  <div className="flex items-center gap-space-sm">
                    <span className="material-symbols-outlined text-secondary text-[20px]">bookmark</span>
                    <span>Saved Locations</span>
                  </div>
                  <span className="font-label-sm text-secondary">{savedLocations.length}</span>
                </div>

                <div className="my-1 border-t border-surface-container"></div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="flex items-center gap-space-sm px-space-sm py-2.5 rounded-xl text-error hover:bg-error-container/20 transition-colors font-label-lg text-left w-full"
                >
                  <span className="material-symbols-outlined text-[20px]">logout</span>
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Eco Impact Badge */}
              <div className="bg-surface-container-high p-space-md rounded-2xl flex flex-col gap-space-xs">
                <div className="flex items-center gap-space-xs text-primary">
                  <span className="material-symbols-outlined text-[20px]">electric_car</span>
                  <span className="font-label-lg text-label-lg font-bold">EV Commute Hero</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface">
                  You cut <strong className="font-bold">14.8 kg CO₂</strong> this month choosing CabGo Green fleets.
                </p>
                <div className="w-full bg-surface-container-lowest h-2 rounded-full overflow-hidden mt-space-2xs">
                  <div className="bg-primary-container h-full rounded-full w-3/4"></div>
                </div>
                <span className="font-label-sm text-label-sm text-secondary text-right">75% to Level 4 Badge</span>
              </div>
            </aside>

            {/* Main Workspace (9 cols) */}
            <div className="lg:col-span-9 flex flex-col gap-space-lg">
              {/* 1. Welcome Banner with Quick Search */}
              <div className="relative overflow-hidden bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container p-space-lg md:p-space-xl flex flex-col md:flex-row md:items-center justify-between gap-space-md">
                <div className="flex flex-col gap-space-2xs relative z-10">
                  <div className="flex items-center gap-space-xs">
                    <span className="px-space-xs py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-semibold">
                      Passenger Status: Active
                    </span>
                    <span className="text-secondary font-body-sm text-body-sm">• Delhi NCR Corridor</span>
                  </div>
                  <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">
                    Welcome back, {user?.fullName?.split(' ')[0] || 'Ananya'}! 👋
                  </h1>
                  <p className="font-body-lg text-body-lg text-on-surface-variant">
                    Where are you heading today? Traffic is normal across South Delhi & Gurugram corridors.
                  </p>
                </div>

                <form onSubmit={handleQuickSearch} className="relative z-10 flex w-full md:w-auto items-center gap-2">
                  <input
                    type="text"
                    value={quickDestination}
                    onChange={(e) => setQuickDestination(e.target.value)}
                    placeholder="Enter destination..."
                    className="h-12 px-4 rounded-xl bg-surface-container-low text-on-surface font-body-md border border-surface-container outline-none focus:ring-2 focus:ring-on-surface w-full md:w-64"
                  />
                  <button
                    type="submit"
                    className="h-12 px-5 bg-primary-container hover:bg-tertiary-container text-on-primary-container rounded-xl font-label-lg font-bold flex items-center gap-1.5 shadow-sm transition-all shrink-0"
                  >
                    <span>Go</span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                </form>
              </div>

              {/* 2. Active Ride Spotlight Card */}
              {activeBooking && activeBooking.status !== 'COMPLETED' && activeBooking.status !== 'CANCELLED' && (
                <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-md border-2 border-primary-container relative overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
                      </span>
                      <span className="font-label-sm text-label-sm uppercase font-bold text-primary tracking-wider">
                        Ongoing Trip #{activeBooking.bookingReference}
                      </span>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm text-label-sm font-bold">
                      {activeBooking.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md items-center">
                    <div className="md:col-span-8 flex flex-col gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary-container">
                          <span className="material-symbols-outlined">local_taxi</span>
                        </div>
                        <div>
                          <p className="font-headline-sm text-headline-sm text-on-surface font-bold">
                            {activeBooking.pickupAddress} → {activeBooking.dropoffAddress}
                          </p>
                          <p className="font-body-sm text-body-sm text-on-surface-variant">
                            Driver: {activeBooking.driver?.fullName || 'Rajesh Kumar'} • {activeBooking.driver?.vehiclePlateNumber || 'DL 01 AX 4892'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-4 flex items-center justify-end gap-3">
                      <div className="text-right">
                        <span className="font-headline-md text-headline-md font-bold text-on-surface">
                          ₹{activeBooking.totalFare?.toFixed(2)}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant block">Locked Fare</span>
                      </div>
                      <Link
                        to={`/tracking/${activeBooking.bookingReference}`}
                        className="px-4 py-2.5 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
                      >
                        <span>Open Telemetry</span>
                        <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                      </Link>
                    </div>
                  </div>
                </div>
              )}

              {/* 3. Saved Places Carousel */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between px-space-xs">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Saved Places</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Instant 1-Tap Booking</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                  {savedLocations.map((loc) => (
                    <div
                      key={loc.id}
                      className="p-space-md rounded-2xl bg-surface-container-lowest border border-surface-container hover:border-primary-container transition-all flex flex-col justify-between"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">{loc.icon}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-headline-sm text-headline-sm text-on-surface">{loc.title}</h4>
                          <p className="font-body-sm text-body-sm text-on-surface-variant truncate mt-0.5">{loc.address}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBookToLocation(loc.address)}
                        className="mt-3 w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface font-label-sm text-label-sm font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">local_taxi</span>
                        <span>Book Ride Here</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recent Ride History */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container">
                <div className="flex items-center justify-between mb-space-md">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Recent Trips</h3>
                  <Link to="/my-bookings" className="font-label-sm text-primary font-bold hover:underline">
                    View All History
                  </Link>
                </div>

                {loading ? (
                  <div className="py-6 text-center">
                    <div className="w-6 h-6 border-2 border-primary-container border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : bookings.length === 0 ? (
                  <p className="text-on-surface-variant text-sm py-4">No recent trips yet.</p>
                ) : (
                  <div className="flex flex-col divide-y divide-surface-container">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center text-on-surface shrink-0 mt-0.5">
                            <span className="material-symbols-outlined text-[20px]">directions_car</span>
                          </div>
                          <div>
                            <p className="font-label-lg text-label-lg text-on-surface font-semibold">
                              {b.pickupAddress} → {b.dropoffAddress}
                            </p>
                            <p className="font-body-sm text-body-sm text-on-surface-variant">
                              {new Date(b.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit',
                              })} • {b.vehicleClassCode}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 self-end sm:self-center">
                          <div className="text-right">
                            <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                              ₹{b.totalFare?.toFixed(2)}
                            </span>
                            <span className="font-label-sm text-label-sm text-emerald-700 block font-semibold">
                              {b.status}
                            </span>
                          </div>
                          <Link
                            to={`/book-a-cab?pickup=${encodeURIComponent(b.pickupAddress)}&dropoff=${encodeURIComponent(b.dropoffAddress)}`}
                            className="px-3 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface font-label-sm font-semibold transition-colors"
                          >
                            Rebook
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}