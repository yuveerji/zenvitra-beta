'use client';

import React, { useState, useEffect } from 'react';
import { Activity, Terminal, Lock, CheckCircle2, Download, Crown, RefreshCw } from 'lucide-react';
import { getAuditLogs, AuditLogEntry } from '@/lib/founderControl';

export default function SovereignLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);

  useEffect(() => {
    setLogs(getAuditLogs());
  }, []);

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenvitra_audit_ledger_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 font-sans text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-amber-500/30">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-[10px] font-bold mb-2">
            <Activity className="w-3.5 h-3.5" />
            <span>SECURITY AUDIT TRAIL</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-mono text-white tracking-wide uppercase">
            Live Protocol Mutation Ledger
          </h1>
          <p className="text-xs text-neutral-400 font-mono mt-1">
            Real-time telemetry and cryptographic authentication verifications signed by @yuveer.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            type="button"
            onClick={handleDownload}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold transition flex items-center gap-2 shadow cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Ledger JSON</span>
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="rounded-3xl border border-white/10 bg-[#06070a]/90 backdrop-blur-xl p-6 font-mono text-xs space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10 text-neutral-500 text-[10px]">
          <div className="flex items-center gap-2">
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-white font-bold">IMMUTABLE CRYPTOGRAPHIC STREAM // SOVEREIGN NODE</span>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Lock className="w-3 h-3" />
            <span>ZERO TAMPERING GUARANTEED</span>
          </div>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className="p-4 rounded-xl bg-black border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 text-[10px] font-bold">
                    {log.type}
                  </span>
                  <span className="text-white font-bold">{log.action}</span>
                </div>
                <p className="text-neutral-400 text-[11px]">OPERATOR: {log.operator || '@yuveer (Founder & CEO)'}</p>
              </div>

              <div className="flex items-center gap-3 text-right">
                <span className="text-[10px] text-neutral-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>VERIFIED</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
