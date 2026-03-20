export function isDirectVideoFile(url: string) {
  return /\.(mp4|webm|ogg|mov)$/i.test(url.split("?")[0] || "");
}

export function isSoraShareUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.hostname.toLowerCase().includes("sora");
  } catch {
    return false;
  }
}

export function getEmbeddableVideo(url: string) {
  if (isDirectVideoFile(url)) {
    return {
      provider: "direct",
      src: url,
      type: "video" as const
    };
  }

  if (isSoraShareUrl(url)) {
    return {
      provider: "sora",
      src: url,
      type: "iframe" as const
    };
  }

  return null;
}
