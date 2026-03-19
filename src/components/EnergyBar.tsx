"use client";

import { useEffect, useState } from "react";

interface EnergyBarProps {
  label: "SUBSTANCE" | "STYLE" | "DELUSION";
  value: number;
  delta?: number | null;
}

// Substance/Delusion = lavender purple, Style = periwinkle blue
const SEGMENT_COLORS = {
  SUBSTANCE: { on: "#c79fe3",                   off: "rgba(199,159,227,0.25)" },
  STYLE:     { on: "#8e9ae7",                   off: "rgba(142,154,231,0.25)" },
  DELUSION:  { on: "#c79fe3",                   off: "rgba(199,159,227,0.25)" },
};

const LABEL_COLORS = {
  SUBSTANCE: "#dcbef1",
  STYLE:     "#b9c3ff",
  DELUSION:  "#dcbef1",
};

const SEGMENTS = 100;

export default function EnergyBar({ label, value, delta }: EnergyBarProps) {
  const [showDelta, setShowDelta] = useState(false);

  useEffect(() => {
    if (delta !== undefined && delta !== null && delta !== 0) {
      setShowDelta(true);
      const t = setTimeout(() => setShowDelta(false), 2500);
      return () => clearTimeout(t);
    }
  }, [delta]);

  const filledCount = Math.round((value / 100) * SEGMENTS);
  const colors = SEGMENT_COLORS[label];
  const sign = delta && delta > 0 ? "+" : "";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span
          className="text-[13px] font-semibold tracking-[-0.011em]"
          style={{ fontFamily: "var(--font-mono)", color: LABEL_COLORS[label] }}
        >
          {label.charAt(0) + label.slice(1).toLowerCase()}
        </span>
        <div className="flex items-center gap-2">
          {showDelta && delta !== null && delta !== undefined && (
            <span
              className="text-[11px] font-semibold"
              style={{
                fontFamily: "var(--font-mono)",
                color: delta > 0 ? "#b9c3ff" : "#e08080",
              }}
            >
              {sign}{delta}
            </span>
          )}
          <span
            className="text-[13px] font-semibold tracking-[-0.011em]"
            style={{ fontFamily: "var(--font-mono)", color: "#a77dc4" }}
          >
            {value}
          </span>
        </div>
      </div>

      {/* 100-segment bar */}
      <div className="flex gap-[1px]">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <div
            key={i}
            className="flex-1 h-[27px] transition-colors duration-300"
            style={{ background: i < filledCount ? colors.on : colors.off }}
          />
        ))}
      </div>
    </div>
  );
}
