import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import GoogleMapView from '../../components/common/GoogleMapView';
import { vehicleService } from '../../services/vehicleService';

export default function BookACabPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [pickup, setPickup] = useState(searchParams.get('pickup') || 'Terminal 3, IGI Airport (Pillar 14)');
  const [dropoff, setDropoff] = useState(searchParams.get('dropoff') || 'DLF Cyber Hub, Sector 24, Gurugram');
  const [distanceKm, setDistanceKm] = useState(parseFloat(searchParams.get('distance')) || 14.8);
  const [durationMins, setDurationMins] = useState(parseInt(searchParams.get('duration')) || 28);
  const [routeSummary, setRouteSummary] = useState('NH-48 Expressway');
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);
  const [tripType, setTripType] = useState(searchParams.get('tripType') || 'CITY');

  const pickupInputRef = useRef(null);
  const dropoffInputRef = useRef(null);

  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicleCode, setSelectedVehicleCode] = useState('SEDAN');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVehicles() {
      try {
        const data = await vehicleService.getAll();
        setVehicles(data);
      } catch (err) {
        console.error('Failed to load vehicles:', err);
      } finally {
        setLoading(false);
      }
    }
    loadVehicles();
  }, []);

  const handleRouteCalculated = useCallback((info) => {
    if (info) {
      if (info.distanceKm !== undefined) {
        setDistanceKm(info.distanceKm);
      }
      if (info.durationMins !== undefined) {
        setDurationMins(info.durationMins);
      }
      if (info.routeSummary) {
        setRouteSummary(info.routeSummary);
      }
      setIsCalculatingRoute(false);
    }
  }, []);

  const handleGoogleLoaded = useCallback((google) => {
    if (!google || !google.maps || !google.maps.places) return;

    try {
      if (pickupInputRef.current) {
        const autocompletePickup = new google.maps.places.Autocomplete(pickupInputRef.current, {
          fields: ['formatted_address', 'name'],
        });
        autocompletePickup.addListener('place_changed', () => {
          const place = autocompletePickup.getPlace();
          const addr = place.formatted_address || place.name;
          if (addr) {
            setPickup(addr);
            setIsCalculatingRoute(true);
          }
        });
      }

      if (dropoffInputRef.current) {
        const autocompleteDropoff = new google.maps.places.Autocomplete(dropoffInputRef.current, {
          fields: ['formatted_address', 'name'],
        });
        autocompleteDropoff.addListener('place_changed', () => {
          const place = autocompleteDropoff.getPlace();
          const addr = place.formatted_address || place.name;
          if (addr) {
            setDropoff(addr);
            setIsCalculatingRoute(true);
          }
        });
      }
    } catch (e) {
      console.warn('Places Autocomplete initialization:', e);
    }
  }, []);

  const calculateFare = (v) => {
    if (!v) return 0;
    const base = Number(v.baseFare);
    const distanceCost = Number(v.perKmRate) * distanceKm;
    const platformFee = 15;
    const tax = (base + distanceCost + platformFee) * 0.05;
    return Math.round(base + distanceCost + platformFee + tax);
  };

  const selectedVehicle = vehicles.find((v) => v.code === selectedVehicleCode) || vehicles[0];
  const selectedFare = calculateFare(selectedVehicle);

  const handleProceedToCheckout = () => {
    const params = new URLSearchParams({
      pickup,
      dropoff,
      distance: distanceKm.toString(),
      duration: durationMins.toString(),
      vehicleCode: selectedVehicleCode,
      tripType,
      estimatedFare: selectedFare.toString(),
    }).toString();
    navigate(`/checkout?${params}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body-md text-on-surface antialiased">
      <Navbar />

      <main className="w-full pt-20 bg-background min-h-[calc(100vh-20rem)] flex-1">
        <div className="w-full max-w-container-max mx-auto px-gutter-mobile md:px-gutter-desktop py-space-lg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-start">
            {/* Left Console: Booking Form & Vehicle Class Picker */}
            <div className="lg:col-span-6 flex flex-col gap-space-lg">
              {/* Route Configuration Box */}
              <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-container flex flex-col gap-space-md">
                <div className="flex items-center justify-between">
                  <h2 className="font-headline-md text-headline-md text-on-surface font-bold">Route & Pickup Details</h2>
                  <span className="font-label-sm text-label-sm text-primary font-bold bg-surface-container-low px-2.5 py-1 rounded-full">
                    Step 1 of 2
                  </span>
                </div>

                {/* Pickup & Destination Inputs */}
                <div className="relative flex flex-col gap-space-xs">
                  <div className="absolute left-6 top-6 bottom-6 w-0.5 bg-dashed bg-outline-variant pointer-events-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-on-surface -ml-1"></div>
                    <div className="w-2.5 h-2.5 rounded-sm bg-primary-container -ml-1 mt-12"></div>
                  </div>

                  {/* Pickup */}
                  <div className="pl-12 pr-4 py-2.5 bg-surface-container-low rounded-xl flex items-center justify-between focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-on-surface transition-all">
                    <div className="flex-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">PICKUP POINT</span>
                      <input
                        ref={pickupInputRef}
                        type="text"
                        value={pickup}
                        onChange={(e) => {
                          setPickup(e.target.value);
                          setIsCalculatingRoute(true);
                        }}
                        placeholder="Enter pickup location..."
                        className="bg-transparent font-headline-sm text-headline-sm text-on-surface w-full outline-none"
                      />
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px]">near_me</span>
                  </div>

                  {/* Swap Locations Button */}
                  <div className="flex justify-end -my-1 z-10 pr-2">
                    <button
                      type="button"
                      onClick={() => {
                        const temp = pickup;
                        setPickup(dropoff);
                        setDropoff(temp);
                        setIsCalculatingRoute(true);
                      }}
                      title="Swap pickup and destination"
                      className="p-1.5 rounded-full bg-surface-container-high hover:bg-primary-container hover:text-on-primary-container text-on-surface-variant transition-all shadow-sm flex items-center justify-center"
                    >
                      <span className="material-symbols-outlined text-[18px]">swap_vert</span>
                    </button>
                  </div>

                  {/* Dropoff */}
                  <div className="pl-12 pr-4 py-2.5 bg-surface-container-low rounded-xl flex items-center justify-between focus-within:bg-surface-container-lowest focus-within:ring-2 focus-within:ring-on-surface transition-all">
                    <div className="flex-1">
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">DROP-OFF DESTINATION</span>
                      <input
                        ref={dropoffInputRef}
                        type="text"
                        value={dropoff}
                        onChange={(e) => {
                          setDropoff(e.target.value);
                          setIsCalculatingRoute(true);
                        }}
                        placeholder="Enter drop-off destination..."
                        className="bg-transparent font-headline-sm text-headline-sm text-on-surface w-full outline-none"
                      />
                    </div>
                    <span className="material-symbols-outlined text-primary text-[20px]">location_on</span>
                  </div>
                </div>

                {/* Trip Telemetry Stats Bar */}
                <div className="bg-surface-container-high/60 rounded-xl p-space-sm flex items-center justify-between flex-wrap gap-space-xs text-on-surface">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">straighten</span>
                    <span className="font-body-sm text-body-sm">
                      <strong className="font-bold">{distanceKm} km</strong> total
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                    <span className="font-body-sm text-body-sm">
                      <strong className="font-bold">{durationMins} mins</strong> travel time
                    </span>
                  </div>
                  <div className="w-1 h-1 rounded-full bg-outline-variant"></div>
                  <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md">
                    <span className="material-symbols-outlined text-[16px]">traffic</span>
                    <span className="font-label-sm text-label-sm font-semibold truncate max-w-[140px] sm:max-w-none">
                      {isCalculatingRoute ? 'Syncing...' : routeSummary || 'Google Live Route'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Vehicle Selection List */}
              <div className="flex flex-col gap-space-xs">
                <div className="flex items-center justify-between px-space-xs">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Choose Vehicle Class</h3>
                  <span className="font-label-sm text-label-sm text-on-surface-variant">Fares include tolls & service fees</span>
                </div>

                {loading ? (
                  <div className="p-8 text-center">
                    <div className="w-8 h-8 border-4 border-primary-container border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-space-xs" id="cabSelectorList">
                    {vehicles.map((v) => {
                      const isSelected = selectedVehicleCode === v.code;
                      const fare = calculateFare(v);
                      return (
                        <div
                          key={v.id}
                          onClick={() => setSelectedVehicleCode(v.code)}
                          className={`cursor-pointer relative p-space-md rounded-xl flex items-center justify-between gap-space-md transition-all ${
                            isSelected
                              ? 'bg-surface-container-low shadow-md ring-2 ring-primary-container'
                              : 'bg-surface-container-lowest hover:bg-surface-container-low shadow-sm'
                          }`}
                        >
                          {v.isPopular && (
                            <span className="absolute -top-2.5 left-space-md bg-primary-container text-on-primary-container font-label-sm text-label-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                              <span className="material-symbols-outlined text-[13px]">thumb_up</span>
                              Popular Choice
                            </span>
                          )}

                          <div className="flex items-center gap-space-md">
                            <div
                              className={`w-16 h-12 rounded-lg flex items-center justify-center shrink-0 ${
                                isSelected ? 'bg-primary-fixed text-primary' : 'bg-surface-container-low text-on-surface'
                              }`}
                            >
                              <span className="material-symbols-outlined text-[32px]">{v.iconName}</span>
                            </div>
                            <div className="flex flex-col">
                              <div className="flex items-center gap-space-xs">
                                <span className="font-headline-sm text-headline-sm text-on-surface">{v.name}</span>
                                <span className="inline-flex items-center gap-0.5 bg-surface-container px-1.5 py-0.5 rounded text-on-surface font-label-sm text-label-sm">
                                  <span className="material-symbols-outlined text-[14px]">person</span> {v.capacity}
                                </span>
                              </div>
                              <span className="font-body-sm text-body-sm text-on-surface-variant">{v.description}</span>
                              <div className="flex items-center gap-1 text-primary mt-1 font-label-sm text-label-sm font-semibold">
                                <span className="material-symbols-outlined text-[14px]">speed</span>
                                <span>{v.etaMinutes} mins away</span>
                                <span className="text-on-surface-variant font-normal">• ₹{v.perKmRate}/km</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-end shrink-0">
                            <span className="font-headline-lg text-headline-lg text-on-surface font-extrabold">₹{fare}</span>
                            <span className="font-label-sm text-label-sm text-on-surface-variant">Guaranteed Price</span>
                            {isSelected && (
                              <span className="w-2.5 h-2.5 rounded-full bg-primary-container mt-1.5 ring-2 ring-surface-container-lowest"></span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Proceed to Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full h-14 bg-primary-container hover:bg-tertiary-container text-on-primary-container font-headline-sm text-headline-sm font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-space-xs cursor-pointer"
              >
                <span>Proceed to Checkout (₹{selectedFare})</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            </div>

            {/* Right Rail: Interactive Google Map */}
            <div className="lg:col-span-6 sticky top-24">
              <GoogleMapView
                pickup={pickup}
                dropoff={dropoff}
                onRouteCalculated={handleRouteCalculated}
                onGoogleLoaded={handleGoogleLoaded}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}