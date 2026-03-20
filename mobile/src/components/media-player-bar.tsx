import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

import { WaveformTimeline } from '@/src/components/waveform-timeline';
import { formatSecondsToClock } from '@/src/lib/studio-format';
import { creatorTheme } from '@/src/lib/theme';
import type { StudioMediaType } from '@/src/types/app';

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.5, 2] as const;

export function MediaPlayerBar({
  currentTime,
  duration,
  loopEnabled,
  mediaType,
  muted,
  onRestart,
  onSeek,
  onSeekBy,
  onToggleLoop,
  onToggleMute,
  onTogglePlay,
  playbackRate,
  playing,
  setPlaybackRate,
  waveformData,
}: {
  currentTime: number;
  duration: number;
  loopEnabled: boolean;
  mediaType: StudioMediaType;
  muted: boolean;
  onRestart: () => void;
  onSeek: (seconds: number) => void;
  onSeekBy: (deltaSeconds: number) => void;
  onToggleLoop: () => void;
  onToggleMute: () => void;
  onTogglePlay: () => void;
  playbackRate: number;
  playing: boolean;
  setPlaybackRate: (rate: number) => void;
  waveformData: number[];
}) {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 1;
  const safeCurrentTime = Number.isFinite(currentTime)
    ? Math.min(Math.max(currentTime, 0), safeDuration)
    : 0;

  return (
    <View style={styles.shell}>
      {mediaType === 'audio' ? (
        <WaveformTimeline
          currentTime={safeCurrentTime}
          duration={safeDuration}
          onSeek={onSeek}
          waveformData={waveformData}
        />
      ) : (
        <View style={styles.videoTimelineWrap}>
          <View style={styles.videoTrack}>
            <View
              style={[
                styles.videoTrackProgress,
                {
                  width: `${safeDuration > 0 ? (safeCurrentTime / safeDuration) * 100 : 0}%`,
                },
              ]}
            />
          </View>
          <Pressable
            onPress={() => onSeek(Math.max(0, safeCurrentTime - 5))}
            style={styles.seekOverlayLeft}
          />
          <Pressable
            onPress={() => onSeek(Math.min(safeDuration, safeCurrentTime + 5))}
            style={styles.seekOverlayRight}
          />
        </View>
      )}

      <View style={styles.timeRow}>
        <Text style={styles.currentTime}>{formatSecondsToClock(safeCurrentTime)}</Text>
        <Text style={styles.durationTime}>/ {formatSecondsToClock(safeDuration)}</Text>
      </View>

      <View style={styles.controlsRow}>
        <ControlButton active={loopEnabled} icon="repeat" onPress={onToggleLoop} />
        <ControlButton icon="skip-back" onPress={onRestart} />
        <ControlButton icon="rewind" label="5" onPress={() => onSeekBy(-5)} />
        <Pressable onPress={onTogglePlay} style={styles.playButton}>
          <Feather color={creatorTheme.black} name={playing ? 'pause' : 'play'} size={22} />
        </Pressable>
        <ControlButton icon="fast-forward" label="5" onPress={() => onSeekBy(5)} />
        <ControlButton active={muted} icon={muted ? 'volume-x' : 'volume-2'} onPress={onToggleMute} />
      </View>

      <View style={styles.speedRow}>
        {SPEED_OPTIONS.map((rate) => (
          <Pressable
            key={rate}
            onPress={() => setPlaybackRate(rate)}
            style={[styles.speedChip, playbackRate === rate && styles.speedChipActive]}>
            <Text style={[styles.speedText, playbackRate === rate && styles.speedTextActive]}>
              {rate}x
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function ControlButton({
  active,
  icon,
  label,
  onPress,
}: {
  active?: boolean;
  icon: keyof typeof Feather.glyphMap;
  label?: string;
  onPress?: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={[styles.controlButton, active && styles.controlButtonActive]}>
      <Feather color={active ? creatorTheme.text : creatorTheme.textMuted} name={icon} size={18} />
      {label ? <Text style={[styles.controlLabel, active && styles.controlLabelActive]}>{label}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    minWidth: 38,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  controlButtonActive: {
    backgroundColor: 'rgba(255, 79, 216, 0.18)',
    borderColor: 'rgba(255, 79, 216, 0.4)',
  },
  controlLabel: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 11,
  },
  controlLabelActive: {
    color: creatorTheme.text,
  },
  controlsRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'space-between',
  },
  currentTime: {
    color: creatorTheme.blue,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 15,
  },
  durationTime: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMono,
    fontSize: 15,
  },
  playButton: {
    alignItems: 'center',
    backgroundColor: creatorTheme.amber,
    borderRadius: 999,
    height: 52,
    justifyContent: 'center',
    shadowColor: creatorTheme.amber,
    shadowOffset: { height: 10, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    width: 52,
  },
  shell: {
    backgroundColor: creatorTheme.backgroundElevated,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    gap: 14,
    minHeight: 88,
    padding: 14,
  },
  speedChip: {
    backgroundColor: creatorTheme.panelStrong,
    borderColor: creatorTheme.borderSoft,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  speedChipActive: {
    backgroundColor: 'rgba(255, 79, 216, 0.18)',
    borderColor: 'rgba(255, 79, 216, 0.45)',
  },
  speedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  speedText: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 12,
  },
  speedTextActive: {
    color: creatorTheme.text,
  },
  timeRow: {
    alignItems: 'baseline',
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
  },
  videoTimelineWrap: {
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.borderSoft,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    height: 20,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  videoTrack: {
    backgroundColor: '#34405f',
    height: 6,
    marginHorizontal: 10,
    overflow: 'hidden',
  },
  videoTrackProgress: {
    backgroundColor: creatorTheme.blue,
    height: 6,
  },
  seekOverlayLeft: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '50%',
  },
  seekOverlayRight: {
    bottom: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '50%',
  },
});
