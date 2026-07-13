import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Generates the iOS home-screen icon: a brand-color square with an "A" monogram. */
const AppleIcon = () => {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#c2410c",
        color: "#fff",
        fontSize: 110,
        fontWeight: 700,
        fontFamily: "sans-serif",
      }}
    >
      A
    </div>,
    { ...size },
  );
};

export default AppleIcon;
