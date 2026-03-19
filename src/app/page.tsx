"use client";

import { useState, useEffect } from "react";
import InputPanel from "@/components/InputPanel";
import LoadingPanel from "@/components/LoadingPanel";
import ResultPanel from "@/components/ResultPanel";
import { useEnergyProfile } from "@/hooks/useEnergyProfile";
import { useArchive } from "@/hooks/useArchive";
import type { AppState, JudgeResponse, EnergyProfile } from "@/types";

// ASCII bar: 10 chars, | = filled (purple), . = empty (dark)
function AsciiBar({ value }: { value: number }) {
  const filled = Math.round((value / 100) * 10);
  const empty = 10 - filled;
  return (
    <span style={{ fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace", fontSize: 11, color: "#dc95ff", lineHeight: "17px" }}>
      {"["}
      {"|".repeat(filled)}
      <span style={{ color: "#353534" }}>{".".repeat(empty)}</span>
      {"]"}
    </span>
  );
}

// Bottom nav icons
function ManualIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="17" height="19" stroke="white" strokeWidth="0.8"/>
      <line x1="4" y1="6" x2="14" y2="6" stroke="white" strokeWidth="0.8"/>
      <line x1="4" y1="10" x2="14" y2="10" stroke="white" strokeWidth="0.8"/>
      <line x1="4" y1="14" x2="10" y2="14" stroke="white" strokeWidth="0.8"/>
    </svg>
  );
}

function ManualModal({ onClose }: { onClose: () => void }) {
  const STEPS = [
    { label: "INPUT", desc: "Type anything — a product, movie, idea, life choice, or purchase you're considering." },
    { label: "EXECUTE", desc: "Press ENTER. The system renders a verdict: SUBSTANCE, STYLE, or DELUSION." },
    { label: "SUBSTANCE", desc: "Means it has real merit. Nutritious for the mind or life. Score goes up." },
    { label: "STYLE", desc: "Aesthetic value, no depth. Not bad, just surface. Make of that what you will." },
    { label: "DELUSION", desc: "Self-deception. You already know. The system just confirms it." },
    { label: "SCORES", desc: "Each verdict shifts your three scores. They reflect your accumulated taste over time." },
    { label: "RESET", desc: "Clears all scores back to zero. The verdicts remain. You start fresh." },
  ];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        style={{
          background: "#1a1a2a",
          border: "1px solid #dc95ff",
          maxWidth: 520,
          width: "calc(100% - 48px)",
          padding: "32px",
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <p style={{ fontFamily: "var(--font-grotesk)", fontWeight: 700, fontSize: 10, color: "#dc95ff", letterSpacing: "4px", textTransform: "uppercase", marginBottom: 6 }}>
              VERDICT — MANUAL
            </p>
            <p style={{ fontFamily: "var(--font-grotesk)", fontWeight: 400, fontSize: 10, color: "#c6c6c6", letterSpacing: "1px", textTransform: "uppercase" }}>
              HOW THIS SYSTEM WORKS
            </p>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 4, lineHeight: 1 }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="1" y1="1" x2="13" y2="13" stroke="#dc95ff" strokeWidth="1.2"/>
              <line x1="13" y1="1" x2="1" y2="13" stroke="#dc95ff" strokeWidth="1.2"/>
            </svg>
          </button>
        </div>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {STEPS.map(({ label, desc }, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                gap: 20,
                paddingTop: 14,
                paddingBottom: 14,
                borderBottom: i < STEPS.length - 1 ? "1px solid rgba(71,71,71,0.3)" : "none",
              }}
            >
              <span style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 700,
                fontSize: 9,
                color: "#dc95ff",
                letterSpacing: "1px",
                textTransform: "uppercase",
                minWidth: 72,
                paddingTop: 2,
                flexShrink: 0,
              }}>
                {label}
              </span>
              <span style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 400,
                fontSize: 13,
                color: "#c6c6c6",
                lineHeight: "20px",
              }}>
                {desc}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
          <button
            onClick={onClose}
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 700,
              fontSize: 10,
              letterSpacing: "1px",
              textTransform: "uppercase",
              background: "#dc95ff",
              color: "#000",
              border: "none",
              padding: "8px 20px",
              cursor: "pointer",
            }}
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}

