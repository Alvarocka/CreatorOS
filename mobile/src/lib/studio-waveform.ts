import { File } from 'expo-file-system';

const DEFAULT_BAR_COUNT = 56;

export async function computeWaveformData(uri: string, barCount = DEFAULT_BAR_COUNT) {
  try {
    const file = new File(uri);
    const bytes = await file.bytes();

    if (!bytes.length) {
      return buildPlaceholderWaveform(barCount);
    }

    const step = Math.max(1, Math.floor(bytes.length / barCount));
    const values: number[] = [];

    for (let index = 0; index < barCount; index += 1) {
      const start = index * step;
      const end = Math.min(bytes.length, start + step);

      let sum = 0;
      let samples = 0;
      const sampleStep = Math.max(1, Math.floor(step / 28));

      for (let cursor = start; cursor < end; cursor += sampleStep) {
        sum += Math.abs(bytes[cursor] - 128) / 128;
        samples += 1;
      }

      values.push(samples ? sum / samples : 0.15);
    }

    const peak = Math.max(...values, 0.25);
    return values.map((value) => Math.max(0.16, Math.min(1, value / peak)));
  } catch {
    return buildPlaceholderWaveform(barCount);
  }
}

export function buildPlaceholderWaveform(barCount = DEFAULT_BAR_COUNT) {
  return Array.from({ length: barCount }, (_, index) => {
    const wave = Math.sin(index / 4.4) * 0.18 + Math.cos(index / 8.5) * 0.14 + 0.38;
    return Math.max(0.18, Math.min(0.92, wave));
  });
}
