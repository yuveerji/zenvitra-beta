import React from 'react';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from '@/components/ui/GlassCard';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: LucideIcon;
  status?: 'normal' | 'danger' | 'success';
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  status = 'normal',
}) => {
  const statusColors = {
    normal: 'text-white',
    danger: 'text-rose-400',
    success: 'text-emerald-400',
  };

  return (
    <GlassCard intensity="standard" className="p-5 space-y-2">
      <div className="flex items-center justify-between text-neutral-500 font-mono text-[10px]">
        <span>{label}</span>
        {Icon && <Icon className="w-4 h-4 text-neutral-400" />}
      </div>
      <p className={`text-2xl font-bold font-mono ${statusColors[status]}`}>{value}</p>
      {subtext && <p className="text-[11px] font-mono text-neutral-400">{subtext}</p>}
    </GlassCard>
  );
};