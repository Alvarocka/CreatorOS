import {
  applyToolbarAction,
  extractTimestampMarkers,
  formatSecondsToClock,
  parseTags,
} from './studio-format';

describe('studio-format', () => {
  it('formats seconds to MM:SS', () => {
    expect(formatSecondsToClock(135)).toBe('02:15');
    expect(formatSecondsToClock(5)).toBe('00:05');
  });

  it('inserts a timestamp marker at the cursor', () => {
    const result = applyToolbarAction({
      action: 'timestamp',
      currentSeconds: 135,
      selection: { end: 5, start: 5 },
      value: 'Hola mundo',
    });

    expect(result.value).toContain('──────────── 02:15 ────────────');
  });

  it('extracts timestamp markers from note text', () => {
    const markers = extractTimestampMarkers(
      'Intro\n──────────── 02:15 ────────────\nbeat drop\n──────────── 03:40 ────────────'
    );

    expect(markers).toHaveLength(2);
    expect(markers[0]?.seconds).toBe(135);
    expect(markers[1]?.label).toBe('03:40');
  });

  it('parses comma separated tags cleanly', () => {
    expect(parseTags('letra, beat-drop, letra,  visual  ')).toEqual([
      'letra',
      'beat-drop',
      'visual',
    ]);
  });
});
