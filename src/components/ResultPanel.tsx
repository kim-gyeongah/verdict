"use client";

import type { JudgeResponse } from "@/types";
import type { EnergyDelta } from "@/types";

interface ResultPanelProps {
  result: JudgeResponse;
  delta: EnergyDelta | null;
  entryCount: number;
}

const DELTA_ROWS: Array<{ label: string; key: keyof EnergyDelta }> = [
  { label: "SUBSTANCE", key: "substance" },
  { label: "STYLE",     key: "style" },
  { label: "DELUSION",  key: "delusion" },
];

function formatDelta(n: number): string {
  return n > 0 ? `+${n}` : String(n);
}

export default function ResultPanel({ result, delta, entryCount }: ResultPanelProps) {
  const counter = String(entryCount).padStart(3, "0");

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: 48,
      }}
    >
      {/* Left: Verdict card */}
      <div
        style={{
          background: "#1f1f2e",
          padding: 24,
          display: "flex",
          flexDirection: "column",
          gap: 7,
          position: "relative",
        }}
      >
        {/* Verdict label */}
        <span
          style={{
            fontFamily: "var(--font-grotesk)",
            fontWeight: 700,
            fontSize: 20,
            color: "#dc95ff",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          {result.verdict}
        </span>

        {/* Reason */}
        <p
          style={{
            fontFamily: "var(--font-grotesk)",
            fontWeight: 500,
            fontSize: 14,
            color: "#e5e2e1",
            lineHeight: "22.75px",
          }}
        >
          {result.reason}
        </p>

        {/* Index counter — top right */}
        <div style={{ position: "absolute", top: 8, right: 8, padding: 8 }}>
          <p
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 400,
              fontSize: 9,
              color: "#353534",
              lineHeight: "13.5px",
            }}
          >
            {counter}
          </p>
        </div>
      </div>

      {/* Right: Metric delta rows */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 16,
          paddingTop: 24,
          paddingBottom: 35,
        }}
      >
        {DELTA_ROWS.map(({ label, key }) => {
          const d = delta ? delta[key] : 0;
          return (
            <div
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(71,71,71,0.2)",
                paddingBottom: 9,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-grotesk)",
                  fontWeight: 400,
                  fontSize: 11,
                  color: "#c6c6c6",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-grotesk)",
                  fontWeight: 400,
                  fontSize: 10,
                  color: "#dc95ff",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  textAlign: "right",
                }}
              >
                {formatDelta(d)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
