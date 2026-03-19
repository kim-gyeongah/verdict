import type { Verdict, EnergyProfile, EnergyDelta } from "@/types";

export const DEFAULT_PROFILE: EnergyProfile = {
  substance: 0,
  style: 0,
  delusion: 0,
};

const DELTA_MAP: Record<Verdict, EnergyDelta> = {
  STYLE:     { style: +10, substance: -5,  delusion: +2  },
  SUBSTANCE: { substance: +10, style: -3,  delusion: -2  },
  DELUSION:  { delusion: +12, substance: -6, style: -3   },
};

function clamp(v: number): number {
  return Math.max(-100, Math.min(100, Math.round(v)));
}

export function applyVerdict(
  profile: EnergyProfile,
  verdict: Verdict
): { next: EnergyProfile; delta: EnergyDelta } {
  const delta = DELTA_MAP[verdict];
  const next: EnergyProfile = {
    substance: clamp(profile.substance + delta.substance),
    style:     clamp(profile.style     + delta.style),
    delusion:  clamp(profile.delusion  + delta.delusion),
  };
  return { next, delta };
}
