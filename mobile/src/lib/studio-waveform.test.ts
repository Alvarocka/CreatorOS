import { buildSeededWaveform, buildPlaceholderWaveform } from './studio-waveform';

describe('studio-waveform', () => {
  it('builds a deterministic waveform from a seed', () => {
    const first = buildSeededWaveform('file:///demo/audio.m4a', 12);
    const second = buildSeededWaveform('file:///demo/audio.m4a', 12);

    expect(first).toEqual(second);
    expect(first).toHaveLength(12);
  });

  it('keeps waveform values within safe UI bounds', () => {
    const values = buildPlaceholderWaveform(24);

    expect(values.every((value) => value >= 0.18 && value <= 0.92)).toBe(true);
  });
});
