'use client';

import React, { useState, useEffect } from 'react';
import { 
  APIProvider, 
  Map, 
  AdvancedMarker, 
  Pin, 
  InfoWindow, 
  ColorScheme 
} from '@vis.gl/react-google-maps';
import { MapPin, Globe, Sparkles, Key, ExternalLink, RefreshCw, X, Radio } from 'lucide-react';

export interface RadarMapMarker {
  id: string;
  title: string;
  subtitle?: string;
  locationName: string;
  lat: number;
  lng: number;
  type: 'post' | 'glimpse' | 'hub' | 'summit';
  count?: number;
  mediaUrl?: string;
  meta?: any;
}

interface ZenGoogleRadarMapProps {
  markers?: RadarMapMarker[];
  selectedMarkerId?: string | null;
  onSelectMarker?: (marker: RadarMapMarker) => void;
  className?: string;
  heightClass?: string;
}

const DEFAULT_GLOBAL_HUBS: RadarMapMarker[] = [
  {
    id: 'hub_delhi',
    title: 'Global Civic Commons',
    subtitle: 'Secretariat & Youth Chapter Hub',
    locationName: 'New Delhi, India',
    lat: 28.6139,
    lng: 77.2090,
    type: 'hub',
    count: 42,
  },
  {
    id: 'hub_geneva',
    title: 'Geneva Diplomatic Enclave',
    subtitle: 'Palais des Nations • Multilateral Caucus',
    locationName: 'Geneva, Switzerland',
    lat: 46.2263,
    lng: 6.1408,
    type: 'summit',
    count: 28,
  },
  {
    id: 'hub_nyc',
    title: 'UNSC Chamber Floor',
    subtitle: 'United Nations HQ Secretariat',
    locationName: 'New York, USA',
    lat: 40.7499,
    lng: -73.9674,
    type: 'summit',
    count: 36,
  },
  {
    id: 'hub_london',
    title: 'City Youth Assembly',
    subtitle: 'Parliamentary Youth Node',
    locationName: 'London, UK',
    lat: 51.5074,
    lng: -0.1278,
    type: 'hub',
    count: 19,
  },
  {
    id: 'hub_bengaluru',
    title: 'Innovation & Research Lab',
    subtitle: 'Digital Sovereignty Technology Cell',
    locationName: 'Bengaluru, India',
    lat: 12.9716,
    lng: 77.5946,
    type: 'hub',
    count: 31,
  },
  {
    id: 'hub_tokyo',
    title: 'East Asia Youth Nexus',
    subtitle: 'Civic Futures Research Council',
    locationName: 'Tokyo, Japan',
    lat: 35.6762,
    lng: 139.6503,
    type: 'hub',
    count: 15,
  },
  {
    id: 'hub_nairobi',
    title: 'UNEP Regional Assembly',
    subtitle: 'Ecological & Climate Action Node',
    locationName: 'Nairobi, Kenya',
    lat: -1.2921,
    lng: 36.8219,
    type: 'summit',
    count: 22,
  },
  {
    id: 'hub_sf',
    title: 'Digital Commons Terminal',
    subtitle: 'Mesh Governance & Autonomous Nodes',
    locationName: 'San Francisco, USA',
    lat: 37.7749,
    lng: -122.4194,
    type: 'hub',
    count: 24,
  },
];

