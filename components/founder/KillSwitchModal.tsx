'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, Lock } from 'lucide-react';

interface KillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetProtocol: string;
  onConfirm: () => Promise<void>;
}

export const KillSwitchModal: React.FC<KillSwitchModalProps> = ({
  isOpen,
  onClose,
  targetProtocol,
  onConfirm,
}) => {
  const [loading, setLoading] = useState(false);
  const [confirmPhrase, setConfirmPhrase] = useState('');

  const handleExecute = async () => {
    if (confirmPhrase !== 'LOCKDOWN') return;
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`EMERGENCY OVERRIDE // ${targetProtocol}`}
      subtitle="Executing this action drops active node socket relays instantly."
    >
      <div className="space-y-4 font-mono text-xs">
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            This will suspend traffic across all active client instances. Type <strong>LOCKDOWN</strong> below to authorize.
          </p>
        </div>

        <input
          type="text"
          placeholder="LOCKDOWN"
          value={confirmPhrase}
          onChange={(e) => setConfirmPhrase(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-rose-500/30 text-white focus:outline-none focus:border-rose-500 text-xs"
        />

        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} className="w-1/2">
            Abort
          </Button>
          <Button
            variant="founder"
            disabled={confirmPhrase !== 'LOCKDOWN'}
            loading={loading}
            onClick={handleExecute}
            className="w-1/2"
          >
            Authorize Cut
          </Button>
        </div>
      </div>
    </Modal>
  );
};