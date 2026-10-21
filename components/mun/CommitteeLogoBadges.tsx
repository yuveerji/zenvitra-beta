import React from 'react';

export type CommitteeLogoKey = 
  | 'un'
  | 'unsc'
  | 'p5'
  | 'g7'
  | 'brics'
  | 'g20'
  | 'eu'
  | 'nato'
  | 'asean'
  | 'au'
  | 'opec'
  | 'arab_league'
  | 'unhrc'
  | 'disec'
  | 'ecosoc'
  | 'who'
  | 'unesco'
  | 'unep'
  | 'icj'
  | 'cop'
  | 'aippm'
  | 'lok_sabha';

interface CommitteeLogoBadgeProps {
  logoKey?: CommitteeLogoKey | string;
  size?: number | string;
  className?: string;
  alt?: string;
}

/**
 * Returns the verified official high-resolution picture/crest path
 * for each international Model UN committee.
 */
export function getCommitteeLogoUrl(logoKey?: string): string {
  const normKey = (logoKey || '').toLowerCase().replace(/[^a-z0-9_]/g, '_');

  switch (normKey) {
    // 1. UN, UNSC, P5, UNGA, DISEC, UNHRC, ECOSOC
    case 'un':
    case 'unsc':
    case 'p5':
    case 'unsc_2026':
    case 'unga':
    case 'disec':
    case 'ecosoc':
    case 'unhrc':
      return '/assets/committees/un.svg';

    // 2. Specialized UN Agencies
    case 'who':
      return '/assets/committees/who.svg';
    case 'unesco':
      return '/assets/committees/unesco.svg';
    case 'unicef':
      return '/assets/committees/unicef.svg';
    case 'unep':
      return '/assets/committees/unep.svg';
    case 'icj':
      return '/assets/committees/icj.svg';
    case 'cop':
    case 'unfccc':
      return '/assets/committees/cop.svg';

    // 3. Continental & Regional Alliances
    case 'eu':
      return '/assets/committees/eu.svg';
    case 'nato':
      return '/assets/committees/nato.svg';
    case 'asean':
      return '/assets/committees/asean.svg';
    case 'au':
    case 'african_union':
      return '/assets/committees/au.svg';
    case 'opec':
      return '/assets/committees/opec.svg';
    case 'arab_league':
    case 'las':
      return '/assets/committees/arab_league.svg';

    // 4. Multilateral Summits
    case 'g20':
      return '/assets/committees/g20.svg';
    case 'g7':
      return '/assets/committees/g7.svg';
    case 'brics':
    case 'brics_':
      return '/assets/committees/brics.svg';

    // 5. Indian Parliamentary & National Forums
    case 'aippm':
    case 'lok_sabha':
    case 'loksabha':
    case 'rajya_sabha':
    case 'rajyasabha':
    case 'parliament':
      return '/assets/committees/emblem_of_india.svg';

    default:
      return '/assets/committees/un.svg';
  }
}

/**
 * Official Committee Logo Badge
 * Renders verified high-resolution official organization pictures and crests
 * without math-based SVG calculations that trigger SSR hydration mismatches.
 */
export function CommitteeLogoBadge({
  logoKey = 'un',
  size = 22,
  className = '',
  alt
}: CommitteeLogoBadgeProps) {
  const numSize = typeof size === 'number' ? size : parseInt(String(size), 10) || 22;
  const logoUrl = getCommitteeLogoUrl(logoKey);

  return (
    <img
      src={logoUrl}
      alt={alt || `${logoKey.toUpperCase()} Official Crest`}
      width={numSize}
      height={numSize}
      style={{ width: numSize, height: numSize }}
      className={`shrink-0 rounded-full object-contain bg-black/40 p-0.5 border border-white/10 shadow-sm ${className}`}
      loading="eager"
      onError={(e) => {
        // Fallback safely to universal UN seal if any network error occurs
        const target = e.currentTarget;
        if (target.src !== '/assets/committees/un.svg') {
          target.src = '/assets/committees/un.svg';
        }
      }}
    />
  );
}
