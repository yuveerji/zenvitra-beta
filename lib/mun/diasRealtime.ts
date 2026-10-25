import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

export type DiasConnectionStatus = 'CONNECTING' | 'CONNECTED' | 'DISCONNECTED' | 'OFFLINE_LOCAL';

export interface DiasRealtimeCallbacks {
  onTimerSync?: (payload: {
    durationSec: number;
    remainingSec: number;
    isRunning: boolean;
    anchorEpochMs: number;
  }) => void;
  onQueueSync?: (queue: any[]) => void;
  onSpeakerSync?: (speaker: any) => void;
  onModeSync?: (mode: string) => void;
  onMotionSync?: (motions: any[]) => void;
  onGavelStrike?: (intensity?: number) => void;
  onStatusChange?: (status: DiasConnectionStatus) => void;
}

export class DiasRealtimeManager {
  private channel: RealtimeChannel | null = null;
  private sessionId: string;
  private callbacks: DiasRealtimeCallbacks;
  private status: DiasConnectionStatus = 'CONNECTING';

  constructor(sessionId: string, callbacks: DiasRealtimeCallbacks) {
    this.sessionId = sessionId.toUpperCase();
    this.callbacks = callbacks;
    this.init();
  }

  private init() {
    try {
      if (!supabase) {
        this.setStatus('OFFLINE_LOCAL');
        return;
      }

      this.setStatus('CONNECTING');
      const channelName = `dias_session_${this.sessionId}`;

      this.channel = supabase.channel(channelName, {
        config: {
          broadcast: { self: false },
        },
      });

      this.channel
        .on('broadcast', { event: 'TIMER_SYNC' }, ({ payload }) => {
          if (this.callbacks.onTimerSync && payload) {
            this.callbacks.onTimerSync(payload);
          }
        })
        .on('broadcast', { event: 'QUEUE_SYNC' }, ({ payload }) => {
          if (this.callbacks.onQueueSync && payload?.queue) {
            this.callbacks.onQueueSync(payload.queue);
          }
        })
        .on('broadcast', { event: 'SPEAKER_SYNC' }, ({ payload }) => {
          if (this.callbacks.onSpeakerSync && payload) {
            this.callbacks.onSpeakerSync(payload.speaker);
          }
        })
        .on('broadcast', { event: 'MODE_SYNC' }, ({ payload }) => {
          if (this.callbacks.onModeSync && payload?.mode) {
            this.callbacks.onModeSync(payload.mode);
          }
        })
        .on('broadcast', { event: 'MOTION_SYNC' }, ({ payload }) => {
          if (this.callbacks.onMotionSync && payload?.motions) {
            this.callbacks.onMotionSync(payload.motions);
          }
        })
        .on('broadcast', { event: 'GAVEL_STRIKE' }, ({ payload }) => {
          if (this.callbacks.onGavelStrike) {
            this.callbacks.onGavelStrike(payload?.intensity || 1.0);
          }
        })
        .subscribe((subStatus) => {
          if (subStatus === 'SUBSCRIBED') {
            this.setStatus('CONNECTED');
          } else if (subStatus === 'CLOSED' || subStatus === 'CHANNEL_ERROR') {
            this.setStatus('DISCONNECTED');
          }
        });
    } catch (err) {
      console.warn('Realtime init failed, using offline local state:', err);
      this.setStatus('OFFLINE_LOCAL');
    }
  }

  private setStatus(s: DiasConnectionStatus) {
    this.status = s;
    if (this.callbacks.onStatusChange) {
      this.callbacks.onStatusChange(s);
    }
  }

  public getStatus(): DiasConnectionStatus {
    return this.status;
  }

  // ─── Broadcasters (Chair Actions) ───

  public broadcastTimer(durationSec: number, remainingSec: number, isRunning: boolean) {
    if (!this.channel || this.status !== 'CONNECTED') return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'TIMER_SYNC',
        payload: {
          durationSec,
          remainingSec,
          isRunning,
          anchorEpochMs: Date.now(),
        },
      });
    } catch (e) {
      console.warn('Timer broadcast failed:', e);
    }
  }

  public broadcastQueue(queue: any[]) {
    if (!this.channel || this.status !== 'CONNECTED') return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'QUEUE_SYNC',
        payload: { queue },
      });
    } catch (e) {
      console.warn('Queue broadcast failed:', e);
    }
  }

  public broadcastSpeaker(speaker: any) {
    if (!this.channel || this.status !== 'CONNECTED') return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'SPEAKER_SYNC',
        payload: { speaker },
      });
    } catch (e) {
      console.warn('Speaker broadcast failed:', e);
    }
  }

  public broadcastMode(mode: string) {
    if (!this.channel || this.status !== 'CONNECTED') return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'MODE_SYNC',
        payload: { mode },
      });
    } catch (e) {
      console.warn('Mode broadcast failed:', e);
    }
  }

  public broadcastMotion(motions: any[]) {
    if (!this.channel || this.status !== 'CONNECTED') return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'MOTION_SYNC',
        payload: { motions },
      });
    } catch (e) {
      console.warn('Motion broadcast failed:', e);
    }
  }

  public broadcastGavel(intensity: number = 1.0) {
    if (!this.channel || this.status !== 'CONNECTED') return;
    try {
      this.channel.send({
        type: 'broadcast',
        event: 'GAVEL_STRIKE',
        payload: { intensity },
      });
    } catch (e) {
      console.warn('Gavel broadcast failed:', e);
    }
  }

  public destroy() {
    if (this.channel) {
      supabase.removeChannel(this.channel);
      this.channel = null;
    }
  }
}
