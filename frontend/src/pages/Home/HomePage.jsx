import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { vehicleService } from '../../services/vehicleService';

export default function HomePage() {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('CITY'); // CITY, OUTSTATION, RENTAL
  const [pickup, setPickup] = useState('Terminal 3, IGI Airport, New Delhi');
  const [dropoff, setDropoff] = useState('DLF Cyber Hub, Sector 24, Gurugram');
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await vehicleService.getAll();
        setVehicles(data);
      } catch (err) {
        console.error('Failed to load vehicle classes:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const handleSearchCabs = (e) => {
    e.preventDefault();
    const query = new URLSearchParams({
      tripType,
      pickup,
      dropoff,
    }).toString();
    navigate(`/book-a-cab?${query}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="flex flex-col w-full">
          {/* Top Ambient Glow */}
          <div className="relative w-full overflow-hidden">
            <div className="absolute -top-32 -left-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute top-64 right-[-10%] w-[32rem] h-[32rem] bg-secondary-container/30 rounded-full blur-3xl pointer-events-none"></div>

            {/* Hero Section */}
            <section className="max-w-container-max mx-auto px-gutter-desktop pt-space-xl pb-space-3xl w-full">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-2xl items-center">
                {/* Hero Left Rail: Pitch & Booking Engine */}
                <div className="lg:col-span-7 flex flex-col gap-space-lg">
                  {/* Trust Badges Bar */}
                  <div className="flex flex-wrap items-center gap-space-xs">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface rounded-full font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                      100% Verified Drivers
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface rounded-full font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">currency_rupee</span>
                      Transparent Upfront Pricing
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container-high text-on-surface rounded-full font-label-sm text-label-sm">
                      <span className="material-symbols-outlined text-[16px] text-primary">shield</span>
                      Zero-Cancellation Fee
                    </span>
                  </div>

                  {/* Headline & Tagline */}
                  <div className="flex flex-col gap-space-xs">
                    <h1 className="font-display-hero text-display-hero text-on-surface leading-tight tracking-tight">
                      Your Ride, <br />
                      <span className="text-primary-container relative inline-block">
                        Your Way.
                        <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary-container/30" preserveAspectRatio="none" viewBox="0 0 100 12">
                          <path d="M0,8 Q50,0 100,8" fill="transparent" stroke="currentColor" strokeWidth="4"></path>
                        </svg>
                      </span>
                    </h1>
                    <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                      Book a safe, comfortable, and reliable cab anytime, anywhere. Urban transit engineered for zero friction and complete peace of mind.
                    </p>
                  </div>

                  {/* Interactive Instant Booking Console Card */}
                  <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-xl shadow-surface-dim/40 flex flex-col gap-space-md border border-surface-container">
                    {/* Journey Type Tabs */}
                    <div className="flex items-center gap-space-xs p-1 bg-surface-container-low rounded-xl w-fit">
                      <button
                        onClick={() => setTripType('CITY')}
                        className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                          tripType === 'CITY'
                            ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        City Ride
                      </button>
                      <button
                        onClick={() => setTripType('OUTSTATION')}
                        className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                          tripType === 'OUTSTATION'
                            ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        Outstation
                      </button>
                      <button
                        onClick={() => setTripType('RENTAL')}
                        className={`px-space-md py-1.5 rounded-lg font-label-md text-label-md transition-all ${
                          tripType === 'RENTAL'
                            ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                            : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                        type="button"
                      >
                        Hourly Rental
                      </button>
                    </div>

                    {/* Route Inputs Form */}
                    <form onSubmit={handleSearchCabs} className="relative flex flex-col gap-space-xs">
                      {/* Connecting Route Spine */}
                      <div className="absolute left-6 top-7 bottom-7 w-0.5 bg-dashed bg-outline-variant flex flex-col justify-between items-center pointer-events-none">
                        <div className="w-2.5 h-2.5 rounded-full bg-on-surface -ml-1"></div>
                        <div className="w-2.5 h-2.5 rounded-sm bg-primary-container -ml-1"></div>
                      </div>

                      {/* Pickup Input */}
                      <div className="relative pl-12 pr-4 py-3 bg-surface-container-low rounded-xl flex items-center justify-between group focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
                        <div className="flex flex-col w-full">
                          <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="pickup-loc">
                            PICKUP LOCATION
                          </label>
                          <input
                            className="bg-transparent font-headline-sm text-headline-sm text-on-surface outline-none w-full placeholder:text-on-surface-variant/50"
                            id="pickup-loc"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            placeholder="Enter current pickup point..."
                            required
                            type="text"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setPickup('Current GPS Location')}
                          aria-label="Use Current Location"
                          className="p-1 rounded-full text-on-surface-variant hover:text-primary transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined text-[20px]">my_location</span>
                        </button>
                      </div>

                      {/* Dropoff Input */}
                      <div className="relative pl-12 pr-4 py-3 bg-surface-container-low rounded-xl flex items-center justify-between group focus-within:bg-surface-container-lowest focus-within:shadow-md transition-all">
                        <div className="flex flex-col w-full">
                          <label className="font-label-sm text-label-sm text-on-surface-variant" htmlFor="dropoff-loc">
                            WHERE TO?
                          </label>
                          <input
                            className="bg-transparent font-headline-sm text-headline-sm text-on-surface outline-none w-full placeholder:text-on-surface-variant/50"
                            id="dropoff-loc"
                            value={dropoff}
                            onChange={(e) => setDropoff(e.target.value)}
                            placeholder="Enter dropoff landmark or address..."
                            required
                            type="text"
                          />
                        </div>
                        <button
                          type="button"
                          aria-label="Recent Destinations"
                          className="p-1 rounded-full text-on-surface-variant hover:text-primary transition-colors shrink-0"
                        >
                          <span className="material-symbols-outlined text-[20px]">schedule</span>
                        </button>
                      </div>

                      {/* Find Cabs Submit CTA */}
                      <button
                        type="submit"
                        className="w-full h-14 mt-space-xs rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-space-xs shadow-lg hover:shadow-xl transition-all cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[22px]">search</span>
                        <span>Find Available Cabs & Fares</span>
                      </button>
                    </form>
                  </div>
                </div>

                {/* Hero Right Visual: Automotive Hero Render + Telemetry Float */}
                <div className="lg:col-span-5 relative flex flex-col items-center">
                  <div className="relative w-full aspect-4/3 rounded-3xl overflow-hidden shadow-2xl bg-surface-container-high border border-surface-container">
                    <img
                      alt="CabGo Electric Fleet Taxi"
                      className="w-full h-full object-cover object-center"
                      src="/taxi-cab.png"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCAqusxjrSYtclcq3qtuMpApATf3029wrFzmtj5rsJ55eOObmO50bqdAx5Xt8jIat0BU46Ypeh2ZUHgfwEoAVLsJ4rzHwV8Y4Fjj2iQb-QWTaVaV77K3L0yOWVO6Y0GIORbMySxwI15mvhPh7WWBhDCLTTVpxhV4M4YbUlPL_wP-CLvnlEK7JEOlinoiC5dax9AmQ8507jkrjXvJr5A58Ih_jv7VkShN9noNT9x1L3zZSIPwSHJbTav';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface/80 via-transparent to-transparent"></div>

                    {/* Floating Telemetry Pill */}
                    <div className="absolute bottom-6 left-6 right-6 p-space-md bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl shadow-xl flex items-center justify-between">
                      <div className="flex items-center gap-space-sm">
                        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
                          <span className="material-symbols-outlined text-[20px]">near_me</span>
                        </div>
                        <div>
                          <p className="font-headline-sm text-headline-sm text-on-surface">324 Active Drivers</p>
                          <p className="font-label-sm text-label-sm text-on-surface-variant">Avg ETA: 2.8 minutes in Delhi NCR</p>
                        </div>
                      </div>
                      <span className="px-space-xs py-1 rounded-full bg-surface-container text-primary font-label-sm text-label-sm font-bold">
                        Live 99.8%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Vehicle Fleet Category Showcase */}
          <section className="bg-surface-container-low py-space-3xl border-y border-surface-container">
            <div className="max-w-container-max mx-auto px-gutter-desktop">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-2xl">
                <div>
                  <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-bold">
                    CabGo Fleets
                  </span>
                  <h2 className="font-headline-xl text-headline-xl text-on-surface mt-1">
                    Every Trip Engineered For Your Needs
                  </h2>
                </div>
                <Link
                  to="/book-a-cab"
                  className="font-label-lg text-label-lg text-primary hover:underline flex items-center gap-1"
                >
                  <span>Compare full rates</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </Link>
              </div>

              {loading ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
                  {vehicles.map((v) => (
                    <div
                      key={v.id}
                      className={`p-space-lg rounded-2xl bg-surface-container-lowest border transition-all hover:shadow-lg flex flex-col justify-between ${
                        v.isPopular ? 'border-primary-container ring-1 ring-primary-container shadow-md' : 'border-surface-container'
                      }`}
                    >
                      <div>
                        {v.isPopular && (
                          <span className="inline-block mb-2 bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold uppercase px-2 py-0.5 rounded-full">
                            Popular Choice
                          </span>
                        )}
                        <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary mb-3">
                          <span className="material-symbols-outlined text-[28px]">{v.iconName}</span>
                        </div>
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">{v.name}</h3>
                        <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{v.description}</p>
                        <div className="flex items-center gap-2 mt-3 font-label-sm text-label-sm text-on-surface-variant">
                          <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[14px]">person</span> {v.capacity} Seats
                          </span>
                          <span>•</span>
                          <span>{v.etaMinutes} mins away</span>
                        </div>
                      </div>

                      <div className="mt-space-lg pt-space-sm border-t border-surface-container flex items-baseline justify-between">
                        <div>
                          <span className="font-headline-md text-headline-md text-on-surface font-extrabold">₹{v.baseFare}</span>
                          <span className="font-label-sm text-label-sm text-on-surface-variant"> base</span>
                        </div>
                        <span className="font-label-sm text-label-sm text-emerald-700 font-semibold">₹{v.perKmRate}/km</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Why CabGo Trust Pillars */}
          <section className="py-space-3xl max-w-container-max mx-auto px-gutter-desktop">
            <div className="text-center max-w-2xl mx-auto mb-space-2xl">
              <span className="font-label-md text-label-md text-primary uppercase tracking-wider font-bold">
                Why Choose CabGo
              </span>
              <h2 className="font-headline-xl text-headline-xl text-on-surface mt-1">
                Built for Safety, Predictability & Comfort
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
              <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-4">
                  <span className="material-symbols-outlined text-[28px]">price_check</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Upfront Locked Pricing</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  What you see is what you pay. Zero mid-trip surge multipliers or hidden toll surcharges.
                </p>
              </div>

              <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container">
                <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-secondary mb-4">
                  <span className="material-symbols-outlined text-[28px]">verified_user</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">100% Background Checked</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Every captain undergoes rigorous biometric, vehicle, and police verification prior to dispatch.
                </p>
              </div>

              <div className="p-space-lg rounded-2xl bg-surface-container-lowest border border-surface-container">
                <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary mb-4">
                  <span className="material-symbols-outlined text-[28px]">eco</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">Carbon Neutral Commutes</h3>
                <p className="font-body-md text-body-md text-on-surface-variant mt-2">
                  Opt in for ₹2 micro-offsetting to plant trees and neutralize CO₂ for every urban kilometer traveled.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}