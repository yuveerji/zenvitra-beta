import React from 'react';
import Link from 'next/link';
import { 
  Radio, 
  MessageSquare, 
  Calendar, 
  Newspaper, 
  Terminal, 
  ShieldCheck, 
  LogOut,
  Sparkles
} from 'lucide-react';
import { signOut } from '@/lib/auth';

interface SidebarProps {
  userRole?: string;
  userName?: string | null;
  userHandle?: string | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  userRole = 'USER',
  userName = 'Sovereign Node',
  userHandle = 'user',
}) => {
  const routes = [
    { label: 'PULSE', href: '/pulse', icon: Radio },
    { label: 'CHAT', href: '/chat', icon: MessageSquare },
    { label: 'EVENTS', href: '/events', icon: Calendar },
    { label: 'PRESS', href: '/press', icon: Newspaper },
  ];

  return (
    <aside className="w-full md:w-64 border-r border-white/10 bg-[#06070a]/90 backdrop-blur-xl p-5 flex flex-col justify-between shrink-0 font-sans">
      <div className="space-y-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-bold tracking-widest uppercase text-white">ZENVITRA</span>
            <span className="text-[9px] font-mono text-neutral-500">PLATFORM CORE</span>
          </div>
        </Link>

        <nav className="space-y-1.5 font-mono text-xs">
          {routes.map((route) => {
            const Icon = route.icon;
            return (
              <Link
                key={route.label}
                href={route.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-neutral-400 hover:text-white hover:bg-white/[0.05] transition"
              >
                <Icon className="w-4 h-4 text-neutral-400" />
                <span>{route.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center font-mono font-bold text-xs uppercase text-white">
            {userName?.[0] || 'U'}
          </div>
          <div className="overflow-hidden font-mono text-left">
            <p className="text-xs font-semibold text-white truncate">{userName}</p>
            <p className="text-[10px] text-neutral-500 truncate">@{userHandle}</p>
          </div>
        </div>

        <form
          action={async () => {
            'use server';
            await signOut({ redirectTo: '/login' });
          }}
        >
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 transition font-mono text-xs cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Disconnect</span>
          </button>
        </form>
      </div>
    </aside>
  );
};