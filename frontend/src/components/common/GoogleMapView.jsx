import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { mapsService } from '../../services/mapsService';

/**
 * Bearing angle calculation between two points in degrees [0, 360)
 */
function calculateBearing(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;

  const y = Math.sin(toRad(lon2 - lon1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lon2 - lon1));
  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return Math.round(bearing);
}

/**
 * Custom Vector Pin for Pickup (Green with pulse)
 */
const createPickupIcon = () =>
  L.divIcon({
    className: 'cabgo-pickup-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.35);
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #059669;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(5, 150, 105, 0.5);
          border: 2.5px solid white;
          font-weight: 800;
          font-family: sans-serif;
          font-size: 14px;
        ">
          A
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #059669;
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -42],
  });

/**
 * Custom Vector Pin for Destination (Red with pulse)
 */
const createDropoffIcon = () =>
  L.divIcon({
    className: 'cabgo-dropoff-marker',
    html: `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
        <div style="
          position: absolute;
          top: -4px;
          left: 50%;
          transform: translateX(-50%);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: rgba(239, 68, 68, 0.35);
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: relative;
          z-index: 10;
          width: 36px;
          height: 36px;
          border-radius: 12px;
          background: #dc2626;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(220, 38, 38, 0.5);
          border: 2.5px solid white;
          font-weight: 800;
          font-family: sans-serif;
          font-size: 14px;
        ">
          B
        </div>
        <div style="
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 7px solid #dc2626;
          margin-top: -1px;
        "></div>
      </div>
    `,
    iconSize: [36, 42],
    iconAnchor: [18, 42],
    popupAnchor: [0, -42],
  });

/**
 * Animated Taxi / Cab Icon
 */
