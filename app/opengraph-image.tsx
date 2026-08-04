import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Generates the social-share preview image: brand-color background with wordmark and tagline. */
const OpengraphImage = () => {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#c2410c",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 160,
          height: 160,
          borderRadius: 40,
          background: "#fff",
          color: "#c2410c",
          fontSize: 96,
          fontWeight: 700,
          marginBottom: 40,
        }}
      >
        A
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        AnnaSutra
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 32,
          color: "#ffedd5",
          marginTop: 16,
        }}
      >
        Digital Platform for Catering Services
      </div>
    </div>,
    { ...size },
  );
};

export default OpengraphImage;
