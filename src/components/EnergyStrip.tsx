"use client";

import EnergyBar from "./EnergyBar";
import type { EnergyProfile, EnergyDelta } from "@/types";

interface EnergyStripProps {
  profile: EnergyProfile;
  delta: EnergyDelta | null;
}

export default function EnergyStrip({ profile, delta }: EnergyStripProps) {
  return (
    <div className="panel border-t-0 border-l-0 border-r-0 border-b">
      <div className="panel-header">
        <span>ENERGY PROFILE</span>
        <span style={{ color: "rgba(7,9,14,0.5)", fontSize: "9px" }}>SSD-v1.0</span>
      </div>
      <div className="flex gap-6 px-5 py-3 max-w-5xl mx-auto">
        <EnergyBar label="SUBSTANCE" value={profile.substance} delta={delta?.substance} />
        <EnergyBar label="STYLE"     value={profile.style}     delta={delta?.style}     />
        <EnergyBar label="DELUSION"  value={profile.delusion}  delta={delta?.delusion}  />
      </div>
    </div>
  );
}
