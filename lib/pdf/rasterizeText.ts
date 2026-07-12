const CANVAS_FONT_FAMILY = "NotoSansDevanagariPdf";
const RASTER_SCALE = 4;

let fontLoadPromise: Promise<void> | null = null;

/** Loads the embedded Devanagari font into the browser's font registry, once, for canvas rasterization. */
export const ensureCanvasFontLoaded = (): Promise<void> => {
  if (!fontLoadPromise) {
    fontLoadPromise = (async () => {
      const { NOTO_SANS_DEVANAGARI_REGULAR, NOTO_SANS_DEVANAGARI_BOLD } =
        await import("@/lib/pdf/fonts/notoSansDevanagari");
      const regular = new FontFace(
        CANVAS_FONT_FAMILY,
        `url(data:font/ttf;base64,${NOTO_SANS_DEVANAGARI_REGULAR})`,
        { weight: "normal" },
      );
      const bold = new FontFace(
        CANVAS_FONT_FAMILY,
        `url(data:font/ttf;base64,${NOTO_SANS_DEVANAGARI_BOLD})`,
        { weight: "bold" },
      );
      await Promise.all([regular.load(), bold.load()]);
      document.fonts.add(regular);
      document.fonts.add(bold);
    })();
  }
  return fontLoadPromise;
};

export type RasterizedText = {
  dataUrl: string;
  widthPt: number;
  heightPt: number;
};

/** Rasterizes text on an offscreen canvas so complex scripts (e.g. Devanagari) get correct browser text shaping — jsPDF's vector text renderer has no OpenType shaping engine and misplaces matras/conjuncts. */
export const rasterizeText = (
  text: string,
  fontSizePt: number,
  weight: "normal" | "bold",
  colorRgb: [number, number, number],
): RasterizedText => {
  const fontPx = fontSizePt * RASTER_SCALE;
  const font = `${weight === "bold" ? "bold " : ""}${fontPx}px ${CANVAS_FONT_FAMILY}`;

  const probeCtx = document
    .createElement("canvas")
    .getContext("2d") as CanvasRenderingContext2D;
  probeCtx.font = font;
  const widthPx = Math.max(1, Math.ceil(probeCtx.measureText(text).width));
  const heightPx = Math.ceil(fontPx * 1.5);

  const canvas = document.createElement("canvas");
  canvas.width = widthPx;
  canvas.height = heightPx;
  const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
  ctx.font = font;
  ctx.fillStyle = `rgb(${colorRgb[0]}, ${colorRgb[1]}, ${colorRgb[2]})`;
  ctx.textBaseline = "alphabetic";
  ctx.fillText(text, 0, heightPx * 0.72);

  return {
    dataUrl: canvas.toDataURL("image/png"),
    widthPt: widthPx / RASTER_SCALE,
    heightPt: heightPx / RASTER_SCALE,
  };
};
