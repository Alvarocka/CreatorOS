import { useMemo, useState } from 'react';
import type { GestureResponderEvent } from 'react-native';
import { LayoutChangeEvent, Pressable, StyleSheet, View } from 'react-native';

import { buildPlaceholderWaveform } from '@/src/lib/studio-waveform';
import { creatorTheme } from '@/src/lib/theme';

export function WaveformTimeline({
  currentTime,
  duration,
  onSeek,
  waveformData,
}: {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  waveformData: number[];
}) {
  const [width, setWidth] = useState(0);
  const bars = useMemo(() => {
    return waveformData.length ? waveformData : buildPlaceholderWaveform();
  }, [waveformData]);
  const progress = duration > 0 ? Math.min(currentTime / duration, 1) : 0;

  function handleLayout(event: LayoutChangeEvent) {
    setWidth(event.nativeEvent.layout.width);
  }

  function handlePress(event: GestureResponderEvent) {
    if (!width || duration <= 0) return;
    const ratio = Math.min(Math.max(event.nativeEvent.locationX / width, 0), 1);
    onSeek(duration * ratio);
  }

  return (
    <Pressable onLayout={handleLayout} onPressIn={handlePress} style={styles.shell}>
      <View style={styles.row}>
        {bars.map((bar, index) => {
          const ratio = bars.length <= 1 ? 1 : index / (bars.length - 1);
          const played = ratio <= progress;

          return (
            <View
              key={`bar-${index}`}
              style={[
                styles.bar,
                {
                  backgroundColor: played ? creatorTheme.amber : '#47433b',
                  height: 14 + bar * 30,
                },
              ]}
            />
          );
        })}
      </View>
      <View
        style={[
          styles.playhead,
          {
            left: `${progress * 100}%`,
          },
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 999,
    flex: 1,
    minWidth: 2,
  },
  playhead: {
    backgroundColor: creatorTheme.amber,
    borderRadius: 999,
    bottom: 4,
    position: 'absolute',
    top: 4,
    width: 2,
  },
  row: {
    alignItems: 'flex-end',
    flex: 1,
    flexDirection: 'row',
    gap: 3,
  },
  shell: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: creatorTheme.borderSoft,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    height: 60,
    justifyContent: 'center',
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: 'relative',
  },
});
