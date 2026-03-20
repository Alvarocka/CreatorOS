const DEFAULT_BAR_COUNT = 56;

export async function computeWaveformData(uri: string, barCount = DEFAULT_BAR_COUNT) {
  try {
    return buildSeededWaveform(uri, barCount);
  } catch {
    return buildPlaceholderWaveform(barCount);
  }
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }

  return hash || 1;
}

export function buildSeededWaveform(seedInput: string, barCount = DEFAULT_BAR_COUNT) {
  let seed = hashString(seedInput);

  return Array.from({ length: barCount }, (_, index) => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    const normalized = seed / 0xffffffff;
    const wave = Math.sin(index / 3.5 + normalized * Math.PI) * 0.18;
    const curve = Math.cos(index / 7.2 + normalized * 2.4) * 0.1;
    const base = 0.42 + wave + curve + normalized * 0.16;
    return Math.max(0.18, Math.min(0.92, base));
  });
}

export function buildPlaceholderWaveform(barCount = DEFAULT_BAR_COUNT) {
  return Array.from({ length: barCount }, (_, index) => {
    const wave = Math.sin(index / 4.4) * 0.18 + Math.cos(index / 8.5) * 0.14 + 0.38;
    return Math.max(0.18, Math.min(0.92, wave));
  });
}
