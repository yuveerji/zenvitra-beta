'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Shield, Cpu, ChevronRight, CornerDownLeft } from 'lucide-react';

interface SovereignTerminalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeystroke?: () => void;
  onAccessGranted?: () => void;
}

interface CommandLog {
  id: string;
  type: 'input' | 'output' | 'error' | 'success';
  text: string;
}

export function SovereignTerminal({
  isOpen,
  onClose,
  onKeystroke,
  onAccessGranted,
}: SovereignTerminalProps) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState<CommandLog[]>([
    {
      id: 'init-1',
      type: 'output',
      text: 'ZENVITRA PROTOCOL [VER 4.2.0-SOVEREIGN]',
    },
    {
      id: 'init-2',
      type: 'output',
      text: 'SYSTEM ENCRYPTION: SHA-512 SECURE DIPLOMATIC NODE. TYPE "help" FOR AVAILABLE DIRECTIVES.',
    },
  ]);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = input.trim();
    if (!cmd) return;

    const newLogs: CommandLog[] = [
      ...logs,
      { id: Math.random().toString(), type: 'input', text: `$ ${cmd}` },
    ];

    const [directive, ...args] = cmd.toLowerCase().split(' ');

    switch (directive) {
      case 'help':
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          text: `AVAILABLE DIRECTIVES:
  help               - Display protocol manual
  nodes              - View active global telemetry nodes
  manifesto          - Stream revolutionary declaration
  clearance <email>  - Request elevated diplomatic authorization
  matrix             - Toggle planetary node network status
  time               - Current diplomatic countdown offset
  clear              - Wipe terminal stdout
  exit               - Dismiss command bridge`,
        });
        break;

      case 'clear':
        setLogs([]);
        setInput('');
        return;

      case 'exit':
        onClose();
        setInput('');
        return;

      case 'nodes':
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          text: `LIVE ACTIVE DIPLOMATIC NODES:
  [DELHI]     LAT: 28.6139° N | STATUS: NOMINAL [PRIMARY] | PING: 4ms
  [GENEVA]    LAT: 46.2044° N | STATUS: SYNCHRONIZED     | PING: 28ms
  [LONDON]    LAT: 51.5074° N | STATUS: ACTIVE           | PING: 34ms
  [SINGAPORE] LAT: 1.3521° N  | STATUS: ENCRYPTED        | PING: 18ms
  [NEW YORK]  LAT: 40.7128° N | STATUS: COLD STANDBY     | PING: 45ms`,
        });
        break;

      case 'manifesto':
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          text: `ZEN.CORE REVOLUTIONARY DIRECTIVE:
"Just as Bhagat Singh, Chandrashekhar Azad, and Veer Savarkar dismantled colonial empires through sheer intellectual conviction and supreme sacrifice, Zenvitra forges a digital renaissance where young minds claim true geopolitical sovereignty."`,
        });
        break;

      case 'clearance':
        const email = args[0];
        if (!email || !email.includes('@')) {
          newLogs.push({
            id: Math.random().toString(),
            type: 'error',
            text: 'ERROR: Specify a valid diplomatic relay email. Usage: clearance <delegate@sovereign.org>',
          });
        } else {
          newLogs.push({
            id: Math.random().toString(),
            type: 'success',
            text: `AUTHORIZATION GRANTED. Diplomatic cipher assigned to ${email}. Token: 0xZV_${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
          });
          onAccessGranted?.();
        }
        break;

      case 'time':
        const target = new Date('2026-10-02T14:00:00+05:30').getTime();
        const diff = target - Date.now();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff / (1000 * 60 * 60)) % 24);
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          text: `IGNITION CLOCK: ${days} DAYS, ${hrs} HOURS TO OCT 2, 2026 14:00 IST [PUBLIC CITADEL DEPLOYMENT]`,
        });
        break;

      case 'matrix':
        newLogs.push({
          id: Math.random().toString(),
          type: 'output',
          text: 'ORBITAL GRID: ALL 12 CRYPTOGRAPHIC SHARDS ENGAGED. CONSENSUS INTEGRITY 99.98%.',
        });
        break;

      default:
        newLogs.push({
          id: Math.random().toString(),
          type: 'error',
          text: `Unknown directive: "${directive}". Type "help" for permitted instructions.`,
        });
        break;
    }

    setLogs(newLogs);
    setInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-3xl rounded-2xl bg-[#07090e] border border-amber-500/30 shadow-[0_0_50px_rgba(217,119,6,0.15)] flex flex-col overflow-hidden font-mono text-xs">
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0a0d14] border-b border-white/10">
          <div className="flex items-center gap-2 text-amber-400">
            <Terminal className="h-4 w-4" />
            <span className="font-bold tracking-wider uppercase text-[11px]">
              SOVEREIGN CITADEL COMMAND CONSOLE
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-[10px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
              SECURE SHA-512
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Stdout Output Area */}
        <div className="p-4 h-80 overflow-y-auto space-y-2 select-text">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`leading-relaxed whitespace-pre-wrap ${
                log.type === 'input'
                  ? 'text-amber-300 font-semibold'
                  : log.type === 'error'
                  ? 'text-rose-400'
                  : log.type === 'success'
                  ? 'text-emerald-300'
                  : 'text-neutral-300'
              }`}
            >
              {log.text}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bridge */}
        <form
          onSubmit={handleCommand}
          className="flex items-center gap-2 px-4 py-3 bg-[#04060a] border-t border-white/10"
        >
          <ChevronRight className="h-4 w-4 text-amber-400 animate-pulse shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              onKeystroke?.();
            }}
            placeholder="Type directive (e.g. 'help', 'nodes', 'clearance <email>')..."
            className="flex-1 bg-transparent text-amber-200 placeholder-neutral-600 focus:outline-none font-mono text-xs"
          />
          <button
            type="submit"
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-semibold transition-all"
          >
            EXECUTE
            <CornerDownLeft className="h-3 w-3" />
          </button>
        </form>
      </div>
    </div>
  );
}
