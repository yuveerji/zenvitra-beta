"use client";

import React, { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  Calculator,
  TrendingUp,
  TrendingDown,
  Ticket,
  Utensils,
  Store,
  Receipt,
  Handshake,
  Sliders,
  Download,
  RotateCcw,
  Plus,
  Trash2,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Layers,
  Calendar,
  Users,
  Copy,
  Check,
  AlertCircle,
  ArrowRight,
  Scale,
  Percent,
  DollarSign,
  PieChart,
  CheckCircle2,
  ChevronRight,
  Info,
  Maximize2,
  HelpCircle,
  Zap,
  Tag,
  Grid,
  RefreshCw,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ── TYPES & INTERFACES ──

type LineItem = {
  id: string;
  name: string;
  amount: number;
};

type TicketTier = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Vendor = {
  id: string;
  name: string;
  fee: number;
  commission: number;
  expectedSales: number;
};

type Sponsor = {
  id: string;
  name: string;
  cash: number;
  inKind: number;
};

type FoodMode = "buffet" | "hybrid" | "stalls";

type EventData = {
  eventName: string;
  eventDate: string;
  capacity: number;
  expectedAttendance: number;
  complimentary: number;
  refunds: number;
  processingRate: number;
  cashfreeFeeBorneByOrganizer: boolean; // whether fee is given to cashfree by organizer or not
  contingencyRate: number;
  foodMode: FoodMode;
  foodCost: number;
  foodFixedCost: number;
  stallDefaultPrice: number; // Set price per stall
  stallCapacity: number;     // Total stall count / inventory
  tickets: TicketTier[];
  expenses: LineItem[];
  vendors: Vendor[];
  sponsors: Sponsor[];
};

const uid = () => Math.random().toString(36).slice(2, 10);

// ── STRICT ZERO-SEEDED CLEAN INITIAL STATE ──
// Strictly compliant with NO SEEDED DATA rule and user request: all metrics reset to 0.
const initialData: EventData = {
  eventName: "BOL! — UDC Debating Fest",
  eventDate: "",
  capacity: 0,
  expectedAttendance: 0,
  complimentary: 0,
  refunds: 0,
  processingRate: 0,
  cashfreeFeeBorneByOrganizer: true,
  contingencyRate: 0,
  foodMode: "buffet",
  foodCost: 0,
  foodFixedCost: 0,
  stallDefaultPrice: 0,
  stallCapacity: 0,

  tickets: [
    { id: "tier_early", name: "Early Bird Delegate", price: 0, quantity: 0 },
    { id: "tier_regular", name: "Regular Delegate", price: 0, quantity: 0 },
    { id: "tier_late", name: "Late / Spot Entry", price: 0, quantity: 0 },
  ],

  expenses: [
    { id: "exp_venue", name: "Venue & Hall Rental", amount: 0 },
    { id: "exp_sound", name: "Sound System & Microphones", amount: 0 },
    { id: "exp_lighting", name: "Lighting & Visual Stage Setup", amount: 0 },
    { id: "exp_dj", name: "DJ / Cultural Night Artist", amount: 0 },
    { id: "exp_decor", name: "Podiums, Stage & Hall Décor", amount: 0 },
    { id: "exp_printing", name: "Certificates, Badges & Collaterals", amount: 0 },
    { id: "exp_marketing", name: "Marketing, Ads & Promotions", amount: 0 },
    { id: "exp_media", name: "Photography & Aftermovie Videography", amount: 0 },
    { id: "exp_transport", name: "Transport & Outstation Logistics", amount: 0 },
    { id: "exp_staff", name: "Secretariat Volunteers & Honorariums", amount: 0 },
    { id: "exp_misc", name: "Miscellaneous & Contingencies", amount: 0 },
  ],

  vendors: [],
  sponsors: [],
};

const money = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(value) ? value : 0);

const number = (value: unknown) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0;
};

