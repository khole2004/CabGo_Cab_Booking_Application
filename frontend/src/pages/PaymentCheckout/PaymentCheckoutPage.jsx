import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { bookingService } from '../../services/bookingService';
import { paymentService } from '../../services/paymentService';
import { userService } from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

export default function PaymentCheckoutPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAuth();

  const pickup = searchParams.get('pickup') || 'Terminal 3, IGI Airport (Commercial Pillar 14)';
  const dropoff = searchParams.get('dropoff') || 'DLF Cyber Hub, Sector 24, Gurugram';
  const distanceKm = parseFloat(searchParams.get('distance')) || 14.8;
  const durationMins = parseInt(searchParams.get('duration')) || 28;
  const vehicleCode = searchParams.get('vehicleCode') || 'SEDAN';
  const tripType = searchParams.get('tripType') || 'CITY';

  const [paymentMethod, setPaymentMethod] = useState('UPI'); // UPI, CARD, WALLET, NETBANKING, CASH
  const [upiId, setUpiId] = useState('ananya.sharma@okaxis');
  const [cardNumber, setCardNumber] = useState('4532 8412 9012 3456');
  const [couponCode, setCouponCode] = useState('FIRST50');
  const [appliedDiscount, setAppliedDiscount] = useState(50.00);
  const [couponMessage, setCouponMessage] = useState('FIRST50 applied: ₹50 discount');
  const [greenOffset, setGreenOffset] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Cost calculations
  const baseFare = vehicleCode === 'MINI' ? 50 : vehicleCode === 'SEDAN' ? 80 : vehicleCode === 'SUV' ? 120 : 90;
  const perKmRate = vehicleCode === 'MINI' ? 12 : vehicleCode === 'SEDAN' ? 15 : vehicleCode === 'SUV' ? 20 : 16;
  const distanceFare = distanceKm * perKmRate;
  const platformFee = 15.00;
  const subTotal = baseFare + distanceFare + platformFee;
  const taxFare = subTotal * 0.05;
  const carbonOffsetFee = greenOffset ? 2.00 : 0.00;
  const totalFare = Math.max(0, subTotal + taxFare + carbonOffsetFee - appliedDiscount);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const coupon = await userService.verifyCoupon(couponCode.trim());
      if (coupon) {
        let disc = 0;
        if (coupon.discountType === 'PERCENTAGE') {
          disc = (subTotal * Number(coupon.discountValue)) / 100;
          if (coupon.maxDiscount && disc > Number(coupon.maxDiscount)) {
            disc = Number(coupon.maxDiscount);
          }
        } else {
          disc = Number(coupon.discountValue);
        }
        setAppliedDiscount(disc);
        setCouponMessage(`${coupon.code} applied: -₹${disc.toFixed(2)}`);
      }
    } catch {
      // Offline / fallback calculation if promo endpoint unreachable
      if (couponCode.toUpperCase() === 'FIRST50') {
        setAppliedDiscount(50.0);
        setCouponMessage('FIRST50 applied: -₹50.00');
      } else if (couponCode.toUpperCase() === 'CABGO100') {
        setAppliedDiscount(100.0);
        setCouponMessage('CABGO100 applied: -₹100.00');
      } else {
        setCouponMessage('Invalid coupon code');
        setAppliedDiscount(0);
      }
    }
  };

  const handleConfirmRide = async () => {
    if (!isAuthenticated) {
      navigate(`/login?redirect=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const bookingData = {
        vehicleClassCode: vehicleCode,
        tripType,
        pickupAddress: pickup,
        dropoffAddress: dropoff,
        distanceKm,
        durationMinutes: durationMins,
        carbonOffsetFee,
        promoCode: appliedDiscount > 0 ? couponCode : null,
        paymentMethod,
      };

      const bookingRes = await bookingService.create(bookingData);
      const createdBooking = bookingRes.data;

      // Process payment record
      await paymentService.processPayment({
        bookingId: createdBooking.id,
        paymentMethod,
        amount: totalFare,
        transactionReference: `TXN-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      });

      navigate(`/tracking/${createdBooking.bookingReference}`);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to confirm booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        {/* Checkout Stepper Header Bar */}
        <div className="w-full bg-surface-container-lowest shadow-sm border-b border-surface-container">
          <div className="max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-sm flex flex-col md:flex-row md:items-center md:justify-between gap-space-sm">
            <div className="flex items-center gap-space-md">
              <Link
                to="/book-a-cab"
                className="inline-flex items-center gap-space-xs font-label-lg text-label-lg text-on-surface-variant hover:text-on-surface bg-surface-container-low hover:bg-surface-container px-space-sm py-space-xs rounded-full transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                <span>Back to Ride Options</span>
              </Link>
              <div className="flex items-center gap-space-xs">
                <span className="px-space-xs py-0.5 rounded-full bg-primary-container text-on-primary-container font-label-sm text-label-sm uppercase tracking-wide">
                  Step 2 of 2
                </span>
                <span className="font-headline-sm text-headline-sm text-on-surface">Review & Secure Payment</span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs bg-surface-container-low px-space-md py-space-xs rounded-full self-start md:self-auto">
              <span className="material-symbols-outlined text-primary text-[18px]">lock</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant font-medium">
                256-Bit SSL Encrypted • RBI & PCI-DSS Level 1 Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Primary Layout */}
        <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-xl">
          {error && (
            <div className="p-4 mb-6 rounded-xl bg-error-container text-on-error-container text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Column (7 cols): Payment Instrument Selectors */}
            <div className="lg:col-span-7 flex flex-col gap-space-lg">
              {/* Recommended & Saved Methods */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container">
                <div className="flex items-center justify-between mb-space-sm">
                  <div className="flex items-center gap-space-xs">
                    <span className="material-symbols-outlined text-primary text-[20px]">history_toggle_off</span>
                    <h2 className="font-headline-sm text-headline-sm text-on-surface">Recommended & Saved Methods</h2>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface-variant bg-surface-container px-space-xs py-0.5 rounded-full">
                    Instant 1-Tap
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm mt-space-xs">
                  {/* Saved GPay */}
                  <label
                    onClick={() => setPaymentMethod('UPI')}
                    className={`cursor-pointer flex items-start gap-space-sm p-space-sm rounded-xl transition-all border ${
                      paymentMethod === 'UPI'
                        ? 'bg-surface-container-low border-primary-container shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'UPI'}
                      onChange={() => setPaymentMethod('UPI')}
                      className="mt-1 accent-primary-container"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">Google Pay UPI</span>
                        <span className="font-label-sm text-label-sm text-tertiary bg-tertiary-fixed px-space-2xs rounded">
                          Preferred
                        </span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">{upiId}</span>
                      <span className="font-label-sm text-label-sm text-primary mt-space-2xs flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">bolt</span> Fastest checkout (~4s)
                      </span>
                    </div>
                  </label>

                  {/* Saved Card */}
                  <label
                    onClick={() => setPaymentMethod('CARD')}
                    className={`cursor-pointer flex items-start gap-space-sm p-space-sm rounded-xl transition-all border ${
                      paymentMethod === 'CARD'
                        ? 'bg-surface-container-low border-primary-container shadow-sm'
                        : 'bg-surface-container-lowest hover:bg-surface-container-low border-surface-container'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_choice"
                      checked={paymentMethod === 'CARD'}
                      onChange={() => setPaymentMethod('CARD')}
                      className="mt-1 accent-primary-container"
                    />
                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-label-lg text-label-lg text-on-surface font-semibold">HDFC Millennia</span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">VISA</span>
                      </div>
                      <span className="font-body-sm text-body-sm text-on-surface-variant truncate">•••• 8412 • Exp 09/27</span>
                      <span className="font-label-sm text-label-sm text-secondary mt-space-2xs">5% Cashback Eligible</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Master Payment Selection Tabs */}
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm border border-surface-container">
                <div className="flex items-center justify-between mb-space-md">
                  <div>
                    <h2 className="font-headline-lg text-headline-lg text-on-surface">Select Payment Method</h2>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Encrypted transaction handled securely with dynamic tokenization
                    </p>
                  </div>
                  <div className="p-space-xs bg-surface-container-low rounded-lg text-on-surface-variant">
                    <span className="material-symbols-outlined">shield</span>
                  </div>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-space-xs mb-space-lg">
                  {[
                    { id: 'UPI', label: 'UPI', icon: 'qr_code_scanner' },
                    { id: 'CARD', label: 'Cards', icon: 'credit_card' },
                    { id: 'WALLET', label: 'Wallet', icon: 'account_balance_wallet' },
                    { id: 'NETBANKING', label: 'Net Banking', icon: 'account_balance' },
                    { id: 'CASH', label: 'Cash on Arrival', icon: 'payments' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`flex flex-col items-center justify-center p-space-sm rounded-xl transition-all text-center border ${
                        paymentMethod === tab.id
                          ? 'bg-surface-container-low border-primary-container shadow-sm'
                          : 'bg-surface-container-lowest border-surface-container hover:bg-surface-container-low'
                      }`}
                    >
                      <div
                        className={`w-2.5 h-2.5 rounded-full mb-space-2xs ${
                          paymentMethod === tab.id ? 'bg-primary-container' : 'bg-surface-container-high'
                        }`}
                      ></div>
                      <span className="material-symbols-outlined text-[24px] text-on-surface">{tab.icon}</span>
                      <span className="font-label-sm text-label-sm text-on-surface font-bold mt-1">{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Active Tab Configuration Input */}
                <div className="p-4 bg-surface-container-low rounded-xl">
                  {paymentMethod === 'UPI' && (
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-on-surface">Enter UPI ID / VPA</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="flex-1 h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                          placeholder="e.g. mobile@upi"
                        />
                        <button type="button" className="px-4 bg-primary-container text-on-primary-container font-label-md font-bold rounded-lg">
                          Verify
                        </button>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CARD' && (
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-on-surface">Credit / Debit Card Details</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                        placeholder="Card Number"
                      />
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <input
                          type="text"
                          defaultValue="09/27"
                          className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                          placeholder="MM/YY"
                        />
                        <input
                          type="password"
                          defaultValue="***"
                          maxLength={4}
                          className="h-11 px-3 bg-surface-container-lowest rounded-lg border border-surface-container outline-none"
                          placeholder="CVV"
                        />
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'WALLET' && (
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-label-md text-on-surface block font-bold">CabGo Cash Balance</span>
                        <span className="font-body-sm text-on-surface-variant">Instant 1-click deduction</span>
                      </div>
                      <span className="font-headline-sm text-headline-sm text-primary font-bold">₹1,250.00</span>
                    </div>
                  )}

                  {paymentMethod === 'NETBANKING' && (
                    <div className="flex flex-col gap-2">
                      <label className="font-label-md text-on-surface">Popular Banks</label>
                      <div className="grid grid-cols-3 gap-2 text-center text-xs font-semibold">
                        <span className="p-2 bg-surface-container-lowest rounded-lg border border-surface-container cursor-pointer hover:bg-surface-container-high">HDFC Bank</span>
                        <span className="p-2 bg-surface-container-lowest rounded-lg border border-surface-container cursor-pointer hover:bg-surface-container-high">ICICI Bank</span>
                        <span className="p-2 bg-surface-container-lowest rounded-lg border border-surface-container cursor-pointer hover:bg-surface-container-high">SBI</span>
                      </div>
                    </div>
                  )}

                  {paymentMethod === 'CASH' && (
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-green-700 text-[28px]">payments</span>
                      <p className="font-body-sm text-on-surface">
                        Pay exact cash of <strong>₹{totalFare.toFixed(2)}</strong> directly to your driver captain upon ride completion.
                      </p>
                    </div>
                  )}
                </div>

                {/* Promo Code Apply Box */}
                <form onSubmit={handleApplyCoupon} className="mt-space-md pt-space-md border-t border-surface-container flex flex-col gap-2">
                  <label className="font-label-sm text-label-sm text-on-surface-variant font-bold uppercase">
                    Apply Promo or Discount Voucher
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder="e.g. FIRST50, CABGO100"
                      className="flex-1 h-11 px-3 bg-surface-container-low rounded-lg border border-surface-container font-mono text-on-surface uppercase outline-none"
                    />
                    <button
                      type="submit"
                      className="px-space-md bg-surface-container-high hover:bg-surface-container text-on-surface font-label-md font-bold rounded-lg transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <span className="font-label-sm text-label-sm text-primary font-semibold">{couponMessage}</span>
                  )}
                </form>
              </div>

              {/* Fare Lock Guarantee Card */}
              <div className="bg-gradient-to-r from-surface-container to-surface-container-high rounded-xl p-space-md flex items-center justify-between gap-space-md shadow-sm">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container">
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                  </div>
                  <div>
                    <h3 className="font-headline-sm text-headline-sm text-on-surface">CabGo Fare Lock Guarantee</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant">
                      No hidden mid-trip surge, toll surprises, or wait-time increments for GPS route traffic delays.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-block font-label-sm text-label-sm text-on-surface-variant bg-surface-container-lowest px-space-xs py-1 rounded-full whitespace-nowrap">
                  100% Transparent
                </span>
              </div>
            </div>

            {/* Right Column (5 cols, sticky): Itemized Breakdown & Order Summary */}
            <div className="lg:col-span-5 flex flex-col gap-space-lg lg:sticky lg:top-24">
              <div className="bg-surface-container-lowest rounded-xl p-space-lg shadow-md border border-surface-container flex flex-col gap-space-md">
                {/* Trip Header Meta */}
                <div className="flex items-start justify-between pb-space-sm border-b border-surface-container">
                  <div>
                    <div className="flex items-center gap-space-xs">
                      <span className="font-headline-md text-headline-md text-on-surface font-bold">Trip Summary</span>
                      <span className="px-space-xs py-0.5 rounded bg-surface-container-high font-label-sm text-label-sm text-on-surface-variant font-mono">
                        #CG-CONFIRM
                      </span>
                    </div>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">Immediate Departure</span>
                  </div>
                  <div className="flex items-center gap-1 bg-surface-container-low px-space-xs py-1 rounded-full text-on-surface font-label-sm text-label-sm">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span>Prime Driver Nearby</span>
                  </div>
                </div>

                {/* Driver Teaser */}
                <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-sm">
                      <span className="material-symbols-outlined text-[28px] text-primary-container">directions_car</span>
                    </div>
                    <div>
                      <h4 className="font-headline-sm text-headline-sm text-on-surface">CabGo {vehicleCode} Prime</h4>
                      <p className="font-body-sm text-body-sm text-on-surface-variant">AC 4 Seater • Fast Dispatch</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-label-sm text-label-sm text-on-surface bg-surface-container-lowest px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                      <span className="text-primary-container font-bold">★</span> 4.96
                    </div>
                    <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">Rajesh K.</p>
                  </div>
                </div>

                {/* Vertical Timeline */}
                <div className="p-space-sm rounded-xl bg-surface-container-low flex flex-col gap-space-xs">
                  <div className="flex items-start gap-space-sm">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-3 h-3 rounded-full bg-on-surface"></div>
                      <div className="w-0.5 h-8 bg-surface-container-highest my-0.5"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Pickup (Now)</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">{pickup}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-space-sm">
                    <div className="flex flex-col items-center mt-1">
                      <div className="w-3 h-3 rounded bg-primary-container"></div>
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Destination (~{durationMins} mins)</span>
                      <span className="font-label-lg text-label-lg text-on-surface font-bold truncate">{dropoff}</span>
                    </div>
                  </div>
                </div>

                {/* Itemized Fare List */}
                <div className="flex flex-col gap-2 pt-2 text-body-sm">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Base Fare ({vehicleCode})</span>
                    <span className="font-mono">₹{baseFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Distance Fee ({distanceKm} km × ₹{perKmRate})</span>
                    <span className="font-mono">₹{distanceFare.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Platform Fee</span>
                    <span className="font-mono">₹{platformFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>GST (5%)</span>
                    <span className="font-mono">₹{taxFare.toFixed(2)}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Promo Discount</span>
                      <span className="font-mono">-₹{appliedDiscount.toFixed(2)}</span>
                    </div>
                  )}
                  {greenOffset && (
                    <div className="flex justify-between text-green-700">
                      <span>Carbon Neutral Offset (3.2 kg CO₂)</span>
                      <span className="font-mono">+₹2.00</span>
                    </div>
                  )}
                  <div className="h-px bg-surface-container my-1"></div>
                  <div className="flex justify-between items-baseline">
                    <span className="font-headline-sm text-headline-sm text-on-surface font-bold">Total Payable</span>
                    <span className="font-price-display text-price-display text-on-surface font-extrabold">
                      ₹{totalFare.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Carbon Offset Toggle */}
                <div className="p-space-xs rounded-lg bg-surface-container-low flex items-center justify-between">
                  <label className="flex items-center gap-space-xs cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={greenOffset}
                      onChange={(e) => setGreenOffset(e.target.checked)}
                      className="w-3.5 h-3.5 rounded accent-primary-container"
                    />
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      Offset 3.2 kg CO₂ emissions for ₹2
                    </span>
                  </label>
                  <span className="material-symbols-outlined text-green-700 text-[18px]">park</span>
                </div>

                {/* Definitive Call To Action Button */}
                <button
                  type="button"
                  onClick={handleConfirmRide}
                  disabled={loading}
                  className="w-full h-14 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-headline-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-space-xs cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Book Ride • ₹{totalFare.toFixed(2)}</span>
                      <span className="material-symbols-outlined">arrow_forward</span>
                    </>
                  )}
                </button>

                <div className="flex flex-col gap-space-2xs text-on-surface-variant font-label-sm text-label-sm pt-space-2xs">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-green-600 text-[16px]">check_circle</span>
                    <span>Free cancellation up to 5 minutes after driver match</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[16px]">shield_person</span>
                    <span>CabGo SOS Telemetry & Live Trip Sharing active</span>
                  </div>
                </div>
              </div>

              {/* Priority Helpline Card */}
              <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-sm border border-surface-container flex items-center justify-between">
                <div className="flex items-center gap-space-xs">
                  <span className="material-symbols-outlined text-on-surface-variant">contact_support</span>
                  <div>
                    <span className="font-label-sm text-label-sm text-on-surface font-bold block">Need Help?</span>
                    <span className="font-body-sm text-body-sm text-on-surface-variant">24/7 Priority Rider Helpline</span>
                  </div>
                </div>
                <a
                  className="px-space-sm py-1 rounded-full bg-surface-container font-label-sm text-label-sm text-on-surface hover:bg-surface-container-high transition-colors font-mono"
                  href="tel:18005552224"
                >
                  +1 (800) 555-CABGO
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}