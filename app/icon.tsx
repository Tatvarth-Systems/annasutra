import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Generates the browser-tab/PWA icon: a brand-color square with an "A" monogram. */
const Icon = () => {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#c2410c",
        borderRadius: 96,
        color: "#fff",
        fontSize: 320,
        fontWeight: 700,
        fontFamily: "sans-serif",
      }}
    >
      A
    </div>,
    { ...size },
  );
};

export default Icon;
