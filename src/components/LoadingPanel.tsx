"use client";

export default function LoadingPanel() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        columnGap: 48,
      }}
    >
      <div
        style={{
          background: "#1f1f2e",
          minHeight: 87,
        }}
      />
      <div />
    </div>
  );
}
