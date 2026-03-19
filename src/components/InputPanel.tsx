"use client";

import { useEffect, useRef } from "react";

interface InputPanelProps {
  input: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
  error: string | null;
  disabled?: boolean;
}

export default function InputPanel({ input, onChange, onSubmit, error, disabled }: InputPanelProps) {
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    hiddenInputRef.current?.focus();
  }, []);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && input.trim() && !disabled) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Input box — > is absolutely positioned at left: -28px (outside box) */}
      <div className="relative">
        {/* > prompt — floats in the left margin, does not affect layout */}
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

        {/* Input box */}
        <div
          className="cursor-text overflow-hidden"
          style={{
            border: "1px solid #dc95ff",
            paddingTop: 25,
            paddingBottom: 27,
            paddingLeft: 17,
            paddingRight: 17,
          }}
          onClick={() => hiddenInputRef.current?.focus()}
        >
          {/* Hidden real input */}
          <input
            ref={hiddenInputRef}
            type="text"
            value={input}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={500}
            className="absolute opacity-0 pointer-events-none w-px h-px"
            style={{ top: -9999, left: -9999 }}
            aria-label="Enter anything to judge"
          />

          {/* Display: inline cursor tracks position in text */}
          <div
            style={{
              fontFamily: "var(--font-grotesk)",
              fontWeight: 700,
              fontSize: 24,
              letterSpacing: "-0.6px",
              textTransform: "uppercase",
              lineHeight: "32px",
              minHeight: 32,
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              flexWrap: "nowrap",
            }}
          >
            {input ? (
              <>
                <span style={{ color: "#e4e4e4" }}>{input}</span>
                <span
                  className="cursor-blink"
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 28,
                    background: "#dc95ff",
                    flexShrink: 0,
                    marginLeft: 3,
                    verticalAlign: "middle",
                  }}
                />
              </>
            ) : (
              <>
                <span
                  className="cursor-blink"
                  style={{
                    display: "inline-block",
                    width: 14,
                    height: 28,
                    background: "#dc95ff",
                    flexShrink: 0,
                    marginRight: 3,
                    verticalAlign: "middle",
                  }}
                />
                <span style={{ color: "#684F74" }}>Product, ideas, life choices...</span>
              </>
            )}
          </div>
        </div>
      </div>

      {error && (
        <p
          style={{
            fontFamily: "var(--font-grotesk)",
            fontSize: 11,
            color: "#e08080",
            letterSpacing: "0.5px",
          }}
        >
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
