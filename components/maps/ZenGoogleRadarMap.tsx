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
import { MapPin, Globe, Sparkles, RefreshCw, Radio } from 'lucide-react';

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyAa0-KtQjJYuBpzMyPVrMGFLBQKbGeUCxo';

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
  const [activeMarker, setActiveMarker] = useState<RadarMapMarker | null>(null);

  // Combine default hubs with dynamic markers passed from props
  const allMarkers: RadarMapMarker[] = [
    ...DEFAULT_GLOBAL_HUBS,
    ...(markers || []).filter(
      (m) => !DEFAULT_GLOBAL_HUBS.some((h) => h.id === m.id)
    )
  ];

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
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-sans font-semibold text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Live Radar Active</span>
          </div>
        </div>
      </div>

      {/* Main Map Canvas */}
      <div className={`w-full ${heightClass} relative`}>
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
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
      </div>
    );
  }
