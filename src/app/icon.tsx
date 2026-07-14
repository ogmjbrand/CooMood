import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#111111",
          borderRadius: "16px",
          color: "#C8A96A",
          fontSize: 34,
          fontFamily: "Georgia, serif",
        }}
      >
        CM
      </div>
    ),
    { ...size }
  );
}
