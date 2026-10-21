import React from 'react';
import { Metadata } from 'next';
import { OnboardingShell } from '@/components/onboarding/OnboardingShell';

export const metadata: Metadata = {
  title: 'ZENVITRA Onboarding Tour — By Youth. For Youth.',
  description: 'A space to participate. A space to create. A space to be heard. Interactive onboarding trailer and ecosystem guide.',
};

export default function OnboardingPage() {
  return <OnboardingShell />;
}