const createTaxiIcon = (bearing = 0) =>
  L.divIcon({
    className: 'cabgo-taxi-marker',
    html: `
      <div id="cabgo-taxi-element" style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: translate(-50%, -50%) rotate(${bearing}deg);
        transition: transform 0.15s ease-out;
      ">
        <div style="
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(217, 119, 6, 0.6), 0 0 0 3px #ffffff;
          color: #ffffff;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z"/>
            <circle cx="7.5" cy="14.5" r="1.5"/>
            <circle cx="16.5" cy="14.5" r="1.5"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });

export default function GoogleMapView({ pickup, dropoff, onRouteCalculated, onGoogleLoaded }) {
  const mapContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const tileLayerRef = useRef(null);
  const routeGroupRef = useRef(null);
  const taxiMarkerRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [apiKey, setApiKey] = useState(mapsService.getApiKey());
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);
  const [isTrafficEnabled, setIsTrafficEnabled] = useState(false);
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'
  const [isGoogleLoaded, setIsGoogleLoaded] = useState(false);

  const [routeInfo, setRouteInfo] = useState({
    distanceKm: 11.1,
    durationMins: 16,
    routeSummary: 'NH-48 Expressway Route',
    isRealGoogle: false,
    loading: true,
    coordinates: [],
  });

  // Attempt to load official Google Maps JS SDK if API key is provided
  useEffect(() => {
    const key = mapsService.getApiKey();
    if (!key) return;

    mapsService
      .loadGoogleMapsScript(key)
      .then((google) => {
        if (google && google.maps) {
          setIsGoogleLoaded(true);
          if (onGoogleLoaded) onGoogleLoaded(google);
        }
      })
      .catch((err) => {
        console.warn('Official Google Maps JS SDK could not be loaded with key:', err);
      });
  }, [onGoogleLoaded]);

  // Initialize Leaflet Map Instance with Google Maps Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!leafletMapRef.current) {
      const map = L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
        center: [28.5355, 77.0900], // Delhi NCR / NH-48 Corridor
        zoom: 12,
      });

      // Default Google Maps Roadmap tile layer
      const tileLayer = L.tileLayer(
        'https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        {
          maxZoom: 20,
          subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        }
      ).addTo(map);
      tileLayerRef.current = tileLayer;

      // LayerGroup to hold route line, markers, and taxi
      const routeGroup = L.layerGroup().addTo(map);
      routeGroupRef.current = routeGroup;

      leafletMapRef.current = map;
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        tileLayerRef.current = null;
        routeGroupRef.current = null;
        taxiMarkerRef.current = null;
      }
    };
  }, []);

  // Update Google Maps Tile Layer when Traffic or Map Type changes
  useEffect(() => {
    if (!tileLayerRef.current) return;

    let lyrs = 'm'; // Standard roadmap
    if (mapType === 'satellite') {
      lyrs = isTrafficEnabled ? 'y,traffic' : 'y'; // Hybrid satellite
    } else {
      lyrs = isTrafficEnabled ? 'm,traffic' : 'm'; // Roadmap with live traffic
    }

    tileLayerRef.current.setUrl(`https://{s}.google.com/vt/lyrs=${lyrs}&x={x}&y={y}&z={z}`);
  }, [isTrafficEnabled, mapType]);

  // Calculate Route & Telemetry when pickup or dropoff changes
  useEffect(() => {
    let isCancelled = false;

    async function fetchRouteTelemetry() {
      if (!pickup || !dropoff) return;

      setRouteInfo((prev) => ({ ...prev, loading: true }));

      // 1. Try Google Maps DirectionsService if SDK is loaded and authenticated
      if (window.google && window.google.maps && window.google.maps.DirectionsService) {
        try {
          const googleRes = await mapsService.calculateGoogleRoute(pickup, dropoff, window.google);
          if (isCancelled) return;

          let coords = [];
          if (googleRes.directionsResult?.routes?.[0]?.overview_path) {
            coords = googleRes.directionsResult.routes[0].overview_path.map((pt) => [
              pt.lat(),
              pt.lng(),
            ]);
          }

          const newInfo = {
            distanceKm: googleRes.distanceKm,
            durationMins: googleRes.durationMins,
            routeSummary: googleRes.routeSummary,
            isRealGoogle: true,
            loading: false,
            coordinates: coords,
          };
          setRouteInfo(newInfo);
          if (onRouteCalculated) onRouteCalculated(newInfo);
          return;
        } catch (err) {
          console.warn('Google DirectionsService failed, using fallback route:', err);
        }
      }

      // 2. High-Res Road Routing Engine (OSRM / Smart NCR Geocoding)
      try {
        const fallbackRes = await mapsService.calculateFallbackRoute(pickup, dropoff);
        if (isCancelled) return;

        const newInfo = {
          distanceKm: fallbackRes.distanceKm,
          durationMins: fallbackRes.durationMins,
          routeSummary: fallbackRes.routeSummary,
          isRealGoogle: false,
          loading: false,
          coordinates: fallbackRes.polylineCoords || [],
        };
        setRouteInfo(newInfo);
        if (onRouteCalculated) onRouteCalculated(newInfo);
      } catch (err) {
        console.error('Routing calculation failed:', err);
        if (!isCancelled) {
          setRouteInfo((prev) => ({ ...prev, loading: false }));
        }
      }
    }

    fetchRouteTelemetry();

    return () => {
      isCancelled = true;
    };
  }, [pickup, dropoff, onRouteCalculated]);

  // Render Route Polyline, Custom Pins, and Animated Taxi on the Map
  useEffect(() => {
    if (!leafletMapRef.current || !routeGroupRef.current) return;

    // Clear previous elements and stop animation
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    routeGroupRef.current.clearLayers();

    const coords = routeInfo.coordinates;
    if (!coords || coords.length === 0) return;

    // Outer Glow / Road Casing Line
    const casing = L.polyline(coords, {
      color: '#9a3412',
      weight: 9,
      opacity: 0.35,
      lineCap: 'round',
      lineJoin: 'round',
    });
    casing.addTo(routeGroupRef.current);

    // Inner Luminous Brand Amber Route Line
    const routeLine = L.polyline(coords, {
      color: '#ea580c',
      weight: 5,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
    });
    routeLine.addTo(routeGroupRef.current);

    // Pickup Marker (Point A)
    const pickupMarker = L.marker(coords[0], {
      icon: createPickupIcon(),
      zIndexOffset: 1000,
    }).bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <div style="color: #059669; font-weight: 700; text-transform: uppercase; font-size: 11px; margin-bottom: 2px;">
          📍 Pickup Point
        </div>
        <div style="color: #0f172a; font-weight: 600; font-size: 13px;">
          ${pickup || 'Pickup Location'}
        </div>
      </div>
    `);
    pickupMarker.addTo(routeGroupRef.current);

    // Dropoff Marker (Point B)
    const dropoffMarker = L.marker(coords[coords.length - 1], {
      icon: createDropoffIcon(),
      zIndexOffset: 1000,
    }).bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <div style="color: #dc2626; font-weight: 700; text-transform: uppercase; font-size: 11px; margin-bottom: 2px;">
          🏁 Drop-off Destination
        </div>
        <div style="color: #0f172a; font-weight: 600; font-size: 13px;">
          ${dropoff || 'Destination'}
        </div>
      </div>
    `);
    dropoffMarker.addTo(routeGroupRef.current);

    // Initial Taxi Marker
    const initialBearing =
      coords.length > 1 ? calculateBearing(coords[0][0], coords[0][1], coords[1][0], coords[1][1]) : 0;
    const taxiMarker = L.marker(coords[0], {
      icon: createTaxiIcon(initialBearing),
      zIndexOffset: 2000,
    }).bindPopup(`
      <div style="font-family: system-ui, sans-serif; padding: 4px;">
        <div style="color: #d97706; font-weight: 700; text-transform: uppercase; font-size: 11px; margin-bottom: 2px;">
          🚖 CabGo Driver En Route
        </div>
        <div style="color: #0f172a; font-weight: 600; font-size: 13px;">
          Live Telemetry Active
        </div>
        <div style="color: #64748b; font-size: 11px; margin-top: 2px;">
          ETA ~${routeInfo.durationMins} mins (${routeInfo.distanceKm} km)
        </div>
      </div>
    `);
    taxiMarker.addTo(routeGroupRef.current);
    taxiMarkerRef.current = taxiMarker;

    // Auto-fit bounds with padding for controls
    try {
      leafletMapRef.current.fitBounds(routeLine.getBounds(), {
        paddingTopLeft: [60, 60],
        paddingBottomRight: [60, 110],
        maxZoom: 15,
      });
    } catch (e) {
      console.warn('fitBounds error:', e);
    }

    // Animate Taxi along the route
    if (coords.length > 1) {
      const totalSteps = coords.length;
      const loopDurationMs = Math.max(12000, totalSteps * 150); // smooth progression
      let startTime = null;

      const animateLoop = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const elapsed = (timestamp - startTime) % loopDurationMs;
        const progress = elapsed / loopDurationMs; // 0 to 1

        const exactIndex = progress * (totalSteps - 1);
        const currentIndex = Math.floor(exactIndex);
        const nextIndex = Math.min(currentIndex + 1, totalSteps - 1);
        const segmentProgress = exactIndex - currentIndex;

        const currentPoint = coords[currentIndex];
        const nextPoint = coords[nextIndex];

        // Linear interpolation between the two points
        const lat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * segmentProgress;
        const lng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * segmentProgress;

        const bearing = calculateBearing(
          currentPoint[0],
          currentPoint[1],
          nextPoint[0],
          nextPoint[1]
        );

        if (taxiMarkerRef.current) {
          taxiMarkerRef.current.setLatLng([lat, lng]);
          const taxiEl = document.getElementById('cabgo-taxi-element');
          if (taxiEl) {
            taxiEl.style.transform = `translate(-50%, -50%) rotate(${bearing}deg)`;
          }
        }

        animationFrameRef.current = requestAnimationFrame(animateLoop);
      };

      animationFrameRef.current = requestAnimationFrame(animateLoop);
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [routeInfo.coordinates, pickup, dropoff, routeInfo.durationMins, routeInfo.distanceKm]);

  // Recenter / Fit bounds helper
  const handleRecenter = () => {
    if (!leafletMapRef.current || !routeInfo.coordinates?.length) return;
    const polyline = L.polyline(routeInfo.coordinates);
    leafletMapRef.current.fitBounds(polyline.getBounds(), {
      paddingTopLeft: [60, 60],
      paddingBottomRight: [60, 110],
      maxZoom: 15,
    });
  };

  // Zoom helpers
  const handleZoomIn = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomIn();
  };
  const handleZoomOut = () => {
    if (leafletMapRef.current) leafletMapRef.current.zoomOut();
  };

  // Toggle Live Traffic Layer
  const toggleTraffic = () => {
    setIsTrafficEnabled((prev) => !prev);
  };

  // Toggle Map Type (Roadmap vs Satellite)
  const toggleMapType = () => {
    setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'));
  };

  // Handle saving API key
  const handleSaveApiKey = () => {
    mapsService.saveApiKey(tempApiKey);
    setApiKey(tempApiKey);
    setApiKeyModalOpen(false);
    window.location.reload();
  };

  return (
    <div className="relative w-full h-[640px] rounded-2xl overflow-hidden shadow-md border border-surface-container bg-slate-100 flex flex-col select-none">
      {/* Scoped CSS for Leaflet inside Tailwind */}
      <style>{`
        .leaflet-container {
          width: 100%;
          height: 100%;
          font-family: inherit;
        }
        .leaflet-container img {
          max-width: none !important;
        }
        .leaflet-pane {
          z-index: 1 !important;
        }
        .leaflet-top,
        .leaflet-bottom {
          z-index: 2 !important;
        }
      `}</style>

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
        {/* Telemetry Status Badge */}
        <div className="p-space-xs px-3 bg-surface-container-lowest/95 backdrop-blur-md rounded-xl shadow-md flex items-center gap-2 pointer-events-auto border border-surface-container/60">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="font-label-sm text-label-sm text-on-surface font-semibold truncate max-w-[240px] sm:max-w-none">
            {routeInfo.loading
              ? 'Calculating Google Route...'
              : `GPS Routing Live • via ${routeInfo.routeSummary || 'NH-48 Corridor'}`}
          </span>
        </div>

        {/* Right Tools: Satellite, Traffic & Google API Key Settings */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {/* Map Type Toggle */}
          <button
            type="button"
            onClick={toggleMapType}
            title={mapType === 'roadmap' ? 'Switch to Google Satellite' : 'Switch to Roadmap'}
            className="px-2.5 py-1.5 rounded-xl font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm transition-all border bg-surface-container-lowest/95 text-on-surface hover:bg-surface-container-low border-surface-container/60 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">
              {mapType === 'roadmap' ? 'satellite_alt' : 'map'}
            </span>
            <span className="hidden sm:inline">
              {mapType === 'roadmap' ? 'Satellite' : 'Roadmap'}
            </span>
          </button>

          {/* Traffic Toggle */}
          <button
            type="button"
            onClick={toggleTraffic}
            title="Toggle Live Google Traffic Layer"
            className={`px-2.5 py-1.5 rounded-xl font-label-sm text-label-sm font-semibold flex items-center gap-1 shadow-sm transition-all border cursor-pointer ${
              isTrafficEnabled
                ? 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-600/30'
                : 'bg-surface-container-lowest/95 text-on-surface hover:bg-surface-container-low border-surface-container/60'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">traffic</span>
            <span className="hidden sm:inline">Traffic</span>
          </button>

          {/* Set Key Dialog */}
          <button
            type="button"
            onClick={() => setApiKeyModalOpen(true)}
            title="Configure Google Maps API Key"
            className="px-2.5 py-1.5 rounded-xl font-label-sm text-label-sm font-semibold bg-surface-container-lowest/95 hover:bg-surface-container-low text-on-surface shadow-sm border border-surface-container/60 flex items-center gap-1 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px] text-primary">key</span>
            <span className="hidden md:inline">{apiKey ? 'Google Key Active' : 'Set Google Key'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Google Map Container */}
      <div ref={mapContainerRef} className="w-full h-full" id="cabgo-google-map-container" />

      {/* Floating Map Zoom & Recenter Controls (Right Side) */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          type="button"
          onClick={handleRecenter}
          title="Recenter Route"
          className="w-9 h-9 rounded-xl bg-surface-container-lowest/95 hover:bg-surface-container-low text-on-surface shadow-md border border-surface-container/70 flex items-center justify-center transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px] text-primary">my_location</span>
        </button>
        <button
          type="button"
          onClick={handleZoomIn}
          title="Zoom In"
          className="w-9 h-9 rounded-xl bg-surface-container-lowest/95 hover:bg-surface-container-low text-on-surface shadow-md border border-surface-container/70 flex items-center justify-center transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          title="Zoom Out"
          className="w-9 h-9 rounded-xl bg-surface-container-lowest/95 hover:bg-surface-container-low text-on-surface shadow-md border border-surface-container/70 flex items-center justify-center transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">remove</span>
        </button>
      </div>

      {/* Bottom Telemetry Overlay Card */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
        <div className="bg-surface-container-lowest/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-surface-container/80 flex items-center justify-between flex-wrap gap-2 pointer-events-auto">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center shadow-sm shrink-0">
              <span className="material-symbols-outlined text-[22px]">directions_car</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-headline-sm text-headline-sm font-bold text-on-surface">
                  {routeInfo.distanceKm} km
                </span>
                <span className="text-on-surface-variant font-body-sm text-body-sm font-medium">
                  • {routeInfo.durationMins} mins
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant block truncate max-w-[200px] sm:max-w-xs md:max-w-md">
                From {pickup} to {dropoff}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/60 shadow-xs">
            <span className="material-symbols-outlined text-[18px]">speed</span>
            <span className="font-label-sm text-label-sm font-bold">Google Route Sync</span>
          </div>
        </div>
      </div>

      {/* Google API Key Configuration Modal */}
      {apiKeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-surface-container animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-surface-container">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[24px]">map</span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Google Maps API Key
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setApiKeyModalOpen(false)}
                className="p-1 rounded-lg hover:bg-surface-container text-on-surface-variant cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div className="py-4 flex flex-col gap-3">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                CabGo operates with full interactive Google Maps street tiles, live traffic, and dynamic route tracking right out of the box. You can also provide an official Google Cloud API key for native Places Autocomplete.
              </p>

              <div>
                <label className="font-label-sm text-label-sm text-on-surface-variant block mb-1 font-semibold">
                  ENTER GOOGLE MAPS API KEY (OPTIONAL)
                </label>
                <input
                  type="password"
                  value={tempApiKey}
                  onChange={(e) => setTempApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-surface-container font-mono text-body-sm text-on-surface outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="bg-surface-container-low p-3 rounded-xl flex flex-col gap-1 text-on-surface-variant font-label-sm text-label-sm border border-surface-container/60">
                <span className="font-bold text-on-surface">Supported Capabilities:</span>
                <span>✓ Interactive Google Maps Layer</span>
                <span>✓ Live Google Traffic Congestion Overlay</span>
                <span>✓ Real-time Route Polyline & Moving Cab Telemetry</span>
                <span>✓ Google Places Autocomplete (when key active)</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-surface-container">
              {apiKey && (
                <button
                  type="button"
                  onClick={() => {
                    setTempApiKey('');
                    mapsService.saveApiKey('');
                    setApiKey('');
                    setApiKeyModalOpen(false);
                    window.location.reload();
                  }}
                  className="px-4 py-2 rounded-xl text-error hover:bg-error-container/20 font-label-md text-label-md font-semibold transition-colors cursor-pointer"
                >
                  Clear Key
                </button>
              )}
              <button
                type="button"
                onClick={() => setApiKeyModalOpen(false)}
                className="px-4 py-2 rounded-xl text-on-surface-variant hover:bg-surface-container font-label-md text-label-md font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveApiKey}
                className="px-5 py-2 rounded-xl bg-primary-container hover:bg-tertiary-container text-on-primary-container font-label-md text-label-md font-bold shadow-md transition-all cursor-pointer"
              >
                Save & Reload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
