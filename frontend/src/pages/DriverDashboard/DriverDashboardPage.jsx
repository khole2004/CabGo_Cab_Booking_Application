import React, { useState, useEffect } from 'react';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { useAuth } from '../../context/AuthContext';
import { driverService } from '../../services/driverService';
import { bookingService } from '../../services/bookingService';

export default function DriverDashboardPage() {
  const { user } = useAuth();
  const [driver, setDriver] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [incomingTrips, setIncomingTrips] = useState([]);
  const [activeTrip, setActiveTrip] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDriverData() {
      try {
        const profile = await driverService.getProfile();
        setDriver(profile);
        setIsOnline(profile.isOnline ?? true);

        const trips = await driverService.getIncomingRequests();
        // Check if there is an active assigned trip
        const currentActive = trips.find(
          (t) => t.status === 'DRIVER_ARRIVING' || t.status === 'IN_PROGRESS' || t.status === 'DRIVER_ASSIGNED'
        );
        if (currentActive) {
          setActiveTrip(currentActive);
        } else if (trips.length > 0) {
          setIncomingTrips(trips);
        } else {
          // Default mock incoming request matching Stitch design
          setIncomingTrips([
            {
              id: 99,
              bookingReference: 'CG-984210',
              passengerName: 'Ananya Sharma',
              pickupAddress: 'Terminal 3, IGI Airport (Pillar 14)',
              dropoffAddress: 'DLF Cyber Hub, Building 8C',
              distanceKm: 14.8,
              durationMinutes: 28,
              totalFare: 480.0,
              otpCode: '4892',
              status: 'REQUESTED',
            },
          ]);
        }
      } catch {
        // Mock fallback for driver state
        setDriver({
          fullName: user?.fullName || 'Rajesh Kumar',
          vehicleModel: 'Honda City / Hyundai Verna',
          vehiclePlateNumber: 'DL 01 AX 4892',
          todayEarnings: 2480.0,
          completedTripsToday: 8,
          acceptanceRate: 96.2,
          rating: 4.96,
          isOnline: true,
        });
        setIncomingTrips([
          {
            id: 99,
            bookingReference: 'CG-984210',
            passengerName: 'Ananya Sharma',
            pickupAddress: 'Terminal 3, IGI Airport (Pillar 14)',
            dropoffAddress: 'DLF Cyber Hub, Building 8C',
            distanceKm: 14.8,
            durationMinutes: 28,
            totalFare: 480.0,
            otpCode: '4892',
            status: 'REQUESTED',
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
    loadDriverData();
  }, [user]);

  const handleToggleOnline = async () => {
    const nextState = !isOnline;
    setIsOnline(nextState);
    try {
      await driverService.updateStatus({ isOnline: nextState });
    } catch (err) {
      console.error('Failed to update online status:', err);
    }
  };

  const handleAcceptTrip = async (trip) => {
    try {
      if (trip.id !== 99) {
        await bookingService.updateStatus(trip.id, 'DRIVER_ARRIVING');
      }
      setActiveTrip({ ...trip, status: 'DRIVER_ARRIVING' });
      setIncomingTrips((prev) => prev.filter((t) => t.id !== trip.id));
    } catch {
      setActiveTrip({ ...trip, status: 'DRIVER_ARRIVING' });
      setIncomingTrips([]);
    }
  };

  const handleStartTripWithOtp = async () => {
    setOtpError('');
    if (otpInput.trim() !== activeTrip.otpCode) {
      setOtpError('Invalid OTP pin! Please verify with passenger.');
      return;
    }

    try {
      if (activeTrip.id !== 99) {
        await bookingService.updateStatus(activeTrip.id, 'IN_PROGRESS', otpInput.trim());
      }
      setActiveTrip((prev) => ({ ...prev, status: 'IN_PROGRESS' }));
      setOtpInput('');
    } catch (err) {
      setOtpError(err.message || 'Verification failed');
    }
  };

  const handleCompleteTrip = async () => {
    try {
      if (activeTrip.id !== 99) {
        await bookingService.updateStatus(activeTrip.id, 'COMPLETED');
      }
      setDriver((prev) => ({
        ...prev,
        todayEarnings: (prev?.todayEarnings || 2480) + (activeTrip.totalFare || 480),
        completedTripsToday: (prev?.completedTripsToday || 8) + 1,
      }));
      setActiveTrip(null);
      alert('Trip completed! Fare added to your earnings.');
    } catch {
      setActiveTrip(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl">
          {/* Top Driver Status Bar */}
          <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-wrap items-center justify-between gap-space-md mb-space-xl">
            <div className="flex items-center gap-space-md">
              <div className="relative">
                <img
                  alt="Driver Avatar"
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-container"
                  src={
                    user?.avatarUrl ||
                    'https://lh3.googleusercontent.com/aida-public/AB6AXuAkRLrnOA94H1rMrS1b4Tv-P4ABypzcBXoDlVRBpmV4qYnqgMw8-bLRd74OOCXNl_LGl4oKphXvw7vi7HTSazwE5a7SS1yae6yMJUDLtihiE-CCwX--Gy0qO2VhqI9YcEAZzUDp_B-W8hNpYRRJCWQPQnCgEatYQ3Dz0vZfZiY3vD35NR_K9r9S7T4_Drp6TqSex__tg-H16mCDwtL0NMlSNXtUlKSbWVN3ktfcm5xbVLRm9LilUgZu'
                  }
                />
                <span
                  className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-surface-container-lowest ${
                    isOnline ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></span>
              </div>
              <div>
                <h1 className="font-headline-md text-headline-md text-on-surface font-bold">
                  {driver?.fullName || user?.fullName || 'Rajesh Kumar'}
                </h1>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  {driver?.vehicleModel || 'Honda City Prime'} •{' '}
                  <span className="font-mono font-bold text-on-surface">
                    {driver?.vehiclePlateNumber || 'DL 01 AX 4892'}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-space-sm">
              <div className="px-3 py-1.5 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px]">trending_up</span>
                <span>1.4x Surge Active (IGI & Cyber Hub)</span>
              </div>

              {/* Online/Offline Button Switch */}
              <button
                type="button"
                onClick={handleToggleOnline}
                className={`px-5 py-2 rounded-full font-label-md font-bold transition-all shadow-sm flex items-center gap-2 ${
                  isOnline
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-surface-container-high text-on-surface hover:bg-surface-container'
                }`}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></span>
                <span>{isOnline ? 'Online (Accepting Rides)' : 'Offline'}</span>
              </button>
            </div>
          </div>

          {/* 5 KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-space-md mb-space-2xl">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Today's Gross
                </span>
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">payments</span>
                </span>
              </div>
              <div className="mt-3">
                <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                  ₹{Number(driver?.todayEarnings || 2480).toFixed(2)}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="inline-flex items-center font-label-sm text-label-sm text-primary font-bold">
                    <span className="material-symbols-outlined text-[14px]">arrow_upward</span> +18.4%
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">vs yesterday</span>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Completed Trips
                </span>
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                    {driver?.completedTripsToday || 8}
                  </span>
                  <span className="font-label-lg text-label-lg text-on-surface-variant">/ 10 trips</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 bg-surface-container-highest rounded-full h-1.5 overflow-hidden">
                    <div className="bg-primary-container h-1.5 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="font-label-sm text-label-sm text-primary font-bold">₹300 bonus</span>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Acceptance Rate
                </span>
                <span className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[18px]">verified</span>
                </span>
              </div>
              <div className="mt-3">
                <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                  {driver?.acceptanceRate || '96.2'}%
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-full bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-semibold">
                    Gold Partner
                  </span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Top 5%</span>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Driver Rating
                </span>
                <span className="w-8 h-8 rounded-lg bg-tertiary-fixed flex items-center justify-center text-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-[18px]">star</span>
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="font-headline-xl text-headline-xl text-on-surface tracking-tight font-bold">
                    {driver?.rating || '4.96'}
                  </span>
                  <div className="flex text-primary-container">
                    <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      star
                    </span>
                  </div>
                </div>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1">1,840 ratings</span>
              </div>
            </div>

            {/* KPI 5 */}
            <div className="bg-surface-container-lowest p-space-md rounded-2xl shadow-sm border border-surface-container col-span-2 lg:col-span-1 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Surge Multiplier
                </span>
                <span className="w-8 h-8 rounded-lg bg-primary-fixed text-on-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">trending_up</span>
                </span>
              </div>
              <div className="mt-3">
                <span className="font-headline-xl text-headline-xl text-primary font-bold tracking-tight">1.4x Surge</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant block mt-1 truncate">
                  Delhi Airport Corridor
                </span>
              </div>
            </div>
          </div>

          {/* Active Trip Execution Console */}
          {activeTrip && (
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-lg border-2 border-primary-container mb-space-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-surface-container">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-container animate-ping"></span>
                  <h3 className="font-headline-md text-headline-md font-bold text-on-surface">
                    Active Trip #{activeTrip.bookingReference}
                  </h3>
                </div>
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-sm font-bold rounded-full">
                  Status: {activeTrip.status}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg my-space-md">
                <div className="lg:col-span-8 space-y-2">
                  <p className="font-label-lg font-bold text-on-surface">
                    Passenger: {activeTrip.passengerName || 'Ananya Sharma'}
                  </p>
                  <p className="font-body-md text-on-surface">● Pickup: {activeTrip.pickupAddress}</p>
                  <p className="font-body-md text-primary-container font-semibold">■ Dropoff: {activeTrip.dropoffAddress}</p>
                  <p className="font-body-sm text-on-surface-variant">
                    Distance: {activeTrip.distanceKm} km • Fare: ₹{activeTrip.totalFare?.toFixed(2)}
                  </p>
                </div>

                <div className="lg:col-span-4 bg-surface-container-low p-space-md rounded-2xl flex flex-col justify-center gap-3">
                  {activeTrip.status === 'DRIVER_ARRIVING' ? (
                    <div className="space-y-2">
                      <label className="font-label-md font-bold text-on-surface block">
                        Enter 4-Digit Passenger OTP:
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        value={otpInput}
                        onChange={(e) => setOtpInput(e.target.value)}
                        placeholder="e.g. 4892"
                        className="w-full h-12 text-center font-mono text-xl font-bold bg-surface-container-lowest border border-surface-container rounded-xl outline-none"
                      />
                      {otpError && <p className="text-xs text-error font-semibold">{otpError}</p>}
                      <button
                        type="button"
                        onClick={handleStartTripWithOtp}
                        className="w-full h-12 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-lg font-bold rounded-xl shadow-sm transition-all"
                      >
                        Verify OTP & Start Trip
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleCompleteTrip}
                      className="w-full h-14 bg-green-600 hover:bg-green-700 text-white font-headline-sm font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <span className="material-symbols-outlined">flag</span>
                      <span>Arrived at Destination • Complete Trip</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Incoming Ride Requests */}
          {!activeTrip && incomingTrips.length > 0 && (
            <div className="bg-surface-container-lowest rounded-3xl p-space-lg shadow-md border border-surface-container mb-space-2xl">
              <div className="flex items-center justify-between mb-space-md">
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary-container">notification_important</span>
                  <span>Incoming Ride Requests</span>
                </h3>
                <span className="font-label-sm text-primary font-bold">1 Dispatch Nearby</span>
              </div>

              {incomingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="p-space-md bg-surface-container-low rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-space-md border border-surface-container"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold shrink-0">
                      <span className="material-symbols-outlined text-[28px]">local_taxi</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          ₹{trip.totalFare?.toFixed(2)} Guaranteed
                        </h4>
                        <span className="font-label-sm text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
                          Fast Dispatch
                        </span>
                      </div>
                      <p className="font-label-md text-on-surface font-semibold mt-1">● {trip.pickupAddress}</p>
                      <p className="font-body-sm text-on-surface-variant">■ {trip.dropoffAddress}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {trip.distanceKm} km • ~{trip.durationMinutes} mins • Passenger: {trip.passengerName || 'Ananya S.'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIncomingTrips([])}
                      className="px-4 py-2.5 rounded-xl border border-surface-container hover:bg-surface-container text-on-surface font-label-md font-bold transition-colors"
                    >
                      Decline
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAcceptTrip(trip)}
                      className="px-6 py-2.5 rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md font-bold shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                      <span>Accept Trip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}