"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Shield, Sparkles, AlertCircle, Lock } from "lucide-react";

export default function TicketForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [category, setCategory] = useState("GENERAL");
  const [isSensitive, setIsSensitive] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");

    const formData = new FormData(e.currentTarget);

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.get("subject"),
          description: formData.get("description"),
          category: formData.get("category"),
          priority: formData.get("priority"),
          relatedModule: formData.get("relatedModule") || undefined,
          isSensitive,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to submit ticket.");
        setBusy(false);
        return;
      }

      router.push(`/support/${result.ticket.id}`);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid w-full max-w-2xl gap-5 bg-neutral-900/60 border border-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-xl shadow-2xl"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-white/5">
        <Sparkles className="w-4 h-4 text-cyan-400" />
        <span className="font-mono text-xs uppercase tracking-wider text-neutral-400">
          Official Help & Resolution Desk
        </span>
      </div>

      <label className="grid gap-2 text-sm text-neutral-300 font-medium">
        Subject
        <input
          name="subject"
          required
          minLength={5}
          maxLength={150}
          className="rounded-xl border border-white/10 bg-neutral-950/70 p-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition"
          placeholder="Brief summary of your inquiry or issue"
        />
      </label>

      <div className="grid sm:grid-cols-2 gap-4">
        <label className="grid gap-2 text-sm text-neutral-300 font-medium">
          Category
          <select
            name="category"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              if (e.target.value === "CONDUCT") setIsSensitive(true);
            }}
            className="rounded-xl border border-white/10 bg-neutral-950/70 p-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition"
            required
          >
            <option value="GENERAL">General enquiries (ZEN.SUPPORT)</option>
            <option value="ACCOUNT">Account & login (Tech & Product)</option>
            <option value="PAYMENTS">Payments & refunds (Finance)</option>
            <option value="EVENTS_MUN">MUN registrations & certificates (Events Ops)</option>
            <option value="APPLICATIONS">Secretariat & applications (Recruitment)</option>
            <option value="TECHNICAL">Website bugs & technical errors (Tech)</option>
            <option value="CONDUCT">Conduct complaints & harassment (Confidential)</option>
          </select>
        </label>

        <label className="grid gap-2 text-sm text-neutral-300 font-medium">
          Priority
          <select
            name="priority"
            defaultValue="NORMAL"
            className="rounded-xl border border-white/10 bg-neutral-950/70 p-3.5 text-white focus:outline-none focus:border-cyan-500/50 transition"
          >
            <option value="LOW">Low (General question)</option>
            <option value="NORMAL">Normal (Standard assistance)</option>
            <option value="HIGH">High (Urgent / Time-sensitive)</option>
          </select>
        </label>
      </div>

      <label className="grid gap-2 text-sm text-neutral-300 font-medium">
        Related Reference / ID (Optional)
        <input
          name="relatedModule"
          maxLength={80}
          className="rounded-xl border border-white/10 bg-neutral-950/70 p-3 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition font-mono text-xs"
          placeholder="e.g. Pass ID, Transaction ID, Committee name, or URL"
        />
      </label>

      <label className="grid gap-2 text-sm text-neutral-300 font-medium">
        Description
        <textarea
          name="description"
          required
          minLength={10}
          maxLength={10000}
          rows={6}
          className="rounded-xl border border-white/10 bg-neutral-950/70 p-3.5 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition resize-y"
          placeholder="Please explain in detail what happened and what help you need..."
        />
      </label>

      {/* Sensitive / Confidential Flag */}
      <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <input
          type="checkbox"
          id="isSensitive"
          checked={isSensitive}
          onChange={(e) => setIsSensitive(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
        />
        <label htmlFor="isSensitive" className="text-xs text-neutral-300 cursor-pointer select-none">
          <span className="font-semibold text-amber-400 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Confidential / Sensitive Complaint
          </span>
          Restrict viewing exclusively to designated confidential review administrators.
        </label>
      </div>

      {error && (
        <div role="alert" className="flex items-center gap-2 p-3 text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 p-3.5 font-medium text-white hover:from-cyan-400 hover:to-blue-500 disabled:opacity-50 transition shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 font-mono text-sm"
      >
        <Send className="w-4 h-4" />
        <span>{busy ? "Submitting Ticket..." : "Submit Support Ticket"}</span>
      </button>
    </form>
  );
}
