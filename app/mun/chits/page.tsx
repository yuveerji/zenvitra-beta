"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { sheetSync } from "@/lib/googleSheets";

type Role = "delegate" | "eb" | "reviewer";
type ChitType = "direct" | "substantive" | "report";
type Status =
  | "Sent"
  | "Delivered"
  | "Read"
  | "Submitted"
  | "Under Review"
  | "Acknowledged"
  | "Responded"
  | "Resolved"
  | "Closed"
  | "Escalated";

type Chit = {
  id: string;
  type: ChitType;
  title: string;
  body: string;
  sender: string;
  recipient: string;
  category: string;
  status: Status;
  time: string;
  assignedTo?: string;
  unread?: boolean;
};

const initialChits: Chit[] = [];

const navigation: Record<
  Role,
  { id: string; label: string; icon: string }[]
> = {
  delegate: [
    { id: "overview", label: "Overview", icon: "⌂" },
    { id: "direct", label: "Direct Chits", icon: "↗" },
    { id: "substantive", label: "Substantive Chits", icon: "▤" },
    { id: "reports", label: "My Reports", icon: "◇" },
    { id: "archive", label: "Archive", icon: "▣" },
  ],
  eb: [
    { id: "overview", label: "Overview", icon: "⌂" },
    { id: "substantive", label: "Substantive Inbox", icon: "▤" },
    { id: "assigned", label: "Assigned to Me", icon: "✓" },
    { id: "history", label: "Resolved & History", icon: "◷" },
  ],
  reviewer: [
    { id: "overview", label: "Overview", icon: "⌂" },
    { id: "reports", label: "Report Queue", icon: "◇" },
    { id: "assigned", label: "Assigned to Me", icon: "✓" },
    { id: "history", label: "Resolved & History", icon: "◷" },
  ],
};

function typeName(type: ChitType) {
  return {
    direct: "Direct",
    substantive: "Substantive",
    report: "Report",
  }[type];
}

function statusStyle(status: Status) {
  if (["Read", "Responded", "Resolved", "Closed"].includes(status))
    return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
  if (["Under Review", "Delivered", "Acknowledged"].includes(status))
    return "bg-blue-500/10 text-blue-300 border-blue-500/20";
  if (status === "Escalated")
    return "bg-red-500/10 text-red-300 border-red-500/20";
  return "bg-amber-500/10 text-amber-300 border-amber-500/20";
}

function typeStyle(type: ChitType) {
  return {
    direct: "bg-violet-500/10 text-violet-300",
    substantive: "bg-sky-500/10 text-sky-300",
    report: "bg-amber-500/10 text-amber-300",
  }[type];
}