export function ZenGoogleRadarMap({
  markers,
  selectedMarkerId,
  onSelectMarker,
  className = '',
  heightClass = 'h-[440px]'
}: ZenGoogleRadarMapProps) {
  const [apiKey, setApiKey] = useState<string>('');
  const [customKeyInput, setCustomKeyInput] = useState<string>('');
  const [showKeyInputModal, setShowKeyInputModal] = useState(false);
  const [activeMarker, setActiveMarker] = useState<RadarMapMarker | null>(null);

  // Combine default hubs with dynamic markers passed from props
  const allMarkers: RadarMapMarker[] = [
    ...DEFAULT_GLOBAL_HUBS,
    ...(markers || []).filter(
      (m) => !DEFAULT_GLOBAL_HUBS.some((h) => h.id === m.id)
    )
  ];

  // Resolve API Key: env var or client storage
  useEffect(() => {
    const envKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (envKey && envKey.trim()) {
      setApiKey(envKey.trim());
      return;
    }

    try {
      const storedKey = localStorage.getItem('zenvitra_google_maps_key');
      if (storedKey && storedKey.trim()) {
        setApiKey(storedKey.trim());
      }
    } catch {}
  }, []);

  const handleSaveCustomKey = (key: string) => {
    const trimmed = key.trim();
    if (!trimmed) return;
    setApiKey(trimmed);
    try {
      localStorage.setItem('zenvitra_google_maps_key', trimmed);
    } catch {}
    setShowKeyInputModal(false);
  };

  const handleClearCustomKey = () => {
    setApiKey('');
    try {
      localStorage.removeItem('zenvitra_google_maps_key');
    } catch {}
  };

  // Sync selected marker from props
  useEffect(() => {
    if (selectedMarkerId) {
      const found = allMarkers.find((m) => m.id === selectedMarkerId);
      if (found) setActiveMarker(found);
    }
  }, [selectedMarkerId, allMarkers]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/10 bg-[#090b14]/90 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] ${className}`}>
      {/* Top Ambient Hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent z-10" />

      {/* Header Bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-[#07080e]/80 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
          <span className="font-display font-black text-xs uppercase tracking-wider text-white">
            Google Maps Platform • Global Live Radar
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-sans font-bold text-cyan-300">
            <Radio className="w-2.5 h-2.5" />
            {allMarkers.length} Nodes Mapped
          </span>
        </div>

        <div className="flex items-center gap-2">
          {apiKey ? (
            <button
              type="button"
              onClick={() => setShowKeyInputModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-[11px] font-sans font-medium text-neutral-300 hover:text-white transition cursor-pointer"
              title="Configure Maps API Key"
            >
              <Key className="w-3 h-3 text-amber-400" />
              <span>Key Configured</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowKeyInputModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-[11px] font-sans font-bold text-cyan-200 transition cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.3)]"
            >
              <Key className="w-3 h-3 text-cyan-400 animate-bounce" />
              <span>Add Maps Demo Key</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Map Canvas or Key Activation Prompt */}
      {apiKey ? (
        <div className={`w-full ${heightClass} relative`}>
          <APIProvider apiKey={apiKey}>
            <Map
              mapId="DEMO_MAP_ID"
              internalUsageAttributionIds={["gmp_git_agentskills_v1"]}
              defaultZoom={2}
              defaultCenter={{ lat: 25.0, lng: 15.0 }}
              colorScheme={ColorScheme.DARK}
              gestureHandling="cooperative"
              disableDefaultUI={false}
              className="w-full h-full"
            >
              {allMarkers.map((marker) => {
                const isSelected = activeMarker?.id === marker.id;
                const isSummit = marker.type === 'summit';
                const isGlimpse = marker.type === 'glimpse';

                const bgPin = isSummit 
                  ? '#ec4899' // Pink / Rose
                  : isGlimpse 
                  ? '#a855f7' // Purple
                  : '#06b6d4'; // Cyan
                
                const borderPin = isSummit ? '#be185d' : isGlimpse ? '#7e22ce' : '#0891b2';

                return (
                  <AdvancedMarker
                    key={marker.id}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    title={marker.title}
                    onClick={() => {
                      setActiveMarker(marker);
                      if (onSelectMarker) onSelectMarker(marker);
                    }}
                  >
                    <Pin
                      background={bgPin}
                      borderColor={borderPin}
                      glyphColor="#ffffff"
                      scale={isSelected ? 1.25 : 1.0}
                    />
                  </AdvancedMarker>
                );
              })}

              {activeMarker && (
                <InfoWindow
                  position={{ lat: activeMarker.lat, lng: activeMarker.lng }}
                  onCloseClick={() => setActiveMarker(null)}
                  headerContent={
                    <div className="flex items-center gap-1.5 font-bold text-xs text-neutral-900 pr-4">
                      <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{activeMarker.title}</span>
                    </div>
                  }
                >
                  <div className="p-2 space-y-2 text-neutral-800 text-xs max-w-xs">
                    {activeMarker.subtitle && (
                      <p className="text-neutral-600 leading-snug font-medium">
                        {activeMarker.subtitle}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-200 text-[11px] text-neutral-500">
                      <span className="font-semibold">{activeMarker.locationName}</span>
                      {activeMarker.count !== undefined && (
                        <span className="font-bold text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-full">
                          {activeMarker.count} signals
                        </span>
                      )}
                    </div>
                    {onSelectMarker && (
                      <button
                        type="button"
                        onClick={() => onSelectMarker(activeMarker)}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-center text-xs transition cursor-pointer"
                      >
                        Filter Dispatches from this Node →
                      </button>
                    )}
                  </div>
                </InfoWindow>
              )}
            </Map>
          </APIProvider>
        </div>
      ) : (
        <div className={`w-full ${heightClass} flex flex-col items-center justify-center p-6 text-center space-y-5 bg-[#06080e]/95`}>
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
            <Globe className="w-8 h-8 animate-spin-slow" />
          </div>

          <div className="max-w-md space-y-2">
            <h3 className="font-display font-extrabold text-xl text-white tracking-tight">
              Activate Google Maps Platform Live Radar
            </h3>
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              Visualize real-time youth assemblies, MUN diplomatic summits, and camera glimpses across global geographic coordinates with the modern Google Maps SDK.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <a
              href="https://mapsplatform.google.com/maps-demo-key?utm_campaign=gmp_git_agentskills_v1"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-sans font-bold text-xs shadow-[0_0_20px_rgba(6,182,212,0.4)] transition cursor-pointer"
            >
              <span>Get Free Maps Demo Key (Zero Setup)</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              type="button"
              onClick={() => setShowKeyInputModal(true)}
              className="px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.09] border border-white/15 text-white font-sans font-semibold text-xs transition cursor-pointer"
            >
              Enter API Key
            </button>
          </div>

          <p className="text-[11px] text-neutral-500 font-sans max-w-sm">
            💡 The Maps Demo Key allows zero-cost prototyping with no credit card or Google Cloud billing account setup required.
          </p>
        </div>
      )}

      {/* Key Input Modal */}
      {showKeyInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-[#0b0d18] border border-white/15 p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <h4 className="font-display font-bold text-sm text-white">
                  Google Maps Platform API Key
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowKeyInputModal(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-300 font-sans leading-relaxed">
              Enter your Google Cloud Maps API Key or free Maps Demo Key to initialize interactive mapping:
            </p>

            <div className="space-y-2">
              <input
                type="text"
                value={customKeyInput}
                onChange={(e) => setCustomKeyInput(e.target.value)}
                placeholder="AIzaSy... or Maps Demo Key"
                className="w-full px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/15 text-sm text-white font-mono placeholder:text-neutral-600 focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/40"
              />
              <p className="text-[10px] text-neutral-500 font-sans">
                You can also permanently configure <code className="text-cyan-300">NEXT_PUBLIC_GOOGLE_MAPS_API_KEY</code> in <code className="text-neutral-300">.env</code>.
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              {apiKey && (
                <button
                  type="button"
                  onClick={handleClearCustomKey}
                  className="text-xs text-rose-400 hover:text-rose-300 font-medium cursor-pointer"
                >
                  Remove Key
                </button>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <button
                  type="button"
                  onClick={() => setShowKeyInputModal(false)}
                  className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSaveCustomKey(customKeyInput)}
                  disabled={!customKeyInput.trim()}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-sans font-bold text-xs hover:from-cyan-300 hover:to-blue-400 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-md cursor-pointer"
                >
                  Activate Radar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
