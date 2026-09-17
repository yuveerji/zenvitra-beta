'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  Landmark
} from 'lucide-react';

export interface WorldLocation {
  name: string;
  country?: string;
  city?: string;
  lat?: number;
  lng?: number;
  type?: 'city' | 'venue' | 'civic' | 'custom';
}

interface WorldLocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: WorldLocation) => void;
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

export function WorldLocationPickerModal({
  isOpen,
  onClose,
  onSelectLocation,
  initialLocation = '',
  title = 'World Location & Map Geotag'
}: WorldLocationPickerModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<WorldLocation[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<WorldLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'map' | 'diplomacy'>('search');
  const [customVenue, setCustomVenue] = useState('');
  const [mapPin, setMapPin] = useState<{ lat: number; lng: number } | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
      setTimeout(() => searchInputRef.current?.focus(), 150);
    }
  }, [isOpen, initialLocation]);

  // Live Geocoding via OpenStreetMap Nominatim API + Fallback
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
        // 1. First search in curated offline presets for instant responsiveness
        const localMatches = GLOBAL_PRESET_LOCATIONS.filter(
          (loc) =>
            loc.name.toLowerCase().includes(query.toLowerCase()) ||
            (loc.city && loc.city.toLowerCase().includes(query.toLowerCase())) ||
            (loc.country && loc.country.toLowerCase().includes(query.toLowerCase()))
        );

        // 2. Fetch live worldwide geocoding data from OpenStreetMap Nominatim
        const endpoint = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=8`;

        const response = await fetch(endpoint, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
          }
        });

        if (response.ok) {
          const data = await response.json();
          const apiResults: WorldLocation[] = data.map((item: any) => {
            const addr = item.address || {};
            const cityName = addr.city || addr.town || addr.village || addr.state || item.name;
            const countryName = addr.country || '';
            const cleanName = item.display_name.split(',').slice(0, 3).join(',').trim();

            return {
              name: cleanName,
              city: cityName,
              country: countryName,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              type: 'city' as const,
            };
          });

          // Merge without exact duplicates
          const seen = new Set<string>();
          const merged: WorldLocation[] = [];

          for (const item of [...localMatches, ...apiResults]) {
            const key = item.name.toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              merged.push(item);
            }
          }

          setSearchResults(merged);
        } else {
          setSearchResults(localMatches);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Fallback to local matches
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
    }, 280);

    return () => {
      clearTimeout(debounceTimer);
      controller.abort();
    };
  }, [searchQuery]);

  // Click on World Map: Convert click percentage to Lat/Lng
  const handleMapClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const xRatio = x / rect.width;
    const yRatio = y / rect.height;

    // Equirectangular projection coordinates:
    // Longitude ranges from -180 to +180
    // Latitude ranges from +90 to -90
    const lng = Number(((xRatio - 0.5) * 360).toFixed(4));
    const lat = Number(((0.5 - yRatio) * 180).toFixed(4));

    setMapPin({ lat, lng });

    // Find nearest preset location or tag as custom coordinate
    let nearest: WorldLocation | null = null;
    let minDistance = Infinity;

    for (const loc of GLOBAL_PRESET_LOCATIONS) {
      if (loc.lat !== undefined && loc.lng !== undefined) {
        const dLat = loc.lat - lat;
        const dLng = loc.lng - lng;
        const dist = Math.sqrt(dLat * dLat + dLng * dLng);
        if (dist < minDistance) {
          minDistance = dist;
          nearest = loc;
        }
      }
    }

    if (nearest && minDistance < 12) {
      setSelectedLocation(nearest);
    } else {
      setSelectedLocation({
        name: `Geo Pin [${lat.toFixed(2)}°, ${lng.toFixed(2)}°]`,
        lat,
        lng,
        type: 'custom'
      });
    }
  };

  // 1-Click "Use My Location" via Browser Geolocation
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
          // Reverse geocode via Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          if (res.ok) {
            const data = await res.json();
            const addr = data.address || {};
            const city = addr.city || addr.town || addr.suburb || addr.state || 'Current City';
            const country = addr.country || '';
            const name = `${city}, ${country}`.replace(/^[,\s]+|[,\s]+$/g, '');

            setSelectedLocation({
              name: name || `Coordinates [${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°]`,
              city,
              country,
              lat: latitude,
              lng: longitude,
              type: 'custom'
            });
          } else {
            setSelectedLocation({
              name: `Coordinates [${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°]`,
              lat: latitude,
              lng: longitude,
              type: 'custom'
            });
          }
        } catch {
          setSelectedLocation({
            name: `Coordinates [${latitude.toFixed(2)}°, ${longitude.toFixed(2)}°]`,
            lat: latitude,
            lng: longitude,
            type: 'custom'
          });
        } finally {
          setIsLocatingUser(false);
        }
      },
      () => {
        setIsLocatingUser(false);
        alert('Could not detect location. Please check browser permissions or search manually.');
      },
      { timeout: 8000 }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0b0c12] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white tracking-tight flex items-center gap-2">
                {title}
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/25">
                  World Map API
                </span>
              </h2>
              <p className="text-[11px] text-zinc-400">Search any global city, UN hub, custom venue, or pin on the world map</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-5 pt-3 pb-2 border-b border-white/[0.06] bg-black/40 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              activeTab === 'search'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Worldwide</span>
          </button>

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
            onClick={() => setActiveTab('diplomacy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-medium transition cursor-pointer ${
              activeTab === 'diplomacy'
                ? 'bg-white text-black font-bold shadow'
                : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            <span>Diplomatic & Civic Nodes</span>
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
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
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
                  placeholder="Search any country, city, address, or conference hall..."
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
                    <span>GLOBAL SEARCH RESULTS ({searchResults.length})</span>
                    <span>Powered by OpenStreetMap</span>
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
                          <div>
                            <p className="text-xs font-bold text-white">{loc.name}</p>
                            <p className="text-[10px] text-zinc-400 font-mono">
                              {loc.city ? `${loc.city}, ` : ''}{loc.country || 'Global Coordinate'}
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
                    {GLOBAL_PRESET_LOCATIONS.slice(8, 26).map((loc) => (
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
                            ? 'bg-cyan-500/20 border-cyan-400 text-white font-bold'
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

          {/* INTERACTIVE WORLD MAP TAB */}
          {activeTab === 'map' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-300 px-1">
                <span className="font-mono text-[11px] text-zinc-400">
                  📍 Click anywhere on the map to pin latitude & longitude:
                </span>
                {mapPin && (
                  <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                    Pin: {mapPin.lat.toFixed(2)}°, {mapPin.lng.toFixed(2)}°
                  </span>
                )}
              </div>

              {/* Interactive World Map SVG Container */}
              <div className="relative w-full aspect-[2/1] bg-[#070913] rounded-2xl border border-white/15 overflow-hidden shadow-inner cursor-crosshair group">
                {/* SVG Equirectangular World Map Projection */}
                <svg
                  viewBox="0 0 1000 500"
                  className="w-full h-full"
                  onClick={handleMapClick}
                >
                  <defs>
                    <pattern id="world-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.05)" strokeWidth="0.75" />
                    </pattern>
                    <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Grid Lines */}
                  <rect width="1000" height="500" fill="url(#world-grid)" />

                  {/* Equator & Prime Meridian */}
                  <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(34, 211, 238, 0.25)" strokeDasharray="4 4" />
                  <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(34, 211, 238, 0.25)" strokeDasharray="4 4" />

                  {/* Stylized Continents Outlines */}
                  {/* North America */}
                  <path
                    d="M 120 70 Q 180 50 250 80 Q 280 140 250 210 Q 200 240 180 280 Q 150 240 130 180 Q 80 140 120 70 Z"
                    fill="rgba(255, 255, 255, 0.08)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.2"
                  />
                  {/* South America */}
                  <path
                    d="M 260 280 Q 340 300 330 380 Q 300 460 270 480 Q 250 420 240 350 Q 240 300 260 280 Z"
                    fill="rgba(255, 255, 255, 0.08)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.2"
                  />
                  {/* Europe */}
                  <path
                    d="M 450 90 Q 550 80 580 150 Q 520 200 460 190 Q 430 150 450 90 Z"
                    fill="rgba(255, 255, 255, 0.09)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.2"
                  />
                  {/* Africa */}
                  <path
                    d="M 460 200 Q 560 190 580 270 Q 550 390 510 420 Q 460 380 440 280 Q 430 220 460 200 Z"
                    fill="rgba(255, 255, 255, 0.08)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.2"
                  />
                  {/* Asia */}
                  <path
                    d="M 580 90 Q 820 60 900 130 Q 860 250 780 280 Q 670 290 600 220 Q 580 150 580 90 Z"
                    fill="rgba(255, 255, 255, 0.08)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.2"
                  />
                  {/* Australia & Oceania */}
                  <path
                    d="M 780 340 Q 880 340 870 420 Q 800 450 760 410 Q 740 370 780 340 Z"
                    fill="rgba(255, 255, 255, 0.08)"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="1.2"
                  />

                  {/* Preset Diplomatic Pins on Map */}
                  {GLOBAL_PRESET_LOCATIONS.map((loc, i) => {
                    if (loc.lat === undefined || loc.lng === undefined) return null;
                    const cx = ((loc.lng + 180) / 360) * 1000;
                    const cy = ((90 - loc.lat) / 180) * 500;
                    const isSelected = selectedLocation?.name === loc.name;

                    return (
                      <g key={i} className="cursor-pointer">
                        <circle
                          cx={cx}
                          cy={cy}
                          r={isSelected ? 6 : 2.5}
                          fill={isSelected ? '#22d3ee' : loc.type === 'civic' ? '#f59e0b' : '#a1a1aa'}
                          className="transition-all hover:scale-150"
                        />
                        {isSelected && (
                          <circle
                            cx={cx}
                            cy={cy}
                            r={14}
                            fill="none"
                            stroke="#22d3ee"
                            strokeWidth="1.5"
                            className="animate-ping"
                          />
                        )}
                      </g>
                    );
                  })}

                  {/* Active Dropped Pin */}
                  {mapPin && (
                    <g>
                      {(() => {
                        const cx = ((mapPin.lng + 180) / 360) * 1000;
                        const cy = ((90 - mapPin.lat) / 180) * 500;
                        return (
                          <React.Fragment key="active-pin">
                            <circle cx={cx} cy={cy} r={20} fill="url(#radar-glow)" />
                            <circle cx={cx} cy={cy} r={5} fill="#f43f5e" />
                            <circle cx={cx} cy={cy} r={12} fill="none" stroke="#f43f5e" strokeWidth="1.5" />
                          </React.Fragment>
                        );
                      })()}
                    </g>
                  )}
                </svg>

                {/* Overlay Instruction */}
                <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md border border-white/10 text-[10px] font-mono text-zinc-400 pointer-events-none">
                  Click any coordinate on Earth to drop radar pin
                </div>
              </div>

              {/* Nearest Location card under map */}
              {selectedLocation && (
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <div>
                      <p className="text-xs font-bold text-white">{selectedLocation.name}</p>
                      <p className="text-[10px] text-zinc-400 font-mono">
                        {selectedLocation.country || 'Custom Geographic Locus'}
                        {selectedLocation.lat && selectedLocation.lng
                          ? ` • [${selectedLocation.lat.toFixed(2)}°, ${selectedLocation.lng.toFixed(2)}°]`
                          : ''}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSelectAndConfirm(selectedLocation)}
                    className="px-3 py-1.5 rounded-xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition cursor-pointer shadow"
                  >
                    Select Pin
                  </button>
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
              <span>OR ENTER CUSTOM VENUE / ROOM</span>
              <span>Constituent Halls & Labs</span>
            </div>
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-zinc-500 shrink-0" />
              <input
                type="text"
                value={customVenue}
                onChange={(e) => setCustomVenue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddCustomVenue();
                }}
                placeholder="e.g. Committee Room 4, Plenary Hall, Media Center..."
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
          <div className="truncate max-w-[55%]">
            {selectedLocation ? (
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-xs font-bold text-white truncate">{selectedLocation.name}</span>
              </div>
            ) : (
              <span className="text-[11px] text-zinc-500 font-mono">No location selected</span>
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
}
