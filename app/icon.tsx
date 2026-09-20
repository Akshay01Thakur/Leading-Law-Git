import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          // The logo's navy, with its gold rule reduced to a bar along the
          // bottom — the one part of the mark that still reads at 32px.
          background: "#02407d",
          color: "#ffffff",
          fontSize: 16,
          fontWeight: 700,
          borderRadius: 6,
        }}
      >
        <div style={{ display: "flex", lineHeight: 1 }}>LL</div>
        <div style={{ display: "flex", width: 16, height: 2, background: "#f5bf55", marginTop: 4 }} />
      </div>
    ),
    size,
  );
}
