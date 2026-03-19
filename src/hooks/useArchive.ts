"use client";

import { useState, useEffect } from "react";
import type { Verdict, ArchiveEntry } from "@/types";

const STORAGE_KEY = "judgeArchive";
const MAX_ENTRIES = 20;

export function useArchive() {
  const [entries, setEntries] = useState<ArchiveEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setEntries(JSON.parse(stored));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  function addEntry(input: string, verdict: Verdict) {
    const next = [{ id: Date.now(), input, verdict }, ...entries].slice(0, MAX_ENTRIES);
    setEntries(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {}
  }

  function clearArchive() {
    setEntries([]);
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
  }

  return { entries, addEntry, clearArchive };
}
