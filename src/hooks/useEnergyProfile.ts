"use client";

import { useState, useEffect } from "react";
import { applyVerdict, DEFAULT_PROFILE } from "@/lib/energyLogic";
import type { EnergyProfile, EnergyDelta, Verdict } from "@/types";

const STORAGE_KEY = "energyProfile";

export function useEnergyProfile() {
  const [profile, setProfile] = useState<EnergyProfile>(DEFAULT_PROFILE);
  const [lastDelta, setLastDelta] = useState<EnergyDelta | null>(null);

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as EnergyProfile;
        setProfile(parsed);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function updateProfile(verdict: Verdict): EnergyDelta {
    const { next, delta } = applyVerdict(profile, verdict);
    setProfile(next);
    setLastDelta(delta);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // Storage might be full or unavailable
    }
    return delta;
  }

  function resetProfile() {
    setProfile(DEFAULT_PROFILE);
    setLastDelta(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return { profile, lastDelta, updateProfile, resetProfile };
}
