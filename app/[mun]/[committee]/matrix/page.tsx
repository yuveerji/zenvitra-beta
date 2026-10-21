'use client';

import React from 'react';
import DynamicMunMatrixPage from '@/app/[mun]/matrix/page';

/**
 * Canonical dynamic route:
 * /[event-name]/[committee]/matrix
 *
 * e.g. /global-youth-summit/unsc/matrix
 *      /national-assembly/aippm/matrix
 *      /zen-diplomacy/ecosoc/matrix
 */
export default function EventCommitteeMatrixDynamicRoute() {
  return <DynamicMunMatrixPage />;
}