// ── REUSABLE UI PRIMITIVES (UI/UX PRO MAX STANDARD) ──

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  type = "number",
  placeholder,
  helper,
  step,
  quickIncrements,
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  prefix?: string;
  suffix?: string;
  type?: string;
  placeholder?: string;
  helper?: string;
  step?: string | number;
  quickIncrements?: number[];
}) {
  return (
    <div className="space-y-1.5 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-slate-300 tracking-wide select-none">
          {label}
        </label>
        {helper && (
          <span className="text-[10px] font-mono text-slate-500">{helper}</span>
        )}
      </div>

      <div className="flex items-center rounded-xl border border-white/10 bg-[#060913] px-3.5 py-1.5 transition-all duration-200 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/25 hover:border-white/20">
        {prefix && (
          <span className="text-sm font-mono text-slate-400 mr-2 select-none">
            {prefix}
          </span>
        )}
        <input
          type={type}
          value={value}
          placeholder={placeholder}
          min={type === "number" ? 0 : undefined}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent py-1 text-sm font-mono text-white placeholder-slate-600 outline-none"
        />
        {suffix && (
          <span className="text-xs font-mono text-slate-400 ml-2 select-none">
            {suffix}
          </span>
        )}
      </div>

      {/* Optional Quick Increment Pills */}
      {quickIncrements && (
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="text-[9px] font-mono text-slate-500 uppercase">Quick:</span>
          {quickIncrements.map((inc) => (
            <button
              key={inc}
              type="button"
              onClick={() => onChange(String(number(value) + inc))}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/5 transition-all cursor-pointer"
            >
              +{inc}
            </button>
          ))}
          <button
            type="button"
            onClick={() => onChange("0")}
            className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition-all cursor-pointer ml-auto"
            title="Reset to 0"
          >
            0
          </button>
        </div>
      )}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  icon: Icon,
  badge,
  badgeColor = "text-cyan-400 border-cyan-500/30 bg-cyan-500/10",
  children,
  action,
}: {
  title: string;
  subtitle?: string;
  icon?: any;
  badge?: string;
  badgeColor?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#090d1a]/85 p-5 sm:p-7 backdrop-blur-xl shadow-[0_16px_40px_rgba(0,0,0,0.6)] text-left relative overflow-hidden group transition-all duration-300 hover:border-white/15">
      {/* Top subtle glow highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-cyan-400 shrink-0">
                <Icon className="w-4 h-4" />
              </div>
            )}
            <h2 className="text-lg sm:text-xl font-bold font-display text-white tracking-tight">
              {title}
            </h2>
            {badge && (
              <span
                className={`text-[10px] font-mono font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border ${badgeColor}`}
              >
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      {children}
    </section>
  );
}

function MetricCard({
  label,
  value,
  detail,
  trend,
  trendPositive,
  icon: Icon,
  colorScheme = "cyan",
}: {
  label: string;
  value: string;
  detail?: string;
  trend?: string;
  trendPositive?: boolean;
  icon?: any;
  colorScheme?: "cyan" | "emerald" | "amber" | "rose" | "purple";
}) {
  const colors = {
    cyan: {
      border: "border-cyan-500/25 hover:border-cyan-500/45",
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      text: "text-white",
      glow: "hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]",
      topHighlight: "from-cyan-500/30",
    },
    emerald: {
      border: "border-emerald-500/25 hover:border-emerald-500/45",
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      text: "text-emerald-400",
      glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.15)]",
      topHighlight: "from-emerald-500/30",
    },
    amber: {
      border: "border-amber-500/25 hover:border-amber-500/45",
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      text: "text-amber-400",
      glow: "hover:shadow-[0_0_30px_rgba(245,158,11,0.15)]",
      topHighlight: "from-amber-500/30",
    },
    rose: {
      border: "border-rose-500/25 hover:border-rose-500/45",
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      text: "text-rose-400",
      glow: "hover:shadow-[0_0_30px_rgba(244,63,94,0.15)]",
      topHighlight: "from-rose-500/30",
    },
    purple: {
      border: "border-purple-500/25 hover:border-purple-500/45",
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      text: "text-purple-300",
      glow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]",
      topHighlight: "from-purple-500/30",
    },
  }[colorScheme];

  return (
    <div
      className={`rounded-2xl border ${colors.border} bg-[#090d1a]/85 p-5 backdrop-blur-md transition-all duration-300 ${colors.glow} flex flex-col justify-between text-left relative overflow-hidden`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r ${colors.topHighlight} via-transparent to-transparent`} />

      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono tracking-wider uppercase text-slate-400 select-none">
          {label}
        </span>
        {Icon && (
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center border ${colors.iconBg}`}
          >
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className={`text-2xl sm:text-3xl font-display font-black tracking-tight ${colors.text}`}>
          {value}
        </p>
        <div className="flex items-center justify-between pt-1 text-xs">
          {detail && <span className="text-slate-400 font-mono text-[11px]">{detail}</span>}
          {trend && (
            <span
              className={`font-mono font-bold inline-flex items-center gap-1 ${
                trendPositive === true
                  ? "text-emerald-400"
                  : trendPositive === false
                  ? "text-rose-400"
                  : "text-slate-400"
              }`}
            >
              {trendPositive === true && <TrendingUp className="w-3 h-3" />}
              {trendPositive === false && <TrendingDown className="w-3 h-3" />}
              <span>{trend}</span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ── MAIN BOL CALCULATOR APPLICATION ──

export default function BOLCalculator() {
  const [data, setData] = useState<EventData>(initialData);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Load from localStorage or clean initialize
  useEffect(() => {
    try {
      const savedV2 = localStorage.getItem("udc-bol-calculator-v2");
      if (savedV2) {
        setData({ ...initialData, ...JSON.parse(savedV2) });
      } else {
        const savedV1 = localStorage.getItem("udc-bol-calculator-v1");
        if (savedV1) {
          const parsed = JSON.parse(savedV1);
          if (parsed.capacity === 150 && parsed.expectedAttendance === 120) {
            setData(initialData);
            localStorage.setItem("udc-bol-calculator-v2", JSON.stringify(initialData));
          } else {
            setData({ ...initialData, ...parsed });
          }
        }
      }
    } catch {
      console.warn("Could not load saved calculator data, initializing clean 0 state.");
    }
    setLoaded(true);
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("udc-bol-calculator-v2", JSON.stringify(data));
    }
  }, [data, loaded]);

  const update = (patch: Partial<EventData>) =>
    setData((current) => ({ ...current, ...patch }));

  // ── CORE FINANCIAL ENGINE CALCULATIONS ──

  const ticketRevenue = data.tickets.reduce(
    (sum, ticket) => sum + number(ticket.price) * number(ticket.quantity),
    0
  );

  const paidTickets = data.tickets.reduce(
    (sum, ticket) => sum + number(ticket.quantity),
    0
  );

  const totalAttendance = Math.max(
    number(data.expectedAttendance),
    paidTickets + number(data.complimentary)
  );

  // Stall booking fees: If itemized stalls exist, sum their individual fees.
  // Otherwise, use (stallCapacity * stallDefaultPrice) for quick baseline modeling.
  const itemizedVendorFees = data.vendors.reduce(
    (sum, vendor) => sum + number(vendor.fee),
    0
  );

  const vendorFees =
    data.vendors.length > 0
      ? itemizedVendorFees
      : number(data.stallCapacity) * number(data.stallDefaultPrice);

  const vendorCommission = data.vendors.reduce(
    (sum, vendor) =>
      sum + (number(vendor.expectedSales) * number(vendor.commission)) / 100,
    0
  );

  const totalVendorRevenue = vendorFees + vendorCommission;

  const sponsorCash = data.sponsors.reduce(
    (sum, sponsor) => sum + number(sponsor.cash),
    0
  );

  const sponsorInKind = data.sponsors.reduce(
    (sum, sponsor) => sum + number(sponsor.inKind),
    0
  );

  const baseExpenses = data.expenses.reduce(
    (sum, item) => sum + number(item.amount),
    0
  );

  const foodPerPerson =
    data.foodMode === "stalls" ? 0 : number(data.foodCost);

  const cateringCost =
    foodPerPerson * totalAttendance + number(data.foodFixedCost);

  // Cashfree Processing Fee: only deducted from event budget if fee is given to Cashfree by organizer
  const ticketProcessing = data.cashfreeFeeBorneByOrganizer
    ? (ticketRevenue * number(data.processingRate)) / 100
    : 0;

  const subtotalExpenses = baseExpenses + cateringCost + ticketProcessing;

  const contingency = (subtotalExpenses * number(data.contingencyRate)) / 100;

  const totalExpenses = subtotalExpenses + contingency;

  const totalRevenue = ticketRevenue + totalVendorRevenue + sponsorCash;

  const netProfit = totalRevenue - totalExpenses;
  const margin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const averageTicketPrice =
    paidTickets > 0 ? ticketRevenue / paidTickets : 0;

  const costPerAttendee =
    totalAttendance > 0 ? totalExpenses / totalAttendance : 0;

  const revenuePerAttendee =
    totalAttendance > 0 ? totalRevenue / totalAttendance : 0;

  const effectiveProcessingRate = data.cashfreeFeeBorneByOrganizer
    ? number(data.processingRate)
    : 0;

  const contributionPerTicket =
    averageTicketPrice * (1 - effectiveProcessingRate / 100) - foodPerPerson;

  const fixedCosts = baseExpenses + number(data.foodFixedCost) + contingency;

  const breakEvenTickets =
    contributionPerTicket > 0
      ? Math.max(
          0,
          Math.ceil(
            (fixedCosts - vendorFees - vendorCommission - sponsorCash) /
              contributionPerTicket
          )
        )
      : null;

  const scenarios = useMemo(() => {
    const modes: { id: FoodMode; name: string; desc: string }[] = [
      {
        id: "buffet",
        name: "Central Buffet Model",
        desc: "All attendees receive central lunch, high-tea & refreshments.",
      },
      {
        id: "hybrid",
        name: "Hybrid Catering Model",
        desc: "Fixed core lunch subsidized centrally + independent artisanal stalls.",
      },
      {
        id: "stalls",
        name: "Stall-Only Model",
        desc: "Zero organizer catering expense; attendees purchase directly from vendors.",
      },
    ];

    return modes.map((mode) => {
      const food =
        mode.id === "stalls"
          ? 0
          : totalAttendance * number(data.foodCost) + number(data.foodFixedCost);

      const costsBeforeContingency = baseExpenses + food + ticketProcessing;

      const total =
        costsBeforeContingency * (1 + number(data.contingencyRate) / 100);

      const profit = totalRevenue - total;
      const scenMargin = totalRevenue > 0 ? (profit / totalRevenue) * 100 : 0;

      return {
        ...mode,
        food,
        total,
        profit,
        margin: scenMargin,
      };
    });
  }, [
    totalAttendance,
    data.foodCost,
    data.foodFixedCost,
    data.contingencyRate,
    baseExpenses,
    ticketProcessing,
    totalRevenue,
  ]);

  // Determine most profitable scenario
  const bestScenario = useMemo(() => {
    if (scenarios.length === 0) return null;
    return [...scenarios].sort((a, b) => b.profit - a.profit)[0];
  }, [scenarios]);

  // ── SUB-ITEM UPDATE HANDLERS ──

  const updateTicket = (id: string, patch: Partial<TicketTier>) => {
    update({
      tickets: data.tickets.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const updateExpense = (id: string, patch: Partial<LineItem>) => {
    update({
      expenses: data.expenses.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const updateVendor = (id: string, patch: Partial<Vendor>) => {
    update({
      vendors: data.vendors.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  const updateSponsor = (id: string, patch: Partial<Sponsor>) => {
    update({
      sponsors: data.sponsors.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    });
  };

  // ── QUICK STALL BATCH OPERATIONS ──

  const applySetPriceToAllStalls = () => {
    if (data.vendors.length === 0) return;
    update({
      vendors: data.vendors.map((v) => ({ ...v, fee: data.stallDefaultPrice })),
    });
  };

  const generateStallsFromSetPrice = () => {
    const count = Math.max(1, number(data.stallCapacity));
    const newStalls: Vendor[] = Array.from({ length: count }, (_, i) => ({
      id: uid(),
      name: `Stall #${i + 1}`,
      fee: number(data.stallDefaultPrice),
      commission: 0,
      expectedSales: 0,
    }));
    update({ vendors: newStalls });
  };

  // ── EXPORT & RESET HANDLERS ──

  const exportCSV = () => {
    const rows = [
      ["BOL! 2026 EVENT FINANCIAL & OPERATING REPORT", ""],
      ["Generated", new Date().toLocaleString()],
      ["Event Name", data.eventName || "BOL! Event"],
      ["Event Date", data.eventDate || "TBD"],
      ["Operating Capacity", data.capacity],
      ["Expected Attendance", totalAttendance],
      ["Set Price Per Stall", data.stallDefaultPrice],
      ["Planned Stall Inventory", data.stallCapacity],
      ["", ""],
      ["REVENUE STREAM", "AMOUNT (INR)"],
      ["Ticket Sales Revenue", ticketRevenue],
      ["Stall Booking Fees", vendorFees],
      ["Stall Sales Commissions", vendorCommission],
      ["Cash Sponsorships", sponsorCash],
      ["TOTAL PROJECTED REVENUE", totalRevenue],
      ["", ""],
      ["EXPENDITURE BREAKDOWN", "AMOUNT (INR)"],
      ...data.expenses.map((item) => [item.name, item.amount]),
      ["Catering & Food", cateringCost],
      ["Payment Gateway Processing", ticketProcessing],
      ["Cashfree Fee Borne by Organizer", data.cashfreeFeeBorneByOrganizer ? "YES (Deducted)" : "NO (Free / By Customer)"],
      ["Contingency Reserve", contingency],
      ["TOTAL PROJECTED EXPENDITURE", totalExpenses],
      ["", ""],
      ["FINANCIAL HEALTH & MARGINS", ""],
      ["Net Projected Balance", netProfit],
      ["Profit Margin (%)", `${margin.toFixed(2)}%`],
      ["Break-Even Registrations", breakEvenTickets ?? "N/A"],
      ["Average Ticket Price", averageTicketPrice.toFixed(2)],
      ["Cost Per Attendee", costPerAttendee.toFixed(2)],
      ["In-Kind Sponsorship (Non-Cash)", sponsorInKind],
    ];

    const csv = rows
      .map((row) =>
        row
          .map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `BOL-Financial-Report-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copySummaryText = () => {
    const text =
      `📊 BOL! 2026 FINANCIAL SUMMARY\n` +
      `Event: ${data.eventName || "BOL! Event"}\n` +
      `Date: ${data.eventDate || "TBD"}\n` +
      `Planned Attendance: ${totalAttendance}\n` +
      `Set Stall Price: ${money(data.stallDefaultPrice)} (${data.stallCapacity} stalls)\n` +
      `Cashfree PG Fee: ${data.cashfreeFeeBorneByOrganizer ? `${data.processingRate}% (${money(ticketProcessing)})` : "Not given to Cashfree (Zero deduction)"}\n` +
      `---------------------------\n` +
      `Total Revenue: ${money(totalRevenue)}\n` +
      `Total Expenses: ${money(totalExpenses)}\n` +
      `Net Balance: ${money(netProfit)} (${margin.toFixed(1)}% margin)\n` +
      `Break-even Tickets: ${breakEvenTickets ?? "N/A"}\n` +
      `Powered by ZENVITRA & UDC`;
    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2000);
  };

  const handleResetToZero = () => {
    setData(initialData);
    localStorage.removeItem("udc-bol-calculator-v1");
    localStorage.setItem("udc-bol-calculator-v2", JSON.stringify(initialData));
    setResetConfirmOpen(false);
  };

  const tabs = [
    { id: "overview", label: "Executive Overview", icon: BarChart3, count: null },
    { id: "tickets", label: "Ticketing & Tiers", icon: Ticket, count: data.tickets.length },
    { id: "food", label: "Food & Catering", icon: Utensils, count: null },
    {
      id: "vendors",
      label: "Stalls & Vendors",
      icon: Store,
      count: data.vendors.length > 0 ? data.vendors.length : data.stallCapacity > 0 ? data.stallCapacity : null,
    },
    { id: "expenses", label: "Expenditures", icon: Receipt, count: data.expenses.length },
    { id: "sponsors", label: "Sponsorships", icon: Handshake, count: data.sponsors.length },
    { id: "scenarios", label: "Scenario Modeler", icon: Sliders, count: scenarios.length },
  ];

  if (!loaded) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white font-mono text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <span>INITIALIZING BOL! FINANCIAL ENGINE...</span>
        </div>
      </div>
    );
  }

  // Calculate visual revenue vs expense percentages for comparison bar
  const maxBarValue = Math.max(totalRevenue, totalExpenses, 1);
  const revPercent = Math.min(100, Math.round((totalRevenue / maxBarValue) * 100));
  const expPercent = Math.min(100, Math.round((totalExpenses / maxBarValue) * 100));

  // Zero-State flag: all numbers are zero
  const isZeroState = totalRevenue === 0 && totalExpenses === 0;

  return (
    <div className="min-h-screen bg-[#030712] text-white flex flex-col justify-between font-sans selection:bg-cyan-500/20">
      <Navbar />

      {/* Ambient Radial Mesh Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[450px] bg-gradient-to-b from-cyan-600/10 via-blue-600/5 to-transparent blur-[160px] pointer-events-none z-0" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[180px] pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 flex-1">
        
        {/* ── BREADCRUMB & HEADER ── */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10">
          <div className="space-y-3">
            <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs text-slate-400">
              <Link href="/" className="hover:text-white transition">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href="/events" className="hover:text-white transition">Events</Link>
              <span aria-hidden="true">/</span>
              <span className="text-cyan-400 font-semibold">BOL! Financial OS</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-[10px] font-mono font-bold uppercase tracking-widest text-cyan-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>UDAIPUR DEBATING CLUB • BOL! 2026 FINANCIAL ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase">
              BOL! <span className="text-gradient-cyan">Event Financial OS</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-light max-w-2xl leading-relaxed">
              Universal financial, catering, and operational planning system. Zero-seeded clean architecture designed for real-world budgeting, break-even simulation, and ticket margin optimization.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-[1.02] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              title="Download Full Event Financial Ledger CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>

            <button
              type="button"
              onClick={copySummaryText}
              className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-slate-200 font-mono text-xs transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              title="Copy Summary to Clipboard"
            >
              {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSummary ? "Copied!" : "Copy Summary"}</span>
            </button>

            <button
              type="button"
              onClick={() => setResetConfirmOpen(true)}
              className="px-4 py-2.5 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-mono text-xs transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
              title="Reset all values to 0 clean state"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to 0</span>
            </button>
          </div>
        </header>

        {/* ── RESET CONFIRMATION MODAL ── */}
        {resetConfirmOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="reset-modal-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
          >
            <div className="max-w-md w-full rounded-2xl border border-rose-500/30 bg-[#0c101c] p-6 space-y-4 shadow-2xl">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <h3 id="reset-modal-title" className="text-lg font-bold text-white font-display">
                  Reset All Data to 0?
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  This will reset every ticket price, quantity, stall price, expense, vendor, and parameter to completely clean 0s. All local browser storage will be reset to an authentic baseline.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(false)}
                  className="w-1/2 py-2.5 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs transition cursor-pointer focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetToZero}
                  className="w-1/2 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold transition cursor-pointer shadow-lg shadow-rose-600/30 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                >
                  Confirm Reset
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── 4 PRIMARY SOVEREIGN KPI CARDS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Projected Revenue"
            value={money(totalRevenue)}
            detail={`Tickets: ${money(ticketRevenue)} • Stalls: ${money(totalVendorRevenue)}`}
            icon={TrendingUp}
            colorScheme="cyan"
          />

          <MetricCard
            label="Total Projected Expenditure"
            value={money(totalExpenses)}
            detail={`Base: ${money(baseExpenses)} • Food: ${money(cateringCost)}`}
            icon={Receipt}
            colorScheme="rose"
          />

          <MetricCard
            label="Projected Net Balance"
            value={money(netProfit)}
            detail={totalRevenue > 0 ? `${margin.toFixed(1)}% operating margin` : "Awaiting revenue inputs"}
            trend={netProfit > 0 ? "Surplus Plan" : netProfit < 0 ? "Deficit Plan" : "Balanced / Zero"}
            trendPositive={netProfit > 0 ? true : netProfit < 0 ? false : undefined}
            icon={Scale}
            colorScheme={netProfit >= 0 ? "emerald" : "rose"}
          />

          <MetricCard
            label="Break-Even Registrations"
            value={breakEvenTickets === null ? "—" : `${breakEvenTickets} Tickets`}
            detail={
              paidTickets >= (breakEvenTickets ?? 0) && (breakEvenTickets ?? 0) > 0
                ? "✓ Break-even target achieved"
                : paidTickets > 0
                ? `${Math.max(0, (breakEvenTickets ?? 0) - paidTickets)} more tickets needed`
                : "At 0 tickets recorded"
            }
            icon={CheckCircle2}
            colorScheme={paidTickets >= (breakEvenTickets ?? 0) && (breakEvenTickets ?? 0) > 0 ? "emerald" : "amber"}
          />
        </div>

        {/* ── PRO ZERO-STATE QUICK-START COCKPIT BANNER ── */}
        {isZeroState && (
          <div className="rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/30 via-[#0a1124] to-blue-950/20 p-5 sm:p-6 backdrop-blur-md relative overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-400">
                    Clean Zero State Initialized
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white font-display">
                  Ready to Model BOL! 2026 Event Finances?
                </h3>
                <p className="text-xs text-slate-300 max-w-2xl font-sans leading-relaxed">
                  Start by entering pass pricing in <strong className="text-white">Ticketing</strong>, stall rates in <strong className="text-white">Stalls & Vendors</strong>, or your expected venue overhead in <strong className="text-white">Expenditures</strong>. The break-even solver will dynamically calculate the exact registrations required.
                </p>
              </div>

              {/* Quick Jump Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveTab("tickets")}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                >
                  <Ticket className="w-3.5 h-3.5" />
                  <span>Configure Tickets</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vendors")}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>Set Stall Price</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("expenses")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                >
                  <Receipt className="w-3.5 h-3.5" />
                  <span>Add Expenses</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("food")}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Catering Plan</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── COMPARATIVE VISUAL FINANCIAL BAR ── */}
        <div className="rounded-2xl border border-white/10 bg-[#090d1a]/85 p-4 sm:p-5 backdrop-blur-md space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
            <div className="flex flex-wrap items-center gap-4">
              <span className="text-slate-400 select-none">FINANCIAL PROPORTIONS:</span>
              <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                Revenue {money(totalRevenue)}
              </span>
              <span className="flex items-center gap-1.5 text-rose-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-rose-400" />
                Expenditure {money(totalExpenses)}
              </span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>Avg Ticket: <strong className="text-white">{money(averageTicketPrice)}</strong></span>
              <span aria-hidden="true">•</span>
              <span>Cost / Person: <strong className="text-white">{money(costPerAttendee)}</strong></span>
            </div>
          </div>

          {/* Dual Segment Progress Gauge */}
          <div className="w-full h-3 rounded-full bg-white/5 border border-white/10 overflow-hidden flex" role="progressbar" aria-label="Revenue vs Expenses Comparison">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
              style={{ width: `${totalRevenue === 0 && totalExpenses === 0 ? 0 : revPercent}%` }}
              title={`Revenue: ${money(totalRevenue)}`}
            />
            <div
              className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-500"
              style={{ width: `${totalRevenue === 0 && totalExpenses === 0 ? 0 : expPercent}%` }}
              title={`Expenses: ${money(totalExpenses)}`}
            />
          </div>
        </div>

        {/* ── EVENT OPERATING ASSUMPTIONS CARD ── */}
        <SectionCard
          title="Event Operating Profile & Parameters"
          subtitle="Configure venue capacity, expected turnout, payment processing rates, and contingency allowances."
          icon={Calendar}
          badge="PARAMETERS"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <InputField
              label="Event Name"
              type="text"
              value={data.eventName}
              placeholder="e.g. BOL! 2026 Debating Fest"
              onChange={(v) => update({ eventName: v })}
            />

            <InputField
              label="Event Date"
              type="date"
              value={data.eventDate}
              onChange={(v) => update({ eventDate: v })}
            />

            <InputField
              label="Venue Maximum Capacity"
              value={data.capacity}
              placeholder="0"
              helper="Max hall capacity"
              quickIncrements={[100, 250, 500]}
              onChange={(v) => update({ capacity: number(v) })}
            />

            <InputField
              label="Expected Total Attendance"
              value={data.expectedAttendance}
              placeholder="0"
              helper="Includes free passes"
              quickIncrements={[50, 100, 200]}
              onChange={(v) => update({ expectedAttendance: number(v) })}
            />

            <InputField
              label="Complimentary / VIP Passes"
              value={data.complimentary}
              placeholder="0"
              helper="Non-revenue attendees"
              quickIncrements={[10, 25, 50]}
              onChange={(v) => update({ complimentary: number(v) })}
            />

            <InputField
              label="Anticipated Refund Passes"
              value={data.refunds}
              placeholder="0"
              helper="Estimated cancellations"
              quickIncrements={[5, 10]}
              onChange={(v) => update({ refunds: number(v) })}
            />

            <div className="space-y-2">
              <InputField
                label="Payment Processing Fee (%)"
                value={data.processingRate}
                suffix="%"
                placeholder="0"
                step="0.1"
                helper="Cashfree/PG fee"
                quickIncrements={[1.75, 2.0]}
                onChange={(v) => update({ processingRate: number(v) })}
              />

              {/* Button: Fee given to Cashfree or not */}
              <button
                type="button"
                onClick={() =>
                  update({
                    cashfreeFeeBorneByOrganizer: !data.cashfreeFeeBorneByOrganizer,
                  })
                }
                className={`w-full py-2 px-3 rounded-xl font-mono text-[11px] font-bold transition-all duration-200 flex items-center justify-between cursor-pointer border focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  data.cashfreeFeeBorneByOrganizer
                    ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "bg-white/[0.03] border-white/10 text-slate-400 hover:bg-white/[0.08] hover:text-white"
                }`}
                title="Toggle whether Cashfree fee is given to Cashfree (deducted from budget) or not"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      data.cashfreeFeeBorneByOrganizer
                        ? "bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                        : "bg-slate-600"
                    }`}
                  />
                  <span className="text-left leading-tight">
                    Fee Given to Cashfree:
                  </span>
                </div>

                <span
                  className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-black uppercase tracking-wider ${
                    data.cashfreeFeeBorneByOrganizer
                      ? "bg-cyan-400/20 text-cyan-200 border border-cyan-400/40"
                      : "bg-white/10 text-slate-300 border border-white/10"
                  }`}
                >
                  {data.cashfreeFeeBorneByOrganizer
                    ? "YES (Deducted)"
                    : "NO (Free / By Customer)"}
                </span>
              </button>

              <p className="text-[10px] font-mono text-slate-500 px-0.5">
                {data.cashfreeFeeBorneByOrganizer
                  ? `• ${data.processingRate}% fee deducted from gross revenue (${money(ticketProcessing)})`
                  : "• Fee NOT given to Cashfree (Zero deduction from budget)"}
              </p>
            </div>

            <InputField
              label="Contingency Reserve (%)"
              value={data.contingencyRate}
              suffix="%"
              placeholder="0"
              step="1"
              helper="Safety cushion"
              onChange={(v) => update({ contingencyRate: number(v) })}
            />
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-slate-400">
            <div className="flex flex-wrap items-center gap-3">
              <span>Paid Registrations: <strong className="text-white">{paidTickets}</strong></span>
              <span aria-hidden="true">•</span>
              <span>Total Planned Attendance: <strong className="text-cyan-400">{totalAttendance}</strong></span>
              <span aria-hidden="true">•</span>
              <span>
                Remaining Capacity:{" "}
                <strong className={data.capacity > 0 && totalAttendance > data.capacity ? "text-rose-400" : "text-emerald-400"}>
                  {data.capacity > 0 ? Math.max(0, data.capacity - totalAttendance) : "—"}
                </strong>
              </span>
            </div>

            {data.capacity > 0 && totalAttendance > data.capacity && (
              <span className="text-rose-400 font-bold inline-flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded-md border border-rose-500/20">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Planned attendance exceeds maximum venue capacity</span>
              </span>
            )}
          </div>
        </SectionCard>

        {/* ── INTERACTIVE NAVIGATION TABS ── */}
        <nav
          aria-label="Calculator Sections"
          className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 no-scrollbar"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                  isActive
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                    : "border border-white/10 bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.07]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-black" : "text-cyan-400"}`} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? "bg-black/20 text-black" : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* ── TAB 1: EXECUTIVE OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Revenue Breakdown */}
            <SectionCard
              title="Revenue Stream Analysis"
              subtitle="Consolidated earnings from ticket categories, stalls, and corporate sponsorships."
              icon={TrendingUp}
              badge="INFLOW"
              badgeColor="text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
            >
              <div className="space-y-3.5">
                {[
                  { label: "Ticket Sales Revenue", amount: ticketRevenue, note: `${paidTickets} paid tickets` },
                  {
                    label: "Stall Booking Fees (Fixed)",
                    amount: vendorFees,
                    note:
                      data.vendors.length > 0
                        ? `${data.vendors.length} itemized stalls`
                        : data.stallCapacity > 0
                        ? `${data.stallCapacity} stalls @ ${money(data.stallDefaultPrice)} set price`
                        : "No stalls configured",
                  },
                  { label: "Stall Sales Commission", amount: vendorCommission, note: "Based on projected sales" },
                  { label: "Corporate Cash Sponsorships", amount: sponsorCash, note: `${data.sponsors.length} sponsors` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm">
                    <div className="space-y-0.5">
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-[11px] font-mono text-slate-400">{item.note}</p>
                    </div>
                    <span className="font-mono font-bold text-white text-base">
                      {money(item.amount)}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-sm">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">Total Projected Revenue</span>
                  <span className="text-xl font-bold text-emerald-400 font-display">
                    {money(totalRevenue)}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Expenditure Breakdown */}
            <SectionCard
              title="Expenditure & Cost Allocation"
              subtitle="All operating overheads including venue, catering, gateway processing and reserves."
              icon={Receipt}
              badge="OUTFLOW"
              badgeColor="text-rose-400 border-rose-500/30 bg-rose-500/10"
            >
              <div className="space-y-3.5">
                {[
                  { label: "Base Operational Expenses", amount: baseExpenses, note: `${data.expenses.length} line items` },
                  { label: "Catering & Refreshments", amount: cateringCost, note: `Model: ${data.foodMode}` },
                  {
                    label: "Payment Gateway Processing",
                    amount: ticketProcessing,
                    note: data.cashfreeFeeBorneByOrganizer
                      ? `${data.processingRate}% fee given to Cashfree (${money(ticketProcessing)})`
                      : "Fee not given to Cashfree (Paid by customer / Waived)",
                  },
                  { label: "Contingency Safety Reserve", amount: contingency, note: `${data.contingencyRate}% buffer applied` },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/5 text-sm">
                    <div className="space-y-0.5">
                      <p className="font-medium text-white">{item.label}</p>
                      <p className="text-[11px] font-mono text-slate-400">{item.note}</p>
                    </div>
                    <span className="font-mono font-bold text-white text-base">
                      {money(item.amount)}
                    </span>
                  </div>
                ))}

                <div className="pt-3 border-t border-white/10 flex items-center justify-between font-mono text-sm">
                  <span className="font-bold text-slate-300 uppercase tracking-wider">Total Projected Expenditure</span>
                  <span className="text-xl font-bold text-rose-400 font-display">
                    {money(totalExpenses)}
                  </span>
                </div>
              </div>
            </SectionCard>

            {/* Operational Metrics Snapshot */}
            <SectionCard
              title="Delegate Economics & Unit Ratios"
              subtitle="Key operational benchmarks per attendee and sponsorship valuations."
              icon={PieChart}
              badge="RATIOS"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase select-none">Paid Delegate Tickets</span>
                  <p className="text-2xl font-bold text-white font-mono">{paidTickets}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase select-none">Avg Realized Price</span>
                  <p className="text-2xl font-bold text-cyan-400 font-mono">{money(averageTicketPrice)}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase select-none">Revenue / Attendee</span>
                  <p className="text-2xl font-bold text-emerald-400 font-mono">{money(revenuePerAttendee)}</p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                  <span className="text-[11px] font-mono text-slate-400 uppercase select-none">Cost / Attendee</span>
                  <p className="text-2xl font-bold text-rose-400 font-mono">{money(costPerAttendee)}</p>
                </div>
              </div>

              {sponsorInKind > 0 && (
                <div className="mt-4 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-between text-xs font-mono">
                  <span className="text-purple-300">Non-Cash In-Kind Sponsorships Recognized:</span>
                  <strong className="text-white">{money(sponsorInKind)}</strong>
                </div>
              )}
            </SectionCard>

            {/* Financial Health & Verdict */}
            <SectionCard
              title="Financial Feasibility Verdict"
              subtitle="Real-time projection assessing solvency, surplus margins, and breakeven risk."
              icon={Scale}
              badge={netProfit >= 0 ? "SOLVENT" : "DEFICIT"}
              badgeColor={netProfit >= 0 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : "text-rose-400 border-rose-500/30 bg-rose-500/10"}
            >
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#060913] border border-white/10 space-y-2 text-center">
                  <span className="text-xs font-mono text-slate-400 uppercase tracking-widest select-none">
                    Projected Net Outcome
                  </span>
                  <p
                    className={`text-3xl sm:text-4xl font-display font-black tracking-tight ${
                      netProfit >= 0 ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    {money(netProfit)}
                  </p>
                  <p className="text-xs font-mono text-slate-400">
                    {totalRevenue > 0
                      ? `${margin.toFixed(2)}% net margin on total revenue`
                      : "Clean state: enter tickets & expenses to simulate live net margin"}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2 text-xs text-slate-300 leading-relaxed font-sans">
                  {totalRevenue === 0 && totalExpenses === 0 ? (
                    <p className="text-slate-400 font-mono text-center py-2">
                      ⚡ Clean Zero State: Add your ticket pricing, stall rates, and estimated operational overheads in the tabs above to calculate your break-even requirements.
                    </p>
                  ) : netProfit >= 0 ? (
                    <div className="space-y-1">
                      <p className="font-semibold text-emerald-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>Positive Operating Surplus Projected</span>
                      </p>
                      <p className="text-slate-400">
                        The event budget is healthy. Your revenue comfortably clears fixed and variable overheads with an operating buffer of {money(netProfit)}.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <p className="font-semibold text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>Projected Operating Deficit</span>
                      </p>
                      <p className="text-slate-400">
                        Current assumptions show an operational deficit of {money(Math.abs(netProfit))}. Consider increasing ticket volume, setting a higher stall booking price, seeking additional sponsorships, or switching to the stall-only catering model.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </SectionCard>

          </div>
        )}

        {/* ── TAB 2: TICKETING & TIERS ── */}
        {activeTab === "tickets" && (
          <SectionCard
            title="Ticketing & Pass Tier Architecture"
            subtitle="Configure ticket categories, prices, and expected registration volumes."
            icon={Ticket}
            badge={`${data.tickets.length} TIERS`}
            action={
              <button
                type="button"
                onClick={() =>
                  update({
                    tickets: [
                      ...data.tickets,
                      { id: uid(), name: `Category ${data.tickets.length + 1}`, price: 0, quantity: 0 },
                    ],
                  })
                }
                className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Ticket Tier</span>
              </button>
            }
          >
            <div className="space-y-3.5">
              {data.tickets.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-slate-500 text-xs font-mono">
                  No ticket tiers added yet. Click &quot;Add Ticket Tier&quot; to configure pricing.
                </div>
              ) : (
                data.tickets.map((tier, idx) => {
                  const tierRev = number(tier.price) * number(tier.quantity);
                  return (
                    <div
                      key={tier.id}
                      className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end"
                    >
                      <div className="sm:col-span-4">
                        <InputField
                          label={`Tier #${idx + 1} Name`}
                          type="text"
                          value={tier.name}
                          placeholder="e.g. Early Bird Pass"
                          onChange={(v) => updateTicket(tier.id, { name: v })}
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <InputField
                          label="Price per Pass"
                          prefix="₹"
                          value={tier.price}
                          placeholder="0"
                          quickIncrements={[299, 499, 999]}
                          onChange={(v) => updateTicket(tier.id, { price: number(v) })}
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <InputField
                          label="Quantity"
                          value={tier.quantity}
                          placeholder="0"
                          quickIncrements={[25, 50, 100]}
                          onChange={(v) => updateTicket(tier.id, { quantity: number(v) })}
                        />
                      </div>

                      <div className="sm:col-span-2 text-right sm:text-left py-1">
                        <span className="text-[10px] font-mono text-slate-400 block uppercase select-none">Projected Yield</span>
                        <span className="font-mono font-bold text-cyan-300 text-sm">
                          {money(tierRev)}
                        </span>
                      </div>

                      <div className="sm:col-span-1 flex justify-end pb-1">
                        <button
                          type="button"
                          onClick={() =>
                            update({ tickets: data.tickets.filter((x) => x.id !== tier.id) })
                          }
                          className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                          title="Remove this tier"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Ticketing Summary Banner */}
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-cyan-500/20 grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block select-none">Total Paid Registrations</span>
                  <p className="text-2xl font-bold text-white font-display mt-0.5">{paidTickets}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block select-none">Average Pass Price</span>
                  <p className="text-2xl font-bold text-cyan-300 font-display mt-0.5">{money(averageTicketPrice)}</p>
                </div>
                <div>
                  <span className="text-slate-400 uppercase text-[10px] block select-none">Total Gross Ticket Sales</span>
                  <p className="text-2xl font-bold text-emerald-400 font-display mt-0.5">{money(ticketRevenue)}</p>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── TAB 3: FOOD & CATERING ── */}
        {activeTab === "food" && (
          <SectionCard
            title="Catering & Food Hospitality Architecture"
            subtitle="Compare centralized buffet hosting against hybrid meal vouchers and zero-cost stall concessions."
            icon={Utensils}
            badge={`MODE: ${data.foodMode.toUpperCase()}`}
          >
            <div className="space-y-6">
              {/* Food Mode Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                {[
                  {
                    id: "buffet" as const,
                    title: "Central Buffet Model",
                    badge: "FULL HOSPITALITY",
                    desc: "Organizer provides full lunch buffet, high-tea, and water stations centrally.",
                  },
                  {
                    id: "hybrid" as const,
                    title: "Hybrid Subsidized Model",
                    badge: "SHARED RISK",
                    desc: "Organizer subsidizes base lunch box; delegates purchase specialized food from stalls.",
                  },
                  {
                    id: "stalls" as const,
                    title: "Stall-Only Food Model",
                    badge: "ZERO COST",
                    desc: "Zero catering expenditure for organizer; independent vendors sell food directly to attendees.",
                  },
                ].map((item) => {
                  const isSelected = data.foodMode === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => update({ foodMode: item.id })}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.15)]"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.05]"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <strong className="text-sm font-bold text-white font-display">
                          {item.title}
                        </strong>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded-full border ${
                            isSelected
                              ? "border-cyan-400/40 text-cyan-300 bg-cyan-400/20"
                              : "border-white/10 text-slate-400"
                          }`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-sans leading-relaxed">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Inputs Based on Mode */}
              {data.foodMode !== "stalls" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 rounded-2xl bg-white/[0.02] border border-white/10">
                  <InputField
                    label="Catering Cost per Attendee"
                    prefix="₹"
                    value={data.foodCost}
                    placeholder="0"
                    helper="Buffet/plate cost"
                    quickIncrements={[150, 250, 400]}
                    onChange={(v) => update({ foodCost: number(v) })}
                  />

                  <InputField
                    label="Fixed Catering Setup / Delivery Cost"
                    prefix="₹"
                    value={data.foodFixedCost}
                    placeholder="0"
                    helper="Kitchen/service charge"
                    quickIncrements={[5000, 10000]}
                    onChange={(v) => update({ foodFixedCost: number(v) })}
                  />
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-300">
                  ✓ Stall-Only Mode Active: Catering cost per attendee is set to ₹0. Organizers only generate revenue via stall booking fees and commissions.
                </div>
              )}

              {/* Live Catering Summary Card */}
              <div className="p-5 rounded-2xl bg-[#070b18] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs">
                <div className="space-y-1">
                  <span className="text-slate-400 uppercase text-[10px] block select-none">Projected Catering Overhead</span>
                  <p className="text-3xl font-bold text-rose-400 font-display">{money(cateringCost)}</p>
                  <span className="text-slate-500 text-[11px] block">
                    Calculated for {totalAttendance} planned attendees (paid + complimentary)
                  </span>
                </div>

                <div className="text-right space-y-1 text-slate-400">
                  <p>Per-head cost: <strong className="text-white">{money(foodPerPerson)}</strong></p>
                  <p>Fixed overhead: <strong className="text-white">{money(data.foodFixedCost)}</strong></p>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── TAB 4: STALLS & VENDORS ── */}
        {activeTab === "vendors" && (
          <SectionCard
            title="Commercial Stalls & Vendor Concessions"
            subtitle="Configure your standardized price per stall, total stall inventory, and itemized vendor contracts."
            icon={Store}
            badge={
              data.vendors.length > 0
                ? `${data.vendors.length} ITEMIZED STALLS`
                : data.stallCapacity > 0
                ? `${data.stallCapacity} STALL INVENTORY`
                : "STALLS"
            }
            action={
              <button
                type="button"
                onClick={() =>
                  update({
                    vendors: [
                      ...data.vendors,
                      {
                        id: uid(),
                        name: `Vendor Stall #${data.vendors.length + 1}`,
                        fee: number(data.stallDefaultPrice),
                        commission: 0,
                        expectedSales: 0,
                      },
                    ],
                  })
                }
                className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Vendor Stall</span>
              </button>
            }
          >
            <div className="space-y-6">

              {/* ── SET PRICE PER STALL & INVENTORY CONTROL COCKPIT ── */}
              <div className="p-5 sm:p-6 rounded-2xl border border-cyan-500/25 bg-gradient-to-r from-cyan-950/20 via-[#0a1122] to-blue-950/20 backdrop-blur-md space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-sm font-bold font-mono uppercase text-white tracking-wider">
                      Standard Stall Rate & Inventory Controls
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Set a universal baseline price per stall or manage individual stalls below
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <InputField
                    label="Set Price per Stall"
                    prefix="₹"
                    value={data.stallDefaultPrice}
                    placeholder="0"
                    helper="Standard fixed rental fee"
                    quickIncrements={[2500, 5000, 10000]}
                    onChange={(v) => update({ stallDefaultPrice: number(v) })}
                  />

                  <InputField
                    label="Total Stall Inventory / Capacity"
                    value={data.stallCapacity}
                    placeholder="0"
                    helper="Total available stall plots"
                    quickIncrements={[5, 10, 20]}
                    onChange={(v) => update({ stallCapacity: number(v) })}
                  />

                  {/* Summary / Total Capacity Yield */}
                  <div className="space-y-1.5 text-left">
                    <span className="text-xs font-mono font-medium text-slate-300 tracking-wide select-none block">
                      Projected Baseline Stall Yield
                    </span>
                    <div className="rounded-xl border border-white/10 bg-[#060913] px-3.5 py-2.5 flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400">
                        {data.stallCapacity} stalls × {money(data.stallDefaultPrice)}:
                      </span>
                      <strong className="text-base font-mono font-bold text-emerald-400">
                        {money(number(data.stallCapacity) * number(data.stallDefaultPrice))}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Batch Action Buttons */}
                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={generateStallsFromSetPrice}
                    disabled={data.stallCapacity <= 0}
                    className="px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
                    title="Generate all stalls populated with this set price"
                  >
                    <Grid className="w-3.5 h-3.5" />
                    <span>Generate {data.stallCapacity || 0} Stalls at Set Price</span>
                  </button>

                  {data.vendors.length > 0 && (
                    <button
                      type="button"
                      onClick={applySetPriceToAllStalls}
                      className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:outline-none"
                      title="Update all existing stalls to the current set price per stall"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Apply {money(data.stallDefaultPrice)} to All {data.vendors.length} Stalls</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── ITEMIZED STALLS LIST ── */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-mono font-bold uppercase text-slate-300 tracking-wider">
                    Itemized Vendor Stalls ({data.vendors.length})
                  </h4>
                  {data.vendors.length === 0 && data.stallCapacity > 0 && (
                    <span className="text-[11px] font-mono text-cyan-400">
                      Currently using bulk estimate ({data.stallCapacity} stalls @ {money(data.stallDefaultPrice)})
                    </span>
                  )}
                </div>

                {data.vendors.length === 0 ? (
                  <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-slate-500 text-xs font-mono space-y-2">
                    <p>No individual vendor stalls itemized yet.</p>
                    <p className="text-slate-400">
                      You can either use the <strong className="text-cyan-400">Set Price per Stall</strong> and <strong className="text-cyan-400">Total Stall Inventory</strong> above for a rapid bulk forecast, or click <strong className="text-white">&quot;Add Vendor Stall&quot;</strong> to contract specific brands.
                    </p>
                  </div>
                ) : (
                  data.vendors.map((vendor, idx) => {
                    const commRev = (number(vendor.expectedSales) * number(vendor.commission)) / 100;
                    const stallTotal = number(vendor.fee) + commRev;
                    return (
                      <div
                        key={vendor.id}
                        className="p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all space-y-3"
                      >
                        <div className="flex items-center justify-between pb-2 border-b border-white/5">
                          <span className="font-mono text-xs font-bold text-slate-300 select-none">
                            STALL #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              update({ vendors: data.vendors.filter((x) => x.id !== vendor.id) })
                            }
                            className="text-xs text-rose-400 hover:text-rose-300 font-mono transition cursor-pointer flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                          <InputField
                            label="Vendor / Business Name"
                            type="text"
                            value={vendor.name}
                            placeholder="e.g. Café Concession"
                            onChange={(v) => updateVendor(vendor.id, { name: v })}
                          />

                          <InputField
                            label="Fixed Space Booking Fee"
                            prefix="₹"
                            value={vendor.fee}
                            placeholder="0"
                            quickIncrements={[2500, 5000]}
                            onChange={(v) => updateVendor(vendor.id, { fee: number(v) })}
                          />

                          <InputField
                            label="Estimated Total Sales"
                            prefix="₹"
                            value={vendor.expectedSales}
                            placeholder="0"
                            quickIncrements={[10000, 25000]}
                            onChange={(v) => updateVendor(vendor.id, { expectedSales: number(v) })}
                          />

                          <InputField
                            label="UDC Commission Cut (%)"
                            suffix="%"
                            value={vendor.commission}
                            placeholder="0"
                            step="1"
                            quickIncrements={[5, 10, 15]}
                            onChange={(v) => updateVendor(vendor.id, { commission: number(v) })}
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2 text-xs font-mono text-slate-400">
                          <span>Expected Commission: <strong className="text-cyan-300">{money(commRev)}</strong></span>
                          <span>Total Stall Yield: <strong className="text-emerald-400">{money(stallTotal)}</strong></span>
                        </div>
                      </div>
                    );
                  })
                )}

                {/* Vendor Totals Strip */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3.5 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] select-none">Total Booking Fees</span>
                    <p className="text-xl font-bold text-white">{money(vendorFees)}</p>
                    {data.vendors.length === 0 && data.stallCapacity > 0 && (
                      <span className="text-[10px] text-cyan-400 block">From {data.stallCapacity} stalls @ {money(data.stallDefaultPrice)}</span>
                    )}
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] select-none">Total Commissions</span>
                    <p className="text-xl font-bold text-cyan-400">{money(vendorCommission)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                    <span className="text-slate-400 uppercase text-[10px] select-none">Net Commercial Inflow</span>
                    <p className="text-xl font-bold text-emerald-400">{money(totalVendorRevenue)}</p>
                  </div>
                </div>
              </div>

            </div>
          </SectionCard>
        )}

        {/* ── TAB 5: EXPENDITURES ── */}
        {activeTab === "expenses" && (
          <SectionCard
            title="Operational Expenditure Ledger"
            subtitle="Itemize every operational overhead across logistics, production, and artist management."
            icon={Receipt}
            badge={`${data.expenses.length} ITEMS`}
            action={
              <button
                type="button"
                onClick={() =>
                  update({
                    expenses: [
                      ...data.expenses,
                      { id: uid(), name: `Custom Expense #${data.expenses.length + 1}`, amount: 0 },
                    ],
                  })
                }
                className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Expense Line</span>
              </button>
            }
          >
            <div className="space-y-3">
              {data.expenses.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 sm:p-4 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all grid grid-cols-1 sm:grid-cols-[1fr_220px_auto] gap-3 items-end"
                >
                  <InputField
                    label="Expense Description / Vendor"
                    type="text"
                    value={item.name}
                    placeholder="e.g. Venue Rental"
                    onChange={(v) => updateExpense(item.id, { name: v })}
                  />

                  <InputField
                    label="Allocated Amount"
                    prefix="₹"
                    value={item.amount}
                    placeholder="0"
                    quickIncrements={[1000, 5000, 10000]}
                    onChange={(v) => updateExpense(item.id, { amount: number(v) })}
                  />

                  <div className="flex justify-end pb-1">
                    <button
                      type="button"
                      onClick={() =>
                        update({ expenses: data.expenses.filter((x) => x.id !== item.id) })
                      }
                      className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                      title="Remove expense line"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-5 p-5 rounded-2xl bg-[#070b18] border border-white/10 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400 uppercase select-none">Subtotal Base Expenses:</span>
                <span className="text-2xl font-bold text-rose-400 font-display">{money(baseExpenses)}</span>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── TAB 6: SPONSORSHIPS ── */}
        {activeTab === "sponsors" && (
          <SectionCard
            title="Sponsorship & Partnership Architecture"
            subtitle="Distinguish liquid cash endorsements from in-kind barter deliverables and media services."
            icon={Handshake}
            badge={`${data.sponsors.length} SPONSORS`}
            action={
              <button
                type="button"
                onClick={() =>
                  update({
                    sponsors: [
                      ...data.sponsors,
                      { id: uid(), name: `Partner Brand #${data.sponsors.length + 1}`, cash: 0, inKind: 0 },
                    ],
                  })
                }
                className="px-3.5 py-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Sponsor</span>
              </button>
            }
          >
            <div className="space-y-4">
              {data.sponsors.length === 0 ? (
                <div className="p-8 text-center rounded-2xl border border-dashed border-white/10 text-slate-500 text-xs font-mono">
                  No brand sponsors recorded yet. Click &quot;Add Sponsor&quot; to configure cash contributions and in-kind barter values.
                </div>
              ) : (
                data.sponsors.map((sponsor) => (
                  <div
                    key={sponsor.id}
                    className="p-4 sm:p-5 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all grid grid-cols-1 sm:grid-cols-[1fr_180px_180px_auto] gap-3.5 items-end"
                  >
                    <InputField
                      label="Sponsor / Partner Name"
                      type="text"
                      value={sponsor.name}
                      placeholder="e.g. Title Associate Sponsor"
                      onChange={(v) => updateSponsor(sponsor.id, { name: v })}
                    />

                    <InputField
                      label="Cash Contribution"
                      prefix="₹"
                      value={sponsor.cash}
                      placeholder="0"
                      quickIncrements={[10000, 25000, 50000]}
                      onChange={(v) => updateSponsor(sponsor.id, { cash: number(v) })}
                    />

                    <InputField
                      label="In-Kind Goods/Services"
                      prefix="₹"
                      value={sponsor.inKind}
                      placeholder="0"
                      helper="Non-cash valuation"
                      quickIncrements={[5000, 15000]}
                      onChange={(v) => updateSponsor(sponsor.id, { inKind: number(v) })}
                    />

                    <div className="flex justify-end pb-1">
                      <button
                        type="button"
                        onClick={() =>
                          update({ sponsors: data.sponsors.filter((x) => x.id !== sponsor.id) })
                        }
                        className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 hover:bg-rose-500/25 text-rose-300 transition cursor-pointer focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:outline-none"
                        title="Remove sponsor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}

              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-1">
                  <span className="text-emerald-300 uppercase text-[10px] select-none">Total Liquid Cash Sponsorship</span>
                  <p className="text-2xl font-bold text-white font-display">{money(sponsorCash)}</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 space-y-1">
                  <span className="text-purple-300 uppercase text-[10px] select-none">Total In-Kind Barter Value</span>
                  <p className="text-2xl font-bold text-white font-display">{money(sponsorInKind)}</p>
                </div>
              </div>
            </div>
          </SectionCard>
        )}

        {/* ── TAB 7: SCENARIO MODELER ── */}
        {activeTab === "scenarios" && (
          <SectionCard
            title="Strategic Catering Model Comparison"
            subtitle="Simulate the bottom-line financial impact of switching between full buffet, hybrid, and stall concessions under identical ticket and sponsor volumes."
            icon={Sliders}
            badge="WHAT-IF"
          >
            <div className="space-y-6">
              {bestScenario && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>
                      <strong>Recommendation:</strong> {bestScenario.name} yields maximum net surplus of{" "}
                      <strong>{money(bestScenario.profit)}</strong> ({bestScenario.margin.toFixed(1)}% margin).
                    </span>
                  </div>
                  {data.foodMode !== bestScenario.id && (
                    <button
                      type="button"
                      onClick={() => update({ foodMode: bestScenario.id })}
                      className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition cursor-pointer shrink-0"
                    >
                      Switch to Best Model
                    </button>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {scenarios.map((scenario) => {
                  const isSelected = data.foodMode === scenario.id;
                  const isBest = bestScenario?.id === scenario.id;
                  return (
                    <div
                      key={scenario.id}
                      className={`rounded-2xl border p-6 flex flex-col justify-between transition-all relative overflow-hidden ${
                        isSelected
                          ? "border-cyan-400 bg-cyan-500/[0.08] shadow-[0_0_35px_rgba(6,182,212,0.18)]"
                          : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04]"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white font-display">
                            {scenario.name}
                          </h3>
                          {isSelected && (
                            <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border border-cyan-400 bg-cyan-400/20 text-cyan-300 font-bold uppercase">
                              Active Plan
                            </span>
                          )}
                          {!isSelected && isBest && (
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 font-bold uppercase">
                              Max Yield
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-400 font-sans leading-relaxed">
                          {scenario.desc}
                        </p>

                        <div className="space-y-2.5 pt-3 border-t border-white/10 font-mono text-xs">
                          <div className="flex justify-between">
                            <span className="text-slate-400">Food Expenditure:</span>
                            <strong className="text-white">{money(scenario.food)}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Total Event Cost:</span>
                            <strong className="text-rose-400">{money(scenario.total)}</strong>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-400">Net Balance:</span>
                            <strong
                              className={scenario.profit >= 0 ? "text-emerald-400 text-sm" : "text-rose-400 text-sm"}
                            >
                              {money(scenario.profit)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6">
                        <button
                          type="button"
                          onClick={() => update({ foodMode: scenario.id })}
                          disabled={isSelected}
                          className={`w-full py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${
                            isSelected
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 cursor-default"
                              : "bg-white/10 hover:bg-white/15 text-white"
                          }`}
                        >
                          {isSelected ? "✓ Currently Active" : "Apply This Model"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </SectionCard>
        )}

      </main>

      <Footer />
    </div>
  );
}
