import { MunConference, MunConferenceStatus } from '@/types/mun';

export interface ConferenceStatusInfo {
  status: MunConferenceStatus;
  currentDay: number;
  totalDays: number;
  daysUntilStart: number;
  isLive: boolean;
  displayText: string;
}

/**
 * Computes dynamic conference status based on actual calendar dates.
 * If today is before startDate, status is strictly NOT_STARTED / UPCOMING.
 * If today is between startDate and endDate, status is DAY_X IN SESSION.
 * If today is after endDate, status is CONCLUDED.
 */
export function computeConferenceStatus(conf?: {
  startDate?: string;
  endDate?: string;
  status?: MunConferenceStatus;
}): ConferenceStatusInfo {
  // If status is explicitly active (DAY_X, IN_SESSION, or ACTIVE), prioritize live status
  if (conf?.status && (conf.status.startsWith('DAY_') || conf.status === 'IN_SESSION' || conf.status === 'ACTIVE')) {
    const dayNum = conf.status.startsWith('DAY_') ? (parseInt(conf.status.replace('DAY_', ''), 10) || 1) : 1;
    return {
      status: `DAY_${dayNum}`,
      currentDay: dayNum,
      totalDays: Math.max(dayNum, 1),
      daysUntilStart: 0,
      isLive: true,
      displayText: `DAY ${dayNum} IN SESSION`,
    };
  }

  if (!conf || !conf.startDate) {
    return {
      status: 'NOT_STARTED',
      currentDay: 0,
      totalDays: 1,
      daysUntilStart: 0,
      isLive: false,
      displayText: 'SCHEDULED • DATE PENDING',
    };
  }

  const now = new Date();
  const todayYMD = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const startYMD = conf.startDate.trim();
  const endYMD = (conf.endDate || conf.startDate).trim();

  const startMs = new Date(`${startYMD}T00:00:00`).getTime();
  const endMs = new Date(`${endYMD}T23:59:59`).getTime();
  const todayMs = new Date(`${todayYMD}T00:00:00`).getTime();
  const msPerDay = 1000 * 60 * 60 * 24;

  const daysUntilStart = Math.max(0, Math.ceil((startMs - todayMs) / msPerDay));
  const totalDays = Math.max(1, Math.round((new Date(`${endYMD}T00:00:00`).getTime() - startMs) / msPerDay) + 1);

  // Future date check
  if (todayMs < startMs) {
    return {
      status: 'NOT_STARTED',
      currentDay: 0,
      totalDays,
      daysUntilStart,
      isLive: false,
      displayText: `UPCOMING • STARTS ${startYMD}${daysUntilStart > 0 ? ` (in ${daysUntilStart}d)` : ''}`,
    };
  }

  // Past date check
  if (todayMs > endMs) {
    return {
      status: 'CONCLUDED',
      currentDay: totalDays,
      totalDays,
      daysUntilStart: 0,
      isLive: false,
      displayText: 'CONCLUDED • ADJOURNED SINE DIE',
    };
  }

  // Active in session
  const currentDay = Math.min(totalDays, Math.max(1, Math.floor((todayMs - startMs) / msPerDay) + 1));
  return {
    status: `DAY_${currentDay}`,
    currentDay,
    totalDays,
    daysUntilStart: 0,
    isLive: true,
    displayText: `DAY ${currentDay} OF ${totalDays} IN SESSION`,
  };
}
