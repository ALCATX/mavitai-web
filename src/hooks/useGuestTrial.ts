'use client';

import { useEffect, useState } from 'react';

export const GUEST_TRIAL_SECONDS = 7200;
export const GUEST_TRIAL_STORAGE_KEY = 'mavitai_guest_start';

export const MAVICOINS_GUEST_NOTICE =
  'A pontuação em Mavicoins é exclusiva para contas registadas.';

export function formatGuestRemaining(totalSeconds: number): string {
  const safe = Math.max(0, totalSeconds);
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const seconds = safe % 60;
  return [hours, minutes, seconds].map((part) => String(part).padStart(2, '0')).join(':');
}

function readOrCreateGuestStart(): number {
  const raw = window.localStorage.getItem(GUEST_TRIAL_STORAGE_KEY);
  const parsed = raw ? Number(raw) : NaN;
  if (!raw || !Number.isFinite(parsed) || parsed <= 0) {
    const now = Date.now();
    window.localStorage.setItem(GUEST_TRIAL_STORAGE_KEY, String(now));
    return now;
  }
  return parsed;
}

export function useGuestTrial(isAuthenticated: boolean) {
  const [remainingSeconds, setRemainingSeconds] = useState(GUEST_TRIAL_SECONDS);
  const [isTrialExpired, setIsTrialExpired] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      window.localStorage.removeItem(GUEST_TRIAL_STORAGE_KEY);
      setRemainingSeconds(GUEST_TRIAL_SECONDS);
      setIsTrialExpired(false);
      return;
    }

    const startedAt = readOrCreateGuestStart();

    const tick = () => {
      const elapsed = Math.floor((Date.now() - startedAt) / 1000);
      const remaining = Math.max(0, GUEST_TRIAL_SECONDS - elapsed);
      setRemainingSeconds(remaining);
      setIsTrialExpired(remaining <= 0);
    };

    tick();
    const intervalId = window.setInterval(tick, 1000);
    return () => window.clearInterval(intervalId);
  }, [isAuthenticated]);

  return { remainingSeconds, isTrialExpired };
}
