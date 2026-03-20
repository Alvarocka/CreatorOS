import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
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
import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { VideoView, useVideoPlayer } from 'expo-video';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '@/src/components/glass-card';
import { GradientButton } from '@/src/components/gradient-button';
import { MediaPlayerBar } from '@/src/components/media-player-bar';
import { TextField } from '@/src/components/text-field';
import {
  fetchStudioDocumentById,
  formatMediaSize,
  pickStudioMedia,
  replaceStudioDocumentMedia,
  updateStudioDocument,
} from '@/src/lib/studio-documents';
import { creatorGradients, creatorTheme } from '@/src/lib/theme';
import { useAuth } from '@/src/providers/auth-provider';
import type { StudioDocument } from '@/src/types/app';

function formatTimestamp(seconds: number) {
  const safeSeconds = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(safeSeconds / 60)
    .toString()
    .padStart(2, '0');
  const remainder = (safeSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainder}`;
}

function MediaToolbarChip({
  active,
  icon,
  label,
  onPress,
}: {
  active?: boolean;
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.toolbarChip,
        active && styles.toolbarChipActive,
        pressed && styles.toolbarChipPressed,
      ]}>
      {icon ? (
        <Feather
          color={active ? '#0D1324' : creatorTheme.textMuted}
          name={icon}
          size={15}
        />
      ) : null}
      <Text style={[styles.toolbarChipText, active && styles.toolbarChipTextActive]}>{label}</Text>
    </Pressable>
  );
}

export default function StudioDocumentScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useAuth();
  const { width } = useWindowDimensions();
  const isTablet = width >= 900;
  const [loading, setLoading] = useState(true);
  const [document, setDocument] = useState<StudioDocument | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [noteText, setNoteText] = useState('');
  const [feedback, setFeedback] = useState('');
  const [selection, setSelection] = useState({ end: 0, start: 0 });
  const [playingRate, setPlayingRate] = useState(1);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [videoPlaybackState, setVideoPlaybackState] = useState({
    currentTime: 0,
    duration: 0,
    playing: false,
  });
  const hydratedRef = useRef(false);
  const audioPlayer = useAudioPlayer(
    document?.mediaType === 'audio' && document.mediaUri ? document.mediaUri : null,
    { updateInterval: 250 }
  );
  const audioStatus = useAudioPlayerStatus(audioPlayer);
  const videoPlayer = useVideoPlayer(
    document?.mediaType === 'video' && document.mediaUri ? document.mediaUri : null
  );

  const currentTime =
    document?.mediaType === 'audio' ? audioStatus.currentTime : videoPlaybackState.currentTime;
  const duration =
    document?.mediaType === 'audio' ? audioStatus.duration : videoPlaybackState.duration;
  const isPlaying =
    document?.mediaType === 'audio' ? audioStatus.playing : videoPlaybackState.playing;

  const load = useCallback(async () => {
    if (!user || typeof id !== 'string') return;
    setLoading(true);

    try {
      const nextDocument = await fetchStudioDocumentById(user.id, id);
      setDocument(nextDocument);

      if (nextDocument) {
        setTitle(nextDocument.title);
        setDescription(nextDocument.description);
        setNoteText(nextDocument.noteText);
        hydratedRef.current = false;
        requestAnimationFrame(() => {
          hydratedRef.current = true;
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
    if (document?.mediaType !== 'video') return;

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
    if (!document || !user || !hydratedRef.current) return;

    const timeoutId = setTimeout(async () => {
      try {
        await updateStudioDocument(user.id, document.id, {
          description,
          noteText,
          title,
        });
      } catch (error) {
        setFeedback(
          error instanceof Error ? error.message : 'No pudimos guardar los cambios del documento.'
        );
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [description, document, noteText, title, user]);

  useEffect(() => {
    if (document?.mediaType === 'audio') {
      audioPlayer.setPlaybackRate(playingRate);
      audioPlayer.loop = loopEnabled;
      return;
    }

    if (document?.mediaType === 'video') {
      videoPlayer.playbackRate = playingRate;
      videoPlayer.loop = loopEnabled;
    }
  }, [audioPlayer, document?.mediaType, loopEnabled, playingRate, videoPlayer]);

  function handleInsertTimestamp() {
    const timestamp = formatTimestamp(currentTime || 0);
    const insertion = `\n--------------${timestamp}--------------\n`;
    const nextValue = `${noteText.slice(0, selection.start)}${insertion}${noteText.slice(
      selection.end
    )}`;
    const caret = selection.start + insertion.length;

    setNoteText(nextValue);
    setSelection({ end: caret, start: caret });
  }

  function handleTogglePlayback() {
    if (document?.mediaType === 'audio') {
      if (audioStatus.playing) {
        audioPlayer.pause();
      } else {
        if (audioStatus.currentTime >= audioStatus.duration && audioStatus.duration > 0) {
          void audioPlayer.seekTo(0);
        }
        audioPlayer.play();
      }
      return;
    }

    if (document?.mediaType === 'video') {
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
    if (document?.mediaType === 'audio') {
      void audioPlayer.seekTo(seconds);
      return;
    }

    if (document?.mediaType === 'video') {
      videoPlayer.currentTime = seconds;
      setVideoPlaybackState((current) => ({ ...current, currentTime: seconds }));
    }
  }

  function handleSeekBy(deltaSeconds: number) {
    const nextPosition = Math.max(0, (currentTime || 0) + deltaSeconds);
    handleSeek(nextPosition);
  }

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

  const mediaInfo = useMemo(() => {
    if (!document) return 'Sin medio asociado';
    if (!document.mediaType) return 'Documento sin medio';

    return `${document.mediaType.toUpperCase()} · ${document.mediaName || 'archivo'} · ${formatMediaSize(
      document.mediaSizeBytes
    )}`;
  }, [document]);

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

  const sidePanel = (
    <GlassCard style={[styles.sidePanel, !isTablet && styles.sidePanelStacked]}>
      <Text style={styles.sidePanelTitle}>Panel del documento</Text>
      <Text style={styles.sidePanelCopy}>
        Cambia el titulo, describe el contexto y reemplaza el archivo si subiste la version
        equivocada.
      </Text>

      {document.mediaType === 'video' && document.mediaUri ? (
        <View style={styles.videoPreviewFrame}>
          <VideoView
            allowsFullscreen={false}
            allowsPictureInPicture={false}
            nativeControls={false}
            player={videoPlayer}
            style={styles.videoPreview}
          />
        </View>
      ) : null}

      {document.mediaType === 'image' && document.mediaUri ? (
        <Image contentFit="cover" source={{ uri: document.mediaUri }} style={styles.imagePreview} />
      ) : null}

      <View style={styles.formSection}>
        <TextField
          label="Titulo"
          onChangeText={setTitle}
          placeholder="Nombre del documento"
          value={title}
        />
        <TextField
          label="Descripcion"
          onChangeText={setDescription}
          placeholder="Contexto corto del material"
          value={description}
        />
      </View>

      <View style={styles.metaCard}>
        <Text style={styles.metaLabel}>Archivo actual</Text>
        <Text style={styles.metaValue}>{mediaInfo}</Text>
        <Text style={styles.metaHint}>
          Este material vive localmente en el dispositivo para evitar subir peso innecesario.
        </Text>
      </View>

      <GradientButton onPress={handleReplaceMedia} variant="ghost">
        Subir o reemplazar archivo
      </GradientButton>

      {feedback ? <Text style={styles.feedback}>{feedback}</Text> : null}
    </GlassCard>
  );

  const editorColumn = (
    <View style={styles.editorColumn}>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.topIconButton}>
          <Feather color="#FFFFFF" name="arrow-left" size={18} />
        </Pressable>

        <View style={styles.topBarCopy}>
          <Text numberOfLines={1} style={styles.documentTitle}>
            {title || 'Documento multimedia'}
          </Text>
          <Text numberOfLines={1} style={styles.documentSubtitle}>
            {mediaInfo}
          </Text>
        </View>
      </View>

      <View style={styles.toolbarRow}>
        <MediaToolbarChip icon="clock" label="Insertar timestamp" onPress={handleInsertTimestamp} />
        <MediaToolbarChip
          active={loopEnabled}
          icon="repeat"
          label={loopEnabled ? 'Loop activo' : 'Loop'}
          onPress={() => setLoopEnabled((current) => !current)}
        />
        {[0.5, 1, 1.5, 2].map((rate) => (
          <MediaToolbarChip
            active={playingRate === rate}
            key={rate}
            label={`${rate}x`}
            onPress={() => setPlayingRate(rate)}
          />
        ))}
      </View>

      <GlassCard style={styles.editorCard}>
        <Text style={styles.editorHint}>
          Escribe la letra, notas de referencia o ideas. Cuando quieras marcar un momento exacto,
          usa el boton de timestamp arriba.
        </Text>
        <TextInput
          multiline
          onChangeText={setNoteText}
          onSelectionChange={(event) => setSelection(event.nativeEvent.selection)}
          placeholder={`--------------02:15--------------\nen esta parte quiero incluir gritos de publico`}
          placeholderTextColor="rgba(156,167,198,0.45)"
          selection={selection}
          style={styles.editorInput}
          textAlignVertical="top"
          value={noteText}
        />
      </GlassCard>

      {document.mediaType === 'audio' || document.mediaType === 'video' ? (
        <MediaPlayerBar
          currentTime={currentTime || 0}
          duration={duration || 0}
          onSeek={handleSeek}
          onSeekBy={handleSeekBy}
          onTogglePlay={handleTogglePlayback}
          playing={Boolean(isPlaying)}
        />
      ) : (
        <GlassCard style={styles.imagePlayerHint}>
          <Text style={styles.imagePlayerHintText}>
            Las imagenes no necesitan timeline, pero puedes seguir desarrollando notas y contexto
            mientras la vista queda disponible al costado.
          </Text>
        </GlassCard>
      )}
    </View>
  );

  return (
    <LinearGradient colors={creatorGradients.background} style={styles.gradient}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardArea}>
          {isTablet ? (
            <View style={styles.workspaceTablet}>
              {editorColumn}
              {sidePanel}
            </View>
          ) : (
            <ScrollView contentContainerStyle={styles.workspaceMobile}>
              {editorColumn}
              {sidePanel}
            </ScrollView>
          )}
        </KeyboardAvoidingView>
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
    fontSize: 22,
    fontWeight: '900',
  },
  documentSubtitle: {
    color: creatorTheme.textMuted,
    fontSize: 12,
    marginTop: 4,
  },
  documentTitle: {
    color: creatorTheme.text,
    fontSize: 20,
    fontWeight: '900',
  },
  editorCard: {
    flex: 1,
    gap: 12,
    minHeight: 320,
    paddingBottom: 12,
  },
  editorColumn: {
    flex: 1.35,
    gap: 14,
  },
  editorHint: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  editorInput: {
    color: creatorTheme.text,
    flex: 1,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 34,
    minHeight: 320,
    paddingBottom: 12,
  },
  feedback: {
    color: creatorTheme.textMuted,
    lineHeight: 20,
  },
  formSection: {
    gap: 14,
  },
  gradient: {
    flex: 1,
  },
  imagePlayerHint: {
    paddingVertical: 14,
  },
  imagePlayerHintText: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  imagePreview: {
    borderRadius: 18,
    height: 180,
    overflow: 'hidden',
    width: '100%',
  },
  keyboardArea: {
    flex: 1,
  },
  metaCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: creatorTheme.border,
    borderRadius: 18,
    borderWidth: 1,
    gap: 6,
    padding: 14,
  },
  metaHint: {
    color: creatorTheme.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
  metaLabel: {
    color: creatorTheme.textMuted,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  metaValue: {
    color: creatorTheme.text,
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 21,
  },
  safeArea: {
    flex: 1,
  },
  sidePanel: {
    flex: 0.8,
    gap: 14,
    maxWidth: 340,
    minWidth: 280,
  },
  sidePanelCopy: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
  sidePanelStacked: {
    maxWidth: undefined,
    minWidth: undefined,
  },
  sidePanelTitle: {
    color: creatorTheme.text,
    fontSize: 22,
    fontWeight: '900',
  },
  toolbarChip: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  toolbarChipActive: {
    backgroundColor: '#E7EEFF',
    borderColor: '#E7EEFF',
  },
  toolbarChipPressed: {
    opacity: 0.92,
  },
  toolbarChipText: {
    color: creatorTheme.textMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  toolbarChipTextActive: {
    color: '#0D1324',
  },
  toolbarRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  topBar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  topBarCopy: {
    flex: 1,
  },
  topIconButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  videoPreview: {
    height: '100%',
    width: '100%',
  },
  videoPreviewFrame: {
    borderRadius: 18,
    height: 190,
    overflow: 'hidden',
    width: '100%',
  },
  workspaceMobile: {
    gap: 16,
    padding: 18,
    paddingBottom: 120,
  },
  workspaceTablet: {
    flex: 1,
    flexDirection: 'row',
    gap: 16,
    padding: 18,
  },
});
