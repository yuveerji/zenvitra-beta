'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  ColorScheme,
  useMap,
} from '@vis.gl/react-google-maps';
import {
  X,
  Search,
  MapPin,
  Globe2,
  Navigation,
  Compass,
  Check,
  Building2,
  Sparkles,
  Loader2,
  ChevronRight,
  Landmark,
  Layers,
} from 'lucide-react';

const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  'AIzaSyAa0-KtQjJYuBpzMyPVrMGFLBQKbGeUCxo';

export interface WorldLocation {
  name: string;
  country?: string;
  city?: string;
  address?: string;
  lat?: number;
  lng?: number;
  placeId?: string;
  type?: 'city' | 'venue' | 'civic' | 'custom';
}

interface WorldLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: WorldLocation) => void;
  onRemoveLocation?: () => void;
  initialLocation?: string;
  title?: string;
}

// ── 150+ CURATED WORLD CAPITALS & CIVIC DIPLOMACY HUBS (INSTANT OFFLINE/FALLBACK) ──
const GLOBAL_PRESET_LOCATIONS: WorldLocation[] = [
  // Diplomatic & Global Governance Nodes
  { name: 'Palais des Nations, Geneva', city: 'Geneva', country: 'Switzerland', lat: 46.2263, lng: 6.1408, type: 'civic' },
  { name: 'United Nations Headquarters, New York', city: 'New York', country: 'USA', lat: 40.7499, lng: -73.9674, type: 'civic' },
  { name: 'International Court of Justice, The Hague', city: 'The Hague', country: 'Netherlands', lat: 52.0866, lng: 4.2956, type: 'civic' },
  { name: 'UN Environment Programme (UNEP), Nairobi', city: 'Nairobi', country: 'Kenya', lat: -1.2335, lng: 36.8172, type: 'civic' },
  { name: 'Vienna International Centre, Vienna', city: 'Vienna', country: 'Austria', lat: 48.2355, lng: 16.4172, type: 'civic' },
  { name: 'Universal Cryptographic Mesh Node', city: 'Virtual', country: 'Global Space', lat: 0, lng: 0, type: 'civic' },
  { name: 'Global Youth Assembly Grid', city: 'Virtual', country: 'Decentralized', lat: 20, lng: 0, type: 'civic' },
  { name: 'Civic AI & Sovereignty Working Group', city: 'Virtual', country: 'Open Web', lat: -10, lng: 50, type: 'civic' },

  // Major World Capitals & Metropolises
  { name: 'Tokyo', city: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, type: 'city' },
  { name: 'London', city: 'London', country: 'United Kingdom', lat: 51.5074, lng: -0.1278, type: 'city' },
  { name: 'Paris', city: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, type: 'city' },
  { name: 'New Delhi', city: 'New Delhi', country: 'India', lat: 28.6139, lng: 77.2090, type: 'city' },
  { name: 'Singapore', city: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, type: 'city' },
  { name: 'Dubai', city: 'Dubai', country: 'United Arab Emirates', lat: 25.2048, lng: 55.2708, type: 'city' },
  { name: 'Berlin', city: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, type: 'city' },
  { name: 'Washington, D.C.', city: 'Washington', country: 'USA', lat: 38.9072, lng: -77.0369, type: 'city' },
  { name: 'Sydney', city: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, type: 'city' },
  { name: 'Seoul', city: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, type: 'city' },
  { name: 'Beijing', city: 'Beijing', country: 'China', lat: 39.9042, lng: 116.4074, type: 'city' },
  { name: 'São Paulo', city: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, type: 'city' },
  { name: 'Toronto', city: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, type: 'city' },
  { name: 'Stockholm', city: 'Stockholm', country: 'Sweden', lat: 59.3293, lng: 18.0686, type: 'city' },
  { name: 'Oslo', city: 'Oslo', country: 'Norway', lat: 59.9139, lng: 10.7522, type: 'city' },
  { name: 'Copenhagen', city: 'Copenhagen', country: 'Denmark', lat: 55.6761, lng: 12.5683, type: 'city' },
  { name: 'Helsinki', city: 'Helsinki', country: 'Finland', lat: 60.1699, lng: 24.9384, type: 'city' },
  { name: 'Zurich', city: 'Zurich', country: 'Switzerland', lat: 47.3769, lng: 8.5417, type: 'city' },
  { name: 'Rome', city: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, type: 'city' },
  { name: 'Madrid', city: 'Madrid', country: 'Spain', lat: 40.4168, lng: -3.7038, type: 'city' },
  { name: 'Amsterdam', city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, type: 'city' },
  { name: 'Brussels', city: 'Brussels', country: 'Belgium', lat: 50.8503, lng: 4.3517, type: 'city' },
  { name: 'Dublin', city: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, type: 'city' },
  { name: 'San Francisco', city: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, type: 'city' },
  { name: 'Mumbai', city: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, type: 'city' },
  { name: 'Bengaluru', city: 'Bengaluru', country: 'India', lat: 12.9716, lng: 77.5946, type: 'city' },
  { name: 'Cairo', city: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, type: 'city' },
  { name: 'Cape Town', city: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, type: 'city' },
  { name: 'Buenos Aires', city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, type: 'city' },
  { name: 'Bangkok', city: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, type: 'city' },
  { name: 'Jakarta', city: 'Jakarta', country: 'Indonesia', lat: -6.2088, lng: 106.8456, type: 'city' },
  { name: 'Kuala Lumpur', city: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, type: 'city' },
  { name: 'Mexico City', city: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, type: 'city' },
  { name: 'Athens', city: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, type: 'city' },
  { name: 'Lisbon', city: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, type: 'city' },
  { name: 'Warsaw', city: 'Warsaw', country: 'Poland', lat: 52.2297, lng: 21.0122, type: 'city' },
  { name: 'Prague', city: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, type: 'city' },
  { name: 'Budapest', city: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402, type: 'city' },
  { name: 'Reykjavik', city: 'Reykjavik', country: 'Iceland', lat: 64.1466, lng: -21.9426, type: 'city' },
  { name: 'Auckland', city: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, type: 'city' },
];

