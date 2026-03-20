import { Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { Feather } from '@expo/vector-icons';

import { creatorTheme } from '@/src/lib/theme';

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '00:00';
  const rounded = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(rounded / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (rounded % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

export function MediaPlayerBar({
  currentTime,
  duration,
  onSeek,
  onSeekBy,
  onTogglePlay,
  playing,
}: {
  currentTime: number;
  duration: number;
  onSeek: (seconds: number) => void;
  onSeekBy: (deltaSeconds: number) => void;
  onTogglePlay: () => void;
  playing: boolean;
}) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const safeCurrentTime = Number.isFinite(currentTime)
    ? Math.min(Math.max(currentTime, 0), safeDuration)
    : 0;

  return (
    <View style={styles.shell}>
      <View style={styles.timelineRow}>
        <Text style={styles.time}>{formatTime(safeCurrentTime)}</Text>
        <Slider
          maximumTrackTintColor="rgba(255,255,255,0.12)"
          minimumTrackTintColor="#6AA5FF"
          onSlidingComplete={onSeek}
          step={1}
          style={styles.slider}
          thumbTintColor="#FFFFFF"
          value={safeCurrentTime}
          maximumValue={safeDuration}
          minimumValue={0}
        />
        <Text style={styles.time}>{formatTime(safeDuration)}</Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={() => onSeekBy(-10)} style={styles.controlButton}>
          <Feather color={creatorTheme.textMuted} name="rotate-ccw" size={18} />
          <Text style={styles.controlLabel}>-10</Text>
        </Pressable>
        <Pressable onPress={onTogglePlay} style={[styles.controlButton, styles.playButton]}>
          <Feather color="#0D1324" name={playing ? 'pause' : 'play'} size={20} />
        </Pressable>
        <Pressable onPress={() => onSeekBy(10)} style={styles.controlButton}>
          <Feather color={creatorTheme.textMuted} name="rotate-cw" size={18} />
          <Text style={styles.controlLabel}>+10</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minWidth: 64,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  controlLabel: {
    color: creatorTheme.textMuted,
    fontSize: 12,
    fontWeight: '800',
  },
  controls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playButton: {
    backgroundColor: '#E7EEFF',
    borderRadius: 999,
    height: 52,
    width: 52,
  },
  shell: {
    backgroundColor: 'rgba(13, 19, 36, 0.95)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 26,
    borderWidth: 1,
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  slider: {
    flex: 1,
    height: 34,
  },
  time: {
    color: creatorTheme.textMuted,
    fontSize: 12,
    fontWeight: '700',
    minWidth: 42,
    textAlign: 'center',
  },
  timelineRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
});
