import React from 'react';
import { ProfileTab } from './TabNavigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { Feather, Radio, Calendar, Sparkles } from 'lucide-react';

interface TabPanelsProps {
  activeTab: ProfileTab;
}

export const TabPanels: React.FC<TabPanelsProps> = ({ activeTab }) => {
  return (
    <div className="space-y-4">
      {activeTab === 'CREATE' && (
        <GlassCard intensity="standard" className="text-center py-12 space-y-3">
          <Feather className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-mono text-sm text-white">NO REPOSITORIES OR DISPATCHES DEPLOYED</h3>
          <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
            Artifacts and Markdown essays published by this node will be immutably cataloged here.
          </p>
        </GlassCard>
      )}

      {activeTab === 'SPEAK' && (
        <GlassCard intensity="standard" className="text-center py-12 space-y-3">
          <Radio className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-mono text-sm text-white">NO ACTIVE PULSE BROADCAST STEMS</h3>
          <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
            Audio relays and keynote recordings will populate this ledger.
          </p>
        </GlassCard>
      )}

      {activeTab === 'PARTICIPATE' && (
        <GlassCard intensity="standard" className="text-center py-12 space-y-3">
          <Calendar className="w-8 h-8 text-neutral-500 mx-auto" />
          <h3 className="font-mono text-sm text-white">NO SUMMIT PASSES CLAIMED</h3>
          <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
            Verifiable cryptographic proof of attendance at global assemblies will show here.
          </p>
        </GlassCard>
      )}

      {activeTab === 'IMPACT' && (
        <GlassCard intensity="standard" className="text-center py-12 space-y-3">
          <Sparkles className="w-8 h-8 text-emerald-400 mx-auto" />
          <h3 className="font-mono text-sm text-white">BASE SOVEREIGN SCORE: 100 PTS</h3>
          <p className="text-xs font-mono text-neutral-500 max-w-sm mx-auto">
            Calculated from network tenure, peer endorsements, and protocol contributions.
          </p>
        </GlassCard>
      )}
    </div>
  );
};