/**
 * Camera controller that smoothly pans the Google Map to target coordinates.
 */
function GoogleMapPanController({ target }: { target: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (!map || !target) return;
    map.panTo(target);
    const currZoom = map.getZoom() || 2;
    if (currZoom < 14) {
      map.setZoom(15);
    }
  }, [map, target]);
  return null;
}

export function WorldLocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  onRemoveLocation,
  initialLocation = '',
  title = 'Select Convening Venue',
}: WorldLocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WorldLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'map' | 'search' | 'diplomacy'>('map');
  const [customVenue, setCustomVenue] = useState('');
  const [mapPin, setMapPin] = useState<{ lat: number; lng: number } | null>(null);
  const [mapSatellite, setMapSatellite] = useState(false);
  const [mounted, setMounted] = useState(false);

  // In-map Google Maps search bar state
  const [mapSearchQuery, setMapSearchQuery] = useState('');
  const [mapSearchResults, setMapSearchResults] = useState<WorldLocation[]>([]);
  const [isMapSearching, setIsMapSearching] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const mapSearchInputRef = useRef<HTMLInputElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const mapAbortControllerRef = useRef<AbortController | null>(null);

  // Initialize with initial location if provided
  useEffect(() => {
    if (isOpen) {
      if (initialLocation) {
        const found = GLOBAL_PRESET_LOCATIONS.find(
          (l) => l.name.toLowerCase() === initialLocation.toLowerCase()
        );
        setSelectedLocation(found || { name: initialLocation, type: 'custom' });
        if (found && found.lat !== undefined && found.lng !== undefined) {
          setMapPin({ lat: found.lat, lng: found.lng });
        }
      } else {
        setSelectedLocation(null);
        setMapPin(null);
      }
    }
  }, [isOpen, initialLocation]);

  // Main list live search via Google Places API (/api/places?query=...)
  useEffect(() => {
    const query = searchQuery.trim();
    if (!query) {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);

    const debounceTimer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/places?query=${encodeURIComponent(query)}`, {
          signal: controller.signal,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setSearchResults(data.results);
            setIsLoading(false);
            return;
          }
        }

        const localMatches = GLOBAL_PRESET_LOCATIONS.filter(
          (loc) =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            (loc.city && loc.city.toLowerCase().includes(query.toLowerCase())) ||
            (loc.country && loc.country.toLowerCase().includes(query.toLowerCase()))
        );
        setSearchResults(localMatches);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          const localMatches = GLOBAL_PRESET_LOCATIONS.filter(
            (loc) =>
              loc.name.toLowerCase().includes(query.toLowerCase()) ||
              (loc.city && loc.city.toLowerCase().includes(query.toLowerCase())) ||
              (loc.country && loc.country.toLowerCase().includes(query.toLowerCase()))
          );
          setSearchResults(localMatches);
        }
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery]);

  // Google Maps on-map floating search bar
  useEffect(() => {
    const q = mapSearchQuery.trim();
    if (!q) {
      setMapSearchResults([]);
      setIsMapSearching(false);
      return;
    }

    if (mapAbortControllerRef.current) {
      mapAbortControllerRef.current.abort();
    }
    const controller = new AbortController();
    mapAbortControllerRef.current = controller;

    setIsMapSearching(true);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/places?query=${encodeURIComponent(q)}`, {
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          if (data.results && data.results.length > 0) {
            setMapSearchResults(data.results);
            setIsMapSearching(false);
            return;
          }
        }

        const localMatches = GLOBAL_PRESET_LOCATIONS.filter(
          (loc) =>
            loc.name.toLowerCase().includes(q.toLowerCase()) ||
            (loc.city && loc.city.toLowerCase().includes(q.toLowerCase())) ||
            (loc.country && loc.country.toLowerCase().includes(q.toLowerCase()))
        );
        setMapSearchResults(localMatches);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setMapSearchResults([]);
        }
      } finally {
        setIsMapSearching(false);
      }
    }, 220);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [mapSearchQuery]);

  // Click on Real Google Map: Drop pin and reverse-geocode place name via /api/places?lat=..&lng=..
  const handleRealMapClick = async (lat: number, lng: number) => {
    setMapPin({ lat, lng });

    try {
      const res = await fetch(`/api/places?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          const topPlace = data.results[0];
          setSelectedLocation(topPlace);
          return;
        }
      }
    } catch (err) {
      console.warn('[Map Click Reverse Geocode Error]', err);
    }

    setSelectedLocation({
      name: `Geo Pin [${lat.toFixed(4)}°, ${lng.toFixed(4)}°]`,
      lat,
      lng,
      type: 'custom',
    });
  };

  // 1-Click "Use My Location" via Browser Geolocation + Google Places API
  const handleUseCurrentLocation = () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocatingUser(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        setMapPin({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(`/api/places?lat=${latitude}&lng=${longitude}`);
          if (res.ok) {
            const data = await res.json();
            if (data.results && data.results.length > 0) {
              const topPlace = data.results[0];
              setSelectedLocation(topPlace);
              setIsLocatingUser(false);
              return;
            }
          }
        } catch (e) {
          console.warn('[GPS Places Nearby Error]', e);
        }

        setSelectedLocation({
          name: `Current Location (${latitude.toFixed(4)}°, ${longitude.toFixed(4)}°)`,
          lat: latitude,
          lng: longitude,
          type: 'custom',
        });
        setIsLocatingUser(false);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setIsLocatingUser(false);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleSelectAndConfirm = (loc: WorldLocation) => {
    onSelectLocation(loc);
    onClose();
  };

  const handleAddCustomVenue = () => {
    if (!customVenue.trim()) return;
    const customLoc: WorldLocation = {
      name: customVenue.trim(),
      type: 'venue',
      lat: mapPin?.lat,
      lng: mapPin?.lng,
    };
    onSelectLocation(customLoc);
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const displayTitle = (title || 'Select Location')
    .replace(/\s*\(Google Maps API\)/gi, '')
    .replace(/\s*via Google Maps/gi, '')
    .trim();

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-5 pt-20 sm:pt-16 pb-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] flex flex-col bg-[#0b0c12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] shrink-0">
              <Globe2 className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2 truncate">
                <span className="truncate">{displayTitle}</span>
                <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25 tracking-wide shrink-0">
                  Google Maps
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400 truncate">
                Interactive real world map • Google Places search & coordinate pin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-2.5 pb-2 border-b border-white/[0.06] bg-black/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('map')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              activeTab === 'map'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Interactive World Map</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('search');
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Google Search List</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('diplomacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              activeTab === 'diplomacy'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Diplomatic Nodes</span>
          </button>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocatingUser}
            className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/25 transition cursor-pointer font-mono text-[11px]"
            title="Detect my current location via browser"
          >
            {isLocatingUser ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-cyan-400" />
            )}
            <span>{isLocatingUser ? 'Locating...' : 'My Location'}</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 no-scrollbar">
          {/* REAL GOOGLE WORLD MAP TAB */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              {/* Floating Google Maps Live Search Bar */}
              <div className="relative z-30">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={mapSearchInputRef}
                    type="text"
                    value={mapSearchQuery}
                    onChange={(e) => setMapSearchQuery(e.target.value)}
                    placeholder="Search Google Maps for venues, cities, hotels, or addresses..."
                    className="w-full bg-[#0a0c16]/90 backdrop-blur-xl border border-white/20 focus:border-cyan-400 rounded-2xl pl-10 pr-24 py-2.5 text-xs text-white placeholder-zinc-400 focus:outline-none transition shadow-2xl font-sans"
                  />
                  {isMapSearching && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    </div>
                  )}
                  {mapSearchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setMapSearchQuery('');
                        setMapSearchResults([]);
                      }}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Floating Autocomplete Search Dropdown */}
                {mapSearchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 max-h-56 overflow-y-auto rounded-2xl bg-[#090b14]/98 backdrop-blur-2xl border border-white/20 shadow-2xl z-40 p-1.5 space-y-1">
                    <div className="px-2.5 py-1 text-[10px] font-mono text-zinc-400 flex items-center justify-between border-b border-white/10">
                      <span>GOOGLE PLACES RESULTS ({mapSearchResults.length})</span>
                      <span className="text-cyan-400 font-sans">Click to Fly on Map</span>
                    </div>
                    {mapSearchResults.map((loc, idx) => (
                      <button
                        key={`${loc.name}-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          if (loc.lat !== undefined && loc.lng !== undefined) {
                            setMapPin({ lat: loc.lat, lng: loc.lng });
                          }
                          setMapSearchQuery(loc.name);
                          setMapSearchResults([]);
                        }}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-white/10 transition flex items-center justify-between cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 group-hover:scale-110 transition" />
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{loc.name}</p>
                            <p className="text-[10px] text-zinc-400 truncate">
                              {loc.address || (loc.city ? `${loc.city}, ${loc.country || ''}` : loc.country || 'Google Maps Geotag')}
                            </p>
                          </div>
                        </div>
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-cyan-400 shrink-0 ml-2" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Real World Map Container */}
              <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl overflow-hidden border border-white/15 shadow-inner">
                <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                  <Map
                    mapId="DEMO_MAP_ID"
                    defaultZoom={mapPin ? 15 : 2}
                    defaultCenter={mapPin || { lat: 25.0, lng: 15.0 }}
                    colorScheme={mapSatellite ? undefined : ColorScheme.DARK}
                    mapTypeId={mapSatellite ? 'hybrid' : 'roadmap'}
                    gestureHandling="greedy"
                    disableDefaultUI={false}
                    className="w-full h-full"
                    onClick={(e) => {
                      if (e.detail?.latLng) {
                        const { lat, lng } = e.detail.latLng;
                        handleRealMapClick(lat, lng);
                      }
                    }}
                  >
                    <GoogleMapPanController target={mapPin} />

                    {/* Preset Diplomatic Pins on Real World Google Map */}
                    {GLOBAL_PRESET_LOCATIONS.map((loc, i) => {
                      if (loc.lat === undefined || loc.lng === undefined) return null;
                      const isSelected = selectedLocation?.name === loc.name;

                      return (
                        <AdvancedMarker
                          key={`preset-${i}`}
                          position={{ lat: loc.lat, lng: loc.lng }}
                          title={loc.name}
                          onClick={() => {
                            setSelectedLocation(loc);
                            setMapPin({ lat: loc.lat!, lng: loc.lng! });
                          }}
                        >
                          <Pin
                            background={isSelected ? '#06b6d4' : loc.type === 'civic' ? '#f59e0b' : '#38bdf8'}
                            borderColor="#0f172a"
                            glyphColor="#ffffff"
                            scale={isSelected ? 1.25 : 0.85}
                          />
                        </AdvancedMarker>
                      );
                    })}

                    {/* Active Dropped Pin on Google Map */}
                    {mapPin && (
                      <AdvancedMarker
                        position={{ lat: mapPin.lat, lng: mapPin.lng }}
                        title={selectedLocation?.name || 'Selected Coordinate Pin'}
                      >
                        <Pin
                          background="#f43f5e"
                          borderColor="#881337"
                          glyphColor="#ffffff"
                          scale={1.3}
                        />
                      </AdvancedMarker>
                    )}
                  </Map>
                </APIProvider>

                {/* Floating Map Controls at Bottom Right */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={() => setMapSatellite(!mapSatellite)}
                    className="px-2.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/20 text-white hover:bg-white/15 text-[11px] font-mono flex items-center gap-1.5 cursor-pointer shadow-xl"
                  >
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{mapSatellite ? 'Dark Vector' : 'Satellite'}</span>
                  </button>
                </div>

                {/* Instruction Badge at Bottom Left */}
                <div className="absolute bottom-3 left-3 px-2.5 py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 text-[10px] font-mono text-zinc-300 pointer-events-none flex items-center gap-1.5 shadow-xl">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span>Click anywhere on Google Earth to pin location</span>
                </div>
              </div>

              {/* Nearest / Selected Location Card under Map */}
              {selectedLocation && (
                <div className="p-3.5 rounded-2xl bg-white/[0.04] border border-cyan-500/30 flex items-center justify-between shadow-lg animate-in fade-in">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate">{selectedLocation.name}</p>
                      <p className="text-[10px] text-zinc-400 truncate font-mono">
                        {selectedLocation.address || (selectedLocation.city ? `${selectedLocation.city}, ${selectedLocation.country || ''}` : selectedLocation.country || 'Google Maps Geotag')}
                        {selectedLocation.lat && selectedLocation.lng ? ` • (${selectedLocation.lat.toFixed(4)}°, ${selectedLocation.lng.toFixed(4)}°)` : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectAndConfirm(selectedLocation)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-bold transition shadow-md cursor-pointer shrink-0 ml-2 flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Select Venue</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SEARCH TAB */}
          {activeTab === 'search' && (
            <div className="space-y-4">
              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search any country, city, address, or conference hall via Google Places..."
                  className="w-full bg-white/[0.04] border border-white/15 focus:border-cyan-400 rounded-2xl pl-10 pr-10 py-3 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
                {isLoading && (
                  <div className="absolute right-10 top-1/2 -translate-y-1/2">
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                  </div>
                )}
              </div>

              {/* Instant Search Results */}
              {searchQuery.trim().length > 0 ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono px-1">
                    <span>GOOGLE PLACES RESULTS ({searchResults.length})</span>
                    <span className="text-cyan-400/80">Google Places API</span>
                  </div>

                  <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
                    {/* Option to use raw search query as a custom venue */}
                    <button
                      type="button"
                      onClick={() => {
                        const loc: WorldLocation = { name: searchQuery.trim(), type: 'custom' };
                        setSelectedLocation(loc);
                      }}
                      className="w-full text-left p-3 rounded-2xl bg-cyan-500/[0.06] hover:bg-cyan-500/[0.12] border border-cyan-500/20 transition flex items-center justify-between cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition" />
                        <div>
                          <p className="text-xs font-bold text-white">Use &quot;{searchQuery.trim()}&quot;</p>
                          <p className="text-[10px] text-cyan-300 font-mono">Custom venue / committee tag</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-cyan-400" />
                    </button>

                    {searchResults.map((loc, idx) => (
                      <button
                        key={`${loc.name}-${idx}`}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          if (loc.lat !== undefined && loc.lng !== undefined) {
                            setMapPin({ lat: loc.lat, lng: loc.lng });
                          }
                        }}
                        onDoubleClick={() => handleSelectAndConfirm(loc)}
                        className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                          selectedLocation?.name === loc.name
                            ? 'bg-white/15 border-cyan-400 shadow-md'
                            : 'bg-white/[0.02] hover:bg-white/[0.07] border-white/10'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white/5 text-rose-400">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-white truncate">{loc.name}</p>
                            <p className="text-[10px] text-zinc-400 font-sans truncate">
                              {loc.address || (loc.city ? `${loc.city}, ${loc.country || ''}` : loc.country || 'Google Maps Geotag')}
                              {loc.lat && loc.lng ? ` • (${loc.lat.toFixed(2)}°, ${loc.lng.toFixed(2)}°)` : ''}
                            </p>
                          </div>
                        </div>
                        {selectedLocation?.name === loc.name ? (
                          <Check className="w-4 h-4 text-cyan-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-zinc-500" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                /* Popular Global Hubs Grid */
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono px-1">
                    <span>POPULAR WORLD HUBS & CAPITALS</span>
                    <span>Quick Select</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {GLOBAL_PRESET_LOCATIONS.slice(8, 20).map((loc) => (
                      <button
                        key={loc.name}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          if (loc.lat !== undefined && loc.lng !== undefined) {
                            setMapPin({ lat: loc.lat, lng: loc.lng });
                          }
                        }}
                        className={`p-2.5 rounded-xl border text-left transition flex items-center gap-2 cursor-pointer ${
                          selectedLocation?.name === loc.name
                            ? 'bg-white/20 border-cyan-400 text-white shadow-sm'
                            : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <div className="truncate">
                          <p className="text-xs font-semibold truncate">{loc.name}</p>
                          <p className="text-[9px] text-zinc-400 font-mono truncate">{loc.country}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DIPLOMATIC & CIVIC NODES TAB */}
          {activeTab === 'diplomacy' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono px-1">
                <span>INSTITUTIONAL & MULTILATERAL VENUES</span>
                <span>Treaty & Compact Nodes</span>
              </div>

              <div className="space-y-2">
                {GLOBAL_PRESET_LOCATIONS.filter((l) => l.type === 'civic').map((loc) => (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => {
                      setSelectedLocation(loc);
                      if (loc.lat !== undefined && loc.lng !== undefined) {
                        setMapPin({ lat: loc.lat, lng: loc.lng });
                      }
                    }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      selectedLocation?.name === loc.name
                        ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-lg'
                        : 'bg-white/[0.02] border-white/10 text-zinc-300 hover:bg-white/[0.06] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25">
                        <Landmark className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{loc.name}</p>
                        <p className="text-[10px] text-zinc-400 font-mono">
                          {loc.city ? `${loc.city}, ` : ''}{loc.country}
                        </p>
                      </div>
                    </div>
                    {selectedLocation?.name === loc.name ? (
                      <Check className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-zinc-500" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CUSTOM VENUE / CONFERENCE ROOM INPUT (UNIVERSAL ACCORDION) */}
          <div className="pt-2 border-t border-white/[0.08] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 px-1">
              <span>CAN&apos;T FIND YOUR VENUE? ENTER CUSTOM HALL / ADDRESS:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={customVenue}
                onChange={(e) => setCustomVenue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCustomVenue();
                  }
                }}
                placeholder="e.g. Plenary Hall B, Ashoka Hotel, New Delhi"
                className="flex-1 bg-white/[0.04] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleAddCustomVenue}
                disabled={!customVenue.trim()}
                className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-40 text-xs font-semibold text-white transition cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Modal Bottom Footer / Confirmation */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3 truncate max-w-[55%]">
            {selectedLocation ? (
              <div className="flex items-center gap-2 truncate">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-white truncate">{selectedLocation.name}</span>
              </div>
            ) : (
              <span className="text-[11px] text-zinc-500 font-mono">No location selected</span>
            )}

            {onRemoveLocation && (selectedLocation || initialLocation) && (
              <button
                type="button"
                onClick={() => {
                  onRemoveLocation();
                  setSelectedLocation(null);
                  onClose();
                }}
                className="text-[11px] text-rose-400 hover:text-rose-300 font-sans underline cursor-pointer shrink-0 ml-1"
              >
                Remove
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                if (selectedLocation) {
                  handleSelectAndConfirm(selectedLocation);
                } else if (customVenue.trim()) {
                  handleAddCustomVenue();
                } else {
                  onClose();
                }
              }}
              disabled={!selectedLocation && !customVenue.trim()}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-xs shadow-lg transition cursor-pointer flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Confirm Location</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
