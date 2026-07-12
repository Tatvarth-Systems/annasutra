/** Detects iOS/iPadOS WebKit (Safari and Chrome-for-iOS share the same engine), where forced blob downloads via the `download` attribute don't work. */
export const isIOSWebKit = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return (
    /iP(hone|od|ad)/.test(navigator.userAgent) ||
    (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
  );
};

/** Feature-detects Web Share API support for files, so a properly named file can be handed to the native share sheet (e.g. Save to Files) instead of losing the filename via a blob: URL navigation. */
export const canShareFiles = (): boolean => {
  if (
    typeof navigator === "undefined" ||
    !navigator.share ||
    !navigator.canShare
  ) {
    return false;
  }
  const probe = new File([""], "probe.pdf", { type: "application/pdf" });
  return navigator.canShare({ files: [probe] });
};
