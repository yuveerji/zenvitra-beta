import React from 'react';
import { Metadata } from 'next';
import { ConferenceCommandCenter } from '@/components/mun/conference/ConferenceCommandCenter';

export const metadata: Metadata = {
  title: 'ZEN.MUN Conference Command Center & Intelligence | ZENVITRA',
  description: 'Secretariat Command Center, live committee intelligence table, attendance drop analysis, and dais telemetry.'
};

export default function MunConferencePage() {
  return <ConferenceCommandCenter />;
}