function ExecuteIcon({ dark }: { dark?: boolean }) {
  const color = dark ? "black" : "white";
  return (
    <svg width="11" height="18" viewBox="0 0 11 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 1L10 9L1 17V1Z" fill={color} stroke={color} strokeWidth="1"/>
    </svg>
  );
}

function ResetIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 4.5A8 8 0 1 0 17 10" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <path d="M17 4.5L17 8.5L13 8.5" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

const METRIC_LABELS: Array<{ label: string; key: keyof EnergyProfile }> = [
  { label: "SUBSTANCE", key: "substance" },
  { label: "STYLE",     key: "style" },
  { label: "DELUSION",  key: "delusion" },
];

type NavTab = "execute";

const LOADING_MESSAGES = [
  "Vibe checking...",
  "Analyzing intent...",
  "Detecting delusion...",
  "Weighing substance...",
  "Calibrating style sensors...",
  "Rendering judgment...",
];

const LOADING_GLYPHS = ["🧪", "🔨", "☔️", "⁉️", "✂︎", "😴", "🌻", "🥝", "🐩", "🦠"];

export default function Home() {
  const [appState, setAppState] = useState<AppState>("idle");
  const [input, setInput] = useState("");
  const [submittedInput, setSubmittedInput] = useState("");
  const [result, setResult] = useState<JudgeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [navTab, setNavTab] = useState<NavTab>("execute");
  const [showManual, setShowManual] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const [loadingGlyphIndex, setLoadingGlyphIndex] = useState(0);

  useEffect(() => {
    if (appState !== "loading") return;
    setLoadingMsgIndex(0);
    setLoadingGlyphIndex(0);
    const msgTimer = setInterval(() => setLoadingMsgIndex((i) => (i + 1) % LOADING_MESSAGES.length), 900);
    const glyphTimer = setInterval(() => setLoadingGlyphIndex((i) => (i + 1) % LOADING_GLYPHS.length), 450);
    return () => { clearInterval(msgTimer); clearInterval(glyphTimer); };
  }, [appState]);

  const { profile, lastDelta, updateProfile, resetProfile } = useEnergyProfile();
  const { entries, addEntry } = useArchive();

  async function handleJudge() {
    if (!input.trim() || appState === "loading") return;
    const submitted = input.trim();
    setSubmittedInput(submitted);
    setInput("");
    setError(null);
    setNavTab("execute");
    setAppState("loading");

    try {
      const res = await fetch("/api/judge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: submitted }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(err.error || "Judgment failed");
      }

      const data: JudgeResponse = await res.json();
      updateProfile(data.verdict);
      addEntry(submitted, data.verdict);
      setResult(data);
      setAppState("result");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setAppState("idle");
    }
  }

  function handleNavExecute() {
    setNavTab("execute");
  }

  function handleReset() {
    resetProfile();
  }

  const isExecuteActive = navTab === "execute";

  return (
    <div className="relative" style={{ minHeight: "100dvh", background: "#131313" }}>
      {showManual && <ManualModal onClose={() => setShowManual(false)} />}

      {/* Background grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(71,71,71,0.05) 2.5%, rgba(71,71,71,0) 2.5%), linear-gradient(180deg, rgba(71,71,71,0.05) 2.5%, rgba(71,71,71,0) 2.5%)",
        }}
      />

      {/* Subtle radial gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 35% 45%, rgba(85,0,130,0.08) 0%, transparent 60%)",
        }}
      />

      {/* ── Fixed top header ── */}
      <header
        className="fixed left-0 right-0 z-50 flex items-center justify-center"
        style={{
          top: 0,
          height: 60,
          background: "#131313",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-grotesk)",
            fontWeight: 700,
            fontSize: 20,
            color: "#ffffff",
            letterSpacing: "4px",
            textTransform: "uppercase",
          }}
        >
          VERDICT
        </span>
      </header>

      {/* ── Fixed metrics nav bar ── */}
      <nav
        className="fixed left-0 right-0 z-40 flex items-center justify-center"
        style={{
          top: 60,
          height: 36,
          background: "rgba(19,19,19,0.9)",
          backdropFilter: "blur(2px)",
          borderTop: "1px solid rgba(71,71,71,0.2)",
          borderBottom: "1px solid rgba(71,71,71,0.2)",
          gap: 48,
        }}
      >
        {METRIC_LABELS.map(({ label, key }) => (
          <div key={key} className="flex items-center" style={{ gap: 16 }}>
            <span
              style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 500,
                fontSize: 12,
                color: "#c6c6c6",
                letterSpacing: "1px",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
            <div className="flex items-center" style={{ gap: 8 }}>
              <AsciiBar value={profile[key]} />
              <span
                style={{
                  fontFamily: "var(--font-mono), 'IBM Plex Mono', monospace",
                  fontWeight: 500,
                  fontSize: 12,
                  color: "#dc95ff",
                  lineHeight: "17px",
                }}
              >
                {profile[key]}%
              </span>
            </div>
          </div>
        ))}
      </nav>

      {/* ── Corner accents ── */}
      <div className="fixed pointer-events-none" style={{ top: 96, left: 24, zIndex: 30 }}>
        <div style={{ width: 48, height: 1, background: "rgba(71,71,71,0.3)" }} />
        <div style={{ width: 1, height: 48, background: "rgba(71,71,71,0.3)" }} />
      </div>
      <div className="fixed pointer-events-none" style={{ bottom: 96, right: 24, zIndex: 30 }}>
        <div style={{ width: 48, height: 1, background: "rgba(71,71,71,0.3)", marginLeft: "auto" }} />
        <div style={{ width: 1, height: 48, background: "rgba(71,71,71,0.3)", marginLeft: "auto" }} />
      </div>

      {/* ── Main content canvas ── */}
      <main
        className="relative flex flex-col items-center justify-start"
        style={{
          minHeight: "100dvh",
          paddingTop: "calc(96px + (100dvh - 96px - 56px) * 0.28 - 24px)",
          paddingBottom: 56 + 40,
          paddingLeft: 24,
          paddingRight: 24,
        }}
      >
        {/* Purple blur blob — fixed to viewport center */}
        <div
          className="fixed pointer-events-none glow-breathe"
          style={{
            top: "50%",
            left: "50%",
            width: 600,
            height: 600,
            background: "rgba(85,77,255,0.1)",
            filter: "blur(60px)",
            borderRadius: "50%",
            zIndex: 0,
          }}
        />

        {/* ── Execute tab ── */}
        {isExecuteActive && (
          <div className="relative w-full" style={{ maxWidth: 768, paddingLeft: 40 }}>

            {/* Metadata above input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 12 }}>
              <p
                style={{
                  fontFamily: "var(--font-grotesk)",
                  fontWeight: 700,
                  fontSize: 14,
                  color: "#e4e4e4",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <line x1="4.5" y1="0" x2="4.5" y2="9" stroke="#a77dc4" strokeWidth="1"/>
                  <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="#a77dc4" strokeWidth="1"/>
                  <line x1="0.96" y1="0.96" x2="8.04" y2="8.04" stroke="#a77dc4" strokeWidth="1"/>
                  <line x1="8.04" y1="0.96" x2="0.96" y2="8.04" stroke="#a77dc4" strokeWidth="1"/>
                </svg>
                Substance, style or delusion?
              </p>
              <p
                style={{
                  fontFamily: "var(--font-grotesk)",
                  fontWeight: 400,
                  fontSize: 12,
                  color: "#c6c6c6",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  lineHeight: "18px",
                  maxWidth: 544,
                }}
              >
                Thinking of buying something? Or you just want to get your taste judged by arrogant AI that knows nothing about you?
              </p>
            </div>

            {/* Input box */}
            <InputPanel
              input={input}
              onChange={setInput}
              onSubmit={handleJudge}
              error={error}
              disabled={appState === "loading"}
            />

            {/* ENCRYPTED_SESSION_LIVE */}
            <p
              style={{
                fontFamily: "var(--font-grotesk)",
                fontWeight: 400,
                fontSize: 10,
                color: "#dc95ff",
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginTop: 12,
              }}
            >
              {/* JUDGE_ON_DUTY:CLAUDE */}
            </p>

            {/* Echo line + result/loading — shown after first submit */}
            {(appState === "loading" || appState === "result") && submittedInput && (
              <div style={{ marginTop: 32 }}>
                {/* > [submitted text] echo */}
                <div
                  className="relative"
                  style={{ marginBottom: 16 }}
                >
                  <div
                    className="absolute flex items-center"
                    style={{
                      visibility: "hidden",
                      left: -28,
                      top: 0,
                      bottom: 0,
                      fontFamily: "var(--font-grotesk)",
                      fontWeight: 700,
                      fontSize: 24,
                      color: "#dc95ff",
                      lineHeight: "32px",
                    }}
                  >
                    {">"}
                  </div>
                  <p
                    style={{
                      fontFamily: "var(--font-grotesk)",
                      fontWeight: 500,
                      fontSize: 14,
                      color: appState === "loading" ? "#dc95ff" : "#e5e2e1",
                      lineHeight: "22.75px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                    }}
                  >
                    {appState === "loading" ? (
                      <span style={{ color: "#a77dc4", fontSize: 15, lineHeight: 1, flexShrink: 0 }}>
                        {LOADING_GLYPHS[loadingGlyphIndex]}
                      </span>
                    ) : (
                      <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                        <line x1="4.5" y1="0" x2="4.5" y2="9" stroke="#a77dc4" strokeWidth="1"/>
                        <line x1="0" y1="4.5" x2="9" y2="4.5" stroke="#a77dc4" strokeWidth="1"/>
                        <line x1="0.96" y1="0.96" x2="8.04" y2="8.04" stroke="#a77dc4" strokeWidth="1"/>
                        <line x1="8.04" y1="0.96" x2="0.96" y2="8.04" stroke="#a77dc4" strokeWidth="1"/>
                      </svg>
                    )}
                    {appState === "loading"
                      ? LOADING_MESSAGES[loadingMsgIndex]
                      : <>Verdict for &ldquo;{submittedInput}&rdquo;</>}
                  </p>
                </div>

                {/* Loading or result panel */}
                {appState === "loading" && <LoadingPanel />}
                {appState === "result" && result && (
                  <ResultPanel
                    result={result}
                    delta={lastDelta}
                    entryCount={entries.length}
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Watermark — bottom right */}
        <div
          className="absolute flex flex-col items-end"
          style={{ bottom: 96, right: 48, gap: 8, pointerEvents: "none" }}
        >
          <p
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 700,
              fontSize: 64,
              color: "#616161",
              letterSpacing: "-3.2px",
              lineHeight: "64px",
              textAlign: "right",
              opacity: 0.4,
            }}
          >
            VERDICT_ALPHA_01
          </p>
          <p
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 400,
              fontSize: 10,
              color: "#777",
              letterSpacing: "5px",
              textTransform: "uppercase",
              textAlign: "right",
            }}
          >
            PROPRIETARY ARCHITECTURE / UNRESTRICTED ACCESS
          </p>
        </div>
      </main>

      {/* ── Fixed bottom nav ── */}
      <nav
        className="fixed left-0 right-0 z-50 flex items-center justify-around"
        style={{
          bottom: 0,
          background: "#131313",
          boxShadow: "0px 0px 20px 0px rgba(220,149,255,0.15)",
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <button
          onClick={() => setShowManual(true)}
          className="flex flex-col items-center justify-center"
          style={{ padding: 8, gap: 4, background: "none", border: "none", cursor: "pointer" }}
        >
          <ManualIcon />
          <span
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 400,
              fontSize: 10,
              color: "white",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            MANUAL
          </span>
        </button>

        <button
          onClick={handleNavExecute}
          className="flex flex-col items-center justify-center"
          style={{
            padding: 8,
            gap: 4,
            background: isExecuteActive ? "#dc95ff" : "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          <ExecuteIcon dark={isExecuteActive} />
          <span
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: isExecuteActive ? 700 : 400,
              fontSize: 10,
              color: isExecuteActive ? "black" : "white",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            EXECUTE
          </span>
        </button>

        <button
          onClick={handleReset}
          className="flex flex-col items-center justify-center"
          style={{ padding: 8, gap: 4, background: "none", border: "none", cursor: "pointer" }}
        >
          <ResetIcon />
          <span
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 400,
              fontSize: 10,
              color: "white",
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            RESET
          </span>
        </button>
      </nav>
    </div>
  );
}
