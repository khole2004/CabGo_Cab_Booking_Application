import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';

export default function RegisterPage() {
  const [role, setRole] = useState('ROLE_PASSENGER'); // ROLE_PASSENGER or ROLE_DRIVER
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Driver specific fields
  const [vehicleModel, setVehicleModel] = useState('');
  const [vehiclePlateNumber, setVehiclePlateNumber] = useState('');
  const [vehicleClassCode, setVehicleClassCode] = useState('SEDAN');
  const [licenseNumber, setLicenseNumber] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const registerData = {
        fullName,
        email,
        phoneNumber: phoneNumber.startsWith('+91') ? phoneNumber : `+91 ${phoneNumber}`,
        password,
        role,
        ...(role === 'ROLE_DRIVER' && {
          vehicleModel,
          vehiclePlateNumber,
          vehicleClassCode,
          licenseNumber,
        }),
      };

      const user = await register(registerData);
      if (user.role === 'ROLE_DRIVER') {
        navigate('/driver');
      } else {
        navigate('/hub');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed');
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
            {/* Top breadcrumb */}
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
                <span className="font-label-sm text-label-sm">Instant Onboarding Active</span>
              </div>
            </div>

            {/* Split Auth Card */}
            <div className="w-full bg-surface-container-lowest rounded-xl shadow-[0_24px_48px_-12px_rgba(15,23,42,0.08),0_8px_16px_-4px_rgba(15,23,42,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[700px]">
              {/* Left Column: Visual Storytelling */}
              <div className="relative lg:col-span-5 xl:col-span-5 bg-inverse-surface text-inverse-on-surface flex flex-col justify-between p-space-lg sm:p-space-xl lg:p-space-2xl overflow-hidden min-h-[380px] lg:min-h-full">
                <div className="absolute inset-0 z-0">
                  <img
                    alt="Sleek modern yellow electric taxi cab"
                    className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out hover:scale-100"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAqusxjrSYtclcq3qtuMpApATf3029wrFzmtj5rsJ55eOObmO50bqdAx5Xt8jIat0BU46Ypeh2ZUHgfwEoAVLsJ4rzHwV8Y4Fjj2iQb-QWTaVaV77K3L0yOWVO6Y0GIORbMySxwI15mvhPh7WWBhDCLTTVpxhV4M4YbUlPL_wP-CLvnlEK7JEOlinoiC5dax9AmQ8507jkrjXvJr5A58Ih_jv7VkShN9noNT9x1L3zZSIPwSHJbTav"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-inverse-surface via-inverse-surface/80 to-inverse-surface/30 mix-blend-multiply"></div>
                  <div className="absolute inset-0 bg-gradient-to-tr from-on-primary-fixed/60 via-transparent to-transparent"></div>
                </div>

                <div className="relative z-10 flex flex-col gap-space-md">
                  <div className="flex items-center gap-space-xs bg-surface-container-lowest/15 backdrop-blur-md px-space-md py-space-2xs rounded-full w-fit">
                    <span className="material-symbols-outlined text-primary-container text-[18px]">verified_user</span>
                    <span className="font-label-md text-label-md text-surface-container-lowest tracking-wide uppercase">
                      CabGo Network
                    </span>
                  </div>
                  <div className="max-w-md">
                    <h2 className="font-headline-xl text-headline-xl text-surface-container-lowest leading-tight tracking-tight">
                      Join thousands riding with complete peace of mind.
                    </h2>
                    <p className="font-body-md text-body-md text-surface-container mt-space-xs opacity-90">
                      Zero cancellation shock, 100% verified captains, and upfront transparent fares every time.
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex flex-col gap-space-xs pt-space-xs">
                  <div className="grid grid-cols-3 gap-space-xs sm:gap-space-sm text-left">
                    <div className="p-space-xs rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1 text-primary-container">
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span className="font-label-sm text-label-sm text-surface-container-lowest">Verified</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">Checked Fleet</p>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1 text-primary-container">
                        <span className="material-symbols-outlined text-[16px]">price_check</span>
                        <span className="font-label-sm text-label-sm text-surface-container-lowest">Fare Lock</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">No Surge Surprises</p>
                    </div>
                    <div className="p-space-xs rounded-lg bg-surface-container-lowest/10 backdrop-blur-sm">
                      <div className="flex items-center gap-1 text-tertiary-fixed-dim">
                        <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="font-label-sm text-label-sm text-surface-container-lowest">4.95 Rating</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-surface-container-highest mt-0.5">Top Experience</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Register Form */}
              <div className="lg:col-span-7 xl:col-span-7 bg-surface-container-lowest p-space-lg sm:p-space-xl lg:p-space-2xl flex flex-col justify-center">
                <div className="max-w-xl mx-auto w-full flex flex-col">
                  <h1 className="font-headline-xl text-headline-xl text-on-surface mt-space-xs">Create Your CabGo Account</h1>
                  <p className="font-body-md text-body-md text-on-surface-variant">
                    Experience predictable pricing, verified captains, and effortless daily travel.
                  </p>

                  {/* Account Type Switcher */}
                  <div className="grid grid-cols-2 p-space-2xs rounded-xl bg-surface-container mt-space-sm gap-space-2xs">
                    <button
                      className={`flex items-center justify-center gap-space-xs py-space-xs px-space-sm rounded-lg font-label-lg text-label-lg transition-all ${
                        role === 'ROLE_PASSENGER'
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setRole('ROLE_PASSENGER')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">person</span>
                      <span>Passenger Account</span>
                    </button>
                    <button
                      className={`flex items-center justify-center gap-space-xs py-space-xs px-space-sm rounded-lg font-label-lg text-label-lg transition-all ${
                        role === 'ROLE_DRIVER'
                          ? 'bg-surface-container-lowest text-on-surface shadow-sm font-bold'
                          : 'text-on-surface-variant hover:text-on-surface'
                      }`}
                      onClick={() => setRole('ROLE_DRIVER')}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[18px]">drive_eta</span>
                      <span>Partner as Driver</span>
                    </button>
                  </div>

                  {error && (
                    <div className="p-3 my-3 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <form className="flex flex-col gap-space-md mt-4" onSubmit={handleSubmit}>
                    {/* Full Name */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-lg text-label-lg text-on-surface" htmlFor="fullName">Full Name</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">person</span>
                        <input
                          className="w-full h-[52px] pl-11 pr-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface outline-none transition-colors"
                          id="fullName"
                          name="fullName"
                          placeholder="e.g. Ananya Sharma"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          type="text"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-lg text-label-lg text-on-surface" htmlFor="email">Email Address</label>
                      <div className="relative flex items-center">
                        <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">mail</span>
                        <input
                          className="w-full h-[52px] pl-11 pr-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface outline-none transition-colors"
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          type="email"
                        />
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="flex flex-col gap-space-2xs">
                      <label className="font-label-lg text-label-lg text-on-surface" htmlFor="phoneNumber">Phone Number</label>
                      <div className="flex items-center gap-space-xs">
                        <div className="h-[52px] px-space-md rounded-xl bg-surface-container-low flex items-center gap-space-2xs shrink-0 select-none">
                          <span className="text-[16px]">🇮🇳</span>
                          <span className="font-label-lg text-label-lg text-on-surface font-bold">+91</span>
                        </div>
                        <div className="relative flex-1 flex items-center">
                          <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">phone</span>
                          <input
                            className="w-full h-[52px] pl-11 pr-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface outline-none transition-colors font-mono tracking-wide"
                            id="phoneNumber"
                            maxLength="10"
                            name="phoneNumber"
                            placeholder="98765 43210"
                            required
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            type="tel"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Driver Extra Fields */}
                    {role === 'ROLE_DRIVER' && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-md p-4 bg-surface-container-low rounded-xl">
                        <div className="flex flex-col gap-1">
                          <label className="font-label-md text-on-surface">Vehicle Model</label>
                          <input
                            className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                            placeholder="e.g. Honda City"
                            value={vehicleModel}
                            onChange={(e) => setVehicleModel(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-md text-on-surface">License Plate</label>
                          <input
                            className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                            placeholder="e.g. DL 01 AX 4892"
                            value={vehiclePlateNumber}
                            onChange={(e) => setVehiclePlateNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-md text-on-surface">Driving License Number</label>
                          <input
                            className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                            placeholder="e.g. DL-0420190012"
                            value={licenseNumber}
                            onChange={(e) => setLicenseNumber(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-label-md text-on-surface">Vehicle Category</label>
                          <select
                            className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                            value={vehicleClassCode}
                            onChange={(e) => setVehicleClassCode(e.target.value)}
                          >
                            <option value="MINI">Mini (Hatchback)</option>
                            <option value="SEDAN">Sedan Prime</option>
                            <option value="SUV">SUV (6 Seater)</option>
                            <option value="EV">EV Prime (Electric)</option>
                          </select>
                        </div>
                      </div>
                    )}

                    {/* Passwords */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                      <div className="flex flex-col gap-space-2xs">
                        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="password">Password</label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">lock</span>
                          <input
                            className="w-full h-[52px] pl-11 pr-11 rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface outline-none transition-colors"
                            id="password"
                            name="password"
                            placeholder="Min 6 characters"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-space-2xs">
                        <label className="font-label-lg text-label-lg text-on-surface" htmlFor="confirmPassword">Confirm Password</label>
                        <div className="relative flex items-center">
                          <span className="material-symbols-outlined absolute left-space-md text-outline text-[20px] pointer-events-none">check_circle</span>
                          <input
                            className="w-full h-[52px] pl-11 pr-space-md rounded-xl bg-surface-container-low text-on-surface font-body-md text-body-md focus:bg-surface-container-lowest focus:ring-2 focus:ring-on-surface outline-none transition-colors"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Repeat password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      className="w-full h-14 mt-space-xs rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-headline-sm font-bold flex items-center justify-center gap-space-xs shadow-md hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer disabled:opacity-50"
                      type="submit"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span>Create My Account</span>
                          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                        </>
                      )}
                    </button>
                  </form>

                  <div className="text-center mt-space-lg">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Already have an account?{' '}
                      <Link to="/login" className="font-label-lg text-label-lg text-primary font-bold hover:underline">
                        Sign In Here
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