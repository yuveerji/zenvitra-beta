import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { FounderSidebar } from '@/components/founder/FounderSidebar';
import { FounderClearanceGate } from '@/components/founder/FounderClearanceGate';
import { Cpu, Activity } from 'lucide-react';

export default async function SovereignVaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <FounderClearanceGate>
      <div className="min-h-screen w-full max-w-full bg-[#030405] text-neutral-100 flex flex-col md:flex-row selection:bg-rose-500 selection:text-white overflow-x-hidden">
        {/* High Security Sidebar */}
        <FounderSidebar />

        {/* Main Command Viewport */}
        <div className="flex-1 w-full min-w-0 min-h-screen flex flex-col overflow-x-hidden">
          {/* Hardware Status & Telemetry Header */}
          <header className="h-14 border-b border-amber-500/20 bg-[#06070a]/90 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between font-mono text-xs text-neutral-400 shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 truncate">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
              <span className="text-white font-bold tracking-wider truncate text-[11px] sm:text-xs">LEVEL 0 CLEARANCE ACTIVE</span>
              <span className="text-neutral-600 hidden sm:inline">|</span>
              <span className="text-[10px] sm:text-[11px] text-amber-400 font-bold hidden sm:inline">OPERATOR: @yuveer</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-[11px] shrink-0">
              <div className="flex items-center gap-1.5 text-amber-400">
                <Cpu className="w-3.5 h-3.5" />
                <span>CORE: 4.2%</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Activity className="w-3.5 h-3.5" />
                <span>RELAY: OPTIMAL</span>
              </div>
            </div>
          </header>

          {/* Content Body */}
          <main className="flex-1 w-full min-w-0 max-w-full p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
            {children}
          </main>
        </div>
      </div>
    </FounderClearanceGate>
  );
}
