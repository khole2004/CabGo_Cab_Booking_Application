import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import GoogleMapView from '../../components/common/GoogleMapView';
import { bookingService } from '../../services/bookingService';

export default function LiveTrackingPage() {
  const { bookingRef } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sosActive, setSosActive] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of plans');

  useEffect(() => {
    async function loadBooking() {
      try {
        const ref = bookingRef || 'CG-849201';
        const data = await bookingService.getByRef(ref);
        setBooking(data);
      } catch {
        // Fallback default mock matching Stitch live tracking
        setBooking({
          bookingReference: bookingRef || 'CG-849201',
          pickupAddress: 'Terminal 3, IGI Airport (Commercial Pillar 14)',
          dropoffAddress: 'DLF Cyber Hub, Sector 24, Gurugram',
          status: 'DRIVER_ARRIVING',
          otpCode: '4892',
          distanceKm: 14.8,
          durationMinutes: 28,
          totalFare: 365.0,
          driver: {
            fullName: 'Rajesh Kumar',
            rating: 4.92,
            totalRides: 1840,
            vehicleModel: 'Honda City / Hyundai Verna',
            vehiclePlateNumber: 'DL 01 AX 4892',
            vehicleClassCode: 'SEDAN',
            avatarUrl:
              'https://lh3.googleusercontent.com/aida-public/AB6AXuAkRLrnOA94H1rMrS1b4Tv-P4ABypzcBXoDlVRBpmV4qYnqgMw8-bLRd74OOCXNl_LGl4oKphXvw7vi7HTSazwE5a7SS1yae6yMJUDLtihiE-CCwX--Gy0qO2VhqI9YcEAZzUDp_B-W8hNpYRRJCWQPQnCgEatYQ3Dz0vZfZiY3vD35NR_K9r9S7T4_Drp6TqSex__tg-H16mCDwtL0NMlSNXtUlKSbWVN3ktfcm5xbVLRm9LilUgZu',
          },
        });
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [bookingRef]);

  const handleCancelBooking = async () => {
    if (!booking) return;
    try {
      await bookingService.cancel(booking.id, cancelReason);
      setBooking((prev) => ({ ...prev, status: 'CANCELLED' }));
      setCancelModal(false);
    } catch (err) {
      alert('Failed to cancel: ' + (err.message || 'Error'));
    }
  };

  const getStageIndex = (status) => {
    switch (status) {
      case 'DRIVER_ASSIGNED': return 1;
      case 'DRIVER_ARRIVING': return 2;
      case 'IN_PROGRESS': return 3;
      case 'COMPLETED': return 4;
      case 'CANCELLED': return 0;
      default: return 2;
    }
  };

  const currentStage = getStageIndex(booking?.status);

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-lg">
          {/* Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm mb-space-md">
            <div className="flex items-center gap-space-sm">
              <Link
                to="/my-bookings"
                className="p-2 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </Link>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-headline-md text-headline-md text-on-surface font-bold">Live Ride Telemetry</h1>
                  <span className="font-mono px-2 py-0.5 rounded bg-surface-container font-label-sm text-label-sm">
                    #{booking?.bookingReference}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Real-time GPS tracking & vehicle telemetry</p>
              </div>
            </div>

            <div className="flex items-center gap-space-xs">
              <button
                type="button"
                onClick={() => setSosActive(!sosActive)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-label-md text-label-md font-bold transition-all shadow-sm ${
                  sosActive
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'bg-error-container text-on-error-container hover:bg-error hover:text-on-error'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">sos</span>
                <span>{sosActive ? 'SOS Alert Broadcasted!' : 'Emergency SOS'}</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Live tracking link copied to clipboard!')}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
                <span>Share Ride</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Column (5 cols): Ride Status & Driver Info */}
            <div className="lg:col-span-5 flex flex-col gap-space-md">
              {/* OTP Banner */}
              <div className="p-space-md rounded-2xl bg-primary-fixed text-on-primary-fixed flex items-center justify-between shadow-sm">
                <div>
                  <span className="font-label-sm text-label-sm uppercase tracking-wider block font-bold">
                    Start Ride OTP Pin
                  </span>
                  <p className="font-body-sm text-body-sm mt-0.5">Share with captain before boarding</p>
                </div>
                <div className="bg-surface-container-lowest text-on-surface px-4 py-2 rounded-xl font-headline-xl font-mono tracking-widest font-extrabold shadow-sm">
                  {booking?.otpCode || '4892'}
                </div>
              </div>

              {/* 4-Stage Progress Timeline */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container">
                <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-md font-bold">
                  Ride Progress Status
                </h3>

                <div className="relative pl-6 space-y-6">
                  <div className="absolute left-2.5 top-3 bottom-3 w-0.5 bg-surface-container-highest"></div>

                  {/* Stage 1: Driver Assigned */}
                  <div className="relative flex items-start gap-space-sm">
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-[12px] shadow-sm ${
                        currentStage >= 1
                          ? 'bg-inverse-surface text-inverse-on-surface'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">check</span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface font-semibold">Driver Assigned</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">Confirmed by dispatch algorithm</p>
                    </div>
                  </div>

                  {/* Stage 2: Driver Arriving */}
                  <div
                    className={`relative flex items-start gap-space-sm p-2 rounded-xl transition-all ${
                      currentStage === 2 ? 'bg-primary-fixed/20 -mx-2 ring-1 ring-primary-container' : ''
                    }`}
                  >
                    <div
                      className={`absolute -left-4 mt-1 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                        currentStage >= 2
                          ? 'bg-primary-container text-on-primary-container ring-4 ring-primary-fixed'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">directions_car</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-headline-sm text-headline-sm text-on-surface font-bold">Driver Arriving</p>
                      <p className="font-body-sm text-body-sm text-primary font-semibold">ETA ~3 mins • 0.8 km away</p>
                    </div>
                    {currentStage === 2 && (
                      <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold">
                        Active
                      </span>
                    )}
                  </div>

                  {/* Stage 3: Ride In Progress */}
                  <div
                    className={`relative flex items-start gap-space-sm p-2 rounded-xl transition-all ${
                      currentStage === 3 ? 'bg-primary-fixed/20 -mx-2 ring-1 ring-primary-container' : ''
                    }`}
                  >
                    <div
                      className={`absolute -left-4 mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
                        currentStage >= 3
                          ? 'bg-primary-container text-on-primary-container ring-4 ring-primary-fixed'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">near_me</span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface font-semibold">Ride in Progress</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">En route via NH-48 Express</p>
                    </div>
                  </div>

                  {/* Stage 4: Destination Reached */}
                  <div className="relative flex items-start gap-space-sm">
                    <div
                      className={`absolute -left-6 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${
                        currentStage >= 4
                          ? 'bg-green-600 text-white'
                          : 'bg-surface-container-high text-on-surface-variant'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[14px]">flag</span>
                    </div>
                    <div>
                      <p className="font-label-lg text-label-lg text-on-surface font-semibold">Destination Reached</p>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">DLF Cyber Hub drop-off</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver & Assigned Vehicle Detail Card */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm border border-surface-container flex flex-col gap-space-sm">
                <div className="flex items-center justify-between pb-space-sm border-b border-surface-container">
                  <div className="flex items-center gap-space-sm">
                    <img
                      className="w-14 h-14 rounded-full object-cover shadow-inner"
                      alt="Driver"
                      src={
                        booking?.driver?.avatarUrl ||
                        'https://lh3.googleusercontent.com/aida-public/AB6AXuAkRLrnOA94H1rMrS1b4Tv-P4ABypzcBXoDlVRBpmV4qYnqgMw8-bLRd74OOCXNl_LGl4oKphXvw7vi7HTSazwE5a7SS1yae6yMJUDLtihiE-CCwX--Gy0qO2VhqI9YcEAZzUDp_B-W8hNpYRRJCWQPQnCgEatYQ3Dz0vZfZiY3vD35NR_K9r9S7T4_Drp6TqSex__tg-H16mCDwtL0NMlSNXtUlKSbWVN3ktfcm5xbVLRm9LilUgZu'
                      }
                    />
                    <div>
                      <div className="flex items-center gap-space-xs">
                        <h4 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                          {booking?.driver?.fullName || 'Rajesh Kumar'}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-inverse-surface text-inverse-on-surface font-label-sm text-label-sm font-bold flex items-center gap-0.5">
                          <span className="text-primary-container">★</span> {booking?.driver?.rating || 4.92}
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">
                        {booking?.driver?.totalRides || '1,840'}+ Completed Rides
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-label-sm text-label-sm text-on-surface-variant uppercase">Vehicle</span>
                    <p className="font-headline-sm text-headline-sm text-on-surface">
                      {booking?.driver?.vehicleClassCode || 'Sedan'}
                    </p>
                  </div>
                </div>

                {/* Vehicle Plate & Model */}
                <div className="p-3 bg-surface-container-low rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant block">AUTOMOBILE</span>
                    <span className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                      {booking?.driver?.vehicleModel || 'Honda City Prime'}
                    </span>
                  </div>
                  <div className="px-3 py-1 bg-surface-container-lowest rounded-lg border border-surface-container font-mono font-bold text-on-surface tracking-wider">
                    {booking?.driver?.vehiclePlateNumber || 'DL 01 AX 4892'}
                  </div>
                </div>

                {/* Driver Action Controls */}
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <a
                    href="tel:+919811122334"
                    className="h-11 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span>Call Driver</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => alert('Connecting to driver in-app chat...')}
                    className="h-11 rounded-xl bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">chat</span>
                    <span>Chat</span>
                  </button>
                </div>

                {booking?.status !== 'CANCELLED' && booking?.status !== 'COMPLETED' && (
                  <button
                    type="button"
                    onClick={() => setCancelModal(true)}
                    className="w-full py-2 text-error text-center font-label-sm text-label-sm hover:underline mt-1 cursor-pointer"
                  >
                    Cancel Ride
                  </button>
                )}
              </div>
            </div>

            {/* Right Column (7 cols): Map Telemetry View */}
            <div className="lg:col-span-7 sticky top-24">
              <GoogleMapView
                pickup={booking?.pickupAddress || 'Terminal 3, IGI Airport'}
                dropoff={booking?.dropoffAddress || 'DLF Cyber Hub, Sector 24, Gurugram'}
              />
            </div>
          </div>
        </div>

        {/* Cancellation Modal */}
        {cancelModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-surface-container-lowest rounded-2xl p-6 max-w-md w-full shadow-2xl border border-surface-container">
              <h3 className="font-headline-md text-headline-md text-on-surface font-bold">Cancel This Ride?</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Zero cancellation fees apply if cancelled within 5 minutes of driver matching.
              </p>
              <div className="my-4">
                <label className="font-label-md text-on-surface block mb-1">Select Cancellation Reason</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full h-11 px-3 bg-surface-container-low rounded-xl border border-surface-container outline-none"
                >
                  <option value="Change of plans">Change of plans</option>
                  <option value="Driver asked to cancel">Driver asked to cancel</option>
                  <option value="Driver taking too long">Driver taking too long</option>
                  <option value="Wrong pickup address">Wrong pickup address</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCancelModal(false)}
                  className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md font-bold"
                >
                  Keep Ride
                </button>
                <button
                  type="button"
                  onClick={handleCancelBooking}
                  className="px-4 py-2 rounded-xl bg-error text-white font-label-md font-bold hover:bg-error/90"
                >
                  Confirm Cancellation
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