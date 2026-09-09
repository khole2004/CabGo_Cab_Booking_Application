import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function LoginPage() {
  const [role, setRole] = useState('passenger'); // 'passenger' or 'driver'
  const [identifier, setIdentifier] = useState('ananya@example.com');
  const [password, setPassword] = useState('CityRider@2025!');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleRoleSelect = (newRole) => {
    setRole(newRole);
    if (newRole === 'driver') {
      setIdentifier('rajesh.driver@example.com');
      setPassword('CityRider@2025!');
    } else {
      setIdentifier('ananya@example.com');
      setPassword('CityRider@2025!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(identifier, password, role);
      const redirect = searchParams.get('redirect');
      if (redirect) {
        navigate(redirect);
      } else if (user.role === 'ROLE_DRIVER') {
        navigate('/driver');
      } else {
        navigate('/hub');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="flex flex-col w-full py-space-xl md:py-space-3xl px-gutter-mobile sm:px-gutter-tablet lg:px-gutter-desktop">
          <div className="max-w-container-max mx-auto w-full">
            {/* Top breadcrumb / context strip */}
            <div className="flex items-center justify-between mb-space-lg">
              <Link
                to="/"
                className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">west</span>
                <span>Back to homepage</span>
              </Link>
              <div className="hidden sm:flex items-center gap-space-xs px-space-sm py-space-2xs rounded-full bg-surface-container-high text-on-surface">
                <span className="w-2 h-2 rounded-full bg-primary-container animate-ping"></span>
                <span className="font-label-sm text-label-sm">Fleet Status: Operational in 18 Cities</span>
              </div>
            </div>

            {/* Main Split Auth Card */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(15,23,42,0.08),0_8px_16px_-4px_rgba(15,23,42,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[680px]">
              {/* Left Column: Visual Storytelling & Trust Telemetry */}
              <div className="relative lg:col-span-5 xl:col-span-5 bg-inverse-surface text-inverse-on-surface flex flex-col justify-between p-space-lg sm:p-space-xl lg:p-space-2xl overflow-hidden min-h-[420px] lg:min-h-full">
                <div className="absolute inset-0 z-0">
                  <img
                    alt="Sleek modern yellow electric taxi cab parked in a clean contemporary city square at twilight"
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAqusxjrSYtclcq3qtuMpApATf3029wrFzmtj5rsJ55eOObmO50bqdAx5Xt8jIat0BU46Ypeh2ZUHgfwEoAVLsJ4rzHwV8Y4Fjj2iQb-QWTaVaV77K3L0yOWVO6Y0GIORbMySxwI15mvhPh7WWBhDCLTTVpxhV4M4YbUlPL_wP-CLvnlEK7JEOlinoiC5dax9AmQ8507jkrjXvJr5A58Ih_jv7VkShN9noNT9x1L3zZSIPwSHJbTav"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/80 to-inverse-surface/30 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-on-primary-fixed/60 via-transparent to-transparent"></div>
                </div>

                {/* Upper Visual Elements */}
                <div className="relative z-10 flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest/15 backdrop-blur-md px-space-md py-space-2xs rounded-full w-fit">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">verified_user</span>
                    <span className="font-label-md text-label-md text-surface-container-lowest tracking-wide uppercase">
                      CabGo Verified Network
                    </span>
                  </div>
                  <div className="max-w-md">
                    <h2 className="font-headline-xl text-headline-xl text-surface-container-lowest leading-tight tracking-tight">
                      Welcome back to seamless urban mobility.
                    </h2>
                    <p className="font-body-md text-body-md text-surface-container mt-space-xs opacity-90">
                      Your frictionless gateway to on-demand city transits, guaranteed fares, and elite chauffeurs.
                    </p>
                  </div>
                </div>

                {/* Center Telemetry Card */}
                <div className="relative z-10 my-space-lg bg-surface-container-lowest/10 backdrop-blur-xl rounded-xl p-space-md shadow-lg">
                  <div className="flex items-center justify-between pb-space-xs mb-space-xs">
                    <div className="flex items-center gap-space-xs">
                      <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container"></span>
                      </span>
                      <span className="font-label-sm text-label-sm text-surface-container uppercase tracking-wider">
                        Live Downtown Grid
                      </span>
                    </div>
                    <span className="font-label-sm text-label-sm text-surface-container-lowest bg-surface-container-lowest/20 px-space-xs py-space-2xs rounded-md">
                      Realtime
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-space-sm pt-space-xs">
                    <div>
                      <div className="font-display-hero-mobile text-display-hero-mobile text-surface-container-lowest leading-none">
                        2.4<span className="font-headline-sm text-headline-sm text-primary-container font-semibold ml-1">min</span>
                      </div>
                      <div className="font-label-sm text-label-sm text-surface-container-highest mt-1">
                        Average pickup window
                      </div>
                    </div>
                    <div className="w-32 h-10">
                      <svg className="w-full h-full text-primary-container overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 120 36">
                        <path d="M0 28 Q 20 32, 40 18 T 80 12 T 120 4" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5"></path>
                        <path d="M0 28 Q 20 32, 40 18 T 80 12 T 120 4 L 120 36 L 0 36 Z" fill="currentColor" fillOpacity="0.15"></path>
                        <circle className="fill-primary-container" cx="120" cy="4" r="3.5"></circle>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Trust Highlights */}
                <div className="relative z-10 flex flex-col gap-space-xs pt-space-xs">
                  <div className="grid grid-cols-3 gap-space-xs sm:gap-space-sm text-left">
                    <div className="p-space-xs rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1 text-primary-container">
                        <span className="material-symbols-outlined text-[16px]">price_check</span>
                        <span className="font-label-sm text-label-sm text-surface-container-lowest">Guaranteed</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">Zero surge shock</p>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1 text-primary-container">
                        <span className="material-symbols-outlined text-[16px]">radar</span>
                        <span className="font-label-sm text-label-sm text-surface-container-lowest">Telemetry</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">GPS Live tracking</p>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1 text-tertiary-fixed-dim">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-label-sm text-label-sm text-surface-container-lowest">4.98 / 5</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">Rated Captains</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Authentication Console Form */}
              <div className="lg:col-span-7 xl:col-span-7 bg-surface-container-lowest p-space-lg sm:p-space-xl lg:p-space-2xl flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full flex flex-col">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-space-md">
                    <div className="flex items-center gap-space-xs">
                      <img
                        alt="CabGo Brand Logo"
                        className="h-8 w-auto object-contain"
                        src="/logo.svg"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://lh3.googleusercontent.com/aida/AEtjO1UIIT3kRPL1eydxbJPQRUooLDd5EC107tizhB8e4Gsr16tAIULPFFscWPmNTKKrBgnpI7rKrasyVICyfq-1Ee9ffbFiLalwFdtGsuOAIs3OlpKSgT4Y62jrtNW7Zob05alA2skRkOSG3wuaYrpheo8E-4nTcIU0swXopDie8E9duJvwPCeaN30qbitYyjVZEZEuWpPw_ojQEg_RSr0eJlqIxHoZ7tazR6QRNdLdmY3KO4WOpUE0Ea12cn4';
                        }}
                      />
                      <span className="font-headline-md text-headline-md text-on-surface">CabGo</span>
                    </div>
                    <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container-low px-space-sm py-space-2xs rounded-full">
                      ID Auth v2.4
                    </span>
                  </div>

                  <div className="mb-space-lg">
                    <h1 className="font-headline-xl text-headline-xl text-on-surface tracking-tight">Welcome back!</h1>
                    <p className="font-body-md text-body-md text-on-surface-variant mt-1">
                      Sign in to access your ride history, saved routes, and fast-track bookings.
                    </p>
                  </div>

                  {error && (
                    <div className="p-3 mb-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Role Toggle Tabs */}
                  <div className="p-1 rounded-xl bg-surface-container-low flex items-center mb-space-lg">
                    <button
                      className={`flex-1 flex items-center justify-center gap-space-xs py-space-xs px-space-md rounded-lg font-label-lg text-label-lg transition-all duration-200 ${
                        role === 'passenger'
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => handleRoleSelect('passenger')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span>Passenger Login</span>
                    </button>
                    <button
                      className={`flex-1 flex items-center justify-center gap-space-xs py-space-xs px-space-md rounded-lg font-label-lg text-label-lg transition-all duration-200 ${
                        role === 'driver'
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => handleRoleSelect('driver')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">local_taxi</span>
                      <span>Driver Partner</span>
                    </button>
                  </div>

                  {/* Login Form */}
                  <form className="flex flex-col gap-space-md" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-1.5">
                      <label className="font-label-lg text-label-lg text-on-surface flex items-center justify-between" htmlFor="identifier">
                        <span>Email or Mobile Number</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant font-normal">
                          {role === 'driver' ? 'Driver Partner Account' : 'Personal Account'}
                        </span>
                      </label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px] pointer-events-none">
                          alternate_email
                        </span>
                        <input
                          className="w-full h-13 pl-12 pr-4 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface transition-all placeholder:text-on-surface-variant/50"
                          id="identifier"
                          name="identifier"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          placeholder="e.g. ananya@example.com or +91 98765 43210"
                          required
                          type="text"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="password">
                          Password
                        </label>
                        <a className="font-label-lg text-label-lg text-primary hover:text-on-primary-fixed-variant transition-colors" href="#">
                          Forgot Password?
                        </a>
                      </div>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-4 text-on-surface-variant text-[20px] pointer-events-none">
                          lock
                        </span>
                        <input
                          className="w-full h-13 pl-12 pr-12 bg-surface-container-low text-on-surface font-body-md text-body-md rounded-xl outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface transition-all placeholder:text-on-surface-variant/50"
                          id="password"
                          name="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your security password"
                          required
                          type={showPassword ? 'text' : 'password'}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 text-on-surface-variant hover:text-on-surface"
                        >
                          <span className="material-symbols-outlined text-[20px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      disabled={loading}
                      className="w-full h-14 mt-space-xs rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-space-xs shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                      type="submit"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Sign In to CabGo</span>
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>

                  {/* Demo Credentials Box */}
                  <div className="mt-4 p-3 bg-surface-container-low rounded-xl text-xs text-on-surface-variant">
                    <p className="font-bold text-on-surface mb-1">Demo Credentials:</p>
                    <p>Passenger: <span className="font-mono text-on-surface">ananya@example.com</span> / <span className="font-mono text-on-surface">CityRider@2025!</span></p>
                    <p>Driver: <span className="font-mono text-on-surface">rajesh.driver@example.com</span> / <span className="font-mono text-on-surface">CityRider@2025!</span></p>
                  </div>

                  {/* Register redirect */}
                  <div className="text-center mt-space-lg">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Don't have an account?{' '}
                      <Link to="/register" className="font-label-lg text-label-lg text-primary font-bold hover:underline">
                        Create CabGo Account
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}