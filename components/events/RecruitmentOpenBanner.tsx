'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Users, ArrowRight, Sparkles, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface RecruitmentOpenBannerProps {
  eventId: string;
  eventTitle: string;
  isOrganizer?: boolean;
}

export function RecruitmentOpenBanner({ eventId, eventTitle, isOrganizer }: RecruitmentOpenBannerProps) {
  const router = useRouter();
  const [config, setConfig] = useState<any>(null);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [departments, setDepartments] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    const fetchRecruitmentInfo = async () => {
      try {
        const [configRes, postsRes] = await Promise.all([
          fetch(`/api/events/recruit/config?eventId=${encodeURIComponent(eventId)}`),
          fetch(`/api/events/recruit/posts?eventId=${encodeURIComponent(eventId)}&status=OPEN`)
        ]);

        const configData = await configRes.json();
        const postsData = await postsRes.json();

        if (isMounted) {
          if (configData.success && configData.config) {
            setConfig(configData.config);
          }
          if (postsData.success && Array.isArray(postsData.posts)) {
            setPostsCount(postsData.posts.length);
            setDepartments(postsData.departments || []);
          }
        }
      } catch (_) {
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchRecruitmentInfo();
    return () => { isMounted = false; };
  }, [eventId]);

  // If recruitment is disabled and user is not organizer, don't show banner
  if (!loading && (!config?.enabled || postsCount === 0) && !isOrganizer) {
    return null;
  }

  return (
    <div className="w-full my-6 p-5 sm:p-6 rounded-2xl bg-[#090a12] border border-white/10 backdrop-blur-xl relative overflow-hidden group">
      {/* Background subtle glow */}
      <div className="absolute top-0 right-0 w-80 h-40 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/10 text-[10px] font-mono font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Recruitment Open</span>
            </span>
            {postsCount > 0 && (
              <span className="text-[11px] font-mono text-neutral-400">
                {postsCount} Open Position{postsCount > 1 ? 's' : ''}
              </span>
            )}
          </div>

          <h3 className="font-sans font-bold text-lg sm:text-xl text-white tracking-tight">
            {config?.headline || 'Apply for Event Secretariat & Leadership Posts'}
          </h3>

          <p className="text-xs text-neutral-400 leading-relaxed font-sans">
            {config?.description || 'Join the organizing committee, dais staff, executive board, and operations crew behind this convening.'}
          </p>

          {departments.length > 0 && (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {departments.slice(0, 5).map((dept) => (
                <span
                  key={dept}
                  className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-neutral-300 text-[10px] font-mono"
                >
                  {dept}
                </span>
              ))}
              {departments.length > 5 && (
                <span className="text-[10px] font-mono text-neutral-500">
                  +{departments.length - 5} more
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href={`/events/${eventId}/recruit`}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-neutral-200 text-black text-xs font-sans font-bold transition cursor-pointer flex items-center gap-2 shadow-sm"
          >
            <span>Explore Positions &amp; Apply</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {isOrganizer && (
            <Link
              href={`/events/${eventId}/manage?tab=recruitment`}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white text-xs font-mono transition cursor-pointer flex items-center gap-2"
            >
              <span>Manage Recruitment</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
