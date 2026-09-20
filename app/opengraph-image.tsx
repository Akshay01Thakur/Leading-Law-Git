import { ImageResponse } from "next/og";

export const alt = "Leading Law — plain-language legal answers for India";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #0f2a46 0%, #1c4470 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 30, letterSpacing: 4, opacity: 0.75, textTransform: "uppercase" }}>
          Leading Law
        </div>
        <div style={{ fontSize: 74, fontWeight: 700, lineHeight: 1.15, marginTop: 24 }}>
          Plain-language legal answers for India
        </div>
        <div style={{ fontSize: 30, opacity: 0.8, marginTop: 32 }}>
          Family · Property · Criminal · Cyber fraud · Consumer · Employment
        </div>
      </div>
    ),
    size,
  );
}
