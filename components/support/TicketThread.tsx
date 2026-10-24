"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Send, Lock, Shield, User, Bot, Clock, AlertCircle } from "lucide-react";

export type Message = {
  id: string;
  body: string;
  senderUserId?: string | null;
  senderName?: string | null;
  senderRole?: string | null;
  isInternal: boolean;
  isOfficial?: boolean;
  createdAt: string | Date;
};

export default function TicketThread({
  ticketId,
  ticketStatus,
  initialMessages,
  isStaff,
}: {
  ticketId: string;
  ticketStatus: string;
  initialMessages: Message[];
  isStaff: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [body, setBody] = useState("");
  const [internal, setInternal] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isClosed = ["CLOSED", "RESOLVED"].includes((ticketStatus || "").toUpperCase());

  async function sendReply(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!body.trim() || busy || isClosed) return;

    setBusy(true);
    setError("");

    try {
      const response = await fetch(`/api/support/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: body.trim(),
          isInternal: isStaff && internal,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error ?? "Unable to send reply.");
        setBusy(false);
        return;
      }

      setBody("");
      setInternal(false);
      if (result.message) {
        setMessages((prev) => [...prev, result.message]);
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="grid gap-6">
      {/* Messages Timeline */}
      <div className="grid gap-4">
        {messages.map((message) => {
          const isStaffSender =
            message.isOfficial ||
            ["FOUNDER", "CO_FOUNDER", "ADMIN", "STAFF", "SUPPORT_AGENT", "SUPPORT_LEAD", "SECRETARIAT", "CHAIR"].includes(
              (message.senderRole || "").toUpperCase()
            );

          return (
            <article
              key={message.id}
              className={`rounded-2xl border p-5 transition ${
                message.isInternal
                  ? "bg-amber-500/5 border-amber-500/20"
                  : isStaffSender
                  ? "bg-cyan-500/5 border-cyan-500/20"
                  : "bg-neutral-900/60 border-white/10"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold ${
                      message.isInternal
                        ? "bg-amber-500/20 text-amber-400"
                        : isStaffSender
                        ? "bg-cyan-500/20 text-cyan-400"
                        : "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    {isStaffSender ? <Shield className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                  </div>

                  <span className="text-xs font-semibold text-white">
                    {message.senderName || (isStaffSender ? "ZENVITRA Support Desk" : "Member")}
                  </span>

                  {isStaffSender && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      OFFICIAL
                    </span>
                  )}

                  {message.isInternal && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1">
                      <Lock className="w-2.5 h-2.5" /> INTERNAL NOTE
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-[11px] text-neutral-500 font-mono">
                  <Clock className="w-3 h-3" />
                  <span>
                    {new Date(message.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>

              <p className="whitespace-pre-wrap text-sm text-neutral-200 leading-relaxed font-sans">
                {message.body}
              </p>
            </article>
          );
        })}
      </div>

      {/* Reply Composer */}
      {isClosed ? (
        <div className="rounded-2xl border border-white/10 bg-neutral-900/40 p-5 text-center text-xs text-neutral-400 font-mono">
          This ticket is marked as {ticketStatus}. Replies are closed.
        </div>
      ) : (
        <form onSubmit={sendReply} className="grid gap-3 pt-2">
          {isStaff && (
            <label className="flex items-center gap-2 text-xs text-amber-400 select-none cursor-pointer">
              <input
                type="checkbox"
                checked={internal}
                onChange={(e) => setInternal(e.target.checked)}
                className="h-4 w-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500"
              />
              <span className="flex items-center gap-1 font-mono">
                <Lock className="w-3 h-3" /> Add an internal note visible only to authorized staff
              </span>
            </label>
          )}

          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            maxLength={10000}
            rows={4}
            className="rounded-2xl border border-white/10 bg-neutral-950/70 p-4 text-white placeholder-neutral-500 focus:outline-none focus:border-cyan-500/50 transition resize-y text-sm"
            placeholder={
              internal
                ? "Write internal note for staff review..."
                : "Type your reply to this ticket..."
            }
          />

          {error && (
            <div role="alert" className="flex items-center gap-2 p-3 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={busy || !body.trim()}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono text-xs font-medium disabled:opacity-50 transition shadow-lg shadow-cyan-500/20 flex items-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{busy ? "Sending..." : internal ? "Post Internal Note" : "Send Reply"}</span>
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
