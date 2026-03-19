"use client";

import type { ArchiveEntry } from "@/types";

interface ArchivePanelProps {
  entries: ArchiveEntry[];
  onClear: () => void;
}

function SlashDecoration() {
  return (
    <div className="flex items-center gap-[2px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 1,
            transform: "rotate(120deg)",
            background: "linear-gradient(90deg, #a77dc4 0%, #a7b2f5 100%)",
          }}
        />
      ))}
    </div>
  );
}

export default function ArchivePanel({ entries, onClear }: ArchivePanelProps) {
  const shown = entries.slice(0, 7);

  return (
    <div
      className="flex flex-col flex-1 min-h-0"
      style={{
        background: "#1a1f35",
        border: "1px solid #8e9ae7",
        boxShadow: "0px 2px 27.8px 0px rgba(131,129,209,0.3)",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "#0c1020",
          height: 52,
          borderBottom: "1px solid #8e9ae7",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 23px",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-notable), sans-serif",
            fontSize: 19,
            color: "#dcbef1",
            letterSpacing: "-0.011em",
            lineHeight: 1,
          }}
        >
          ARchive
        </span>
        <SlashDecoration />
      </div>

      {/* Count + list */}
      <div
        className="flex flex-col flex-1 overflow-hidden"
        style={{ padding: "33px 23px 46px 23px", gap: 12 }}
      >
        <span
          className="text-[13px] font-semibold tracking-[-0.011em] shrink-0"
          style={{ fontFamily: "var(--font-mono)", color: "#dcbef1" }}
        >
          {entries.length} verdicts total
        </span>

        <div className="flex flex-col gap-2.5 overflow-hidden">
          {shown.length === 0 && (
            <span
              className="text-[12px]"
              style={{ fontFamily: "var(--font-mono)", color: "#dcbef1", opacity: 0.3 }}
            >
              No verdicts yet.
            </span>
          )}
          {shown.map((entry) => (
            <p
              key={entry.id}
              className="text-[13px] leading-[1.5] tracking-[-0.011em]"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              <span style={{ color: "#a77dc4" }}>↪ </span>
              <span
                style={{
                  color: "#b9c3ff",
                  textDecoration: "underline",
                  textDecorationStyle: "solid",
                  textUnderlineOffset: "2px",
                  }}
              >
                &ldquo;{entry.input}&rdquo;
              </span>
            </p>
          ))}
          {entries.length > 7 && (
            <p
              className="text-[13px] leading-[1.5]"
              style={{ fontFamily: "var(--font-mono)", color: "#a77dc4" }}
            >
              ...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
