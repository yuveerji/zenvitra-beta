import React from 'react';

export interface DiasSkeletonProps {
  className?: string;
}

export const DiasSkeleton: React.FC<DiasSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-[#181B21] border border-[#232731] rounded-xl ${className}`}
    />
  );
};

export interface DiasEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const DiasEmptyState: React.FC<DiasEmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[#232731] bg-[#111318]/50 ${className}`}
    >
      {icon && (
        <div className="w-12 h-12 rounded-2xl bg-[#181B21] border border-[#2A2E39] flex items-center justify-center text-[#C5A46D] mb-4 shadow-sm">
          {icon}
        </div>
      )}
      <h3 className="text-base font-medium text-[#F4F2ED] mb-1">{title}</h3>
      <p className="text-xs sm:text-sm text-[#9A9DA5] max-w-sm mb-6 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};
