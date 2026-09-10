'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Globe, Radio, Shield, Zap } from 'lucide-react';

interface DiplomaticNode {
  name: string;
  lat: number;
  lng: number;
  status: 'PRIMARY' | 'ACTIVE' | 'SYNCHRONIZED' | 'COLD STANDBY';
  ping: string;
}

const NODES: DiplomaticNode[] = [
  { name: 'UDAIPUR [HQ]', lat: 24.5854, lng: 73.7125, status: 'PRIMARY', ping: '4ms' },
  { name: 'GENEVA', lat: 46.2044, lng: 6.1432, status: 'SYNCHRONIZED', ping: '28ms' },
  { name: 'LONDON', lat: 51.5074, lng: -0.1278, status: 'ACTIVE', ping: '34ms' },
  { name: 'SINGAPORE', lat: 1.3521, lng: 103.8198, status: 'ACTIVE', ping: '18ms' },
  { name: 'NEW YORK', lat: 40.7128, lng: -74.006, status: 'COLD STANDBY', ping: '45ms' },
  { name: 'TOKYO', lat: 35.6762, lng: 139.6503, status: 'ACTIVE', ping: '32ms' },
];

export function DiplomaticGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<DiplomaticNode>(NODES[0]);
  const rotationRef = useRef({ x: 0.3, y: 1.2 });
  const isDraggingRef = useRef(false);
  const lastMouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const size = (canvas.width = canvas.height = 420);
    const radius = size * 0.38;
    const cx = size / 2;
    const cy = size / 2;

    const render = () => {
      if (!isDraggingRef.current) {
        rotationRef.current.y += 0.004; // smooth slow rotation
      }

      ctx.clearRect(0, 0, size, size);

      // Globe ambient glow atmosphere
      const atmGrad = ctx.createRadialGradient(cx, cy, radius * 0.8, cx, cy, radius * 1.25);
      atmGrad.addColorStop(0, 'rgba(217, 119, 6, 0.08)');
      atmGrad.addColorStop(0.7, 'rgba(16, 185, 129, 0.04)');
      atmGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = atmGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      // Outer globe boundary
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(217, 119, 6, 0.3)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Longitude meridians (circles)
      const rotY = rotationRef.current.y;
      const rotX = rotationRef.current.x;

      for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / 6) {
        ctx.beginPath();
        const pts: { x: number; y: number; z: number }[] = [];
        for (let lat = -Math.PI / 2; lat <= Math.PI / 2; lat += 0.15) {
          // 3D sphere coordinate
          const x = radius * Math.cos(lat) * Math.sin(lon + rotY);
          const y = radius * Math.sin(lat);
          const z = radius * Math.cos(lat) * Math.cos(lon + rotY);

          // Rotate by rotX (tilt)
          const rxY = y * Math.cos(rotX) - z * Math.sin(rotX);
          const rxZ = y * Math.sin(rotX) + z * Math.cos(rotX);

          pts.push({ x: cx + x, y: cy + rxY, z: rxZ });
        }

        ctx.beginPath();
        let first = true;
        for (const pt of pts) {
          if (pt.z > -radius * 0.2) {
            // Front hemisphere
            if (first) {
              ctx.moveTo(pt.x, pt.y);
              first = false;
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.06)';
        ctx.lineWidth = 0.75;
        ctx.stroke();
      }

      // Latitude parallels
      for (let latDeg = -60; latDeg <= 60; latDeg += 30) {
        const latRad = (latDeg * Math.PI) / 180;
        const rParallel = radius * Math.cos(latRad);
        const yBase = radius * Math.sin(latRad);

        ctx.beginPath();
        let first = true;
        for (let a = 0; a <= Math.PI * 2 + 0.1; a += 0.1) {
          const x = rParallel * Math.sin(a + rotY);
          const y = yBase;
          const z = rParallel * Math.cos(a + rotY);

          const rxY = y * Math.cos(rotX) - z * Math.sin(rotX);
          const rxZ = y * Math.sin(rotX) + z * Math.cos(rotX);

          if (rxZ > -radius * 0.2) {
            if (first) {
              ctx.moveTo(cx + x, cy + rxY);
              first = false;
            } else {
              ctx.lineTo(cx + x, cy + rxY);
            }
          } else {
            first = true;
          }
        }
        ctx.strokeStyle = 'rgba(217, 119, 6, 0.12)';
        ctx.lineWidth = 0.65;
        ctx.stroke();
      }

      // Draw and connect diplomatic nodes
      const projectedNodes: { node: DiplomaticNode; x: number; y: number; z: number }[] = [];

      NODES.forEach((n) => {
        const latRad = (n.lat * Math.PI) / 180;
        const lngRad = (n.lng * Math.PI) / 180;

        const x = radius * Math.cos(latRad) * Math.sin(lngRad + rotY);
        const y = radius * -Math.sin(latRad); // Invert latitude for canvas Y
        const z = radius * Math.cos(latRad) * Math.cos(lngRad + rotY);

        const rxY = y * Math.cos(rotX) - z * Math.sin(rotX);
        const rxZ = y * Math.sin(rotX) + z * Math.cos(rotX);

        if (rxZ > -20) {
          projectedNodes.push({ node: n, x: cx + x, y: cy + rxY, z: rxZ });
        }
      });

      // Connecting chords
      for (let i = 0; i < projectedNodes.length; i++) {
        for (let j = i + 1; j < projectedNodes.length; j++) {
          const n1 = projectedNodes[i];
          const n2 = projectedNodes[j];
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.18)';
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw node beacons
      projectedNodes.forEach(({ node, x, y }) => {
        const isSel = selectedNode.name === node.name;
        // Pulse outer ring
        ctx.beginPath();
        ctx.arc(x, y, isSel ? 7 : 4, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.25)';
        ctx.fill();

        // Solid beacon
        ctx.beginPath();
        ctx.arc(x, y, isSel ? 3.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = isSel ? '#fbbf24' : '#10b981';
        ctx.fill();

        // Text label
        ctx.font = '9px monospace';
        ctx.fillStyle = isSel ? '#fef3c7' : 'rgba(226, 232, 240, 0.6)';
        ctx.fillText(node.name.split(' ')[0], x + 6, y + 3);
      });

      animId = requestAnimationFrame(render);
    };

    render();

    // Mouse drag rotation controls
    const onMouseDown = (e: MouseEvent) => {
      isDraggingRef.current = true;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const dx = e.clientX - lastMouseRef.current.x;
      const dy = e.clientY - lastMouseRef.current.y;
      rotationRef.current.y += dx * 0.007;
      rotationRef.current.x += dy * 0.007;
      lastMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(animId);
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [selectedNode]);

  return (
    <div className="relative w-full max-w-4xl mx-auto rounded-3xl bg-gradient-to-b from-[#090c14] to-[#04060a] border border-amber-500/20 p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white tracking-wide">
              Global Sovereign Relay Network
            </h3>
            <p className="text-xs text-neutral-400 font-mono">
              REAL-TIME CRYPTOGRAPHIC NODE TELEMETRY & CONSENSUS
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            6 / 6 NODES ONLINE
          </span>
        </div>
      </div>

      {/* Main Interactive Stage: Canvas Globe + Node Selector Cards */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mt-6">
        {/* 3D Canvas Sphere */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center">
          <div className="relative">
            <canvas
              ref={canvasRef}
              className="cursor-grab active:cursor-grabbing rounded-full select-none"
            />
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neutral-500 bg-black/60 px-3 py-1 rounded-full border border-white/5 pointer-events-none">
              DRAG GLOBE TO ROTATE
            </div>
          </div>
        </div>

        {/* Node Telemetry Grid */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-[11px] font-mono uppercase tracking-wider text-amber-400/80 mb-2 flex items-center gap-1.5">
            <Radio className="h-3.5 w-3.5" />
            ACTIVE SOVEREIGN RELAYS
          </div>

          {NODES.map((n) => {
            const isSelected = selectedNode.name === n.name;
            return (
              <button
                key={n.name}
                type="button"
                onClick={() => setSelectedNode(n)}
                className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(217,119,6,0.15)]'
                    : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.05] hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-bold ${
                      isSelected ? 'text-amber-300' : 'text-neutral-200'
                    }`}
                  >
                    {n.name}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-semibold ${
                      n.status === 'PRIMARY'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                    }`}
                  >
                    {n.status}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-1 text-[10px] font-mono text-neutral-400">
                  <span>LAT: {n.lat}° | LNG: {n.lng}°</span>
                  <span className="text-emerald-400 font-semibold">{n.ping}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
