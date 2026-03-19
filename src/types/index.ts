export type Verdict = "STYLE" | "SUBSTANCE" | "DELUSION";

export type AppState = "idle" | "loading" | "result";

export interface EnergyProfile {
  substance: number;
  style: number;
  delusion: number;
}

export interface EnergyDelta {
  substance: number;
  style: number;
  delusion: number;
}

export interface JudgeResponse {
  label: string;
  verdict: Verdict;
  score: number;
  reason: string;
}

export interface ArchiveEntry {
  id: number;
  input: string;
  verdict: Verdict;
}
