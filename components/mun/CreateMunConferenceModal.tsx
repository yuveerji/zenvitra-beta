'use client';

import React from 'react';
import { CreateEventModal } from '@/components/events/CreateEventModal';

export interface CreateMunConferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConferenceCreated?: (conferenceId: string) => void;
}

/**
 * Replaced legacy Launch MUN modal with standard comprehensive Event Setup Studio
 */
export function CreateMunConferenceModal({
  isOpen,
  onClose,
}: CreateMunConferenceModalProps) {
  return (
    <CreateEventModal
      isOpen={isOpen}
      onClose={onClose}
      initialCategory="MUN"
    />
  );
}
