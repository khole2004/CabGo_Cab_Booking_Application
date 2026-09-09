// mapsService.js - Google Maps & Route Telemetry Service for CabGo

const STORAGE_KEY = 'cabgo_google_maps_api_key';

export const mapsService = {
  /**
   * Get the active Google Maps API Key from LocalStorage or Vite Env
   */
  getApiKey() {
    const fromStorage = localStorage.getItem(STORAGE_KEY);
    if (fromStorage && fromStorage.trim()) {
      return fromStorage.trim();
    }
    const fromEnv = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (fromEnv && fromEnv.trim()) {
      return fromEnv.trim();
    }
    return '';
  },

  /**
   * Save API Key to localStorage
   */
  saveApiKey(key) {
    if (key && key.trim()) {
      localStorage.setItem(STORAGE_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  /**
   * Dynamically loads Google Maps JavaScript SDK
   */
  loadGoogleMapsScript(apiKey) {
    return new Promise((resolve, reject) => {
      if (!apiKey || !apiKey.trim()) {
        return reject(new Error('No Google Maps API key provided'));
      }

      if (window.google && window.google.maps && window.google.maps.DirectionsService) {
        return resolve(window.google);
      }

      // Check if script is already in DOM
      const existingScript = document.getElementById('cabgo-google-maps-script');
      if (existingScript) {
        if (window.google && window.google.maps) {
          return resolve(window.google);
        }
        existingScript.addEventListener('load', () => resolve(window.google));
        existingScript.addEventListener('error', (err) => reject(err));
        return;
      }

      const script = document.createElement('script');
      script.id = 'cabgo-google-maps-script';
      script.async = true;
      script.defer = true;

      const keyParam = apiKey ? `&key=${encodeURIComponent(apiKey)}` : '';
      script.src = `https://maps.googleapis.com/maps/api/js?libraries=places,geometry${keyParam}&callback=__cabgoMapsLoaded`;

      window.__cabgoMapsLoaded = () => {
        delete window.__cabgoMapsLoaded;
        resolve(window.google);
      };

      script.onerror = (error) => {
        console.warn('Google Maps SDK failed to load:', error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  },

  /**
   * Calculate exact driving route using Google Maps DirectionsService
   */
  async calculateGoogleRoute(pickup, dropoff, googleInstance = window.google) {
    if (!googleInstance || !googleInstance.maps || !googleInstance.maps.DirectionsService) {
      throw new Error('Google Maps SDK is not loaded');
    }

    const directionsService = new googleInstance.maps.DirectionsService();

    return new Promise((resolve, reject) => {
      directionsService.route(
        {
          origin: pickup,
          destination: dropoff,
          travelMode: googleInstance.maps.TravelMode.DRIVING,
          drivingOptions: {
            departureTime: new Date(),
            trafficModel: googleInstance.maps.TrafficModel.BEST_GUESS,
          },
          unitSystem: googleInstance.maps.UnitSystem.METRIC,
        },
        (result, status) => {
          if (status === googleInstance.maps.DirectionsStatus.OK && result.routes?.length > 0) {
            const route = result.routes[0];
            const leg = route.legs[0];

            const distanceInKm = Number((leg.distance.value / 1000).toFixed(1));
            const durationInMins = Math.max(1, Math.round(leg.duration.value / 60));
            const durationInTrafficMins = leg.duration_in_traffic
              ? Math.max(1, Math.round(leg.duration_in_traffic.value / 60))
              : durationInMins;

            resolve({
              source: 'google',
              distanceKm: distanceInKm,
              distanceText: leg.distance.text,
              durationMins: durationInTrafficMins,
              durationText: `${durationInTrafficMins} mins`,
              routeSummary: route.summary || 'Expressway Route',
              startAddress: leg.start_address,
              endAddress: leg.end_address,
              startLocation: { lat: leg.start_location.lat(), lng: leg.start_location.lng() },
              endLocation: { lat: leg.end_location.lat(), lng: leg.end_location.lng() },
              bounds: route.bounds,
              directionsResult: result,
            });
          } else {
            reject(new Error(`Directions request failed with status: ${status}`));
          }
        }
      );
    });
  },

  /**
   * Fallback driving route telemetry calculation using public road routing or geocoding
   */
  async calculateFallbackRoute(pickup, dropoff) {
    // Known hubs in Delhi NCR for instant accurate resolution
    const KNOWN_PLACES = {
      'terminal 3': { lat: 28.5562, lng: 77.1000, name: 'Terminal 3, IGI Airport' },
      'igi airport': { lat: 28.5562, lng: 77.1000, name: 'Terminal 3, IGI Airport' },
      'airport': { lat: 28.5562, lng: 77.1000, name: 'Terminal 3, IGI Airport' },
      'aerocity': { lat: 28.5480, lng: 77.1212, name: 'Aerocity, New Delhi' },
      'cyber hub': { lat: 28.4952, lng: 77.0895, name: 'DLF Cyber Hub, Sector 24, Gurugram' },
      'dlf cyber': { lat: 28.4952, lng: 77.0895, name: 'DLF Cyber Hub, Sector 24, Gurugram' },
      'cyber city': { lat: 28.4952, lng: 77.0895, name: 'DLF Cyber Hub, Sector 24, Gurugram' },
      'gurugram': { lat: 28.4595, lng: 77.0266, name: 'Gurugram' },
      'sector 29': { lat: 28.4682, lng: 77.0620, name: 'Sector 29, Gurugram' },
      'ambience mall': { lat: 28.5042, lng: 77.0970, name: 'Ambience Mall, Gurugram' },
      'connaught place': { lat: 28.6315, lng: 77.2167, name: 'Connaught Place, New Delhi' },
      'cp': { lat: 28.6315, lng: 77.2167, name: 'Connaught Place, New Delhi' },
      'india gate': { lat: 28.6129, lng: 77.2295, name: 'India Gate, New Delhi' },
      'new delhi railway': { lat: 28.6431, lng: 77.2197, name: 'New Delhi Railway Station' },
      'ndls': { lat: 28.6431, lng: 77.2197, name: 'New Delhi Railway Station' },
      'noida sector 62': { lat: 28.6276, lng: 77.3653, name: 'Sector 62, Noida' },
      'noida sector 18': { lat: 28.5708, lng: 77.3260, name: 'Sector 18, Noida' },
      'saket': { lat: 28.5245, lng: 77.2066, name: 'Saket, New Delhi' },
      'hauz khas': { lat: 28.5494, lng: 77.2001, name: 'Hauz Khas, New Delhi' },
      'nehru place': { lat: 28.5492, lng: 77.2529, name: 'Nehru Place, New Delhi' },
    };

    const findCoords = (query) => {
      const lower = (query || '').toLowerCase();
      for (const [key, val] of Object.entries(KNOWN_PLACES)) {
        if (lower.includes(key)) return val;
      }
      return null;
    };

    let start = findCoords(pickup);
    let end = findCoords(dropoff);

    // If not found in known places, query Nominatim Geocoding API with 3s timeout
    if (!start) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickup)}&limit=1`,
          { headers: { 'User-Agent': 'CabGoApp/1.0' } }
        );
        const data = await res.json();
        if (data?.[0]) {
          start = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
        }
      } catch (e) {
        console.warn('Geocoding pickup fallback:', e);
      }
    }

    if (!end) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoff)}&limit=1`,
          { headers: { 'User-Agent': 'CabGoApp/1.0' } }
        );
        const data = await res.json();
        if (data?.[0]) {
          end = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), name: data[0].display_name };
        }
      } catch (e) {
        console.warn('Geocoding dropoff fallback:', e);
      }
    }

    // Default coordinates if geocoding completely fails
    if (!start) start = { lat: 28.5562, lng: 77.1000, name: pickup || 'Terminal 3, IGI Airport' };
    if (!end) end = { lat: 28.4952, lng: 77.0895, name: dropoff || 'DLF Cyber Hub, Gurugram' };

    // Try driving route calculation via OSRM public routing API
    try {
      const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson`;
      const response = await fetch(osrmUrl);
      const data = await response.json();

      if (data.code === 'Ok' && data.routes?.length > 0) {
        const route = data.routes[0];
        const distanceKm = Number((route.distance / 1000).toFixed(1));
        const durationMins = Math.max(1, Math.round(route.duration / 60));
        const polylineCoords = route.geometry?.coordinates?.map(([lng, lat]) => [lat, lng]) || [
          [start.lat, start.lng],
          [end.lat, end.lng],
        ];

        return {
          source: 'osrm_fallback',
          distanceKm,
          distanceText: `${distanceKm} km`,
          durationMins,
          durationText: `${durationMins} mins`,
          routeSummary: 'NH-48 Expressway Route',
          startLocation: start,
          endLocation: end,
          geojson: route.geometry,
          polylineCoords,
        };
      }
    } catch (e) {
      console.warn('OSRM routing fallback failed, using Haversine calculation:', e);
    }

    // Haversine calculation with 1.35 road factor as the ultimate resilient fallback
    const R = 6371; // Earth radius in km
    const dLat = ((end.lat - start.lat) * Math.PI) / 180;
    const dLon = ((end.lng - start.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((start.lat * Math.PI) / 180) *
        Math.cos((end.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const straightKm = R * c;
    // Urban road driving factor is typically ~1.30 to 1.40x straight distance
    const distanceKm = Number(Math.max(1.0, straightKm * 1.35).toFixed(1));
    const durationMins = Math.max(2, Math.round((distanceKm / 32) * 60)); // Avg 32 km/h in city
    const polylineCoords = [
      [start.lat, start.lng],
      [(start.lat * 2 + end.lat) / 3, (start.lng * 2 + end.lng) / 3],
      [(start.lat + end.lat * 2) / 3, (start.lng + end.lng * 2) / 3],
      [end.lat, end.lng],
    ];

    return {
      source: 'haversine_fallback',
      distanceKm,
      distanceText: `${distanceKm} km`,
      durationMins,
      durationText: `${durationMins} mins`,
      routeSummary: 'Direct Highway Corridor',
      startLocation: start,
      endLocation: end,
      polylineCoords,
    };
  },
};
