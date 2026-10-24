'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  LifeBuoy, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldAlert, 
  HelpCircle, 
  MessageSquare, 
  ArrowRight, 
  ExternalLink, 
  Filter, 
  RefreshCw, 
  Sparkles,
  Shield,
  CreditCard,
  Calendar,
  Globe,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  SupportTicketItem, 
  SupportPolicyData, 
  CATEGORY_LABELS, 
  STATUS_CONFIG, 
  PRIORITY_CONFIG, 
  TicketCategory, 
  TicketStatus,
  TicketPriority 
} from '@/types/support';

export default function ZenSupportPage() {
  const { user, profile } = useAuth();
  const [tickets, setTickets] = useState<SupportTicketItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [policy, setPolicy] = useState<SupportPolicyData | null>(null);

  const userEmail = profile?.email || user?.email || '';
  const userId = profile?.id || user?.id || '';

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (userEmail) params.append('userEmail', userEmail);
      if (userId) params.append('userId', userId);
      if (selectedStatus !== 'ALL') params.append('status', selectedStatus);
      if (selectedCategory !== 'ALL') params.append('category', selectedCategory);

      const res = await fetch(`/api/support/tickets?${params.toString()}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.tickets)) {
        setTickets(data.tickets);
      }
    } catch (e) {
      console.error('Failed to load tickets', e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPolicy = async () => {
    try {
      const res = await fetch('/api/support/policy');
      const data = await res.json();
      if (data.success && data.policy) {
        setPolicy(data.policy);
      }
    } catch {}
  };

  useEffect(() => {
    fetchTickets();
    fetchPolicy();
  }, [userEmail, userId, selectedStatus, selectedCategory]);

  const openCount = tickets.filter(t => t.status === 'NEW' || t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;
  const waitingCount = tickets.filter(t => t.status === 'WAITING_USER').length;
  const resolvedCount = tickets.filter(t => t.status === 'RESOLVED').length;
  const closedCount = tickets.filter(t => t.status === 'CLOSED').length;

  const filteredTickets = tickets.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      t.ticketNumber.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-[#030407] text-white flex flex-col font-sans selection:bg-cyan-500/30">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
        
        {/* Module Distinction Banner */}
        <div className="p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-neutral-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-mono font-bold text-cyan-300">ZEN.SUPPORT OFFICIAL HELPDESK</span>
            <span className="text-neutral-500 hidden sm:inline">&bull;</span>
            <span className="text-neutral-300">Official issue resolution, ticket tracking &amp; verified support desk</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px]">
            <Link 
              href="/chat" 
              className="text-neutral-400 hover:text-cyan-300 transition flex items-center gap-1 group"
            >
              <span>Community Chat in <strong>ZEN.CHAT</strong></span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>

        {/* Planned Maintenance / Incident Banner */}
        {policy?.maintenanceNotice && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3 text-xs text-amber-200">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-white font-mono">Platform Operational Notice</strong>
              <p className="mt-0.5 text-neutral-300">{policy.maintenanceNotice}</p>
            </div>
          </div>
        )}

        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold">
                SOVEREIGN SERVICE OPERATIONS
              </span>
              <span className="text-[10px] font-mono text-neutral-400">TICKET LIFE-CYCLE V1.0</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white mt-2">
              Helpdesk &amp; Issue Resolution
            </h1>
            <p className="text-sm text-neutral-400 mt-1 max-w-2xl font-sans">
              Every request is assigned a unique case token, tracked by department specialists, and protected under ZENVITRA privacy rules.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {profile?.role && ['FOUNDER', 'CO_FOUNDER', 'ADMIN', 'CORE_TEAM', 'SUPPORT_LEAD', 'STAFF'].includes(String(profile.role).toUpperCase()) && (
              <Link
                href="/support/admin"
                className="px-4 py-2.5 rounded-2xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 hover:text-white border border-purple-500/30 transition font-mono text-xs flex items-center gap-2"
              >
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Admin Desk</span>
              </Link>
            )}
            <Link
              href="/support/help"
              className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-neutral-300 hover:text-white border border-white/10 transition font-mono text-xs flex items-center gap-2"
            >
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <span>Knowledge Base</span>
            </Link>
            <Link
              href="/support/new"
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-neutral-950 font-bold font-mono text-xs shadow-lg shadow-cyan-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-neutral-950" />
              <span>Submit New Ticket</span>
            </Link>
          </div>
        </div>

        {/* 4 Interactive Status Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 font-mono">
          <div 
            onClick={() => setSelectedStatus(selectedStatus === 'OPEN' ? 'ALL' : 'OPEN')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'OPEN' 
                ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10' 
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 uppercase">Active / In Queue</span>
              <LifeBuoy className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-2">{openCount}</div>
            <span className="text-[10px] text-cyan-300/80 block mt-1">Investigating / Open</span>
          </div>

          <div 
            onClick={() => setSelectedStatus(selectedStatus === 'WAITING_USER' ? 'ALL' : 'WAITING_USER')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'WAITING_USER' 
                ? 'bg-purple-500/15 border-purple-500/50 shadow-md shadow-purple-500/10' 
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 uppercase">Waiting on You</span>
              <Clock className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-purple-300 mt-2">{waitingCount}</div>
            <span className="text-[10px] text-purple-300/80 block mt-1">Requires your reply</span>
          </div>

          <div 
            onClick={() => setSelectedStatus(selectedStatus === 'RESOLVED' ? 'ALL' : 'RESOLVED')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'RESOLVED' 
                ? 'bg-emerald-500/15 border-emerald-500/50 shadow-md shadow-emerald-500/10' 
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 uppercase">Resolved</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-2">{resolvedCount}</div>
            <span className="text-[10px] text-emerald-300/80 block mt-1">Confirmed solutions</span>
          </div>

          <div 
            onClick={() => setSelectedStatus(selectedStatus === 'CLOSED' ? 'ALL' : 'CLOSED')}
            className={`p-4 rounded-2xl border transition cursor-pointer ${
              selectedStatus === 'CLOSED' 
                ? 'bg-neutral-800 border-neutral-600' 
                : 'bg-black/40 border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-neutral-400 uppercase">Archived</span>
              <Sparkles className="w-4 h-4 text-neutral-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-neutral-300 mt-2">{closedCount}</div>
            <span className="text-[10px] text-neutral-500 block mt-1">Completed records</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 rounded-2xl bg-black/60 border border-white/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket # or keyword..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Categories</option>
              <option value="ACCOUNT">Account &amp; Access</option>
              <option value="EVENTS">Events &amp; Registrations</option>
              <option value="MUN">MUN Support</option>
              <option value="PAYMENTS">Payments &amp; Refunds</option>
              <option value="TECHNICAL">Technical Issues</option>
              <option value="SAFETY">Safety &amp; Complaints</option>
              <option value="GENERAL">General &amp; Inquiries</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-neutral-300 font-mono focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">New</option>
              <option value="OPEN">Open</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="WAITING_USER">Waiting for You</option>
              <option value="RESOLVED">Resolved</option>
              <option value="CLOSED">Closed</option>
            </select>

            <button
              onClick={fetchTickets}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white border border-white/10 transition"
              title="Refresh Queue"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 font-mono px-1">
            <span>YOUR TICKETS ({filteredTickets.length})</span>
            <span>PROTECTED ENCRYPTED TRANSCRIPTS</span>
          </div>

          {loading ? (
            <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 text-neutral-400 font-mono text-xs flex flex-col items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
              <span>Querying verified support ledger...</span>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-black/40 border border-white/10 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mx-auto flex items-center justify-center">
                <LifeBuoy className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-mono text-white">No Support Requests Found</h3>
                <p className="text-xs text-neutral-400 max-w-sm mx-auto font-sans">
                  You do not have any active or previous support tickets matching this filter. Need assistance? Submit a request anytime.
                </p>
              </div>
              <Link
                href="/support/new"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/30 font-mono text-xs font-bold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create First Ticket</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredTickets.map((ticket) => {
                const catMeta = CATEGORY_LABELS[ticket.category as TicketCategory] || { label: ticket.category, team: 'Helpdesk' };
                const statMeta = STATUS_CONFIG[ticket.status as TicketStatus] || { label: ticket.status, badge: 'bg-neutral-800 text-neutral-400' };
                const prioMeta = PRIORITY_CONFIG[ticket.priority as TicketPriority] || { label: ticket.priority, badge: 'bg-white/10 text-neutral-300' };

                return (
                  <Link
                    key={ticket.id}
                    href={`/support/${ticket.ticketNumber || ticket.id}`}
                    className="p-5 rounded-3xl bg-black/50 hover:bg-[#070b14] border border-white/10 hover:border-cyan-500/40 transition group flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-mono font-bold text-cyan-400 px-2.5 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                          {ticket.ticketNumber}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-bold ${statMeta.badge}`}>
                          {statMeta.label}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${prioMeta.badge}`}>
                          {prioMeta.label.split('—')[0]}
                        </span>
                        <span className="text-[10px] font-mono text-neutral-500">
                          &bull; {catMeta.label}
                        </span>
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 transition">
                        {ticket.subject}
                      </h3>

                      <p className="text-xs text-neutral-400 line-clamp-2 font-sans">
                        {ticket.description}
                      </p>

                      <div className="flex items-center gap-4 text-[11px] text-neutral-500 font-mono pt-1">
                        <span>Submitted {new Date(ticket.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span>&bull;</span>
                        <span>Routing: {ticket.assignedTeam || catMeta.team}</span>
                        {ticket._count?.messages ? (
                          <>
                            <span>&bull;</span>
                            <span className="flex items-center gap-1 text-neutral-400">
                              <MessageSquare className="w-3 h-3 text-cyan-400" />
                              {ticket._count.messages} messages
                            </span>
                          </>
                        ) : null}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                      <span className="text-xs font-mono text-neutral-400 group-hover:text-cyan-300 flex items-center gap-1">
                        View Thread &rarr;
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Quick Help Topics */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Self-Service Knowledge Guides</span>
            </h2>
            <Link href="/support/help" className="text-xs font-mono text-cyan-400 hover:text-cyan-300">
              View All Guides &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-sans text-xs">
            <Link
              href="/support/help#payments"
              className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition group"
            >
              <div className="flex items-center gap-2 text-cyan-300 font-bold mb-1">
                <CreditCard className="w-4 h-4" />
                <span>Student GST &bull; 0% Exemption</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                How the ZENVITRA Article 12 National Youth Exemption works for delegates under 18.
              </p>
            </Link>

            <Link
              href="/support/help#mun"
              className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition group"
            >
              <div className="flex items-center gap-2 text-emerald-300 font-bold mb-1">
                <Globe className="w-4 h-4" />
                <span>MUN Dais Access &amp; Roll Call</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Troubleshooting committee speaker queues, voting cards, and secret resolution ballots.
              </p>
            </Link>

            <Link
              href="/support/help#tickets"
              className="p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-cyan-500/30 transition group"
            >
              <div className="flex items-center gap-2 text-purple-300 font-bold mb-1">
                <Shield className="w-4 h-4" />
                <span>Cryptographic Gate Pass Scanning</span>
              </div>
              <p className="text-neutral-400 text-[11px]">
                How HMAC-SHA256 digital seals prevent counterfeit QR tickets at conference venues.
              </p>
            </Link>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
