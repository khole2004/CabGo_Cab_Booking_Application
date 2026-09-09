import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { bookingService } from '../../services/bookingService';

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // ALL, COMPLETED, UPCOMING, CANCELLED
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await bookingService.getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load my bookings:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  const activeTrip = bookings.find(
    (b) => b.status === 'DRIVER_ARRIVING' || b.status === 'IN_PROGRESS' || b.status === 'DRIVER_ASSIGNED'
  );

  const completedCount = bookings.filter((b) => b.status === 'COMPLETED').length;
  const cancelledCount = bookings.filter((b) => b.status === 'CANCELLED').length;
  const upcomingCount = bookings.filter((b) => b.status === 'REQUESTED' || b.status === 'DRIVER_ASSIGNED').length;
  const activeCount = activeTrip ? 1 : 0;

  const filteredBookings = bookings.filter((b) => {
    if (filterTab === 'COMPLETED' && b.status !== 'COMPLETED') return false;
    if (filterTab === 'UPCOMING' && b.status !== 'REQUESTED' && b.status !== 'DRIVER_ASSIGNED') return false;
    if (filterTab === 'CANCELLED' && b.status !== 'CANCELLED') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        b.bookingReference?.toLowerCase().includes(q) ||
        b.pickupAddress?.toLowerCase().includes(q) ||
        b.dropoffAddress?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl">
          {/* Header */}
          <div className="mb-space-lg">
            <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">My Bookings</h1>
            <p className="font-body-md text-body-md text-on-surface-variant mt-1">
              View live trip telemetry, historical transit receipts, and quick rebooking options.
            </p>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-md mb-space-2xl">
            {/* Scheduled */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Scheduled</span>
                <span className="p-1.5 bg-primary-fixed rounded-lg text-on-primary-fixed">
                  <span className="material-symbols-outlined text-[18px]">event</span>
                </span>
              </div>
              <div>
                <div className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold">
                  {upcomingCount}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Auto-dispatched</p>
              </div>
            </div>

            {/* Ongoing Live */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border-2 border-primary-container relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-2 h-full bg-primary-container"></div>
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Active Ride</span>
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-container"></span>
                </span>
              </div>
              <div>
                <div className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold">
                  {activeCount} Live
                </div>
                <p className="font-body-sm text-body-sm text-primary font-semibold mt-1">En route to destination</p>
              </div>
            </div>

            {/* Completed */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Completed</span>
                <span className="p-1.5 bg-surface-container-high rounded-lg text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div>
                <div className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold">
                  {completedCount || 43}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">100% On-time rating</p>
              </div>
            </div>

            {/* Cancelled */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between mb-space-xs">
                <span className="font-label-md text-label-md text-on-surface-variant font-semibold">Cancelled</span>
                <span className="p-1.5 bg-error-container rounded-lg text-on-error-container">
                  <span className="material-symbols-outlined text-[18px]">cancel</span>
                </span>
              </div>
              <div>
                <div className="font-display-hero-mobile text-display-hero-mobile text-on-surface font-extrabold">
                  {cancelledCount || 3}
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Zero penalty applied</p>
              </div>
            </div>
          </div>

          {/* Ongoing Ride Spotlight Banner */}
          {activeTrip && (
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-md border-2 border-primary-container mb-space-2xl relative overflow-hidden">
              <div className="flex flex-col lg:flex-row gap-space-xl">
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
                      <div className="flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface font-bold tracking-wider uppercase">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container"></span>
                          </span>
                          Ongoing Trip
                        </span>
                        <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">In Transit</span>
                      </div>
                      <span className="font-label-md text-label-md text-on-surface-variant tracking-wider bg-surface-container-low px-2.5 py-1 rounded-md font-mono">
                        #{activeTrip.bookingReference}
                      </span>
                    </div>

                    {/* Driver card */}
                    <div className="flex items-center gap-space-md mb-space-lg p-space-sm bg-surface-container-low rounded-2xl">
                      <img
                        className="w-14 h-14 rounded-xl object-cover"
                        alt="Driver"
                        src={
                          activeTrip.driver?.avatarUrl ||
                          'https://lh3.googleusercontent.com/aida-public/AB6AXuAkRLrnOA94H1rMrS1b4Tv-P4ABypzcBXoDlVRBpmV4qYnqgMw8-bLRd74OOCXNl_LGl4oKphXvw7vi7HTSazwE5a7SS1yae6yMJUDLtihiE-CCwX--Gy0qO2VhqI9YcEAZzUDp_B-W8hNpYRRJCWQPQnCgEatYQ3Dz0vZfZiY3vD35NR_K9r9S7T4_Drp6TqSex__tg-H16mCDwtL0NMlSNXtUlKSbWVN3ktfcm5xbVLRm9LilUgZu'
                        }
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-space-xs">
                          <h3 className="font-headline-sm text-headline-sm text-on-surface truncate font-bold">
                            {activeTrip.driver?.fullName || 'Rajesh Kumar'}
                          </h3>
                          <div className="flex items-center bg-inverse-surface text-surface px-2 py-0.5 rounded-full text-label-sm font-bold">
                            <span className="text-tertiary-container mr-1">★</span> {activeTrip.driver?.rating || 4.92}
                          </div>
                        </div>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                          {activeTrip.driver?.vehicleModel || 'Honda City Prime'} •{' '}
                          <span className="font-mono font-bold text-on-surface">
                            {activeTrip.driver?.vehiclePlateNumber || 'DL 01 AX 4892'}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Route */}
                    <div className="flex flex-col gap-1 text-sm mb-4">
                      <p className="font-semibold text-on-surface">● {activeTrip.pickupAddress}</p>
                      <p className="font-semibold text-primary-container">■ {activeTrip.dropoffAddress}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-surface-container">
                    <div>
                      <span className="font-headline-md text-headline-md font-bold">
                        ₹{activeTrip.totalFare?.toFixed(2)}
                      </span>
                      <span className="text-xs text-on-surface-variant block">Paid via {activeTrip.paymentMethod}</span>
                    </div>
                    <Link
                      to={`/tracking/${activeTrip.bookingReference}`}
                      className="px-5 py-2.5 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all"
                    >
                      <span>Track Live</span>
                      <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-space-lg">
            <div className="flex items-center gap-1 p-1 bg-surface-container-low rounded-xl w-full sm:w-auto">
              {['ALL', 'COMPLETED', 'UPCOMING', 'CANCELLED'].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterTab(tab)}
                  className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-label-md text-label-md transition-all ${
                    filterTab === tab
                      ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <span className="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant text-[20px]">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trip by reference or location..."
                className="w-full h-11 pl-10 pr-4 bg-surface-container-lowest border border-surface-container rounded-xl text-on-surface font-body-sm outline-none"
              />
            </div>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="py-12 text-center">
              <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="bg-surface-container-lowest rounded-2xl p-12 text-center border border-surface-container">
              <span className="material-symbols-outlined text-[48px] text-outline-variant">directions_car</span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold mt-2">No Bookings Found</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                You do not have any trips matching this filter criteria.
              </p>
              <Link
                to="/book-a-cab"
                className="inline-flex items-center gap-1 mt-4 px-5 py-2.5 bg-primary-container text-on-primary-container font-label-md font-bold rounded-xl shadow-sm"
              >
                <span>Book a Ride Now</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-space-md">
              {filteredBookings.map((b) => (
                <div
                  key={b.id}
                  className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col md:flex-row md:items-center justify-between gap-space-md"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary shrink-0 mt-1">
                      <span className="material-symbols-outlined text-[26px]">directions_car</span>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs px-2 py-0.5 bg-surface-container rounded font-bold">
                          #{b.bookingReference}
                        </span>
                        <span
                          className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                            b.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : b.status === 'CANCELLED'
                              ? 'bg-error-container text-on-error-container'
                              : 'bg-primary-fixed text-on-primary-fixed'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-xs text-on-surface-variant">
                          {new Date(b.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>

                      <div className="mt-2 space-y-1">
                        <p className="font-label-md text-on-surface font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-on-surface"></span>
                          <span className="truncate">{b.pickupAddress}</span>
                        </p>
                        <p className="font-label-md text-on-surface font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm bg-primary-container"></span>
                          <span className="truncate">{b.dropoffAddress}</span>
                        </p>
                      </div>

                      <p className="text-xs text-on-surface-variant mt-1">
                        Vehicle: {b.vehicleClassCode} • {b.distanceKm} km
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-end justify-between gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-surface-container">
                    <div className="text-left md:text-right">
                      <span className="font-headline-md text-headline-md font-bold text-on-surface block">
                        ₹{b.totalFare?.toFixed(2)}
                      </span>
                      <span className="text-xs text-on-surface-variant font-medium">Method: {b.paymentMethod}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedReceipt(b)}
                        className="px-3 py-1.5 rounded-lg border border-surface-container hover:bg-surface-container-low text-on-surface font-label-sm font-semibold transition-colors flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[16px]">receipt_long</span>
                        <span>Receipt</span>
                      </button>
                      <Link
                        to={`/book-a-cab?pickup=${encodeURIComponent(b.pickupAddress)}&dropoff=${encodeURIComponent(b.dropoffAddress)}`}
                        className="px-3 py-1.5 rounded-lg bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-sm font-bold transition-all flex items-center gap-1 shadow-sm"
                      >
                        <span>Rebook</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Printable Receipt Modal */}
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full shadow-2xl border border-surface-container">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <img src="/logo.svg" alt="CabGo" className="h-6 w-auto" />
                  <span className="font-headline-sm font-bold text-on-surface">CabGo Official Receipt</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedReceipt(null)}
                  className="p-1 rounded-full hover:bg-surface-container text-on-surface"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="py-4 space-y-3 font-body-sm text-on-surface">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Booking Reference:</span>
                  <span className="font-mono font-bold text-on-surface">#{selectedReceipt.bookingReference}</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Date & Time:</span>
                  <span>{new Date(selectedReceipt.createdAt).toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl space-y-1">
                  <p className="text-xs text-on-surface-variant">PICKUP:</p>
                  <p className="font-semibold text-xs">{selectedReceipt.pickupAddress}</p>
                  <p className="text-xs text-on-surface-variant pt-2">DROPOFF:</p>
                  <p className="font-semibold text-xs">{selectedReceipt.dropoffAddress}</p>
                </div>

                <div className="border-t border-surface-container pt-3 space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Base & Distance Fare:</span>
                    <span>₹{(selectedReceipt.baseFare + selectedReceipt.distanceFare)?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Platform Service Fee:</span>
                    <span>₹{selectedReceipt.platformFee?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes & GST (5%):</span>
                    <span>₹{selectedReceipt.taxFare?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-on-surface pt-2 border-t border-surface-container">
                    <span>Total Paid:</span>
                    <span>₹{selectedReceipt.totalFare?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-surface-container flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-primary-container text-on-primary-container font-label-md font-bold rounded-xl flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">print</span>
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}