export default function ZenChitsPage() {
  const [role, setRole] = useState<Role>("delegate");
  const [section, setSection] = useState("overview");
  const [chits, setChits] = useState(initialChits);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [composer, setComposer] = useState(false);
  const [kind, setKind] = useState<ChitType>("direct");
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("Question / Clarification");
  const [anonymous, setAnonymous] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileMenu, setMobileMenu] = useState(false);

  const selected = chits.find((c) => c.id === selectedId) ?? null;

  const visibleChits = useMemo(() => {
    let result = [...chits];

    if (role === "delegate") {
      if (section === "direct")
        result = result.filter((c) => c.type === "direct");
      else if (section === "substantive")
        result = result.filter((c) => c.type === "substantive");
      else if (section === "reports")
        result = result.filter((c) => c.type === "report");
      else if (section === "archive")
        result = result.filter((c) =>
          ["Closed", "Resolved"].includes(c.status)
        );
      else result = result.filter((c) => c.type !== "report");
    } else if (role === "eb") {
      // Direct and report chits are never included in the EB inbox.
      result = result.filter((c) => c.type === "substantive");

      if (section === "assigned")
        result = result.filter((c) => Boolean(c.assignedTo));

      if (section === "history")
        result = result.filter((c) =>
          ["Responded", "Closed", "Resolved"].includes(c.status)
        );
    } else {
      result = result.filter((c) => c.type === "report");

      if (section === "assigned")
        result = result.filter((c) => Boolean(c.assignedTo));

      if (section === "history")
        result = result.filter((c) =>
          ["Resolved", "Closed"].includes(c.status)
        );
    }

    if (filter !== "All")
      result = result.filter((c) => c.status === filter);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        `${c.id} ${c.title} ${c.sender} ${c.category} ${c.body}`
          .toLowerCase()
          .includes(q)
      );
    }

    return result;
  }, [chits, role, section, filter, search]);

  const relevant = chits.filter((c) => {
    if (role === "delegate") return c.type !== "report";
    if (role === "eb") return c.type === "substantive";
    return c.type === "report";
  });

  const pending = relevant.filter((c) =>
    ["Submitted", "Under Review", "Acknowledged", "Escalated"].includes(
      c.status
    )
  ).length;

  const completed = relevant.filter((c) =>
    ["Responded", "Resolved", "Closed"].includes(c.status)
  ).length;

  function changeRole(next: Role) {
    setRole(next);
    setSection("overview");
    setSelectedId(null);
    setFilter("All");
    setSearch("");
    setComposer(false);
    setToast("");
  }

  function notify(text: string) {
    setToast(text);
    window.setTimeout(() => setToast(""), 4500);
  }

  function createChit() {
    if (!subject.trim() || !message.trim()) {
      notify("Please enter a subject and message.");
      return;
    }

    if (kind === "direct" && !recipient.trim()) {
      notify("Select the delegate who should receive this chit.");
      return;
    }

    const prefix = kind === "report" ? "RP" : "CH";

    const chit: Chit = {
      id: `${prefix}-${Date.now().toString().slice(-6)}`,
      type: kind,
      title: subject.trim(),
      body: message.trim(),
      sender:
        kind === "report" && anonymous
          ? "Confidential reporter"
          : "You · Delegate",
      recipient:
        kind === "direct"
          ? recipient.trim()
          : kind === "substantive"
            ? "Executive Board"
            : "Authorized reviewers",
      category,
      status: kind === "direct" ? "Sent" : "Submitted",
      time: "Just now",
    };

    setChits((current) => [chit, ...current]);
    setSelectedId(chit.id);

    try {
      sheetSync.chit({
        Chit_ID: chit.id,
        MUN_ID: "MUN-2026",
        Committee_ID: "GENERAL",
        Sender_Seat: chit.sender,
        Recipient_Seat: chit.recipient,
        Chit_Type: chit.type,
        Message_Content: chit.body,
        Routing_Status: chit.status,
        Sent_Time: new Date().toISOString(),
        Delivered_Time: new Date().toISOString(),
        EB_Flagged: "No"
      });
    } catch (_) {}

    setSection(
      kind === "direct"
        ? "direct"
        : kind === "substantive"
          ? "substantive"
          : "reports"
    );
    setComposer(false);
    setSubject("");
    setMessage("");
    setRecipient("");
    setAnonymous(false);

    notify(
      "Chit created and synchronized to Google Sheet."
    );
  }

  function updateStatus(id: string, status: Status) {
    setChits((current) =>
      current.map((c) => (c.id === id ? { ...c, status } : c))
    );
    notify(`Demo status changed to ${status}. No server update was made.`);
  }

  const heading =
    section === "overview"
      ? "Your chits, in one place."
      : navigation[role].find((item) => item.id === section)?.label ??
        "ZEN.CHITS";

  return (
    <main className="min-h-screen bg-[#090a0d] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1800px]">
        {/* Sidebar */}
        <aside
          className={`${
            mobileMenu ? "fixed inset-0 z-50 flex w-[290px]" : "hidden"
          } md:sticky md:top-0 md:flex md:h-screen md:w-[250px] md:shrink-0 flex-col border-r border-white/[0.08] bg-[#0d0e12] p-4`}
        >
          <div className="flex items-center gap-3 px-2 pb-8 pt-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-zinc-100 text-xl font-black text-black">
              Z
            </div>
            <div className="flex-1">
              <p className="text-sm font-black tracking-[0.18em]">ZENVITRA</p>
              <p className="mt-1 text-[9px] tracking-[0.16em] text-zinc-500">
                YOUTH. IDEAS. IMPACT.
              </p>
            </div>
            <button
              className="md:hidden text-2xl text-zinc-400"
              onClick={() => setMobileMenu(false)}
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>

          <div className="mb-4 space-y-1.5">
            <Link
              href="/mun"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-amber-300 transition border border-white/5"
            >
              <span>← Back to ZEN.MUN</span>
            </Link>
            <Link
              href="/meet"
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-[11px] font-mono text-cyan-300 transition border border-white/5"
            >
              <span>← Chamber in ZEN.MEET</span>
            </Link>
          </div>

          <p className="px-2 text-[10px] font-bold tracking-[0.16em] text-zinc-600">
            WORKSPACE
          </p>

          <div className="mt-3 flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.035] p-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-400/10 text-xs font-bold text-violet-300">
              ZD
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-bold">
                ZEN.DIPLOMACY MUN
              </p>
              <p className="mt-1 text-[10px] text-zinc-500">
                Committee Chamber
              </p>
            </div>
            <span className="text-zinc-500">⌄</span>
          </div>

          <p className="mb-3 mt-8 px-2 text-[10px] font-bold tracking-[0.16em] text-zinc-600">
            ZEN.CHITS
          </p>

          <nav className="space-y-1">
            {navigation[role].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSection(item.id);
                  setSelectedId(null);
                  setMobileMenu(false);
                }}
                className={`flex w-full items-center gap-3 rounded-lg border px-3 py-3 text-left text-xs transition ${
                  section === item.id
                    ? "border-violet-400/20 bg-violet-400/[0.09] text-white"
                    : "border-transparent text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <span className="w-5 text-center text-lg text-violet-300">
                  {item.icon}
                </span>
                <span className="flex-1">{item.label}</span>
                {item.id === "substantive" && role === "eb" && (
                  <span className="rounded-md bg-violet-400/15 px-2 py-1 text-[9px] text-violet-200">
                    7
                  </span>
                )}
                {item.id === "reports" && role === "reviewer" && (
                  <span className="rounded-md bg-amber-400/10 px-2 py-1 text-[9px] text-amber-200">
                    2
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="mb-5 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.04] p-3">
              <p className="text-xs font-semibold text-emerald-200">
                ◈ Privacy first
              </p>
              <p className="mt-2 text-[10px] leading-5 text-zinc-500">
                Every chit follows its own access and visibility rules.
              </p>
            </div>
            <div className="flex items-center gap-3 border-t border-white/[0.08] pt-4">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-violet-300/15 text-xs font-bold text-violet-200">
                YC
              </div>
              <div className="min-w-0">
                <p className="truncate text-[10px] font-semibold">
                  {role === "delegate"
                    ? "Delegate Account"
                    : role === "eb"
                      ? "Executive Board"
                      : "Report Reviewer"}
                </p>
                <p className="mt-1 text-[10px] text-zinc-500">
                  {role === "delegate"
                    ? "Delegate workspace"
                    : role === "eb"
                      ? "EB command centre"
                      : "Restricted review"}
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main dashboard */}
        <section className="min-w-0 flex-1">
          <header className="flex h-[65px] items-center justify-between border-b border-white/[0.08] px-4 sm:px-7">
            <div className="flex items-center gap-3">
              <button
                className="md:hidden text-xl text-zinc-300"
                onClick={() => setMobileMenu(true)}
                aria-label="Open navigation"
              >
                ☰
              </button>
              <p className="text-[10px] tracking-wider text-zinc-500">
                ZENVITRA <span className="mx-2">/</span>
                <span className="text-zinc-200">ZEN.CHITS</span>
              </p>
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <span className="flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.05] px-3 py-2 text-[9px] text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Session live
              </span>
              <button
                className="text-lg text-zinc-400"
                onClick={() => notify("Notifications are a UI placeholder.")}
                aria-label="Notifications"
              >
                ♧
              </button>
            </div>
          </header>

          <div className="mx-auto max-w-[1500px] p-4 sm:p-7">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
              <div>
                <p className="text-[9px] font-bold tracking-[0.2em] text-violet-300">
                  COMMUNICATION CENTRE
                </p>
                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                  {heading}
                </h1>
                <p className="mt-3 max-w-2xl text-xs leading-6 text-zinc-500">
                  {role === "delegate"
                    ? "Communicate privately, reach the Executive Board, or submit a confidential report."
                    : role === "eb"
                      ? "Manage substantive requests and keep committee proceedings moving."
                      : "Review assigned reports with confidentiality and accountability."}
                </p>
              </div>
              {role === "delegate" && (
                <button
                  onClick={() => {
                    setKind("direct");
                    setComposer(true);
                    setToast("");
                  }}
                  className="rounded-lg bg-zinc-100 px-5 py-3 text-xs font-bold text-black transition hover:bg-white"
                >
                  + Create a chit
                </button>
              )}
            </div>

            <div className="my-5 flex flex-wrap items-center gap-3">
              <label htmlFor="role" className="text-[10px] text-zinc-500">
                Preview dashboard as
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => changeRole(e.target.value as Role)}
                className="rounded-lg border border-white/10 bg-[#14151a] px-3 py-2 text-xs outline-none focus:border-violet-400/50"
              >
                <option value="delegate">Delegate</option>
                <option value="eb">Executive Board</option>
                <option value="reviewer">Report reviewer</option>
              </select>
              <span className="text-[10px] text-zinc-600">
                UI preview · sample data
              </span>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
              {[
                {
                  label:
                    role === "delegate"
                      ? "Chits sent"
                      : role === "eb"
                        ? "Incoming requests"
                        : "Accessible reports",
                  value: relevant.length,
                  icon: "↗",
                  note: "Across this demo",
                },
                {
                  label: "Needs attention",
                  value: pending,
                  icon: "◷",
                  note: "Pending or under review",
                },
                {
                  label: "Completed",
                  value: completed,
                  icon: "✓",
                  note: "Responded or resolved",
                },
                {
                  label: "Access policy",
                  value:
                    role === "delegate"
                      ? "Private"
                      : role === "eb"
                        ? "Role-based"
                        : "Restricted",
                  icon: "◇",
                  note: "Role-aware workspace",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.09] bg-gradient-to-br from-[#14151a] to-[#0f1014] p-4"
                >
                  <div className="mb-4 grid h-8 w-8 place-items-center rounded-lg bg-violet-300/10 text-lg text-violet-200">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-semibold tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-2 text-[11px] font-semibold text-zinc-200">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    {stat.note}
                  </p>
                </div>
              ))}
            </div>

            {/* Quick actions */}
            {role === "delegate" && section === "overview" && (
              <div className="mt-4 grid gap-3 lg:grid-cols-3">
                {[
                  {
                    type: "direct" as const,
                    title: "Direct chit",
                    desc: "Privately message a delegate",
                    icon: "↗",
                    color: "text-violet-200 bg-violet-300/10",
                  },
                  {
                    type: "substantive" as const,
                    title: "Substantive chit",
                    desc: "Contact the Executive Board",
                    icon: "▤",
                    color: "text-sky-200 bg-sky-300/10",
                  },
                  {
                    type: "report" as const,
                    title: "Report a concern",
                    desc: "Contact authorized reviewers",
                    icon: "◇",
                    color: "text-amber-200 bg-amber-300/10",
                  },
                ].map((action) => (
                  <button
                    key={action.type}
                    onClick={() => {
                      setKind(action.type);
                      setComposer(true);
                      setToast("");
                    }}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.09] bg-[#111216] p-4 text-left transition hover:border-violet-300/30 hover:bg-white/[0.03]"
                  >
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-lg text-xl ${action.color}`}
                    >
                      {action.icon}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold">
                        {action.title}
                      </span>
                      <span className="mt-1 block text-[10px] text-zinc-500">
                        {action.desc}
                      </span>
                    </span>
                    <span className="text-zinc-500">→</span>
                  </button>
                ))}
              </div>
            )}

            {role === "eb" && (
              <div className="mt-4 rounded-xl border border-sky-300/15 bg-sky-300/[0.04] p-4">
                <p className="text-xs font-semibold text-sky-200">
                  ⓘ EB inbox boundary
                </p>
                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  Only authorized substantive chits appear here. Direct delegate
                  chits are not copied to this inbox. Report chits stay in the
                  restricted review console.
                </p>
              </div>
            )}

            {role === "reviewer" && (
              <div className="mt-4 rounded-xl border border-amber-300/15 bg-amber-300/[0.04] p-4">
                <p className="text-xs font-semibold text-amber-200">
                  ◇ Confidential review area
                </p>
                <p className="mt-2 text-[11px] leading-5 text-zinc-400">
                  Only reports authorized for your reviewer role should be
                  returned by the production API. Keep sensitive details out
                  of push notifications.
                </p>
              </div>
            )}

            {/* Inbox and detail panel */}
            <div className="mt-4 grid items-stretch gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <section className="min-w-0 overflow-hidden rounded-xl border border-white/[0.09] bg-[#101115]">
                <div className="flex items-center justify-between p-4">
                  <div>
                    <h2 className="text-sm font-semibold">
                      {section === "overview" ? "Recent activity" : "Chit inbox"}
                    </h2>
                    <p className="mt-1 text-[10px] text-zinc-500">
                      {visibleChits.length} item(s) in this view
                    </p>
                  </div>
                  <span className="text-xs text-zinc-500">⌕</span>
                </div>

                <div className="mx-3 flex items-center gap-2 rounded-lg border border-white/[0.08] bg-black/20 px-3 py-2.5">
                  <span className="text-lg text-zinc-500">⌕</span>
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by subject, ID or sender..."
                    className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-zinc-600"
                    aria-label="Search chits"
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="text-zinc-500"
                    >
                      ×
                    </button>
                  )}
                </div>

                <div className="flex gap-1.5 overflow-x-auto px-3 py-3">
                  {[
                    "All",
                    "Submitted",
                    "Under Review",
                    "Acknowledged",
                    "Responded",
                    "Closed",
                  ].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilter(status)}
                      className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[9px] transition ${
                        filter === status
                          ? "border-violet-300/25 bg-violet-300/10 text-violet-200"
                          : "border-white/[0.07] bg-white/[0.02] text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>

                <div className="border-t border-white/[0.07]">
                  {visibleChits.length === 0 ? (
                    <div className="p-12 text-center">
                      <p className="text-2xl text-zinc-600">⌕</p>
                      <p className="mt-3 text-sm font-semibold">
                        No chits found
                      </p>
                      <p className="mt-2 text-xs text-zinc-500">
                        Change your search or status filter.
                      </p>
                    </div>
                  ) : (
                    visibleChits.map((chit) => (
                      <button
                        key={chit.id}
                        onClick={() => setSelectedId(chit.id)}
                        className={`flex w-full gap-3 border-b border-white/[0.06] p-3 text-left transition sm:p-4 ${
                          selectedId === chit.id
                            ? "bg-violet-300/[0.055] shadow-[inset_2px_0_#9993ff]"
                            : "hover:bg-white/[0.025]"
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-lg ${typeStyle(chit.type)}`}
                        >
                          {chit.type === "direct"
                            ? "↗"
                            : chit.type === "substantive"
                              ? "▤"
                              : "◇"}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="text-xs font-semibold leading-5 text-zinc-200">
                              {chit.title}
                            </span>
                            {chit.unread && (
                              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-violet-300" />
                            )}
                          </span>
                          <span className="mt-1 block truncate text-[10px] text-zinc-400">
                            {role === "delegate" ? chit.recipient : chit.sender}
                          </span>
                          <span className="mt-1.5 line-clamp-2 block text-[10px] leading-5 text-zinc-500">
                            {chit.body}
                          </span>
                          <span className="mt-2 block text-[9px] text-zinc-600">
                            {chit.id} · {typeName(chit.type)}
                          </span>
                        </span>
                        <span className="flex shrink-0 flex-col items-end gap-2">
                          <span className="text-[9px] text-zinc-600">
                            {chit.time}
                          </span>
                          <span
                            className={`rounded-md border px-2 py-1 text-[8px] ${statusStyle(chit.status)}`}
                          >
                            {chit.status}
                          </span>
                        </span>
                      </button>
                    ))
                  )}
                </div>
              </section>

              {/* Selected chit */}
              <section className="flex min-h-[420px] min-w-0 flex-col overflow-hidden rounded-xl border border-white/[0.09] bg-[#101115]">
                {selected ? (
                  <>
                    <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                      <span className="text-[10px] tracking-wider text-zinc-500">
                        {selected.id}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-1 text-[9px] ${statusStyle(selected.status)}`}
                      >
                        {selected.status}
                      </span>
                    </div>

                    <div className="flex items-start gap-3 p-4">
                      <span
                        className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl text-xl ${typeStyle(selected.type)}`}
                      >
                        {selected.type === "direct"
                          ? "↗"
                          : selected.type === "substantive"
                            ? "▤"
                            : "◇"}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[10px] text-zinc-500">
                          {typeName(selected.type)} chit
                        </p>
                        <h2 className="mt-1 text-lg font-semibold leading-snug">
                          {selected.title}
                        </h2>
                      </div>
                    </div>

                    <div className="mx-4 grid grid-cols-2 gap-4 border-y border-white/[0.07] py-4">
                      {[
                        ["FROM", selected.sender],
                        ["TO", selected.recipient],
                        ["CATEGORY", selected.category],
                        ["STATUS", selected.status],
                      ].map(([label, value]) => (
                        <div key={label} className="min-w-0">
                          <p className="text-[9px] tracking-wider text-zinc-600">
                            {label}
                          </p>
                          <p className="mt-1.5 break-words text-[10px] font-medium text-zinc-300">
                            {value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="p-4">
                      <p className="text-[9px] font-bold tracking-[0.15em] text-zinc-500">
                        MESSAGE
                      </p>
                      <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-zinc-300">
                        {selected.body}
                      </p>
                    </div>

                    {selected.type === "direct" && (
                      <div className="mx-4 mb-4 rounded-lg border border-violet-300/10 bg-violet-300/[0.04] p-3">
                        <p className="text-[10px] font-semibold text-violet-200">
                          ◈ Private conversation
                        </p>
                        <p className="mt-1.5 text-[10px] leading-5 text-zinc-400">
                          This chit is intended for its selected recipient. It
                          is not automatically visible to the EB.
                        </p>
                      </div>
                    )}

                    {selected.type === "report" && (
                      <div className="mx-4 mb-4 rounded-lg border border-amber-300/10 bg-amber-300/[0.04] p-3">
                        <p className="text-[10px] font-semibold text-amber-200">
                          ◇ Restricted report
                        </p>
                        <p className="mt-1.5 text-[10px] leading-5 text-zinc-400">
                          Report contents are for authorized reviewers only.
                        </p>
                      </div>
                    )}

                    <div className="mt-auto border-t border-white/[0.07] p-4">
                      <p className="mb-3 text-[9px] text-zinc-600">
                        Last activity · {selected.time}
                      </p>

                      {role === "eb" && selected.type === "substantive" && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              updateStatus(selected.id, "Under Review")
                            }
                            className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-zinc-300 hover:bg-white/5"
                          >
                            Start review
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(selected.id, "Responded")
                            }
                            className="rounded-lg bg-zinc-100 px-3 py-2 text-[10px] font-bold text-black"
                          >
                            Mark responded
                          </button>
                          <button
                            onClick={() => updateStatus(selected.id, "Closed")}
                            className="rounded-lg px-3 py-2 text-[10px] text-zinc-400 hover:text-white"
                          >
                            Close
                          </button>
                        </div>
                      )}

                      {role === "reviewer" && selected.type === "report" && (
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() =>
                              updateStatus(selected.id, "Acknowledged")
                            }
                            className="rounded-lg border border-white/10 px-3 py-2 text-[10px] text-zinc-300"
                          >
                            Acknowledge
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(selected.id, "Under Review")
                            }
                            className="rounded-lg bg-zinc-100 px-3 py-2 text-[10px] font-bold text-black"
                          >
                            Start review
                          </button>
                          <button
                            onClick={() =>
                              updateStatus(selected.id, "Escalated")
                            }
                            className="rounded-lg px-3 py-2 text-[10px] text-red-300"
                          >
                            Escalate
                          </button>
                        </div>
                      )}

                      {role === "delegate" && selected.type === "direct" && (
                        <button
                          onClick={() => {
                            setKind("direct");
                            setRecipient(
                              selected.sender.replace("Delegate · ", "")
                            );
                            setSubject(`Re: ${selected.title}`);
                            setComposer(true);
                          }}
                          className="w-full rounded-lg bg-zinc-100 px-4 py-3 text-xs font-bold text-black"
                        >
                          ↩ Reply to delegate
                        </button>
                      )}

                      {role === "delegate" &&
                        selected.type === "substantive" && (
                          <p className="text-[10px] leading-5 text-zinc-500">
                            EB responses will appear here when backend messaging
                            is connected.
                          </p>
                        )}
                    </div>
                  </>
                ) : (
                  <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/[0.08] bg-white/[0.03] text-2xl text-violet-200">
                      ▤
                    </div>
                    <h2 className="mt-4 text-sm font-semibold">
                      Select a chit
                    </h2>
                    <p className="mt-2 max-w-[220px] text-xs leading-5 text-zinc-500">
                      Select an item from the inbox to see its details and
                      available actions.
                    </p>
                  </div>
                )}
              </section>
            </div>

            <div className="mt-4 flex items-start gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.035] p-4">
              <span className="text-lg text-emerald-200">◈</span>
              <div className="flex-1">
                <p className="text-xs font-semibold">Privacy by design</p>
                <p className="mt-1.5 text-[10px] leading-5 text-zinc-400">
                  Direct chits go to the selected delegate. Substantive chits
                  go to the authorized EB. Report chits go to designated
                  reviewers.
                </p>
              </div>
              <span className="hidden rounded-md border border-emerald-300/10 px-2 py-1 text-[8px] tracking-wider text-emerald-200 sm:block">
                ROLE-BASED ACCESS
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Create chit modal */}
      {composer && (
        <div
          className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setComposer(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="compose-title"
            className="my-auto max-h-[94vh] w-full max-w-[620px] overflow-y-auto rounded-2xl border border-white/10 bg-[#111216] p-5 shadow-2xl sm:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[9px] font-bold tracking-[0.18em] text-violet-300">
                  NEW MESSAGE
                </p>
                <h2
                  id="compose-title"
                  className="mt-2 text-2xl font-semibold tracking-tight"
                >
                  Create a chit
                </h2>
                <p className="mt-2 text-xs text-zinc-500">
                  Choose the correct route before sending.
                </p>
              </div>
              <button
                onClick={() => setComposer(false)}
                className="grid h-8 w-8 place-items-center rounded-lg border border-white/10 text-xl text-zinc-400 hover:bg-white/5"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-3">
              {(
                [
                  ["direct", "Direct", "To a delegate", "↗"],
                  ["substantive", "Substantive", "To the EB", "▤"],
                  ["report", "Report", "To authorized reviewers", "◇"],
                ] as const
              ).map(([value, label, desc, icon]) => (
                <button
                  key={value}
                  onClick={() => setKind(value)}
                  className={`rounded-xl border p-3 text-left transition ${
                    kind === value
                      ? "border-violet-300/40 bg-violet-300/[0.08]"
                      : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
                  }`}
                >
                  <span className="text-xl text-violet-200">{icon}</span>
                  <span className="mt-2 block text-xs font-semibold">
                    {label}
                  </span>
                  <span className="mt-1 block text-[10px] text-zinc-500">
                    {desc}
                  </span>
                </button>
              ))}
            </div>

            {kind === "direct" && (
              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] font-semibold text-zinc-300">
                  Recipient delegate *
                </span>
                <input
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Enter delegate name or portfolio"
                  className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-xs outline-none placeholder:text-zinc-600 focus:border-violet-300/40"
                />
              </label>
            )}

            {kind !== "direct" && (
              <label className="mt-5 block">
                <span className="mb-2 block text-[10px] font-semibold text-zinc-300">
                  Category *
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-[#0c0d10] px-3 py-3 text-xs outline-none focus:border-violet-300/40"
                >
                  {(kind === "substantive"
                    ? [
                        "Question / Clarification",
                        "Procedural Query",
                        "Request to the EB",
                        "Point of Information",
                      ]
                    : [
                        "Conduct Concern",
                        "Safety or Welfare",
                        "Procedural Concern",
                        "Other Concern",
                      ]
                  ).map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
            )}

            <label className="mt-4 block">
              <span className="mb-2 block text-[10px] font-semibold text-zinc-300">
                Subject *
              </span>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                maxLength={120}
                placeholder="Keep it clear and specific"
                className="w-full rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-xs outline-none placeholder:text-zinc-600 focus:border-violet-300/40"
              />
            </label>

            <label className="mt-4 block">
              <span className="mb-2 block text-[10px] font-semibold text-zinc-300">
                Message *
              </span>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={5000}
                rows={5}
                placeholder="Write your message..."
                className="w-full resize-y rounded-lg border border-white/10 bg-black/20 px-3 py-3 text-xs leading-5 outline-none placeholder:text-zinc-600 focus:border-violet-300/40"
              />
              <span className="mt-1 block text-right text-[9px] text-zinc-600">
                {message.length}/5000
              </span>
            </label>

            {kind === "report" && (
              <label className="mt-4 flex cursor-pointer gap-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] p-3">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={(e) => setAnonymous(e.target.checked)}
                  className="mt-1 accent-violet-300"
                />
                <span>
                  <span className="block text-xs font-semibold text-amber-100">
                    Request anonymous reporting
                  </span>
                  <span className="mt-1 block text-[10px] leading-5 text-zinc-500">
                    Only available if enabled by conference policy. The final
                    system must explain anonymity limits.
                  </span>
                </span>
              </label>
            )}

            <div className="mt-5 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.035] p-3">
              <p className="text-[10px] font-semibold text-emerald-200">
                ◈ Routing & privacy
              </p>
              <p className="mt-1.5 text-[10px] leading-5 text-zinc-400">
                {kind === "direct"
                  ? "Only the selected delegate receives this chit. It is not automatically copied to the EB."
                  : kind === "substantive"
                    ? "The authorized committee EB receives this chit."
                    : "Only designated report reviewers can access this report."}
              </p>
            </div>

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button
                onClick={() => setComposer(false)}
                className="rounded-lg border border-white/10 px-4 py-3 text-xs text-zinc-300 hover:bg-white/5"
              >
                Cancel
              </button>
              <button
                onClick={createChit}
                className="rounded-lg bg-zinc-100 px-5 py-3 text-xs font-bold text-black hover:bg-white"
              >
                Create demo chit →
              </button>
            </div>

            <p className="mt-4 text-right text-[9px] leading-5 text-zinc-600">
              Frontend demo only. No real message is delivered.
            </p>
          </section>
        </div>
      )}

      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[150] flex max-w-[calc(100vw-40px)] items-start gap-3 rounded-xl border border-violet-300/20 bg-[#1b1a25] p-4 text-xs leading-5 text-zinc-200 shadow-2xl"
        >
          <span className="text-emerald-300">✓</span>
          <span className="flex-1">{toast}</span>
          <button
            onClick={() => setToast("")}
            className="text-lg text-zinc-500"
            aria-label="Dismiss notification"
          >
            ×
          </button>
        </div>
      )}
    </main>
  );
}