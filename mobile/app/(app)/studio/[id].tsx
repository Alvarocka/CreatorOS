import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  InteractionManager,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { createVideoPlayer, VideoView, type VideoPlayer } from 'expo-video';

import { FilterChip } from '@/src/components/filter-chip';
import { GradientButton } from '@/src/components/gradient-button';
import { MediaPlayerBar } from '@/src/components/media-player-bar';
import { TagPill } from '@/src/components/tag-pill';
import { TextField } from '@/src/components/text-field';
import { exportStudioDocument } from '@/src/lib/studio-export';
import {
  applyToolbarAction,
  extractTimestampMarkers,
  formatSecondsToClock,
  parseTags,
  stringifyTags,
} from '@/src/lib/studio-format';
import {
  fetchStudioDocumentById,
  formatMediaSize,
  pickStudioMedia,
  replaceStudioDocumentMedia,
  updateStudioDocument,
} from '@/src/lib/studio-documents';
import { getStudioDebugCheckpoint, setStudioDebugCheckpoint } from '@/src/lib/studio-debug';
import { creatorGradients, creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { StudioDocument, StudioExportFormat, StudioToolbarAction } from '@/src/types/app';

function ToolbarButton({
  active,
  icon,
  label,
  onPress,
  primary,
}: {
  active?: boolean;
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.toolbarButton,
        primary && styles.toolbarButtonPrimary,
        active && styles.toolbarButtonActive,
        pressed && styles.toolbarButtonPressed,
      ]}>
      <Feather
        color={primary || active ? creatorTheme.black : creatorTheme.textMuted}
        name={icon}
        size={14}
      />
      <Text
        style={[
          styles.toolbarButtonText,
          (primary || active) && styles.toolbarButtonTextActive,
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function StudioDocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { profile, user } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<StudioDocument | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [noteText, setNoteText] = useState('');
  const [tagValue, setTagValue] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selection, setSelection] = useState({ end: 0, start: 0 });
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [muted, setMuted] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [videoExpanded, setVideoExpanded] = useState(false);
  const [mediaPlaybackReady, setMediaPlaybackReady] = useState(false);
  const [playerGate, setPlayerGate] = useState<'checking' | 'deferred' | 'enabled'>('checking');
  const [playerBooting, setPlayerBooting] = useState(false);
  const [savingState, setSavingState] = useState<'idle' | 'saved' | 'saving' | 'error'>('idle');
  const [videoPlayer, setVideoPlayer] = useState<VideoPlayer | null>(null);
  const videoPlayerRef = useRef<VideoPlayer | null>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);
  const [audioPlaybackState, setAudioPlaybackState] = useState({
    currentTime: 0,
    duration: 0,
    playing: false,
  });
  const [videoPlaybackState, setVideoPlaybackState] = useState({
    currentTime: 0,
    duration: 0,
    playing: false,
  });

  const currentTime =
    document?.mediaType === 'audio' ? audioPlaybackState.currentTime : videoPlaybackState.currentTime;
  const duration =
    document?.mediaType === 'audio' ? audioPlaybackState.duration : videoPlaybackState.duration;
  const isPlaying =
    document?.mediaType === 'audio' ? audioPlaybackState.playing : videoPlaybackState.playing;

  const timestampMarkers = useMemo(() => extractTimestampMarkers(noteText), [noteText]);

  const releaseVideoPlayer = useCallback((player: VideoPlayer | null) => {
    if (!player) return;

    try {
      player.pause();
    } catch {}

    try {
      player.release();
    } catch {}
  }, []);

  const load = useCallback(async () => {
    if (!user || typeof id !== 'string') return;
    setLoading(true);
    await setStudioDebugCheckpoint('studio:load:start', {
      documentId: id,
    });

    try {
      const nextDocument = await fetchStudioDocumentById(user.id, id);
      setDocument(nextDocument);

      if (nextDocument) {
        setTitle(nextDocument.title);
        setDescription(nextDocument.description);
        setNoteText(nextDocument.noteText);
        setTagValue(stringifyTags(nextDocument.tags));
        setPlaybackRate(1);
        setLoopEnabled(false);
        setMuted(false);
        hydratedRef.current = false;
        requestAnimationFrame(() => {
          hydratedRef.current = true;
        });
        await setStudioDebugCheckpoint('studio:load:document-ready', {
          documentId: nextDocument.id,
          mediaType: nextDocument.mediaType || 'text-only',
        });
      }
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    let cancelled = false;

    async function resolvePlayerGate() {
      if (!document?.mediaType || !document.mediaUri) {
        setPlayerGate('enabled');
        return;
      }

      const checkpoint = await getStudioDebugCheckpoint();
      if (cancelled) return;

      const ageMs = checkpoint ? Date.now() - new Date(checkpoint.at).getTime() : Infinity;
      const recentStudioCheckpoint =
        checkpoint &&
        checkpoint.step.startsWith('studio:') &&
        checkpoint.step !== 'studio:stable' &&
        ageMs < 1000 * 60 * 20;

      const shouldStartDeferred = Platform.OS === 'android' || recentStudioCheckpoint;
      setPlayerGate(shouldStartDeferred ? 'deferred' : 'enabled');
    }

    void resolvePlayerGate();

    return () => {
      cancelled = true;
    };
  }, [document?.id, document?.mediaType, document?.mediaUri]);

  useEffect(() => {
    let cancelled = false;
    let nextVideoPlayer: VideoPlayer | null = null;

    setMediaPlaybackReady(false);
    setPlayerBooting(false);
    setAudioPlaybackState({
      currentTime: 0,
      duration: 0,
      playing: false,
    });
    setVideoPlaybackState({
      currentTime: 0,
      duration: 0,
      playing: false,
    });

    releaseVideoPlayer(videoPlayerRef.current);
    videoPlayerRef.current = null;
    setVideoPlayer(null);

    if (!document?.mediaType || !document.mediaUri || playerGate !== 'enabled') {
      return;
    }

    setPlayerBooting(true);
    const interaction = InteractionManager.runAfterInteractions(() => {
      void (async () => {
        try {
          await setStudioDebugCheckpoint('studio:interaction-ready', {
            documentId: document.id,
            mediaType: document.mediaType || 'text-only',
          });
          await setStudioDebugCheckpoint('studio:player:create:start', {
            documentId: document.id,
            mediaType: document.mediaType || 'text-only',
          });

          nextVideoPlayer = createVideoPlayer(document.mediaUri);

          if (cancelled) {
            releaseVideoPlayer(nextVideoPlayer);
            return;
          }

          videoPlayerRef.current = nextVideoPlayer;
          setVideoPlayer(nextVideoPlayer);

          setMediaPlaybackReady(true);
          setPlayerBooting(false);
          await setStudioDebugCheckpoint('studio:player:create:ready', {
            documentId: document.id,
            mediaType: document.mediaType || 'text-only',
          });
        } catch (error) {
          if (cancelled) return;

          void setStudioDebugCheckpoint('studio:player:create:error', {
            documentId: document.id,
            mediaType: document.mediaType || 'text-only',
            message: error instanceof Error ? error.message : 'unknown',
          });
          setPlayerBooting(false);
          setPlayerGate('deferred');
          setFeedback(
            error instanceof Error
              ? error.message
              : 'No pudimos inicializar el reproductor en este documento.'
          );
        }
      })();
    });

    return () => {
      cancelled = true;
      interaction.cancel();

      if (nextVideoPlayer && videoPlayerRef.current !== nextVideoPlayer) {
        releaseVideoPlayer(nextVideoPlayer);
      }
    };
  }, [document?.id, document?.mediaType, document?.mediaUri, playerGate, releaseVideoPlayer]);

  useEffect(() => {
    if (document?.mediaType !== 'audio' || !videoPlayer) {
      setAudioPlaybackState({
        currentTime: 0,
        duration: 0,
        playing: false,
      });
      return;
    }

    let didMarkLoaded = false;
    const interval = setInterval(() => {
      setAudioPlaybackState({
        currentTime: videoPlayer.currentTime || 0,
        duration: videoPlayer.duration || 0,
        playing: Boolean(videoPlayer.playing),
      });

      if (videoPlayer.duration > 0 && !didMarkLoaded) {
        didMarkLoaded = true;
        void setStudioDebugCheckpoint('studio:audio:loaded', {
          documentId: document.id,
        });
      }
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, [document?.id, document?.mediaType, videoPlayer]);

  useEffect(() => {
    if (!document?.mediaType || playerGate !== 'enabled' || !mediaPlaybackReady) {
      return;
    }

    const timeout = setTimeout(() => {
      void setStudioDebugCheckpoint('studio:stable', {
        documentId: document.id,
        mediaType: document.mediaType || 'text-only',
      });
    }, 1800);

    return () => clearTimeout(timeout);
  }, [document?.id, document?.mediaType, mediaPlaybackReady, playerGate]);

  useEffect(() => {
    if (document?.mediaType !== 'video' || !videoPlayer) {
      setVideoPlaybackState({
        currentTime: 0,
        duration: 0,
        playing: false,
      });
      return;
    }

    const interval = setInterval(() => {
      setVideoPlaybackState({
        currentTime: videoPlayer.currentTime || 0,
        duration: videoPlayer.duration || 0,
        playing: Boolean(videoPlayer.playing),
      });
    }, 250);

    return () => clearInterval(interval);
  }, [document?.mediaType, document?.mediaUri, videoPlayer]);

  useEffect(() => {
    if ((document?.mediaType === 'audio' || document?.mediaType === 'video') && videoPlayer) {
      videoPlayer.playbackRate = playbackRate;
      videoPlayer.loop = loopEnabled;
      videoPlayer.muted = muted;
      videoPlayer.volume = muted ? 0 : 1;
    }
  }, [document?.mediaType, loopEnabled, muted, playbackRate, videoPlayer]);

  useEffect(() => {
    return () => {
      releaseVideoPlayer(videoPlayerRef.current);
      videoPlayerRef.current = null;
    };
  }, [releaseVideoPlayer]);

  const saveNow = useCallback(async () => {
    if (!document || !user) return;
    setSavingState('saving');

    try {
      const updated = await updateStudioDocument(user.id, document.id, {
        description,
        noteText,
        tags: parseTags(tagValue),
        title,
      });

      if (updated) {
        setDocument(updated);
      }
      setSavingState('saved');
      setFeedback('');
    } catch (error) {
      setSavingState('error');
      setFeedback(error instanceof Error ? error.message : 'No pudimos guardar el documento.');
    }
  }, [description, document, noteText, tagValue, title, user]);

  useEffect(() => {
    if (!document || !user || !hydratedRef.current) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      void saveNow();
    }, 3000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [description, document, noteText, saveNow, tagValue, title, user]);

  async function handleReplaceMedia() {
    if (!document || !user) return;

    try {
      const nextMedia = await pickStudioMedia();
      if (!nextMedia) return;

      const updated = await replaceStudioDocumentMedia(user.id, document.id, nextMedia);
      if (updated) {
        setDocument(updated);
        setFeedback('');
      }
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : 'No pudimos reemplazar el archivo multimedia.'
      );
    }
  }

  function handleToolbarAction(action: StudioToolbarAction) {
    const next = applyToolbarAction({
      action,
      currentSeconds: currentTime || 0,
      selection,
      value: noteText,
    });

    setNoteText(next.value);
    setSelection(next.selection);
  }

  function handleTogglePlayback() {
    if ((document?.mediaType === 'audio' || document?.mediaType === 'video') && videoPlayer) {
      if (videoPlayer.playing) {
        videoPlayer.pause();
      } else {
        if (videoPlayer.currentTime >= videoPlayer.duration && videoPlayer.duration > 0) {
          videoPlayer.currentTime = 0;
        }
        videoPlayer.play();
      }
    }
  }

  function handleSeek(seconds: number) {
    if ((document?.mediaType === 'audio' || document?.mediaType === 'video') && videoPlayer) {
      videoPlayer.currentTime = seconds;
      if (document.mediaType === 'audio') {
        setAudioPlaybackState((current) => ({ ...current, currentTime: seconds }));
      } else {
        setVideoPlaybackState((current) => ({ ...current, currentTime: seconds }));
      }
    }
  }

  function handleSeekBy(deltaSeconds: number) {
    const nextPosition = Math.max(0, Math.min((duration || 0) + 0.25, (currentTime || 0) + deltaSeconds));
    handleSeek(nextPosition);
  }

  async function handleExport(format: StudioExportFormat) {
    if (!document) return;

    try {
      await exportStudioDocument(
        {
          ...document,
          description,
          noteText,
          tags: parseTags(tagValue),
          title,
        },
        format
      );
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : 'No pudimos exportar el documento.');
    }
  }

  if (loading) {
    return (
      <LinearGradient colors={creatorGradients.background} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centeredState}>
            <Text style={styles.centeredTitle}>Abriendo documento...</Text>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  if (!document) {
    return (
      <LinearGradient colors={creatorGradients.background} style={styles.gradient}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centeredState}>
            <Text style={styles.centeredTitle}>No encontramos este documento</Text>
            <GradientButton onPress={() => router.replace('/(app)/(tabs)/library')}>
              Volver a la biblioteca
            </GradientButton>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  const panelContent = (
    <View style={styles.panelContent}>
      {document.mediaType === 'image' && document.mediaUri ? (
        <Image contentFit="cover" source={{ uri: document.mediaUri }} style={styles.imagePreview} />
      ) : null}

      <TextField label="Title" onChangeText={setTitle} value={title} />
      <TextField
        label="Short description"
        multiline
        onChangeText={setDescription}
        value={description}
      />
      <TextField label="Tags" onChangeText={setTagValue} value={tagValue} />

      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Media reference</Text>
        <Text style={styles.metaValue}>
          {document.mediaName || 'Documento sin medio'} · {formatMediaSize(document.mediaSizeBytes)}
        </Text>
        <Text style={styles.metaHint}>
          Este archivo vive localmente en el dispositivo. No estamos subiendo nada a la nube.
        </Text>
      </View>

      <GradientButton onPress={handleReplaceMedia} variant="ghost">
        Replace media
      </GradientButton>

      <View style={styles.exportBlock}>
        <Text style={styles.metaLabel}>Export</Text>
        <View style={styles.exportRow}>
          <FilterChip onPress={() => void handleExport('txt')}>TXT</FilterChip>
          <FilterChip onPress={() => void handleExport('md')}>MD</FilterChip>
          <FilterChip onPress={() => void handleExport('pdf')}>PDF</FilterChip>
        </View>
      </View>

      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>Perfil Público Opcional — ✦ PRONTO</Text>
        <Text style={styles.placeholderCopy}>
          Primero pulimos el documento multimedia y la experiencia tablet-first.
        </Text>
      </View>
    </View>
  );

  return (
    <LinearGradient colors={creatorGradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardArea}>
          <View style={styles.topBar}>
            <Pressable onPress={() => router.back()} style={styles.topIconButton}>
              <Feather color={creatorTheme.text} name="arrow-left" size={18} />
            </Pressable>

            <View style={styles.topBarCopy}>
              <Text numberOfLines={1} style={styles.documentTitle}>
                {title || 'Documento multimedia'}
              </Text>
              <Text numberOfLines={1} style={styles.documentSubtitle}>
                {profile?.display_name || 'Creator'} · {document.mediaType || 'text-only'} ·{' '}
                {savingState === 'saving'
                  ? 'saving...'
                  : savingState === 'saved'
                    ? 'saved'
                    : savingState === 'error'
                      ? 'error'
                      : 'ready'}
              </Text>
            </View>

            {!isTablet ? (
              <Pressable onPress={() => setDrawerOpen(true)} style={styles.topIconButton}>
                <Feather color={creatorTheme.text} name="menu" size={18} />
              </Pressable>
            ) : null}
          </View>

          <View style={styles.toolbarStrip}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.toolbarRow}>
                <ToolbarButton
                  icon="clock"
                  label="Insert Timestamp"
                  onPress={() => handleToolbarAction('timestamp')}
                  primary
                />
                <ToolbarButton
                  icon="flag"
                  label="Mark"
                  onPress={() => handleToolbarAction('mark')}
                />
                <ToolbarButton
                  icon="zap"
                  label="Quick Idea"
                  onPress={() => handleToolbarAction('idea')}
                />
                <ToolbarButton
                  icon="sun"
                  label="Highlight"
                  onPress={() => handleToolbarAction('highlight')}
                />
                <ToolbarButton
                  active={loopEnabled}
                  icon="repeat"
                  label="Loop"
                  onPress={() => setLoopEnabled((current) => !current)}
                />
                <ToolbarButton icon="save" label="Save" onPress={() => void saveNow()} />
              </View>
            </ScrollView>
          </View>

          <View style={[styles.workspace, isTablet && styles.workspaceTablet]}>
            <View style={styles.editorColumn}>
              {timestampMarkers.length ? (
                <View style={styles.markerRail}>
                  <Text style={styles.markerRailLabel}>Jump to timestamps</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <View style={styles.markerChipsRow}>
                      {timestampMarkers.map((marker) => (
                        <Pressable
                          key={marker.id}
                          onPress={() => handleSeek(marker.seconds)}
                          style={styles.markerChip}>
                          <Text style={styles.markerChipText}>{marker.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              ) : null}

              <View style={styles.editorCard}>
                <TextInput
                  multiline
                  onChangeText={setNoteText}
                  onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
                  placeholder={`${formatSecondsToClock(135)}\nUsa Insert Timestamp para fijar segundos exactos y seguir escribiendo.`}
                  placeholderTextColor={creatorTheme.textSubtle}
                  selection={selection}
                  style={styles.editorInput}
                  textAlignVertical="top"
                  value={noteText}
                />
              </View>

              {parseTags(tagValue).length ? (
                <View style={styles.tagRow}>
                  {parseTags(tagValue).map((tag) => (
                    <TagPill key={tag} label={tag} />
                  ))}
                </View>
              ) : null}

              {document.mediaType === 'video' && document.mediaUri && videoPlayer ? (
                <Pressable
                  onPress={() => setVideoExpanded((current) => !current)}
                  style={[styles.videoFrame, videoExpanded && styles.videoFrameExpanded]}>
                  <VideoView
                    allowsFullscreen={false}
                    allowsPictureInPicture={false}
                    nativeControls={false}
                    player={videoPlayer}
                    style={styles.videoPreview}
                  />
                  <View style={styles.videoOverlay}>
                    <Text style={styles.videoOverlayText}>
                      {videoExpanded ? 'Tap para colapsar video' : 'Tap para expandir video'}
                    </Text>
                  </View>
                </Pressable>
              ) : null}

              {playerGate === 'checking' && (document.mediaType === 'audio' || document.mediaType === 'video') ? (
                <View style={styles.playerFallbackCard}>
                  <Text style={styles.playerFallbackTitle}>Preparando reproductor...</Text>
                  <Text style={styles.playerFallbackCopy}>
                    Estamos cargando el documento primero para no forzar Android durante la entrada.
                  </Text>
                </View>
              ) : playerBooting && (document.mediaType === 'audio' || document.mediaType === 'video') ? (
                <View style={styles.playerFallbackCard}>
                  <Text style={styles.playerFallbackTitle}>Inicializando reproductor...</Text>
                  <Text style={styles.playerFallbackCopy}>
                    Estamos montando el audio local con una ruta mas segura y sin cargar hooks nativos
                    antes de tiempo.
                  </Text>
                </View>
              ) : playerGate === 'deferred' &&
                (document.mediaType === 'audio' || document.mediaType === 'video') ? (
                <View style={styles.playerFallbackCard}>
                  <Text style={styles.playerFallbackTitle}>Modo seguro del reproductor</Text>
                  <Text style={styles.playerFallbackCopy}>
                    En Android abrimos primero el editor y activamos el reproductor manualmente para
                    evitar cierres al montar multimedia local.
                  </Text>
                  <GradientButton
                    onPress={() => {
                      void setStudioDebugCheckpoint('studio:player:manual-enable', {
                        documentId: document.id,
                        mediaType: document.mediaType || 'text-only',
                      });
                      setPlayerGate('enabled');
                    }}>
                    Abrir reproductor
                  </GradientButton>
                </View>
              ) : document.mediaType === 'audio' || document.mediaType === 'video' ? (
                <MediaPlayerBar
                  currentTime={currentTime || 0}
                  duration={duration || 0}
                  loopEnabled={loopEnabled}
                  mediaType={document.mediaType}
                  muted={muted}
                  onRestart={() => handleSeek(0)}
                  onSeek={handleSeek}
                  onSeekBy={handleSeekBy}
                  onToggleLoop={() => setLoopEnabled((current) => !current)}
                  onToggleMute={() => setMuted((current) => !current)}
                  onTogglePlay={handleTogglePlayback}
                  playbackRate={playbackRate}
                  playing={Boolean(isPlaying)}
                  setPlaybackRate={setPlaybackRate}
                  waveformData={document.waveformData}
                />
              ) : (
                <View style={styles.imagePlayerHint}>
                  <Text style={styles.imagePlayerHintText}>
                    Las imágenes no necesitan timeline abajo. La referencia se mantiene al costado
                    y el documento queda libre para describirla.
                  </Text>
                </View>
              )}

              {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
            </View>

            {isTablet ? <View style={styles.sidePanel}>{panelContent}</View> : null}
          </View>
        </KeyboardAvoidingView>

        {!isTablet ? (
          <Modal animationType="slide" onRequestClose={() => setDrawerOpen(false)} transparent visible={drawerOpen}>
            <View style={styles.drawerBackdrop}>
              <View style={styles.drawerSheet}>
                <View style={styles.drawerHeader}>
                  <Text style={styles.drawerTitle}>Document panel</Text>
                  <Pressable onPress={() => setDrawerOpen(false)} style={styles.topIconButton}>
                    <Feather color={creatorTheme.text} name="x" size={18} />
                  </Pressable>
                </View>
                <ScrollView contentContainerStyle={styles.drawerScroll}>{panelContent}</ScrollView>
              </View>
            </View>
          </Modal>
        ) : null}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  centeredState: {
    alignItems: 'center',
    flex: 1,
    gap: 16,
    justifyContent: 'center',
    padding: 24,
  },
  centeredTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 22,
  },
  documentSubtitle: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMono,
    fontSize: 12,
    marginTop: 4,
  },
  documentTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 18,
  },
  drawerBackdrop: {
    backgroundColor: 'rgba(15, 14, 12, 0.72)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  drawerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  drawerScroll: {
    paddingBottom: 24,
  },
  drawerSheet: {
    backgroundColor: creatorTheme.backgroundElevated,
    borderTopLeftRadius: creatorTheme.radiusXl,
    borderTopRightRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    borderColor: creatorTheme.border,
    minHeight: '68%',
    padding: 20,
  },
  drawerTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 20,
  },
  editorCard: {
    backgroundColor: creatorTheme.white,
    borderRadius: creatorTheme.radiusXl,
    flex: 1,
    minHeight: 340,
    overflow: 'hidden',
    padding: 18,
  },
  editorColumn: {
    flex: 1,
    gap: 14,
  },
  editorInput: {
    color: '#181512',
    flex: 1,
    fontFamily: creatorTheme.fontBody,
    fontSize: 22,
    lineHeight: 32,
    minHeight: 340,
    textAlignVertical: 'top',
  },
  exportBlock: {
    gap: 10,
  },
  exportRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feedback: {
    color: creatorTheme.warm,
    fontFamily: creatorTheme.fontUiMedium,
    lineHeight: 20,
  },
  gradient: {
    flex: 1,
  },
  imagePlayerHint: {
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    padding: 14,
  },
  imagePlayerHintText: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  imagePreview: {
    borderRadius: creatorTheme.radiusLg,
    height: 180,
    overflow: 'hidden',
    width: '100%',
  },
  keyboardArea: {
    flex: 1,
  },
  markerChip: {
    backgroundColor: 'rgba(232, 168, 76, 0.12)',
    borderColor: 'rgba(232, 168, 76, 0.4)',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  markerChipText: {
    color: creatorTheme.amber,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 12,
  },
  markerChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  markerRail: {
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  markerRailLabel: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  metaCard: {
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  metaHint: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  metaLabel: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMono,
    fontSize: 11,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiSemiBold,
    fontSize: 15,
    lineHeight: 22,
  },
  panelContent: {
    gap: 14,
  },
  placeholderCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderColor: creatorTheme.borderSoft,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 8,
    opacity: 0.8,
    padding: 14,
  },
  placeholderCopy: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  placeholderTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 15,
  },
  playerFallbackCard: {
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    gap: 10,
    padding: 14,
  },
  playerFallbackCopy: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontUiMedium,
    fontSize: 13,
    lineHeight: 19,
  },
  playerFallbackTitle: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontUiBold,
    fontSize: 16,
  },
  safeArea: {
    flex: 1,
  },
  sidePanel: {
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusXl,
    borderWidth: 1,
    padding: 16,
    width: 260,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toolbarButton: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panelSoft,
    borderColor: creatorTheme.borderSoft,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 32,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  toolbarButtonActive: {
    backgroundColor: 'rgba(232, 168, 76, 0.12)',
    borderColor: 'rgba(232, 168, 76, 0.5)',
  },
  toolbarButtonPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  toolbarButtonPrimary: {
    backgroundColor: creatorTheme.amber,
    borderColor: creatorTheme.amberDim,
  },
  toolbarButtonText: {
    color: creatorTheme.textMuted,
    fontFamily: creatorTheme.fontMonoMedium,
    fontSize: 11,
  },
  toolbarButtonTextActive: {
    color: creatorTheme.black,
  },
  toolbarRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toolbarStrip: {
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 18,
    paddingTop: 10,
  },
  topBarCopy: {
    flex: 1,
  },
  topIconButton: {
    alignItems: 'center',
    backgroundColor: creatorTheme.panel,
    borderColor: creatorTheme.border,
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  videoFrame: {
    borderColor: creatorTheme.border,
    borderRadius: creatorTheme.radiusLg,
    borderWidth: 1,
    height: 118,
    overflow: 'hidden',
    position: 'relative',
  },
  videoFrameExpanded: {
    height: 224,
  },
  videoOverlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(15, 14, 12, 0.38)',
    bottom: 0,
    justifyContent: 'flex-end',
    left: 0,
    padding: 10,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  videoOverlayText: {
    color: creatorTheme.text,
    fontFamily: creatorTheme.fontMono,
    fontSize: 11,
  },
  videoPreview: {
    flex: 1,
  },
  workspace: {
    flex: 1,
    gap: 14,
    padding: 18,
  },
  workspaceTablet: {
    flexDirection: 'row',
    paddingBottom: 14,
  },
});
