'use client';

import React, { useState } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Crosshair, 
  SlidersHorizontal, 
  Check, 
  X, 
  Radio, 
  Sparkles, 
  Building2, 
  AlertCircle 
} from 'lucide-react';
import { useZenEvents, KNOWN_CITIES } from '@/context/ZenEventsPlatformContext';

const RADIUS_OPTIONS = [
  { label: 'Within 10 km', value: 10 },
  { label: 'Within 25 km', value: 25 },
  { label: 'Within 50 km', value: 50 },
  { label: 'Within 100 km', value: 100 },
  { label: 'Any Distance', value: null },
];

export function LocationRadarBar() {
  const {
    userLocation,
    setUserLocation,
    isLocating,
    locationError,
    requestCurrentLocation,
    selectedCity,
    setSelectedCity,
    maxDistanceKm,
    setMaxDistanceKm,
    activeFilter,
    setActiveFilter,
    filteredEvents
  } = useZenEvents();

  const [showCityPicker, setShowCityPicker] = useState(false);
  const [showRadiusPicker, setShowRadiusPicker] = useState(false);

  const isNearbyActive = activeFilter === 'nearby' || Boolean(userLocation);

  const handleSelectCity = (cityValue: string) => {
    setSelectedCity(cityValue);
    setShowCityPicker(false);
    if (cityValue !== 'ALL') {
      const cityData = KNOWN_CITIES.find(c => c.value === cityValue);
      if (cityData && cityData.lat) {
        setUserLocation({
          latitude: cityData.lat,
          longitude: cityData.lng,
          city: cityData.name,
          address: `${cityData.name}, India / Global`
        });
      }
    } else {
      setUserLocation(null);
      setMaxDistanceKm(null);
    }
  };

  const clearLocationFilter = () => {
    setUserLocation(null);
    setSelectedCity('ALL');
    setMaxDistanceKm(null);
    if (activeFilter === 'nearby') {
      setActiveFilter('all');
    }
  };

  // Find nearest event distance
  const eventsWithDist = filteredEvents.filter(e => typeof e.distanceKm === 'number');
  const nearestDist = eventsWithDist.length > 0
    ? Math.min(...eventsWithDist.map(e => e.distanceKm as number))
    : null;

  return (
    <div className="rounded-3xl p-3.5 sm:p-5 bg-gradient-to-r from-[#0d121f] via-[#090d16] to-[#0d121f] border border-cyan-500/25 shadow-[0_0_35px_rgba(0,242,254,0.08)] space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        {/* Left: Auto-detect GPS button & City Selector */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-2.5 w-full sm:w-auto">
          {/* Geolocation Button */}
          <button
            type="button"
            onClick={requestCurrentLocation}
            disabled={isLocating}
            className={`flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all shadow-md cursor-pointer w-full sm:w-auto ${
              userLocation
                ? 'bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 shadow-[0_0_20px_rgba(0,242,254,0.25)]'
                : 'bg-white/10 hover:bg-white/20 border border-white/15 text-white'
            }`}
          >
            {isLocating ? (
              <>
                <Radio className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                <span className="truncate">Triangulating...</span>
              </>
            ) : userLocation ? (
              <>
                <Crosshair className="w-4 h-4 text-cyan-300 animate-pulse shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[140px]">
                  {userLocation.city || 'GPS Active'}
                </span>
                <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="truncate">Use Location</span>
              </>
            )}
          </button>

          {/* City Switcher Dropdown */}
          <div className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => { setShowCityPicker(!showCityPicker); setShowRadiusPicker(false); }}
              className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs cursor-pointer transition"
            >
              <Building2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span className="font-semibold text-neutral-200 truncate">
                {selectedCity === 'ALL' ? 'Select City' : selectedCity}
              </span>
            </button>

            {showCityPicker && (
              <div className="absolute top-full left-0 mt-2 w-full sm:w-56 rounded-2xl bg-[#0b0f19] border border-cyan-500/30 p-2 shadow-2xl z-30 space-y-1 backdrop-blur-2xl">
                <div className="px-3 py-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10">
                  Select Metropole
                </div>
                <div className="max-h-56 overflow-y-auto space-y-0.5 custom-scrollbar pt-1">
                  {KNOWN_CITIES.map((city) => (
                    <button
                      key={city.value}
                      type="button"
                      onClick={() => handleSelectCity(city.value)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                        selectedCity === city.value
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <span className="truncate">{city.name}</span>
                      {selectedCity === city.value && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Radius Selector (if location is active) */}
          {userLocation && (
            <div className="relative w-full sm:w-auto col-span-1 xs:col-span-2 sm:col-span-1">
              <button
                type="button"
                onClick={() => { setShowRadiusPicker(!showRadiusPicker); setShowCityPicker(false); }}
                className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-2 px-3.5 py-2.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white font-mono text-xs cursor-pointer transition"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="font-semibold text-neutral-200 truncate">
                  {maxDistanceKm ? `Within ${maxDistanceKm} km` : 'Any Distance'}
                </span>
              </button>

              {showRadiusPicker && (
                <div className="absolute top-full left-0 mt-2 w-full sm:w-48 rounded-2xl bg-[#0b0f19] border border-cyan-500/30 p-2 shadow-2xl z-30 space-y-1 backdrop-blur-2xl">
                  <div className="px-3 py-1 text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-widest border-b border-white/10">
                    Radar Radius
                  </div>
                  <div className="space-y-0.5 pt-1">
                    {RADIUS_OPTIONS.map((opt) => (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => { setMaxDistanceKm(opt.value); setShowRadiusPicker(false); }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono flex items-center justify-between transition cursor-pointer ${
                          maxDistanceKm === opt.value
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                            : 'text-neutral-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{opt.label}</span>
                        {maxDistanceKm === opt.value && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right: Quick Nearby Toggle & Clear */}
        <div className="flex items-center justify-end gap-2 w-full sm:w-auto">
          {userLocation ? (
            <button
              type="button"
              onClick={clearLocationFilter}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-neutral-400 text-xs font-mono transition border border-white/10 cursor-pointer"
            >
              <X className="w-3.5 h-3.5 shrink-0" />
              <span>Reset Location</span>
            </button>
          ) : (
            <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
              Allow location to find events near you
            </span>
          )}
        </div>
      </div>

      {/* Live Geolocation Radar Status Banner */}
      {userLocation && (
        <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-cyan-300">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400 animate-pulse shrink-0" />
            <span>
              <strong>Nearby Radar:</strong> Showing <strong>{filteredEvents.length}</strong> convening{filteredEvents.length === 1 ? '' : 's'} near <strong>{userLocation.city || 'your coordinates'}</strong>
              {maxDistanceKm && ` within ${maxDistanceKm} km`}
              {nearestDist !== null && ` • Closest is only ${nearestDist} km away!`}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setActiveFilter('nearby')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider transition ${
              activeFilter === 'nearby'
                ? 'bg-cyan-400 text-black shadow-[0_0_15px_rgba(0,242,254,0.5)]'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {activeFilter === 'nearby' ? '✓ Radar Filter On' : 'Filter Nearest First'}
          </button>
        </div>
      )}

      {/* Location Error Helper */}
      {locationError && (
        <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-xs font-mono text-amber-300">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{locationError}</span>
          </div>
          <button
            type="button"
            onClick={() => handleSelectCity('New Delhi')}
            className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-[11px] font-bold underline cursor-pointer"
          >
            Use New Delhi NCR
          </button>
        </div>
      )}
    </div>
  );
}
