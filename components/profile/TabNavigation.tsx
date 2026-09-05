'use client';

import React from 'react';

export type ProfileTab = 'CREATE' | 'SPEAK' | 'PARTICIPATE' | 'IMPACT';

interface TabNavigationProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: ProfileTab[] = ['CREATE', 'SPEAK', 'PARTICIPATE', 'IMPACT'];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`py-2.5 rounded-xl transition cursor-pointer font-semibold ${
            activeTab === tab
              ? 'bg-white text-black shadow-md'
              : 'text-neutral-400 hover:text-white hover:bg-white/[0.02]'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};