"use client";

interface SideRailProps {
  sessionCount: number;
  onReset: () => void;
}

export default function SideRail({ sessionCount, onReset }: SideRailProps) {
  return (
    <div
      className="w-44 shrink-0 flex flex-col"
      style={{ background: "#0a0d14", borderRight: "1px solid rgba(200,160,0,0.2)" }}
    >
      <div className="panel-header">
        <span>SYS</span>
      </div>

      <div className="flex flex-col gap-4 px-4 py-4 flex-1">
        {/* App name */}
        <div className="display-field px-3 py-2.5">
          <p className="font-mono text-[8px] tracking-[0.18em] text-[#4a4a3a] mb-1">SYSTEM</p>
          <p className="font-mono text-[10px] font-bold text-[#c8a000] leading-snug tracking-wider">
            SUBSTANCE<br />STYLE<br />DELUSION
          </p>
        </div>

        {/* Session count */}
        <div className="display-field px-3 py-2.5">
          <p className="font-mono text-[8px] tracking-[0.18em] text-[#4a4a3a] mb-1">SESSION</p>
          <p className="font-mono text-3xl font-black text-[#c8a000] leading-none">{sessionCount}</p>
          <p className="font-mono text-[8px] text-[#4a4a3a] mt-0.5 tracking-widest">JUDGMENTS</p>
        </div>

        {/* Status */}
        <div className="display-field px-3 py-2.5">
          <p className="font-mono text-[8px] tracking-[0.18em] text-[#4a4a3a] mb-1">STATUS</p>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00cc66]" style={{ boxShadow: "0 0 4px #00cc66" }} />
            <p className="font-mono text-[9px] text-[#00cc66] font-bold tracking-widest">ONLINE</p>
          </div>
        </div>

        <div className="flex-1" />

        <button
          onClick={onReset}
          className="btn-retro w-full"
          style={{ borderColor: "#ff4040", color: "#ff4040" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#ff4040";
            (e.currentTarget as HTMLButtonElement).style.color = "#07090e";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#ff4040";
          }}
        >
          RESET
        </button>
      </div>
    </div>
  );
}
