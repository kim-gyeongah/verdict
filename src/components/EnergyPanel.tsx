"use client";

import EnergyBar from "./EnergyBar";
import type { EnergyProfile, EnergyDelta } from "@/types";

interface EnergyPanelProps {
  profile: EnergyProfile;
  delta: EnergyDelta | null;
  onReset: () => void;
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

export default function EnergyPanel({ profile, delta }: EnergyPanelProps) {
  return (
    <div
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
          ENergy
        </span>
        <SlashDecoration />
      </div>

      {/* Bars */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 30,
          padding: "33px 23px 46px 23px",
        }}
      >
        <EnergyBar label="SUBSTANCE" value={profile.substance} delta={delta?.substance} />
        <EnergyBar label="STYLE"     value={profile.style}     delta={delta?.style}     />
        <EnergyBar label="DELUSION"  value={profile.delusion}  delta={delta?.delusion}  />
      </div>
    </div>
  );
}
