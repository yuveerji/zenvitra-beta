'use client';

import React, { useState } from 'react';
import { Newspaper, Plus, Clock, Check, Eye, AlertTriangle, ShieldCheck, Share2 } from 'lucide-react';
import { DiasButton } from '../dias/DiasButton';
import { DiasBadge } from '../dias/DiasBadge';
import { DiasCard } from '../dias/DiasCard';
import { PressSubmissionModal } from './PressSubmissionModal';

export interface PressStory {
  id: string;
  headline: string;
  leadAgency: string;
  publicationType: string;
  authorName: string;
  bodyText: string;
  status: 'DRAFT' | 'EDITORIAL_REVIEW' | 'APPROVED' | 'PUBLISHED' | 'EMBARGOED';
  embargoUntil?: string | null;
  createdAt: string;
}

export interface PressRoomWorkspaceProps {
  stories: PressStory[];
  onPublishStory: (story: any) => void;
  onApproveStory?: (id: string) => void;
  isEditor?: boolean;
}

export const PressRoomWorkspace: React.FC<PressRoomWorkspaceProps> = ({
  stories,
  onPublishStory,
  onApproveStory,
  isEditor = true,
}) => {
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  return (
    <div className="space-y-5 text-left select-none">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#181B21]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base font-semibold text-[#F4F2ED]">
              International Press Corps • Wire Room
            </h3>
            <DiasBadge variant="gold" size="sm">
              PRESS DESK
            </DiasBadge>
          </div>
          <p className="text-xs text-[#9A9DA5]">
            Live press releases, investigative reporting, and official communiqués from accredited journalists
          </p>
        </div>
        <DiasButton
          variant="gold"
          size="sm"
          onClick={() => setIsSubmitOpen(true)}
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          File Dispatch
        </DiasButton>
      </div>

      {stories.length === 0 ? (
        <div className="p-8 rounded-2xl border border-dashed border-[#232731] bg-[#111318]/40 text-center space-y-3">
          <Newspaper className="w-8 h-8 text-[#575B66] mx-auto" />
          <div className="space-y-1">
            <p className="text-sm font-medium text-[#F4F2ED]">No Dispatches Filed Yet</p>
            <p className="text-xs text-[#9A9DA5] max-w-sm mx-auto">
              Accredited journalists from Reuters, PTI, and the diplomatic press can file dispatches for editorial review.
            </p>
          </div>
          <DiasButton
            variant="charcoal"
            size="sm"
            onClick={() => setIsSubmitOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            File First Story
          </DiasButton>
        </div>
      ) : (
        <div className="space-y-3">
          {stories.map((story) => (
            <DiasCard key={story.id} variant="elevated" className="p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#C5A46D] px-2 py-0.5 rounded bg-[#181B21] border border-[#2A2E39]">
                    {story.leadAgency}
                  </span>
                  <DiasBadge
                    variant={
                      story.status === 'PUBLISHED'
                        ? 'emerald'
                        : story.status === 'EMBARGOED'
                        ? 'amber'
                        : 'charcoal'
                    }
                    size="sm"
                  >
                    {story.status}
                  </DiasBadge>
                </div>
                <span className="text-xs text-[#9A9DA5]">
                  By: <strong className="text-[#F4F2ED]">{story.authorName}</strong>
                </span>
              </div>

              <h4 className="text-base font-semibold text-[#F4F2ED] leading-snug">
                {story.headline}
              </h4>
              <p className="text-xs text-[#9A9DA5] leading-relaxed">
                {story.bodyText}
              </p>

              {story.status === 'EMBARGOED' && story.embargoUntil && (
                <div className="p-3 rounded-xl bg-[#B87A24]/15 border border-[#B87A24]/30 text-xs text-[#FCD34D] flex items-center gap-2">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>
                    Embargo Active: Release locked until{' '}
                    {new Date(story.embargoUntil).toLocaleTimeString()}
                  </span>
                </div>
              )}

              {isEditor && story.status === 'EDITORIAL_REVIEW' && (
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#181B21]">
                  <DiasButton
                    variant="gold"
                    size="sm"
                    onClick={() => onApproveStory && onApproveStory(story.id)}
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    Approve & Publish to Chamber
                  </DiasButton>
                </div>
              )}
            </DiasCard>
          ))}
        </div>
      )}

      <PressSubmissionModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmitDispatch={(data) => {
          onPublishStory({
            ...data,
            id: `story_${Date.now()}`,
            authorName: 'Press Correspondent',
            status: data.embargoMinutes ? 'EMBARGOED' : 'PUBLISHED',
            embargoUntil: data.embargoMinutes
              ? new Date(Date.now() + data.embargoMinutes * 60000).toISOString()
              : null,
            createdAt: new Date().toISOString(),
          });
        }}
      />
    </div>
  );
};
